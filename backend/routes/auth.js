const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Handle preflight requests for login
router.options('/login', (req, res) => {
  const origin = req.headers.origin;
  if (origin && ['https://arna.one', 'https://www.arna.one', 'https://api.arna.one'].includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400');
  res.status(200).end();
});

// Admin login
router.post('/login', async (req, res) => {
  try {
    // Set CORS headers explicitly for login route
    const origin = req.headers.origin;
    if (origin && ['https://arna.one', 'https://www.arna.one', 'https://api.arna.one'].includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Admin kullanıcısını bul
    const [rows] = await pool.execute(
      'SELECT * FROM admins WHERE username = ? AND is_active = 1',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const admin = rows[0];

    // Şifreyi kontrol et
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // JWT token oluştur
    const token = jwt.sign(
      { 
        id: admin.id, 
        username: admin.username,
        email: admin.email 
      },
      process.env.JWT_SECRET || 'arna_energy_secret_key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Token doğrulama
router.get('/verify', authenticateToken, (req, res) => {
  res.json({
    message: 'Token is valid',
    admin: req.admin
  });
});

// Logout (client-side token silme)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

module.exports = router;
