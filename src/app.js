const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

const app = express();

// configure models
// define request type and data
// add the end, it has to be like this: schedule units that will be placed in the database
// three mandatory properties: day, start and end. It all comes down to that
// the create route should be something else. You don't have to create
//  a Rule's Model in the database - it's pointless.
// after all, you don't need an object in the database.

mongoose.connect("mongodb://localhost:27017/schedule", { useNewUrlParser: true });

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
