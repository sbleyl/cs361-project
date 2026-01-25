// ########## SETUP

// Express for API routes and calls
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('frontend')); // serves your frontend folder

const PORT = 3000;

// In-memory storage for lists
let lists = [];
let nextId = 1;

// ########## ROUTES

// Home Page
app.get('/lists', (req, res) => {
    res.sendFile(__dirname + '/frontend/lists.html');
});

// API to get all lists as JSON
app.get('/api/lists', (req, res) => {
    res.json(lists);
});

// Create a new packing list
app.post('/lists', (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });

    const newList = { id: nextId++, name, items: [] };
    lists.push(newList);
    res.json(lists);
});

// ########## LISTENER

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});