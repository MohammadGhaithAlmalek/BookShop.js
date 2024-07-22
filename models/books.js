const  {sequelize}  = require('../config/database'); 
const { DataTypes } = require('sequelize');

const Book = sequelize.define(
  'Book',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    authorName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    picture_distention: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    indexes: [{ unique: true, fields: ['id'] }],
  }
);

module.exports = {
  Book,
  sequelize
};