# 建構自訂 MCP 伺服器

> ⚠️ **此內容完全是選修的。** 僅使用預建的 MCP 伺服器 (GitHub、檔案系統、Context7)，你就能在使用 Copilot CLI 時具備極高生產力。本指南適用於想要將 Copilot 連接到自訂內部 API 的開發者。詳情請參閱 [MCP 初學者課程](https://github.com/microsoft/mcp-for-beginners)。
>
> **先決條件：**
> - 熟悉 Python
> - 理解 `async`/`await` (非同步) 模式
> - 系統中已安裝 `pip` (此開發容器中已包含)
>
> **[← 返回第 06 章：MCP 伺服器](README.md)**

---

想將 Copilot 連接到你自己的 API 嗎？以下是如何用 Python 建構一個簡單的 MCP 伺服器，用於查閱圖書資訊，並與你在本課程中一直使用的圖書應用程式專案相結合。

## 專案設定

```bash
mkdir book-lookup-mcp-server
cd book-lookup-mcp-server
pip install mcp
```

> 💡 **什麼是 `mcp` 套件？** 它是用於建構 MCP 伺服器的官方 Python SDK。它負責處理協定細節，讓你專注於開發自己的工具。

## 伺服器實作

建立一個名為 `server.py` 的檔案：

```python
# server.py
import json
from mcp.server.fastmcp import FastMCP

# 建立 MCP 伺服器
mcp = FastMCP("book-lookup")

# 範例圖書資料庫 (在真實伺服器中，這可以查詢 API 或資料庫)
BOOKS_DB = {
    "978-0-547-92822-7": {
        "title": "The Hobbit",
        "author": "J.R.R. Tolkien",
        "year": 1937,
        "genre": "Fantasy",
    },
    "978-0-451-52493-5": {
        "title": "1984",
        "author": "George Orwell",
        "year": 1949,
        "genre": "Dystopian Fiction",
    },
    "978-0-441-17271-9": {
        "title": "Dune",
        "author": "Frank Herbert",
        "year": 1965,
        "genre": "Science Fiction",
    },
}


@mcp.tool()
def lookup_book(isbn: str) -> str:
    """根據 ISBN 查閱書籍並回傳標題、作者、年份和類型。"""
    book = BOOKS_DB.get(isbn)
    if book:
        return json.dumps(book, indent=2)
    return f"找不到 ISBN 為 {isbn} 的書籍"


@mcp.tool()
def search_books(query: str) -> str:
    """根據標題或作者搜尋書籍。回傳所有匹配的結果。"""
    query_lower = query.lower()
    results = [
        {**book, "isbn": isbn}
        for isbn, book in BOOKS_DB.items()
        if query_lower in book["title"].lower()
        or query_lower in book["author"].lower()
    ]
    if results:
        return json.dumps(results, indent=2)
    return f"找不到匹配 {query} 的書籍"


@mcp.tool()
def list_all_books() -> str:
    """列出資料庫中的所有書籍及其 ISBN。"""
    books_list = [
        {"isbn": isbn, "title": book["title"], "author": book["author"]}
        for isbn, book in BOOKS_DB.items()
    ]
    return json.dumps(books_list, indent=2)


if __name__ == "__main__":
    mcp.run()
```

**這裡發生了什麼：**

| 部分 | 作用 |
|------|-------------|
| `FastMCP("book-lookup")` | 建立名為 "book-lookup" 的伺服器 |
| `@mcp.tool()` | 將函式註冊為 Copilot 可以呼叫的工具 |
| 類型提示 + docstrings | 告訴 Copilot 每個工具的作用以及它需要的參數 |
| `mcp.run()` | 啟動伺服器並監聽請求 |

> 💡 **為什麼使用裝飾器 (decorators)？** 你只需要 `@mcp.tool()` 裝飾器。MCP SDK 會自動讀取你的函式名稱、類型提示和 docstring 來產生工具結構 (schema)。不需要手動撰寫 JSON schema！

## 設定

新增至你的 `~/.copilot/mcp-config.json`：

```json
{
  "mcpServers": {
    "book-lookup": {
      "type": "local",
      "command": "python3",
      "args": ["./book-lookup-mcp-server/server.py"],
      "tools": ["*"]
    }
  }
}
```

## 用法

```bash
copilot

> Look up the book with ISBN 978-0-547-92822-7

{
  "title": "The Hobbit",
  "author": "J.R.R. Tolkien",
  "year": 1937,
  "genre": "Fantasy"
}

> Search for books by Orwell

[
  {
    "title": "1984",
    "author": "George Orwell",
    "year": 1949,
    "genre": "Dystopian Fiction",
    "isbn": "978-0-451-52493-5"
  }
]

> List all available books

[顯示資料庫中帶有 ISBN 的所有書籍]
```

## 下一步

建構好基礎伺服器後，你可以：

1. **新增更多工具** - 每個 `@mcp.tool()` 函式都會成為 Copilot 可以呼叫的工具
2. **連接真實的 API** - 將模擬的 `BOOKS_DB` 替換為實際的 API 呼叫或資料庫查詢
3. **新增驗證** - 安全地處理 API 金鑰和權杖 (tokens)
4. **分享你的伺服器** - 發佈到 PyPI，以便其他人可以使用 `pip` 安裝

## 資源

- [MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [範例 MCP 伺服器](https://github.com/modelcontextprotocol/servers)
- [MCP 初學者課程](https://github.com/microsoft/mcp-for-beginners)

---

**[← 返回第 06 章：MCP 伺服器](README.md)**
