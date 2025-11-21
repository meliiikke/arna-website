const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { uploadSingle, handleUploadError } = require('../middleware/upload');

const router = express.Router();

// Helper function to clean and normalize image URLs
const cleanImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  
  // If it's already a Cloudinary URL, return as is
  if (imageUrl.includes('cloudinary.com')) {
    return imageUrl;
  }
  
  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If it's a relative path starting with /uploads/, convert to full URL
  if (imageUrl.startsWith('/uploads/')) {
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://api.arna.one' 
      : 'http://localhost:5000';
    return `${baseUrl}${imageUrl}`;
  }
  
  // If it's just a filename, add the full path
  if (imageUrl.includes('img-') && !imageUrl.includes('/')) {
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://api.arna.one' 
      : 'http://localhost:5000';
    return `${baseUrl}/uploads/${imageUrl}`;
  }
  
  return imageUrl;
};

// PUBLIC ROUTES - Frontend için

// Get our products content (title and subtitle)
router.get('/content', async (req, res) => {
  try {
    console.log('📥 GET /api/our-products/content - Fetching our products content');
    const [contentRows] = await pool.execute(
      'SELECT * FROM our_products_content WHERE is_active = 1 ORDER BY id DESC LIMIT 1'
    );
    
    const [productRows] = await pool.execute(
      'SELECT * FROM our_products WHERE is_active = 1 ORDER BY display_order ASC'
    );
    
    console.log('✅ Our products content fetched:', contentRows.length, 'content items,', productRows.length, 'products');
    
    const content = contentRows.length > 0 ? {
      ...contentRows[0],
      products: productRows.map(product => ({
        ...product,
        icon_url: cleanImageUrl(product.icon_url)
      }))
    } : {
      title: 'Ürünlerimiz',
      subtitle: 'Ürün kategorilerimizi tıklayarak tüm ürünleri detaylı görebilirsiniz',
      products: productRows.map(product => ({
        ...product,
        icon_url: cleanImageUrl(product.icon_url)
      }))
    };
    
    res.json(content);
  } catch (error) {
    console.error('❌ Error fetching our products content:', error);
    res.status(500).json({ error: 'Failed to fetch our products content' });
  }
});

// Get all active our products (public) - deprecated, use /content instead
router.get('/products', async (req, res) => {
  try {
    console.log('📥 GET /api/our-products/content - Fetching our products content');
    const [rows] = await pool.execute(
      'SELECT * FROM our_products WHERE is_active = 1 ORDER BY display_order ASC'
    );
    
    console.log('✅ Our products fetched:', rows.length, 'items');
    
    const cleanedRows = rows.map(product => ({
      ...product,
      icon_url: cleanImageUrl(product.icon_url)
    }));
    
    res.json(cleanedRows);
  } catch (error) {
    console.error('❌ Error fetching our products:', error);
    res.status(500).json({ error: 'Failed to fetch our products' });
  }
});

// ADMIN ROUTES - Authentication required

// Get our products content for admin
router.get('/admin/content', authenticateToken, async (req, res) => {
  try {
    console.log('📥 GET /api/our-products/admin/content - Fetching our products content for admin');
    const [rows] = await pool.execute(
      'SELECT * FROM our_products_content ORDER BY id DESC'
    );
    
    console.log('✅ Our products content fetched for admin:', rows.length, 'items');
    res.json(rows);
  } catch (error) {
    console.error('❌ Error fetching our products content for admin:', error);
    res.status(500).json({ error: 'Failed to fetch our products content' });
  }
});

// Create our products content
router.post('/admin/content', authenticateToken, async (req, res) => {
  try {
    const { title, subtitle, is_active } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO our_products_content (title, subtitle, is_active) VALUES (?, ?, ?)',
      [title, subtitle || '', is_active !== false]
    );

    console.log('✅ Our products content created:', result.insertId);
    res.status(201).json({
      message: 'Our products content created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('❌ Error creating our products content:', error);
    res.status(500).json({ error: 'Failed to create our products content' });
  }
});

// Update our products content
router.put('/admin/content/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, is_active } = req.body;

    // Mevcut content'i kontrol et
    const [existing] = await pool.execute('SELECT * FROM our_products_content WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Our products content not found' });
    }

    await pool.execute(
      'UPDATE our_products_content SET title = ?, subtitle = ?, is_active = ? WHERE id = ?',
      [title, subtitle || '', is_active !== false, id]
    );

    console.log('✅ Our products content updated:', id);
    res.json({ message: 'Our products content updated successfully' });
  } catch (error) {
    console.error('❌ Error updating our products content:', error);
    res.status(500).json({ error: 'Failed to update our products content' });
  }
});

