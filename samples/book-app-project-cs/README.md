# 圖書收藏應用程式 (Book Collection App)

*(此 README 故意寫得很簡略，以便你可以使用 GitHub Copilot CLI 改進它)*

一個用於管理你擁有的或想讀的書籍的 C# 主控台應用程式。
它可以新增、移除、列出書籍，並將其標記為已讀。

---

## 目前功能

* 從 JSON 檔案 (我們的資料庫) 讀取書籍
* 某些區域的輸入檢查較弱
* 存在一些測試，但可能不夠

---

## 檔案

* `Program.cs` - 主要 CLI 入口點
* `Models/Book.cs` - 圖書模型類別
* `Services/BookCollection.cs` - 包含資料邏輯的 BookCollection 類別
* `data.json` - 範例圖書資料
* `Tests/BookCollectionTests.cs` - xUnit 測試

---

## 執行應用程式

```bash
dotnet run -- list
dotnet run -- add
dotnet run -- find
dotnet run -- remove
dotnet run -- help
```

## 執行測試

```bash
cd Tests
dotnet test
```

---

## 附註

* 並非生產就緒版本 (Production-ready) (顯而易見)
* 某些程式碼可以改進
* 稍後可以新增更多指令
