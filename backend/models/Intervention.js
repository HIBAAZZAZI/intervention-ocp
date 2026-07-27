const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Intervention = sequelize.define('Intervention', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  titre: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  adresseIntervention: { type: DataTypes.STRING },
  statut: {
    type: DataTypes.ENUM('nouvelle', 'planifiee', 'en_cours', 'terminee', 'annulee'),
    defaultValue: 'nouvelle'
  },
  priorite: {
    type: DataTypes.ENUM('basse', 'normale', 'haute', 'urgente'),
    defaultValue: 'normale'
  },
  datePlanifiee: { type: DataTypes.DATE, allowNull: true },
  dateDebut: { type: DataTypes.DATE, allowNull: true },
  dateFin: { type: DataTypes.DATE, allowNull: true }
}, {
  tableName: 'interventions',
  timestamps: true
});

module.exports = Intervention;
