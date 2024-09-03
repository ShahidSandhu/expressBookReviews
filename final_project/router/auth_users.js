const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  //write code to check is the username is valid
  let filtered_users = users.filter((user)=> user.username === user);
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
  const user = req.body.user;
  if (!user) {
      return res.status(404).json({ message: "Body Empty" });
  }
  // Generate JWT access token
  let accessToken = jwt.sign({
      data: user
  }, 'access', { expiresIn: 60 * 60 });
  // Store access token in session
  req.session.authorization = {
      accessToken
  }
  return res.status(200).json({ token })
  
});

regd_users.get("/user", (req, res, next) => {
  // Check if user is authenticated
  if (req.session.authorization) {
      let token = req.session.authorization['accessToken']; // Access Token
      
      // Verify JWT token for user authentication
      jwt.verify(token, "access", (err, user) => {
          if (!err) {
              req.user = user; // Set authenticated user data on the request object
              next(); // Proceed to the next middleware
          } else {
              return res.status(403).json({ message: "User not authenticated" }); // Return error if token verification fails
          }
      });
      
      // Return error if no access token is found in the session
  } else {
      return res.status(403).json({ message: "User not logged in" });
  }
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
