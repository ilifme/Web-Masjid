const { Setting } = require('../models');

const settingController = {
  // Get all settings
  getAll: async (req, res) => {
    try {
      const { group } = req.query;
      const where = {};
      
      if (group) where.group = group;
      
      const settings = await Setting.findAll({
        where,
        order: [['group', 'ASC'], ['key', 'ASC']],
      });
      
      res.json({
        success: true,
        data: settings,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        error: error.message,
      });
    }
  },
  
  // Get setting by key
  getByKey: async (req, res) => {
    try {
      const setting = await Setting.findOne({
        where: { key: req.params.key },
      });
      
      if (!setting) {
        return res.status(404).json({
          success: false,
          message: 'Setting tidak ditemukan',
        });
      }
      
      res.json({
        success: true,
        data: setting,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        error: error.message,
      });
    }
  },
  
  // Get settings as object
  getAsObject: async (req, res) => {
    try {
      const settings = await Setting.findAll();
      
      const settingsObject = {};
      settings.forEach(setting => {
        settingsObject[setting.key] = setting.value;
      });
      
      res.json({
        success: true,
        data: settingsObject,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        error: error.message,
      });
    }
  },
  
  // Update or create setting
  upsert: async (req, res) => {
    try {
      const { key, value, type, group, label } = req.body;
      
      let setting = await Setting.findOne({ where: { key } });
      
      if (setting) {
        await setting.update({
          value: value !== undefined ? value : setting.value,
          type: type || setting.type,
          group: group || setting.group,
          label: label || setting.label,
        });
      } else {
        setting = await Setting.create({
          key,
          value,
          type: type || 'text',
          group: group || 'general',
          label,
        });
      }
      
      res.json({
        success: true,
        message: 'Setting berhasil disimpan',
        data: setting,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        error: error.message,
      });
    }
  },
  
  // Bulk update settings
  bulkUpdate: async (req, res) => {
    try {
      const { settings } = req.body;
      
      if (!Array.isArray(settings)) {
        return res.status(400).json({
          success: false,
          message: 'Settings harus berupa array',
        });
      }
      
      for (const item of settings) {
        const setting = await Setting.findOne({ where: { key: item.key } });
        
        if (setting) {
          await setting.update({ value: item.value });
        } else {
          await Setting.create({
            key: item.key,
            value: item.value,
            type: item.type || 'text',
            group: item.group || 'general',
            label: item.label,
          });
        }
      }
      
      res.json({
        success: true,
        message: 'Settings berhasil diupdate',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        error: error.message,
      });
    }
  },
  
  // Delete setting
  delete: async (req, res) => {
    try {
      const setting = await Setting.findOne({
        where: { key: req.params.key },
      });
      
      if (!setting) {
        return res.status(404).json({
          success: false,
          message: 'Setting tidak ditemukan',
        });
      }
      
      await setting.destroy();
      
      res.json({
        success: true,
        message: 'Setting berhasil dihapus',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        error: error.message,
      });
    }
  },

  // Upload footer logo
  
  uploadFooterLogo: async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ success: false, message: 'File harus diupload' });
      const imagePath = '/' + req.file.path.replace(/\\/g, '/');
      let setting = await Setting.findOne({ where: { key: 'footer_logo' } });
      if (setting) { await setting.update({ value: imagePath, type: 'image' }); }
      else { await Setting.create({ key: 'footer_logo', value: imagePath, type: 'image', group: 'general', label: 'Footer Logo' }); }
      res.json({ success: true, message: 'Logo footer berhasil diupload', data: { url: imagePath } });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Terjadi kesalahan', error: error.message });
    }
  },

};
module.exports = settingController;
