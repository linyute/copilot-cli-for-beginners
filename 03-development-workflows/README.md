![第 03 章：開發工作流程](images/chapter-header.png)

> **如果 AI 能發現你甚至不知道要詢問的程式碼漏洞，會怎樣？**

在本章中，GitHub Copilot CLI 將成為你的日常工具。你將在每天依賴的工作流程中使用它：測試、重構、除錯和 Git。

## 🎯 學習目標

到本章結束時，你將能夠：

- 使用 Copilot CLI 執行全面的程式碼審查
- 安全地重構舊有程式碼 (legacy code)
- 在 AI 的協助下對問題進行除錯
- 自動產生測試
- 將 Copilot CLI 與你的 git 工作流程整合

> ⏱️ **預估時間**：~60 分鐘 (15 分鐘閱讀 + 45 分鐘動手實作)

---

## 🧩 現實世界的類比：木匠的工作流程

木匠不僅知道如何使用工具，他們還針對不同的工作擁有不同的*工作流程*：

<img src="images/carpenter-workflow-steps.png" alt="工匠工作坊顯示三個工作流程車道：製作家具 (測量、切割、組裝、飾面)、修復損壞 (評估、移除、修理、匹配) 和品質檢查 (檢查、測試接合處、檢查對齊)" width="800"/>

同樣地，開發者針對不同的任務也有工作流程。GitHub Copilot CLI 增強了這些工作流程中的每一個，讓你更有效率地處理日常編碼任務。

---

# 五個工作流程

<img src="images/five-workflows.png" alt="五個發光的霓虹圖示，分別代表程式碼審查、測試、除錯、重構和 git 整合工作流程" width="800"/>

下方的每個工作流程都是獨立的。挑選符合你目前需求的工作流程，或全部完成。

---

## 選擇你自己的冒險

本章涵蓋了開發者通常使用的五個工作流程。**然而，你不需要一次讀完所有內容！** 每個工作流程都包含在下方可摺疊的章節中。挑選符合你需求且最適合你目前專案的工作流程。你隨時可以稍後回來探索其他內容。

<img src="images/five-workflows-swimlane.png" alt="五個開發工作流程：程式碼審查、重構、除錯、測試產生和 Git 整合，以水平泳道顯示" width="800"/>

