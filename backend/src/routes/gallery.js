const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', galleryController.getAll);

// Admin routes
router.get('/:id', authMiddleware, galleryController.getById);
router.post('/', authMiddleware, roleMiddleware('super_admin', 'admin', 'editor'), upload.single('gallery'), galleryController.create);
router.put('/:id', authMiddleware, roleMiddleware('super_admin', 'admin', 'editor'), upload.single('gallery'), galleryController.update);
router.delete('/:id', authMiddleware, roleMiddleware('super_admin', 'admin'), galleryController.delete);

module.exports = router;
