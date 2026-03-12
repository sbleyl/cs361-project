// ########## SETUP
const express = require('express');
const fetch = require('node-fetch'); // npm install node-fetch
const app = express();

app.use(express.json());
app.use(express.static('frontend'));

const PORT = 4000;
const LIST_SERVICE = 'http://localhost:3000';
const WEATHER_SERVICE = 'http://localhost:3001';
const UNIT_CONVERTER_SERVICE = 'http://localhost:3002';
const CATEGORIZATION_SERVICE = 'http://localhost:5002';


// ########## ROUTES

// Get lists via microservice
app.get('/lists-data', async (req, res) => {
    const response = await fetch(`${LIST_SERVICE}/api/lists`);
    const data = await response.json();
    res.json(data);
});

// Get current weather via microservice
app.get('/weather-data/:destination', async (req, res) => {
    const response = await fetch(`${WEATHER_SERVICE}/api/weather/${req.params.destination}`);
    const data = await response.json();
    res.json(data);
});

// Get 5 day forecast via microservice
app.get('/weather-data/forecast/:destination', async (req, res) => {
    const response = await fetch(`${WEATHER_SERVICE}/api/forecast/${req.params.destination}`);
    const data = await response.json();
    res.json(data);
});

// Convert units via microservice
app.post('/converter-data/convert', async (req, res) => {
    const response = await fetch(`${UNIT_CONVERTER_SERVICE}/api/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
});

// Get supported unit types via microservice
app.get('/converter-data/units', async (req, res) => {
    const response = await fetch(`${UNIT_CONVERTER_SERVICE}/api/units`);
    const data = await response.json();
    res.json(data);
});

// Categorize item via microservice
app.post('/categorization-data/categorize', async (req, res) => {
    const response = await fetch(`${CATEGORIZATION_SERVICE}/categorize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
});

// Create a new list via microservice
app.post('/lists-data', async (req, res) => {
    const response = await fetch(`${LIST_SERVICE}/api/lists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
});

// Add item to a list via microservice
app.post('/lists-data/:id/items', async (req, res) => {
    const response = await fetch(`${LIST_SERVICE}/api/lists/${req.params.id}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
});

// Toggle item packed status via microservice
app.put('/lists-data/:id/items/:itemId', async (req, res) => {
    const response = await fetch(`${LIST_SERVICE}/api/lists/${req.params.id}/items/${req.params.itemId}`, {
        method: 'PUT'
    });
    const data = await response.json();
    res.json(data);
});

// Delete a list via microservice
app.delete('/lists-data/:id', async (req, res) => {
    const response = await fetch(`${LIST_SERVICE}/api/lists/${req.params.id}`, {
        method: 'DELETE'
    });
    if (response.status === 204) return res.status(204).send();
    const data = await response.json();
    res.json(data);
});

// Delete an item from a list via microservice
app.delete('/lists-data/:id/items/:itemId', async (req, res) => {
    const response = await fetch(`${LIST_SERVICE}/api/lists/${req.params.id}/items/${req.params.itemId}`, {
        method: 'DELETE'
    });
    if (response.status === 204) return res.status(204).send();
    const data = await response.json();
    res.json(data);
});

// ########## START
app.listen(PORT, () => {
    console.log(`Main app running at http://localhost:${PORT}`);
});