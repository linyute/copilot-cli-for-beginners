# 圖書應用程式 - 漏洞版本 (Buggy Version)

此目錄包含一個故意設計的圖書收藏應用程式漏洞版本，用於第 03 章的除錯練習。

**請勿直接修正這些漏洞。** 它們的存在是為了讓學習者練習使用 GitHub Copilot CLI 來識別和偵測問題。

---

## 故意的程式碼漏洞

### books_buggy.py

| # | 漏洞 (Bug) | 症狀 (Symptom) |
|---|-----|---------|
| 1 | `find_book_by_title()` 使用精確的大小寫匹配 | 搜尋 "the hobbit" 沒有回傳任何結果，即使 "The Hobbit" 存在 |
| 2 | `save_books()` 未使用內容管理器 | 檔案句柄洩漏 (File handle leak)；對權限問題沒有錯誤處理 |
| 3 | `add_book()` 沒有年份驗證 | 接受負數年份、年份 0 以及遙遠未來的年份 |
| 4 | `remove_book()` 使用 `in` 子字串檢查 | 移除 "Dune" 時也會匹配並移除 "Dune Messiah" |
| 5 | `mark_as_read()` 將「所有」書籍標記為已讀 | 迴圈變數漏洞 - 迭代所有書籍而不是僅匹配項 |
| 6 | `find_by_author()` 要求精確匹配 | "Tolkien" 找不到 "J.R.R. Tolkien" (無部分匹配) |

### book_app_buggy.py

| # | 漏洞 (Bug) | 症狀 (Symptom) |
|---|-----|---------|
| 7 | `show_books()` 編號從 0 開始 | 書籍顯示為 "0. ...", "1. ..." 而不是 "1. ...", "2. ..." |
| 8 | `handle_add()` 接受空的標題/作者 | 可以新增標題和作者為空白的書籍 |
| 9 | `handle_remove()` 始終列印成功訊息 | 即使找不到書籍也會顯示「Book removed」 |

---

## 如何在第 03 章中使用

```bash
copilot

> @samples/book-app-buggy/books_buggy.py Users report that searching for
> "The Hobbit" returns no results even though it's in the data. Debug why.

> @samples/book-app-buggy/book_app_buggy.py When I remove a book that
> doesn't exist, the app says it was removed. Help me find why.
```
