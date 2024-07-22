const  {sequelize}  = require('../config/database'); 
const { DataTypes } = require('sequelize');

const user =sequelize.define(
    'user',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        username:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        token:{
            type: DataTypes.STRING,
            allowNull: true,
        },
        tokenExpiration:{
            type: DataTypes.DATE ,
            allowNull: true,
        },
        isAdmin:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    }
)


// using Bcrypt
//(authen and autho)
//authen jwt use with id and secret key and just send token
//autho ...
module.exports = {
  user,
  sequelize
};