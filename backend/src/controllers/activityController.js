const { Activity } = require('../models');
const { Op } = require('sequelize');

const activityController = {
  // Get all activities
  getAll: async (req, res) => {
    try {
      const { category, isActive, search, page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
      
      const where = {};
      
      if (category) where.category = category;
      if (isActive !== undefined) where.isActive = isActive === 'true';
      if (search) {
        where[Op.or] = [
          { title: { [Op.like]: %% } },
          { description: { [Op.like]: %% } },
        ];
      }
      
      const { count, rows } = await Activity.findAndCountAll({
        where,
        order: [['createdAt', 'DESC']],
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
  
  // Get active activities (public)
  getActive: async (req, res) => {
    try {
      const { category, page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
      
      const where = { isActive: true };
      
      if (category) where.category = category;
      
      const { count, rows } = await Activity.findAndCountAll({
        where,
        order: [['createdAt', 'DESC']],
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
  
  // Get single activity by slug
  getBySlug: async (req, res) => {
    try {
      const activity = await Activity.findOne({
        where: { slug: req.params.slug },
      });
      
      if (!activity) {
        return res.status(404).json({
          success: false,
          message: 'Kegiatan tidak ditemukan',
        });
      }
      
      res.json({
        success: true,
        data: activity,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        error: error.message,
      });
    }
  },
  
  // Get single activity by ID
  getById: async (req, res) => {
    try {
      const activity = await Activity.findByPk(req.params.id);
      
      if (!activity) {
        return res.status(404).json({
          success: false,
          message: 'Kegiatan tidak ditemukan',
        });
      }
      
      res.json({
        success: true,
        data: activity,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        error: error.message,
      });
    }
  },
  
  // Create activity
  create: async (req, res) => {
    try {
      const { title, description, category, schedule, location, contactPerson, contactNumber, isActive, startDate, endDate } = req.body;
      
      // Generate slug
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      const activity = await Activity.create({
        title,
        slug,
        description,
        category: category || 'lainnya',
        image: req.file ? '/' + req.file.path.replace(/\\/g, '/') : null,
        schedule,
        location,
        contactPerson,
        contactNumber,
        isActive: isActive !== undefined ? isActive : true,
        startDate,
        endDate,
      });
      
      res.status(201).json({
        success: true,
        message: 'Kegiatan berhasil dibuat',
        data: activity,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        error: error.message,
      });
    }
  },
  
  // Update activity
  update: async (req, res) => {
    try {
      const activity = await Activity.findByPk(req.params.id);
      
      if (!activity) {
        return res.status(404).json({
          success: false,
          message: 'Kegiatan tidak ditemukan',
        });
      }
      
      const { title, description, category, schedule, location, contactPerson, contactNumber, isActive, startDate, endDate } = req.body;
      
      const updateData = {
        title: title || activity.title,
        description: description || activity.description,
        category: category || activity.category,
        schedule: schedule !== undefined ? schedule : activity.schedule,
        location: location !== undefined ? location : activity.location,
        contactPerson: contactPerson !== undefined ? contactPerson : activity.contactPerson,
        contactNumber: contactNumber !== undefined ? contactNumber : activity.contactNumber,
        isActive: isActive !== undefined ? isActive : activity.isActive,
        startDate: startDate !== undefined ? startDate : activity.startDate,
        endDate: endDate !== undefined ? endDate : activity.endDate,
      };
      
      // Update slug if title changed
      if (title && title !== activity.title) {
        updateData.slug = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }
      
      // Update image if new file uploaded
      if (req.file) {
        updateData.image = '/' + req.file.path.replace(/\\/g, '/');
      }
      
      await activity.update(updateData);
      
      res.json({
        success: true,
        message: 'Kegiatan berhasil diupdate',
        data: activity,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        error: error.message,
      });
    }
  },
  
  // Delete activity
  delete: async (req, res) => {
    try {
      const activity = await Activity.findByPk(req.params.id);
      
      if (!activity) {
        return res.status(404).json({
          success: false,
          message: 'Kegiatan tidak ditemukan',
        });
      }
      
      await activity.destroy();
      
      res.json({
        success: true,
        message: 'Kegiatan berhasil dihapus',
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

module.exports = activityController;
