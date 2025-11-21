const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { uploadSingle, handleUploadError } = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM projects WHERE is_active = 1 ORDER BY display_order ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

router.get('/content', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM projects_content WHERE is_active = 1 ORDER BY id');
    res.json(rows[0] || null);
  } catch (error) {
    console.error('Error fetching projects content:', error);
    res.status(500).json({ error: 'Failed to fetch projects content' });
  }
});

// Admin routes
router.use(authenticateToken);

// Projects Content CRUD
router.get('/admin/content', authenticateToken, async (req, res) => {
  try {
    console.log('📥 GET /api/projects/admin/content - Fetching projects content for admin');
    const [rows] = await pool.execute('SELECT * FROM projects_content ORDER BY id');
    console.log('✅ Projects content fetched:', rows.length, 'items');
    res.json(rows);
  } catch (error) {
    console.error('❌ Error fetching projects content:', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to fetch projects content',
      details: error.message 
    });
  }
});

router.post('/admin/content', authenticateToken, async (req, res) => {
  try {
    const { title, subtitle, description, is_active } = req.body;
    
    const [result] = await pool.execute(
      'INSERT INTO projects_content (title, subtitle, description, is_active) VALUES (?, ?, ?, ?)',
      [title, subtitle, description, is_active !== false]
    );

    res.status(201).json({
      message: 'Projects content created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error creating projects content:', error);
    res.status(500).json({ error: 'Failed to create projects content' });
  }
});

router.put('/admin/content/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, description, is_active } = req.body;

    const [result] = await pool.execute(
      'UPDATE projects_content SET title = ?, subtitle = ?, description = ?, is_active = ? WHERE id = ?',
      [title, subtitle, description, is_active !== false, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Projects content not found' });
    }

    res.json({ message: 'Projects content updated successfully' });
  } catch (error) {
    console.error('Error updating projects content:', error);
    res.status(500).json({ error: 'Failed to update projects content' });
  }
});

router.delete('/admin/content/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute('DELETE FROM projects_content WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Projects content not found' });
    }

    res.json({ message: 'Projects content deleted successfully' });
  } catch (error) {
    console.error('Error deleting projects content:', error);
    res.status(500).json({ error: 'Failed to delete projects content' });
  }
});

// Projects CRUD
router.get('/admin', authenticateToken, async (req, res) => {
  try {
    console.log('📥 GET /api/projects/admin - Fetching projects for admin');
    const [rows] = await pool.execute('SELECT * FROM projects ORDER BY display_order ASC');
    console.log('✅ Projects fetched:', rows.length, 'items');
    res.json(rows);
  } catch (error) {
    console.error('❌ Error fetching projects:', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to fetch projects',
      details: error.message 
    });
  }
});

router.post('/admin', authenticateToken, uploadSingle('image'), handleUploadError, async (req, res) => {
  try {
    const { title, description, button_text, button_link, display_order, is_active } = req.body;
    
    let image_url = null;
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }

    const [result] = await pool.execute(
      'INSERT INTO projects (title, description, image_url, button_text, button_link, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, description, image_url, button_text, button_link, display_order || 0, is_active !== false]
    );

    res.status(201).json({
      message: 'Project created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

router.put('/admin/:id', authenticateToken, uploadSingle('image'), handleUploadError, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, button_text, button_link, display_order, is_active } = req.body;

    // Mevcut projeyi kontrol et
    const [existing] = await pool.execute('SELECT * FROM projects WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    let image_url = existing[0].image_url;
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }

    await pool.execute(
      'UPDATE projects SET title = ?, description = ?, image_url = ?, button_text = ?, button_link = ?, display_order = ?, is_active = ? WHERE id = ?',
      [title, description, image_url, button_text, button_link, display_order || 0, is_active !== false, id]
    );

    res.json({ message: 'Project updated successfully' });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

router.delete('/admin/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute('DELETE FROM projects WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

module.exports = router;
