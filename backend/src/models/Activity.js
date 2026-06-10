const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Activity = sequelize.define('Activity', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM('kajian', 'sosial', 'pendidikan', 'ramadhan', 'lainnya'),
    defaultValue: 'lainnya',
  },
  image: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  schedule: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  contactPerson: {
    type: DataTypes.STRING(100),
    field: 'contact_person',
  },
  contactNumber: {
    type: DataTypes.STRING(20),
    field: 'contact_number',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active',
  },
  startDate: {
    type: DataTypes.DATE,
    field: 'start_date',
  },
  endDate: {
    type: DataTypes.DATE,
    field: 'end_date',
  },
}, {
  tableName: 'activities',
  timestamps: true,
  underscored: true,
});

module.exports = Activity;