| 我想要... | 跳至 |
|---|---|
| 在合併前審查程式碼 | [工作流程 1：程式碼審查](#workflow-1-code-review) |
| 清理混亂或舊有的程式碼 | [工作流程 2：重構](#workflow-2-refactoring) |
| 追蹤並修正漏洞 | [工作流程 3：除錯](#workflow-3-debugging) |
| 為我的程式碼產生測試 | [工作流程 4：測試產生](#workflow-4-test-generation) |
| 撰寫更好的提交和 PR | [工作流程 5：Git 整合](#workflow-5-git-integration) |
| 在編碼前進行研究 | [快速提示：在規劃或編碼前進行研究](#quick-tip-research-before-you-plan-or-code) |
| 查看完整的漏洞修正工作流程 | [整合應用](#putting-it-all-together-bug-fix-workflow) |

**選擇下方的一個工作流程以展開它**，並查看 GitHub Copilot CLI 如何在該領域增強你的開發過程。

---

<a id="workflow-1-code-review"></a>
<details>
<summary><strong>工作流程 1：程式碼審查</strong> - 審查檔案、使用 /review 代理程式、建立嚴重性檢查表</summary>

<img src="images/code-review-swimlane-single.png" alt="程式碼審查工作流程：審查、識別問題、優先排序、產生檢查表。" width="800"/>

### 基礎審查

此範例使用 `@` 符號引用檔案，讓 Copilot CLI 直接存取其內容進行審查。

```bash
copilot

> Review @samples/book-app-project/book_app.py for code quality
```

---

<details>
<summary>🎬 看看它的實際運作！</summary>

![程式碼審查展示](images/code-review-demo.gif)

*展示輸出會有所不同。你的模型、工具和回應將與此處顯示的內容不同。*

</details>

---

### 輸入驗證審查

透過在提示中列出你關心的類別，要求 Copilot CLI 將審查重點放在特定考量上 (此處為輸入驗證)。

```text
copilot

> Review @samples/book-app-project/utils.py for input validation issues. Check for: missing validation, error handling gaps, and edge cases
```


### 跨檔案專案審查

使用 `@` 引用整個目錄，讓 Copilot CLI 一次掃描專案中的每個檔案。

```bash
copilot

> @samples/book-app-project/ Review this entire project. Create a markdown checklist of issues found, categorized by severity
```

### 互動式程式碼審查

使用多輪對話深入探究。從廣泛的審查開始，然後在不重新啟動的情況下提出後續問題。

```bash
copilot

> @samples/book-app-project/book_app.py Review this file for:
> - Input validation
> - Error handling
> - Code style and best practices

# Copilot CLI 提供詳細審查

> The user input handling - are there any edge cases I'm missing?

# Copilot CLI 顯示空字串、特殊字元的潛在問題

> Create a checklist of all issues found, prioritized by severity

# Copilot CLI 產生優先處理事項
```

### 審查檢查表模板

要求 Copilot CLI 以特定格式結構化其輸出 (此處為按嚴重性分類的 markdown 檢查表，你可以將其貼上到 issue 中)。

```bash
copilot

> Review @samples/book-app-project/ and create a markdown checklist of issues found, categorized by:
> - Critical (data loss risks, crashes)
> - High (bugs, incorrect behavior)
> - Medium (performance, maintainability)
> - Low (style, minor improvements)
```

### 理解 Git 變更 (對於 /review 很重要)

在使用 `/review` 指令之前，你需要瞭解 git 中兩種類型的變更：

| 變更類型 | 意義 | 如何查看 |
|-------------|---------------|------------|
| **已暫存的變更 (Staged changes)** | 你使用 `git add` 標記為下次提交的檔案 | `git diff --staged` |
| **未暫存的變更 (Unstaged changes)** | 你已修改但尚未新增的檔案 | `git diff` |

```bash
# 快速參考
git status           # 顯示已暫存和未暫存的變更
git add file.py      # 將檔案暫存以供提交
git diff             # 顯示未暫存的變更
git diff --staged    # 顯示已暫存的變更
```

### 使用 /review 指令

`/review` 指令會呼叫內建的 **程式碼審查代理程式 (code-review agent)**，該代理程式針對分析已暫存和未暫存的變更進行了優化，並提供高信噪比的輸出。使用斜線指令觸發專門的內建代理程式，而不是撰寫自由格式的提示。

```bash
copilot

> /review
# 在已暫存/未暫存的變更上呼叫程式碼審查代理程式
# 提供集中且可操作的回饋

> /review Check for security issues in authentication
# 執行帶有特定焦點區域的審查
```

> 💡 **提示**：程式碼審查代理程式在你有待處理的變更時運作效果最好。使用 `git add` 暫存你的檔案以獲得更集中的審查。

</details>

---

<a id="workflow-2-refactoring"></a>
<details>
<summary><strong>工作流程 2：重構</strong> - 重構程式碼結構、分離關注點、改進錯誤處理</summary>

<img src="images/refactoring-swimlane-single.png" alt="重構工作流程：評估程式碼、計畫變更、實作、驗證行為。" width="800"/>

### 簡單重構

> **先試試這個：** `@samples/book-app-project/book_app.py The command handling uses if/elif chains. Refactor it to use a dictionary dispatch pattern.`

從直接的改進開始。在圖書應用程式上嘗試這些。每個提示都使用 `@` 檔案引用配對特定的重構指令，以便 Copilot CLI 確切知道要更改什麼。

```bash
copilot

> @samples/book-app-project/book_app.py The command handling uses if/elif chains. Refactor it to use a dictionary dispatch pattern.

> @samples/book-app-project/utils.py Add type hints to all functions

> @samples/book-app-project/book_app.py Extract the book display logic into utils.py for better separation of concerns
```

> 💡 **剛接觸重構？** 在處理複雜的轉換之前，先從簡單的請求開始，例如新增類型提示或改進變數名稱。

---

<details>
<summary>🎬 看看它的實際運作！</summary>

![重構展示](images/refactor-demo.gif)

*展示輸出會有所不同。你的模型、工具和回應將與此處顯示的內容不同。*

</details>

---

### 分離關注點

在單個提示中引用多個 `@` 檔案，以便 Copilot CLI 可以在重構過程中在它們之間移動程式碼。

```bash
copilot

> @samples/book-app-project/utils.py @samples/book-app-project/book_app.py
> The utils.py file has print statements mixed with logic. Refactor to separate display functions from data processing.
```

### 改進錯誤處理

提供兩個相關檔案並描述橫切關注點 (cross-cutting concern)，以便 Copilot CLI 可以在兩者之間建議一致的修正。

```bash
copilot

> @samples/book-app-project/utils.py @samples/book-app-project/books.py
> These files have inconsistent error handling. Suggest a unified approach using custom exceptions.
```

### 新增文件

使用詳細的項目清單來精確指定每個 docstring 應包含的內容。

```bash
copilot

> @samples/book-app-project/books.py Add comprehensive docstrings to all methods:
> - Include parameter types and descriptions
> - Document return values
> - Note any exceptions raised
> - Add usage examples
```

### 具備測試的安全重構

在多輪對話中串聯兩個相關的請求。首先產生測試，然後以這些測試作為安全網進行重構。

```bash
copilot

> @samples/book-app-project/books.py Before refactoring, generate tests for current behavior

# 先取得測試

> Now refactor the BookCollection class to use a context manager for file operations

# 充滿信心地重構 - 測試將驗證行為是否得以保留
```

</details>

---

<a id="workflow-3-debugging"></a>
<details>
<summary><strong>工作流程 3：除錯</strong> - 追蹤漏洞、安全稽核、跨檔案追蹤問題</summary>

<img src="images/debugging-swimlane-single.png" alt="除錯工作流程：理解錯誤、定位根本原因、修正、測試。" width="800"/>

### 簡單除錯

> **先試試這個：** `@samples/book-app-buggy/books_buggy.py Users report that searching for "The Hobbit" returns no results even though it's in the data. Debug why.`

從描述錯誤開始。以下是你可以使用帶有漏洞的圖書應用程式嘗試的常見除錯模式。每個提示都將 `@` 檔案引用與明確的症狀描述配對，以便 Copilot CLI 可以定位並診斷漏洞。

```bash
copilot

# 模式：「預期 X 但得到 Y」
> @samples/book-app-buggy/books_buggy.py Users report that searching for "The Hobbit" returns no results even though it's in the data. Debug why.

# 模式：「意外行為」
> @samples/book-app-buggy/book_app_buggy.py When I remove a book that doesn't exist, the app says it was removed. Help me find why.

# 模式：「錯誤結果」
> @samples/book-app-buggy/books_buggy.py When I mark one book as read, ALL books get marked. What's the bug?
```

> 💡 **除錯提示**：描述*症狀* (你看到的) 和*預期* (應該發生的)。Copilot CLI 會找出其餘部分。

---

<details>
<summary>🎬 看看它的實際運作！</summary>

![修正漏洞展示](images/fix-bug-demo.gif)

*展示輸出會有所不同。你的模型、工具和回應將與此處顯示的內容不同。*

</details>

---

### 「漏洞偵探」 - AI 尋找相關漏洞

這是內容感知除錯大放異彩的地方。對帶有漏洞的圖書應用程式嘗試此案例。透過 `@` 提供整個檔案，並僅描述使用者回報的症狀。Copilot CLI 將追蹤根本原因，並可能發現附近的其他漏洞。

```bash
copilot

> @samples/book-app-buggy/books_buggy.py
>
> Users report: "Finding books by author name doesn't work for partial names"
> Debug why this happens
```

**Copilot CLI 的動作**：
```
根本原因：第 80 行使用精確匹配 (==) 而非部分匹配 (in)。

第 80 行：return [b for b in self.books if b.author == author]

find_by_author 函式需要精確匹配。搜尋 "Tolkien" 將找不到 "J.R.R. Tolkien" 的書籍。

修正：更改為不區分大小寫的部分匹配：
return [b for b in self.books if author.lower() in b.author.lower()]
```

**為什麼這很重要**：Copilot CLI 讀取整個檔案，理解漏洞報告的內容，並為你提供具體的修正與明確的解釋。

> 💡 **加分**：由於 Copilot CLI 分析整個檔案，它通常會發現你沒有詢問的*其他*問題。例如，在修正作者搜尋時，Copilot CLI 可能還會注意到 `find_book_by_title` 中的大小寫敏感漏洞！

### 現實世界安全側欄

雖然對你自己的程式碼進行除錯很重要，但瞭解正式環境應用程式中的安全漏洞至關重要。嘗試此範例：將 Copilot CLI 指向一個陌生的檔案，並要求它對安全問題進行稽核。

```bash
copilot

> @samples/buggy-code/python/user_service.py Find all security vulnerabilities in this Python user service
```

此檔案展示了你在正式環境應用程式中會遇到的現實世界安全模式。

> 💡 **你會遇到的常見安全術語：**
> - **SQL 插入 (SQL Injection)**：當使用者輸入被直接放入資料庫查詢中時，允許攻擊者執行惡意指令
> - **參數化查詢 (Parameterized queries)**：安全的替代方案 - 佔位符 (`?`) 將使用者資料與 SQL 指令分離
> - **競爭條件 (Race condition)**：當兩個操作同時發生並相互干擾時
> - **XSS (跨網站指令碼)**：當攻擊者將惡意指令碼注入網頁時

---

### 理解錯誤

將堆疊追蹤 (stack trace) 直接貼到你的提示中，並附上 `@` 檔案引用，以便 Copilot CLI 可以將錯誤對應到原始碼。

```bash
copilot

> I'm getting this error:
> AttributeError: 'NoneType' object has no attribute 'title'
>     at show_books (book_app.py:19)
>
> @samples/book-app-project/book_app.py Explain why and how to fix it
```

### 透過測試案例進行除錯

描述確切的輸入和觀察到的輸出，為 Copilot CLI 提供一個具體、可重現的測試案例來進行推理。

```bash
copilot

> @samples/book-app-buggy/books_buggy.py The remove_book function has a bug. When I try to remove "Dune",
> it also removes "Dune Messiah". Debug this: explain the root cause and provide a fix.
```

### 追蹤程式碼中的問題

引用多個檔案，並要求 Copilot CLI 追蹤跨檔案的資料流，以定位問題源自何處。

```bash
copilot

> Users report that the book list numbering starts at 0 instead of 1.
> @samples/book-app-buggy/book_app_buggy.py @samples/book-app-buggy/books_buggy.py
> Trace through the list display flow and identify where the issue occurs
```

### 理解資料問題

在讀取它的程式碼旁邊包含一個資料檔案，以便 Copilot CLI 在建議錯誤處理改進時瞭解全貌。

```bash
copilot

> @samples/book-app-project/data.json @samples/book-app-project/books.py
> Sometimes the JSON file gets corrupted and the app crashes. How should we handle this gracefully?
```

</details>

---

<a id="workflow-4-test-generation"></a>
<details>
<summary><strong>工作流程 4：測試產生</strong> - 自動產生全面的測試和邊際情況 (edge cases)</summary>

<img src="images/test-gen-swimlane-single.png" alt="測試產生工作流程：分析函式、產生測試、包含邊際情況、執行。" width="800"/>

> **先試試這個：** `@samples/book-app-project/books.py Generate pytest tests for all functions including edge cases`

### 「測試爆炸」 - 2 個測試 vs 15+ 個測試

在手動編寫測試時，開發者通常會建立 2-3 個基礎測試：
- 測試有效輸入
- 測試無效輸入
- 測試一個邊際情況

觀察當你要求 Copilot CLI 產生全面測試時會發生什麼！此提示使用帶有 `@` 檔案引用的結構化項目清單，引導 Copilot CLI 實現徹底的測試覆蓋：

```bash
copilot

> @samples/book-app-project/books.py Generate comprehensive pytest tests. Include tests for:
> - Adding books
> - Removing books
> - Finding by title
> - Finding by author
> - Marking as read
> - Edge cases with empty data
```

---

<details>
<summary>🎬 看看它的實際運作！</summary>

![測試產生展示](images/test-gen-demo.gif)

*展示輸出會有所不同。你的模型、工具和回應將與此處顯示的內容不同。*

</details>

---

**你獲得的結果**：15+ 個全面的測試，包括：

```python
class TestBookCollection:
    # 成功路徑 (Happy path)
    def test_add_book_creates_new_book(self):
        ...
    def test_list_books_returns_all_books(self):
        ...

    # 搜尋操作
    def test_find_book_by_title_case_insensitive(self):
        ...
    def test_find_book_by_title_returns_none_when_not_found(self):
        ...
    def test_find_by_author_partial_match(self):
        ...
    def test_find_by_author_case_insensitive(self):
        ...

    # 邊際情況 (Edge cases)
    def test_add_book_with_empty_title(self):
        ...
    def test_remove_nonexistent_book(self):
        ...
    def test_mark_as_read_nonexistent_book(self):
        ...

    # 資料持續性
    def test_save_books_persists_to_json(self):
        ...
    def test_load_books_handles_missing_file(self):
        ...
    def test_load_books_handles_corrupted_json(self):
        ...

    # 特殊字元
    def test_add_book_with_unicode_characters(self):
        ...
    def test_find_by_author_with_special_characters(self):
        ...
```

**結果**：在 30 秒內，你獲得了需要一小時才能思考並撰寫完成的邊際情況測試。

---

### 單元測試

針對單個函式並列舉你想要測試的輸入類別，以便 Copilot CLI 產生集中、徹底的單元測試。

```bash
copilot

> @samples/book-app-project/utils.py Generate comprehensive pytest tests for get_book_details covering:
> - Valid input
> - Empty strings
> - Invalid year formats
> - Very long titles
> - Special characters in author names
```

### 執行測試

用白話英文向 Copilot CLI 詢問關於你的工具鏈的問題。它可以為你產生正確的 Shell 指令。

```bash
copilot

> How do I run the tests? Show me the pytest command.

# Copilot CLI 回應：
# cd samples/book-app-project && python -m pytest tests/
# 或獲取詳細輸出：python -m pytest tests/ -v
# 欲查看 print 語句：python -m pytest tests/ -s
```

### 特定情境的測試

列出你想要覆蓋的進階或棘手情境，以便 Copilot CLI 超越成功路徑。

```bash
copilot

> @samples/book-app-project/books.py Generate tests for these scenarios:
> - Adding duplicate books (same title and author)
> - Removing a book by partial title match
> - Finding books when collection is empty
> - File permission errors during save
> - Concurrent access to the book collection
```

### 向現有檔案新增測試

要求為單個函式提供*額外*測試，以便 Copilot CLI 產生新的案例來補充你現有的內容。

```bash
copilot

> @samples/book-app-project/books.py
> Generate additional tests for the find_by_author function with edge cases:
> - Author name with hyphens (e.g., "Jean-Paul Sartre")
> - Author with multiple first names
> - Empty string as author
> - Author name with accented characters
```

</details>

---

<a id="workflow-5-git-integration"></a>
<details>
<summary><strong>工作流程 5：Git 整合</strong> - 提交訊息、PR 說明、/delegate 和 /diff</summary>

<img src="images/git-integration-swimlane-single.png" alt="Git 整合工作流程：暫存變更、產生訊息、提交、建立 PR。" width="800"/>

> 💡 **此工作流程假設你具備基礎 git 知識** (暫存、提交、分支)。如果 git 對你來說是陌生的，請先嘗試其他四個工作流程。

### 產生提交訊息

> **先試試這個：** `copilot -p "Generate a conventional commit message for: $(git diff --staged)"` — 暫存一些變更，然後執行此指令以查看 Copilot CLI 撰寫你的提交訊息。

此範例使用 `-p` 內嵌提示旗標配合 Shell 指令替換，將 `git diff` 輸出直接透過管線傳送到 Copilot CLI，以產生單次提交訊息。`$(...)` 語法會執行括號內的指令，並將其輸出插入到外部指令中。

```bash

# 查看變更了什麼
git diff --staged

# 使用 [慣例提交 (Conventional Commit)](../GLOSSARY.md#conventional-commit) 格式產生提交訊息
# (結構化訊息，如 "feat(books): add search" 或 "fix(data): handle empty input")
copilot -p "Generate a conventional commit message for: $(git diff --staged)"

# 輸出："feat(books): add partial author name search
#
# - Update find_by_author to support partial matches
# - Add case-insensitive comparison
# - Improve user experience when searching authors"
```

---

<details>
<summary>🎬 看看它的實際運作！</summary>

![Git 整合展示](images/git-integration-demo.gif)

*展示輸出會有所不同。你的模型、工具和回應將與此處顯示的內容不同。*

</details>

---

### 解釋變更

將 `git show` 的輸出透過管線傳送到 `-p` 提示中，以取得最後一次提交的白話摘要。

```bash
# 此提交變更了什麼？
copilot -p "Explain what this commit does: $(git show HEAD --stat)"
```

### PR 說明

將 `git log` 輸出與結構化提示模板結合，以自動產生完整的提取請求 (PR) 說明。

```bash
# 從分支變更產生 PR 說明
copilot -p "Generate a pull request description for these changes:
$(git log main..HEAD --oneline)

Include:
- Summary of changes
- Why these changes were made
- Testing done
- Breaking changes? (yes/no)"
```

### 推送前審查

在 `-p` 提示中使用 `git diff main..HEAD`，對所有分支變更進行快速的推送前檢查。

```bash
# 推送前的最後檢查
copilot -p "Review these changes for issues before I push:
$(git diff main..HEAD)"
```

### 使用 /delegate 執行背景任務

`/delegate` 指令將工作交給 GitHub 上的 Copilot 編碼代理程式。使用 `/delegate` 斜線指令 (或 `&` 捷徑) 將定義明確的任務分派給背景代理程式。

```bash
copilot

> /delegate Add input validation to the login form

# 或使用 & 前綴捷徑：
> & Fix the typo in the README header

# Copilot CLI：
# 1. 將你的變更提交到新分支
# 2. 開啟草稿提取請求 (Draft PR)
# 3. 在 GitHub 背景執行工作
# 4. 完成後請求你的審查
```

這非常適合當你專注於其他工作時，希望完成定義明確的任務。

### 使用 /diff 審查階段變更

`/diff` 指令顯示目前階段中所做的所有變更。在提交之前，使用此斜線指令查看 Copilot CLI 修改的所有內容的視覺化差異。

```bash
copilot

# 在做了一些變更之後...
> /diff

# 顯示此階段中修改的所有檔案的視覺化差異
# 非常適合在提交前進行審查
```

</details>

---

## 快速提示：在規劃或編碼前進行研究

當你需要調查一個函式庫、理解最佳實作或探索一個陌生的主題時，請使用 `/research` 在編寫任何程式碼之前執行深度研究調查：

```bash
copilot

> /research What are the best Python libraries for validating user input in CLI apps?
```

Copilot 會搜尋 GitHub 儲存庫和網路資源，然後傳回帶有參考資料的摘要。當你即將開始一個新功能並希望先做出明智的決定時，這非常有用。你可以使用 `/share` 分享結果。

> 💡 **提示**：`/research` 在 `/plan` *之前* 使用效果很好。先研究方法，再規劃實作。

---

## 整合應用：漏洞修正工作流程

以下是修正回報漏洞的完整工作流程：

```bash

# 1. 理解漏洞報告
copilot

> Users report: 'Finding books by author name doesn't work for partial names'
> @samples/book-app-project/books.py Analyze and identify the likely cause

# 2. 除錯問題 (在同一個階段中繼續)
> Based on the analysis, show me the find_by_author function and explain the issue

> Fix the find_by_author function to handle partial name matches

# 3. 為修正產生測試
> @samples/book-app-project/books.py Generate pytest tests specifically for:
> - Full author name match
> - Partial author name match
> - Case-insensitive matching
> - Author name not found

# 4. 產生提交訊息
copilot -p "Generate commit message for: $(git diff --staged)"

# 輸出："fix(books): support partial author name search"
```

### 漏洞修正工作流程摘要

| 步驟 | 動作 | Copilot 指令 |
|------|--------|-----------------|
| 1 | 理解漏洞 | `> [描述漏洞] @relevant-file.py Analyze the likely cause` |
| 2 | 取得詳細分析 | `> Show me the function and explain the issue` |
| 3 | 實作修正 | `> Fix the [特定問題]` |
| 4 | 產生測試 | `> Generate tests for [特定情境]` |
| 5 | 提交 | `copilot -p "Generate commit message for: $(git diff --staged)"` |

---

# 練習

<img src="../images/practice.png" alt="溫馨的書桌設置，螢幕上顯示程式碼，還有檯燈、咖啡杯和耳機，準備好進行動手練習" width="800"/>

現在輪到你來應用這些工作流程了。

---

## ▶️ 親自嘗試

完成展示後，嘗試這些變化：

1. **漏洞偵探挑戰**：要求 Copilot CLI 對 `samples/book-app-buggy/books_buggy.py` 中的 `mark_as_read` 函式進行除錯。它是否解釋了為什麼該函式將所有書籍標記為已讀，而不僅僅是一本？

2. **測試挑戰**：為圖書應用程式中的 `add_book` 函式產生測試。計算 Copilot CLI 包含了多少你沒想到的邊際情況。

3. **提交訊息挑戰**：對圖書應用程式檔案進行任何小變更，將其暫存 (`git add .`)，然後執行：
   ```bash
   copilot -p "Generate a conventional commit message for: $(git diff --staged)"
   ```
   這條訊息是否比你快速寫出的更好？

**自我檢查**：當你能解釋為什麼「對這個漏洞進行除錯」比「尋找漏洞」更強大時 (內容很重要！)，你就理解了開發工作流程。

---

## 📝 作業

### 主要挑戰：重構、測試並交付

動手實作範例重點在於 `find_book_by_title` 和程式碼審查。現在對 `book-app-project` 中的不同函式練習相同的工作流程技能：

1. **審查**：要求 Copilot CLI 審查 `books.py` 中的 `remove_book()`，檢查邊際情況和潛在問題：
   `@samples/book-app-project/books.py Review the remove_book() function. What happens if the title partially matches another book (e.g., "Dune" vs "Dune Messiah")? Are there any edge cases not handled?`
2. **重構**：要求 Copilot CLI 改進 `remove_book()`，以處理邊際情況，例如不區分大小寫的匹配，並在找不到書籍時返回有用的回饋
3. **測試**：專門為改進後的 `remove_book()` 函式產生 pytest 測試，涵蓋：
   - 移除已存在的書籍
   - 不區分大小寫的標題匹配
   - 不存在的書籍返回適當的回饋
   - 從空收藏中移除
4. **審查**：暫存你的變更並執行 `/review` 以檢查任何剩餘的問題
5. **提交**：產生慣例提交訊息：
   `copilot -p "Generate a conventional commit message for: $(git diff --staged)"`

<details>
<summary>💡 提示 (點擊展開)</summary>

**每個步驟的範例提示：**

```bash
copilot

# 步驟 1：審查
> @samples/book-app-project/books.py Review the remove_book() function. What edge cases are not handled?

# 步驟 2：重構
> Improve remove_book() to use case-insensitive matching and return a clear message when the book isn't found. Show me the before and after code.

# 步驟 3：測試
> Generate pytest tests for the improved remove_book() function, including:
> - Removing a book that exists
> - Case-insensitive matching ("dune" should remove "Dune")
> - Book not found returns appropriate response
> - Removing from an empty collection

# 步驟 4：審查
> /review

# 步驟 5：提交
> Generate a conventional commit message for this refactor
```

**提示：** 在改進 `remove_book()` 之後，嘗試詢問 Copilot CLI：「此檔案中還有其他函式可以從相同的改進中獲益嗎？」。它可能會建議對 `find_book_by_title()` 或 `find_by_author()` 進行類似的更改。

</details>

### 加分挑戰：使用 Copilot CLI 建立應用程式

> 💡 **注意**：此 GitHub Skills 練習使用 **Node.js** 而非 Python。你將練習的 GitHub Copilot CLI 技術——建立 issue、產生程式碼以及從終端機協作——適用於任何語言。

該練習向開發者展示如何使用 GitHub Copilot CLI 在建構 Node.js 計算機應用程式的同時建立 issue、產生程式碼並從終端機進行協作。你將安裝 CLI，使用模板和代理程式 (agents)，並練習由命令列驅動的迭代式開發。

##### <img src="../images/github-skills-logo.png" width="28" align="center" /> [開始「使用 Copilot CLI 建立應用程式」Skills 練習](https://github.com/skills/create-applications-with-the-copilot-cli)

---

<details>
<summary>🔧 <strong>常見錯誤與疑難排解</strong> (點擊展開)</summary>

### 常見錯誤

| 錯誤 | 會發生什麼 | 修正 |
|---------|--------------|-----|
| 使用模糊的提示，如「審查此程式碼」 | 得到遺漏特定問題的通用回饋 | 請具體一點：「審查 SQL 插入、XSS 和身份驗證問題」 |
| 未使用 `/review` 進行程式碼審查 | 錯過了優化的程式碼審查代理程式 | 使用針對高信噪比輸出進行過調整的 `/review` |
| 在無內容的情況下要求「尋找漏洞」 | Copilot CLI 不知道你遇到了什麼漏洞 | 描述症狀：「使用者回報當 Y 發生時會出現 X」 |
| 產生測試時未指定框架 | 測試可能使用錯誤的語法或斷言函式庫 | 指定：「使用 Jest 產生測試」或「使用 pytest」 |

### 疑難排解

**審查似乎不完整** - 請更具體地說明要尋找什麼：

```bash
copilot

# 而不是：
> Review @samples/book-app-project/book_app.py

# 嘗試：
> Review @samples/book-app-project/book_app.py for input validation, error handling, and edge cases
```

**測試與我的框架不匹配** - 指定框架：

```bash
copilot

> @samples/book-app-project/books.py Generate tests using pytest (not unittest)
```

**重構改變了行為** - 要求 Copilot CLI 保留行為：

```bash
copilot

> @samples/book-app-project/book_app.py Refactor command handling to use dictionary dispatch. IMPORTANT: Maintain identical external behavior - no breaking changes
```

</details>

---

# 摘要

## 🔑 重要關鍵

<img src="images/specialized-workflows.png" alt="每項任務的專門工作流程：程式碼審查、重構、除錯、測試和 Git 整合" width="800"/>

1. **程式碼審查** 透過具體提示變得全面
2. **重構** 在你先產生測試時更安全
3. **除錯** 受益於向 Copilot CLI 顯示錯誤與程式碼
4. **測試產生** 應包含邊際情況和錯誤情境
5. **Git 整合** 自動產生提交訊息和 PR 說明

> 📋 **快速參考**：查看 [GitHub Copilot CLI 指令參考](https://docs.github.com/en/copilot/reference/cli-command-reference) 以獲取指令和快速鍵的完整清單。

---

## ✅ 檢查點：你已掌握精髓

**恭喜！** 你現在已具備使用 GitHub Copilot CLI 發揮生產力的所有核心技能：

| 技能 | 章節 | 你現在可以... |
|-------|---------|----------------|
| 基礎指令 | 第 01 章 | 使用互動模式、計畫模式、程式化模式 (-p) 和斜線指令 |
| 內容 | 第 02 章 | 使用 `@` 引用檔案、管理階段、理解內容視窗 |
| 工作流程 | 第 03 章 | 審查程式碼、重構、除錯、產生測試、與 git 整合 |

第 04-06 章涵蓋了增加更多力量且值得學習的其他功能。

---

## 🛠️ 建立你的個人工作流程

使用 GitHub Copilot CLI 沒有唯一的「正確」方法。以下是在你發展自己的模式時的一些提示：

> 📚 **官方文件**：[Copilot CLI 最佳實作](https://docs.github.com/copilot/how-tos/copilot-cli/cli-best-practices) 以獲取來自 GitHub 的建議工作流程和提示。

- **對於任何非瑣碎的事務，從 `/plan` 開始**。在執行前精煉計畫——一個好的計畫會帶來更好的結果。
- **儲存運作良好的提示詞。** 當 Copilot CLI 出錯時，記下哪裡出了問題。久而久之，這將成為你的個人策略指南。
- **自由實驗。** 一些開發者偏好長而詳細的提示。其他人偏好短提示配合後續跟進。嘗試不同的方法並留意哪種感覺最自然。

> 💡 **預告**：在第 04 和 05 章中，你將學習如何將你的最佳實作編碼為 Copilot CLI 自動載入的自訂指示和技能。

---

## ➡️ 下一步

其餘章節涵蓋了擴展 Copilot CLI 功能的其他特性：

| 章節 | 涵蓋內容 | 你何時會需要它 |
|---------|----------------|---------------------|
| 第 04 章：代理程式 | 建立專門的 AI 人格 | 當你需要領域專家 (前端、安全) 時 |
| 第 05 章：技能 | 為任務自動載入指示 | 當你經常重複相同的提示時 |
| 第 06 章：MCP | 連接外部服務 | 當你需要來自 GitHub、資料庫的即時資料時 |

**建議**：嘗試核心工作流程一週，然後在你具備特定需求時返回閱讀第 04-06 章。

---

## 繼續閱讀其他主題

在 **[第 04 章：代理程式與自訂指示](../04-agents-custom-instructions/README.md)** 中，你將學習：

- 使用內建代理程式 (`/plan`, `/review`)
- 使用 `.agent.md` 檔案建立專門的代理程式 (前端專家、安全稽核員)
- 多代理程式協作模式
- 用於專案標準的自訂指示檔案

---

**[← 返回第 02 章](../02-context-conversations/README.md)** | **[繼續前往第 04 章 →](../04-agents-custom-instructions/README.md)**
