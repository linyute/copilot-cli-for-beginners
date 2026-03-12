/**
 * 包含刻意設計的程式碼問題之範例檔案，用於重構練習
 *
 * 待尋找的問題：
 * - 變數 'x' 應有具描述性的名稱
 * - processOrder 函式過長
 * - 未使用的變數：unusedCounter, tempData
 */

// 未使用的變數 - 應移除
const unusedCounter = 0;

// 命名不佳的變數 - 'x' 應該像是 'taxRate' 之類的名稱
const x = 0.08;

// 另一個未使用的變數
let tempData = [];

// 此函式過長且做了太多事情
// 應將其拆分為較小的函式
function processOrder(items, customerName, address) {
  // 計算小計
  let subtotal = 0;
  for (let i = 0; i < items.length; i++) {
    subtotal = subtotal + items[i].price * items[i].quantity;
  }

  // 如果訂單金額較大，則套用折扣
  let discount = 0;
  if (subtotal > 100) {
    discount = subtotal * 0.1;
  } else if (subtotal > 50) {
    discount = subtotal * 0.05;
  }

  // 使用 'x'（稅率）計算稅金
  const tax = (subtotal - discount) * x;

  // 計算總計
  const total = subtotal - discount + tax;

  // 格式化收據
  let receipt = '=== 訂單收據 ===\n';
  receipt = receipt + '客戶：' + customerName + '\n';
  receipt = receipt + '地址：' + address + '\n';
  receipt = receipt + '---\n';

  // 將每個項目新增到收據
  for (let i = 0; i < items.length; i++) {
    receipt = receipt + items[i].name + ' x' + items[i].quantity;
    receipt = receipt + ' - $' + (items[i].price * items[i].quantity).toFixed(2) + '\n';
  }

  // 將總計新增到收據
  receipt = receipt + '---\n';
  receipt = receipt + '小計：$' + subtotal.toFixed(2) + '\n';
  if (discount > 0) {
    receipt = receipt + '折扣：-$' + discount.toFixed(2) + '\n';
  }
  receipt = receipt + '稅金：$' + tax.toFixed(2) + '\n';
  receipt = receipt + '總計：$' + total.toFixed(2) + '\n';

  return {
    subtotal: subtotal,
    discount: discount,
    tax: tax,
    total: total,
    receipt: receipt
  };
}

// 範例用法
const sampleItems = [
  { name: 'Widget', price: 25.00, quantity: 2 },
  { name: 'Gadget', price: 15.50, quantity: 3 }
];

const result = processOrder(sampleItems, 'Jane Doe', '123 Main St');
console.log(result.receipt);

module.exports = { processOrder };
