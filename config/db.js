const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'postgres', 
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432, 
  username: process.env.DB_USER || 'postgres', 
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'project'
});

module.exports = sequelize;
