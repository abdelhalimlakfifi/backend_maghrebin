const express = require('express');
const mongoose = require('mongoose');

const app = express();

const viewEngine = process.env.VIEW_ENGINE || 'ejs';
if (viewEngine !== 'none') {
  const ejs = require('ejs');
  app.set('view engine', viewEngine);
  app.set('views', __dirname + '/views');
}

mongoose.connect('mongodb://localhost/backend_maghrebin', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const sampleRouter = require('./controllers/sampleController');
app.use('/sample', sampleRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});
