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

// Test endpoint
router.get('/test', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM product_details');
    res.json({ message: 'Test successful', count: rows.length, data: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ADMIN ROUTES - Authentication required

// Get all product details for admin
router.get('/admin', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT pd.*, op.title as product_name 
       FROM product_details pd 
       LEFT JOIN our_products op ON pd.product_id = op.id 
       ORDER BY pd.created_at DESC`
    );
    
    const cleanedRows = rows.map(detail => ({
      ...detail,
      image_url: cleanImageUrl(detail.image_url),
      content_sections: detail.content_sections ? JSON.parse(detail.content_sections) : [],
      wysiwyg_content: detail.wysiwyg_content || '',
      product_name: detail.product_name || `Product ID: ${detail.product_id}`
    }));
    
    res.json(cleanedRows);
  } catch (error) {
    console.error('❌ Error fetching product details for admin:', error);
    res.status(500).json({ error: 'Failed to fetch product details' });
  }
});

// Create product detail
router.post('/admin', authenticateToken, uploadSingle('image'), handleUploadError, async (req, res) => {
  try {
    const { product_id, title, description, content_sections, wysiwyg_content, image_url, is_active } = req.body;
    
    let finalImageUrl = image_url || null;
    if (req.file) {
      finalImageUrl = `/uploads/${req.file.filename}`;
    }

    // Parse content_sections if it's a string
    let parsedContentSections = [];
    if (content_sections) {
      try {
        parsedContentSections = typeof content_sections === 'string' 
          ? JSON.parse(content_sections) 
          : content_sections;
      } catch (e) {
        console.error('Error parsing content_sections:', e);
      }
    }

    const [result] = await pool.execute(
      'INSERT INTO product_details (product_id, title, description, content_sections, wysiwyg_content, image_url, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [product_id, title, description || '', JSON.stringify(parsedContentSections), wysiwyg_content || '', finalImageUrl, is_active !== false]
    );

    res.status(201).json({
      message: 'Product detail created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('❌ Error creating product detail:', error);
    res.status(500).json({ error: 'Failed to create product detail' });
  }
});

// Update product detail
router.put('/admin/:id', authenticateToken, uploadSingle('image'), handleUploadError, async (req, res) => {
  try {
    const { id } = req.params;
    const { product_id, title, description, content_sections, wysiwyg_content, image_url, is_active } = req.body;

    // Mevcut detail'i kontrol et
    const [existing] = await pool.execute('SELECT * FROM product_details WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Product detail not found' });
    }

    let finalImageUrl = existing[0].image_url;
    if (req.file) {
      finalImageUrl = `/uploads/${req.file.filename}`;
    } else if (image_url !== undefined) {
      finalImageUrl = image_url || null;
    }

    // Parse content_sections if it's a string
    let parsedContentSections = existing[0].content_sections;
    if (content_sections) {
      try {
        parsedContentSections = typeof content_sections === 'string' 
          ? JSON.parse(content_sections) 
          : content_sections;
      } catch (e) {
        console.error('Error parsing content_sections:', e);
      }
    }

    await pool.execute(
      'UPDATE product_details SET product_id = ?, title = ?, description = ?, content_sections = ?, wysiwyg_content = ?, image_url = ?, is_active = ? WHERE id = ?',
      [product_id, title, description || '', JSON.stringify(parsedContentSections), wysiwyg_content || '', finalImageUrl, is_active !== false, id]
    );

    res.json({ message: 'Product detail updated successfully' });
  } catch (error) {
    console.error('❌ Error updating product detail:', error);
    res.status(500).json({ error: 'Failed to update product detail' });
  }
});

// Delete product detail
router.delete('/admin/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute('DELETE FROM product_details WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product detail not found' });
    }

    console.log('✅ Product detail deleted:', id);
    res.json({ message: 'Product detail deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting product detail:', error);
    res.status(500).json({ error: 'Failed to delete product detail' });
  }
});

// Get product detail by product ID (public) - EN SONDA OLMALI
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await pool.execute(
      `SELECT pd.*, op.title as product_name, op.icon_url as product_icon
       FROM product_details pd 
       LEFT JOIN our_products op ON pd.product_id = op.id 
       WHERE op.id = ? AND pd.is_active = 1`,
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product detail not found' });
    }
    
    const productDetail = {
      ...rows[0],
      image_url: cleanImageUrl(rows[0].image_url),
      product_icon: cleanImageUrl(rows[0].product_icon),
      wysiwyg_content: rows[0].wysiwyg_content || '',
      content_sections: (() => {
        try {
          if (!rows[0].content_sections) {
            return [];
          }
          
          const parsed = JSON.parse(rows[0].content_sections);
          
          if (Array.isArray(parsed)) {
            return parsed.map(section => {
              if (section.type === 'image' && section.content) {
                return {
                  ...section,
                  content: cleanImageUrl(section.content)
                };
              }
              return section;
            });
          }
          return [];
        } catch (e) {
          console.error('Error parsing content_sections:', e);
          return [];
        }
      })()
    };
    
    res.json(productDetail);
  } catch (error) {
    console.error('❌ Error fetching product detail:', error);
    res.status(500).json({ error: 'Failed to fetch product detail' });
  }
});

module.exports = router;
