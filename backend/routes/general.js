const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { uploadSingle, handleUploadError } = require('../middleware/upload');

const router = express.Router();

// Table configurations
const tableConfigs = {
  'preserve-conserve-content': {
    table: 'preserve_conserve_content',
    fields: ['title', 'subtitle', 'description', 'background_image_url', 'is_active'],
    imageFields: ['background_image_url'],
    skipDisplayOrder: true
  },
  'preserve-conserve-features': {
    table: 'preserve_conserve_features',
    fields: ['title', 'description', 'icon', 'display_order', 'is_active']
  },
  'global-presence-content': {
    table: 'global_presence_content',
    fields: ['title', 'subtitle', 'description', 'is_active'],
    skipDisplayOrder: true
  },
  'map-points': {
    table: 'map_points',
    fields: ['title', 'description', 'latitude', 'longitude', 'marker_type', 'display_order', 'is_active']
  },
  'value-content': {
    table: 'value_content',
    fields: ['subtitle', 'title', 'description', 'image_url', 'is_active'],
    imageFields: ['image_url'],
    skipDisplayOrder: true
  },
  'value-statistics': {
    table: 'value_statistics',
    fields: ['title', 'percentage', 'display_order', 'is_active']
  },
  'lets-be-great-content': {
    table: 'lets_be_great_content',
    fields: ['subtitle', 'title', 'description', 'button_text', 'button_link', 'background_image_url', 'is_active'],
    imageFields: ['background_image_url'],
    skipDisplayOrder: true
  },
  'lets-be-great-statistics': {
    table: 'lets_be_great_statistics',
    fields: ['title', 'percentage', 'display_order', 'is_active']
  },
  'newsletter': {
    table: 'newsletter',
    fields: ['title', 'subtitle', 'description', 'image_url', 'is_active'],
    imageFields: ['image_url'],
    skipDisplayOrder: true
  },
  'news-insight-content': {
    table: 'news_insight_content',
    fields: ['title', 'subtitle', 'description', 'is_active'],
    skipDisplayOrder: true
  },
  'news-insight-articles': {
    table: 'news_insight_articles',
    fields: ['title', 'description', 'image_url', 'button_text', 'button_link', 'display_order', 'is_active'],
    imageFields: ['image_url']
  },
  'contact-info': {
    table: 'contact_info',
    fields: ['field_name', 'field_value'],
    skipActiveFilter: true
  },
  'footer-info': {
    table: 'footer_info',
    fields: ['logo_description', 'is_active'],
    skipActiveFilter: true
  },
  'services-content': {
    table: 'services_content',
    fields: ['title', 'subtitle', 'description', 'is_active'],
    skipDisplayOrder: true
  },
  'services': {
    table: 'services',
    fields: ['title', 'description', 'image_url', 'display_order', 'is_active'],
    imageFields: ['image_url']
  },
  'projects-content': {
    table: 'projects_content',
    fields: ['title', 'subtitle', 'description', 'is_active'],
    skipDisplayOrder: true
  },
  'leadership-content': {
    table: 'leadership_content',
    fields: ['title', 'subtitle', 'description', 'is_active'],
    skipDisplayOrder: true
  },
  'who-we-are-content': {
    table: 'who_we_are_content',
    fields: ['title', 'subtitle', 'description', 'highlight_text', 'button_text', 'button_link', 'video_url', 'image_url', 'is_active'],
    imageFields: ['image_url'],
    skipDisplayOrder: true
  },
  'who-we-are-features': {
    table: 'who_we_are_features',
    fields: ['feature_text', 'display_order', 'is_active']
  },
  'brand-trust-content': {
    table: 'brand_trust_content',
    fields: ['title', 'is_active'],
    skipDisplayOrder: true
  },
  'brand-trust-logos': {
    table: 'brand_trust_logos',
    fields: ['brand_name', 'logo_url', 'display_order', 'is_active'],
    imageFields: ['logo_url']
  }
};

