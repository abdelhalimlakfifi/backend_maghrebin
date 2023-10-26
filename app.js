
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const morgan = require('morgan');
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const customerRoutes = require("./routes/customerRoutes");
const homeRoutes = require("./routes/homeRoutes");
const roleRoute = require('./routes/backoffice/roles.route')
const categorieRoute = require('./routes/backoffice/categorie.route');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT 


// Connect to MongoDB
connectDB();


app.use("/api/", homeRoutes);
app.use("/api/",  authRoutes, adminRoutes, customerRoutes);
app.use('/api/role', roleRoute);
app.use('/api/categorie', categorieRoute);


app.listen(port, () => {
  console.log(`Server is running`);
});





















