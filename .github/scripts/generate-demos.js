#!/usr/bin/env node
/**
 * 從 .tape 檔案產生課程示範 GIF
 *
 * 此腳本會尋找 [chapter]/images/ 資料夾中所有的 .tape 檔案，並執行 VHS
 * 來產生 GIF。VHS 在專案根目錄執行，以便提示詞中的 @file 參考
 * 能正確解析。
 *
 * 使用方式：
 *   npm run generate:vhs                          # 所有章節，5 個並行
 *   npm run generate:vhs -- --chapter 03          # 僅第 03 章
 *   npm run generate:vhs -- --chapter 03 --chapter 05
 *   npm run generate:vhs -- --file path/to/demo.tape  # 單一 tape 檔案
 *   npm run generate:vhs -- --concurrency 3       # 限制一次 3 個
 *
 * 需求：
 *   - VHS: brew install vhs
 */

const { exec, execSync } = require('child_process');
const { readdirSync, statSync, existsSync, readFileSync, renameSync, writeFileSync, chmodSync, mkdirSync, rmSync } = require('fs');
const { join, relative, dirname } = require('path');

const rootDir = join(__dirname, '..', '..');
const homeDir = require('os').homedir();
const copilotConfigPath = join(homeDir, '.copilot', 'config.json');
// 個人代理存放在 ~/.copilot/agents 和 ~/.claude/agents
const personalAgentsDirs = [
  { dir: join(homeDir, '.copilot', 'agents'), backup: join(homeDir, '.copilot', 'agents.recording-bak') },
  { dir: join(homeDir, '.claude', 'agents'), backup: join(homeDir, '.claude', 'agents.recording-bak') }
];

// 確保啟用了串流模式 (streamer mode)，以便錄製時不會顯示模型名稱或配額
function enableStreamerMode() {
  try {
    const config = JSON.parse(readFileSync(copilotConfigPath, 'utf8'));
    const wasOn = config.streamer_mode || false;
    config.streamer_mode = true;
    delete config.on_air_mode;
    writeFileSync(copilotConfigPath, JSON.stringify(config, null, 2) + '\n');
    console.log(`🔴 串流模式：${wasOn ? '已啟用' : '啟用中'}`);
    return { wasOn };
  } catch (e) {
    console.warn('⚠ 無法讀取 copilot 設定，串流模式未驗證');
    return null;
  }
}

// 將串流模式還原至其原始狀態
function restoreStreamerMode(state) {
  if (state && !state.wasOn) {
    try {
      const config = JSON.parse(readFileSync(copilotConfigPath, 'utf8'));
      config.streamer_mode = false;
      writeFileSync(copilotConfigPath, JSON.stringify(config, null, 2) + '\n');
      console.log('🔴 串流模式：已還原為關閉');
    } catch (e) { /* 忽略 */ }
  }
}

// 隱藏個人代理，讓 /agent 選擇器中僅顯示課程代理
function hidePersonalAgents() {
  const hidden = [];
  for (const { dir, backup } of personalAgentsDirs) {
    try {
      // 還原先前中斷執行留下的舊備份
      if (!existsSync(dir) && existsSync(backup)) {
        renameSync(backup, dir);
        console.log(`👤 已還原舊備份：${backup}`);
      }
      if (existsSync(dir)) {
        renameSync(dir, backup);
        hidden.push({ dir, backup });
      }
    } catch (e) {
      console.warn(`⚠ 無法隱藏 ${dir}：`, e.message);
    }
  }
  if (hidden.length > 0) {
    console.log(`👤 個人代理：已隱藏 (${hidden.length} 個位置)`);
  }
  return hidden;
}

// 將個人代理還原至其原始位置
function restorePersonalAgents(hidden) {
  if (!hidden || hidden.length === 0) return;
  for (const { dir, backup } of hidden) {
    try {
      if (existsSync(backup)) {
        // Copilot 可能在錄製期間重新建立代理目錄 - 先將其移除
        if (existsSync(dir)) {
          rmSync(dir, { recursive: true });
        }
        renameSync(backup, dir);
      }
    } catch (e) {
      console.warn(`⚠ 無法還原 ${dir}：`, e.message);
      console.warn(`  手動修復：mv "${backup}" "${dir}"`);
    }
  }
  console.log(`👤 個人代理：已還原 (${hidden.length} 個位置)`);
}

// 解析 CLI 參數
const args = process.argv.slice(2);
const chapters = [];
const files = [];
let concurrency = 5;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--chapter' && args[i + 1]) {
    chapters.push(args[++i]);
  } else if (args[i] === '--file' && args[i + 1]) {
    files.push(args[++i]);
  } else if (args[i] === '--concurrency' && args[i + 1]) {
    concurrency = parseInt(args[++i], 10);
  }
}

// 建立一個注入 --yolo 和 --allow-all-paths 的包裝腳本 (wrapper script)，
// 讓 copilot 能以非互動方式執行。tape 僅輸入 "copilot" 以保持錄製畫面簡潔，
// 但包裝腳本會在幕後增加旗標。
const wrapperDir = join(rootDir, '.vhs-wrapper');
function setupCopilotWrapper() {
  const realCopilot = execSync('which copilot', { encoding: 'utf8' }).trim();
  mkdirSync(wrapperDir, { recursive: true });
  const wrapperPath = join(wrapperDir, 'copilot');
  writeFileSync(wrapperPath, `#!/bin/bash\nexec "${realCopilot}" --yolo --allow-all-paths "$@"\n`);
  chmodSync(wrapperPath, '755');
  return `${wrapperDir}:${process.env.PATH}`;
}

