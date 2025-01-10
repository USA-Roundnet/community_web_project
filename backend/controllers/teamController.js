const express = require('express');
const router = express.Router();

// This contains only the shell of HTTP requests. Once a database is decided then these methods can be fully implemented

// Get all teams
router.get('/', (req, res) => {
    res.status(200).json({ message: 'Get all teams' });
});

// Get a team by ID
router.get('/:id', (req, res) => {
    res.status(200).json({ message: `Get team with ID: ${req.params.id}` });
});

// Create a team
router.post('/', (req, res) => {
    res.status(200).json({ message: 'Create a new team' });
});

// Update a team
router.put('/:id', (req, res) => {
    res.status(200).json({ message: `Update team with ID: ${req.params.id}` });
});

// Delete a team
router.delete('/:id', (req, res) => {
    res.status(200).json({ message: `Delete team with ID: ${req.params.id}` });
});

module.exports = router;
