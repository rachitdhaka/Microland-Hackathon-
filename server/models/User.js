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
  bio: {
    type: String,
    default: "",
  },
  skills: [{
    type: String,
    required: [true, 'At least one skill is required'],
  }],
  availability: {
    type: String,
    required: [true, 'Availability is required'],
  },
  pushToken: {
    type: String,
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
