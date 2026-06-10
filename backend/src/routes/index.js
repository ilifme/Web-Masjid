const express = require('express');
const router = express.Router();

// Import routes
const authRoutes = require('./auth');
const bannerRoutes = require('./banner');
const aboutRoutes = require('./about');
const prayerTimeRoutes = require('./prayerTime');
const articleRoutes = require('./article');
const activityRoutes = require('./activity');
const galleryRoutes = require('./gallery');
const donationRoutes = require('./donation');
const announcementRoutes = require('./announcement');
const managementRoutes = require('./management');
const settingRoutes = require('./setting');
const userRoutes = require('./user');
const dashboardRoutes = require('./dashboard');

// Use routes
router.use('/auth', authRoutes);
router.use('/banners', bannerRoutes);
router.use('/about', aboutRoutes);
router.use('/prayer-times', prayerTimeRoutes);
router.use('/articles', articleRoutes);
router.use('/activities', activityRoutes);
router.use('/gallery', galleryRoutes);
router.use('/donations', donationRoutes);
router.use('/announcements', announcementRoutes);
router.use('/management', managementRoutes);
router.use('/settings', settingRoutes);
router.use('/users', userRoutes);
router.use('/dashboard', dashboardRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date(),
  });
});

module.exports = router;
