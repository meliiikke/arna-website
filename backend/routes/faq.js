const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Public routes - frontend için
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM faq WHERE is_active = 1 ORDER BY display_order ASC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    res.status(500).json({ error: 'Failed to fetch FAQ' });
  }
});

// Admin routes - authentication gerekli
router.use(authenticateToken);

// Tüm FAQ'ları getir (admin için)
router.get('/admin', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM faq ORDER BY display_order ASC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    res.status(500).json({ error: 'Failed to fetch FAQ' });
  }
});

// Yeni FAQ oluştur
router.post('/', async (req, res) => {
  try {
    const { question, answer, image_url, display_order, is_active } = req.body;
    
    const isActiveValue = is_active === true || is_active === 'true' || is_active === 1;

    const [result] = await pool.execute(
      'INSERT INTO faq (question, answer, image_url, display_order, is_active) VALUES (?, ?, ?, ?, ?)',
      [question, answer, image_url || null, display_order || 0, isActiveValue]
    );

    res.status(201).json({
      message: 'FAQ created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    res.status(500).json({ 
      error: 'Failed to create FAQ',
      details: error.message 
    });
  }
});

// FAQ güncelle
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, image_url, display_order, is_active } = req.body;

    // Mevcut FAQ'ı kontrol et
    const [existing] = await pool.execute('SELECT * FROM faq WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    await pool.execute(
      'UPDATE faq SET question = ?, answer = ?, image_url = ?, display_order = ?, is_active = ? WHERE id = ?',
      [question, answer, image_url || null, display_order || 0, is_active === true || is_active === 'true' || is_active === 1, id]
    );

    res.json({ message: 'FAQ updated successfully' });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    res.status(500).json({ error: 'Failed to update FAQ' });
  }
});

// FAQ sil
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute('DELETE FROM faq WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    res.json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    res.status(500).json({ error: 'Failed to delete FAQ' });
  }
});

// FAQ'ı aktif/pasif yap
router.patch('/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      'UPDATE faq SET is_active = NOT is_active WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    res.json({ message: 'FAQ status toggled successfully' });
  } catch (error) {
    console.error('Error toggling FAQ:', error);
    res.status(500).json({ error: 'Failed to toggle FAQ' });
  }
});

module.exports = router;
