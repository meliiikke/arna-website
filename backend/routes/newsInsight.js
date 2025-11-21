const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { uploadSingle, handleUploadError } = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/content', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM news_insight_content WHERE is_active = 1 ORDER BY id');
    res.json(rows[0] || null);
  } catch (error) {
    console.error('Error fetching news insight content:', error);
    res.status(500).json({ error: 'Failed to fetch news insight content' });
  }
});

router.get('/articles', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM news_insight_articles WHERE is_active = 1 ORDER BY display_order ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching news insight articles:', error);
    res.status(500).json({ error: 'Failed to fetch news insight articles' });
  }
});

// Admin routes
router.use(authenticateToken);

// News Insight Content CRUD
router.get('/admin/content', authenticateToken, async (req, res) => {
  try {
    console.log('📥 GET /api/news-insight/admin/content - Fetching news insight content for admin');
    const [rows] = await pool.execute('SELECT * FROM news_insight_content ORDER BY id');
    console.log('✅ News insight content fetched:', rows.length, 'items');
    res.json(rows);
  } catch (error) {
    console.error('❌ Error fetching news insight content:', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to fetch news insight content',
      details: error.message 
    });
  }
});

router.post('/admin/content', authenticateToken, async (req, res) => {
  try {
    const { title, subtitle, description, is_active } = req.body;
    
    const [result] = await pool.execute(
      'INSERT INTO news_insight_content (title, subtitle, description, is_active) VALUES (?, ?, ?, ?)',
      [title, subtitle, description, is_active !== false]
    );

    res.status(201).json({
      message: 'News insight content created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error creating news insight content:', error);
    res.status(500).json({ error: 'Failed to create news insight content' });
  }
});

router.put('/admin/content/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, description, is_active } = req.body;

    const [result] = await pool.execute(
      'UPDATE news_insight_content SET title = ?, subtitle = ?, description = ?, is_active = ? WHERE id = ?',
      [title, subtitle, description, is_active !== false, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'News insight content not found' });
    }

    res.json({ message: 'News insight content updated successfully' });
  } catch (error) {
    console.error('Error updating news insight content:', error);
    res.status(500).json({ error: 'Failed to update news insight content' });
  }
});

router.delete('/admin/content/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute('DELETE FROM news_insight_content WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'News insight content not found' });
    }

    res.json({ message: 'News insight content deleted successfully' });
  } catch (error) {
    console.error('Error deleting news insight content:', error);
    res.status(500).json({ error: 'Failed to delete news insight content' });
  }
});

// News Insight Articles CRUD
router.get('/admin/articles', authenticateToken, async (req, res) => {
  try {
    console.log('📥 GET /api/news-insight/admin/articles - Fetching news insight articles for admin');
    const [rows] = await pool.execute('SELECT * FROM news_insight_articles ORDER BY display_order ASC');
    console.log('✅ News insight articles fetched:', rows.length, 'items');
    res.json(rows);
  } catch (error) {
    console.error('❌ Error fetching news insight articles:', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to fetch news insight articles',
      details: error.message 
    });
  }
});

router.post('/admin/articles', authenticateToken, uploadSingle('image'), handleUploadError, async (req, res) => {
  try {
    const { title, description, button_text, button_link, article_tag, article_date, comments_count, display_order, is_active } = req.body;
    
    let image_url = null;
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }

    const [result] = await pool.execute(
      'INSERT INTO news_insight_articles (title, description, image_url, button_text, button_link, article_tag, article_date, comments_count, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, image_url, button_text, button_link, article_tag, article_date, comments_count || 0, display_order || 0, is_active !== false]
    );

    res.status(201).json({
      message: 'News insight article created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error creating news insight article:', error);
    res.status(500).json({ error: 'Failed to create news insight article' });
  }
});

router.put('/admin/articles/:id', authenticateToken, uploadSingle('image'), handleUploadError, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, button_text, button_link, article_tag, article_date, comments_count, display_order, is_active } = req.body;

    // Mevcut makaleyi kontrol et
    const [existing] = await pool.execute('SELECT * FROM news_insight_articles WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'News insight article not found' });
    }

    let image_url = existing[0].image_url;
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }

    await pool.execute(
      'UPDATE news_insight_articles SET title = ?, description = ?, image_url = ?, button_text = ?, button_link = ?, article_tag = ?, article_date = ?, comments_count = ?, display_order = ?, is_active = ? WHERE id = ?',
      [title, description, image_url, button_text, button_link, article_tag, article_date, comments_count || 0, display_order || 0, is_active !== false, id]
    );

    res.json({ message: 'News insight article updated successfully' });
  } catch (error) {
    console.error('Error updating news insight article:', error);
    res.status(500).json({ error: 'Failed to update news insight article' });
  }
});

router.delete('/admin/articles/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute('DELETE FROM news_insight_articles WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'News insight article not found' });
    }

    res.json({ message: 'News insight article deleted successfully' });
  } catch (error) {
    console.error('Error deleting news insight article:', error);
    res.status(500).json({ error: 'Failed to delete news insight article' });
  }
});

module.exports = router;
