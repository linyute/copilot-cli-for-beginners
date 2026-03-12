---
name: pytest-gen
description: 產生全面的 pytest 測試——在產生測試、建立測試套件或測試 Python 程式碼時使用
---

# Pytest 產生技能 (Pytest Generation Skill)

產生測試時，請遵循此結構。

## 測試組織

- 依受測函式對測試進行分組
- 使用 `@pytest.mark.parametrize` 處理多個輸入
- 使用固定裝置 (fixtures) 進行共享設定
- 遵循安排/執行/斷言 (arrange/act/assert) 模式

## 覆蓋率要求

- 成功路徑 (預期用法)
- 邊際情況 (空字串、None、邊界值)
- 錯誤情況 (無效輸入、找不到檔案、錯誤類型)
- 整合 (多個函式協同工作)

## 模板 (Template)

```python
import pytest
from module_under_test import function_to_test


@pytest.fixture
def sample_data():
    """提供共享的測試資料。"""
    return {"key": "value"}


class TestFunctionName:
    """function_name 的測試。"""

    def test_happy_path(self, sample_data):
        result = function_to_test(valid_input)
        assert result == expected_output

    def test_empty_input(self):
        result = function_to_test("")
        assert result == expected_for_empty

    @pytest.mark.parametrize("input_val,expected", [
        ("valid", True),
        ("", False),
        (None, False),
    ])
    def test_various_inputs(self, input_val, expected):
        assert function_to_test(input_val) == expected
```
