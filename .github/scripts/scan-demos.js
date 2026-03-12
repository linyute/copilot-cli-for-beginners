#!/usr/bin/env node
/**
 * 掃描章節 README 檔案並擷取 copilot 示範指令
 * 以找到的指令更新 .github/scripts/demos.json
 *
 * 使用方式：npm run scan:demos
 *
 * 若要將某個指令標記為該章節的主要示範，請新增註解：
 *   <!-- demo: chapter-name-demo -->
 *   ```bash
 *   copilot -p "您的指令"
 *   ```
 *
 * 否則它將使用在每個章節中找到的第一個 copilot -p 指令。
 */

const { readFileSync, writeFileSync, readdirSync, existsSync } = require('fs');
const { join } = require('path');

const rootDir = join(__dirname, '..', '..');
const demosJsonPath = join(__dirname, 'demos.json');

// 產生 tape 的預設設定
const defaultSettings = {
  fontSize: 18,
  width: 1000,
  height: 600,
  theme: "Dracula",
  typingSpeed: "60ms",
  framerate: 15,
  startupWait: 5,
  responseWait: 25,
  exitWait: 2
};

// 尋找所有章節目錄 (XX-chapter-name 模式)
function findChapters() {
  return readdirSync(rootDir)
    .filter(name => /^\d{2}-/.test(name))
    .filter(name => existsSync(join(rootDir, name, 'README.md')))
    .sort();
}

// 從 Markdown 內容擷取 copilot 指令
function extractCopilotCommands(content) {
  const commands = [];

  // 先尋找標記的示範：<!-- demo: name -->
  const markedDemoRegex = /<!--\s*demo:\s*([^\s]+)\s*-->\s*```(?:bash|shell)?\s*([\s\S]*?)```/gi;
  let match;
  while ((match = markedDemoRegex.exec(content)) !== null) {
    const name = match[1];
    const codeBlock = match[2].trim();
    const copilotMatch = codeBlock.match(/copilot(?:\s+-p\s+["'](.+?)["']|\s*$)/);
    if (copilotMatch) {
      commands.push({
        name,
        prompt: copilotMatch[1] || null,
        isInteractive: !copilotMatch[1],
        marked: true
      });
    }
  }

  // 如果沒有標記的示範，則尋找所有 copilot -p 指令
  if (commands.length === 0) {
    // 匹配 copilot -p "..." 或 copilot -p '...'
    const programmaticRegex = /copilot\s+-p\s+["']([^"']+)["']/g;
    while ((match = programmaticRegex.exec(content)) !== null) {
      commands.push({
        prompt: match[1],
        isInteractive: false,
        marked: false
      });
    }
  }

  return commands;
}

// 從章節名稱產生示範名稱
function generateDemoName(chapter) {
  // 00-quick-start -> quick-start-demo
  return chapter.replace(/^\d+-/, '') + '-demo';
}

// 從章節標題擷取描述
function extractDescription(content) {
  const titleMatch = content.match(/^#\s+(.+)$/m);
  if (titleMatch) {
    // "Chapter 01: First Steps" -> "First Steps"
    return titleMatch[1].replace(/^Chapter\s+\d+:\s*/, '').trim();
  }
  return 'Demo';
}

// 主程式
console.log('🔍 正在掃描各章節以尋找 copilot 指令...\n');

const chapters = findChapters();
const demos = [];

for (const chapter of chapters) {
  const readmePath = join(rootDir, chapter, 'README.md');
  const content = readFileSync(readmePath, 'utf8');

  const commands = extractCopilotCommands(content);
  const description = extractDescription(content);

  if (commands.length > 0) {
    // 使用第一個 (或有標記的) 指令
    const cmd = commands.find(c => c.marked) || commands[0];
    const demoName = cmd.name || generateDemoName(chapter);

    const demo = {
      chapter,
      name: demoName,
      description: description + ' 示範'
    };

    if (cmd.prompt) {
      demo.prompt = cmd.prompt;
    } else {
      demo.prompt = "你有什麼可以幫我的？請給出簡短總結。";
      demo.note = "互動模式 - 自訂此提示詞";
    }

    demos.push(demo);
    console.log(`  ✓ ${chapter}`);
    console.log(`    └─ "${demo.prompt.substring(0, 60)}${demo.prompt.length > 60 ? '...' : ''}"`);
  } else {
    console.log(`  ⚠ ${chapter} - 找不到 copilot 指令`);
  }
}

// 寫入 demos.json
const output = {
  settings: defaultSettings,
  demos
};

writeFileSync(demosJsonPath, JSON.stringify(output, null, 2) + '\n');

console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`✓ 找到 ${demos.length} 個示範`);
console.log(`✓ 已更新 .github/scripts/demos.json`);
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`\n下一步：`);
console.log(`  1. 檢視/編輯 .github/scripts/demos.json`);
console.log(`  2. npm run create:tapes`);
console.log(`  3. npm run generate:vhs`);
