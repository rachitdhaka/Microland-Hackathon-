const express = require('express');
const router = express.Router();
const { createUser, getAllUsers, getUserById } = require('../controllers/userController');
const { registerUser, loginUser, getMe, updateMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// All routes here are prefixed with /api/users (set in server.js)

// Auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);

// Standard user routes
router.post('/', createUser);       // POST   /api/users       → Create a user
router.get('/', getAllUsers);        // GET    /api/users       → Get all users
router.get('/:id', getUserById);    // GET    /api/users/:id   → Get user by ID

module.exports = router;
