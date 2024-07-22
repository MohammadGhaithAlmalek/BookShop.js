const UserModel = require("../models/user");
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const createUser = async(req, res) => {
    try { 
    const username =req.body.username;
    const password=req.body.password;
    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required!",
        });
    }
    const existingUser = await UserModel.user.findOne({ where: { username } });
    if (existingUser) {
        return res.status(400).json({
            message: "Username already exists!",
        });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.user.create({
        username:username,
        password:hashedPassword,
        isAdmin:0,
    })
        return res.status(201).json({
            message: "Record created successfully!",
            user: newUser,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Unable to create a record!",
            error: error.message,
        });
    }
};

const getAllUser = async (req, res) => {
    try {
        const allUsers = await UserModel.user.findAll({
            attributes: ['id', 'username', 'isAdmin', 'createdAt']
        });
        return res.status(200).json({
            message: "Users fetched successfully!",
            users: allUsers
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Unable to fetch all users!",
            error: error.message,
        });
    }
};

const getUser =async  (req, res) => {
    try{
    const id = req.query.user_id;
    if (!id) {
        return res.status(400).json({
            message: "User id required!",
        });
    }
    const user = await UserModel.user.findByPk(id, {
        attributes: ['id', 'username','isAdmin','createdAt' ]
    });
    if(!user){
        return res.status(400).json({
            message: "User is not exists!",
        });
    }
    return res.status(200).json({
        message: "User fetched successfully!",
        user: user
    });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Unable to fetch user!",
            error: error.message,
        });
    }
};

const editUser = async (req, res) => {
    try {
        const id = req.body.user_id;
        const  isAdmin  = req.body.isAdmin;

        if (!id || isAdmin === undefined) {
            return res.status(400).json({
                message: "id and the role are required!",
            });
        }

        const affectedRows = await UserModel.user.update(
            {
                isAdmin: isAdmin,
            },
            {
                where: {
                    id: id,
                },
            }
        );

        if (affectedRows > 0) {
            return res.status(200).json({
                message: "User role edited successfully!",
            });
        } else {
            return res.status(404).json({
                message: "User not found!",
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred in editing the role of the user!",
            error: error.message,
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const id = req.query.user_id;
        if (!id) {
            return res.status(400).json({
                message: "user id required!",
            });
        }

        const userDeleted = await UserModel.user.destroy({
            where: {
                id: id,
            },
        });

        if (userDeleted) {
            return res.status(200).json({
                message: "User deleted successfully!",
            });
        } else {
            return res.status(404).json({
                message: "User not found!",
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred in deleting user !",
            error: error.message,
        });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required!" });
        }

        const user = await UserModel.user.findOne({ where: { username } });
        
        if (!user) {
            return res.status(400).json({ message: "Username does not exist!" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Password does not match!" });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        user.token = token;
        user.tokenExpiration = new Date(Date.now() + 3600000); // 1 hour from now
        await user.save();

        return res.status(200).json({ 
            id: user.id,
            username: user.username,
            tokenExpiration: user.tokenExpiration,
            token: user.token // Returning the token in the response
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Login failed' });
    }
};


module.exports = {createUser, getUser, getAllUser ,editUser ,deleteUser, login};