const express = require('express');
let books = require("./booksdb.js");
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
          users.push({"username":username,"password":password});
          return res.status(201).json({message:"User Created successfully"})
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
  new Promise((resolve, reject) => {
    resolve(books)
  })
  .then((Books) => {
      return res.status(200).json({ Books })
    })
  .catch((error) => {
      return res.status(400).json({ message: error })
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function(req, res) {
  //Write your code here
  const ISBN = req.params.isbn;
  console.log(ISBN);
  const bookSearchByIsbn = (isbn) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const book = books[ISBN];
        if (book) {
          resolve(book);
        } else {
          reject(new Error("No book found with the ISBN : " + isbn));
        }
      }, 1000);
    });
  };

  bookSearchByIsbn(ISBN)
    .then((book) => {
      res.json(book);
    })
    .catch((err) => {
      return res.status(400).json({ error: "No book found with the isbn : " + isbn});
    });

  // return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    new Promise((resolve, reject) => {
      const author = req.params.author
      const booksByAuthor = Object.values(books).filter(
        (bk) => bk.author === author
      )
      if (booksByAuthor.length === 0) {
        reject('No books found for this author')
      } else {
        resolve(booksByAuthor)
      }
    })
      .then((data) => {
        res.status(200).json(data)
      })
      .catch((error) => {
        res.status(404).json({ message: error })
      })
  })
  

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    new Promise((resolve, reject) => {
      const title = req.params.title
      const booksByTitle = Object.values(books).filter((bk) =>
        bk.title.includes(title)
      )
      if (booksByTitle.length === 0) {
        reject('No books found with this title')
      } else {
        resolve(booksByTitle)
      }
    })
      .then((data) => {
        res.status(200).json(data)
      })
      .catch((error) => {
        res.status(404).json({ message: error })
      })
  })

//  Get book review



public_users.get('/review/:isbn', async(req, res) => {
  
    const isbn = req.params.isbn;
    let filtered_books = Object.values(books)[isbn];
    let reviews = filtered_books.reviews;
    await res.send(JSON.stringify({ reviews }, null, 4));
  });

module.exports.general = public_users;

