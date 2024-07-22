const { DataTypes } = require('sequelize');
const  {sequelize}  = require('../config/database');
const Book = require('./books'); 
const User = require('./user'); 

const UserBooks = sequelize.define(
  'userBooks',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Book.Book,
        key: 'id', 
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User.user,
        key: 'id', 
      },
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'book_id'],
      },
    ],
  }
);

module.exports = {UserBooks,  sequelize};