// Delete our products content
router.delete('/admin/content/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute('DELETE FROM our_products_content WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Our products content not found' });
    }

    console.log('✅ Our products content deleted:', id);
    res.json({ message: 'Our products content deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting our products content:', error);
    res.status(500).json({ error: 'Failed to delete our products content' });
  }
});

// Get all our products for admin (including inactive)
router.get('/admin', authenticateToken, async (req, res) => {
  try {
    console.log('📥 GET /api/our-products/admin - Fetching our products for admin');
    const [rows] = await pool.execute(
      'SELECT * FROM our_products ORDER BY display_order ASC'
    );
    
    const cleanedRows = rows.map(product => ({
      ...product,
      icon_url: cleanImageUrl(product.icon_url)
    }));
    
    console.log('✅ Our products fetched for admin:', rows.length, 'items');
    res.json(cleanedRows);
  } catch (error) {
    console.error('❌ Error fetching our products for admin:', error);
    res.status(500).json({ error: 'Failed to fetch our products' });
  }
});

// Create our product
router.post('/admin', authenticateToken, uploadSingle('icon'), handleUploadError, async (req, res) => {
  try {
    const { title, description, display_order, is_active } = req.body;
    
    let icon_url = null;
    if (req.file) {
      icon_url = `/uploads/${req.file.filename}`;
      console.log('📁 Icon uploaded:', req.file.filename, 'Path:', icon_url);
    } else {
      console.log('⚠️ No icon file uploaded');
    }

    const [result] = await pool.execute(
      'INSERT INTO our_products (title, description, icon_url, display_order, is_active) VALUES (?, ?, ?, ?, ?)',
      [title, description || '', icon_url, display_order || 1, is_active !== false]
    );

    console.log('✅ Our product created:', result.insertId);
    res.status(201).json({
      message: 'Our product created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('❌ Error creating our product:', error);
    res.status(500).json({ error: 'Failed to create our product' });
  }
});

// Update our product
router.put('/admin/:id', authenticateToken, uploadSingle('icon'), handleUploadError, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, display_order, is_active } = req.body;

    // Mevcut product'ı kontrol et
    const [existing] = await pool.execute('SELECT * FROM our_products WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Our product not found' });
    }

    let icon_url = existing[0].icon_url;
    if (req.file) {
      icon_url = `/uploads/${req.file.filename}`;
      console.log('📁 Icon updated:', req.file.filename, 'Path:', icon_url);
    } else {
      console.log('⚠️ No new icon file uploaded, keeping existing:', icon_url);
    }

    await pool.execute(
      'UPDATE our_products SET title = ?, description = ?, icon_url = ?, display_order = ?, is_active = ? WHERE id = ?',
      [title, description || '', icon_url, display_order || 1, is_active !== false, id]
    );

    console.log('✅ Our product updated:', id);
    res.json({ message: 'Our product updated successfully' });
  } catch (error) {
    console.error('❌ Error updating our product:', error);
    res.status(500).json({ error: 'Failed to update our product' });
  }
});

// Delete our product
router.delete('/admin/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute('DELETE FROM our_products WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Our product not found' });
    }

    console.log('✅ Our product deleted:', id);
    res.json({ message: 'Our product deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting our product:', error);
    res.status(500).json({ error: 'Failed to delete our product' });
  }
});

// Bulk update display order
router.put('/admin/order', authenticateToken, async (req, res) => {
  try {
    const { products } = req.body; // Array of {id, display_order}
    
    if (!Array.isArray(products)) {
      return res.status(400).json({ error: 'Products must be an array' });
    }
    
    let updatedCount = 0;
    
    for (const product of products) {
      if (product.id && product.display_order !== undefined) {
        const [result] = await pool.execute(
          'UPDATE our_products SET display_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [product.display_order, product.id]
        );
        updatedCount += result.affectedRows;
      }
    }
    
    console.log('✅ Our products order updated:', updatedCount, 'items');
    res.json({ 
      message: 'Our products order updated successfully',
      updatedCount
    });
  } catch (error) {
    console.error('❌ Error updating our products order:', error);
    res.status(500).json({ error: 'Failed to update our products order' });
  }
});

module.exports = router;
