const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { uploadSingle, handleUploadError } = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/content', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM leadership_content WHERE is_active = 1 ORDER BY id');
    res.json(rows[0] || null);
  } catch (error) {
    console.error('Error fetching leadership content:', error);
    res.status(500).json({ error: 'Failed to fetch leadership content' });
  }
});

router.get('/members', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM leadership_members WHERE is_active = 1 ORDER BY display_order ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching leadership members:', error);
    res.status(500).json({ error: 'Failed to fetch leadership members' });
  }
});

// Admin routes
router.use(authenticateToken);

// Leadership Content CRUD
router.get('/admin/content', authenticateToken, async (req, res) => {
  try {
    console.log('📥 GET /api/leadership/admin/content - Fetching leadership content for admin');
    const [rows] = await pool.execute('SELECT * FROM leadership_content ORDER BY id');
    console.log('✅ Leadership content fetched:', rows.length, 'items');
    res.json(rows);
  } catch (error) {
    console.error('❌ Error fetching leadership content:', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to fetch leadership content',
      details: error.message 
    });
  }
});

router.post('/admin/content', authenticateToken, async (req, res) => {
  try {
    const { title, subtitle, description, is_active } = req.body;
    
    const [result] = await pool.execute(
      'INSERT INTO leadership_content (title, subtitle, description, is_active) VALUES (?, ?, ?, ?)',
      [title, subtitle, description, is_active !== false]
    );

    res.status(201).json({
      message: 'Leadership content created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error creating leadership content:', error);
    res.status(500).json({ error: 'Failed to create leadership content' });
  }
});

router.put('/admin/content/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, description, is_active } = req.body;

    const [result] = await pool.execute(
      'UPDATE leadership_content SET title = ?, subtitle = ?, description = ?, is_active = ? WHERE id = ?',
      [title, subtitle, description, is_active !== false, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Leadership content not found' });
    }

    res.json({ message: 'Leadership content updated successfully' });
  } catch (error) {
    console.error('Error updating leadership content:', error);
    res.status(500).json({ error: 'Failed to update leadership content' });
  }
});

router.delete('/admin/content/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute('DELETE FROM leadership_content WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Leadership content not found' });
    }

    res.json({ message: 'Leadership content deleted successfully' });
  } catch (error) {
    console.error('Error deleting leadership content:', error);
    res.status(500).json({ error: 'Failed to delete leadership content' });
  }
});

// Leadership Members CRUD
router.get('/admin/members', authenticateToken, async (req, res) => {
  try {
    console.log('📥 GET /api/leadership/admin/members - Fetching leadership members for admin');
    const [rows] = await pool.execute('SELECT * FROM leadership_members ORDER BY display_order ASC');
    console.log('✅ Leadership members fetched:', rows.length, 'items');
    res.json(rows);
  } catch (error) {
    console.error('❌ Error fetching leadership members:', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to fetch leadership members',
      details: error.message 
    });
  }
});

router.post('/admin/members', authenticateToken, uploadSingle('image'), handleUploadError, async (req, res) => {
  try {
    const { name, position, bio, linkedin_url, twitter_url, facebook_url, instagram_url, display_order, is_active } = req.body;
    
    let image_url = null;
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }

    const [result] = await pool.execute(
      'INSERT INTO leadership_members (name, position, bio, image_url, linkedin_url, twitter_url, facebook_url, instagram_url, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, position, bio, image_url, linkedin_url, twitter_url, facebook_url, instagram_url, display_order || 0, is_active !== false]
    );

    res.status(201).json({
      message: 'Leadership member created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error creating leadership member:', error);
    res.status(500).json({ error: 'Failed to create leadership member' });
  }
});

router.put('/admin/members/:id', authenticateToken, uploadSingle('image'), handleUploadError, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, position, bio, linkedin_url, twitter_url, facebook_url, instagram_url, display_order, is_active } = req.body;

    // Mevcut üyeyi kontrol et
    const [existing] = await pool.execute('SELECT * FROM leadership_members WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Leadership member not found' });
    }

    let image_url = existing[0].image_url;
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }

    await pool.execute(
      'UPDATE leadership_members SET name = ?, position = ?, bio = ?, image_url = ?, linkedin_url = ?, twitter_url = ?, facebook_url = ?, instagram_url = ?, display_order = ?, is_active = ? WHERE id = ?',
      [name, position, bio, image_url, linkedin_url, twitter_url, facebook_url, instagram_url, display_order || 0, is_active !== false, id]
    );

    res.json({ message: 'Leadership member updated successfully' });
  } catch (error) {
    console.error('Error updating leadership member:', error);
    res.status(500).json({ error: 'Failed to update leadership member' });
  }
});

router.delete('/admin/members/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute('DELETE FROM leadership_members WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Leadership member not found' });
    }

    res.json({ message: 'Leadership member deleted successfully' });
  } catch (error) {
    console.error('Error deleting leadership member:', error);
    res.status(500).json({ error: 'Failed to delete leadership member' });
  }
});

module.exports = router;
