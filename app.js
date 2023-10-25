// app.js
const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const customerRoutes = require("./routes/customerRoutes");
const homeRoutes = require("./routes/homeRoutes");

const app = express();
app.use(helmet());
app.use(cors());

require('dotenv').config();
const port = process.env.PORT 

app.use(bodyParser.json());

// Connect to MongoDB
connectDB();


app.use("/", homeRoutes);
app.use("/",  authRoutes, adminRoutes, customerRoutes);


app.listen(port, () => {
  console.log(`Server is running`);
});
