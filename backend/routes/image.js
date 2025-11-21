const express = require('express');
const cors = require('cors');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// CORS middleware for image routes
router.use(cors({
  origin: ['https://arna.one', 'https://www.arna.one', 'https://api.arna.one'],
  credentials: true
}));

// Uploads klasörünü oluştur
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('✅ Uploads directory created:', uploadsDir);
  } catch (error) {
    console.error('❌ Failed to create uploads directory:', error);
  }
}

// Local storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const filename = `img-${timestamp}-${random}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Sadece resim dosyaları yüklenebilir!'), false);
  }
});


// ✅ Upload image
router.post('/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Dosya yüklenmedi' });
    }

    // Full URL oluştur
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://api.arna.one' 
      : `${req.protocol}://${req.get('host')}`;
    const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;

    res.json({
      success: true,
      message: 'Resim başarıyla yüklendi',
      imageUrl,                         // ✅ frontend burada okuyor
      fileName: req.file.originalname,
      localPath: req.file.path
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({ success: false, message: 'Upload failed', error: error.message });
  }
});


// ✅ List images
router.get('/', async (req, res) => {
  try {
    const files = fs.readdirSync(uploadsDir);
    const images = files
      .filter(file => /\.(jpg|jpeg|png|gif|webp|avif)$/i.test(file))
      .map(file => {
        const filePath = path.join(uploadsDir, file);
        const stats = fs.statSync(filePath);
        const baseUrl = process.env.NODE_ENV === 'production' 
          ? 'https://api.arna.one' 
          : `${req.protocol}://${req.get('host')}`;
        return {
          name: file,
          url: `${baseUrl}/uploads/${file}`,
          localPath: filePath,
          uploadDate: stats.birthtime,
          size: stats.size
        };
      })
      .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));

    res.json(images);
  } catch (error) {
    console.error('❌ Error listing local images:', error);
    res.status(500).json({ message: 'Resimler listelenirken hata oluştu', error: error.message });
  }
});


// ✅ Delete image
router.delete('/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;

    if (!filename || filename === 'undefined') {
      return res.status(400).json({ message: 'Dosya adı bulunamadı' });
    }

    const filePath = path.join(uploadsDir, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ success: true, message: 'Resim başarıyla silindi' });
    } else {
      res.status(404).json({ success: false, message: 'Resim bulunamadı' });
    }
  } catch (error) {
    console.error('❌ Local delete error:', error);
    res.status(500).json({ message: 'Resim silinirken hata oluştu', error: error.message });
  }
});


// ✅ Debug
router.get('/debug', (req, res) => {
  const uploadsDirExists = fs.existsSync(uploadsDir);
  const uploadsDirWritable = uploadsDirExists && fs.accessSync ? true : false;

  res.json({
    message: 'Local Image Service',
    uploadsDir: uploadsDir,
    uploadsDirExists,
    uploadsDirWritable,
    status: uploadsDirExists ? 'READY' : 'MISSING_DIR',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});


// ✅ Local storage test
router.get('/test-local', async (req, res) => {
  try {
    const testFile = path.join(uploadsDir, 'test.txt');
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);
    res.json({ message: 'Local storage test successful', status: 'READY' });
  } catch (error) {
    console.error('Local storage test error:', error);
    res.status(500).json({ error: 'Local storage test failed', message: error.message });
  }
});

module.exports = router;
