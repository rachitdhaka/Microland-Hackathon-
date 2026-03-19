const express = require('express');
const router = express.Router();
const {
  createProject,
  getAllProjects,
  getProjectById,
  addTeamMember,
  getProjectMatches,
} = require('../controllers/projectController');

// All routes here are prefixed with /api/projects (set in server.js)

router.post('/', createProject);              // POST   /api/projects            → Create a project
router.get('/', getAllProjects);               // GET    /api/projects            → Get all projects
router.get('/:id', getProjectById);           // GET    /api/projects/:id        → Get project by ID
router.post('/:id/team', addTeamMember);      // POST   /api/projects/:id/team   → Add member to team
router.get('/:id/matches', getProjectMatches);// GET    /api/projects/:id/matches → Get skill-matched users

module.exports = router;
