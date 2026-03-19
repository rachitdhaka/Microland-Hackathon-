const mongoose = require('mongoose');

/**
 * connectDB
 * Establishes a connection to our MongoDB Atlas cluster.
 * We keep this in its own file so server.js stays clean and focused
 * on wiring up middleware and routes.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    // If the DB won't connect, there's no point running the server
    process.exit(1);
  }
};

module.exports = connectDB;
