const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
require('dotenv').config();

const { initializeDatabase } = require('./config/database');

// Import all routes
const authRoutes = require('./routes/auth');
const heroSlidesRoutes = require('./routes/heroSlides');
const contentRoutes = require('./routes/content');
const valueSectionRoutes = require('./routes/valueSection');
const brandTrustRoutes = require('./routes/brandTrust');
const whoWeAreRoutes = require('./routes/whoWeAre');
const statisticsRoutes = require('./routes/statistics');
const leadershipRoutes = require('./routes/leadership');
const projectsRoutes = require('./routes/projects');
const preserveConserveRoutes = require('./routes/preserveConserve');
const globalPresenceRoutes = require('./routes/globalPresence');
const letsBeGreatRoutes = require('./routes/letsBeGreat');
const newsInsightRoutes = require('./routes/newsInsight');
const newsletterRoutes = require('./routes/newsletter');
const contactInfoRoutes = require('./routes/contactInfo');
const contactMessagesRoutes = require('./routes/contactMessages');
const faqRoutes = require('./routes/faq');
const faqContentRoutes = require('./routes/faqContent');
const projectDetailsRoutes = require('./routes/projectDetails');
const newsInsightDetailsRoutes = require('./routes/newsInsightDetails');
const mapPointsRoutes = require('./routes/mapPoints');
const footerInfoRoutes = require('./routes/footerInfo');
const ourProductsRoutes = require('./routes/ourProducts');
const productDetailsRoutes = require('./routes/productDetails');
const imageRoutes = require('./routes/image');
const generalRoutes = require('./routes/general');

const app = express();

// CORS Configuration
const allowedOrigins = [
  'https://arna.one',
  'https://www.arna.one',
  'https://api.arna.one'
];

// Add localhost for development only
if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.push(
    'http://localhost:3000', 
    'http://localhost:3001', 
    'http://127.0.0.1:3000', 
    'http://127.0.0.1:3001'
  );
}

// CORS middleware - Must be before any other middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false
}));

// Handle preflight requests explicitly
app.options('*', (req, res) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400');
  res.status(200).end();
});

// Body parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });
  } catch (error) {
    console.error('Failed to create uploads directory:', error);
  }
}

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = file.fieldname + '-' + uniqueSuffix + ext;
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: fileFilter
});

// Make upload middleware available globally
app.use((req, res, next) => {
  req.upload = upload;
  next();
});

// Static files middleware for /uploads with proper CORS
app.use('/uploads', (req, res, next) => {
  // Set CORS headers for static files
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Origin, X-Requested-With');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
});

// Serve uploads folder under /uploads path
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, filePath) => {
    // Set cache headers for better performance
    if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg') || filePath.endsWith('.png') || filePath.endsWith('.gif') || filePath.endsWith('.webp') || filePath.endsWith('.svg')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year
    } else {
      res.setHeader('Cache-Control', 'public, max-age=3600'); // 1 hour for other files
    }
    
    // Set content type for better browser handling
    if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
      res.setHeader('Content-Type', 'image/jpeg');
    } else if (filePath.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    } else if (filePath.endsWith('.gif')) {
      res.setHeader('Content-Type', 'image/gif');
    } else if (filePath.endsWith('.webp')) {
      res.setHeader('Content-Type', 'image/webp');
    } else if (filePath.endsWith('.svg')) {
      res.setHeader('Content-Type', 'image/svg+xml');
    }
  }
}));

// Helmet configuration - Allow cross-origin requests and CORS
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: [
        "'self'",
        "data:",
        "https:",
        "http:",
        "blob:",
        "https://arna.one",
        "https://api.arna.one",
        "https://projearna-production.up.railway.app"
      ],
      connectSrc: [
        "'self'",
        "https://arna.one",
        "https://api.arna.one",
        "https://projearna-production.up.railway.app"
      ],
      fontSrc: ["'self'", "https:", "data:"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https:"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: false,
  crossOriginResourcePolicy: false,
  crossOriginIsolation: false
}));

// Rate limiting for login endpoints only
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: { error: "Too many login attempts, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting only to login routes
app.use('/api/auth/login', loginLimiter);

// Database initialization
(async () => {
  try {
    await initializeDatabase();
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection failed:", err.message);
    console.log("Server will continue without database...");
  }
})();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'ARNA Energy Backend API is running',
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000,
    allowedOrigins: allowedOrigins
  });
});

// Image upload endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No image file provided',
        message: 'Please select an image file to upload'
      });
    }

    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://api.arna.one' 
      : `${req.protocol}://${req.get('host')}`;
    const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
    
    res.json({
      message: 'Image uploaded successfully',
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      imageUrl: imageUrl,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      error: 'Upload failed',
      message: error.message
    });
  }
});

// Multiple image upload endpoint
app.post('/api/upload-multiple', upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: 'No image files provided',
        message: 'Please select image files to upload'
      });
    }

    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://api.arna.one' 
      : `${req.protocol}://${req.get('host')}`;
    const imageUrls = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      url: `${baseUrl}/uploads/${file.filename}`
    }));
    
    res.json({
      message: 'Images uploaded successfully',
      count: req.files.length,
      images: imageUrls,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({
      error: 'Upload failed',
      message: error.message
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/hero-slides', heroSlidesRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/value-section', valueSectionRoutes);
app.use('/api/brand-trust', brandTrustRoutes);
app.use('/api/who-we-are', whoWeAreRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/api/leadership', leadershipRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/preserve-conserve', preserveConserveRoutes);
app.use('/api/global-presence', globalPresenceRoutes);
app.use('/api/lets-be-great', letsBeGreatRoutes);
app.use('/api/news-insight', newsInsightRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/contact-info', contactInfoRoutes);
app.use('/api/contact-messages', contactMessagesRoutes);
app.use('/api/faq', faqRoutes);
app.use('/api/faq-content', faqContentRoutes);
app.use('/api/project-details', projectDetailsRoutes);
app.use('/api/news-insight-details', newsInsightDetailsRoutes);
app.use('/api/map-points', mapPointsRoutes);
app.use('/api/footer-info', footerInfoRoutes);
app.use('/api/our-products', ourProductsRoutes);
app.use('/api/product-details', productDetailsRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/general', generalRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Global Error Handler:', err);
  
  // Handle CORS errors specifically
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      error: 'CORS Error',
      message: 'Origin not allowed',
      origin: req.headers.origin,
      allowedOrigins: allowedOrigins
    });
  }
  
  // Handle multer errors
  if (err instanceof multer.MulterError) {
    console.error('❌ Multer error:', err.code, err.message);
    
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large',
        message: 'File size must be less than 5MB',
        code: 'LIMIT_FILE_SIZE'
      });
    }
    
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        error: 'Too many files',
        message: 'Maximum is 10 files',
        code: 'LIMIT_FILE_COUNT'
      });
    }
    
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        error: 'Unexpected file field',
        message: 'Check the field name in your form',
        code: 'LIMIT_UNEXPECTED_FILE'
      });
    }
  }
  
  if (err.message === 'Only image files are allowed!') {
    return res.status(400).json({
      error: 'Invalid file type',
      message: 'Only image files are allowed',
      code: 'INVALID_FILE_TYPE'
    });
  }
  
  res.status(500).json({ 
    error: 'Internal Server Error', 
    message: err.message,
    code: err.code || 'UNKNOWN_ERROR',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`ARNA Energy Backend running on ${HOST}:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API Base URL: https://api.arna.one/api`);
  console.log(`Static Files: https://api.arna.one/uploads/`);
  console.log(`Health Check: https://api.arna.one/api/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

module.exports = app;
