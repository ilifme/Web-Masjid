const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const DonationCampaign = sequelize.define('DonationCampaign', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  targetAmount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
    field: 'target_amount',
  },
  currentAmount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
    field: 'current_amount',
  },
  image: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  startDate: {
    type: DataTypes.DATE,
    field: 'start_date',
  },
  endDate: {
    type: DataTypes.DATE,
    field: 'end_date',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active',
  },
}, {
  tableName: 'donation_campaigns',
  timestamps: true,
  underscored: true,
});

module.exports = DonationCampaign;
