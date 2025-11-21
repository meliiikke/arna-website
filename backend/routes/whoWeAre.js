const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { uploadSingle, handleUploadError } = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/', async (req, res) => {
  try {
    // Hem content hem de features verilerini getir
    const [contentRows] = await pool.execute('SELECT * FROM who_we_are_content WHERE is_active = 1 ORDER BY id');
    const [featuresRows] = await pool.execute('SELECT * FROM who_we_are_features WHERE is_active = 1 ORDER BY display_order ASC');
    
    const response = {
      content: contentRows[0] || null,
      features: featuresRows
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching who we are data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch who we are data',
      details: error.message 
    });
  }
});

router.get('/content', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM who_we_are_content WHERE is_active = 1 ORDER BY id');
    res.json(rows[0] || null);
  } catch (error) {
    console.error('Error fetching who we are content:', error);
    res.status(500).json({ error: 'Failed to fetch who we are content' });
  }
});

router.get('/features', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM who_we_are_features WHERE is_active = 1 ORDER BY display_order ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching who we are features:', error);
    res.status(500).json({ error: 'Failed to fetch who we are features' });
  }
});

// Admin routes - authentication required

// Who We Are Content CRUD
router.get('/admin/content', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM who_we_are_content ORDER BY id');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching who we are content:', error);
    res.status(500).json({ error: 'Failed to fetch who we are content' });
  }
});

router.post('/admin/content', authenticateToken, uploadSingle('image'), handleUploadError, async (req, res) => {
  try {
    const { title, subtitle, description, highlight_text, button_text, button_link, video_url, is_active } = req.body;
    
    let image_url = null;
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }

    const [result] = await pool.execute(
      'INSERT INTO who_we_are_content (title, subtitle, description, highlight_text, button_text, button_link, video_url, image_url, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, subtitle, description, highlight_text, button_text, button_link, video_url, image_url, is_active !== false]
    );

    res.status(201).json({
      message: 'Who we are content created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error creating who we are content:', error);
    res.status(500).json({ error: 'Failed to create who we are content' });
  }
});

router.put('/admin/content/:id', authenticateToken, uploadSingle('image'), handleUploadError, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, description, highlight_text, button_text, button_link, video_url, is_active } = req.body;

    // Mevcut içeriği kontrol et
    const [existing] = await pool.execute('SELECT * FROM who_we_are_content WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Who we are content not found' });
    }

    let image_url = existing[0].image_url;
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }

    await pool.execute(
      'UPDATE who_we_are_content SET title = ?, subtitle = ?, description = ?, highlight_text = ?, button_text = ?, button_link = ?, video_url = ?, image_url = ?, is_active = ? WHERE id = ?',
      [title, subtitle, description, highlight_text, button_text, button_link, video_url, image_url, is_active !== false, id]
    );

    res.json({ message: 'Who we are content updated successfully' });
  } catch (error) {
    console.error('Error updating who we are content:', error);
    res.status(500).json({ error: 'Failed to update who we are content' });
  }
});

router.delete('/admin/content/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute('DELETE FROM who_we_are_content WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Who we are content not found' });
    }

    res.json({ message: 'Who we are content deleted successfully' });
  } catch (error) {
    console.error('Error deleting who we are content:', error);
    res.status(500).json({ error: 'Failed to delete who we are content' });
  }
});

// Who We Are Features CRUD
router.get('/admin/features', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM who_we_are_features ORDER BY display_order ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching who we are features:', error);
    res.status(500).json({ 
      error: 'Failed to fetch who we are features',
      details: error.message 
    });
  }
});

router.post('/admin/features', authenticateToken, async (req, res) => {
  try {
    const { feature_text, display_order, is_active } = req.body;
    
    const [result] = await pool.execute(
      'INSERT INTO who_we_are_features (feature_text, display_order, is_active) VALUES (?, ?, ?)',
      [feature_text, display_order || 0, is_active !== false]
    );

    res.status(201).json({
      message: 'Who we are feature created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error creating who we are feature:', error);
    res.status(500).json({ error: 'Failed to create who we are feature' });
  }
});

router.put('/admin/features/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { feature_text, display_order, is_active } = req.body;

    const [result] = await pool.execute(
      'UPDATE who_we_are_features SET feature_text = ?, display_order = ?, is_active = ? WHERE id = ?',
      [feature_text, display_order || 0, is_active !== false, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Who we are feature not found' });
    }

    res.json({ message: 'Who we are feature updated successfully' });
  } catch (error) {
    console.error('Error updating who we are feature:', error);
    res.status(500).json({ 
      error: 'Failed to update who we are feature',
      details: error.message 
    });
  }
});

router.delete('/admin/features/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute('DELETE FROM who_we_are_features WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Who we are feature not found' });
    }

    res.json({ message: 'Who we are feature deleted successfully' });
  } catch (error) {
    console.error('Error deleting who we are feature:', error);
    res.status(500).json({ error: 'Failed to delete who we are feature' });
  }
});

module.exports = router;
