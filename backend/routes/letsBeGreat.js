const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { uploadSingle, handleUploadError } = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/content', async (req, res) => {
  try {
    console.log('📥 GET /api/lets-be-great/content - Fetching lets be great content');
    const [rows] = await pool.execute('SELECT * FROM lets_be_great_content WHERE is_active = 1 ORDER BY id');
    console.log('✅ Lets be great content query result:', rows);
    const result = rows[0] || null;
    console.log('📤 Sending content response:', result);
    res.json(result);
  } catch (error) {
    console.error('❌ Error fetching lets be great content:', error);
    res.status(500).json({ error: 'Failed to fetch lets be great content' });
  }
});

router.get('/statistics', async (req, res) => {
  try {
    console.log('📊 GET /api/lets-be-great/statistics - Fetching lets be great statistics');
    const [rows] = await pool.execute('SELECT * FROM lets_be_great_statistics WHERE is_active = 1 ORDER BY display_order ASC');
    console.log('✅ Lets be great statistics query result:', rows);
    res.json(rows);
  } catch (error) {
    console.error('❌ Error fetching lets be great statistics:', error);
    res.status(500).json({ error: 'Failed to fetch lets be great statistics' });
  }
});

// Admin routes
router.use(authenticateToken);

// Lets Be Great Content CRUD
router.get('/admin/content', authenticateToken, async (req, res) => {
  try {
    console.log('📥 GET /api/lets-be-great/admin/content - Fetching lets be great content for admin');
    const [rows] = await pool.execute('SELECT * FROM lets_be_great_content ORDER BY id');
    console.log('✅ Lets be great content fetched:', rows.length, 'items');
    res.json(rows);
  } catch (error) {
    console.error('❌ Error fetching lets be great content:', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to fetch lets be great content',
      details: error.message 
    });
  }
});

router.post('/admin/content', authenticateToken, uploadSingle('background_image'), handleUploadError, async (req, res) => {
  try {
    const { subtitle, title, description, button_text, button_link, is_active } = req.body;
    
    let background_image_url = null;
    if (req.file) {
      background_image_url = `/uploads/${req.file.filename}`;
    }

    const [result] = await pool.execute(
      'INSERT INTO lets_be_great_content (subtitle, title, description, button_text, button_link, background_image_url, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [subtitle, title, description, button_text, button_link, background_image_url, is_active !== false]
    );

    res.status(201).json({
      message: 'Lets be great content created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error creating lets be great content:', error);
    res.status(500).json({ error: 'Failed to create lets be great content' });
  }
});

router.put('/admin/content/:id', authenticateToken, uploadSingle('background_image'), handleUploadError, async (req, res) => {
  try {
    const { id } = req.params;
    const { subtitle, title, description, button_text, button_link, is_active } = req.body;

    // Mevcut içeriği kontrol et
    const [existing] = await pool.execute('SELECT * FROM lets_be_great_content WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Lets be great content not found' });
    }

    let background_image_url = existing[0].background_image_url;
    if (req.file) {
      background_image_url = `/uploads/${req.file.filename}`;
    }

    await pool.execute(
      'UPDATE lets_be_great_content SET subtitle = ?, title = ?, description = ?, button_text = ?, button_link = ?, background_image_url = ?, is_active = ? WHERE id = ?',
      [subtitle, title, description, button_text, button_link, background_image_url, is_active !== false, id]
    );

    res.json({ message: 'Lets be great content updated successfully' });
  } catch (error) {
    console.error('Error updating lets be great content:', error);
    res.status(500).json({ error: 'Failed to update lets be great content' });
  }
});

router.delete('/admin/content/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute('DELETE FROM lets_be_great_content WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Lets be great content not found' });
    }

    res.json({ message: 'Lets be great content deleted successfully' });
  } catch (error) {
    console.error('Error deleting lets be great content:', error);
    res.status(500).json({ error: 'Failed to delete lets be great content' });
  }
});

// Lets Be Great Statistics CRUD
router.get('/admin/statistics', authenticateToken, async (req, res) => {
  try {
    console.log('📥 GET /api/lets-be-great/admin/statistics - Fetching lets be great statistics for admin');
    const [rows] = await pool.execute('SELECT * FROM lets_be_great_statistics ORDER BY display_order ASC');
    console.log('✅ Lets be great statistics fetched:', rows.length, 'items');
    res.json(rows);
  } catch (error) {
    console.error('❌ Error fetching lets be great statistics:', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to fetch lets be great statistics',
      details: error.message 
    });
  }
});

router.post('/admin/statistics', authenticateToken, async (req, res) => {
  try {
    const { title, percentage, display_order, is_active } = req.body;
    
    const [result] = await pool.execute(
      'INSERT INTO lets_be_great_statistics (title, percentage, display_order, is_active) VALUES (?, ?, ?, ?)',
      [title, percentage || 0, display_order || 0, is_active !== false]
    );

    res.status(201).json({
      message: 'Lets be great statistic created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error creating lets be great statistic:', error);
    res.status(500).json({ error: 'Failed to create lets be great statistic' });
  }
});

router.put('/admin/statistics/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, percentage, display_order, is_active } = req.body;

    const [result] = await pool.execute(
      'UPDATE lets_be_great_statistics SET title = ?, percentage = ?, display_order = ?, is_active = ? WHERE id = ?',
      [title, percentage || 0, display_order || 0, is_active !== false, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Lets be great statistic not found' });
    }

    res.json({ message: 'Lets be great statistic updated successfully' });
  } catch (error) {
    console.error('Error updating lets be great statistic:', error);
    res.status(500).json({ error: 'Failed to update lets be great statistic' });
  }
});

router.delete('/admin/statistics/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute('DELETE FROM lets_be_great_statistics WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Lets be great statistic not found' });
    }

    res.json({ message: 'Lets be great statistic deleted successfully' });
  } catch (error) {
    console.error('Error deleting lets be great statistic:', error);
    res.status(500).json({ error: 'Failed to delete lets be great statistic' });
  }
});

module.exports = router;
