const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

// ─────────────────────────────────────────────
//  @desc    Register a new user
//  @route   POST /api/users/register
// ─────────────────────────────────────────────
const registerUser = async (req, res) => {
  try {
    const { name, email, password, number } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.',
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      number,
      // Optional defaults depending on the updated schema
      skills: [],
      availability: 'Not specified',
    });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid user data',
      });
    }
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while registering user.',
    });
  }
};

// ─────────────────────────────────────────────
//  @desc    Authenticate a user
//  @route   POST /api/users/login
// ─────────────────────────────────────────────
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.',
      });
    }

    // Check for user email and explicitly select the password field
    const user = await User.findOne({ email }).select('+password');

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
        },
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }
  } catch (error) {
    console.error('Error logging in user:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while logging in user.',
    });
  }
};

// ─────────────────────────────────────────────
//  @desc    Get logged in user profile
//  @route   GET /api/users/me
// ─────────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    // req.user is set in authMiddleware
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching user profile.',
    });
  }
};

// ─────────────────────────────────────────────
//  @desc    Update user profile (bio, skills, availability)
//  @route   PUT /api/users/me
// ─────────────────────────────────────────────
const updateMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
      user.skills = req.body.skills || user.skills;
      user.availability = req.body.availability || user.availability;
      user.number = req.body.number !== undefined ? req.body.number : user.number;

      const updatedUser = await user.save();

      res.status(200).json({
        success: true,
        data: updatedUser,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
  } catch (error) {
    console.error('Error updating user profile:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error updating user profile.',
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateMe,
};
