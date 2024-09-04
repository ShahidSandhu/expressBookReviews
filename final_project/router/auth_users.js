const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
const SECRET_KEY = 'fingerprint_customer';

const isValid = (username)=>{ //returns boolean
  //write code to check is the username is valid
  let filtered_users = users.filter((user)=> user.username === username);
  if(filtered_users){
    return true;
  }
  return false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  //write code to check if username and password match the one we have in records.
  if(isValid(username)){
    let filtered_users = users.filter((user)=> (user.username===username)&&(user.password===password));
    if(filtered_users){
        return true;
    }
    return false;
  
  }
  return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!isValid(username) || !authenticatedUser(username, password)) {
    return res.status(401).json({ message: 'Username or Password are invalid' })
  }

  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: 60*60 })
  users.filter((u) => u.username === username).token = token
  res.send("User has logged in Successfully")
  return res.status(200).json({ token })
  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let username = req.session.username;
  let ISBN = req.params.isbn;
  let details = req.query.review;
  let rev = {user:username,review:details}
  books[ISBN].reviews = rev;
  return res.status(201).json({message:"Review has added successfully"})
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
