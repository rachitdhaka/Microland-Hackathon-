const mongoose = require('mongoose');

/**
 * User Schema
 * Represents a hacker/student looking to join hackathon teams.
 * Their `skills` array is the key field used for AI-powered matching
 * against a project's `requiredRoles`.
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false,
  },
  number: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
  },
  skills: [{
    type: String,
  }],
  availability: {
    type: String,
    default: "Not specified",
  },
  pushToken: {
    type: String,
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
