/**
 * 應用程式進入點
 */
const express = require('express');
const cors = require('cors');
const usersRouter = require('./api/users');
const authRouter = require('./api/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// 中間件 (Middleware)
app.use(cors());
app.use(express.json());

// 路由
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);

// 健康檢查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 錯誤處理常式
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '發生錯誤！' });
});

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`伺服器正執行於埠號 ${PORT}`);
});

module.exports = app;
