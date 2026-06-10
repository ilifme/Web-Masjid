const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/active', bannerController.getActive);

// Admin routes
router.get('/', authMiddleware, bannerController.getAll);
router.get('/:id', authMiddleware, bannerController.getById);
router.post('/', authMiddleware, roleMiddleware('super_admin', 'admin'), upload.single('banner'), bannerController.create);
router.put('/:id', authMiddleware, roleMiddleware('super_admin', 'admin'), upload.single('banner'), bannerController.update);
router.delete('/:id', authMiddleware, roleMiddleware('super_admin', 'admin'), bannerController.delete);

module.exports = router;
