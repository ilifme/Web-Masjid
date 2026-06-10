const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PrayerTime = sequelize.define('PrayerTime', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'Jakarta',
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'Indonesia',
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true,
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true,
  },
  method: {
    type: DataTypes.INTEGER,
    defaultValue: 2, // Islamic Society of North America
  },
  timezone: {
    type: DataTypes.STRING(50),
    defaultValue: 'Asia/Jakarta',
  },
}, {
  tableName: 'prayer_times',
  timestamps: true,
  underscored: true,
});

module.exports = PrayerTime;
