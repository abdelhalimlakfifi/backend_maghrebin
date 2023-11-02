
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const morgan = require('morgan');
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/backoffice/authRoutes");
const adminRoutes = require("./routes/backoffice/adminRoutes");
const roleRoute = require('./routes/backoffice/roles.route')
const categorieRoute = require('./routes/backoffice/categorie.route');
const subcategorie = require('./routes/backoffice/subcategorie.route')
const typeRoute = require('./routes/backoffice/type.route')
connectDB();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT 


// Connect to MongoDB


app.use("/api/",  authRoutes, adminRoutes);
app.use('/api/role', roleRoute);
app.use('/api/categorie', categorieRoute);
app.use('/api/type', typeRoute);
app.use('/api/subcategorie', subcategorie);

app.listen(port, () => {
  console.log(`Server is running`);
});





















