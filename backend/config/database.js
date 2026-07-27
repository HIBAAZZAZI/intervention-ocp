const { Sequelize } = require('sequelize');
const path = require('path');

// Base SQLite embarquée : simple à installer pour la démo / le stage.
// Pour la production, remplacer par PostgreSQL ou MySQL en changeant le dialect.
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'database.sqlite'),
  logging: false
});

module.exports = sequelize;
