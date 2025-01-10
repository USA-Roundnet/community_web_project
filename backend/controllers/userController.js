const express = require('express');
const router = express.Router();


// This contains only the shell of HTTP requests. Once a database is decided then these methods can be fully implemented


// Get all users
router.get('/', (req, res) => {
    res.status(200).json({ message: 'Get all users' });
});

// Get a user by ID
router.get('/:id', (req, res) => {
    res.status(200).json({ message: `Get user with ID: ${req.params.id}` });
});

// Create a user
router.post('/', (req, res) => {
    res.status(200).json({ message: 'Create a new user' });
});

// Update a user
router.put('/:id', (req, res) => {
    res.status(200).json({ message: `Update user with ID: ${req.params.id}` });
});

// Delete a usr
router.delete('/:id', (req, res) => {
    res.status(200).json({ message: `Delete user with ID: ${req.params.id}` });
});

module.exports = router;