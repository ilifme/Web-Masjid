const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');
const config = require('./src/config');
const { testConnection } = require('./src/config/database');
const routes = require('./src/routes');

const app = express();

app.use(helmet());
app.use(cors({
  origin: config.api.clientUrl,
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Web Masjid API',
    version: '1.0.0',
    documentation: '/api/health',
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint tidak ditemukan',
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Terjadi kesalahan pada server',
    error: config.nodeEnv === 'development' ? err : {},
  });
});

const startServer = async () => {
  try {
    await testConnection();
    app.listen(config.port, () => {
      console.log('=================================');
      console.log('  Web Masjid Backend API');
      console.log('=================================');
      console.log('Environment: ' + config.nodeEnv);
      console.log('Server running on port ' + config.port);
      console.log('API URL: ' + config.api.url);
      console.log('Client URL: ' + config.api.clientUrl);
      console.log('=================================');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;