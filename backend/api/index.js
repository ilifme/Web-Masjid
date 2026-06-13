// Vercel serverless entry point with diagnostics
let app;
try {
  console.log('Loading server module...');
  app = require('../server');
  console.log('Server module loaded successfully');
} catch (err) {
  console.error('Failed to load server module:', err.message);
  console.error(err.stack);
  // Create a minimal Express app to return error info
  const express = require('express');
  app = express();
  app.get('*', (req, res) => {
    res.status(500).json({
      success: false,
      message: 'Server initialization failed',
      error: err.message,
    });
  });
}

module.exports = app;