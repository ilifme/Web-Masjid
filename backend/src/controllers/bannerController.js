const { Banner } = require('../models');
const fs = require('fs');
const path = require('path');

const bannerController = {
  // Get all banners
  getAll: async (req, res) => {
    try {
      const banners = await Banner.findAll({
        order: [['order', 'ASC'], ['createdAt', 'DESC']],
      });
      
      res.json({
        success: true,
        data: banners,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        error: error.message,
      });
    }
  },
  
  // Get active banners
  getActive: async (req, res) => {
    try {
      const banners = await Banner.findAll({
        where: { isActive: true },
        order: [['order', 'ASC']],
      });
      
      res.json({
        success: true,
        data: banners,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        error: error.message,
      });
    }
  },
  
  // Get single banner
  getById: async (req, res) => {
    try {
      const banner = await Banner.findByPk(req.params.id);
      
      if (!banner) {
        return res.status(404).json({
          success: false,
          message: 'Banner tidak ditemukan',
        });
      }
      
      res.json({
        success: true,
        data: banner,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        error: error.message,
      });
    }
  },
  
  // Create banner
  create: async (req, res) => {
    try {
      const { title, description, ctaText, ctaLink, isActive, order } = req.body;
      
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Gambar banner harus diupload',
        });
      }
      
      const banner = await Banner.create({
        title,
        description,
        image: '/' + req.file.path.replace(/\\/g, '/'),
        ctaText,
        ctaLink,
        isActive: isActive !== undefined ? isActive : true,
        order: order || 0,
      });
      
      res.status(201).json({
        success: true,
        message: 'Banner berhasil dibuat',
        data: banner,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        error: error.message,
      });
    }
  },
  
  // Update banner
  update: async (req, res) => {
    try {
      const banner = await Banner.findByPk(req.params.id);
      
      if (!banner) {
        return res.status(404).json({
          success: false,
          message: 'Banner tidak ditemukan',
        });
      }
      
      const { title, description, ctaText, ctaLink, isActive, order } = req.body;
      
      const updateData = {
        title: title || banner.title,
        description: description !== undefined ? description : banner.description,
        ctaText: ctaText !== undefined ? ctaText : banner.ctaText,
        ctaLink: ctaLink !== undefined ? ctaLink : banner.ctaLink,
        isActive: isActive !== undefined ? isActive : banner.isActive,
        order: order !== undefined ? order : banner.order,
      };
      
      // Update image if new file uploaded
      if (req.file) {
        // Delete old image
        if (banner.image && fs.existsSync(banner.image.substring(1))) {
          fs.unlinkSync(banner.image.substring(1));
        }
        updateData.image = '/' + req.file.path.replace(/\\/g, '/');
      }
      
      await banner.update(updateData);
      
      res.json({
        success: true,
        message: 'Banner berhasil diupdate',
        data: banner,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        error: error.message,
      });
    }
  },
  
  // Delete banner
  delete: async (req, res) => {
    try {
      const banner = await Banner.findByPk(req.params.id);
      
      if (!banner) {
        return res.status(404).json({
          success: false,
          message: 'Banner tidak ditemukan',
        });
      }
      
      // Delete image file
      if (banner.image && fs.existsSync(banner.image.substring(1))) {
        fs.unlinkSync(banner.image.substring(1));
      }
      
      await banner.destroy();
      
      res.json({
        success: true,
        message: 'Banner berhasil dihapus',
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

module.exports = bannerController;
