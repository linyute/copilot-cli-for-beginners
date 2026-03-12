# 詞彙表

本課程中使用的技術術語快速參考。現在不必擔心背誦這些內容——根據需要回頭參考即可。

---

## A

### 代理程式 (Agent)

具備領域專業知識 (例如前端、安全) 的專門 AI 人格。在 `.agent.md` 檔案中定義，帶有至少包含 `description` 欄位的 YAML Frontmatter。

### API

應用程式介面 (Application Programming Interface)。程式之間相互通訊的一種方式。

---

## C

### CI/CD

持續整合/持續部署 (Continuous Integration/Continuous Deployment)。自動化測試與部署管線。

### CLI

命令列介面 (Command Line Interface)。一種與軟體互動的文字型方式 (就像此工具！)。

### 內容視窗 (Context Window)

AI 一次可以考慮的文字量。就像一張只能容納一定量物品的桌子。當你新增檔案、對話紀錄和系統提示時，它們都會佔用此視窗中的空間。

### 內容管理器 (Context Manager)

一種使用 `with` 語句的 Python 結構，可自動處理設定與清理 (例如開啟和關閉檔案)。範例：`with open("file.txt") as f:` 可確保檔案即使在發生錯誤時也會關閉。

### 慣例提交 (Conventional Commit)

一種遵循標準化結構的提交訊息格式：`類型(範圍): 說明`。常見類型包括 `feat` (新功能)、`fix` (漏洞修正)、`docs` (文件)、`refactor` (重構) 和 `test` (測試)。範例：`feat(auth): add password reset flow`。

### 資料類別 (Dataclass)

一個 Python 裝飾器 (`@dataclass`)，可為主要用於儲存資料的類別自動產生 `__init__`、`__repr__` 和其他方法。在圖書應用程式中用於定義具有 `title`、`author`、`year` 和 `read` 等欄位的 `Book` 類別。

---

## F

### Frontmatter

Markdown 檔案頂部封裝在 `---` 分隔符中的中繼資料 (Metadata)。用於代理程式和技能檔案，以 YAML 格式定義 `description` 和 `name` 等屬性。

---

## G

### 通配符模式 (Glob Pattern)

一種使用萬用字元來匹配檔案路徑的模式 (例如，`*.py` 匹配所有 Python 檔案，`*.js` 匹配所有 JavaScript 檔案)。

---

## J

### JWT

JSON Web Token。系統之間傳輸驗證資訊的一種安全方式。

---

## M

### MCP

模型內容協定 (Model Context Protocol)。一種將 AI 助理連接到外部資料來源的標準。

---

## N

### npx

一個 Node.js 工具，可以在不全域安裝的情況下執行 npm 套件。用於 MCP 伺服器設定以啟動伺服器 (例如，`npx @modelcontextprotocol/server-filesystem`)。

---

## O

### OWASP

開放網路應用程式安全計畫 (Open Web Application Security Project)。一個發布安全最佳實作並維護「OWASP Top 10」最關鍵網路應用程式安全風險清單的組織。

---

## P

### PEP 8

Python 增強提案 8 (Python Enhancement Proposal 8)。Python 程式碼的官方風格指南，涵蓋命名慣例 (函式使用 snake_case，類別使用 PascalCase)、縮排 (4 個空格) 和程式碼配置。遵循 PEP 8 可使 Python 程式碼保持一致且易讀。

### 預先提交掛鉤 (Pre-commit Hook)

在每次 `git commit` 之前自動執行的指令碼。可用於在提交程式碼之前執行 Copilot 安全審查或程式碼品質檢查。

### pytest

一個流行的 Python 測試框架，以其簡單語法、強大的 fixture 和豐富的外掛生態系統而聞名。在本課程中貫穿使用，用於測試圖書應用程式。測試透過 `python -m pytest tests/` 執行。

### 程式化模式 (Programmatic Mode)

使用 `-p` 旗標執行 Copilot 以執行單個指令，無需互動。

---

## R

### 費率限制 (Rate Limiting)

對你在一段時間內可以向 API 發出的請求數量的限制。如果你超過了方案的使用配額，Copilot 可能會暫時限制回應。

---

## S

### 階段 (Session)

與 Copilot 的一次對話，會保留內容並可於稍後恢復。

### 技能 (Skill)

一個包含指令的資料夾，當與你的提示相關時，Copilot 會自動載入。在帶有 YAML Frontmatter 的 `SKILL.md` 檔案中定義。

### 斜線指令 (Slash Command)

以 `/` 開頭用於控制 Copilot 的指令 (例如，`/help`、`/clear`、`/model`)。

---

## T

### 權杖 (Token)

AI 模型處理的文字單位。大約 4 個字元或 0.75 個單字。用於衡量輸入 (你的提示與內容) 和輸出 (AI 回應)。

### 類型提示 (Type Hints)

Python 註解，指示函式參數和回傳值的預期類型 (例如，`def add_book(title: str, year: int) -> Book:`)。它們在執行階段不強制執行類型，但有助於程式碼清晰度、IDE 支援以及像 mypy 這樣的靜態分析工具。

---

## W

### WCAG

網路內容無障礙設計指引 (Web Content Accessibility Guidelines)。W3C 發布的標準，旨在使身心障礙人士能夠存取網路內容。WCAG 2.1 AA 是一個常見的合規目標。

---

## Y

### YAML

YAML Ain't Markup Language。一種用於設定的人類可讀資料格式。在本課程中，YAML 出現在代理程式和技能的 Frontmatter 中 (即 `.agent.md` 和 `SKILL.md` 檔案頂部的 `---` 分隔塊)。
