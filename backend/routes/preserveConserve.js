const express = require('express');
const cors = require('cors');
const router = express.Router();
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');

router.use(cors({
  origin: ['https://arna.one', 'https://www.arna.one', 'https://api.arna.one'],
  credentials: true
}));

// ==================== PUBLIC ROUTES ====================

// Main endpoint - returns both content and features like WhoWeAre
router.get('/', async (req, res) => {
  try {
    console.log('🔍 GET /preserve-conserve called');
    
    // First check if tables exist
    const [tableCheck] = await pool.execute(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE() 
      AND table_name IN ('preserve_conserve_content', 'preserve_conserve_features')
    `);
    
    console.log('🔍 Tables found:', tableCheck);
    
    if (tableCheck.length < 2) {
      console.log('❌ Tables not found, returning empty data');
      return res.json({
        content: null,
        features: []
      });
    }
    
    // Hem content hem de features verilerini getir
    const [contentRows] = await pool.execute('SELECT * FROM preserve_conserve_content WHERE is_active = 1 ORDER BY id');
    const [featuresRows] = await pool.execute('SELECT * FROM preserve_conserve_features WHERE is_active = 1 ORDER BY display_order ASC');
    
    console.log('🔍 Content rows:', contentRows.length);
    console.log('🔍 Features rows:', featuresRows.length);
    console.log('🔍 Features data:', featuresRows);
    
    const response = {
      content: contentRows[0] || null,
      features: featuresRows
    };
    
    console.log('✅ Sending response:', response);
    res.json(response);
  } catch (error) {
    console.error('❌ Error fetching preserve conserve data:', error);
    console.error('❌ Error details:', {
      message: error.message,
      code: error.code,
      errno: error.errno
    });
    
    // Return empty data instead of fallback
    console.log('🔄 Returning empty data due to error');
    res.json({
      content: null,
      features: []
    });
  }
});


// GET /preserve-conserve/content - Get active content
router.get('/content', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM preserve_conserve_content WHERE is_active = 1 ORDER BY id');
    res.json(rows[0] || null);
  } catch (error) {
    console.error('Error fetching preserve conserve content:', error);
    res.status(500).json({ error: 'Failed to fetch preserve conserve content' });
  }
});

// GET /preserve-conserve/features - Get active features
router.get('/features', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM preserve_conserve_features WHERE is_active = 1 ORDER BY display_order ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching preserve conserve features:', error);
    res.status(500).json({ error: 'Failed to fetch preserve conserve features' });
  }
});

// ==================== ADMIN ROUTES ====================

// GET /admin/content - Get all content (including inactive)
router.get('/admin/content', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM preserve_conserve_content ORDER BY id');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching preserve conserve content:', error);
    res.status(500).json({ error: 'Failed to fetch preserve conserve content' });
  }
});

// GET /admin/features - Get all features (including inactive)
router.get('/admin/features', authenticateToken, async (req, res) => {
  try {
    console.log('🔍 GET /admin/features called');
    
    // First check if table exists
    const [tableCheck] = await pool.execute(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE() 
      AND table_name = 'preserve_conserve_features'
    `);
    
    console.log('🔍 Features table exists:', tableCheck[0].count > 0);
    
    if (tableCheck[0].count === 0) {
      console.log('❌ Features table not found, returning empty array');
      return res.json([]);
    }
    
    const [rows] = await pool.execute('SELECT * FROM preserve_conserve_features ORDER BY display_order ASC');
    console.log('🔍 Features rows found:', rows.length);
    console.log('🔍 Features data:', rows);
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching preserve conserve features:', error);
    res.status(500).json({ 
      error: 'Failed to fetch preserve conserve features',
      details: error.message 
    });
  }
});

