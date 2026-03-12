/**
 * 業務邏輯的使用者服務
 */

const userCache = {};

async function getUser(userId) {
  // 先檢查快取
  if (userCache[userId]) {
    return userCache[userId];
  }

  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) {
    throw new Error('找不到使用者');
  }

  const user = await response.json();
  userCache[userId] = user;
  return user;
}

async function updateUser(userId, updates) {
  const response = await fetch(`/api/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });

  if (!response.ok) {
    throw new Error('更新使用者失敗');
  }

  const user = await response.json();
  userCache[userId] = user; // 更新快取
  return user;
}

async function deleteUser(userId) {
  const response = await fetch(`/api/users/${userId}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    throw new Error('刪除使用者失敗');
  }

  delete userCache[userId]; // 從快取中清除
}

function clearCache() {
  Object.keys(userCache).forEach(key => delete userCache[key]);
}

module.exports = {
  getUser,
  updateUser,
  deleteUser,
  clearCache
};
