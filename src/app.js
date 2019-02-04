const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Defining whether should use development db or test db
const env = process.env.NODE_ENV || 'development';

let connectURL;

if (env === 'test') {
  connectURL = "mongodb://localhost:27017/scheduleTest";
} else {
  connectURL = "mongodb://localhost:27017/schedule";
}

mongoose.connect(connectURL, { useNewUrlParser: true });

app.use(bodyParser.json());

const port = process.env.PORT || 3001;

// const Interval = require('./models/interval');

const createRule = require('./routes/createRule');
const getAll = require('./routes/getAll');
const getInterval = require('./routes/getInterval');
const removeRule = require('./routes/removeRule');

app.use(createRule);
app.use(getAll);
app.use(getInterval);
app.use(removeRule);

app.listen(port, () => console.log('The server is up.'));

module.exports = app;
