const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM contact_info ORDER BY id');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching contact info:', error);
    res.status(500).json({ error: 'Failed to fetch contact info' });
  }
});

// Admin routes
router.use(authenticateToken);

// Contact Info CRUD
router.get('/admin', authenticateToken, async (req, res) => {
  try {
    console.log('📥 GET /api/contact-info/admin - Fetching contact info for admin');
    const [rows] = await pool.execute('SELECT * FROM contact_info ORDER BY id');
    console.log('✅ Contact info fetched:', rows.length, 'items');
    res.json(rows);
  } catch (error) {
    console.error('❌ Error fetching contact info:', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to fetch contact info',
      details: error.message 
    });
  }
});

router.post('/admin', authenticateToken, async (req, res) => {
  try {
    const { field_name, field_value, whatsapp, gsm } = req.body;
    
    const [result] = await pool.execute(
      'INSERT INTO contact_info (field_name, field_value, whatsapp, gsm) VALUES (?, ?, ?, ?)',
      [field_name, field_value, whatsapp, gsm]
    );

    res.status(201).json({
      message: 'Contact info created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error creating contact info:', error);
    res.status(500).json({ error: 'Failed to create contact info' });
  }
});

router.put('/admin/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { field_name, field_value, field_type, map_latitude, map_longitude, whatsapp, gsm } = req.body;

    console.log('📧 Updating contact info:', { id, field_name, field_value, field_type, map_latitude, map_longitude, whatsapp, gsm });

    const [result] = await pool.execute(
      'UPDATE contact_info SET field_name = ?, field_value = ?, field_type = ?, map_latitude = ?, map_longitude = ?, whatsapp = ?, gsm = ? WHERE id = ?',
      [field_name, field_value, field_type, map_latitude, map_longitude, whatsapp, gsm, id]
    );

    console.log('✅ Contact info update result:', result);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Contact info not found' });
    }

    res.json({ message: 'Contact info updated successfully' });
  } catch (error) {
    console.error('❌ Error updating contact info:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to update contact info' });
  }
});

router.delete('/admin/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute('DELETE FROM contact_info WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Contact info not found' });
    }

    res.json({ message: 'Contact info deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact info:', error);
    res.status(500).json({ error: 'Failed to delete contact info' });
  }
});

module.exports = router;
