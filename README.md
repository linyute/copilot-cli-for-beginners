![GitHub Copilot CLI 初學者指南](./images/copilot-banner.png)

[![授權條款：MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)&ensp;
[![在 GitHub Codespaces 中開啟專案](https://img.shields.io/badge/Codespaces-Open-blue?style=flat-square&logo=github)](https://codespaces.new/github/copilot-cli-for-beginners?hide_repo_select=true&ref=main&quickstart=true)&ensp;
[![官方 Copilot CLI 文件](https://img.shields.io/badge/GitHub-CLI_Documentation-00a3ee?style=flat-square&logo=github)](https://docs.github.com/en/copilot/how-tos/copilot-cli)&ensp;
[![加入 AI Foundry Discord](https://img.shields.io/badge/Discord-AI_Community-blue?style=flat-square&logo=discord&color=5865f2&logoColor=fff)](https://aka.ms/foundry/discord)

🎯 [你將學到什麼](#你將學到什麼) &ensp; ✅ [先決條件](#先決條件) &ensp; 🤖 [Copilot 家族](#瞭解-github-copilot-家族) &ensp; 📚 [課程結構](#課程結構) &ensp; 📋 [指令參考](#-github-copilot-cli-指令參考)

# GitHub Copilot CLI 初學者指南

> **✨ 學習透過 AI 驅動的命令列協助來強化你的開發工作流程。**

GitHub Copilot CLI 將 AI 協助直接帶入你的終端機。你無需切換到瀏覽器或程式碼編輯器，即可提問、產生功能齊全的應用程式、審查程式碼、產生測試以及除錯，且一切都在命令列中完成。

將其想像成一位 24 小時隨時待命的博學同事，他可以閱讀你的程式碼、解釋令人困惑的模式，並幫助你更快速地工作！

> 📘 **偏好網頁瀏覽？** 你可以在 GitHub 上追蹤本課程，或至 [Awesome Copilot](https://awesome-copilot.github.com/learning-hub/cli-for-beginners/) 以更傳統的瀏覽體驗查看。

本課程專為以下對象設計：

- 想要在命令列使用 AI 的**軟體開發者**
- 偏好鍵盤驅動工作流程而非 IDE 整合的**終端機使用者**
- 尋求將 AI 輔助程式碼審查與開發實作**標準化之團隊**

<a href="https://aka.ms/githubcopilotdevdays" target="_blank">
  <picture>
    <img src="./images/copilot-dev-days.png" alt="GitHub Copilot Dev Days - 尋找或舉辦活動" width="100%" />
  </picture>
</a>

## 🎯 你將學到什麼

這門動手實作課程將帶領你從零開始，掌握 GitHub Copilot CLI 的高效用法。你將在所有章節中使用單個 Python 圖書收藏應用程式，透過 AI 輔助的工作流程逐步改進它。到最後，你將能自信地在終端機中使用 AI 來審查程式碼、產生測試、對問題進行除錯並自動化工作流程。

**無需 AI 經驗。** 只要你會使用終端機，就能學會。

**非常適合：** 開發者、學生以及任何具備軟體開發經驗的人。

## ✅ 先決條件

在開始之前，請確保你具備：

- **GitHub 帳號**：[免費建立](https://github.com/signup)<br>
- **GitHub Copilot 存取權限**：[免費方案](https://github.com/features/copilot/plans)、[每月訂閱](https://github.com/features/copilot/plans)，或[對學生/教師免費](https://education.github.com/pack)<br>
- **終端機基礎**：熟悉 `cd`、`ls` 以及執行指令

## 🤖 瞭解 GitHub Copilot 家族

GitHub Copilot 已發展成為一系列 AI 驅動的工具。以下是各工具的所在位置：

| 產品 | 執行位置 | 說明 |
|---------|---------------|----------|
| [**GitHub Copilot CLI**](https://docs.github.com/copilot/how-tos/copilot-cli/cli-getting-started)<br>(本課程) | 你的終端機 | 終端機原生的 AI 編碼助理 |
| [**GitHub Copilot**](https://docs.github.com/copilot) | VS Code, Visual Studio, JetBrains 等 | 代理程式模式、對話、內嵌建議 |
| [**GitHub.com 上的 Copilot**](https://github.com/copilot) | GitHub | 關於你儲存庫的沉浸式對話、建立代理程式等 |
| [**GitHub Copilot 雲端代理程式**](https://docs.github.com/copilot/using-github-copilot/using-copilot-coding-agent-to-work-on-tasks) | GitHub | 將 issue 指派給代理程式，獲取 PR 回傳 |

本課程重點介紹 **GitHub Copilot CLI**，將 AI 協助直接帶入你的終端機。

## 📚 課程結構

![GitHub Copilot CLI 學習路徑](images/learning-path.png)

| 章節 | 標題 | 你將建構什麼 |
|:-------:|-------|-------------------|
| 00 | 🚀 [快速入門](./00-quick-start/README.md) | 安裝與驗證 |
| 01 | 👋 [第一步](./01-setup-and-first-steps/README.md) | 現場展示 + 三種互動模式 |
| 02 | 🔍 [內容與對話](./02-context-conversations/README.md) | 多檔案專案分析 |
| 03 | ⚡ [開發工作流程](./03-development-workflows/README.md) | 程式碼審查、除錯、測試產生 |
| 04 | 🤖 [建立專門的 AI 助理](./04-agents-custom-instructions/README.md) | 為你的工作流程自訂代理程式 |
| 05 | 🛠️ [自動化重複性任務](./05-skills/README.md) | 自動載入的技能 |
| 06 | 🔌 [連接到 GitHub、資料庫與 API](./06-mcp-servers/README.md) | MCP 伺服器整合 |
| 07 | 🎯 [整合應用](./07-putting-it-together/README.md) | 完整的功能開發工作流程 |

## 📖 本課程如何運作

每個章節都遵循相同的模式：

1. **現實世界類比**：透過熟悉的對比來理解概念
2. **核心概念**：學習必要的知識
3. **動手實作範例**：執行實際指令並查看結果
4. **作業**：練習你所學到的內容
5. **下一步**：下一章的預覽

**程式碼範例是可執行的。** 本課程中的每個 Copilot 文字塊都可以複製並在你的終端機中執行。

## 📋 GitHub Copilot CLI 指令參考

**[GitHub Copilot CLI 指令參考](https://docs.github.com/en/copilot/reference/cli-command-reference)** 可幫助你查找指令和鍵盤捷徑，以協助你有效地使用 Copilot CLI。

## 🙋 獲取協助

- 🐛 **發現程式碼漏洞？** [開啟一個 Issue](https://github.com/github/copilot-cli-for-beginners/issues)
- 🤝 **想要做出貢獻？** 歡迎提交 PR！
- 📚 **官方文件：** [GitHub Copilot CLI 文件](https://docs.github.com/copilot/concepts/agents/about-copilot-cli)

## 授權條款

本專案根據 MIT 開放原始碼授權條款授權。請參閱 [LICENSE](./LICENSE) 檔案以獲取完整條款。
