const Project = require('../models/Project');
const User = require('../models/User');

// ─────────────────────────────────────────────
//  @desc    Create a new project listing
//  @route   POST /api/projects
// ─────────────────────────────────────────────
const createProject = async (req, res) => {
  try {
    const { title, description, requiredRoles, creatorId } = req.body;

    // Validate the basics before hitting the database
    if (!title || !description || !requiredRoles || requiredRoles.length === 0 || !creatorId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, at least one required role, and a creator ID.',
      });
    }

    // Make sure the creator actually exists — we don't want orphan projects
    const creatorExists = await User.findById(creatorId);
    if (!creatorExists) {
      return res.status(404).json({
        success: false,
        message: `No user found with ID: ${creatorId}. Cannot create project without a valid creator.`,
      });
    }

    const newProject = await Project.create({
      title,
      description,
      requiredRoles,
      creatorId,
    });

    res.status(201).json({
      success: true,
      data: newProject,
    });
  } catch (error) {
    console.error('Error creating project:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while creating project.',
    });
  }
};

// ─────────────────────────────────────────────
//  @desc    Get all projects (with populated creator & team)
//  @route   GET /api/projects
// ─────────────────────────────────────────────
const getAllProjects = async (_req, res) => {
  try {
    // Populate the references so the frontend gets real user data
    // instead of just ObjectId strings
    const projects = await Project.find()
      .populate('creatorId', 'name skills')
      .populate('teamMembers', 'name skills')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    console.error('Error fetching projects:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching projects.',
    });
  }
};

// ─────────────────────────────────────────────
//  @desc    Get a single project by ID
//  @route   GET /api/projects/:id
// ─────────────────────────────────────────────
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('creatorId', 'name skills')
      .populate('teamMembers', 'name skills');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: `No project found with ID: ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: `Invalid project ID format: ${req.params.id}`,
      });
    }

    console.error('Error fetching project:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching project.',
    });
  }
};

// ─────────────────────────────────────────────
//  @desc    Add a user to a project's team
//  @route   POST /api/projects/:id/team
// ─────────────────────────────────────────────
const addTeamMember = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a userId to add to the team.',
      });
    }

    // Fetch both the project and the user concurrently — no reason to wait sequentially
    const [project, user] = await Promise.all([
      Project.findById(req.params.id),
      User.findById(userId),
    ]);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: `No project found with ID: ${req.params.id}`,
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No user found with ID: ${userId}`,
      });
    }

    // Prevent adding duplicates — check if the user is already on the team
    const isAlreadyOnTeam = project.teamMembers.some(
      (memberId) => memberId.toString() === userId
    );

    if (isAlreadyOnTeam) {
      return res.status(400).json({
        success: false,
        message: `User ${user.name} is already a member of this project.`,
      });
    }

    project.teamMembers.push(userId);
    await project.save();

    // Re-populate so the response includes full user info
    const updatedProject = await Project.findById(req.params.id)
      .populate('creatorId', 'name skills')
      .populate('teamMembers', 'name skills');

    res.status(200).json({
      success: true,
      message: `${user.name} has been added to the team!`,
      data: updatedProject,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format provided.',
      });
    }

    console.error('Error adding team member:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while adding team member.',
    });
  }
};

// ─────────────────────────────────────────────
//  @desc    Find users whose skills match a project's required roles
//  @route   GET /api/projects/:id/matches
//  @note    This is the core "AI matching" endpoint. Right now it does
//           a simple skill-overlap check. Later, we can plug in a
//           smarter algorithm (cosine similarity, LLM-based, etc.)
// ─────────────────────────────────────────────
const getProjectMatches = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: `No project found with ID: ${req.params.id}`,
      });
    }

    // Build a list of IDs to exclude: creator + existing team members.
    // We don't want to suggest people who are already involved.
    const excludeIds = [
      project.creatorId.toString(),
      ...project.teamMembers.map((id) => id.toString()),
    ];

    // Find users who have at least one skill that overlaps with the
    // project's required roles. The $in operator checks if any element
    // in the user's skills array matches any element in requiredRoles.
    // We also use case-insensitive matching via $regex so "react" matches "React".
    const rolePatterns = project.requiredRoles.map(
      (role) => new RegExp(`^${role}$`, 'i')
    );

    const matchingUsers = await User.find({
      _id: { $nin: excludeIds },
      skills: { $in: rolePatterns },
    });

    // For each matched user, calculate how many skills overlap so the
    // frontend can sort or rank them
    const matchesWithScore = matchingUsers.map((user) => {
      const overlappingSkills = user.skills.filter((skill) =>
        project.requiredRoles.some(
          (role) => role.toLowerCase() === skill.toLowerCase()
        )
      );

      return {
        user,
        matchingSkills: overlappingSkills,
        matchScore: overlappingSkills.length,
      };
    });

    // Sort by match score descending — best matches first
    matchesWithScore.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json({
      success: true,
      project: {
        id: project._id,
        title: project.title,
        requiredRoles: project.requiredRoles,
      },
      matchCount: matchesWithScore.length,
      matches: matchesWithScore,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: `Invalid project ID format: ${req.params.id}`,
      });
    }

    console.error('Error finding matches:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while finding matches.',
    });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  addTeamMember,
  getProjectMatches,
};
