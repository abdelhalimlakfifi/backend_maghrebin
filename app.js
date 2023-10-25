const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();


mongoose.connect(`${process.env.DB_URL}/${process.env.DB_NAME}`);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log('Server is running on port ' + PORT);
});