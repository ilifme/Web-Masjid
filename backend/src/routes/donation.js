const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes - Donation Accounts
router.get('/accounts/active', donationController.getActiveAccounts);

// Public routes - Campaigns
router.get('/campaigns/active', donationController.getActiveCampaigns);

// Admin routes - Donation Accounts
router.get('/accounts', authMiddleware, donationController.getAllAccounts);
router.post('/accounts', authMiddleware, roleMiddleware('super_admin', 'admin'), upload.single('qris'), donationController.createAccount);
router.put('/accounts/:id', authMiddleware, roleMiddleware('super_admin', 'admin'), upload.single('qris'), donationController.updateAccount);
router.delete('/accounts/:id', authMiddleware, roleMiddleware('super_admin', 'admin'), donationController.deleteAccount);

// Admin routes - Campaigns
router.get('/campaigns', authMiddleware, donationController.getAllCampaigns);
router.post('/campaigns', authMiddleware, roleMiddleware('super_admin', 'admin'), upload.single('image'), donationController.createCampaign);
router.put('/campaigns/:id', authMiddleware, roleMiddleware('super_admin', 'admin'), upload.single('image'), donationController.updateCampaign);
router.delete('/campaigns/:id', authMiddleware, roleMiddleware('super_admin', 'admin'), donationController.deleteCampaign);

module.exports = router;
