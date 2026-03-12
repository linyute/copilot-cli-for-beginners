# 範例技能 (Sample Skills)

用於 GitHub Copilot CLI 的即用型技能模板。複製任何技能資料夾即可立即開始使用。

## 快速入門

```bash
# 將技能複製到你的個人技能資料夾
cp -r hello-world ~/.copilot/skills/

# 或複製到你的專案以進行團隊共享
cp -r code-checklist .github/skills/
```

## 可用技能

| 技能 | 說明 | 最適合用於 |
|-------|-------------|----------|
| `hello-world` | 最小範例 (學習格式) | 初次建立技能者 |
| `code-checklist` | Python 程式碼品質檢查表 (PEP 8、類型提示、驗證) | 一致的品質檢查 |
| `pytest-gen` | 產生全面的 pytest 測試 | 結構化的測試產生 |
| `commit-message` | 慣例提交訊息 | 標準化的 git 歷史紀錄 |

## 技能如何運作

當你的提示符合技能的 `description` 欄位時，技能會**自動觸發**。你不需要手動呼叫它們。

```bash
copilot

> Check this code for quality issues
# Copilot 偵測到這符合 "code-checklist" 技能並自動載入

> Generate a commit message
# Copilot 載入 "commit-message" 技能
```

你也可以直接呼叫技能：
```bash
> /code-checklist Check books.py
> /pytest-gen Generate tests for BookCollection
> /commit-message
```

## 技能結構

每個技能都是一個包含 `SKILL.md` 檔案的資料夾：

```
skill-name/
└── SKILL.md    # 必填：包含 Frontmatter + 指示
```

`SKILL.md` 檔案具有包含 `name` 和 `description` (均為必填) 的 YAML Frontmatter：

```markdown
---
name: my-skill
description: 說明此技能的作用以及何時使用它
---

# 技能指示

你的指示寫在這裡...
```

## 尋找更多技能

- **[github/awesome-copilot](https://github.com/github/awesome-copilot)** - 包含社群技能的官方 GitHub 資源
- **`/plugin marketplace`** - 從 Copilot CLI 內部瀏覽並安裝技能

## 建立你自己的技能

1. 建立資料夾：`mkdir ~/.copilot/skills/my-skill`
2. 建立帶有 Frontmatter 的 `SKILL.md`
3. 新增你的指示
4. 透過向 Copilot 詢問符合你說明的內容來進行測試

詳情請參閱 [第 05 章：技能 (Skills)](../../05-skills/README.md)。
