# user_service.py - 包含刻意設計的錯誤之範例程式碼，用於練習
# 使用此檔案練習使用 GitHub Copilot CLI 進行程式碼審查和除錯
#
# 嘗試這些指令：
#   copilot --allow-all -p "審查 @samples/buggy-code/python/user_service.py 的安全性問題"
#   copilot --allow-all -p "找出 @samples/buggy-code/python/user_service.py 中的所有錯誤"

import sqlite3
import hashlib

# BUG 1: SQL 隱碼攻擊
# user_id 直接內插到查詢字串中
def get_user(user_id):
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM users WHERE id = {user_id}")
    return cursor.fetchone()


# BUG 2: 競態條件
# 在快取設定前，多個請求可能觸發並行的資料庫呼叫
user_cache = {}

def get_cached_user(user_id):
    if user_id not in user_cache:
        user_cache[user_id] = get_user(user_id)
    return user_cache[user_id]


# BUG 3: SQL 隱碼攻擊 + 無錯誤處理
# SQL 中的字串內插且沒有 try/except
def update_user(user_id, data):
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute(f"UPDATE users SET name = '{data['name']}' WHERE id = {user_id}")
    conn.commit()
    return get_user(user_id)


# BUG 4: 日誌中包含敏感資料
# 密碼以純文字形式記錄
def login(email, password):
    print(f"登入嘗試：{email} / {password}")
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM users WHERE email = '{email}'")
    user = cursor.fetchone()
    if user and user['password'] == password:
        return {"success": True, "user": user}
    return {"success": False}


# BUG 5: 弱密碼比較
# 使用 == 進行密碼比較（易受時序攻擊）且使用純文字密碼
def verify_password(input_password, stored_password):
    return input_password == stored_password


# BUG 6: 無輸入驗證
# 直接使用使用者輸入，未經任何驗證
def create_user(user_data):
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    query = f"INSERT INTO users (name, email, password) VALUES ('{user_data['name']}', '{user_data['email']}', '{user_data['password']}')"
    cursor.execute(query)
    conn.commit()


# BUG 7: 硬編碼金鑰
# JWT 密鑰應放在環境變數中
JWT_SECRET = "super-secret-key-12345"

def generate_token(user_id):
    import jwt
    return jwt.encode({"user_id": user_id}, JWT_SECRET, algorithm="HS256")


# BUG 8: 缺少身分驗證檢查
# 此函式應驗證使用者是否有權限執行刪除
def delete_user(user_id):
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute(f"DELETE FROM users WHERE id = {user_id}")
    conn.commit()


# BUG 9: 弱雜湊 (Python 專屬)
# MD5 在密碼學上已遭破解，不適用於密碼雜湊
def hash_password(password):
    return hashlib.md5(password.encode()).hexdigest()


# BUG 10: Pickle 反序列化 (Python 專屬)
# 使用 pickle 反序列化不可信的資料非常危險
import pickle
import base64

def load_user_preferences(encoded_data):
    decoded = base64.b64decode(encoded_data)
    return pickle.loads(decoded)  # 遠端程式碼執行弱點！
