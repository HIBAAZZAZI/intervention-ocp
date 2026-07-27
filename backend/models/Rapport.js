const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Rapport = sequelize.define('Rapport', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tachesRealisees: { type: DataTypes.TEXT, allowNull: false },
  piecesUtilisees: { type: DataTypes.TEXT, allowNull: true }, // JSON stringifié
  observations: { type: DataTypes.TEXT }
}, {
  tableName: 'rapports',
  timestamps: true
});

module.exports = Rapport;
