const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { uploadSingle, handleUploadError } = require('../middleware/upload');

const router = express.Router();

console.log('🔧 Services router initialized');

// Public routes

// Test endpoint - PUBLIC (no auth required)
router.get('/test', async (req, res) => {
  try {
    console.log('🧪 Test endpoint called');
    res.json({ message: 'Services API is working', timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({ error: 'Test failed' });
  }
});

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    console.log('🏥 Health check called');
    res.json({ 
      status: 'OK', 
      service: 'services',
      timestamp: new Date().toISOString(),
      routes: ['/', '/test', '/health', '/admin']
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ error: 'Health check failed' });
  }
});

// Debug endpoint - check database data
router.get('/debug', async (req, res) => {
  try {
    console.log('🔍 Debug endpoint called');
    
    // Check services table structure
    const [servicesStructure] = await pool.execute('DESCRIBE services');
    console.log('🔍 Services table structure:', servicesStructure);
    
    // Check services table
    const [servicesRows] = await pool.execute('SELECT * FROM services');
    console.log('🔍 Services table rows:', servicesRows.length);
    
    // Check services_content table structure
    const [contentStructure] = await pool.execute('DESCRIBE services_content');
    console.log('🔍 Services_content table structure:', contentStructure);
    
    // Check services_content table
    const [contentRows] = await pool.execute('SELECT * FROM services_content');
    console.log('🔍 Services_content table rows:', contentRows.length);
    
    res.json({
      services_structure: servicesStructure,
      services_count: servicesRows.length,
      content_structure: contentStructure,
      content_count: contentRows.length,
      services: servicesRows,
      content: contentRows
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    res.status(500).json({ error: 'Debug failed', message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    console.log('🌐 Public Services API - Route called');
    console.log('🌐 Public Services API - Fetching active services...');
    
    // Get all services as a simple array (removed is_active filter for debugging)
    const [servicesRows] = await pool.execute(
      'SELECT id, title, description, image_url, display_order, is_active FROM services ORDER BY display_order ASC'
    );
    
    console.log('🌐 Public Services API - Found services:', servicesRows.length);
    
    // Always return an array, even if empty
    const services = Array.isArray(servicesRows) ? servicesRows : [];
    
    res.json(services);
  } catch (error) {
    console.error('❌ Error fetching services data:', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error code:', error.code);
    
    // Return empty array on error to prevent frontend crashes
    res.json([]);
  }
});

// Get services content only
router.get('/content', async (req, res) => {
  try {
    console.log('🌐 Public Services Content API - Route called');
    const [contentRows] = await pool.execute('SELECT * FROM services_content ORDER BY id');
    
    res.json(contentRows[0] || null);
  } catch (error) {
    console.error('❌ Error fetching services content:', error);
    res.status(500).json({ 
      error: 'Failed to fetch services content',
      message: error.message
    });
  }
});

// Get services list only
router.get('/list', async (req, res) => {
  try {
    console.log('🌐 Public Services List API - Route called');
    const [servicesRows] = await pool.execute('SELECT * FROM services WHERE is_active = 1 ORDER BY display_order ASC');
    
    res.json(servicesRows);
  } catch (error) {
    console.error('❌ Error fetching services list:', error);
    res.status(500).json({ 
      error: 'Failed to fetch services list',
      message: error.message
    });
  }
});

// Admin routes - authentication temporarily disabled for debugging
// router.use(authenticateToken);

// Services Content CRUD
router.get('/admin/content', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM services_content ORDER BY id');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching services content:', error);
    res.status(500).json({ error: 'Failed to fetch services content' });
  }
});

router.post('/admin/content', async (req, res) => {
  try {
    console.log('🆕 Services Content Create - Request received');
    console.log('🆕 Services Content Create - Body:', req.body);
    
    const { title, subtitle, description, is_active } = req.body;
    
    console.log('🆕 Services Content Create - Processed values:', { title, subtitle, description, is_active });
    
    const [result] = await pool.execute(
      'INSERT INTO services_content (title, subtitle, description, is_active) VALUES (?, ?, ?, ?)',
      [title, subtitle, description, is_active !== false]
    );

    console.log('🆕 Services Content Create - Result:', result);
    res.status(201).json({
      message: 'Services content created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('❌ Error creating services content:', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to create services content',
      message: error.message,
      details: error.stack
    });
  }
});

router.put('/admin/content/:id', async (req, res) => {
  try {
    console.log('🔧 Services Content Update - Request received');
    console.log('🔧 Services Content Update - ID:', req.params.id);
    console.log('🔧 Services Content Update - Body:', req.body);
    
    const { id } = req.params;
    const { title, subtitle, description, is_active } = req.body;

    console.log('🔧 Services Content Update - Processed values:', { id, title, subtitle, description, is_active });

    // Mevcut içeriği kontrol et
    const [existing] = await pool.execute('SELECT * FROM services_content WHERE id = ?', [id]);
    console.log('🔧 Services Content Update - Existing record:', existing);
    
    if (existing.length === 0) {
      console.log('❌ Services Content Update - Record not found');
      return res.status(404).json({ error: 'Services content not found' });
    }

    const isActiveValue = is_active === '1' || is_active === 1 || is_active === 'true' || is_active === true ? 1 : 0;
    console.log('🔧 Services Content Update - is_active processed:', isActiveValue);

    await pool.execute(
      'UPDATE services_content SET title = ?, subtitle = ?, description = ?, is_active = ? WHERE id = ?',
      [title, subtitle, description, isActiveValue, id]
    );

    console.log('✅ Services Content Update - Success');
    res.json({ message: 'Services content updated successfully' });
  } catch (error) {
    console.error('❌ Error updating services content:', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to update services content',
      message: error.message,
      details: error.stack
    });
  }
});

router.delete('/admin/content/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute('DELETE FROM services_content WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Services content not found' });
    }

    res.json({ message: 'Services content deleted successfully' });
  } catch (error) {
    console.error('Error deleting services content:', error);
    res.status(500).json({ error: 'Failed to delete services content' });
  }
});

