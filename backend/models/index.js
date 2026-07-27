const sequelize = require('../config/database');
const User = require('./User');
const Technicien = require('./Technicien');
const Client = require('./Client');
const Intervention = require('./Intervention');
const PieceDetachee = require('./PieceDetachee');
const MouvementStock = require('./MouvementStock');
const Rapport = require('./Rapport');
const Message = require('./Message');

// Un utilisateur "technicien" possède une fiche Technicien (1-1)
User.hasOne(Technicien, { foreignKey: 'userId', onDelete: 'CASCADE' });
Technicien.belongsTo(User, { foreignKey: 'userId' });

// Une intervention appartient à un client, et peut être affectée à un technicien
Client.hasMany(Intervention, { foreignKey: 'clientId' });
Intervention.belongsTo(Client, { foreignKey: 'clientId' });

Technicien.hasMany(Intervention, { foreignKey: 'technicienId' });
Intervention.belongsTo(Technicien, { foreignKey: 'technicienId' });

// Un créateur (planificateur/admin) crée l'intervention
User.hasMany(Intervention, { foreignKey: 'creePar' });
Intervention.belongsTo(User, { foreignKey: 'creePar', as: 'createur' });

// Mouvements de stock : liés à une pièce et éventuellement à une intervention
PieceDetachee.hasMany(MouvementStock, { foreignKey: 'pieceId' });
MouvementStock.belongsTo(PieceDetachee, { foreignKey: 'pieceId' });

Intervention.hasMany(MouvementStock, { foreignKey: 'interventionId' });
MouvementStock.belongsTo(Intervention, { foreignKey: 'interventionId' });

// Rapport : un rapport par intervention, rédigé par un technicien
Intervention.hasOne(Rapport, { foreignKey: 'interventionId', onDelete: 'CASCADE' });
Rapport.belongsTo(Intervention, { foreignKey: 'interventionId' });

Technicien.hasMany(Rapport, { foreignKey: 'technicienId' });
Rapport.belongsTo(Technicien, { foreignKey: 'technicienId' });

// Messages : fil de discussion par intervention
Intervention.hasMany(Message, { foreignKey: 'interventionId', onDelete: 'CASCADE' });
Message.belongsTo(Intervention, { foreignKey: 'interventionId' });

User.hasMany(Message, { foreignKey: 'auteurId' });
Message.belongsTo(User, { foreignKey: 'auteurId', as: 'auteur' });

module.exports = {
  sequelize,
  User,
  Technicien,
  Client,
  Intervention,
  PieceDetachee,
  MouvementStock,
  Rapport,
  Message
};
