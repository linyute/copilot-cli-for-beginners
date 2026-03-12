#!/usr/bin/env node
/**
 * 透過檢查最後一個畫面來驗證示範 GIF 是否成功完成。
 *
 * 擷取每個 GIF 的最後一個畫面，透過 tesseract 執行 OCR，並檢查
 * 是否存在已知的失敗/成功模式，以判斷示範是否完成。
 *
 * 使用方式：
 *   npm run verify:gifs              # 檢查所有 GIF
 *   npm run verify:gifs -- --save    # 同時將最後一個畫面的 PNG 儲存至 /tmp/gif-last-frames/
 *
 * 需求：
 *   - ffmpeg + ffprobe: brew install ffmpeg
 *   - tesseract: brew install tesseract
 */

const { execSync } = require('child_process');
const { readdirSync, statSync, existsSync, mkdirSync, rmSync } = require('fs');
const { join, basename, dirname } = require('path');

const rootDir = join(__dirname, '..', '..');
const tmpDir = '/tmp/gif-last-frames';
const saveFrames = process.argv.includes('--save');

// 代表回應被截斷或未完成的模式
const FAILURE_PATTERNS = [
  'operation cancelled by user',
  'ctrl+c again to exit',
  'thinking (esc to cancel',
];

// 代表回應已完成的模式 (正面訊號)
const SUCCESS_PATTERNS = [
  'type @ to mention files',
  'remaining requests',
];

function findGifs(dir) {
  const gifs = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory() && !entry.startsWith('.') && entry !== 'node_modules') {
      const imagesDir = join(fullPath, 'images');
      if (existsSync(imagesDir)) {
        for (const file of readdirSync(imagesDir)) {
          if (file.endsWith('-demo.gif')) {
            gifs.push(join(imagesDir, file));
          }
        }
      }
    }
  }
  return gifs.sort();
}

function getFrameCount(gifPath) {
  try {
    const result = execSync(
      `ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of csv=p=0 "${gifPath}"`,
      { encoding: 'utf8', timeout: 30000 }
    );
    return parseInt(result.trim(), 10);
  } catch {
    return -1;
  }
}

function extractLastFrame(gifPath, outputPath) {
  const frames = getFrameCount(gifPath);
  if (frames <= 0) return false;
  const lastFrame = frames - 1;
  try {
    execSync(
      `ffmpeg -y -i "${gifPath}" -vf "select=eq(n\\,${lastFrame})" -frames:v 1 "${outputPath}" 2>/dev/null`,
      { timeout: 30000 }
    );
    return existsSync(outputPath);
  } catch {
    return false;
  }
}

function extractTextFromFrame(pngPath) {
  const dir = dirname(pngPath);
  const file = basename(pngPath);
  try {
    // tesseract 需要在該檔案的目錄下執行 (macOS 路徑問題)
    const text = execSync(`tesseract "${file}" stdout 2>/dev/null`, {
      encoding: 'utf8', timeout: 15000, cwd: dir
    });
    return text.toLowerCase();
  } catch {
    return '';
  }
}

function checkLastFrame(gifPath) {
  const name = basename(gifPath, '.gif');
  const chapter = basename(join(gifPath, '..', '..'));
  const chNum = chapter.substring(0, 2);
  const pngPath = join(tmpDir, `${chNum}-${name}.png`);

  if (!extractLastFrame(gifPath, pngPath)) {
    return { name: `${chNum}/${name}`, status: 'ERROR', reason: '無法擷取最後一個畫面' };
  }

  const text = extractTextFromFrame(pngPath);

  if (!text.trim()) {
    return { name: `${chNum}/${name}`, status: 'UNKNOWN', reason: 'OCR 未回傳任何文字' };
  }

  // 檢查失敗模式
  for (const pattern of FAILURE_PATTERNS) {
    if (text.includes(pattern)) {
      return { name: `${chNum}/${name}`, status: 'INCOMPLETE', reason: `找到： "${pattern}"` };
    }
  }

  // 檢查 copilot 提示字元 (代表已返回提示字元 = 已完成)
  const hasPrompt = SUCCESS_PATTERNS.some(p => text.includes(p));
  if (hasPrompt) {
    return { name: `${chNum}/${name}`, status: 'OK', reason: '回應已完成' };
  }

  // 有文字但沒有已知的模式 - 可能 OK 但不確定
  return { name: `${chNum}/${name}`, status: 'OK?', reason: '有文字，未偵測到失敗模式' };
}

// 主程式
function main() {
  // 檢查相依性
  try {
    execSync('which tesseract', { encoding: 'utf8' });
  } catch {
    console.error('錯誤：需要 tesseract。請安裝： brew install tesseract');
    process.exit(1);
  }
  try {
    execSync('which ffprobe', { encoding: 'utf8' });
  } catch {
    console.error('錯誤：需要 ffmpeg/ffprobe。請安裝： brew install ffmpeg');
    process.exit(1);
  }

  console.log('🔍 正在驗證示範 GIF...\n');

  // 設定暫存目錄
  if (existsSync(tmpDir)) rmSync(tmpDir, { recursive: true });
  mkdirSync(tmpDir, { recursive: true });

  const gifs = findGifs(rootDir);

  if (gifs.length === 0) {
    console.log('找不到 GIF 檔案');
    process.exit(0);
  }

  console.log(`找到 ${gifs.length} 個 GIF\n`);

  const results = [];
  for (const gif of gifs) {
    const result = checkLastFrame(gif);
    results.push(result);
  }

  // 列印結果表格
  const nameWidth = Math.max(32, ...results.map(r => r.name.length + 2));
  const statusWidth = 14;

  const header = 'GIF'.padEnd(nameWidth) + '狀態'.padEnd(statusWidth) + '細節';
  const separator = '─'.repeat(header.length + 10);

  console.log(separator);
  console.log(header);
  console.log(separator);

  for (const r of results) {
    const icon = r.status === 'OK' ? '✓' :
                 r.status === 'OK?' ? '~' :
                 r.status === 'INCOMPLETE' ? '✗' : '?';
    const statusStr = `${icon} ${r.status}`.padEnd(statusWidth);
    console.log(`${r.name.padEnd(nameWidth)}${statusStr}${r.reason}`);
  }

  console.log(separator);

  const ok = results.filter(r => r.status === 'OK' || r.status === 'OK?').length;
  const incomplete = results.filter(r => r.status === 'INCOMPLETE').length;
  const unknown = results.filter(r => r.status === 'UNKNOWN' || r.status === 'ERROR').length;

  console.log(`\n✓ 已完成： ${ok}  ✗ 未完成： ${incomplete}  ? 未知： ${unknown}`);

  if (incomplete > 0) {
    console.log('\n未完成的 GIF 需要在 .github/scripts/demos.json 中增加 responseWait');
  }

  // 除非有 --save，否則清理暫存
  if (!saveFrames) {
    rmSync(tmpDir, { recursive: true });
  } else {
    console.log(`\n最後一個畫面的 PNG 已儲存至： ${tmpDir}`);
  }

  process.exit(incomplete > 0 ? 1 : 0);
}

main();
