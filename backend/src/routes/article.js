const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/published', articleController.getPublished);
router.get('/slug/:slug', articleController.getBySlug);

// Admin routes
router.get('/', authMiddleware, articleController.getAll);
router.get('/:id', authMiddleware, articleController.getById);
router.post('/', authMiddleware, roleMiddleware('super_admin', 'admin', 'editor'), upload.single('thumbnail'), articleController.create);
router.put('/:id', authMiddleware, roleMiddleware('super_admin', 'admin', 'editor'), upload.single('thumbnail'), articleController.update);
router.delete('/:id', authMiddleware, roleMiddleware('super_admin', 'admin'), articleController.delete);

module.exports = router;
