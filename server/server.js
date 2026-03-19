const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');

// ─── Initialize Express ──────────────────────────────
const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────
// Parse incoming JSON payloads (needed for POST/PUT requests)
app.use(express.json());

// Enable CORS so our frontend (running on a different port) can talk to us
app.use(cors());

// ─── Routes ──────────────────────────────────────────
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);

// Quick health-check route — useful for deployment monitoring
app.get('/', (_req, res) => {
  res.json({
    message: '🚀 Hackathon Team Builder API is live!',
    endpoints: {
      users: '/api/users',
      projects: '/api/projects',
    },
  });
});

// ─── Global Error Handler ────────────────────────────
// Catches anything that slips through our try/catch blocks
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong on the server.',
  });
});

// ─── Start Server ────────────────────────────────────
// Connect to MongoDB first, then start listening for requests.
// This order matters — we don't want to accept requests before
// the database is ready.
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`\n🟢 Server running on http://localhost:${PORT}`);
    console.log(`📡 API base: http://localhost:${PORT}/api\n`);
  });
};

startServer();
