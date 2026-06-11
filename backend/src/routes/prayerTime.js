const express = require('express');
const router = express.Router();
const prayerTimeController = require('../controllers/prayerTimeController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Public routes
router.get('/today', prayerTimeController.getToday);
router.get('/monthly', prayerTimeController.getMonthly);

// Admin routes
router.get('/settings', authMiddleware, prayerTimeController.getSettings);
router.put('/settings', authMiddleware, roleMiddleware('super_admin', 'admin'), prayerTimeController.updateSettings);

module.exports = router;
