const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Public routes
router.get('/public', settingController.getAsObject);

// Admin routes
router.get('/', authMiddleware, settingController.getAll);
router.get('/:key', authMiddleware, settingController.getByKey);
router.post('/', authMiddleware, roleMiddleware('super_admin', 'admin'), settingController.upsert);
router.post('/bulk', authMiddleware, roleMiddleware('super_admin', 'admin'), settingController.bulkUpdate);
router.delete('/:key', authMiddleware, roleMiddleware('super_admin'), settingController.delete);

module.exports = router;
