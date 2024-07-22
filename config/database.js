const {Sequelize} = require("sequelize");

const sequelize = new Sequelize(
   'bookshop',
   'root',
   'ghaith-CR7', {
          dialect: 'mysql',
          logging: false,
          host: 'localhost'
   }
);

module.exports = {sequelize};