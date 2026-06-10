const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');
const config = require('./src/config');
const { testConnection } = require('./src/config/database');
const routes = require('./src/routes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: config.api.clientUrl,
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Web Masjid API',
    version: '1.0.0',
    documentation: '/api/health',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint tidak ditemukan',
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Terjadi kesalahan pada server',
    error: config.nodeEnv === 'development' ? err : {},
  });
});

// Start server
const startServer = async () => {
  try {
    await testConnection();
    
    app.listen(config.port, () => {
      console.log('=================================');
      console.log('  Web Masjid Backend API');
      console.log('=================================');
      console.log(Environment: );
      console.log(Server running on port );
      console.log(API URL: );
      console.log(Client URL: );
      console.log('=================================');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
