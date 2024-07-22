const express = require("express");
const db = require("./config/database");
const BookModel = require("./models/Books");
const user = require("./models/user");
const userBooks = require("./models/userBooks");
const userBooksRouter = require("./routes/userBooksRouter");
const booksRouter= require("./routes/booksRouter");
const usersRouter= require("./routes/userRouter");
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const dotenv = require('dotenv')

      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
      app.use('/book',booksRouter);
      app.use('/user',usersRouter);
      app.use('/userBooks',userBooksRouter);

const initApp = async () => {
   try {

      dotenv.config();
      const port=process.env.PORT
      BookModel.Book.sync();
      user.user.sync();
      userBooks.UserBooks.sync();

      app.listen(port, async() => {
         console.log(`Server is running at: http://localhost:${port}`);
         await db.authenticate;
         console.log("Connection has been established successfully.");
      });
   } catch (error) {
      console.error("Unable to connect to the database:", error.original);
   }
};


initApp();