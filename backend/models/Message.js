const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Message = sequelize.define('Message', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  contenu: { type: DataTypes.TEXT, allowNull: false }
}, {
  tableName: 'messages',
  timestamps: true
});

module.exports = Message;
