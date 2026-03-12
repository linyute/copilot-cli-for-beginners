/**
 * 身分驗證 API 端點
 */
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = 'your-secret-key'; // TODO: 移動到環境變數

// 登入
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findByEmail(email);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: '無效的憑據' });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

// 註冊
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    return res.status(400).json({ error: '電子郵件已註冊' });
  }

  const user = await User.create({ name, email, password });
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

  res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

// 驗證權杖 (Token)
router.get('/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: '未提供權杖' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, userId: decoded.userId });
  } catch (error) {
    res.status(401).json({ error: '無效的權杖' });
  }
});

module.exports = router;
