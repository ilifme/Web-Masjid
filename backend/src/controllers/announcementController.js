const { Announcement } = require('../models');
const { Op } = require('sequelize');

const announcementController = {
  // Get all announcements
  getAll: async (req, res) => {
    try {
      const { type, isActive, page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
      
      const where = {};
      
      if (type) where.type = type;
      if (isActive !== undefined) where.isActive = isActive === 'true';
      
      const { count, rows } = await Announcement.findAndCountAll({
        where,
        order: [['priority', 'DESC'], ['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });
      
      res.json({
        success: true,
        data: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
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
  
  // Get active announcements
  getActive: async (req, res) => {
    try {
      const currentDate = new Date();
      
      const announcements = await Announcement.findAll({
        where: {
          isActive: true,
          [Op.or]: [
            { startDate: null, endDate: null },
            { startDate: { [Op.lte]: currentDate }, endDate: { [Op.gte]: currentDate } },
            { startDate: { [Op.lte]: currentDate }, endDate: null },
            { startDate: null, endDate: { [Op.gte]: currentDate } },
          ],
        },
        order: [['priority', 'DESC'], ['createdAt', 'DESC']],
      });
      
      res.json({
        success: true,
        data: announcements,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        error: error.message,
      });
    }
  },
  
  // Get single announcement
  getById: async (req, res) => {
    try {
      const announcement = await Announcement.findByPk(req.params.id);
      
      if (!announcement) {
        return res.status(404).json({
          success: false,
          message: 'Pengumuman tidak ditemukan',
        });
      }
      
      res.json({
        success: true,
        data: announcement,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        error: error.message,
      });
    }
  },
  
  // Create announcement
  create: async (req, res) => {
    try {
      const { title, content, type, priority, isActive, startDate, endDate } = req.body;
      
      const announcement = await Announcement.create({
        title,
        content,
        type: type || 'running_text',
        priority: priority || 0,
        isActive: isActive !== undefined ? isActive : true,
        startDate,
        endDate,
      });
      
      res.status(201).json({
        success: true,
        message: 'Pengumuman berhasil dibuat',
        data: announcement,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        error: error.message,
      });
    }
  },
  
  // Update announcement
  update: async (req, res) => {
    try {
      const announcement = await Announcement.findByPk(req.params.id);
      
      if (!announcement) {
        return res.status(404).json({
          success: false,
          message: 'Pengumuman tidak ditemukan',
        });
      }
      
      const { title, content, type, priority, isActive, startDate, endDate } = req.body;
      
      await announcement.update({
        title: title || announcement.title,
        content: content || announcement.content,
        type: type || announcement.type,
        priority: priority !== undefined ? priority : announcement.priority,
        isActive: isActive !== undefined ? isActive : announcement.isActive,
        startDate: startDate !== undefined ? startDate : announcement.startDate,
        endDate: endDate !== undefined ? endDate : announcement.endDate,
      });
      
      res.json({
        success: true,
        message: 'Pengumuman berhasil diupdate',
        data: announcement,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        error: error.message,
      });
    }
  },
  
  // Delete announcement
  delete: async (req, res) => {
    try {
      const announcement = await Announcement.findByPk(req.params.id);
      
      if (!announcement) {
        return res.status(404).json({
          success: false,
          message: 'Pengumuman tidak ditemukan',
        });
      }
      
      await announcement.destroy();
      
      res.json({
        success: true,
        message: 'Pengumuman berhasil dihapus',
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

module.exports = announcementController;
