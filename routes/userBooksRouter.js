const userBooksModel = require("../models/userBooks");
const userBooksController = require("../controllers/userBooksController");
const express = require("express");
const router = express.Router();
const TokenValidationMiddleware = require("../middlewares/middlewares");


router.post("/insertBook",TokenValidationMiddleware.userTokenValidationMiddleware, userBooksController.insertBook);

router.get("/getUserBooks",TokenValidationMiddleware.userTokenValidationMiddleware, userBooksController.getUserBooks);

router.put("/editBook",TokenValidationMiddleware.userTokenValidationMiddleware,userBooksController.editBook);

router.delete("/deleteBook",TokenValidationMiddleware.userTokenValidationMiddleware, userBooksController.deleteBook);

module.exports = router;