const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const About = sequelize.define('About', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  history: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  vision: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  mission: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  mosqueImage: {
    type: DataTypes.STRING(255),
    field: 'mosque_image',
  },
  organizationChart: {
    type: DataTypes.STRING(255),
    field: 'organization_chart',
  },
}, {
  tableName: 'about',
  timestamps: true,
  underscored: true,
});

module.exports = About;
