// Vercel serverless entry
let app;
try {
  app = require('../server');
} catch (err) {
  const express = require('express');
  app = express();
  app.use((req, res) => {
    res.status(500).json({ success: false, message: err.message, stack: err.stack });
  });
}
module.exports = app;