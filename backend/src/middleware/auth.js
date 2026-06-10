const jwt = require('jsonwebtoken');
const config = require('../config');
const { User } = require('../models');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token tidak ditemukan',
      });
    }
    
    const decoded = jwt.verify(token, config.jwt.secret);
    
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] },
    });
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User tidak valid atau tidak aktif',
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token tidak valid',
    });
  }
};

const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses',
      });
    }
    
    next();
  };
};

module.exports = { authMiddleware, roleMiddleware };
