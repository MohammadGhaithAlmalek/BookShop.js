const userBooksModel = require("../models/userBooks");
const BookModel = require("../models/Books");

const insertBook = async (req, res) => {
    try {
        const { book_id, notes } = req.body;
        const user_id = req.id; 

        if (!book_id || !user_id) {
            return res.status(400).json({
                message: "Book ID is required!",
            });
        }

        const existingNote = await userBooksModel.UserBooks.findOne({
            where: {
                book_id: book_id,
                user_id: user_id,
            },
        });

        if (existingNote) {
            existingNote.notes = notes || null;
            await existingNote.save();

            return res.status(200).json({
                message: "Note updated successfully!",
                book: existingNote,
            });
        } else {

            const newBook = await userBooksModel.UserBooks.create({
                book_id: book_id,
                user_id: user_id,
                notes: notes || null,
            });

            return res.status(201).json({
                message: "Note added successfully!",
                book: newBook,
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Unable to create or update a record!",
            error: error.message,
        });
    }
};


const editBook =async(req,res)=>{
    try{
        const {id,notes}=req.body;
        if(!id){
        return res.status(400).json({
            message: " id is required!",
        });                    
        }
        const [updatedCount] = await userBooksModel.UserBooks.update({notes: notes}
            ,{
            where: { id: id }
        });
        if (updatedCount > 0) {
            return res.status(200).json({ message: "Book updated successfully!" });
        } else {
            return res.status(404).json({ message: "Book not found!" });
        }
    } catch (error) {
        console.error("Error updating book:", error);
        return res.status(500).json({ error: "An error occurred while updating the book." });
    }
}

const deleteBook=async(req,res)=>{
   try{
   const id = req.query.book_id;
   if (!id) {
      return res.status(400).json({
      message: "id required!",
      });
   }
   const bookDeleted = await userBooksModel.UserBooks.destroy({
      where: {
         id: id,
      },
   })
   if (bookDeleted) {
      return res.status(200).json({
         message: "Book deleted successfully!",
         });
      } else {
         return res.status(404).json({
            message: "Book not found!",
         });
      }
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred in deleting book !",
            error: error.message,
        });
    }
}

const getUserBooks = async (req, res) => {
    try {
        const userId = req.id;
        if (!userId) {
            return res.status(400).json({
                message: "User ID is required!",
            });
        }

        const userBooks = await userBooksModel.UserBooks.findAll({
            where: { user_id: userId },
            attributes: ['book_id', 'notes'], 
        });

        if (userBooks.length === 0) {
            return res.status(404).json({
                message: "No books found for this user!",
            });
        }

        const bookIds = userBooks.map(ub => ub.book_id);

        const books = await BookModel.Book.findAll({
            where: {
                id: bookIds,
            },
            attributes: ['id', 'title', 'authorName', 'picture_distention'], // Include required book details
        });

        const booksWithDetails = userBooks.map(userBook => {
            const book = books.find(b => b.id === userBook.book_id);
            return {
                id: book.id,
                title: book.title,
                authorName: book.authorName,
                imageDestination: book.picture_distention ? `${req.protocol}://${req.get('host')}/uploads/${book.picture_distention}` : null,
                notes: userBook.notes,
            };
        });

        return res.status(200).json({
            message: "User books fetched successfully!",
            books: booksWithDetails,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred while fetching user books!",
            error: error.message,
        });
    }
};


module.exports = { insertBook, editBook, deleteBook, getUserBooks};