// Import the mongoose library, which is used for working with MongoDB.
const mongoose = require("mongoose");

// Import the dotenv library to load environment variables from a .env file.
require('dotenv').config();

// Define an asynchronous function called connectDB to establish a connection to the MongoDB database.
const connectDB = async () => {
  try {
    // Attempt to connect to the MongoDB database using the URI and DB_NAME from environment variables.
    const conn = await mongoose.connect(`${process.env.URI}/${process.env.DB_NAME}`, {
      useNewUrlParser: true,          // Use the new URL parser.
      useUnifiedTopology: true,     // Use the new server discovery and monitoring engine.
    });

    // If the connection is successful, log a success message.
    console.log(`Connected to MongoDB successfully`);
  } catch (error) {
    // If an error occurs during the connection attempt, log an error message and exit the process.
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit the Node.js process with an error code.
  }
};

// Export the connectDB function so it can be used in other parts of the application.
module.exports = connectDB;