// Generic CRUD operations
const createCRUDRoutes = (tableName, config) => {
  const { table, fields, imageFields = [], skipActiveFilter = false, skipDisplayOrder = false } = config;
  
  // Public GET routes
  router.get(`/${tableName}`, async (req, res) => {
    try {
      let query = `SELECT * FROM ${table}`;
      if (!skipActiveFilter) {
        query += ` WHERE is_active = 1`;
      }
      if (!skipDisplayOrder) {
        query += ` ORDER BY COALESCE(display_order, 0) ASC, id ASC`;
      } else {
        query += ` ORDER BY id ASC`;
      }
      
      const [rows] = await pool.execute(query);
      
      // Contact-info ve footer-info için özel handling
      if (tableName === 'contact-info' && rows.length === 0) {
        // Default contact info ekle
        try {
          await pool.execute(`
            INSERT INTO contact_info (field_name, field_value) VALUES
            ('phone', '+1 (555) 123-4567'),
            ('email', 'info@arnaenergy.com'),
            ('address', '123 Energy Street, Houston, TX 77001'),
            ('working_hours', 'Monday - Friday: 9:00 AM - 6:00 PM')
          `);
          const [newRows] = await pool.execute(query);
          res.json(newRows);
        } catch (insertError) {
          console.log('Default contact info already exists or insert failed:', insertError.message);
          res.json(rows);
        }
      } else if (tableName === 'footer-info' && rows.length === 0) {
        // Default footer info ekle
        try {
          await pool.execute(`
            INSERT INTO footer_info (logo_description, is_active) VALUES
            ('ARNA Energy - Leading the way in sustainable energy solutions', 1)
          `);
          const [newRows] = await pool.execute(query);
          res.json(newRows);
        } catch (insertError) {
          console.log('Default footer info already exists or insert failed:', insertError.message);
          res.json(rows);
        }
      } else {
        res.json(rows);
      }
    } catch (error) {
      console.error(`🚨 ERROR in ${tableName}:`, {
        message: error.message,
        code: error.code,
        errno: error.errno,
        sqlState: error.sqlState,
        table: table,
        query: query,
        stack: error.stack
      });
      res.status(500).json({ 
        error: `Failed to fetch ${tableName}`,
        details: error.message,
        table: table,
        query: query
      });
    }
  });

  // Admin GET routes
  router.get(`/admin/${tableName}`, authenticateToken, async (req, res) => {
    try {
      let query = `SELECT * FROM ${table}`;
      if (!skipActiveFilter) {
        query += ` WHERE is_active = 1`;
      }
      if (!skipDisplayOrder) {
        query += ` ORDER BY COALESCE(display_order, 0) ASC, id ASC`;
      } else {
        query += ` ORDER BY id ASC`;
      }
      
      const [rows] = await pool.execute(query);
      
      // Contact-info ve footer-info için özel handling
      if (tableName === 'contact-info' && rows.length === 0) {
        // Default contact info ekle
        try {
          await pool.execute(`
            INSERT INTO contact_info (field_name, field_value) VALUES
            ('phone', '+1 (555) 123-4567'),
            ('email', 'info@arnaenergy.com'),
            ('address', '123 Energy Street, Houston, TX 77001'),
            ('working_hours', 'Monday - Friday: 9:00 AM - 6:00 PM')
          `);
          const [newRows] = await pool.execute(query);
          res.json(newRows);
        } catch (insertError) {
          console.log('Default contact info already exists or insert failed:', insertError.message);
          res.json(rows);
        }
      } else if (tableName === 'footer-info' && rows.length === 0) {
        // Default footer info ekle
        try {
          await pool.execute(`
            INSERT INTO footer_info (logo_description, is_active) VALUES
            ('ARNA Energy - Leading the way in sustainable energy solutions', 1)
          `);
          const [newRows] = await pool.execute(query);
          res.json(newRows);
        } catch (insertError) {
          console.log('Default footer info already exists or insert failed:', insertError.message);
          res.json(rows);
        }
      } else {
        res.json(rows);
      }
    } catch (error) {
      console.error(`🚨 ERROR in ${tableName} (admin):`, {
        message: error.message,
        code: error.code,
        errno: error.errno,
        sqlState: error.sqlState,
        table: table,
        query: query,
        stack: error.stack
      });
      res.status(500).json({ 
        error: `Failed to fetch ${tableName}`,
        details: error.message,
        table: table,
        query: query
      });
    }
  });

  // Create route
  router.post(`/admin/${tableName}`, authenticateToken, uploadSingle('image'), handleUploadError, async (req, res) => {
    try {
      const data = { ...req.body };
      
      // Handle image uploads
      if (req.file && imageFields.length > 0) {
        data[imageFields[0]] = `/uploads/${req.file.filename}`;
      }

      // Prepare fields and values
      const insertFields = fields.filter(field => data[field] !== undefined);
      const insertValues = insertFields.map(field => data[field]);
      const placeholders = insertFields.map(() => '?').join(', ');

      const [result] = await pool.execute(
        `INSERT INTO ${table} (${insertFields.join(', ')}) VALUES (${placeholders})`,
        insertValues
      );

      res.status(201).json({
        message: `${tableName} created successfully`,
        id: result.insertId
      });
    } catch (error) {
      console.error(`Error creating ${tableName}:`, error);
      res.status(500).json({ error: `Failed to create ${tableName}` });
    }
  });

  // Update route
  router.put(`/admin/${tableName}/:id`, authenticateToken, uploadSingle('image'), handleUploadError, async (req, res) => {
    try {
      const { id } = req.params;
      const data = { ...req.body };

      // Handle image uploads
      if (req.file && imageFields.length > 0) {
        data[imageFields[0]] = `/uploads/${req.file.filename}`;
      }

      // Prepare update fields
      const updateFields = fields.filter(field => data[field] !== undefined);
      const updateValues = updateFields.map(field => data[field]);
      const setClause = updateFields.map(field => `${field} = ?`).join(', ');

      const [result] = await pool.execute(
        `UPDATE ${table} SET ${setClause} WHERE id = ?`,
        [...updateValues, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: `${tableName} not found` });
      }

      res.json({ message: `${tableName} updated successfully` });
    } catch (error) {
      console.error(`Error updating ${tableName}:`, error);
      res.status(500).json({ error: `Failed to update ${tableName}` });
    }
  });

  // Delete route
  router.delete(`/admin/${tableName}/:id`, authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;

      const [result] = await pool.execute(`DELETE FROM ${table} WHERE id = ?`, [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: `${tableName} not found` });
      }

      res.json({ message: `${tableName} deleted successfully` });
    } catch (error) {
      console.error(`Error deleting ${tableName}:`, error);
      res.status(500).json({ error: `Failed to delete ${tableName}` });
    }
  });
};

