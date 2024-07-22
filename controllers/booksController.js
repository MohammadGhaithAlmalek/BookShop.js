const BookModel = require("../models/Books");
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

const createBook = async(req, res) => {
   try{
    const title =req.body.title;
    const author=req.body.author;
    const pictureName=req.fileName;
    if (!title || !author ) {
        return res.status(400).json({
            message: "title and author  are required!",
        });
    }
    const existingBook = await BookModel.Book.findOne({ where: { title } });
    if (existingBook) {
        return res.status(400).json({
            message: "book already exists!",
        });
    }
    const newBook = await BookModel.Book.create({
        title:title,
        authorName:author,
        picture_distention:pictureName,
    })
    const response = {
        message: "Book inserted successfully!",
        book: {
            id: newBook.id,
            title: newBook.title,
            authorName: newBook.authorName,
        },
    };

    if (pictureName) {
        response.book.imageDestination = `${req.protocol}://${req.get('host')}/uploads/${pictureName}`;
    }
    return res.status(201).json(response);
    }   catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Unable to create a record!",
            error: error.message,
        });
   }
};

const getAllBooks = async (req, res) => {
    try {
        const allBooks = await BookModel.Book.findAll({
            attributes: ["id", "title", "authorName", "picture_distention"],
        });

        // Add image URL to each book if image exists
        const booksWithImageUrl = allBooks.map(book => {
            const bookData = {
                id: book.id,
                title: book.title,
                authorName: book.authorName,
            };
            if (book.picture_distention) {
                bookData.imageDestination = `${req.protocol}://${req.get('host')}/uploads/${book.picture_distention}`;
            }
            return bookData;
        });

        return res.status(200).json({
            message: "Books fetched successfully!",
            books: booksWithImageUrl,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Unable to fetch all books!",
            error: error.message,
        });
    }
};


const getBook = async (req, res) => {
    try {
        const id = req.query.book_id;
        if (!id) {
            return res.status(400).json({
                message: "id required!",
            });
        }

        const book = await BookModel.Book.findByPk(id, {
            attributes: ['id', 'title', 'authorName', 'picture_distention', 'createdAt', 'updatedAt']
        });

        if (!book) {
            return res.status(400).json({
                message: "Book does not exist!",
            });
        }

        const response = {
            message: "Book fetched successfully!",
            book: {
                id: book.id,
                title: book.title,
                authorName: book.authorName,
                createdAt: book.createdAt,
                updatedAt: book.updatedAt,
            },
        };

        if (book.picture_distention) {
            response.book.imageDestination = `${req.protocol}://${req.get('host')}/uploads/${book.picture_distention}`;
        }

        return res.status(200).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Unable to fetch book!",
            error: error.message,
        });
    }
};


const editBook = async (req, res) => {
    try {
        const bookId = req.body.book_id; 

        if (!bookId) {
            return res.status(400).json({
                message: "Book ID is required!",
            });
        }

        const book = await BookModel.Book.findByPk(bookId);

        if (!book) {
            return res.status(404).json({
                message: "Book not found!",
            });
        }

        const { title, authorName } = req.body;
        let pictureName = req.file ? req.file.filename : null;
        const updateData = {};
        if (title) updateData.title = title;
        if (authorName) updateData.authorName = authorName;
        if (pictureName) updateData.picture_distention = pictureName;

        await book.update(updateData);

        const response = {
            message: "Book updated successfully!",
            book: {
                id: book.id,
                title: book.title,
                authorName: book.authorName,
            },
        };

        if (book.picture_distention) {
            response.book.imageDestination = `${req.protocol}://${req.get('host')}/uploads/${book.picture_distention}`;
        }

        return res.status(200).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Unable to update book!",
            error: error.message,
        });
    }
}

const deleteBook = async (req, res) => {
    try {
        const id = req.query.book_id;
        if (!id) {
            return res.status(400).json({
                message: "ID is required!",
            });
        }
        const book = await BookModel.Book.findByPk(id);
        if (!book) {
            return res.status(404).json({
                message: "Book not found!",
            });
        }

        if (book.picture_distention) {
            const filePath = path.join(__dirname, '../uploads', book.picture_distention);
            try {
                await unlinkAsync(filePath);
            } catch (err) {
                console.error(`Error deleting file ${filePath}:`, err);
            }
        }
        
        await BookModel.Book.destroy({
            where: {
                id: id,
            },
        });

        return res.status(200).json({
            message: "Book deleted successfully!",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred while deleting the book!",
            error: error.message,
        });
    }
};

module.exports = { createBook, getAllBooks, getBook, editBook, deleteBook };