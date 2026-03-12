/**
 * 使用者 API 端點
 */
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// 獲取所有使用者
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 依 ID 獲取使用者
router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: '找不到使用者' });
  }
  res.json(user);
});

// 建立新使用者
router.post('/', async (req, res) => {
  const { name, email, password } = req.body;

  // TODO: 新增輸入驗證
  const user = await User.create({ name, email, password });
  res.status(201).json(user);
});

// 更新使用者
router.put('/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: '找不到使用者' });
  }

  Object.assign(user, req.body);
  await user.save();
  res.json(user);
});

// 刪除使用者
router.delete('/:id', async (req, res) => {
  await User.deleteById(req.params.id);
  res.status(204).send();
});

module.exports = router;
