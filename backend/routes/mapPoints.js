const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.get('/', async (req, res) => {
  try {
    console.log('🗺️ Fetching map points...');
    
    const [rows] = await pool.execute(`
      SELECT * FROM map_points 
      WHERE is_active = 1 
      ORDER BY display_order ASC, created_at ASC
    `);
    
    console.log('✅ Map points fetched:', rows.length, 'points');
    res.json(rows);
  } catch (error) {
    console.error('❌ Error fetching map points:', error);
    res.status(500).json({ error: 'Failed to fetch map points' });
  }
});

// Admin routes
router.use(authenticateToken);

// Get all map points for admin
router.get('/admin', authenticateToken, async (req, res) => {
  try {
    console.log('🗺️ Admin fetching map points...');
    
    const [rows] = await pool.execute(`
      SELECT * FROM map_points 
      ORDER BY display_order ASC, created_at ASC
    `);
    
    console.log('✅ Admin map points fetched:', rows.length, 'points');
    res.json(rows);
  } catch (error) {
    console.error('❌ Error fetching admin map points:', error);
    res.status(500).json({ error: 'Failed to fetch map points' });
  }
});

// Create new map point
router.post('/admin', authenticateToken, async (req, res) => {
  try {
    const { 
      title, 
      description, 
      latitude, 
      longitude, 
      x, 
      y, 
      marker_type, 
      display_order, 
      is_active 
    } = req.body;

    console.log('🗺️ Creating map point:', { title, latitude, longitude });

    const [result] = await pool.execute(
      `INSERT INTO map_points (title, description, latitude, longitude, x, y, marker_type, display_order, is_active, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [title, description || null, latitude || null, longitude || null, x || null, y || null, marker_type || 'default', display_order || 0, is_active !== undefined ? is_active : 1]
    );

    console.log('✅ Map point created:', result.insertId);
    res.json({ 
      success: true, 
      message: 'Map point created successfully',
      id: result.insertId 
    });
  } catch (error) {
    console.error('❌ Error creating map point:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create map point',
      error: error.message 
    });
  }
});

// Update map point
router.put('/admin/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      description, 
      latitude, 
      longitude, 
      x, 
      y, 
      marker_type, 
      display_order, 
      is_active 
    } = req.body;

    console.log('🗺️ Updating map point:', { id, title, latitude, longitude });

    const [result] = await pool.execute(
      `UPDATE map_points SET 
       title = ?, description = ?, latitude = ?, longitude = ?, x = ?, y = ?, 
       marker_type = ?, display_order = ?, is_active = ?, updated_at = NOW() 
       WHERE id = ?`,
      [title, description || null, latitude || null, longitude || null, x || null, y || null, 
       marker_type || 'default', display_order || 0, is_active !== undefined ? is_active : 1, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Map point not found' 
      });
    }

    console.log('✅ Map point updated:', id);
    res.json({ 
      success: true, 
      message: 'Map point updated successfully' 
    });
  } catch (error) {
    console.error('❌ Error updating map point:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update map point',
      error: error.message 
    });
  }
});

// Delete map point
router.delete('/admin/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('🗺️ Deleting map point:', id);
    
    const [result] = await pool.execute(
      'DELETE FROM map_points WHERE id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Map point not found' 
      });
    }
    
    console.log('✅ Map point deleted:', id);
    res.json({ 
      success: true, 
      message: 'Map point deleted successfully' 
    });
  } catch (error) {
    console.error('❌ Error deleting map point:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete map point',
      error: error.message 
    });
  }
});

module.exports = router;