function cleanupCopilotWrapper() {
  try { rmSync(wrapperDir, { recursive: true }); } catch (e) { /* 忽略 */ }
}

// 尋找 [chapter]/images/ 資料夾中所有的 .tape 檔案
function findTapeFiles(dir, chapterFilter) {
  const tapeFiles = [];

  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory() && !entry.startsWith('.') && entry !== 'node_modules') {
      // 如果有指定章節過濾，則套用
      if (chapterFilter.length > 0) {
        const matches = chapterFilter.some(ch => entry.startsWith(ch) || entry.includes(ch));
        if (!matches) continue;
      }

      const imagesDir = join(fullPath, 'images');
      if (existsSync(imagesDir)) {
        try {
          const imagesEntries = readdirSync(imagesDir);
          for (const file of imagesEntries) {
            if (file.endsWith('.tape')) {
              tapeFiles.push(join(imagesDir, file));
            }
          }
        } catch (e) {
          // 無法讀取圖片資料夾，跳過
        }
      }
    }
  }

  return tapeFiles;
}

// 從 tape 檔案中擷取輸出檔名
function getOutputFilename(tapeFilePath) {
  const content = readFileSync(tapeFilePath, 'utf8');
  const match = content.match(/^Output\s+(\S+)/m);
  return match ? match[1] : null;
}

// 執行單一 VHS 錄製並回傳 Promise
function runVhs(tapeFile, wrappedPath) {
  const relativePath = relative(rootDir, tapeFile);
  const imagesDir = dirname(tapeFile);
  const outputFilename = getOutputFilename(tapeFile);

  return new Promise((resolve) => {
    const startTime = Date.now();

    exec(`vhs ${relativePath}`, {
      cwd: rootDir,
      timeout: 600000,
      env: { ...process.env, PATH: wrappedPath }
    }, (error) => {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);

      // 如果 GIF 已建立，不論 VHS 退出是否為零，一律移動 GIF
      let gifCreated = false;
      if (outputFilename) {
        const generatedPath = join(rootDir, outputFilename);
        const targetPath = join(imagesDir, outputFilename);
        if (existsSync(generatedPath) && generatedPath !== targetPath) {
          renameSync(generatedPath, targetPath);
          gifCreated = true;
        }
      }

      if (error && !gifCreated) {
        console.log(`  ✗ ${relativePath} (${elapsed}s) - ${error.message}`);
        resolve({ success: false, path: relativePath });
        return;
      }

      console.log(`  ✓ ${relativePath} (${elapsed}s)`);
      resolve({ success: true, path: relativePath });
    });
  });
}

// 以並行限制執行工作
async function runWithConcurrency(tasks, limit) {
  const results = [];
  const executing = new Set();

  for (const task of tasks) {
    const promise = task().then(result => {
      executing.delete(promise);
      return result;
    });
    executing.add(promise);
    results.push(promise);

    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }

  return Promise.all(results);
}

// 主程式
async function main() {
  console.log('🎬 正在產生課程示範...\n');

  if (files.length > 0) {
    console.log(`檔案：${files.join(', ')}`);
  } else if (chapters.length > 0) {
    console.log(`章節：${chapters.join(', ')}`);
  }
  console.log(`並行數：${concurrency}`);
  console.log('');

  // 錄製前啟用串流模式並隱藏個人代理
  const streamerState = enableStreamerMode();
  const agentsWereHidden = hidePersonalAgents();
  console.log('');

  // 解析 tape 檔案：明確的 --file 路徑優先於章節掃描
  let tapeFiles;
  if (files.length > 0) {
    const { resolve } = require('path');
    tapeFiles = files.map(f => resolve(rootDir, f)).filter(f => {
      if (!existsSync(f)) {
        console.log(`  ⚠ 找不到檔案：${f}`);
        return false;
      }
      return true;
    });
  } else {
    tapeFiles = findTapeFiles(rootDir, chapters);
  }

  if (tapeFiles.length === 0) {
    console.log('找不到 .tape 檔案');
    process.exit(0);
  }

  console.log(`找到 ${tapeFiles.length} 個 tape 檔案：\n`);
  tapeFiles.forEach(f => console.log('  - ' + relative(rootDir, f)));
  console.log('');

  // 設定 copilot 包裝，以便透明地注入 --yolo
  const wrappedPath = setupCopilotWrapper();
  console.log('Copilot 包裝：已透過 PATH 注入 --yolo');
  console.log(`正在錄製 ${tapeFiles.length} 個示範 (一次 ${concurrency} 個)...\n`);

  const startTime = Date.now();

  // 建立工作函式
  const tasks = tapeFiles.map(tapeFile => () => runVhs(tapeFile, wrappedPath));

  // 以並行限制執行
  const results = await runWithConcurrency(tasks, concurrency);

  cleanupCopilotWrapper();
  restorePersonalAgents(agentsWereHidden);
  restoreStreamerMode(streamerState);

  const succeeded = results.filter(r => r.success).length;
  const failedResults = results.filter(r => !r.success);
  const totalTime = ((Date.now() - startTime) / 1000).toFixed(0);

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`✓ 成功：${succeeded}`);
  if (failedResults.length > 0) {
    console.log(`✗ 失敗：${failedResults.length}`);
    failedResults.forEach(r => console.log(`  - ${r.path}`));
  }
  console.log(`⏱ 總計：${totalTime}s`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
}

main().catch(e => {
  console.error(e);
  cleanupCopilotWrapper();
  restorePersonalAgents(personalAgentsDirs); // 發生錯誤時一律嘗試還原
  restoreStreamerMode({ wasOn: false });
  process.exit(1);
});
