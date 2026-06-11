const { Management } = require('../models');

const managementController = {
  // Get all management
  getAll: async (req, res) => {
    try {
      const management = await Management.findAll({
        order: [['order', 'ASC']],
      });
      
      res.json({
        success: true,
        data: management,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        error: error.message,
      });
    }
  },
  
  // Get single management
  getById: async (req, res) => {
    try {
      const management = await Management.findByPk(req.params.id);
      
      if (!management) {
        return res.status(404).json({
          success: false,
          message: 'Data pengurus tidak ditemukan',
        });
      }
      
      res.json({
        success: true,
        data: management,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        error: error.message,
      });
    }
  },
  
  // Create management
  create: async (req, res) => {
    try {
      const { name, position, description, order } = req.body;
      
      const management = await Management.create({
        name,
        position,
        photo: req.file ? getFilePath(req.file) : null,
        description,
        order: order || 0,
      });
      
      res.status(201).json({
        success: true,
        message: 'Data pengurus berhasil dibuat',
        data: management,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        error: error.message,
      });
    }
  },
  
  // Update management
  update: async (req, res) => {
    try {
      const management = await Management.findByPk(req.params.id);
      
      if (!management) {
        return res.status(404).json({
          success: false,
          message: 'Data pengurus tidak ditemukan',
        });
      }
      
      const { name, position, description, order } = req.body;
      
      const updateData = {
        name: name || management.name,
        position: position || management.position,
        description: description !== undefined ? description : management.description,
        order: order !== undefined ? order : management.order,
      };
      
      if (req.file) {
        updateData.photo = getFilePath(req.file);
      }
      
      await management.update(updateData);
      
      res.json({
        success: true,
        message: 'Data pengurus berhasil diupdate',
        data: management,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        error: error.message,
      });
    }
  },
  
  // Delete management
  delete: async (req, res) => {
    try {
      const management = await Management.findByPk(req.params.id);
      
      if (!management) {
        return res.status(404).json({
          success: false,
          message: 'Data pengurus tidak ditemukan',
        });
      }
      
      await management.destroy();
      
      res.json({
        success: true,
        message: 'Data pengurus berhasil dihapus',
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

module.exports = managementController;
