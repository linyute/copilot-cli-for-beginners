---
name: commit-message
description: 產生慣例提交訊息——在建立提交、撰寫提交訊息或尋求 git 提交協助時使用
---

# 提交訊息技能 (Commit Message Skill)

遵循慣例提交 (Conventional Commits) 規範產生提交訊息。

## 格式

```
<類型>(<範圍>): <說明>

[選填的主體]

[選填的頁尾]
```

## 類型

| 類型 | 何時使用 |
|------|-------------|
| `feat` | 新功能 |
| `fix` | 漏洞修正 |
| `docs` | 僅文件變更 |
| `style` | 格式化 (無程式碼變更) |
| `refactor` | 既非修正也非新增功能的程式碼變更 |
| `perf` | 效能改進 |
| `test` | 新增或更新測試 |
| `chore` | 維護任務 |

## 規則

1. 主旨行長度最多 72 個字元
2. 使用祈使句 (例如用 "add" 而不是 "added" 或 "adds")
3. 主旨行末尾不加句點
4. 主旨與主體之間以空行隔開
5. 主體解釋**做了什麼**以及**為什麼**，而不是如何做

## 範例

簡單範例：
```
fix(auth): prevent redirect loop on expired sessions
```

包含主體：
```
feat(api): add rate limiting to public endpoints

- Limits requests to 100/minute per IP
- Returns 429 status with retry-after header
- Configurable via RATE_LIMIT_MAX env variable

Closes #234
```
