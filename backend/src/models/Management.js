const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Management = sequelize.define('Management', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  position: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  photo: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'management',
  timestamps: true,
  underscored: true,
});

module.exports = Management;
