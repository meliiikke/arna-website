const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { uploadSingle, handleUploadError } = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/content', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM global_presence_content WHERE is_active = 1 ORDER BY id LIMIT 1');
    res.json(rows[0] || null);
  } catch (error) {
    console.error('Error fetching global presence content:', error);
    res.status(500).json({ error: 'Failed to fetch global presence content' });
  }
});

router.get('/map-points', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM map_points WHERE is_active = 1 ORDER BY display_order ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching map points:', error);
    res.status(500).json({ error: 'Failed to fetch map points' });
  }
});

// Admin routes
router.use(authenticateToken);

// Global Presence Content CRUD
router.get('/admin/content', authenticateToken, async (req, res) => {
  try {
    console.log('🔍 GET /global-presence/admin/content called');
    
    // First check if table exists
    const [tableCheck] = await pool.execute(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE() 
      AND table_name = 'global_presence_content'
    `);
    
    if (tableCheck[0].count === 0) {
      console.log('❌ global_presence_content table does not exist');
      return res.status(500).json({ 
        error: 'Table not found',
        message: 'global_presence_content table does not exist. Please run the database migration.',
        details: 'Run the quick_fix_migration.sql script on your database'
      });
    }
    
    const [rows] = await pool.execute('SELECT * FROM global_presence_content ORDER BY id');
    console.log(`✅ Found ${rows.length} global presence content records`);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching global presence content:', error);
    res.status(500).json({ 
      error: 'Failed to fetch global presence content',
      message: error.message,
      details: error.code || 'Unknown database error'
    });
  }
});

router.post('/admin/content', authenticateToken, async (req, res) => {
  try {
    const { title, subtitle, description, is_active } = req.body;
    
    const [result] = await pool.execute(
      'INSERT INTO global_presence_content (title, subtitle, description, is_active) VALUES (?, ?, ?, ?)',
      [title, subtitle, description, is_active !== false]
    );

    res.status(201).json({
      message: 'Global presence content created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error creating global presence content:', error);
    res.status(500).json({ error: 'Failed to create global presence content' });
  }
});

router.put('/admin/content/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, description, is_active } = req.body;

    const [result] = await pool.execute(
      'UPDATE global_presence_content SET title = ?, subtitle = ?, description = ?, is_active = ? WHERE id = ?',
      [title, subtitle, description, is_active !== false, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Global presence content not found' });
    }

    res.json({ message: 'Global presence content updated successfully' });
  } catch (error) {
    console.error('Error updating global presence content:', error);
    res.status(500).json({ error: 'Failed to update global presence content' });
  }
});

router.delete('/admin/content/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute('DELETE FROM global_presence_content WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Global presence content not found' });
    }

    res.json({ message: 'Global presence content deleted successfully' });
  } catch (error) {
    console.error('Error deleting global presence content:', error);
    res.status(500).json({ error: 'Failed to delete global presence content' });
  }
});

// Map Points CRUD
router.get('/admin/map-points', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM map_points ORDER BY display_order ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching map points:', error);
    res.status(500).json({ 
      error: 'Failed to fetch map points',
      details: error.message 
    });
  }
});

router.post('/admin/map-points', authenticateToken, async (req, res) => {
  try {
    const { title, description, latitude, longitude, marker_type, display_order, is_active } = req.body;
    
    const [result] = await pool.execute(
      'INSERT INTO map_points (title, description, latitude, longitude, marker_type, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, description, latitude, longitude, marker_type, display_order || 0, is_active !== false]
    );

    res.status(201).json({
      message: 'Map point created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error creating map point:', error);
    res.status(500).json({ error: 'Failed to create map point' });
  }
});

router.put('/admin/map-points/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, latitude, longitude, marker_type, display_order, is_active } = req.body;

    const [result] = await pool.execute(
      'UPDATE map_points SET title = ?, description = ?, latitude = ?, longitude = ?, marker_type = ?, display_order = ?, is_active = ? WHERE id = ?',
      [title, description, latitude, longitude, marker_type, display_order || 0, is_active !== false, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Map point not found' });
    }

    res.json({ message: 'Map point updated successfully' });
  } catch (error) {
    console.error('Error updating map point:', error);
    res.status(500).json({ error: 'Failed to update map point' });
  }
});

router.delete('/admin/map-points/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute('DELETE FROM map_points WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Map point not found' });
    }

    res.json({ message: 'Map point deleted successfully' });
  } catch (error) {
    console.error('Error deleting map point:', error);
    res.status(500).json({ error: 'Failed to delete map point' });
  }
});

module.exports = router;
