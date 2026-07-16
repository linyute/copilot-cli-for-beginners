---
applyTo: "**/*.py"
---

# Python 標準規範

這些規則會在 Copilot 處理此專案中的 Python 檔案時自動套用。它們不會載入其他檔案類型，因此關於 Dockerfile 或 JSON 的對話不會造成干擾。

## 程式碼風格

- 遵循 PEP 8 風格規範。
- 為每個函數簽名添加類型提示（type hints）。
- 優先使用 f-string，而非 `%` 格式化或 `str.format()`。

## 錯誤處理

- 捕獲特定異常；切勿使用空的 `except:`。
- 在函數邊界驗證輸入，並提供清晰的錯誤訊息。

## 測試

- 將 pytest 測試放在 `samples/book-app-project/tests/` 目錄中，使用 `test_*.py` 命名。
- 涵蓋正常情況和邊緣案例（空輸入、缺失資料）。
