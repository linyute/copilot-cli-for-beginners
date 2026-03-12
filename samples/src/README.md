# 範例原始碼 (舊有 - 選修參考)

> **注意**：本課程的主要範例是 `../book-app-project/` 中的 **Python 圖書收藏應用程式**。這些 JS/React 檔案來自早期的課程版本，保留作為想要 JS 範例的學習者的選修額外參考資料。

此資料夾包含範例來源檔案。這些僅為範例，並非旨在成為一個完整執行的應用程式。

## 結構

```
src/
├── api/           # API 路由處理程式
│   ├── auth.js    # 身份驗證端點
│   └── users.js   # 使用者 CRUD 端點
├── auth/          # 客戶端身份驗證處理程式
│   ├── login.js   # 登入表單邏輯
│   └── register.js # 註冊表單邏輯
├── components/    # React 元件
│   ├── Button.jsx # 可重複使用的按鈕
│   └── Header.jsx # 帶有導覽的應用程式標頭
├── models/        # 資料模型
│   └── User.js    # 使用者模型
├── services/      # 商業邏輯
│   ├── productService.js
│   └── userService.js
├── utils/         # 輔助函式
│   └── helpers.js
├── index.js       # 應用程式入口點
└── refactor-me.js # 初學者重構練習 (第 03 章)
```

## 用法

這些檔案在課程範例中使用 `@` 語法引用：

```bash
copilot

> Explain what @samples/src/utils/helpers.js does
> Review @samples/src/api/ for security issues
> Compare @samples/src/auth/login.js and @samples/src/auth/register.js
```

## 重構練習

`refactor-me.js` 檔案是專為第 03 章的重構練習設計的：

```bash
copilot

> @samples/src/refactor-me.js Rename the variable 'x' to something more descriptive
> @samples/src/refactor-me.js This function is too long. Split it into smaller functions.
> @samples/src/refactor-me.js Remove any unused variables
```

## 附註

- 檔案包含故意的 TODO 和輕微問題，供 Copilot 在審查期間發現
- 這是展示用程式碼，並非設計為實際執行。**並非**生產就緒版本
- 用於學習 `@` 檔案引用語法
