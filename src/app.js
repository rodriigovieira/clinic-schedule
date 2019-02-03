const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose')

const app = express();

const Rule = require('./models/Rulec')

app.post('/create', (req, res) => {
  res.send('Regra será criada aqui')
})

app.get('/all', (req, res) => {
  res.send('Todas as regras serão mostradas aqui.')
})

app.delete('/delete', (req, res) => {
  res.send('A regra deletada será retornada aqui.');
})

app.get('/list', (req, res) => {
  res.send('A lista de horários disponíveis será mostrada aqui.');
})

app.listen(3001, () => console.log('The server is up.'));
