#!/usr/bin/env node
/**
 * 複製 CSE 內容引擎所需的課程內容子集。
 *
 * 用法：
 *   npm run copy:content-engine
 *
 * 選用：
 *   CONTENT_ENGINE_DESTINATION_ROOT=/path/to/cse-content-engine/content/learning-pathways/copilot-cli-for-beginners npm run copy:content-engine
 */

const {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} = require('fs');
const { dirname, join, relative, resolve } = require('path');

const sourceRoot = process.cwd();
const defaultDestinationRoot = resolve(
  sourceRoot,
  '../cse-content-engine/content/learning-pathways/copilot-cli-for-beginners',
);
const destinationRoot = resolve(process.env.CONTENT_ENGINE_DESTINATION_ROOT || defaultDestinationRoot);
const destinationParent = dirname(destinationRoot);
const contentEngineSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    aliases: {
      type: 'array',
      description: '重新導向至此項目的相對路徑',
      items: {
        type: 'string',
        description: '重新導向至此項目的相對路徑',
      },
    },
    audience: {
      type: 'string',
      description: '此指南的目標對象',
    },
    description: {
      type: 'string',
      description: '此項目的簡短說明',
    },
    icon: {
      type: 'string',
      description: '代表此項目的圖示',
    },
    id: {
      type: 'string',
      description: '此指南的唯一識別碼',
    },
    params: {
      type: 'object',
      description: '不影響呈現的彈性參數',
    },
    slug: {
      type: 'string',
      description: 'kebab-case 識別碼',
    },
    title: {
      type: 'string',
      description: '此項目的顯示名稱',
    },
    weight: {
      type: 'integer',
      description: '顯示此項目的順序',
    },
  },
  required: ['title', 'description', 'weight'],
  additionalProperties: true,
};

function log(message) {
  console.log(`  ${message}`);
}

function fail(message) {
  console.error(`\nError: ${message}`);
  process.exit(1);
}

function ensureSafeDestination() {
  if (!existsSync(destinationParent)) {
    fail(`目的端父目錄不存在：${destinationParent}`);
  }

  const resolvedSource = resolve(sourceRoot);
  const resolvedDestination = resolve(destinationRoot);

  if (resolvedSource === resolvedDestination) {
    fail('目的端不能是來源儲存庫根目錄。');
  }

  if (resolvedDestination.startsWith(`${resolvedSource}/`)) {
    fail('目的端不能在來源儲存庫內。');
  }
}

function resetDestination() {
  rmSync(destinationRoot, { recursive: true, force: true });
  log(`已清除 ${destinationRoot}`);
}

function copyFile(sourcePath, destinationPath) {
  mkdirSync(dirname(destinationPath), { recursive: true });

  if (sourcePath.endsWith('.md')) {
    writeFileSync(destinationPath, prepareMarkdownForContentEngine(sourcePath), 'utf8');
  } else {
    cpSync(sourcePath, destinationPath);
  }

  log(`已複製 ${relative(sourceRoot, sourcePath)} -> ${relative(destinationRoot, destinationPath)}`);
}

function prepareMarkdownForContentEngine(sourcePath) {
  const markdown = readFileSync(sourcePath, 'utf8');
  const frontmatter = getMarkdownFrontmatter(markdown);

  if (!frontmatter) {
    return markdown;
  }

  return markdown.replace(/^<!--\r?\n---\r?\n[\s\S]*?\r?\n---\r?\n-->\r?\n*/, `---\n${frontmatter}\n---\n\n`);
}

function getMarkdownFrontmatter(markdown) {
  const hiddenFrontmatter = markdown.match(/^<!--\r?\n---\r?\n([\s\S]*?)\r?\n---\r?\n-->/)?.[1];
  const visibleFrontmatter = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];

  return (hiddenFrontmatter ?? visibleFrontmatter)?.replace(/\r\n/g, '\n');
}

// 取得 frontmatter 欄位
function getFrontmatterField(frontmatter, field) {
  return frontmatter.match(new RegExp(`^${field}:.*$`, 'm'))?.[0];
}

