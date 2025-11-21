const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

// JWT token doğrulama middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'arna_energy_secret_key');
    
    // Admin kullanıcısını veritabanından kontrol et
    const [rows] = await pool.execute(
      'SELECT id, username, email, is_active FROM admins WHERE id = ? AND is_active = 1',
      [decoded.id]
    );

    if (rows.length === 0) {
      return res.status(403).json({ error: 'Invalid or inactive admin user' });
    }

    req.admin = rows[0];
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(500).json({ error: 'Token verification failed' });
  }
};

// Admin yetkisi kontrolü
const requireAdmin = (req, res, next) => {
  if (!req.admin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin
};
