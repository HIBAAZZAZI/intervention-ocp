const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PieceDetachee = sequelize.define('PieceDetachee', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  reference: { type: DataTypes.STRING, allowNull: false, unique: true },
  designation: { type: DataTypes.STRING, allowNull: false },
  unite: { type: DataTypes.STRING, defaultValue: 'unité' },
  quantiteStock: { type: DataTypes.INTEGER, defaultValue: 0 },
  seuilAlerte: { type: DataTypes.INTEGER, defaultValue: 5 }
}, {
  tableName: 'pieces_detachees',
  timestamps: true
});

module.exports = PieceDetachee;
