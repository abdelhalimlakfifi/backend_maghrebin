
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
const typeRoute = require('./routes/backoffice/type.route');
const userOtpVerification = require('./routes/backoffice/userOtpVerification.route');
const userRoute = require('./routes/backoffice/user.route');
const path = require('path');

const UserOtpVerefication = require('./models/userOtpVerefication.model');
const cron = require('node-cron');


connectDB();
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT 



// Schedule a cron job to run every minute
cron.schedule('*/5 * * * *', async () => {
  const now = new Date();
  const fiveMinutesAgo = new Date(now - 5 * 60 * 1000);

  try {
    // Find and delete documents older than 5 minutes
    await UserOtpVerefication.deleteMany({ isValidate: true, createAt: { $lt: fiveMinutesAgo } });

    console.log('Deleted documents older than 5 minutes.');
  } catch (error) {
    console.error('Error deleting documents:', error);
  }
});
// Connect to MongoDB


app.use("/api/",  authRoutes, adminRoutes);
app.use("/api/users", userRoute);
app.use('/api/role', roleRoute);
app.use('/api/categorie', categorieRoute);
app.use('/api/type', typeRoute);
app.use('/api/subcategorie', subcategorie);
app.use('/api/forgotpassword', userOtpVerification);

app.listen(port, () => {
  console.log(`Server is running`);
});





















