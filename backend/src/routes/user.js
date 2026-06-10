const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// All routes require authentication and super_admin role
router.get('/', authMiddleware, roleMiddleware('super_admin'), userController.getAll);
router.get('/:id', authMiddleware, roleMiddleware('super_admin'), userController.getById);
router.post('/', authMiddleware, roleMiddleware('super_admin'), userController.create);
router.put('/:id', authMiddleware, roleMiddleware('super_admin'), userController.update);
router.delete('/:id', authMiddleware, roleMiddleware('super_admin'), userController.delete);

module.exports = router;
