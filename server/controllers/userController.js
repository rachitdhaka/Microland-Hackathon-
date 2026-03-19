const User = require('../models/User');

// ─────────────────────────────────────────────
//  @desc    Create a new user profile
//  @route   POST /api/users
// ─────────────────────────────────────────────
const createUser = async (req, res) => {
  try {
    const { name, bio, skills, availability, pushToken } = req.body;

    // Quick sanity check — Mongoose validation will catch the rest,
    // but we want to send a friendly message for obvious omissions.
    if (!name || !skills || skills.length === 0 || !availability) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, at least one skill, and availability.',
      });
    }

    const newUser = await User.create({
      name,
      bio,
      skills,
      availability,
      pushToken,
    });

    res.status(201).json({
      success: true,
      data: newUser,
    });
  } catch (error) {
    console.error('Error creating user:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while creating user.',
    });
  }
};

// ─────────────────────────────────────────────
//  @desc    Get all user profiles
//  @route   GET /api/users
// ─────────────────────────────────────────────
const getAllUsers = async (_req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users.',
    });
  }
};

// ─────────────────────────────────────────────
//  @desc    Get a single user by their ID
//  @route   GET /api/users/:id
// ─────────────────────────────────────────────
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No user found with ID: ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    // Mongoose throws a CastError if the ID format is invalid (not a valid ObjectId)
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: `Invalid user ID format: ${req.params.id}`,
      });
    }

    console.error('Error fetching user:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user.',
    });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
};
