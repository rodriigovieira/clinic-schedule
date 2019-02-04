const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

const env = process.env.NODE_ENV || 'development';

let connectURL;

if (env === 'test') {
  connectURL = "mongodb://localhost:27017/scheduleTest";
} else if (process.env.MONGODB_URI) {
  connectURL = process.env.MONGODB_URI;
} else {
  connectURL = "mongodb://localhost:27017/schedule";
}

mongoose.connect(connectURL, { useNewUrlParser: true });

const app = express();

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

app.get('/', (req, res) => {
  res.send(`Bem-vindo ao gerenciador de horários. Para começar a utilizar o aplicativo, verifique a documentação no Github: https://github.com/rodriigovieira/schedule-manager.`);
});

app.listen(port, () => console.log('The server is up.'));

module.exports = app;
