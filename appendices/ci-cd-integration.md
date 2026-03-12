# CI/CD 整合

> 📖 **先決條件**：在閱讀此附錄之前，請先完成 [第 07 章：整合應用](../07-putting-it-together/README.md)。
>
> ⚠️ **本附錄適用於擁有現有 CI/CD 管線的團隊。** 如果你剛接觸 GitHub Actions 或 CI/CD 概念，請從第 07 章 [程式碼審查自動化](../07-putting-it-together/README.md#工作流程-2-程式碼審查自動化-選修) 章節中較簡單的預先提交掛鉤 (pre-commit hook) 方法開始。

本附錄展示了如何將 GitHub Copilot CLI 整合到你的 CI/CD 管線中，以便對提取請求 (pull requests) 進行自動化的程式碼審查。

---

## GitHub Actions 工作流程

當提取請求開啟或更新時，此工作流程會自動審查變更的檔案：

```yaml
# .github/workflows/copilot-review.yml
name: Copilot Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # 需要與 main 分支進行比較

      - name: Install Copilot CLI
        run: npm install -g @github/copilot

      - name: Review Changed Files
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          # 取得變更的 JS/TS 檔案清單
          FILES=$(git diff --name-only origin/main...HEAD | grep -E '\.(js|ts|jsx|tsx)$' || true)
          
          if [ -z "$FILES" ]; then
            echo "No JavaScript/TypeScript files changed"
            exit 0
          fi
          
          echo "# Copilot Code Review" > review.md
          echo "" >> review.md
          
          for file in $FILES; do
            echo "Reviewing $file..."
            echo "## $file" >> review.md
            echo "" >> review.md
            
            # 使用 --silent 抑制進度輸出
            copilot --allow-all -p "Quick security and quality review of @$file. List only critical issues." --silent >> review.md 2>/dev/null || echo "Review skipped" >> review.md
            echo "" >> review.md
          done

      - name: Post Review Comment
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const review = fs.readFileSync('review.md', 'utf8');
            
            // 僅在有實質內容時發布
            if (review.includes('CRITICAL') || review.includes('HIGH')) {
              github.rest.issues.createComment({
                issue_number: context.issue.number,
                owner: context.repo.owner,
                repo: context.repo.repo,
                body: review
              });
            } else {
              console.log('No critical issues found, skipping comment');
            }
```

---

## 設定選項

### 限制審查範圍

你可以將審查重點放在特定類型的問題上：

```yaml
# 僅限安全審查
copilot --allow-all -p "Security review of @$file. Check for: SQL injection, XSS, hardcoded secrets, authentication issues." --silent

# 僅限效能審查
copilot --allow-all -p "Performance review of @$file. Check for: N+1 queries, memory leaks, blocking operations." --silent
```

### 處理大型 PR

對於包含許多檔案的 PR，請考慮分批處理或限制數量：

```yaml
# 僅限前 10 個檔案
FILES=$(git diff --name-only origin/main...HEAD | grep -E '\.(js|ts)$' | head -10)

# 或為每個檔案設定逾時
timeout 60 copilot --allow-all -p "Review @$file" --silent || echo "Review timed out"
```

### 團隊設定

為了在整個團隊中實現一致的審查，請建立共享設定：

```json
// .copilot/config.json (提交至儲存庫)
{
  "model": "claude-sonnet-4.5",
  "permissions": {
    "allowedPaths": ["src/**/*", "tests/**/*"],
    "deniedPaths": [".env*", "secrets/**/*", "*.min.js"]
  }
}
```

---

## 替代方案：PR 審查機器人

對於更複雜的審查工作流程，請考慮使用 Copilot 編碼代理程式：

```yaml
# .github/workflows/copilot-agent-review.yml
name: Request Copilot Review

on:
  pull_request:
    types: [opened, ready_for_review]

jobs:
  request-review:
    runs-on: ubuntu-latest
    steps:
      - name: Request Copilot Review
        uses: actions/github-script@v7
        with:
          script: |
            await github.rest.pulls.requestReviewers({
              owner: context.repo.owner,
              repo: context.repo.repo,
              pull_number: context.issue.number,
              reviewers: ['copilot[bot]']
            });
```

---

## CI/CD 整合的最佳實作

1. **使用 `--silent` 旗標** - 抑制進度輸出，使日誌更乾淨
2. **設定逾時 (Timeouts)** - 防止掛起的審查阻塞你的管線
3. **過濾檔案類型** - 僅審查相關檔案 (跳過產生的程式碼、依賴項)
4. **費率限制意識** - 為大型 PR 的審查留出間隔時間
5. **優雅失敗** - 不要因為審查失敗而阻止合併；記錄日誌並繼續

---

## 疑難排解

### CI 中的「驗證失敗」

確保你的工作流程具備正確的權限：

```yaml
permissions:
  contents: read
  pull-requests: write
  issues: write
```

### 審查逾時

增加逾時時間或縮小範圍：

```bash
timeout 120 copilot --allow-all -p "Quick review of @$file - critical issues only" --silent
```

### 大型檔案中的權杖 (Token) 限制

跳過非常大的檔案：

```bash
if [ $(wc -l < "$file") -lt 500 ]; then
  copilot --allow-all -p "Review @$file" --silent
else
  echo "Skipping $file (too large)"
fi
```

---

**[← 返回第 07 章](../07-putting-it-together/README.md)** | **[返回附錄](README.md)**
