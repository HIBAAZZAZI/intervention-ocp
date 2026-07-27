const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Client = sequelize.define('Client', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nom: { type: DataTypes.STRING, allowNull: false },
  site: { type: DataTypes.STRING }, // ex: "Site Khouribga - Atelier 3"
  adresse: { type: DataTypes.STRING },
  telephone: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING }
}, {
  tableName: 'clients',
  timestamps: true
});

module.exports = Client;
