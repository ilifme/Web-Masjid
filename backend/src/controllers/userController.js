const { User } = require('../models');
const bcrypt = require('bcryptjs');

const userController = {
  // Get all users
  getAll: async (req, res) => {
    try {
      const { role, isActive, page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
      
      const where = {};
      
      if (role) where.role = role;
      if (isActive !== undefined) where.isActive = isActive === 'true';
      
      const { count, rows } = await User.findAndCountAll({
        where,
        attributes: { exclude: ['password'] },
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
  
  // Get single user
  getById: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ['password'] },
      });
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User tidak ditemukan',
        });
      }
      
      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        error: error.message,
      });
    }
  },
  
  // Create user
  create: async (req, res) => {
    try {
      const { username, email, password, fullName, role, isActive } = req.body;
      
      // Check if user exists
      const existingUser = await User.findOne({
        where: { email },
      });
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email sudah terdaftar',
        });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        fullName,
        role: role || 'editor',
        isActive: isActive !== undefined ? isActive : true,
      });
      
      const userData = user.toJSON();
      delete userData.password;
      
      res.status(201).json({
        success: true,
        message: 'User berhasil dibuat',
        data: userData,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        error: error.message,
      });
    }
  },
  
  // Update user
  update: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User tidak ditemukan',
        });
      }
      
      const { username, email, fullName, role, isActive, password } = req.body;
      
      const updateData = {
        username: username || user.username,
        email: email || user.email,
        fullName: fullName || user.fullName,
        role: role || user.role,
        isActive: isActive !== undefined ? isActive : user.isActive,
      };
      
      // Update password if provided
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }
      
      await user.update(updateData);
      
      const userData = user.toJSON();
      delete userData.password;
      
      res.json({
        success: true,
        message: 'User berhasil diupdate',
        data: userData,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        error: error.message,
      });
    }
  },
  
  // Delete user
  delete: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User tidak ditemukan',
        });
      }
      
      // Prevent deleting self
      if (user.id === req.user.id) {
        return res.status(400).json({
          success: false,
          message: 'Tidak dapat menghapus akun sendiri',
        });
      }
      
      await user.destroy();
      
      res.json({
        success: true,
        message: 'User berhasil dihapus',
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

module.exports = userController;
