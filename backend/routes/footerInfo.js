const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM footer_info ORDER BY id');
    res.json(rows[0] || null);
  } catch (error) {
    console.error('Error fetching footer info:', error);
    res.status(500).json({ error: 'Failed to fetch footer info' });
  }
});

// Admin routes
router.use(authenticateToken);

// Footer Info CRUD
router.get('/admin', authenticateToken, async (req, res) => {
  try {
    console.log('📥 GET /api/footer-info/admin - Fetching footer info for admin');
    const [rows] = await pool.execute('SELECT * FROM footer_info ORDER BY id');
    console.log('✅ Footer info fetched:', rows.length, 'items');
    res.json(rows);
  } catch (error) {
    console.error('❌ Error fetching footer info:', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to fetch footer info',
      details: error.message 
    });
  }
});

router.post('/admin', authenticateToken, async (req, res) => {
  try {
    const { logo_description, company_description, is_active } = req.body;
    
    console.log('📥 POST /api/footer-info/admin - Creating footer info:', { logo_description, company_description, is_active });
    
    const [result] = await pool.execute(
      'INSERT INTO footer_info (logo_description, company_description, is_active) VALUES (?, ?, ?)',
      [logo_description, company_description, is_active !== false]
    );

    console.log('✅ Footer info created:', result.insertId);
    res.status(201).json({
      message: 'Footer info created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('❌ Error creating footer info:', error);
    res.status(500).json({ error: 'Failed to create footer info' });
  }
});

router.put('/admin/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { logo_description, company_description, is_active } = req.body;

    console.log('📥 PUT /api/footer-info/admin/:id - Updating footer info:', { id, logo_description, company_description, is_active });

    const [result] = await pool.execute(
      'UPDATE footer_info SET logo_description = ?, company_description = ?, is_active = ? WHERE id = ?',
      [logo_description, company_description, is_active !== false, id]
    );

    console.log('✅ Footer info update result:', result);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Footer info not found' });
    }

    res.json({ message: 'Footer info updated successfully' });
  } catch (error) {
    console.error('❌ Error updating footer info:', error);
    res.status(500).json({ error: 'Failed to update footer info' });
  }
});

router.delete('/admin/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute('DELETE FROM footer_info WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Footer info not found' });
    }

    res.json({ message: 'Footer info deleted successfully' });
  } catch (error) {
    console.error('Error deleting footer info:', error);
    res.status(500).json({ error: 'Failed to delete footer info' });
  }
});

module.exports = router;
