const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const morgan = require('morgan');

//routes
const roleRoute = require('./routes/backoffice/roles.route')
const categorieRoute = require('./routes/backoffice/categorie.route');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

mongoose.connect(`${process.env.DB_URL}/${process.env.DB_NAME}`);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));



app.use('/api/role', roleRoute);
app.use('/api/categorie', categorieRoute);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log('Server is running on port ' + PORT);
});