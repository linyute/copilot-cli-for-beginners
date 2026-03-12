/**
 * 登入表單處理常式
 */

async function handleLogin(email, password) {
  // 基本驗證
  if (!email || !password) {
    throw new Error('需要電子郵件和密碼');
  }

  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || '登入失敗');
  }

  const data = await response.json();

  // 儲存權杖 (Token)
  localStorage.setItem('authToken', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));

  return data.user;
}

function isLoggedIn() {
  return !!localStorage.getItem('authToken');
}

function logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  window.location.href = '/login';
}

function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

module.exports = {
  handleLogin,
  isLoggedIn,
  logout,
  getCurrentUser
};
