const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Public routes - frontend için
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM faq_content WHERE is_active = 1 ORDER BY id ASC LIMIT 1'
    );
    res.json(rows[0] || null);
  } catch (error) {
    console.error('Error fetching FAQ content:', error);
    res.status(500).json({ error: 'Failed to fetch FAQ content' });
  }
});

// Admin routes - authentication gerekli
router.use(authenticateToken);

// FAQ content getir (admin için)
router.get('/admin', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM faq_content ORDER BY id ASC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching FAQ content:', error);
    res.status(500).json({ error: 'Failed to fetch FAQ content' });
  }
});

// FAQ content oluştur
router.post('/', async (req, res) => {
  try {
    const { title, subtitle, image_url, is_active } = req.body;
    
    const isActiveValue = is_active === true || is_active === 'true' || is_active === 1;

    const [result] = await pool.execute(
      'INSERT INTO faq_content (title, subtitle, image_url, is_active) VALUES (?, ?, ?, ?)',
      [title, subtitle, image_url || null, isActiveValue]
    );

    res.status(201).json({
      message: 'FAQ content created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error creating FAQ content:', error);
    res.status(500).json({ 
      error: 'Failed to create FAQ content',
      details: error.message 
    });
  }
});

// FAQ content güncelle
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, image_url, is_active } = req.body;

    // Mevcut FAQ content'i kontrol et
    const [existing] = await pool.execute('SELECT * FROM faq_content WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'FAQ content not found' });
    }

    await pool.execute(
      'UPDATE faq_content SET title = ?, subtitle = ?, image_url = ?, is_active = ? WHERE id = ?',
      [title, subtitle, image_url || null, is_active === true || is_active === 'true' || is_active === 1, id]
    );

    res.json({ message: 'FAQ content updated successfully' });
  } catch (error) {
    console.error('Error updating FAQ content:', error);
    res.status(500).json({ error: 'Failed to update FAQ content' });
  }
});

// FAQ content sil
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute('DELETE FROM faq_content WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'FAQ content not found' });
    }

    res.json({ message: 'FAQ content deleted successfully' });
  } catch (error) {
    console.error('Error deleting FAQ content:', error);
    res.status(500).json({ error: 'Failed to delete FAQ content' });
  }
});

// FAQ content'i aktif/pasif yap
router.patch('/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      'UPDATE faq_content SET is_active = NOT is_active WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'FAQ content not found' });
    }

    res.json({ message: 'FAQ content status toggled successfully' });
  } catch (error) {
    console.error('Error toggling FAQ content:', error);
    res.status(500).json({ error: 'Failed to toggle FAQ content' });
  }
});

module.exports = router;
