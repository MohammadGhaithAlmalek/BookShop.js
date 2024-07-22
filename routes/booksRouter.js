const BookModel = require("../models/Books");
const booksController = require("../controllers/booksController");
const express = require("express");
const router = express.Router();
const TokenValidationMiddleware = require("../middlewares/middlewares");
const upload = require('../config/multerConfig');
const multer = require('multer');
const upload1 = multer();
//picture
router.post('/createBook',TokenValidationMiddleware.adminTokenValidationMiddleware,
     
    (req, res, next) => {
        upload(req, res, (err) => {
            if (err) {
                return res.status(400).json({ message: err.message });
            }
            req.fileName = req.file ? req.file.filename : null;
            next();
        });
    },
    booksController.createBook 
);

router.get("/getBook",TokenValidationMiddleware.userTokenValidationMiddleware, booksController.getBook);
router.get("/getAllBooks",TokenValidationMiddleware.userTokenValidationMiddleware, booksController.getAllBooks);


router.put("/editBook",TokenValidationMiddleware.adminTokenValidationMiddleware,    (req, res, next) => {
        upload(req, res, (err) => {
            if (err) {
                return res.status(400).json({ message: err.message });
            }
            req.fileName = req.file ? req.file.filename : null;
            next();
        });
    },booksController.editBook
);


router.delete("/deleteBook",TokenValidationMiddleware.adminTokenValidationMiddleware, booksController.deleteBook);

module.exports = router;