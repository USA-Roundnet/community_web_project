const express = require('express');
const router = express.Router();

// This contains only the shell of HTTP requests. Once a database is decided then these methods can be fully implemented

// Get all tournaments
router.get('/', (req, res) => {
    res.status(200).json({ message: 'Get all tournaments' });
});

// Get a tournament by ID
router.get('/:id', (req, res) => {
    res.status(200).json({ message: `Get tournament with ID: ${req.params.id}` });
});

// Create a tournament
router.post('/', (req, res) => {
    res.status(200).json({ message: 'Create a new tournament' });
});

// Update a tournament
router.put('/:id', (req, res) => {
    res.status(200).json({ message: `Update tournament with ID: ${req.params.id}` });
});

// Delete a tournament
router.delete('/:id', (req, res) => {
    res.status(200).json({ message: `Delete tournament with ID: ${req.params.id}` });
});

module.exports = router;
