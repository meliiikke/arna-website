const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// Public route - Submit contact message
router.post('/submit', async (req, res) => {
  try {
    const { name, email, phone, company, subject, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email and message are required' 
      });
    }
    
    console.log('📧 Contact message submission:', { name, email, phone, company, subject });
    
    const [result] = await pool.execute(
      `INSERT INTO contact_messages (name, email, phone, company, subject, message, is_read, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, 0, NOW())`,
      [name, email, phone || null, company || null, subject || null, message]
    );
    
    console.log('✅ Contact message created:', result.insertId);
    
    res.json({
      success: true,
      message: 'Message sent successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('❌ Error submitting contact message:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message',
      error: error.message 
    });
  }
});

// Admin routes - Get all contact messages
router.get('/admin', authenticateToken, async (req, res) => {
  try {
    console.log('📧 Admin fetching contact messages...');
    
    const [rows] = await pool.execute(`
      SELECT * FROM contact_messages 
      ORDER BY created_at DESC
    `);
    
    console.log('✅ Admin contact messages query result:', rows);
    
    res.json(rows);
  } catch (error) {
    console.error('❌ Error fetching admin contact messages:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch contact messages',
      error: error.message 
    });
  }
});

// Admin routes - Mark message as read
router.put('/admin/:id/read', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('📧 Marking contact message as read:', id);
    
    const [result] = await pool.execute(
      'UPDATE contact_messages SET is_read = 1 WHERE id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Contact message not found' 
      });
    }
    
    console.log('✅ Contact message marked as read:', id);
    
    res.json({
      success: true,
      message: 'Message marked as read'
    });
  } catch (error) {
    console.error('❌ Error marking contact message as read:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to mark message as read',
      error: error.message 
    });
  }
});

// Admin routes - Delete contact message
router.delete('/admin/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('📧 Deleting contact message:', id);
    
    const [result] = await pool.execute(
      'DELETE FROM contact_messages WHERE id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Contact message not found' 
      });
    }
    
    console.log('✅ Contact message deleted:', id);
    
    res.json({
      success: true,
      message: 'Contact message deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting contact message:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete contact message',
      error: error.message 
    });
  }
});

module.exports = router;
