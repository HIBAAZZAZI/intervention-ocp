const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MouvementStock = sequelize.define('MouvementStock', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  type: { type: DataTypes.ENUM('entree', 'sortie'), allowNull: false },
  quantite: { type: DataTypes.INTEGER, allowNull: false },
  motif: { type: DataTypes.STRING }
}, {
  tableName: 'mouvements_stock',
  timestamps: true
});

module.exports = MouvementStock;
