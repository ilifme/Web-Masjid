const express = require('express');
const router = express.Router();
const managementController = require('../controllers/managementController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', managementController.getAll);

// Admin routes
router.get('/:id', authMiddleware, managementController.getById);
router.post('/', authMiddleware, roleMiddleware('super_admin', 'admin'), upload.single('photo'), managementController.create);
router.put('/:id', authMiddleware, roleMiddleware('super_admin', 'admin'), upload.single('photo'), managementController.update);
router.delete('/:id', authMiddleware, roleMiddleware('super_admin', 'admin'), managementController.delete);

module.exports = router;
