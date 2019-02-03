const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect("mongodb://localhost:27017/schedule", { useNewUrlParser: true });

app.use(bodyParser.json());

const port = process.env.PORT || 3001;

const createRule = require('./routes/createRule');
const getAll = require('./routes/getAll');
const getInterval = require('./routes/getInterval');
const removeRule = require('./routes/removeRule');

app.use(createRule);
app.use(getAll);
app.use(getInterval);
app.use(removeRule);

app.listen(port, () => console.log('The server is up.'));
