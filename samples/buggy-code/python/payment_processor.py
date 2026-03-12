# payment_processor.py - 包含刻意設計的錯誤之範例程式碼，用於除錯練習
#
# 嘗試：copilot --allow-all -p "除錯 @samples/buggy-code/python/payment_processor.py"

import os
import sqlite3
from decimal import Decimal

# BUG 1: API 金鑰硬編碼 (應放在環境變數中)
STRIPE_API_KEY = "sk_test_4eC39HqLyjWDarjtT1zdp7dc"


# BUG 2: 無輸入驗證
def process_payment(amount, currency, card_token):
    import stripe
    stripe.api_key = STRIPE_API_KEY
    charge = stripe.Charge.create(
        amount=amount,
        currency=currency,
        source=card_token
    )
    return charge


# BUG 3: 使用浮點數運算處理金錢
def calculate_total(items):
    total = 0.0
    for item in items:
        total += item['price'] * item['quantity']
    return total  # 會有浮點數誤差：0.1 + 0.2 = 0.30000000000000004


# BUG 4: 無錯誤處理
def refund(charge_id, amount):
    import stripe
    stripe.api_key = STRIPE_API_KEY
    refund = stripe.Refund.create(
        charge=charge_id,
        amount=amount
    )
    return refund


# BUG 5: 餘額檢查中的競態條件 (Race condition)
account_balance = 1000.0

async def withdraw(amount):
    global account_balance
    if account_balance >= amount:
        # 此處另一個請求可能會修改 account_balance
        import asyncio
        await asyncio.sleep(0.1)  # 模擬網路延遲
        account_balance -= amount
        return {"success": True, "new_balance": account_balance}
    return {"success": False, "reason": "餘額不足"}


# BUG 6: 日誌中包含敏感資料
def log_transaction(transaction):
    print(f"交易：{transaction}")
    # 這會記錄信用卡號碼和 CVV！


# BUG 7: 收據查詢中的 SQL 隱碼攻擊 (SQL injection)
def get_receipt(receipt_id):
    conn = sqlite3.connect('payments.db')
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM receipts WHERE id = '{receipt_id}'")
    return cursor.fetchone()


# BUG 8: 整數溢位風險 / 精度損失
def convert_cents_to_dollars(cents):
    return cents / 100


def convert_dollars_to_cents(dollars):
    return dollars * 100  # 可能導致浮點數問題


# BUG 9: 交易 ID 使用不安全的隨機數 (Python 專屬)
import random

def generate_transaction_id():
    # random 模組在密碼學上是不安全的！
    return random.randint(100000, 999999)


# BUG 10: 對使用者輸入使用 eval() (Python 專屬)
def calculate_discount(formula, price):
    # 使用者控制的公式傳遞給 eval - 程式碼注入！
    discount = eval(formula)
    return price - discount


# BUG 11: Shell 注入 (Python 專屬)
def export_transactions(filename):
    # shell 指令中使用使用者控制的檔名
    os.system(f"cat transactions.log > {filename}")


# BUG 12: YAML 不安全載入 (Python 專屬)
import yaml

def load_pricing_config(config_string):
    # 未使用 Loader 的 yaml.load 易受程式碼執行攻擊
    return yaml.load(config_string)  # 應使用 yaml.safe_load()
