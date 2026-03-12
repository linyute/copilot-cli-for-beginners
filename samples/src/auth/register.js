/**
 * 註冊表單處理常式
 */

async function handleRegister(name, email, password, confirmPassword) {
  // 驗證
  if (!name || !email || !password) {
    throw new Error('所有欄位皆為必填');
  }

  if (password !== confirmPassword) {
    throw new Error('密碼不相符');
  }

  if (password.length < 8) {
    throw new Error('密碼長度必須至少為 8 個字元');
  }

  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || '註冊失敗');
  }

  const data = await response.json();

  // 註冊後自動登入
  localStorage.setItem('authToken', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));

  return data.user;
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  return {
    length: password.length >= 8,
    hasNumber: /\d/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasSpecial: /[!@#$%^&*]/.test(password)
  };
}

module.exports = {
  handleRegister,
  validateEmail,
  validatePassword
};
