const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Technicien = sequelize.define('Technicien', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  competences: { type: DataTypes.STRING, allowNull: true }, // ex: "électricité,mécanique"
  disponible: { type: DataTypes.BOOLEAN, defaultValue: true },
  zoneAffectation: { type: DataTypes.STRING },
  latitude: { type: DataTypes.FLOAT, allowNull: true },
  longitude: { type: DataTypes.FLOAT, allowNull: true },
  derniereMiseAJourPosition: { type: DataTypes.DATE, allowNull: true }
}, {
  tableName: 'techniciens',
  timestamps: true
});

module.exports = Technicien;
