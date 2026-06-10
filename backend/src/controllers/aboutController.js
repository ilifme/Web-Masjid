const { About } = require('../models');

const aboutController = {
  // Get about data
  get: async (req, res) => {
    try {
      const about = await About.findOne();
      
      if (!about) {
        return res.status(404).json({
          success: false,
          message: 'Data tentang masjid tidak ditemukan',
        });
      }
      
      res.json({
        success: true,
        data: about,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        error: error.message,
      });
    }
  },
  
  // Update about data
  update: async (req, res) => {
    try {
      const { history, vision, mission } = req.body;
      
      let about = await About.findOne();
      
      const updateData = {};
      
      if (history !== undefined) updateData.history = history;
      if (vision !== undefined) updateData.vision = vision;
      if (mission !== undefined) updateData.mission = mission;
      
      // Handle mosque image upload
      if (req.files && req.files.mosqueImage) {
        updateData.mosqueImage = '/' + req.files.mosqueImage[0].path.replace(/\\/g, '/');
      }
      
      // Handle organization chart upload
      if (req.files && req.files.organizationChart) {
        updateData.organizationChart = '/' + req.files.organizationChart[0].path.replace(/\\/g, '/');
      }
      
      if (!about) {
        about = await About.create(updateData);
      } else {
        await about.update(updateData);
      }
      
      res.json({
        success: true,
        message: 'Data tentang masjid berhasil diupdate',
        data: about,
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

module.exports = aboutController;
