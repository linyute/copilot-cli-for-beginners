#!/usr/bin/env node
/**
 * 從每個示範 GIF 中擷取預覽畫面，以便快速進行視覺檢查。
 * 將個別的 PNG 畫面儲存到 demo-previews/ 目錄。
 *
 * 需求：ffmpeg, gifsicle (用於取得畫面延遲資訊)
 *
 * 使用方式：
 *   node preview-gifs.js                  # 預設：結束前 3 秒
 *   node preview-gifs.js --before 5       # 結束前 5 秒
 */

const { execSync } = require('child_process');
const { readdirSync, existsSync, mkdirSync, rmSync } = require('fs');
const { join, basename } = require('path');

const rootDir = join(__dirname, '..', '..');
const previewDir = join(rootDir, 'demo-previews');

// 解析 CLI 參數
const args = process.argv.slice(2);
let beforeSeconds = 3;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--before' && args[i + 1]) {
    beforeSeconds = parseFloat(args[++i]);
  }
}

// 尋找所有示範 GIF
function findGifs() {
  const gifs = [];
  for (const entry of readdirSync(rootDir)) {
    if (!/^\d{2}-/.test(entry)) continue;
    const imagesDir = join(rootDir, entry, 'images');
    if (!existsSync(imagesDir)) continue;
    for (const file of readdirSync(imagesDir)) {
      if (file.endsWith('-demo.gif')) {
        gifs.push({ path: join(imagesDir, file), chapter: entry });
      }
    }
  }
  return gifs.sort((a, b) => a.path.localeCompare(b.path));
}

// 從 GIF 取得畫面延遲
function getFrameDelays(gifPath) {
  const output = execSync(`gifsicle --info "${gifPath}"`, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
  const delays = [];
  const delayRegex = /delay (\d+(?:\.\d+)?)s/g;
  let match;
  while ((match = delayRegex.exec(output)) !== null) {
    delays.push(parseFloat(match[1]));
  }
  return delays;
}

// 尋找結束前 N 秒的畫面索引
function frameAtSecondsBeforeEnd(delays, seconds) {
  const totalTime = delays.reduce((a, b) => a + b, 0);
  const targetTime = totalTime - seconds;
  if (targetTime <= 0) return 0;

  let cumulative = 0;
  for (let i = 0; i < delays.length; i++) {
    cumulative += delays[i];
    if (cumulative >= targetTime) return i;
  }
  return delays.length - 1;
}

// 主程式
if (existsSync(previewDir)) rmSync(previewDir, { recursive: true });
mkdirSync(previewDir, { recursive: true });

const gifs = findGifs();
if (gifs.length === 0) {
  console.log('找不到示範 GIF');
  process.exit(0);
}

console.log(`\n正在從 ${gifs.length} 個 GIF 中擷取畫面 (結束前 ${beforeSeconds} 秒)...\n`);

let count = 0;
for (const { path: gif, chapter } of gifs) {
  const name = basename(gif, '.gif');
  const delays = getFrameDelays(gif);
  const frameIndex = frameAtSecondsBeforeEnd(delays, beforeSeconds);
  const prefix = chapter.replace(/^(\d+)-.+/, '$1');
  const outName = `${prefix}-${name}.png`;
  const outPath = join(previewDir, outName);

  try {
    execSync(
      `ffmpeg -y -i "${gif}" -vf "select=eq(n\\,${frameIndex})" -vframes 1 -update 1 "${outPath}" 2>/dev/null`,
      { stdio: 'pipe' }
    );
    console.log(`  ✓ ${outName} (畫面 #${frameIndex}/${delays.length})`);
    count++;
  } catch (e) {
    console.log(`  ✗ ${name}：擷取失敗`);
  }
}

console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`✓ 已將 ${count} 個預覽畫面儲存至 demo-previews/`);
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`\n在 Finder 中開啟：open demo-previews/`);
