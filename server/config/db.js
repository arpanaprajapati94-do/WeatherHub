const mongoose = require('mongoose');

/**
 * Connect to MongoDB using Mongoose
 * Reads MONGO_URI from environment variables
 */
const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error(
        'MONGO_URI is not defined. Please set it in your .env file, e.g. MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/weatherhub'
      );
    }

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Fail fast if the DB is unreachable
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

module.exports = connectDB;

