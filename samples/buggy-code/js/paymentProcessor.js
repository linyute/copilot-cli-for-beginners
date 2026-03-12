// paymentProcessor.js - 包含刻意設計的錯誤之範例程式碼，用於除錯練習
//
// 嘗試：copilot --allow-all -p "除錯 @samples/buggy-code/js/paymentProcessor.js"

const stripe = require('stripe');

// BUG 1: API 金鑰硬編碼 (應放在環境變數中)
const stripeClient = stripe('sk_test_4eC39HqLyjWDarjtT1zdp7dc');

// BUG 2: 無輸入驗證
async function processPayment(amount, currency, cardToken) {
  const charge = await stripeClient.charges.create({
    amount: amount,
    currency: currency,
    source: cardToken,
  });
  return charge;
}

// BUG 3: 使用浮點數運算處理金錢
function calculateTotal(items) {
  let total = 0;
  for (const item of items) {
    total += item.price * item.quantity;
  }
  return total; // 會有浮點數誤差：0.1 + 0.2 = 0.30000000000000004
}

// BUG 4: 無錯誤處理
async function refund(chargeId, amount) {
  const refund = await stripeClient.refunds.create({
    charge: chargeId,
    amount: amount
  });
  return refund;
}

// BUG 5: 餘額檢查中的競態條件 (Race condition)
let accountBalance = 1000;

async function withdraw(amount) {
  if (accountBalance >= amount) {
    // 此處另一個請求可能會修改 accountBalance
    await simulateNetworkDelay();
    accountBalance -= amount;
    return { success: true, newBalance: accountBalance };
  }
  return { success: false, reason: '餘額不足' };
}

function simulateNetworkDelay() {
  return new Promise(resolve => setTimeout(resolve, 100));
}

// BUG 6: 日誌中包含敏感資料
async function logTransaction(transaction) {
  console.log('交易：', JSON.stringify(transaction));
  // 這會記錄信用卡號碼和 CVV！
}

// BUG 7: 收據查詢中的 SQL 隱碼攻擊 (SQL injection)
async function getReceipt(receiptId) {
  return db.query(`SELECT * FROM receipts WHERE id = '${receiptId}'`);
}

// BUG 8: 整數溢位風險
function convertCentsToDollars(cents) {
  return cents / 100;
}

function convertDollarsToCents(dollars) {
  return dollars * 100; // 可能導致浮點數問題
}

module.exports = {
  processPayment,
  calculateTotal,
  refund,
  withdraw,
  logTransaction,
  getReceipt,
  convertCentsToDollars,
  convertDollarsToCents
};
