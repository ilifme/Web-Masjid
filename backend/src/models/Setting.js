const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Setting = sequelize.define('Setting', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  key: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM('text', 'textarea', 'image', 'json'),
    defaultValue: 'text',
  },
  group: {
    type: DataTypes.STRING(50),
    defaultValue: 'general',
  },
  label: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
}, {
  tableName: 'settings',
  timestamps: true,
  underscored: true,
});

module.exports = Setting;
