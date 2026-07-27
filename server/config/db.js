const mongoose = require('mongoose');

/**
 * Connect to MongoDB using Mongoose
 * Reads MONGO_URI from environment variables
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

module.exports = connectDB;

