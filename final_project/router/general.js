const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  if (username && password) {
    if(isValid(username)) {
      res.status(400).json({message: `Username ${username} already registered`});
    } else {
      users.push({username, password});
      res.status(200).json({message: `Username ${username} successfully registered`});
    }
  } else {
    res.status(404).json({message: "Must provide username and password"})
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  const resposne = new Promise((resolve, reject) => {
    resolve(books)
  });

  resposne.then((result) => {
    res.send(JSON.stringify(result, null, 4));
  });

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  const response = new Promise((resolve, reject) => {
    resolve(book);
  })

  response.then((result) => {
    return res.send(result);
  })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const bookDetails = [];
  const response = new Promise((resolve, reject) => {
    resolve(books);
  })

  response.then((result) =>{
    Object.keys(result).forEach(key => {
      if (result[key].author === author) {
        bookDetails.push(result[key]);
      }
    })
    return res.json(bookDetails);
  })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const response = new Promise((resolve, reject) => {
    resolve(books);
  })
  response.then((result) => {
    const book = Object.values(result).filter((book) => book.title === title);
    return res.json(book);
  })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const reviews = books[isbn].reviews;
  return res.json(reviews);
});

module.exports.general = public_users;
