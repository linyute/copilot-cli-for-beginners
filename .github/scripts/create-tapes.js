#!/usr/bin/env node
/**
 * 從 demos.json 設定產生 .tape 檔案
 *
 * 支援單一提示詞與多提示詞示範：
 *   - "prompt": "文字"              → 單一提示詞
 *   - "prompts": ["a", "b"]         → 多提示詞 (每個預設為 responseWait)
 *   - "prompts": [{ "text": "a", "responseWait": 10 }, "b"]  → 混合覆寫
 *
 * 使用方式：npm run create:tapes
 */

const { writeFileSync, mkdirSync, existsSync } = require('fs');
const { join } = require('path');

const rootDir = join(__dirname, '..', '..');
const config = require('./demos.json');

function generatePromptBlock(entry, defaultWait, index) {
  const text = typeof entry === 'string' ? entry : entry.text;
  const wait = (typeof entry === 'object' && entry.responseWait) || defaultWait;
  const agentSelect = typeof entry === 'object' && entry.agentSelect;
  const label = index != null ? `提示詞 ${index + 1}` : '執行提示詞';

  // 代理選擇：輸入 /agent，等待選擇器，向下鍵到代理，選擇
  if (agentSelect) {
    const arrowDown = (typeof entry === 'object' && entry.arrowDown) || 0;
    const arrowBlock = arrowDown > 0 ? `向下 ${arrowDown}\nSleep 1s\n` : '';
    return `# ${label} - 選擇 ${agentSelect} 代理
Type "${text}"
Sleep 1s
Enter

# 等待代理選擇器
Sleep 3s
${arrowBlock}Enter

# 等待代理載入
Sleep ${wait}s`;
  }

  // 如果提示詞以檔案參考 (@path) 結尾，則會開啟檔案選擇器。
  // 在提交提示詞之前，需要額外的 Enter 來選擇檔案。
  const endsWithFileRef = /@\S+$/.test(text);
  const enterBlock = endsWithFileRef
    ? 'Enter\nSleep 1s\nEnter'
    : 'Enter';

  // VHS Type 指令必須是單行；分割多行提示詞
  const lines = text.split('\n');
  let typeBlock;
  if (lines.length > 1) {
    typeBlock = lines
      .map((line, i) => i < lines.length - 1 ? `Type "${line}"\nEnter` : `Type "${line}"`)
      .join('\n');
  } else {
    typeBlock = `Type "${text}"`;
  }

  // 將回應等待分解成區塊，並帶有定期的隱藏觸發 (hidden nudges)。
  // 隱藏的 空格+退格 會強制 copilot 的 TUI 捲動到輸入區域。
  const nudgeInterval = 3;
  let waitBlock = '';
  let remaining = wait;
  while (remaining > nudgeInterval) {
    waitBlock += `Sleep ${nudgeInterval}s\nHide\nType " "\nBackspace\nShow\n`;
    remaining -= nudgeInterval;
  }
  if (remaining > 0) {
    waitBlock += `Sleep ${remaining}s`;
  }

  return `# ${label}
${typeBlock}
Sleep 2s
${enterBlock}

# 等待回應 (帶有定期的觸發以保持輸入可見)
${waitBlock}`;
}

function generateTapeContent(demo, settings) {
  const s = { ...settings, ...demo }; // 允許每個示範進行覆寫

  // 從 "prompt" (單一) 或 "prompts" (陣列) 建立提示詞區塊
  let promptBlocks;
  if (demo.prompts && Array.isArray(demo.prompts)) {
    promptBlocks = demo.prompts
      .map((entry, i) => generatePromptBlock(entry, s.responseWait, i))
      .join('\n\n');
  } else {
    promptBlocks = generatePromptBlock(demo.prompt, s.responseWait);
  }

  return `# ${demo.chapter}: ${demo.description}
# 從 demos.json 自動產生 - 真實 copilot 執行

Output ${demo.name}.gif

Set FontSize ${s.fontSize}
Set Width ${s.width}
Set Height ${s.height}
Set Theme "${s.theme}"
Set Padding 20
Set BorderRadius 8
Set Margin 10
Set MarginFill "#282a36"
Set Framerate ${s.framerate}

# 人類打字速度
Set TypingSpeed ${s.typingSpeed}

# 啟動 copilot
Type "copilot"
Enter

# 等待 copilot 啟動
Sleep ${s.startupWait}s

${promptBlocks}

# 觸發 TUI 以捲動到輸入區域
Type " "
Backspace
Sleep ${s.exitWait}s

# 乾淨退出
Ctrl+C
Sleep 1s
`;
}

// 主程式
console.log('📝 正在從 demos.json 建立 tape 檔案...\n');

let created = 0;

for (const demo of config.demos) {
  const imagesDir = join(rootDir, demo.chapter, 'images');
  const tapePath = join(imagesDir, `${demo.name}.tape`);

  // 確保圖片目錄存在
  if (!existsSync(imagesDir)) {
    mkdirSync(imagesDir, { recursive: true });
    console.log(`  已建立：${demo.chapter}/images/`);
  }

  // 產生 tape 內容
  const content = generateTapeContent(demo, config.settings);

  // 寫入 tape 檔案
  writeFileSync(tapePath, content);
  console.log(`  ✓ ${demo.chapter}/images/${demo.name}.tape`);
  created++;
}

console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`✓ 已建立 ${created} 個 tape 檔案`);
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`\n下一步：npm run generate:vhs`);
