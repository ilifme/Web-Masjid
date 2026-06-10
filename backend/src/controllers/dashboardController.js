const { User, Article, Activity, Gallery, Donation, DonationCampaign } = require('../models');

const dashboardController = {
  // Get dashboard statistics
  getStats: async (req, res) => {
    try {
      const stats = {
        users: await User.count(),
        articles: await Article.count(),
        publishedArticles: await Article.count({ where: { status: 'published' } }),
        activities: await Activity.count(),
        activeActivities: await Activity.count({ where: { isActive: true } }),
        galleries: await Gallery.count(),
        photos: await Gallery.count({ where: { type: 'photo' } }),
        videos: await Gallery.count({ where: { type: 'video' } }),
        donations: await Donation.count(),
        campaigns: await DonationCampaign.count(),
        activeCampaigns: await DonationCampaign.count({ where: { isActive: true } }),
      };
      
      // Get recent articles
      const recentArticles = await Article.findAll({
        limit: 5,
        order: [['createdAt', 'DESC']],
        attributes: ['id', 'title', 'status', 'views', 'createdAt'],
      });
      
      // Get recent activities
      const recentActivities = await Activity.findAll({
        limit: 5,
        order: [['createdAt', 'DESC']],
        attributes: ['id', 'title', 'category', 'isActive', 'createdAt'],
      });
      
      // Get total donation amounts
      const totalCampaignTarget = await DonationCampaign.sum('targetAmount');
      const totalCampaignCurrent = await DonationCampaign.sum('currentAmount');
      
      res.json({
        success: true,
        data: {
          stats,
          recentArticles,
          recentActivities,
          donationSummary: {
            totalTarget: totalCampaignTarget || 0,
            totalCollected: totalCampaignCurrent || 0,
            percentage: totalCampaignTarget > 0 ? ((totalCampaignCurrent / totalCampaignTarget) * 100).toFixed(2) : 0,
          },
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        error: error.message,
      });
    }
  },
};

module.exports = dashboardController;
