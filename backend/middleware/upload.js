const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Uploads klasörünü oluştur
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('✅ Uploads directory created:', uploadsDir);
  } catch (error) {
    console.error('❌ Failed to create uploads directory:', error);
  }
} else {
  console.log('✅ Uploads directory exists:', uploadsDir);
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Dosya adını benzersiz yap
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Sadece resim dosyalarına izin ver
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Single file upload
const uploadSingle = (fieldName) => {
  return (req, res, next) => {
    console.log('🔍 Upload middleware called for field:', fieldName);
    console.log('📁 Request headers:', {
      'content-type': req.headers['content-type'],
      'content-length': req.headers['content-length']
    });
    
    upload.single(fieldName)(req, res, (err) => {
      if (err) {
        console.error('❌ Upload middleware error:', err);
        return handleUploadError(err, req, res, next);
      }
      
      console.log('✅ Upload middleware success:', {
        fieldName,
        file: req.file ? {
          filename: req.file.filename,
          originalname: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype
        } : 'No file'
      });
      
      next();
    });
  };
};

// Multiple files upload
const uploadMultiple = (fieldName, maxCount = 10) => {
  return upload.array(fieldName, maxCount);
};

// Error handler
const handleUploadError = (error, req, res, next) => {
  console.error('❌ Upload error:', error);
  
  if (error instanceof multer.MulterError) {
    console.error('❌ Multer error:', error.code, error.message);
    
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        error: 'File too large', 
        message: 'Maximum file size is 5MB.',
        code: 'LIMIT_FILE_SIZE'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ 
        error: 'Too many files', 
        message: 'Maximum is 10 files.',
        code: 'LIMIT_FILE_COUNT'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ 
        error: 'Unexpected file field', 
        message: 'Check the field name in your form.',
        code: 'LIMIT_UNEXPECTED_FILE'
      });
    }
  }
  
  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({ 
      error: 'Invalid file type', 
      message: 'Only image files are allowed!',
      code: 'INVALID_FILE_TYPE'
    });
  }
  
  // Generic upload error
  return res.status(500).json({ 
    error: 'Upload failed', 
    message: error.message,
    code: 'UPLOAD_ERROR'
  });
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  handleUploadError
};
