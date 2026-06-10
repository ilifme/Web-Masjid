const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/active', activityController.getActive);
router.get('/slug/:slug', activityController.getBySlug);

// Admin routes
router.get('/', authMiddleware, activityController.getAll);
router.get('/:id', authMiddleware, activityController.getById);
router.post('/', authMiddleware, roleMiddleware('super_admin', 'admin'), upload.single('image'), activityController.create);
router.put('/:id', authMiddleware, roleMiddleware('super_admin', 'admin'), upload.single('image'), activityController.update);
router.delete('/:id', authMiddleware, roleMiddleware('super_admin', 'admin'), activityController.delete);

module.exports = router;