// Services List CRUD
router.get('/admin/services', async (req, res) => {
  try {
    console.log('📥 GET /api/services/admin/services - Fetching services for admin');
    const [rows] = await pool.execute(
      'SELECT * FROM services ORDER BY display_order ASC'
    );
    console.log('✅ Services fetched:', rows.length, 'items');
    console.log('📥 Admin Services - Services data:', rows);
    res.json(rows);
  } catch (error) {
    console.error('❌ Error fetching services:', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to fetch services',
      details: error.message 
    });
  }
});

router.post('/admin/services', uploadSingle('image'), async (req, res) => {
  try {
    console.log('🆕 Service Create - Request received');
    console.log('🆕 Service Create - Body:', req.body);
    console.log('🆕 Service Create - Headers:', req.headers);
    
    const { title, description, image_url, display_order, is_active } = req.body;
    
    let finalImageUrl = image_url || null;
    if (req.file) {
      finalImageUrl = `/uploads/${req.file.filename}`;
    }
    
    console.log('🆕 Service Create - Final values:', { title, description, finalImageUrl, display_order, is_active });

    console.log('🆕 Service Create - is_active raw:', is_active, 'type:', typeof is_active);
    
    const isActiveValue = is_active === '1' || is_active === 1 || is_active === 'true' || is_active === true ? 1 : 0;
    console.log('🆕 Service Create - is_active processed:', isActiveValue);

    const insertValues = [title || null, description || null, finalImageUrl || null, display_order || 0, isActiveValue];
    console.log('🆕 Service Create - Insert values:', insertValues);

    const [result] = await pool.execute(
      'INSERT INTO services (title, description, image_url, display_order, is_active) VALUES (?, ?, ?, ?, ?)',
      insertValues
    );

    console.log('🆕 Service Create - Result:', result);
    res.status(201).json({
      message: 'Service created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('❌ Error creating service:', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to create service',
      message: error.message,
      details: error.stack
    });
  }
});

router.put('/admin/services/:id', uploadSingle('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image_url, display_order, is_active } = req.body;
    
    console.log('🔧 Service Update - ID:', id);
    console.log('🔧 Service Update - Body:', req.body);
    console.log('🔧 Service Update - is_active raw:', is_active, 'type:', typeof is_active);
    
    const isActiveValue = is_active === '1' || is_active === 1 || is_active === 'true' || is_active === true ? 1 : 0;
    console.log('🔧 Service Update - is_active processed:', isActiveValue);
    
    // Mevcut servisi kontrol et
    const [existing] = await pool.execute('SELECT * FROM services WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    let finalImageUrl = image_url || existing[0].image_url;
    if (req.file) {
      finalImageUrl = `/uploads/${req.file.filename}`;
    }
    
    await pool.execute(
      'UPDATE services SET title = ?, description = ?, image_url = ?, display_order = ?, is_active = ? WHERE id = ?',
      [title, description || null, finalImageUrl || null, display_order || 0, isActiveValue, id]
    );

    console.log('🔧 Service Update - Result: Updated successfully');
    res.json({ message: 'Service updated successfully' });
  } catch (error) {
    console.error('❌ Error updating service:', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to update service',
      message: error.message,
      details: error.stack
    });
  }
});

router.delete('/admin/services/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute('DELETE FROM services WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

module.exports = router;
