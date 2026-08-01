const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const colors = require('colors');
const morgan = require('morgan');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Import database connection
const connectDB = require('./config/db');

// Import error handler
const errorHandler = require('./middleware/errorHandler');

// Import route files
const authRoutes = require('./routes/auth');
const weatherRoutes = require('./routes/weather');
const favouriteRoutes = require('./routes/favourites');
const searchHistoryRoutes = require('./routes/searchHistory');

// Initialize Express app
const app = express();

// Security hardening — hide framework fingerprint
app.disable('x-powered-by');

// ============================================
// Middleware Setup
// ============================================

// CORS - allow frontend requests
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parser - parse JSON request bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Morgan - HTTP request logger (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ============================================
// API Routes
// ============================================

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'WeatherHub API is running...',
    timestamp: new Date().toISOString(),
  });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/favourites', favouriteRoutes);
app.use('/api/history', searchHistoryRoutes);

// ============================================
// 404 Handler - Route not found
// ============================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ============================================
// Global Error Handler
// ============================================
app.use(errorHandler);

// ============================================
// Server Startup
// ============================================

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
connectDB();

const server = app.listen(PORT, () => {
  console.log(
    `WeatherHub Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
      .yellow.bold
  );
  console.log(`API URL: http://localhost:${PORT}/api`.cyan);
});

// ============================================
// Unhandled Rejection Handler
// ============================================
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`.red.underline.bold);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// ============================================
// Export for testing
// ============================================
module.exports = app;

