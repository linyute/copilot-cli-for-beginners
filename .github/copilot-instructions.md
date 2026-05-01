# Copilot 指引

這些指引用於在本儲存庫中協助 GitHub Copilot 的工作。

## 專案背景

這是一門以新手為導向的教學課程，教學內容為 GitHub Copilot CLI。儲存庫包含章節的 Markdown（00–07）、Python/C#/JavaScript 範例應用程式，以及支援資產（圖片、示範 GIF、術語表）。這不是軟體產品，而是技術教材。

## 寫作慣例

- **讀者**：無 AI/ML 經驗的新手。首次出現時解釋所有技術術語。
- **語氣**：友善、鼓勵、實務取向。避免未說明的術語。
- **範例**：所有程式碼區塊與 `copilot` 指令必須可直接複製貼上。上傳前請先以頭腦模擬測試可行性。
- **命名**：對於會議名稱、檔名與識別符號使用 kebab-case（例如 `book-app-review`，不要使用 `book app review`）。
- **指令語法**：統一旗標格式 — 需要值時使用 `--flag=value`，布林旗標使用 `--flag`。
- **精準度**：不要過度指定可能因 shell 或作業系統而異的工具行為；描述使用者會看到的結果，而非實作細節。
- **退路**：當提到工具版本需求（例如 `gh` CLI 版本）時，務必包含升級說明或手動替代方案。

## 內容慣例（來自 PR 審查範例）

這些模式來自實際的 PR 審查回饋，代表常見的維護者期望：

- 顯示多步驟工作流程時，務必包含所有先決步驟（例如：在 `git diff --staged` 之前先執行 `git add`）。
- 在以範例介紹概念時，於整節中使用一致命名——不要混合 kebab-case 與加引號的命名方式。
- 在描述指令行為時，對齊官方釋出說明中的細節層級——不要陳述可能因環境而異的行為。
- 若某功能需要最低工具版本，請同時說明該版本與無法升級時的替代方式。

## 範例程式碼慣例

- **主要範例**：章節中的範例皆以 `samples/book-app-project/`（Python）為主。
- **測試框架**：pytest — 測試檔位於 `samples/book-app-project/tests/`，檔名以 `test_*.py` 命名。
- **Python 版本**：3.10+（參照 `samples/book-app-project/pyproject.toml`）。
- **刻意錯誤**：`samples/book-app-buggy/` 與 `samples/buggy-code/` 中的檔案含有刻意設計的錯誤以供練習，請勿修正。

## 章節結構

每個章節（00–07）在其 `README.md` 中遵循相同模式：

1. 生活中的類比
2. 核心概念
3. 實作範例
4. 作業
5. 下一步

編輯或新增章節內容時，請勿偏離此結構。

## Markdown 格式

- 使用標準的 GitHub-Flavored Markdown。
- 圖片放在儲存庫根目錄的 `images/` 目錄。
- 跨章節參照使用相對連結（例如：`../03-development-workflows/README.md`）。
- 標題中鼓勵使用表情符號（與既有風格一致）。

## 維護矩陣

| 變更項目 | 需更新檔案 |
|---|---|
| 新增章節 | `README.md`（課程目錄）、`AGENTS.md`（結構表）、`images/learning-path.png` |
| 更新章節內容 | 該章節的 `README.md`，並確認相鄰章節的交叉參照 |
| 新增樣本應用變體 | `AGENTS.md`（結構表）、`samples/` 目錄、相關章節參照 |
| 樣本應用程式碼變更 | `samples/book-app-project/tests/`（更新/新增測試）、引用該程式碼的章節 |
| 在 buggy 樣本加入刻意錯誤 | 僅限 `samples/book-app-buggy/` 或 `samples/buggy-code/` — 不要更新測試 |
| 新增技能 | `.github/skills/{skill-name}/SKILL.md`、`samples/skills/`（範例複本）、第 05 章 |
| 新增代理範本 | `samples/agents/`、第 04 章 |
| 新增 MCP 設定 | `samples/mcp-configs/`、第 06 章 |
| 術語表新增條目 | `GLOSSARY.md` — 依字母順序加入定義 |
| npm 指令變更 | `package.json`、`AGENTS.md`（建置區塊） |
| Devcontainer 更新 | `.devcontainer/devcontainer.json`、第 00 章（設定說明） |
| 圖片或橫幅變更 | `images/` 目錄，及任何參照該圖片的 README |
| Copilot CLI 版本需求變更 | 第 00 章、第 01 章、`.devcontainer/devcontainer.json` |
