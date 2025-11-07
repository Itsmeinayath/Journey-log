const mongoose = require('mongoose');
require('dotenv').config(); // This is the new line that loads the .env file

// This now securely reads the variable from your .env file
const MONGO_URI = process.env.MONGO_URI; 

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected.');
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1); 
  }
};

module.exports = connectDB;