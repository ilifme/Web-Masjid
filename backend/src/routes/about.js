const express = require('express');
const router = express.Router();
const aboutController = require('../controllers/aboutController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', aboutController.get);

// Admin routes
router.put('/', authMiddleware, roleMiddleware('super_admin', 'admin'), upload.fields([
  { name: 'mosqueImage', maxCount: 1 },
  { name: 'organizationChart', maxCount: 1 }
]), aboutController.update);

module.exports = router;
