const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); // Required for Task 11

// Task 7: Register a new user
public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(404).json({message: "Missing username or password"});
  if (users.find((user) => user.username === username)) return res.status(409).json({message: "User already exists"});
  users.push({username, password});
  return res.status(200).json({message: "User successfully registered. Now you can login"});
});

// Task 2: Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 3: Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return books[isbn] ? res.status(200).json(books[isbn]) : res.status(404).json({message: "Book not found"});
});
  
// Task 4: Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const booksByAuthor = Object.values(books).filter(b => b.author === author);
  return booksByAuthor.length > 0 ? res.status(200).json(booksByAuthor) : res.status(404).json({message: "Author not found"});
});

// Task 5: Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const booksByTitle = Object.values(books).filter(b => b.title === title);
  return booksByTitle.length > 0 ? res.status(200).json(booksByTitle) : res.status(404).json({message: "Title not found"});
});

// Task 6: Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return books[isbn] ? res.status(200).json(books[isbn].reviews) : res.status(404).json({message: "Book not found"});
});

/// ==========================================
// TASK 10-13: Async/Await Axios Implementation
// ==========================================

// Task 10: Get all books using async callback
public_users.get('/async-get-books', async function (req, res) {
    try {
        const response = await axios.get('http://localhost:5000/');
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({message: "Error fetching books"});
    }
});

// Task 11: Search by ISBN using async
public_users.get('/async-get-isbn/:isbn', async function (req, res) {
    try {
        const response = await axios.get('http://localhost:5000/isbn/' + req.params.isbn);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({message: "Error fetching book details"});
    }
});

// Task 12: Search by Author using async
public_users.get('/async-get-author/:author', async function (req, res) {
    try {
        const response = await axios.get('http://localhost:5000/author/' + req.params.author);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({message: "Error fetching book details"});
    }
});

// Task 13: Search by Title using async
public_users.get('/async-get-title/:title', async function (req, res) {
    try {
        const response = await axios.get('http://localhost:5000/title/' + req.params.title);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({message: "Error fetching book details"});
    }
});