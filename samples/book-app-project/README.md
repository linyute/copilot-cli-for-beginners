# 圖書收藏應用程式 (Book Collection App)

*(此 README 故意寫得很簡略，以便你可以使用 GitHub Copilot CLI 改進它)*

一個用於管理你擁有的或想讀的書籍的 Python 應用程式。
它可以新增、移除、列出書籍，並將其標記為已讀。

---

## 目前功能

* 從 JSON 檔案 (我們的資料庫) 讀取書籍
* 某些區域的輸入檢查較弱
* 存在一些測試，但可能不夠

---

## 檔案

* `book_app.py` - 主要 CLI 入口點
* `books.py` - 包含資料邏輯的 BookCollection 類別
* `utils.py` - 用於 UI 和輸入的輔助函式
* `data.json` - 範例圖書資料
* `tests/test_books.py` - 入門級 pytest 測試

---

## 執行應用程式

```bash
python book_app.py list
python book_app.py add
python book_app.py find
python book_app.py remove
python book_app.py help
```

## 執行測試

```bash
python -m pytest tests/
```

---

## 附註

* 並非生產就緒版本 (Production-ready) (顯而易見)
* 某些程式碼可以改進
* 稍後可以新增更多指令
