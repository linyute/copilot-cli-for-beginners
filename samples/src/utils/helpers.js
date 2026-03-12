/**
 * 公用程式協助工具函式
 * 用於整個應用程式中的常見操作
 */

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// TODO: 新增輸入驗證
function parseJSON(str) {
  return JSON.parse(str);
}

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

module.exports = {
  formatDate,
  capitalize,
  debounce,
  parseJSON,
  generateId
};
