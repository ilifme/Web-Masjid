const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Donation = sequelize.define('Donation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  accountName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'account_name',
  },
  accountNumber: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'account_number',
  },
  bankName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'bank_name',
  },
  qrisImage: {
    type: DataTypes.STRING(255),
    field: 'qris_image',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active',
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'donations',
  timestamps: true,
  underscored: true,
});

module.exports = Donation;
