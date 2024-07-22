//checking if is user
//checking if is admin
const UserController = require("../controllers/userController");
const UserModel = require("../models/user");
require('dotenv').config();
const jwt = require('jsonwebtoken');

const userTokenValidationMiddleware =async (req, res, next) => {
        try {
            let token;
                    token = req.headers['x-access-token'];
                    if (!token ) {
                        return res.status(400).json({ message: "Token is required in the headers!" });
                    }

            jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
                if (err) return res.status(403).json({ message: "Token verification failed!" });

            const user = await UserModel.user.findOne({
            where: {
                id: payload.userId,
                token:token
            }
            });

            if (!user || user.tokenExpiration < new Date()) {
                return res.status(403).json({ message: "Token is invalid or expired!" });
            }
            req.id=payload.userId;
            next();
        });
        } catch (error) {
            res.status(500).json({ message: "Internal server error!" });
        }
};

const adminTokenValidationMiddleware =async (req, res, next) => {
        try {
            let token;
                    token = req.headers['x-access-token'];
                    if (!token ) {
                        return res.status(400).json({ message: "Token is required in the headers!" });
                    }

            jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
                if (err) return res.status(403).json({ message: "Token verification failed!" });

            const user = await UserModel.user.findOne({
            where: {
                id: payload.userId,
                token:token,
                isAdmin: 1
            }});
            if (!user || user.tokenExpiration < new Date()) {
                return res.status(403).json({ message: "Token is invalid or expired!" });
            }
            req.id=payload.userId;
            next();
        });
        } catch (error) {
            res.status(500).json({ message: "Internal server error!" });
        }
};


module.exports = {userTokenValidationMiddleware,adminTokenValidationMiddleware}