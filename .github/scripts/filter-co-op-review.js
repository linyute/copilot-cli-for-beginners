#!/usr/bin/env node

// 執行 `co-op-review` 並對其結果進行後置篩選，以便工作流程只在
// 真正的錯誤上失敗。
//
// 存在此檔案的原因：`translate` 指令與 `co-op-review` 指令隨附了
// *不同* 的排除清單。`translate` 會跳過 `.github/**` (它在
// Co-op Translator 的 EXCLUDED_DIRS 中)，因此這些檔案絕不會被翻譯。
// 但 `co-op-review` 並沒有排除 `.github/**`，因此它會將每個
// 未翻譯的來源檔案回報為 "遺失翻譯檔案" 錯誤並導致建構失敗。
// 對於此儲存庫刻意保持未翻譯的路徑，這些錯誤是誤報。
// 該檢視 CLI 未提供擴充其排除條件的方法，
// 因此我們在此處捨棄排除路徑下的結果，並僅針對其餘部分回報失敗。

const { spawnSync } = require("child_process");

// 刻意從翻譯中排除的來源路徑。請保持此處與
// .github/workflows/co-op-translator.yml 中的排除項目以及
// .github/workflows/translation-polisher.md 中的指引同步。
const EXCLUDED_PREFIXES = [".github/", "samples/"];

const languages = process.argv
  .slice(2)
  .flatMap((value) => value.split(/\s+/))
  .map((value) => value.trim())
  .filter(Boolean);

if (languages.length === 0) {
  console.error("用法: node .github/scripts/filter-co-op-review.js <language-codes>");
  process.exit(1);
}

const result = spawnSync(
  "co-op-review",
  ["-l", languages.join(" "), "--format", "github"],
  { encoding: "utf8" }
);

if (result.error && result.error.code === "ENOENT") {
  console.log("已安裝的 Co-op Translator 套件中不提供 co-op-review；跳過。");
  process.exit(0);
}

const report = result.stdout || "";
const stderr = result.stderr || "";

// 始終在工作記錄中顯示完整報告 (以及在可用時顯示摘要)。
if (report.trim()) {
  console.log(report.trimEnd());
}
if (process.env.GITHUB_STEP_SUMMARY && report.trim()) {
  try {
    require("fs").appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${report.trimEnd()}\n`);
  } catch (err) {
    console.error(`無法將檢視報告寫入步驟摘要：${err.message}`);
  }
}

const isExcluded = (filePath) =>
  EXCLUDED_PREFIXES.some((prefix) => filePath.startsWith(prefix));

const genuineErrors = [];
const ignoredErrors = [];

for (const line of report.split("\n")) {
  if (!line.trimStart().startsWith("|")) {
    continue;
  }
  const cells = line.split("|").map((cell) => cell.trim());
  // cells[0] 是前導管道符號前的空字串。
  const severity = (cells[1] || "").toLowerCase();
  if (severity !== "error" && severity !== "warning") {
    continue; // 跳過指標表、標頭和分隔線列。
  }
  if (severity !== "error") {
    continue; // 只有錯誤會導致建構失敗；警告僅供參考。
  }
  const filePath = (cells[4] || "").replace(/`/g, "").trim();
  if (isExcluded(filePath)) {
    ignoredErrors.push(filePath);
  } else {
    genuineErrors.push({ filePath, message: cells[5] || "" });
  }
}

if (ignoredErrors.length > 0) {
  console.log(
    `\n已忽略刻意未翻譯路徑的 ${ignoredErrors.length} 個預期結果 ` +
      `(${EXCLUDED_PREFIXES.join(", ")}).`
  );
}

if (genuineErrors.length > 0) {
  console.error(`\nco-op-review 發現 ${genuineErrors.length} 個真實錯誤：`);
  for (const { filePath, message } of genuineErrors) {
    console.error(`  - ${filePath}: ${message}`);
  }
  if (stderr.trim()) {
    console.error(stderr.trimEnd());
  }
  process.exit(1);
}

console.log("\nco-op-review 通過 (無真實錯誤)。");
process.exit(0);