// Create routes for all tables
Object.entries(tableConfigs).forEach(([tableName, config]) => {
  createCRUDRoutes(tableName, config);
});

// Special routes for who-we-are-features
router.get('/who-we-are-features', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM who_we_are_features WHERE is_active = 1 ORDER BY display_order ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching who-we-are-features:', error);
    res.status(500).json({ error: 'Failed to fetch who-we-are-features' });
  }
});

// Special routes for services-content
router.get('/services-content', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM services_content WHERE is_active = 1 ORDER BY id ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching services-content:', error);
    res.status(500).json({ error: 'Failed to fetch services-content' });
  }
});

// Special routes for services
router.get('/services', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM services WHERE is_active = 1 ORDER BY display_order ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// Special routes for brand-trust-logos
router.get('/brand-trust-logos', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM brand_trust_logos WHERE is_active = 1 ORDER BY display_order ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching brand-trust-logos:', error);
    res.status(500).json({ error: 'Failed to fetch brand-trust-logos' });
  }
});

// Special routes for contact info (key-value pairs)
router.get('/contact-info', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM contact_info');
    const contactInfo = {};
    rows.forEach(row => {
      contactInfo[row.field_name] = row.field_value;
    });
    res.json(contactInfo);
  } catch (error) {
    console.error('Error fetching contact info:', error);
    res.status(500).json({ error: 'Failed to fetch contact info' });
  }
});

// Contact info - Admin (listeleme)
router.get('/admin/contact-info', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM contact_info');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching contact info (admin):', error);
    res.status(500).json({ error: 'Failed to fetch contact info' });
  }
});

router.put('/admin/contact-info', authenticateToken, async (req, res) => {
  try {
    const contactData = req.body;

    for (const [fieldName, fieldValue] of Object.entries(contactData)) {
      await pool.execute(
        'INSERT INTO contact_info (field_name, field_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE field_value = ?',
        [fieldName, fieldValue, fieldValue]
      );
    }

    res.json({ message: 'Contact information updated successfully' });
  } catch (error) {
    console.error('Error updating contact info:', error);
    res.status(500).json({ error: 'Failed to update contact info' });
  }
});

// Newsletter subscriptions - Public
router.get('/newsletter-subscriptions', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM newsletter_subscriptions ORDER BY subscribed_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching newsletter subscriptions:', error);
    res.status(500).json({ error: 'Failed to fetch newsletter subscriptions' });
  }
});

// Newsletter subscriptions - Admin
router.get('/admin/newsletter-subscriptions', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM newsletter_subscriptions ORDER BY subscribed_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching newsletter subscriptions:', error);
    res.status(500).json({ error: 'Failed to fetch newsletter subscriptions' });
  }
});

router.post('/newsletter-subscriptions', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const [result] = await pool.execute(
      'INSERT INTO newsletter_subscriptions (email) VALUES (?) ON DUPLICATE KEY UPDATE subscribed_at = CURRENT_TIMESTAMP',
      [email]
    );

    res.status(201).json({
      message: 'Newsletter subscription successful',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error creating newsletter subscription:', error);
    res.status(500).json({ error: 'Failed to create newsletter subscription' });
  }
});

// Contact messages - Public
router.get('/contact-messages', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM contact_messages ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ error: 'Failed to fetch contact messages' });
  }
});

// Contact messages - Admin
router.get('/admin/contact-messages', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM contact_messages ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ error: 'Failed to fetch contact messages' });
  }
});

router.post('/contact-messages', async (req, res) => {
  try {
    const { name, email, phone, company, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message are required' });
    }

    const [result] = await pool.execute(
      'INSERT INTO contact_messages (name, email, phone, company, subject, message) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, phone || null, company || null, subject || null, message]
    );

    res.status(201).json({
      message: 'Message sent successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error creating contact message:', error);
    res.status(500).json({ error: 'Failed to create contact message' });
  }
});

router.put('/admin/contact-messages/:id/read', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('UPDATE contact_messages SET is_read = true WHERE id = ?', [id]);
    res.json({ message: 'Message marked as read' });
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ error: 'Failed to mark message as read' });
  }
});

router.delete('/admin/contact-messages/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM contact_messages WHERE id = ?', [id]);
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact message:', error);
    res.status(500).json({ error: 'Failed to delete contact message' });
  }
});

// Admin test endpoint
router.get('/admin/test', authenticateToken, async (req, res) => {
  try {
    res.json({
      message: 'Admin test endpoint working',
      timestamp: new Date().toISOString(),
      admin: req.admin
    });
  } catch (error) {
    console.error('Error in admin test:', error);
    res.status(500).json({ error: 'Admin test failed' });
  }
});

module.exports = router;
