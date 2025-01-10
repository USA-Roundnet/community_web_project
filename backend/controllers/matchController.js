const express = require('express');
const router = express.Router();

// This contains only the shell of HTTP requests. Once a database is decided then these methods can be fully implemented

// Get all matches
router.get('/', (req, res) => {
    res.status(200).json({ message: 'Get all matches' });
});

// Get a match by ID
router.get('/:id', (req, res) => {
    res.status(200).json({ message: `Get match with ID: ${req.params.id}` });
});

// Create a match
router.post('/', (req, res) => {
    res.status(200).json({ message: 'Create a new match' });
});

// Update a match
router.put('/:id', (req, res) => {
    res.status(200).json({ message: `Update match with ID: ${req.params.id}` });
});

// Delete a match
router.delete('/:id', (req, res) => {
    res.status(200).json({ message: `Delete match with ID: ${req.params.id}` });
});

module.exports = router;
