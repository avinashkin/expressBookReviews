const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
  const userFound = users.find(user => user.username === username) ? true : false;
  return userFound;
}

const authenticatedUser = (username,password)=>{
  const userAuthenticated = users.find(user => (user.username === username && user.password === password)) ? true : false;
  return userAuthenticated;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (authenticatedUser(username, password)) {
    let access_token = jwt.sign({
      data: password
    }, 'access', {expiresIn: 60 * 60});

    req.session.authorization = {access_token, username};

    return res.send("User successfully logged in.")
  } else {
    return res.status(404).json({message: "Username or password incorrect."});
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const review = req.query.review;
  const isbn = req.params.isbn;
  const user = req.session.authorization.username;
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({message: `ISBN ${isbn} not found.`});
  }

  if (book["reviews"][user]) {
    book["reviews"][user] = review;
    return res.status(200).json({message: "Review updated successfully."});
  }

  book["reviews"][user] = review;
  return res.status(200).json({message: "Review added successfully."});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const user = req.session.authorization.username;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({message: `ISBN ${isbn} not found.`});
  }

  if (book["reviews"][user]) {
    delete book["reviews"][user];
    return res.json({message: "Review deleted successfully."})
  }

  return res.status(404).json({message: "Review doesn't exist."})
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
