const { Donation, DonationCampaign } = require('../models');

const donationController = {
  // Get all donation accounts
  getAllAccounts: async (req, res) => {
    try {
      const donations = await Donation.findAll({
        order: [['order', 'ASC']],
      });
      
      res.json({
        success: true,
        data: donations,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        error: error.message,
      });
    }
  },
  
  // Get active donation accounts
  getActiveAccounts: async (req, res) => {
    try {
      const donations = await Donation.findAll({
        where: { isActive: true },
        order: [['order', 'ASC']],
      });
      
      res.json({
        success: true,
        data: donations,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        error: error.message,
      });
    }
  },
  
  // Create donation account
  createAccount: async (req, res) => {
    try {
      const { accountName, accountNumber, bankName, isActive, order } = req.body;
      
      const donation = await Donation.create({
        accountName,
        accountNumber,
        bankName,
        qrisImage: req.file ? getFilePath(req.file) : null,
        isActive: isActive !== undefined ? isActive : true,
        order: order || 0,
      });
      
      res.status(201).json({
        success: true,
        message: 'Akun donasi berhasil dibuat',
        data: donation,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        error: error.message,
      });
    }
  },
  
  // Update donation account
  updateAccount: async (req, res) => {
    try {
      const donation = await Donation.findByPk(req.params.id);
      
      if (!donation) {
        return res.status(404).json({
          success: false,
          message: 'Akun donasi tidak ditemukan',
        });
      }
      
      const { accountName, accountNumber, bankName, isActive, order } = req.body;
      
      const updateData = {
        accountName: accountName || donation.accountName,
        accountNumber: accountNumber || donation.accountNumber,
        bankName: bankName || donation.bankName,
        isActive: isActive !== undefined ? isActive : donation.isActive,
        order: order !== undefined ? order : donation.order,
      };
      
      if (req.file) {
        updateData.qrisImage = getFilePath(req.file);
      }
      
      await donation.update(updateData);
      
      res.json({
        success: true,
        message: 'Akun donasi berhasil diupdate',
        data: donation,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        error: error.message,
      });
    }
  },
  
  // Delete donation account
  deleteAccount: async (req, res) => {
    try {
      const donation = await Donation.findByPk(req.params.id);
      
      if (!donation) {
        return res.status(404).json({
          success: false,
          message: 'Akun donasi tidak ditemukan',
        });
      }
      
      await donation.destroy();
      
      res.json({
        success: true,
        message: 'Akun donasi berhasil dihapus',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        error: error.message,
      });
    }
  },
  
  // Get all campaigns
  getAllCampaigns: async (req, res) => {
    try {
      const campaigns = await DonationCampaign.findAll({
        order: [['createdAt', 'DESC']],
      });
      
      res.json({
        success: true,
        data: campaigns,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        error: error.message,
      });
    }
  },
  
  // Get active campaigns
  getActiveCampaigns: async (req, res) => {
    try {
      const campaigns = await DonationCampaign.findAll({
        where: { isActive: true },
        order: [['createdAt', 'DESC']],
      });
      
      res.json({
        success: true,
        data: campaigns,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        error: error.message,
      });
    }
  },
  
  // Create campaign
  createCampaign: async (req, res) => {
    try {
      const { title, description, targetAmount, currentAmount, startDate, endDate, isActive } = req.body;
      
      const campaign = await DonationCampaign.create({
        title,
        description,
        targetAmount: targetAmount || 0,
        currentAmount: currentAmount || 0,
        image: req.file ? getFilePath(req.file) : null,
        startDate,
        endDate,
        isActive: isActive !== undefined ? isActive : true,
      });
      
      res.status(201).json({
        success: true,
        message: 'Campaign donasi berhasil dibuat',
        data: campaign,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        error: error.message,
      });
    }
  },
  
  // Update campaign
  updateCampaign: async (req, res) => {
    try {
      const campaign = await DonationCampaign.findByPk(req.params.id);
      
      if (!campaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign tidak ditemukan',
        });
      }
      
      const { title, description, targetAmount, currentAmount, startDate, endDate, isActive } = req.body;
      
      const updateData = {
        title: title || campaign.title,
        description: description !== undefined ? description : campaign.description,
        targetAmount: targetAmount !== undefined ? targetAmount : campaign.targetAmount,
        currentAmount: currentAmount !== undefined ? currentAmount : campaign.currentAmount,
        startDate: startDate !== undefined ? startDate : campaign.startDate,
        endDate: endDate !== undefined ? endDate : campaign.endDate,
        isActive: isActive !== undefined ? isActive : campaign.isActive,
      };
      
      if (req.file) {
        updateData.image = getFilePath(req.file);
      }
      
      await campaign.update(updateData);
      
      res.json({
        success: true,
        message: 'Campaign berhasil diupdate',
        data: campaign,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        error: error.message,
      });
    }
  },
  
  // Delete campaign
  deleteCampaign: async (req, res) => {
    try {
      const campaign = await DonationCampaign.findByPk(req.params.id);
      
      if (!campaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign tidak ditemukan',
        });
      }
      
      await campaign.destroy();
      
      res.json({
        success: true,
        message: 'Campaign berhasil dihapus',
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

module.exports = donationController;
