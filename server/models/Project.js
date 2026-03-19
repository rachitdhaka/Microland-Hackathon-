const mongoose = require('mongoose');

/**
 * Project Schema
 * Represents a hackathon project that needs team members.
 * `requiredRoles` lists the skills/roles needed — this is matched
 * against User `skills` for the AI matching endpoint.
 */
const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
  },
  requiredRoles: [{
    type: String,
    required: [true, 'At least one required role must be specified'],
  }],
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator ID is required'],
  },
  teamMembers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  status: {
    type: String,
    enum: ['Open', 'Team Full'],
    default: 'Open',
  },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
