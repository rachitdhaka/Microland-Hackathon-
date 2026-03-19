const express = require('express');
const router = express.Router();
const { createUser, getAllUsers, getUserById } = require('../controllers/userController');

// All routes here are prefixed with /api/users (set in server.js)

router.post('/', createUser);       // POST   /api/users       → Create a user
router.get('/', getAllUsers);        // GET    /api/users       → Get all users
router.get('/:id', getUserById);    // GET    /api/users/:id   → Get user by ID

module.exports = router;
