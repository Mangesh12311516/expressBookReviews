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

// ==========================================
// TASK 10-13: Async/Await Axios Implementation 
// ==========================================

// Task 10: Function to retrieve all books using async/await and Axios
// This route uses axios to fetch the books array from the root endpoint
public_users.get('/async-get-books', async function (req, res) {
    try {
        // Fetching all books from the local server
        const response = await axios.get('http://localhost:5000/');
        // Return the fetched data with a success status code
        return res.status(200).json(response.data);
    } catch (error) {
        // Error handling for failed request
        return res.status(500).json({message: "Error fetching books"});
    }
});

// Task 11: Function to search for a book by its ISBN using promise callbacks
// This route retrieves a specific book's details by making an axios call
public_users.get('/async-get-isbn/:isbn', async function (req, res) {
    try {
        // Fetching book details by ISBN
        const response = await axios.get('http://localhost:5000/isbn/' + req.params.isbn);
        // Returning the retrieved book object
        return res.status(200).json(response.data);
    } catch (error) {
        // Handle case where ISBN is not found
        return res.status(500).json({message: "Error fetching book details"});
    }
});

// Task 12: Function to search for a book by Author using async/await
// This route filters the books database by a specific author name
public_users.get('/async-get-author/:author', async function (req, res) {
    try {
        // Fetching books by author name
        const response = await axios.get('http://localhost:5000/author/' + req.params.author);
        // Returning the matched books
        return res.status(200).json(response.data);
    } catch (error) {
        // Error handling if author is missing
        return res.status(500).json({message: "Error fetching book details"});
    }
});

// Task 13: Function to search for a book by Title using async/await
// This endpoint searches the database for a matching book title
public_users.get('/async-get-title/:title', async function (req, res) {
    try {
        // Fetching books by title
        const response = await axios.get('http://localhost:5000/title/' + req.params.title);
        // Returning the successful match
        return res.status(200).json(response.data);
    } catch (error) {
        // Error handling if title does not exist
        return res.status(500).json({message: "Error fetching book details"});
    }
});
