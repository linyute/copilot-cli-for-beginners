# 漏洞程式碼範例 (Buggy Code Samples)

此資料夾包含故意設計的漏洞程式碼，用於練習使用 GitHub Copilot CLI 進行程式碼審查和除錯。

## 資料夾結構

```
buggy-code/
├── js/                    # JavaScript 範例
│   ├── userService.js     # 包含 8 個漏洞的使用者管理
│   └── paymentProcessor.js # 包含 8 個漏洞的付款處理
└── python/                # Python 範例
    ├── user_service.py    # 包含 10 個漏洞的使用者管理
    └── payment_processor.py # 包含 12 個漏洞的付款處理
```

## 快速入門

### JavaScript

```bash
copilot

# 安全稽核
> Review @samples/buggy-code/js/userService.js for security issues

# 尋找所有漏洞
> Find all bugs in @samples/buggy-code/js/paymentProcessor.js
```

### Python

```bash
copilot

# 安全稽核
> Review @samples/buggy-code/python/user_service.py for security issues

# 尋找所有漏洞
> Find all bugs in @samples/buggy-code/python/payment_processor.py
```

## 漏洞類別

### 兩種語言共有的漏洞

| 漏洞類型 | 說明 |
|----------|-------------|
| SQL 插入 (SQL Injection) | 使用者輸入直接置於 SQL 查詢中 |
| 硬編碼的密鑰 (Hardcoded Secrets) | 原始碼中的 API 金鑰和密碼 |
| 競爭條件 (Race Conditions) | 未經適當同步的共享狀態 |
| 敏感資料日誌記錄 | 日誌中包含密碼和卡號 |
| 缺少輸入驗證 | 未對使用者提供的資料進行檢查 |
| 無錯誤處理 | 缺少 try/catch 或 try/except 區塊 |
| 弱密碼比較 | 明文比較或容易受到計時攻擊的比較 |
| 缺少驗證檢查 | 未經身份驗證驗證的操作 |

### Python 特定漏洞

| 漏洞類型 | 說明 |
|----------|-------------|
| Pickle 反序列化 | 對不受信任的資料執行 `pickle.loads()` |
| eval() 插入 | 使用者輸入傳遞給 `eval()` |
| 不安全的 YAML 載入 | 未使用安全載入器的 `yaml.load()` |
| Shell 插入 | `os.system()` 呼叫中的使用者輸入 |
| 弱雜湊 (Weak Hashing) | 使用 MD5 進行密碼雜湊 |
| 不安全的隨機數 | 基於安全目的使用 `random` 模組 |

## 練習題

1. **安全稽核**：執行全面的安全審查，並按嚴重程度列出所有漏洞
2. **修正一個漏洞**：挑選一個關鍵漏洞，從 Copilot 獲取修正方案，並理解其運作原理
3. **產生測試**：建立能在部署前捕捉到這些漏洞的測試
4. **安全地重構**：在保持功能的同時修正 SQL 插入漏洞
