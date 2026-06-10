const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../config');

const authController = {
  // Register
  register: async (req, res) => {
    try {
      const { username, email, password, fullName, role } = req.body;
      
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
      
      // Create user
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        fullName,
        role: role || 'editor',
      });
      
      res.status(201).json({
        success: true,
        message: 'User berhasil didaftarkan',
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
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
  
  // Login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Find user
      const user = await User.findOne({ where: { email } });
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Email atau password salah',
        });
      }
      
      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Akun Anda tidak aktif',
        });
      }
      
      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Email atau password salah',
        });
      }
      
      // Update last login
      await user.update({ lastLogin: new Date() });
      
      // Generate token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        config.jwt.secret,
        { expiresIn: config.jwt.expire }
      );
      
      res.json({
        success: true,
        message: 'Login berhasil',
        data: {
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
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
  
  // Get current user
  me: async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password'] },
      });
      
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
  
  // Change password
  changePassword: async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
      
      const user = await User.findByPk(req.user.id);
      
      // Check old password
      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      
      if (!isPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Password lama salah',
        });
      }
      
      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      await user.update({ password: hashedPassword });
      
      res.json({
        success: true,
        message: 'Password berhasil diubah',
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

module.exports = authController;
