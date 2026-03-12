# AGENTS.md

教授 GitHub Copilot CLI 的初學者友善課程。這是教育內容，而非軟體。

## 結構

| 路徑 | 用途 |
|------|---------|
| `00-07/` | 章節：類比 → 概念 → 動手實作 → 作業 → 下一步 |
| `samples/book-app-project/` | **主要範例**：貫穿所有章節使用的 Python 命令列圖書收藏應用程式 |
| `samples/book-app-project-cs/` | 圖書收藏應用程式的 C# 版本 |
| `samples/book-app-project-js/` | 圖書收藏應用程式的 JavaScript 版本 |
| `samples/book-app-buggy/` | 用於除錯練習的**故意的程式碼漏洞** (第 03 章) |
| `samples/agents/` | 代理程式模板範例 (python-reviewer, pytest-helper, hello-world) |
| `samples/skills/` | 技能模板範例 (code-checklist, pytest-gen, commit-message, hello-world) |
| `samples/mcp-configs/` | MCP 伺服器設定範例 |
| `samples/buggy-code/` | **選修加分內容**：以安全為中心的漏洞程式碼 (JS 與 Python) |
| `samples/src/` | **選修加分內容**：早期課程版本的舊有 JS/React 範例 |
| `appendices/` | 補充參考資料 |

## 應做事項 (Do)

- 保持解釋對初學者友善；使用 AI/ML 專業術語時請加以解釋
- 確保 bash 範例均可直接複製貼上
- 語氣：友好、鼓勵、實用
- 在所有主要範例中使用 `samples/book-app-project/` 路徑
- 對程式碼範例使用 Python/pytest 背景

## 禁忌事項 (Don't)

- 不要修正 `samples/book-app-buggy/` 或 `samples/buggy-code/` 中的漏洞——它們是故意的
- 不要新增章節而不更新 README.md 課程表格
- 不要假設讀者瞭解 AI/ML 術語

## 建構 (Build)

```bash
npm install && npm run release
```
