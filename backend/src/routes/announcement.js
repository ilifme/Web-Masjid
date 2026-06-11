const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Public routes
router.get('/active', announcementController.getActive);

// Admin routes
router.get('/', authMiddleware, announcementController.getAll);
router.get('/:id', authMiddleware, announcementController.getById);
router.post('/', authMiddleware, roleMiddleware('super_admin', 'admin'), announcementController.create);
router.put('/:id', authMiddleware, roleMiddleware('super_admin', 'admin'), announcementController.update);
router.delete('/:id', authMiddleware, roleMiddleware('super_admin', 'admin'), announcementController.delete);

module.exports = router;