function writeIndexFromReadme(sourceReadmePath, destinationDirectory, extraFields = []) {
  const markdown = readFileSync(sourceReadmePath, 'utf8');
  const frontmatter = getMarkdownFrontmatter(markdown);

  if (!frontmatter) {
    fail(`無法建立 index.yml，因為 ${relative(sourceRoot, sourceReadmePath)} 沒有 frontmatter。`);
  }

  const indexFields = ['title', 'description', 'slug', 'weight', 'icon']
    .map((field) => getFrontmatterField(frontmatter, field))
    .filter(Boolean);
  indexFields.push(...extraFields);

  if (indexFields.length === 0) {
    fail(`無法建立 index.yml，因為 ${relative(sourceRoot, sourceReadmePath)} 沒有 index metadata。`);
  }

  mkdirSync(destinationDirectory, { recursive: true });
  writeFileSync(join(destinationDirectory, 'index.yml'), `${indexFields.join('\n')}\n`, 'utf8');
  log(`已產生 ${relative(destinationRoot, join(destinationDirectory, 'index.yml'))}`);
}

function writeContentEngineSchema() {
  const destinationPath = join(destinationRoot, 'schema.json');
  writeFileSync(destinationPath, `${JSON.stringify(contentEngineSchema, null, 2)}\n`, 'utf8');
  log(`已產生 ${relative(destinationRoot, destinationPath)}`);
}

function copyDirectory(sourcePath, destinationPath) {
  if (!existsSync(sourcePath)) {
    fail(`需要的目錄不存在：${relative(sourceRoot, sourcePath)}`);
  }

  cpSync(sourcePath, destinationPath, { recursive: true });
  log(`已複製 ${relative(sourceRoot, sourcePath)}/ -> ${relative(destinationRoot, destinationPath)}/`);
}

// 取得章節資料夾
function getChapterFolders() {
  return readdirSync(sourceRoot)
    .filter((entry) => /^0[0-7]-/.test(entry))
    .filter((entry) => statSync(join(sourceRoot, entry)).isDirectory())
    .sort();
}

function stripFragmentAndQuery(target) {
  return target.split('#')[0].split('?')[0];
}

function isExternalLink(target) {
  return /^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith('//') || target.startsWith('#');
}

function getChapterLocalMarkdownLinks(chapterPath) {
  const readmePath = join(chapterPath, 'README.md');
  const readme = readFileSync(readmePath, 'utf8');
  const links = new Set();
  const patterns = [
    /\[[^\]]+\]\(([^)\s]+\.md(?:#[^)]+)?)(?:\s+"[^"]*")?\)/gi,
    /<a\b[^>]*\bhref=["']([^"']+\.md(?:#[^"']+)?)["']/gi,
  ];

  for (const pattern of patterns) {
    for (const match of readme.matchAll(pattern)) {
      const target = stripFragmentAndQuery(match[1]);
      if (!target || isExternalLink(target)) {
        continue;
      }

      const resolvedTarget = resolve(chapterPath, target);
      if (dirname(resolvedTarget) === resolve(chapterPath) && resolvedTarget !== resolve(readmePath)) {
        links.add(resolvedTarget);
      }
    }
  }

  return [...links].sort();
}

function copyAppendices() {
  const sourceAppendices = join(sourceRoot, 'appendices');
  const destinationAppendices = join(destinationRoot, 'appendices');

  if (!existsSync(sourceAppendices)) {
    fail('需要的 appendices 目錄不存在。');
  }

  writeIndexFromReadme(join(sourceAppendices, 'README.md'), destinationAppendices);

  for (const markdownFile of findMarkdownFiles(sourceAppendices)) {
    copyFile(markdownFile, join(destinationAppendices, relative(sourceAppendices, markdownFile)));
  }
}

