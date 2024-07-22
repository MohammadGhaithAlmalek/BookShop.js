const UserModel = require("../models/user");
const userController = require("../controllers/userController");
const TokenValidationMiddleware = require("../middlewares/middlewares");
const express = require("express");
const router = express.Router();

router.post("/login", userController.login);
router.post("/createUser", userController.createUser);

router.get("/getUser", TokenValidationMiddleware.adminTokenValidationMiddleware,userController.getUser);
router.get("/getAllUser",TokenValidationMiddleware.adminTokenValidationMiddleware, userController.getAllUser);

router.put("/editUser",TokenValidationMiddleware.adminTokenValidationMiddleware,userController.editUser);
router.delete("/deleteUser",TokenValidationMiddleware.adminTokenValidationMiddleware, userController.deleteUser);

module.exports = router;