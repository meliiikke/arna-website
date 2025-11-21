const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// CORS middleware kaldırıldı - server.js'de global CORS var

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

// Get all content sections (public)
router.get('/sections', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM content_sections WHERE is_active = true ORDER BY section_name');
    
    // Clean image URLs to prevent CORS errors
    const cleanedRows = rows.map(section => ({
      ...section,
      image_url: cleanImageUrl(section.image_url)
    }));
    
    res.json(cleanedRows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific content section (public)
router.get('/sections/:sectionName', async (req, res) => {
  try {
    const { sectionName } = req.params;
    const [rows] = await pool.execute('SELECT * FROM content_sections WHERE section_name = ? AND is_active = true', [sectionName]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Content section not found' });
    }
    
    // Clean image URL to prevent CORS errors
    const section = {
      ...rows[0],
      image_url: cleanImageUrl(rows[0].image_url)
    };
    
    res.json(section);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Services routes moved to dedicated services.js file

// Get all statistics (public)
router.get('/statistics', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM statistics WHERE is_active = true ORDER BY order_index');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get contact info (public)
router.get('/contact', async (req, res) => {
  try {
    // CORS headers
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-auth-token');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    const [rows] = await pool.execute('SELECT * FROM contact_info');
    const contactInfo = {};
    rows.forEach(row => {
      contactInfo[row.field_name] = row.field_value;
    });

    res.json(contactInfo);
  } catch (error) {
    console.error('Contact info fetch error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get hero features (public)
router.get('/hero-features', async (req, res) => {
  try {

    const [rows] = await pool.execute('SELECT * FROM hero_features WHERE is_active = true ORDER BY order_index');

    res.json(rows);
  } catch (error) {
    console.error('Error fetching hero features:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get about features (public)
router.get('/about-features', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM about_features WHERE is_active = true ORDER BY order_index');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get about stats (public)
router.get('/about-stats', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM about_stats WHERE is_active = true ORDER BY id');
    res.json(rows);
  } catch (error) {
    console.error('About stats fetch error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get map points (public)
router.get('/map-points', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM map_points WHERE is_active = true ORDER BY order_index');
    res.json(rows);
  } catch (error) {
    console.error('Map points fetch error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get map points for admin
router.get('/admin/map-points', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM map_points ORDER BY order_index');
    res.json(rows);
  } catch (error) {
    console.error('Map points admin fetch error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create map point
router.post('/admin/map-points', authenticateToken, async (req, res) => {
  try {
    const { title, description, icon, order_index, is_active, x, y } = req.body;

    // Generate random coordinates if not provided
    const randomX = x || (Math.random() * 80 + 10);
    const randomY = y || (Math.random() * 80 + 10);

    // Check if x and y columns exist, if not use basic insert
    try {
      const [result] = await pool.execute(
        'INSERT INTO map_points (title, description, icon, order_index, is_active, x, y) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [title, description || '', icon || '🏢', order_index || 0, is_active !== undefined ? is_active : true, randomX, randomY]
      );
      res.json({ message: 'Map point created successfully', id: result.insertId });
    } catch (columnError) {
      // Fallback to basic insert without x, y columns
      const [result] = await pool.execute(
        'INSERT INTO map_points (title, description, icon, order_index, is_active) VALUES (?, ?, ?, ?, ?)',
        [title, description || '', icon || '🏢', order_index || 0, is_active !== undefined ? is_active : true]
      );
      res.json({ message: 'Map point created successfully', id: result.insertId });
    }
  } catch (error) {
    console.error('Map point create error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update map point
router.put('/admin/map-points/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, icon, order_index, is_active, x, y } = req.body;

    // If only coordinates are being updated (partial update)
    if (x !== undefined || y !== undefined) {
      try {
        const updateFields = [];
        const updateValues = [];
        
        if (x !== undefined) {
          updateFields.push('x = ?');
          updateValues.push(x);
        }
        if (y !== undefined) {
          updateFields.push('y = ?');
          updateValues.push(y);
        }
        
        updateValues.push(id);
        
        const [result] = await pool.execute(
          `UPDATE map_points SET ${updateFields.join(', ')} WHERE id = ?`,
          updateValues
        );
        
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Map point not found' });
        }
        
        return res.json({ message: 'Map point coordinates updated successfully', affectedRows: result.affectedRows });
      } catch (columnError) {
        // If x, y columns don't exist, ignore coordinate updates
        return res.json({ message: 'Map point updated (coordinates ignored)', affectedRows: 0 });
      }
    }

    // Full update
    try {
      const [result] = await pool.execute(
        'UPDATE map_points SET title = ?, description = ?, icon = ?, order_index = ?, is_active = ?, x = ?, y = ? WHERE id = ?',
        [title, description || '', icon || '🏢', order_index || 0, is_active !== undefined ? is_active : true, x || null, y || null, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Map point not found' });
      }

      res.json({ message: 'Map point updated successfully', affectedRows: result.affectedRows });
    } catch (columnError) {
      // Fallback to basic update without x, y columns
      const [result] = await pool.execute(
        'UPDATE map_points SET title = ?, description = ?, icon = ?, order_index = ?, is_active = ? WHERE id = ?',
        [title, description || '', icon || '🏢', order_index || 0, is_active !== undefined ? is_active : true, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Map point not found' });
      }

      res.json({ message: 'Map point updated successfully', affectedRows: result.affectedRows });
    }
  } catch (error) {
    console.error('Map point update error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete map point
router.delete('/admin/map-points/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM map_points WHERE id = ?', [id]);
    res.json({ message: 'Map point deleted successfully' });
  } catch (error) {
    console.error('Map point delete error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update map points without coordinates
router.post('/admin/map-points/update-coordinates', authenticateToken, async (req, res) => {
  try {
    // Get all map points without coordinates
    const [points] = await pool.execute('SELECT id FROM map_points WHERE x IS NULL OR y IS NULL');
    
    let updatedCount = 0;
    
    for (const point of points) {
      const randomX = Math.random() * 80 + 10;
      const randomY = Math.random() * 80 + 10;
      
      try {
        await pool.execute(
          'UPDATE map_points SET x = ?, y = ? WHERE id = ?',
          [randomX, randomY, point.id]
        );
        updatedCount++;
      } catch (error) {
        console.error(`Error updating coordinates for point ${point.id}:`, error);
      }
    }
    
    res.json({ 
      message: `Updated coordinates for ${updatedCount} map points`,
      updatedCount 
    });
  } catch (error) {
    console.error('Update coordinates error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update about_stats table structure
router.post('/update-about-stats-table', async (req, res) => {
  try {
    // Check if 'value' column exists
    const [columns] = await pool.execute(`SHOW COLUMNS FROM about_stats LIKE 'value'`);
    
    if (columns.length === 0) {
      await pool.execute(`
        ALTER TABLE about_stats 
        ADD COLUMN value VARCHAR(50) DEFAULT NULL AFTER title
      `);
    }
    
    // Update existing data
    await pool.execute(`
      UPDATE about_stats 
      SET value = '2009' 
      WHERE title = 'Why We Are Oil & Gas Company' AND (value IS NULL OR value = '')
    `);
    
    // Insert new data
    await pool.execute(`
      INSERT INTO about_stats (title, value, icon, is_active) VALUES
      ('YILLINDAN BERİ', '2009', '⚡', 1),
      ('ÜLKEDE FAALİYET', '60', '🌍', 1),
      ('ÜRÜN SAYISI', '500+', '📦', 1)
      ON DUPLICATE KEY UPDATE
      title = VALUES(title),
      value = VALUES(value),
      icon = VALUES(icon)
    `);
    
    res.json({ message: 'About stats table updated successfully' });
  } catch (error) {
    console.error('Table update error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



// Get footer bottom links (public)
router.get('/footer-bottom-links', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM footer_bottom_links WHERE is_active = true ORDER BY order_index');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get brand trust logos (public)
router.get('/brand-trust-logos', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM brand_trust_logos WHERE is_active = true ORDER BY display_order');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Preserve conserve content is now handled by dedicated preserveConserve.js routes

// Get contact header (public)
router.get('/contact-header', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM content_sections WHERE section_name = ? AND is_active = true', ['contact_header']);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Contact header not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit contact message (public)
router.post('/contact', async (req, res) => {
  try {

    
    const { name, email, phone, company, subject, message } = req.body;

    if (!name || !email || !message) {

      return res.status(400).json({ message: 'Name, email and message are required' });
    }



    const [result] = await pool.execute(
      'INSERT INTO contact_messages (name, email, phone, company, subject, message) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, phone || null, company || null, subject || null, message]
    );


    res.json({ message: 'Message sent successfully', id: result.insertId });
  } catch (error) {
    console.error('Contact form submission error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get contact messages for admin
router.get('/admin/contact-messages', authenticateToken, async (req, res) => {
  try {

    const [rows] = await pool.execute('SELECT * FROM contact_messages ORDER BY created_at DESC');

    res.json(rows);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark contact message as read
router.put('/admin/contact-messages/:id/read', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('UPDATE contact_messages SET is_read = true WHERE id = ?', [id]);
    res.json({ message: 'Message marked as read' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete contact message
router.delete('/admin/contact-messages/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM contact_messages WHERE id = ?', [id]);
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get hero features for admin
router.get('/admin/hero-features', authenticateToken, async (req, res) => {
  try {
    console.log('🎯 Fetching hero features...');
    const [rows] = await pool.execute('SELECT * FROM hero_features ORDER BY order_index');
    console.log('🎯 Hero features fetched:', rows.length, 'records');
    res.json(rows);
  } catch (error) {
    console.error('🎯 Error fetching hero features:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Test database connection and table
router.get('/admin/hero-features/test', authenticateToken, async (req, res) => {
  try {
    console.log('🎯 Testing database connection...');
    
    // Test connection
    const [connectionTest] = await pool.execute('SELECT 1 as test');
    console.log('🎯 Connection test:', connectionTest);
    
    // Test table existence
    const [tableExists] = await pool.execute('SHOW TABLES LIKE "hero_features"');
    console.log('🎯 Table exists:', tableExists);
    
    // Test table structure
    const [tableStructure] = await pool.execute('DESCRIBE hero_features');
    console.log('🎯 Table structure:', tableStructure);
    
    // Test data count
    const [countResult] = await pool.execute('SELECT COUNT(*) as count FROM hero_features');
    console.log('🎯 Record count:', countResult);
    
    res.json({
      connection: 'OK',
      tableExists: tableExists.length > 0,
      tableStructure,
      recordCount: countResult[0].count
    });
  } catch (error) {
    console.error('🎯 Database test error:', error);
    res.status(500).json({ message: 'Database test failed', error: error.message });
  }
});

// Create hero feature
router.post('/admin/hero-features', authenticateToken, async (req, res) => {
  try {
    const { title, icon, order_index, is_active } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO hero_features (title, icon, order_index, is_active) VALUES (?, ?, ?, ?)',
      [title, icon || '⭐', order_index || 0, is_active !== undefined ? is_active : true]
    );

    res.json({ message: 'Hero feature created successfully', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update hero feature
router.put('/admin/hero-features/:id', authenticateToken, async (req, res) => {
  try {
    console.log('🎯 Hero feature update request:', req.params.id, req.body);
    const { id } = req.params;
    const { title, icon, order_index, is_active } = req.body;

    // Önce kaydın var olup olmadığını kontrol et
    const [existingRecord] = await pool.execute(
      'SELECT * FROM hero_features WHERE id = ?',
      [id]
    );
    
    console.log('🎯 Existing record check:', existingRecord);
    
    if (existingRecord.length === 0) {
      console.log('🎯 Record not found for id:', id);
      return res.status(404).json({ message: 'Hero feature not found' });
    }

    // Provide defaults for missing values
    const updateData = {
      title: title || '',
      icon: icon || '⭐',
      order_index: order_index !== undefined ? order_index : 0,
      is_active: is_active !== undefined ? is_active : true
    };

    // Tablo yapısını kontrol et
    try {
      const [tableInfo] = await pool.execute('DESCRIBE hero_features');
      console.log('🎯 Table structure:', tableInfo);
    } catch (tableError) {
      console.error('🎯 Table structure error:', tableError);
    }

    console.log('🎯 Database update query:', {
      query: 'UPDATE hero_features SET title = ?, icon = ?, order_index = ?, is_active = ? WHERE id = ?',
      params: [updateData.title, updateData.icon, updateData.order_index, updateData.is_active, id]
    });
    
    const [result] = await pool.execute(
      'UPDATE hero_features SET title = ?, icon = ?, order_index = ?, is_active = ? WHERE id = ?',
      [updateData.title, updateData.icon, updateData.order_index, updateData.is_active, id]
    );
    
    console.log('🎯 Database update result:', result);
    
    // Güncelleme sonrası kaydı tekrar kontrol et
    const [updatedRecord] = await pool.execute(
      'SELECT * FROM hero_features WHERE id = ?',
      [id]
    );
    console.log('🎯 Updated record:', updatedRecord);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Hero feature not found' });
    }

    res.json({ message: 'Hero feature updated successfully', affectedRows: result.affectedRows });
  } catch (error) {
    console.error('🎯 Hero feature update error:', error);
    console.error('🎯 Error details:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete hero feature
router.delete('/admin/hero-features/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM hero_features WHERE id = ?', [id]);
    res.json({ message: 'Hero feature deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get about features for admin
router.get('/admin/about-features', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM about_features ORDER BY order_index');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create about feature
router.post('/admin/about-features', authenticateToken, async (req, res) => {
  try {
    const { title, icon, order_index, is_active } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO about_features (title, icon, order_index, is_active) VALUES (?, ?, ?, ?)',
      [title, icon || '⭐', order_index || 0, is_active !== undefined ? is_active : true]
    );

    res.json({ message: 'About feature created successfully', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update about feature
router.put('/admin/about-features/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, icon, order_index, is_active } = req.body;

    // Provide defaults for missing values
    const updateData = {
      title: title || '',
      icon: icon || '⭐',
      order_index: order_index !== undefined ? order_index : 0,
      is_active: is_active !== undefined ? is_active : true
    };

    const [result] = await pool.execute(
      'UPDATE about_features SET title = ?, icon = ?, order_index = ?, is_active = ? WHERE id = ?',
      [updateData.title, updateData.icon, updateData.order_index, updateData.is_active, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'About feature not found' });
    }

    res.json({ message: 'About feature updated successfully', affectedRows: result.affectedRows });
  } catch (error) {
    console.error('About feature update error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete about feature
router.delete('/admin/about-features/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM about_features WHERE id = ?', [id]);
    res.json({ message: 'About feature deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get about stats for admin
router.get('/admin/about-stats', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM about_stats ORDER BY id');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create about stat
router.post('/admin/about-stats', authenticateToken, async (req, res) => {
  try {
    console.log('📊 About stats creation request body:', req.body);
    const { title, value, icon, is_active } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO about_stats (title, value, icon, is_active) VALUES (?, ?, ?, ?)',
      [title, value || '', icon || '🏆', is_active !== undefined ? is_active : true]
    );

    res.json({ message: 'About stat created successfully', id: result.insertId });
  } catch (error) {
    console.error('About stat create error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update about stat
router.put('/admin/about-stats/:id', authenticateToken, async (req, res) => {
  try {
    console.log('📊 About stats update request:', req.params.id, req.body);
    const { id } = req.params;
    const { title, value, icon, is_active } = req.body;

    // Provide defaults for missing values
    const updateData = {
      title: title || '',
      value: value || '',
      icon: icon || '🏆',
      is_active: is_active !== undefined ? is_active : true
    };

    console.log('📊 About stats database update:', {
      query: 'UPDATE about_stats SET title = ?, value = ?, icon = ?, is_active = ? WHERE id = ?',
      params: [updateData.title, updateData.value, updateData.icon, updateData.is_active, id]
    });

    const [result] = await pool.execute(
      'UPDATE about_stats SET title = ?, value = ?, icon = ?, is_active = ? WHERE id = ?',
      [updateData.title, updateData.value, updateData.icon, updateData.is_active, id]
    );

    console.log('📊 About stats update result:', result);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'About stat not found' });
    }

    res.json({ message: 'About stat updated successfully', affectedRows: result.affectedRows });
  } catch (error) {
    console.error('About stat update error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete about stat
router.delete('/admin/about-stats/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM about_stats WHERE id = ?', [id]);
    res.json({ message: 'About stat deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



// Get footer bottom links for admin
router.get('/admin/footer-bottom-links', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM footer_bottom_links ORDER BY order_index');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create footer bottom link
router.post('/admin/footer-bottom-links', authenticateToken, async (req, res) => {
  try {
    const { title, link, order_index, is_active } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO footer_bottom_links (title, link, order_index, is_active) VALUES (?, ?, ?, ?)',
      [title, link, order_index || 0, is_active !== undefined ? is_active : true]
    );

    res.json({ message: 'Footer bottom link created successfully', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update footer bottom link
router.put('/admin/footer-bottom-links/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, link, order_index, is_active } = req.body;

    // Provide defaults for missing values
    const updateData = {
      title: title || '',
      link: link || '',
      order_index: order_index !== undefined ? order_index : 0,
      is_active: is_active !== undefined ? is_active : true
    };

    const [result] = await pool.execute(
      'UPDATE footer_bottom_links SET title = ?, link = ?, order_index = ?, is_active = ? WHERE id = ?',
      [updateData.title, updateData.link, updateData.order_index, updateData.is_active, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Footer bottom link not found' });
    }

    res.json({ message: 'Footer bottom link updated successfully', affectedRows: result.affectedRows });
  } catch (error) {
    console.error('Footer bottom link update error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete footer bottom link
router.delete('/admin/footer-bottom-links/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM footer_bottom_links WHERE id = ?', [id]);
    res.json({ message: 'Footer bottom link deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Brand Trust Logos Management
router.get('/admin/brand-trust-logos', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM brand_trust_logos ORDER BY display_order');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/admin/brand-trust-logos', authenticateToken, async (req, res) => {
  try {
    const { brand_name, logo_url, display_order, is_active } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO brand_trust_logos (brand_name, logo_url, display_order, is_active) VALUES (?, ?, ?, ?)',
      [brand_name, logo_url, display_order || 0, is_active !== undefined ? is_active : true]
    );
    res.json({ message: 'Brand trust logo created successfully', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/admin/brand-trust-logos/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { brand_name, logo_url, display_order, is_active } = req.body;
    const [result] = await pool.execute(
      'UPDATE brand_trust_logos SET brand_name = ?, logo_url = ?, display_order = ?, is_active = ? WHERE id = ?',
      [brand_name, logo_url, display_order || 0, is_active !== undefined ? is_active : true, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Brand trust logo not found' });
    }
    res.json({ message: 'Brand trust logo updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/admin/brand-trust-logos/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM brand_trust_logos WHERE id = ?', [id]);
    res.json({ message: 'Brand trust logo deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Preserve Conserve Content Management is now handled by dedicated preserveConserve.js routes

// ADMIN ROUTES (Protected)

// Get all content sections for admin
router.get('/admin/sections', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM content_sections ORDER BY section_name');
    
    // Clean image URLs to prevent CORS errors
    const cleanedRows = rows.map(section => ({
      ...section,
      image_url: cleanImageUrl(section.image_url)
    }));
    
    res.json(cleanedRows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update content section
router.put('/admin/sections/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, content, image_url, button_text, button_link, is_active } = req.body;



    const [result] = await pool.execute(
      'UPDATE content_sections SET title = ?, subtitle = ?, content = ?, image_url = ?, button_text = ?, button_link = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [title || '', subtitle || '', content || '', image_url || '', button_text || '', button_link || '', is_active !== undefined ? is_active : true, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Content section not found' });
    }

    res.json({ message: 'Content section updated successfully', affectedRows: result.affectedRows });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Services admin routes moved to dedicated services.js file

// Get all statistics for admin
router.get('/admin/statistics', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM statistics ORDER BY order_index');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create statistic
router.post('/admin/statistics', authenticateToken, async (req, res) => {
  try {
    const { title, value, description, icon, order_index } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO statistics (title, value, description, icon, order_index) VALUES (?, ?, ?, ?, ?)',
      [title, value, description, icon, order_index || 0]
    );

    res.json({ message: 'Statistic created successfully', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update statistic
router.put('/admin/statistics/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, value, description, icon, order_index, is_active } = req.body;

    const [result] = await pool.execute(
      'UPDATE statistics SET title = ?, value = ?, description = ?, icon = ?, order_index = ?, is_active = ? WHERE id = ?',
      [title, value, description, icon, order_index, is_active, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Statistic not found' });
    }

    res.json({ message: 'Statistic updated successfully', affectedRows: result.affectedRows });
  } catch (error) {
    console.error('Statistic update error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete statistic
router.delete('/admin/statistics/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM statistics WHERE id = ?', [id]);
    res.json({ message: 'Statistic deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update contact info
router.put('/admin/contact', authenticateToken, async (req, res) => {
  try {
    // CORS headers
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-auth-token');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    const contactData = req.body;


    for (const [fieldName, fieldValue] of Object.entries(contactData)) {
      await pool.execute(
        'INSERT INTO contact_info (field_name, field_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE field_value = ?',
        [fieldName, fieldValue, fieldValue]
      );
    }

    res.json({ message: 'Contact information updated successfully' });
  } catch (error) {
    console.error('Contact info update error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Users Management
router.get('/admin/users', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT id, username, email, role, is_active, created_at FROM users ORDER BY id');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/admin/users', authenticateToken, async (req, res) => {
  try {
    const { username, email, password, role, is_active } = req.body;
    
    // Hash password before storing
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password, role, is_active) VALUES (?, ?, ?, ?, ?)',
      [username, email, hashedPassword, role || 'user', is_active !== undefined ? is_active : true]
    );

    res.json({ message: 'User created successfully', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/admin/users/:id', authenticateToken, async (req, res) => {
  try {
    console.log('👥 User update request:', req.params.id, req.body);
    const { id } = req.params;
    const { username, email, password, role, is_active } = req.body;

    let query = 'UPDATE users SET username = ?, email = ?, role = ?, is_active = ?';
    let params = [username, email, role, is_active];

    if (password) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ', password = ?';
      params.push(hashedPassword);
    }

    query += ' WHERE id = ?';
    params.push(id);

    console.log('👥 User database update:', { query, params });

    const [result] = await pool.execute(query, params);
    console.log('👥 User update result:', result);

    res.json({ message: 'User updated successfully', affectedRows: result.affectedRows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/admin/users/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admins Management
router.get('/admin/admins', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT id, username, email, is_active, created_at FROM admins ORDER BY id');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/admin/admins', authenticateToken, async (req, res) => {
  try {
    console.log('👤 Admin creation request body:', req.body);
    const { username, email, password, is_active } = req.body;
    
    // Hash password before storing
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.execute(
      'INSERT INTO admins (username, email, password, is_active) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, is_active !== undefined ? is_active : true]
    );

    res.json({ message: 'Admin created successfully', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/admin/admins/:id', authenticateToken, async (req, res) => {
  try {
    console.log('👤 Admin update request:', req.params.id, req.body);
    const { id } = req.params;
    const { username, email, password, is_active } = req.body;

    let query = 'UPDATE admins SET username = ?, email = ?, is_active = ?';
    let params = [username, email, is_active];

    if (password) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ', password = ?';
      params.push(hashedPassword);
    }

    query += ' WHERE id = ?';
    params.push(id);

    console.log('👤 Admin database update:', { query, params });

    const [result] = await pool.execute(query, params);
    console.log('👤 Admin update result:', result);

    res.json({ message: 'Admin updated successfully', affectedRows: result.affectedRows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/admin/admins/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM admins WHERE id = ?', [id]);
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Initialize statistics with default data
router.post('/admin/initialize-statistics', authenticateToken, async (req, res) => {
  try {

    
    const statistics = [
      {
        title: 'Years of Experience',
        value: '15+',
        description: 'Leading the energy industry',
        icon: '📈',
        order_index: 1,
        is_active: true
      },
      {
        title: 'Projects Completed',
        value: '500+',
        description: 'Successful energy projects',
        icon: '🏗️',
        order_index: 2,
        is_active: true
      },
      {
        title: 'Happy Clients',
        value: '1000+',
        description: 'Satisfied customers worldwide',
        icon: '😊',
        order_index: 3,
        is_active: true
      }
    ];
    
    let createdCount = 0;
    let updatedCount = 0;
    
    for (const stat of statistics) {
      try {
        const [result] = await pool.execute(
          'INSERT INTO statistics (title, value, description, icon, order_index, is_active) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE title = VALUES(title), value = VALUES(value), description = VALUES(description), icon = VALUES(icon), order_index = VALUES(order_index), is_active = VALUES(is_active)',
          [stat.title, stat.value, stat.description, stat.icon, stat.order_index, stat.is_active]
        );
        
        if (result.affectedRows === 1) {
          createdCount++;
        } else if (result.affectedRows === 2) {
          updatedCount++;
        }
      } catch (error) {
        console.error(`Error with statistic ${stat.title}:`, error);
      }
    }
    

    
    res.json({
      message: 'Statistics initialized successfully',
      created: createdCount,
      updated: updatedCount
    });
  } catch (error) {
    console.error('❌ Statistics initialization error:', error);
    res.status(500).json({ message: 'Statistics initialization failed', error: error.message });
  }
});

// Initialize content sections with default data
router.post('/admin/initialize-sections', authenticateToken, async (req, res) => {
  try {

    
    const sections = [
      {
        section_name: 'mission',
        title: 'Our Mission',
        subtitle: 'Leading the Future of Energy',
        content: 'We are committed to providing sustainable energy solutions that power the world while protecting our environment for future generations.',
        is_active: true
      },
      {
        section_name: 'services_header',
        title: 'Our Services',
        subtitle: 'Comprehensive Energy Solutions',
        content: 'We offer a wide range of energy services to meet your business and personal needs.',
        is_active: true
      },
      {
        section_name: 'statistics',
        title: 'Our Impact',
        subtitle: 'Numbers That Matter',
        content: 'Our commitment to excellence is reflected in our achievements and the trust of our clients worldwide.',
        is_active: true
      },
      {
        section_name: 'about',
        title: 'About ARNA Energy',
        subtitle: 'Your Trusted Energy Partner',
        content: 'With years of experience in the energy sector, we provide innovative solutions that drive progress and sustainability.',
        is_active: true
      },
      {
        section_name: 'contact_header',
        title: 'Get In Touch',
        subtitle: 'We\'d Love to Hear From You',
        content: 'Ready to start your energy journey with us? Contact our team today for personalized solutions.',
        is_active: true
      }
    ];
    
    let createdCount = 0;
    let updatedCount = 0;
    
    for (const section of sections) {
      try {
        const [result] = await pool.execute(
          'INSERT INTO content_sections (section_name, title, subtitle, content, is_active) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE title = VALUES(title), subtitle = VALUES(subtitle), content = VALUES(content), is_active = VALUES(is_active)',
          [section.section_name, section.title, section.subtitle, section.content, section.is_active]
        );
        
        if (result.affectedRows === 1) {
          createdCount++;
        } else if (result.affectedRows === 2) {
          updatedCount++;
        }
      } catch (error) {
        console.error(`Error with section ${section.section_name}:`, error);
      }
    }
    

    
    res.json({
      message: 'Content sections initialized successfully',
      created: createdCount,
      updated: updatedCount
    });
  } catch (error) {
    console.error('❌ Content sections initialization error:', error);
    res.status(500).json({ message: 'Content sections initialization failed', error: error.message });
  }
});

// EMERGENCY: Clean old image URLs from database - ULTRA AGGRESSIVE
router.post('/admin/clean-old-images', authenticateToken, async (req, res) => {
  try {

    
    // ULTRA AGGRESSIVE: Clean hero_slides
    const [heroResult] = await pool.execute(
      `UPDATE hero_slides SET image_url = NULL 
       WHERE image_url LIKE '/uploads/%' 
          OR image_url LIKE 'img-%' 
          OR image_url LIKE '%img-%'
          OR image_url LIKE '%uploads%'
          OR image_url LIKE '%img-1756%'
          OR image_url LIKE '%175667%'
          OR image_url LIKE '%175672%'
          OR image_url LIKE '%175673%'
          OR image_url LIKE '%175680%'`
    );
    
    // ULTRA AGGRESSIVE: Clean content_sections
    const [contentResult] = await pool.execute(
      `UPDATE content_sections SET image_url = NULL 
       WHERE image_url LIKE '/uploads/%' 
          OR image_url LIKE 'img-%' 
          OR image_url LIKE '%img-%'
          OR image_url LIKE '%uploads%'
          OR image_url LIKE '%img-1756%'
          OR image_url LIKE '%175667%'
          OR image_url LIKE '%175672%'
          OR image_url LIKE '%175673%'
          OR image_url LIKE '%175680%'`
    );
    
    // ULTRA AGGRESSIVE: Clean services
    const [servicesResult] = await pool.execute(
      `UPDATE services SET image_url = NULL 
       WHERE image_url LIKE '/uploads/%' 
          OR image_url LIKE 'img-%' 
          OR image_url LIKE '%img-%'
          OR image_url LIKE '%uploads%'
          OR image_url LIKE '%img-1756%'
          OR image_url LIKE '%175667%'
          OR image_url LIKE '%175672%'
          OR image_url LIKE '%175673%'
          OR image_url LIKE '%175680%'`
    );
    
    res.json({
      message: 'ULTRA AGGRESSIVE cleanup completed successfully',
      affectedRows: {
        hero_slides: heroResult.affectedRows,
        content_sections: contentResult.affectedRows,
        services: servicesResult.affectedRows
      }
    });
  } catch (error) {
    console.error('❌ ULTRA AGGRESSIVE cleanup error:', error);
    res.status(500).json({ message: 'ULTRA AGGRESSIVE cleanup failed', error: error.message });
  }
});

module.exports = router;