// POST /admin/content - Create content
router.post('/admin/content', authenticateToken, uploadSingle('background_image'), async (req, res) => {
  try {
    const { title, subtitle, description, button_text, button_link, is_active } = req.body;
    
    let background_image_url = null;
    if (req.file) {
      background_image_url = `/uploads/${req.file.filename}`;
    }

    const [result] = await pool.execute(
      'INSERT INTO preserve_conserve_content (title, subtitle, description, background_image_url, button_text, button_link, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, subtitle, description, background_image_url, button_text || 'Discover More', button_link || '#', is_active !== false]
    );

    res.status(201).json({
      message: 'Preserve conserve content created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error creating preserve conserve content:', error);
    res.status(500).json({ error: 'Failed to create preserve conserve content' });
  }
});

// POST /admin/features - Create feature
router.post('/admin/features', authenticateToken, uploadSingle('icon'), async (req, res) => {
  try {
    const { title, description, display_order, is_active } = req.body;
    
    let icon_url = null;
    if (req.file) {
      icon_url = `/uploads/${req.file.filename}`;
    }

    const [result] = await pool.execute(
      'INSERT INTO preserve_conserve_features (title, description, icon_url, display_order, is_active) VALUES (?, ?, ?, ?, ?)',
      [title, description, icon_url, display_order || 0, is_active !== false]
    );

    res.status(201).json({
      message: 'Preserve conserve feature created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error creating preserve conserve feature:', error);
    res.status(500).json({ error: 'Failed to create preserve conserve feature' });
  }
});

// PUT /admin/content/:id - Update content
router.put('/admin/content/:id', authenticateToken, uploadSingle('background_image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, description, button_text, button_link, is_active } = req.body;

    // Mevcut içeriği kontrol et
    const [existing] = await pool.execute('SELECT * FROM preserve_conserve_content WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Preserve conserve content not found' });
    }

    let background_image_url = existing[0].background_image_url;
    if (req.file) {
      background_image_url = `/uploads/${req.file.filename}`;
    }

    await pool.execute(
      'UPDATE preserve_conserve_content SET title = ?, subtitle = ?, description = ?, background_image_url = ?, button_text = ?, button_link = ?, is_active = ? WHERE id = ?',
      [title, subtitle, description, background_image_url, button_text || 'Discover More', button_link || '#', is_active !== false, id]
    );

    res.json({ message: 'Preserve conserve content updated successfully' });
  } catch (error) {
    console.error('Error updating preserve conserve content:', error);
    res.status(500).json({ error: 'Failed to update preserve conserve content' });
  }
});

// PUT /admin/features/:id - Update feature
router.put('/admin/features/:id', authenticateToken, uploadSingle('icon'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, display_order, is_active } = req.body;

    // Check if feature exists
    const [existing] = await pool.execute('SELECT * FROM preserve_conserve_features WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Preserve conserve feature not found' });
    }

    let icon_url = existing[0].icon_url;
    if (req.file) {
      icon_url = `/uploads/${req.file.filename}`;
    }

    const [result] = await pool.execute(
      'UPDATE preserve_conserve_features SET title = ?, description = ?, icon_url = ?, display_order = ?, is_active = ? WHERE id = ?',
      [title, description, icon_url, display_order || 0, is_active !== false, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Preserve conserve feature not found' });
    }

    res.json({ message: 'Preserve conserve feature updated successfully' });
  } catch (error) {
    console.error('Error updating preserve conserve feature:', error);
    res.status(500).json({ 
      error: 'Failed to update preserve conserve feature',
      details: error.message 
    });
  }
});

// DELETE /admin/content/:id - Delete content
router.delete('/admin/content/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute('DELETE FROM preserve_conserve_content WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Preserve conserve content not found' });
    }

    res.json({ message: 'Preserve conserve content deleted successfully' });
  } catch (error) {
    console.error('Error deleting preserve conserve content:', error);
    res.status(500).json({ error: 'Failed to delete preserve conserve content' });
  }
});

// DELETE /admin/features/:id - Delete feature
router.delete('/admin/features/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute('DELETE FROM preserve_conserve_features WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Preserve conserve feature not found' });
    }

    res.json({ message: 'Preserve conserve feature deleted successfully' });
  } catch (error) {
    console.error('Error deleting preserve conserve feature:', error);
    res.status(500).json({ error: 'Failed to delete preserve conserve feature' });
  }
});


module.exports = router;
