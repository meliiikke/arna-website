const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { uploadSingle, handleUploadError } = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/content', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM brand_trust_content WHERE is_active = 1');
    res.json(rows[0] || null);
  } catch (error) {
    console.error('Error fetching brand trust content:', error);
    res.status(500).json({ error: 'Failed to fetch brand trust content' });
  }
});

router.get('/logos', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM brand_trust_logos WHERE is_active = 1 ORDER BY display_order ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching brand trust logos:', error);
    res.status(500).json({ error: 'Failed to fetch brand trust logos' });
  }
});

// Admin routes
router.use(authenticateToken);

// Brand Trust Content CRUD
router.get('/admin/content', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM brand_trust_content ORDER BY id');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching brand trust content:', error);
    res.status(500).json({ error: 'Failed to fetch brand trust content' });
  }
});

router.post('/admin/content', authenticateToken, async (req, res) => {
  try {
    console.log('📥 POST /brand-trust/admin/content - Request body:', req.body);
    const { title, is_active } = req.body;
    
    console.log('📝 Parsed data:', { title, is_active });
    
    const [result] = await pool.execute(
      'INSERT INTO brand_trust_content (title, is_active) VALUES (?, ?)',
      [title, is_active !== 'false']
    );

    console.log('✅ Insert result:', result);

    res.status(201).json({
      message: 'Brand trust content created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('❌ Error creating brand trust content:', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to create brand trust content',
      details: error.message 
    });
  }
});

router.put('/admin/content/:id', authenticateToken, async (req, res) => {
  try {
    console.log('📥 PUT /brand-trust/admin/content/:id - Request body:', req.body);
    console.log('📥 PUT /brand-trust/admin/content/:id - Params:', req.params);
    
    const { id } = req.params;
    const { title, is_active } = req.body;

    console.log('📝 Parsed data:', { id, title, is_active });

    const [result] = await pool.execute(
      'UPDATE brand_trust_content SET title = ?, is_active = ? WHERE id = ?',
      [title, is_active !== 'false', id]
    );

    console.log('✅ Update result:', result);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Brand trust content not found' });
    }

    res.json({ message: 'Brand trust content updated successfully' });
  } catch (error) {
    console.error('❌ Error updating brand trust content:', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to update brand trust content',
      details: error.message 
    });
  }
});

router.delete('/admin/content/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute('DELETE FROM brand_trust_content WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Brand trust content not found' });
    }

    res.json({ message: 'Brand trust content deleted successfully' });
  } catch (error) {
    console.error('Error deleting brand trust content:', error);
    res.status(500).json({ error: 'Failed to delete brand trust content' });
  }
});

// Brand Trust Logos CRUD
router.get('/admin/logos', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM brand_trust_logos ORDER BY display_order ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching brand trust logos:', error);
    res.status(500).json({ error: 'Failed to fetch brand trust logos' });
  }
});

router.post('/admin/logos', authenticateToken, (req, res, next) => {
  uploadSingle('logo')(req, res, function(err) {
    if (err && err.code !== 'LIMIT_UNEXPECTED_FILE') return next(err);
    next();
  });
}, async (req, res) => {
  try {
    console.log('📥 POST /brand-trust/admin/logos - Request body:', req.body);
    console.log('📁 File info:', req.file);
    console.log('📁 File details:', req.file ? {
      fieldname: req.file.fieldname,
      originalname: req.file.originalname,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size
    } : 'No file');
    
    const { brand_name, display_order, is_active } = req.body;
    
    // Brand name kontrolü (NOT NULL constraint)
    if (!brand_name || brand_name.trim() === '') {
      return res.status(400).json({ error: 'Brand name is required' });
    }
    
    let logo_url = null;
    if (req.file) {
      logo_url = `/uploads/${req.file.filename}`;
      console.log('✅ Logo uploaded:', logo_url);
    } else {
      console.log('⚠️ No file uploaded');
    }

    console.log('📝 Parsed data:', { brand_name, display_order, is_active, logo_url });

    const [result] = await pool.execute(
      'INSERT INTO brand_trust_logos (brand_name, logo_url, display_order, is_active) VALUES (?, ?, ?, ?)',
      [brand_name, logo_url, display_order || 0, is_active !== 'false']
    );

    console.log('✅ Insert result:', result);

    res.status(201).json({
      message: 'Brand trust logo created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('❌ Error creating brand trust logo:', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to create brand trust logo',
      details: error.message 
    });
  }
});

router.put('/admin/logos/:id', authenticateToken, (req, res, next) => {
  uploadSingle('logo')(req, res, function(err) {
    if (err && err.code !== 'LIMIT_UNEXPECTED_FILE') return next(err);
    next();
  });
}, async (req, res) => {
  try {
    console.log('📥 PUT /brand-trust/admin/logos/:id - Request body:', req.body);
    console.log('📥 PUT /brand-trust/admin/logos/:id - Params:', req.params);
    console.log('📁 File info:', req.file);
    console.log('📁 File details:', req.file ? {
      fieldname: req.file.fieldname,
      originalname: req.file.originalname,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size
    } : 'No file');
    
    const { id } = req.params;
    const { brand_name, display_order, is_active } = req.body;

    // Brand name kontrolü (NOT NULL constraint)
    if (!brand_name || brand_name.trim() === '') {
      return res.status(400).json({ error: 'Brand name is required' });
    }

    // Mevcut logoyu kontrol et
    const [existing] = await pool.execute('SELECT * FROM brand_trust_logos WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Brand trust logo not found' });
    }

    let logo_url = existing[0].logo_url;
    if (req.file) {
      logo_url = `/uploads/${req.file.filename}`;
      console.log('✅ New logo uploaded:', logo_url);
    } else {
      console.log('⚠️ No new file uploaded, keeping existing:', logo_url);
    }

    console.log('📝 Parsed data:', { id, brand_name, display_order, is_active, logo_url });

    await pool.execute(
      'UPDATE brand_trust_logos SET brand_name = ?, logo_url = ?, display_order = ?, is_active = ? WHERE id = ?',
      [brand_name, logo_url, display_order || 0, is_active !== 'false', id]
    );

    console.log('✅ Update completed successfully');

    res.json({ message: 'Brand trust logo updated successfully' });
  } catch (error) {
    console.error('❌ Error updating brand trust logo:', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to update brand trust logo',
      details: error.message 
    });
  }
});

router.delete('/admin/logos/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute('DELETE FROM brand_trust_logos WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Brand trust logo not found' });
    }

    res.json({ message: 'Brand trust logo deleted successfully' });
  } catch (error) {
    console.error('Error deleting brand trust logo:', error);
    res.status(500).json({ error: 'Failed to delete brand trust logo' });
  }
});

module.exports = router;
