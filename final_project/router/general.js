const express = require('express');
let books = require("./booksdb.js").books;
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if(username&&password){
      const present = users.filter((user)=> user.username === username)
      if(present.length===0){
          users.push({"username":req.body.username,"password":req.body.password});
          return res.status(201).json({message:"USer Created successfully"})
      }
      else{
        return res.status(400).json({message:"Already exists"})
      }
  }
  else if(!username && !password){
    return res.status(400).json({message:"Bad request"})
  }
  else if(!username || !password){
    return res.status(400).json({message:"Username or password or both are invalid"})
  }  

  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  const availableBooks = books;

  // Check if there are available books
  if (availableBooks.length === 0) {
    return res.status(404).json({ message: "No book is available" });
  }

  // If books are available, send them as a response
  return res.status(200).json(availableBooks);
  // return res.status(300).json({message: "Yet to be implemented- in default route '/'"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function(req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  console.log(isbn);
  const booksBasedOnIsbn = (isbn) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const book = books.filter((bk) => bk.isbn === isbn);
        if (book) {
          resolve(book);
        } else {
          reject(new Error("No book found with the ISBN : " + isbn));
        }
      }, 1000);
    });
  };
  booksBasedOnIsbn(isbn)
    .then((book) => {
      console.log(book);
      res.json(book);
    })
    .catch((err) => {
      return res.status(400).json({ error: "No book found with the isbn : " + isbn});
    });

  // return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  //using promises
  const author = req.params.author;
  const booksSearchByAuthor = (auth) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const filtered_books = books.filter((bk) => bk.author === auth);
        if (filtered_books > 0) {
          resolve(filtered_books);
        } else {
          reject(new Error("No book found with the Author : " + author));
        }
      }, 1000);
    });
  };
  booksSearchByAuthor(author)
    .then((book) => {
      res.json(book);
    })
    .catch((err) => {
      res.status(400).json({ error: "No book found with the Author : " + author });
    });

  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const booksSearchByTitle = (bookTitle) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const filteredBooks = books.filter((bk) => bk.title === bookTitle);
        if (filteredBooks > 0) {
          resolve(filteredBooks);
        } else {
          reject(new Error("No book found with the the title : " + title));
        }
      }, 1000);
    });
  };
  booksSearchByTitle(title)
    .then((new_books) => {
      res.json(new_books);
    })
    .catch((err) => {
      res
        .status(400)
        .json({ error: "No book found with this title : " + title });
    });

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
   
  const booksReviewSearchByISBN = (isbn) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const filteredBook = books.filter((bk) => bk.isbn === isbn);
        if (filteredBook > 0) {
          resolve(filteredBook);
        } else {
          reject(new Error("No book found with the the ISBN : " + isbn));
        }
      }, 1000);
    });
  };

  booksReviewSearchByISBN(isbn)
    .then((selectedBook) => {
      res.json(selectedBook.review);
    })
    .catch((err) => {
      res
        .status(400)
        .json({ error: "No book found with this ISBN : " + isbn });
    });

  // return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
