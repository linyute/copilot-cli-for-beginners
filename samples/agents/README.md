# 範例代理程式定義

此資料夾包含一些用於 GitHub Copilot CLI 的簡單代理程式 (agent) 模板，旨在幫助你開始使用代理程式。

## 快速入門

```bash
# 將代理程式複製到你的個人代理程式資料夾
cp hello-world.agent.md ~/.copilot/agents/

# 或複製到你的專案以進行團隊共享
cp python-reviewer.agent.md .github/agents/
```

## 此資料夾中的範例檔案

| 檔案 | 說明 | 最適合用於 |
|------|-------------|----------|
| `hello-world.agent.md` | 最小範例 (11 行) | 學習格式 |
| `python-reviewer.agent.md` | Python 程式碼品質審查員 | 程式碼審查、PEP 8、類型提示 |
| `pytest-helper.agent.md` | Pytest 測試專家 | 測試產生、fixture、邊際情況 |

## 尋找更多代理程式

- **[github/awesome-copilot](https://github.com/github/awesome-copilot)** - 官方 GitHub 資源，包含社群代理程式與指示

---

## 代理程式檔案格式

每個代理程式檔案都需要帶有至少包含 `description` 欄位的 YAML Frontmatter：

```markdown
---
name: my-agent
description: 簡要說明此代理程式的作用
tools: ["read", "edit", "search"]  # 選填：限制可用工具
---

# 代理程式名稱

代理程式指示寫在這裡...
```

**可用的 YAML 屬性：**

| 屬性 | 必填 | 說明 |
|----------|----------|-------------|
| `description` | **是** | 代理程式的作用 |
| `name` | 否 | 顯示名稱 (預設為檔案名稱) |
| `tools` | 否 | 允許的工具清單 (省略 = 全部允許)。請參閱下方的別名。 |
| `target` | 否 | 僅限於 `vscode` 或 `github-copilot` |

**工具別名**：`read`, `edit`, `search`, `execute` (shell), `web`, `agent`

> 💡 **注意**：`model` 屬性在 VS Code 中可以運作，但 Copilot CLI 尚未支援。
>
> 📖 **官方文件**：[自訂代理程式設定 (Custom agents configuration)](https://docs.github.com/copilot/reference/custom-agents-configuration)

## 代理程式檔案位置

代理程式可以儲存在：
- `~/.copilot/agents/` - 適用於所有專案的全域代理程式
- `.github/agents/` - 專案特定代理程式
- `.agent.md` 檔案 - 相容於 VS Code 的格式

每個代理程式都是一個擴展名為 `.agent.md` 的獨立檔案。

---

## 用法範例

```bash
# 使用特定的代理程式啟動
copilot --agent python-reviewer

# 或在階段中互動式地選擇代理程式
copilot
> /agent
# 從清單中選擇 "python-reviewer"

# 代理程式的專業知識將套用於你的提示
> @samples/book-app-project/books.py Review this code for quality issues

# 切換到不同的代理程式
> /agent
# 選擇 "pytest-helper"

> @samples/book-app-project/tests/test_books.py What additional tests should we add?
```

---

## 建立你自己的代理程式

1. 在 `~/.copilot/agents/` 中建立一個具有 `.agent.md` 擴展名的新檔案
2. 新增帶有至少一個 `description` 欄位的 YAML Frontmatter
3. 新增描述性的標頭 (例如 `# Security Agent`)
4. 定義代理程式的專業知識、標準和行為
5. 使用 `/agent` 或 `--agent <名稱>` 來使用該代理程式

**高效代理程式的提示：**
- 明確說明專業領域
- 包含程式碼標準與模式
- 定義代理程式要檢查的內容
- 包含輸出的格式偏好
