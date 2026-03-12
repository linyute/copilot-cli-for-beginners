// userService.js - 包含刻意設計的錯誤之範例程式碼，用於練習
// 使用此檔案練習使用 GitHub Copilot CLI 進行程式碼審查和除錯
//
// 嘗試這些指令：
//   copilot --allow-all -p "審查 @samples/buggy-code/js/userService.js 的安全性問題"
//   copilot --allow-all -p "找出 @samples/buggy-code/js/userService.js 中的所有錯誤"

const db = require('./db');

// BUG 1: SQL 隱碼攻擊 (SQL Injection)
// userId 直接串接到查詢字串中
async function getUser(userId) {
  return db.query(`SELECT * FROM users WHERE id = ${userId}`);
}

// BUG 2: 競態條件 (Race Condition)
// 在快取設定前，多個請求可能觸發並行的資料庫呼叫
let userCache = {};
async function getCachedUser(userId) {
  if (!userCache[userId]) {
    userCache[userId] = await getUser(userId);
  }
  return userCache[userId];
}

// BUG 3: SQL 隱碼攻擊 + 無錯誤處理
// SQL 中的字串內插且沒有 try/catch
async function updateUser(userId, data) {
  await db.query(`UPDATE users SET name = '${data.name}' WHERE id = ${userId}`);
  return getUser(userId);
}

// BUG 4: 日誌中包含敏感資料
// 密碼以純文字形式記錄
async function login(email, password) {
  console.log(`登入嘗試：${email} / ${password}`);
  const user = await db.query(`SELECT * FROM users WHERE email = '${email}'`);
  if (user.password === password) {
    return { success: true, user };
  }
  return { success: false };
}

// BUG 5: 弱密碼比較
// 使用 == 而非 ===，且比較純文字密碼
async function verifyPassword(inputPassword, storedPassword) {
  return inputPassword == storedPassword;
}

// BUG 6: 無輸入驗證
// 直接使用使用者輸入，未經任何驗證
async function createUser(userData) {
  const query = `INSERT INTO users (name, email, password) VALUES ('${userData.name}', '${userData.email}', '${userData.password}')`;
  return db.query(query);
}

// BUG 7: 硬編碼金鑰
// JWT 密鑰應放在環境變數中
const JWT_SECRET = 'super-secret-key-12345';

function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET);
}

// BUG 8: 缺少身分驗證檢查
// 此端點應驗證使用者是否有授權
async function deleteUser(userId) {
  return db.query(`DELETE FROM users WHERE id = ${userId}`);
}

module.exports = {
  getUser,
  getCachedUser,
  updateUser,
  login,
  verifyPassword,
  createUser,
  generateToken,
  deleteUser
};