function copyCourseContent() {
  console.log(`正在將課程內容覆蓋至：\n${destinationRoot}\n`);

  mkdirSync(destinationRoot, { recursive: true });

  copyFile(join(sourceRoot, 'README.md'), join(destinationRoot, 'README.md'));
  writeContentEngineSchema();
  writeIndexFromReadme(join(sourceRoot, 'README.md'), destinationRoot, ['icon: CopilotIcon']);
  copyDirectory(join(sourceRoot, 'assets'), join(destinationRoot, 'assets'));

  for (const chapterFolder of getChapterFolders()) {
    const sourceChapter = join(sourceRoot, chapterFolder);
    const destinationChapter = join(destinationRoot, chapterFolder);

    mkdirSync(destinationChapter, { recursive: true });
    copyFile(join(sourceChapter, 'README.md'), join(destinationChapter, 'README.md'));
    writeIndexFromReadme(join(sourceChapter, 'README.md'), destinationChapter);
    copyDirectory(join(sourceChapter, 'assets'), join(destinationChapter, 'assets'));

    for (const linkedMarkdown of getChapterLocalMarkdownLinks(sourceChapter)) {
      copyFile(linkedMarkdown, join(destinationChapter, relative(sourceChapter, linkedMarkdown)));
    }
  }

  copyAppendices();
}

function findMarkdownFiles(directory) {
  const files = [];

  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);
    const stat = statSync(path);

    if (stat.isDirectory()) {
      files.push(...findMarkdownFiles(path));
    } else if (entry.endsWith('.md')) {
      files.push(path);
    }
  }

  return files;
}

function validateMarkdownImagePaths() {
  const imagePatterns = [
    /!\[[^\]]*]\(([^)\s]+)(?:\s+"[^"]*")?\)/g,
    /<img\b[^>]*\bsrc=["']([^"']+)["']/gi,
  ];
  const brokenLinks = [];

  for (const markdownFile of findMarkdownFiles(destinationRoot)) {
    const markdown = readFileSync(markdownFile, 'utf8');

    for (const pattern of imagePatterns) {
      for (const match of markdown.matchAll(pattern)) {
        const target = stripFragmentAndQuery(match[1]);
        if (!target || isExternalLink(target)) {
          continue;
        }

        const resolvedTarget = target.startsWith('/')
          ? join(destinationRoot, target.slice(1))
          : resolve(dirname(markdownFile), target);

        if (!existsSync(resolvedTarget)) {
          const line = markdown.slice(0, match.index).split('\n').length;
          brokenLinks.push(`${relative(destinationRoot, markdownFile)}:${line} -> ${target}`);
        }
      }
    }
  }

  if (brokenLinks.length > 0) {
    fail(`複製的 Markdown 圖片參照損壞：\n${brokenLinks.join('\n')}`);
  }

  console.log('\n驗證通過：所有複製的 Markdown 圖片參照皆已解析。');
}

function validateMarkdownFrontmatter() {
  const requiredFields = contentEngineSchema.required ?? [];
  const missingFrontmatter = [];

  for (const markdownFile of findMarkdownFiles(destinationRoot)) {
    const markdown = readFileSync(markdownFile, 'utf8');
    const frontmatter = markdown.match(/^---\n([\s\S]*?)\n---\n/)?.[1];
    const relativePath = relative(destinationRoot, markdownFile);

    if (!frontmatter) {
      missingFrontmatter.push(`${relativePath}: 遺失 frontmatter`);
      continue;
    }

    const missingFields = requiredFields.filter(
      (field) => !new RegExp(`^${field}:`, 'm').test(frontmatter),
    );

    if (missingFields.length > 0) {
      missingFrontmatter.push(`${relativePath}: 遺失 ${missingFields.join(', ')}`);
    }
  }

  if (missingFrontmatter.length > 0) {
    fail(`複製的 Markdown frontmatter 不符合 schema 需求：\n${missingFrontmatter.join('\n')}`);
  }

  console.log('驗證通過：複製的 Markdown frontmatter 包含必要的 schema 欄位。');
}

ensureSafeDestination();
resetDestination();
copyCourseContent();
validateMarkdownFrontmatter();
validateMarkdownImagePaths();
console.log('\n完成。');
