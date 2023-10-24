const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();

mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.get('/', (req, res) => {
	res.json({message: 'hey'})
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log('Server is running on port ' + PORT);
});