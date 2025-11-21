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
    const [rows] = await pool.execute('SELECT * FROM news_insight_details');
    res.json({ message: 'Test successful', count: rows.length, data: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ADMIN ROUTES - Authentication required

// Get all news insight details for admin
router.get('/admin', async (req, res) => {
  try {
    console.log('📥 GET /api/news-insight-details/admin - Fetching news insight details for admin');
    
    // Önce tablo var mı kontrol et
    const [tables] = await pool.execute("SHOW TABLES LIKE 'news_insight_details'");
    console.log('📋 Table exists:', tables.length > 0);
    
    if (tables.length === 0) {
      console.log('❌ news_insight_details table does not exist');
      return res.json([]);
    }
    
    const [rows] = await pool.execute(
      `SELECT nid.*, nia.title as article_name 
       FROM news_insight_details nid 
       LEFT JOIN news_insight_articles nia ON nid.article_id = nia.id 
       ORDER BY nid.created_at DESC`
    );
    
    console.log('📊 Raw news insight details from DB:', rows.length, 'items');
    
    const cleanedRows = rows.map(detail => ({
      ...detail,
      image_url: cleanImageUrl(detail.image_url),
      content_sections: detail.content_sections ? JSON.parse(detail.content_sections) : [],
      wysiwyg_content: detail.wysiwyg_content || ''
    }));
    
    console.log('✅ News insight details fetched for admin:', cleanedRows.length, 'items');
    res.json(cleanedRows);
  } catch (error) {
    console.error('❌ Error fetching news insight details for admin:', error);
    res.status(500).json({ error: 'Failed to fetch news insight details' });
  }
});

// Create news insight detail
router.post('/admin', authenticateToken, uploadSingle('image'), handleUploadError, async (req, res) => {
  try {
    const { article_id, title, description, content_sections, wysiwyg_content, image_url, is_active } = req.body;
    
    let finalImageUrl = image_url || null;
    if (req.file) {
      finalImageUrl = `/uploads/${req.file.filename}`;
      console.log('📁 Image uploaded:', req.file.filename, 'Path:', finalImageUrl);
    } else if (image_url) {
      finalImageUrl = image_url;
      console.log('📁 Using provided image URL:', finalImageUrl);
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
      'INSERT INTO news_insight_details (article_id, title, description, content_sections, wysiwyg_content, image_url, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [article_id, title, description || '', JSON.stringify(parsedContentSections), wysiwyg_content || '', finalImageUrl, is_active !== false]
    );

    console.log('✅ News insight detail created:', result.insertId);
    res.status(201).json({
      message: 'News insight detail created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('❌ Error creating news insight detail:', error);
    res.status(500).json({ error: 'Failed to create news insight detail' });
  }
});

// Update news insight detail
router.put('/admin/:id', authenticateToken, uploadSingle('image'), handleUploadError, async (req, res) => {
  try {
    const { id } = req.params;
    const { article_id, title, description, content_sections, wysiwyg_content, image_url, is_active } = req.body;

    // Mevcut detail'i kontrol et
    const [existing] = await pool.execute('SELECT * FROM news_insight_details WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'News insight detail not found' });
    }

    let finalImageUrl = existing[0].image_url;
    if (req.file) {
      finalImageUrl = `/uploads/${req.file.filename}`;
      console.log('📁 Image updated:', req.file.filename, 'Path:', finalImageUrl);
    } else if (image_url !== undefined) {
      finalImageUrl = image_url || null;
      console.log('📁 Using provided image URL:', finalImageUrl);
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
      'UPDATE news_insight_details SET article_id = ?, title = ?, description = ?, content_sections = ?, wysiwyg_content = ?, image_url = ?, is_active = ? WHERE id = ?',
      [article_id, title, description || '', JSON.stringify(parsedContentSections), wysiwyg_content || '', finalImageUrl, is_active !== false, id]
    );

    console.log('✅ News insight detail updated:', id);
    res.json({ message: 'News insight detail updated successfully' });
  } catch (error) {
    console.error('❌ Error updating news insight detail:', error);
    res.status(500).json({ error: 'Failed to update news insight detail' });
  }
});

// Delete news insight detail
router.delete('/admin/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute('DELETE FROM news_insight_details WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'News insight detail not found' });
    }

    console.log('✅ News insight detail deleted:', id);
    res.json({ message: 'News insight detail deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting news insight detail:', error);
    res.status(500).json({ error: 'Failed to delete news insight detail' });
  }
});

// Get news insight detail by article ID (public) - EN SONDA OLMALI
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('📥 GET /api/news-insight-details/' + id + ' - Fetching news insight detail');
    
    const [rows] = await pool.execute(
      `SELECT nid.*, nia.title as article_name, nia.image_url as article_image
       FROM news_insight_details nid 
       LEFT JOIN news_insight_articles nia ON nid.article_id = nia.id 
       WHERE nia.id = ? AND nid.is_active = 1`,
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'News insight detail not found' });
    }
    
    const newsInsightDetail = {
      ...rows[0],
      image_url: cleanImageUrl(rows[0].image_url),
      article_image: cleanImageUrl(rows[0].article_image),
      wysiwyg_content: rows[0].wysiwyg_content || '',
      content_sections: (() => {
        try {
          if (!rows[0].content_sections) {
            return [];
          }
          
          const parsed = JSON.parse(rows[0].content_sections);
          
          if (Array.isArray(parsed)) {
            const normalizedSections = parsed.map(section => {
              if (section.type === 'image' && section.content) {
                return {
                  ...section,
                  content: cleanImageUrl(section.content)
                };
              }
              return section;
            });
            return normalizedSections;
          } else {
            console.warn('content_sections is not an array:', parsed);
            return [];
          }
        } catch (e) {
          console.error('Error parsing content_sections:', e);
          return [];
        }
      })()
    };
    
    console.log('✅ News insight detail fetched:', newsInsightDetail.title);
    res.json(newsInsightDetail);
  } catch (error) {
    console.error('❌ Error fetching news insight detail:', error);
    res.status(500).json({ error: 'Failed to fetch news insight detail' });
  }
});

module.exports = router;
