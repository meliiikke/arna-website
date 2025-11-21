const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM statistics WHERE is_active = 1 ORDER BY display_order ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Admin routes
router.use(authenticateToken);

router.get('/admin', authenticateToken, async (req, res) => {
  try {
    console.log('📥 GET /api/statistics/admin - Fetching statistics for admin');
    const [rows] = await pool.execute('SELECT * FROM statistics ORDER BY display_order ASC');
    console.log('✅ Statistics fetched:', rows.length, 'items');
    res.json(rows);
  } catch (error) {
    console.error('❌ Error fetching statistics:', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to fetch statistics',
      details: error.message 
    });
  }
});

router.post('/admin', authenticateToken, async (req, res) => {
  try {
    const { title, value, description, icon, display_order, is_active } = req.body;
    
    const [result] = await pool.execute(
      'INSERT INTO statistics (title, value, description, icon, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?)',
      [title, value, description, icon, display_order || 0, is_active !== false]
    );

    res.status(201).json({
      message: 'Statistic created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error creating statistic:', error);
    res.status(500).json({ error: 'Failed to create statistic' });
  }
});

router.put('/admin/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, value, description, icon, display_order, is_active } = req.body;

    const [result] = await pool.execute(
      'UPDATE statistics SET title = ?, value = ?, description = ?, icon = ?, display_order = ?, is_active = ? WHERE id = ?',
      [title, value, description, icon, display_order || 0, is_active !== false, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Statistic not found' });
    }

    res.json({ message: 'Statistic updated successfully' });
  } catch (error) {
    console.error('Error updating statistic:', error);
    res.status(500).json({ error: 'Failed to update statistic' });
  }
});

router.delete('/admin/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute('DELETE FROM statistics WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Statistic not found' });
    }

    res.json({ message: 'Statistic deleted successfully' });
  } catch (error) {
    console.error('Error deleting statistic:', error);
    res.status(500).json({ error: 'Failed to delete statistic' });
  }
});

module.exports = router;
