const { Gallery } = require('../models');
const { Op } = require('sequelize');

const galleryController = {
  // Get all gallery items
  getAll: async (req, res) => {
    try {
      const { type, category, page = 1, limit = 20 } = req.query;
      const offset = (page - 1) * limit;
      
      const where = {};
      
      if (type) where.type = type;
      if (category) where.category = category;
      
      const { count, rows } = await Gallery.findAndCountAll({
        where,
        order: [['order', 'ASC'], ['createdAt', 'DESC']],
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
  
  // Get single gallery item
  getById: async (req, res) => {
    try {
      const gallery = await Gallery.findByPk(req.params.id);
      
      if (!gallery) {
        return res.status(404).json({
          success: false,
          message: 'Galeri tidak ditemukan',
        });
      }
      
      res.json({
        success: true,
        data: gallery,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        error: error.message,
      });
    }
  },
  
  // Create gallery item
  create: async (req, res) => {
    try {
      const { title, description, type, category, order } = req.body;
      
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'File harus diupload',
        });
      }
      
      const gallery = await Gallery.create({
        title,
        description,
        type: type || 'photo',
        url: '/' + req.file.path.replace(/\\/g, '/'),
        category,
        thumbnail: type === 'video' ? null : '/' + req.file.path.replace(/\\/g, '/'),
        order: order || 0,
      });
      
      res.status(201).json({
        success: true,
        message: 'Galeri berhasil dibuat',
        data: gallery,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        error: error.message,
      });
    }
  },
  
  // Update gallery item
  update: async (req, res) => {
    try {
      const gallery = await Gallery.findByPk(req.params.id);
      
      if (!gallery) {
        return res.status(404).json({
          success: false,
          message: 'Galeri tidak ditemukan',
        });
      }
      
      const { title, description, type, category, order } = req.body;
      
      const updateData = {
        title: title || gallery.title,
        description: description !== undefined ? description : gallery.description,
        type: type || gallery.type,
        category: category !== undefined ? category : gallery.category,
        order: order !== undefined ? order : gallery.order,
      };
      
      // Update file if new file uploaded
      if (req.file) {
        updateData.url = '/' + req.file.path.replace(/\\/g, '/');
        if (type !== 'video') {
          updateData.thumbnail = '/' + req.file.path.replace(/\\/g, '/');
        }
      }
      
      await gallery.update(updateData);
      
      res.json({
        success: true,
        message: 'Galeri berhasil diupdate',
        data: gallery,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        error: error.message,
      });
    }
  },
  
  // Delete gallery item
  delete: async (req, res) => {
    try {
      const gallery = await Gallery.findByPk(req.params.id);
      
      if (!gallery) {
        return res.status(404).json({
          success: false,
          message: 'Galeri tidak ditemukan',
        });
      }
      
      await gallery.destroy();
      
      res.json({
        success: true,
        message: 'Galeri berhasil dihapus',
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

module.exports = galleryController;
