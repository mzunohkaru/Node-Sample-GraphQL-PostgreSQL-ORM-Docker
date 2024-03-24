const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('dev', 'user', 'password', {
  host: 'postgres',
  dialect: 'postgres',
  logging: false,
});

module.exports = { sequelize };