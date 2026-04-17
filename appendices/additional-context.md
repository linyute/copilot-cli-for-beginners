# 額外的內容功能

> 📖 **先決條件**：在閱讀此附錄之前，請先完成 [第 02 章：內容與對話](../02-context-conversations/README.md)。

本附錄涵蓋了兩個額外的內容功能：處理圖片以及跨多個目錄管理權限。

---

## 處理圖片

你可以使用 `@` 語法在對話中包含圖片。Copilot 可以分析螢幕截圖、模型圖 (mockups)、圖表以及其他視覺內容。

### 基礎圖片引用

```bash
copilot

> @screenshot.png What's happening in this UI?

# Copilot 分析圖片並回應

> @mockup.png @current-design.png Compare these two designs

# 你也可以直接拖放圖片或從剪貼簿貼上
```

### 支援的圖片格式

| 格式 | 最適合用於 |
|--------|----------|
| PNG | 螢幕截圖、UI 模型圖、圖表 |
| JPG/JPEG | 照片、複雜圖片 |
| GIF | 簡單圖表 (僅限第一幀) |
| WebP | 網頁螢幕截圖 |

### 實際圖片使用案例

**1. UI 除錯**
```bash
> @bug-screenshot.png 按鈕沒有正確對齊。哪些 CSS 可能導致此問題？
```

**2. 設計實作**
```bash
> @figma-export.png 撰寫 HTML 和 Tailwind CSS 以匹配此設計
```

**3. 錯誤分析**
```bash
> @error-screenshot.png 此錯誤代表什麼意思，我該如何修正它？
```

**4. 架構審查**
```bash
> @whiteboard-diagram.png 將此架構圖轉換為我可以放入文件的 Mermaid 圖表
```

**5. 前後對比**
```bash
> @before.png @after.png 這兩個版本的 UI 之間發生了什麼變化？
```

### 將圖片與程式碼結合

當圖片與程式碼內容結合時，功能會變得更加強大：

```bash
copilot

> @screenshot-of-bug.png @src/components/Header.jsx
> 螢幕截圖中的標頭看起來不對。程式碼中是什麼原因導致的？
```

### 圖片處理提示

- **裁剪螢幕截圖** 以僅顯示相關部分 (節省內容權杖)
- **使用高對比度** 處理你想要分析的 UI 元件
- **如有需要請加上註解** - 在上傳前圈出或標記出問題區域
- **每個概念一張圖片** - 多張圖片可行，但請保持重點明確

---

## 權限模式

預設情況下，Copilot 可以存取你目前目錄中的檔案。對於其他地方的檔案，你需要授予存取權限。

### 新增目錄

```bash
# 將目錄新增至允許清單
copilot --add-dir /path/to/other/project

# 新增多個目錄
copilot --add-dir ~/workspace --add-dir /tmp
```

### 允許所有路徑

```bash
# 完全停用路徑限制 (請謹慎使用)
copilot --allow-all-paths
```

### 在階段內執行

```bash
copilot

> /add-dir /path/to/other/project
# 現在你可以引用該目錄中的檔案了

> /list-dirs
# 查看所有允許的目錄

> /yolo
# /allow-all 的快速別名 — 自動核准所有權限提示
```

### 用於自動化

```bash
# 為非互動式指令碼允許所有權限
copilot -p "Review @src/" --allow-all

# 或使用好記的別名
copilot -p "Review @src/" --yolo
```

### 何時需要多目錄存取

你將需要這些權限的常見情境：

1. **Monorepo 工作** - 跨套件比較程式碼
2. **跨專案重構** - 更新共享函式庫
3. **文件專案** - 引用多個程式碼庫
4. **遷移工作** - 比較舊的和新的實作

---

**[← 返回第 02 章](../02-context-conversations/README.md)** | **[返回附錄](README.md)**
