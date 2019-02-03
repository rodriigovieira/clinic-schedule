const express = require('express');

const router = express.Router();

const Interval = require("../models/interval");

router.get('/delete', (req, res) => {
  res.send('Nesse endpoint, você deve efetuar uma solicitação do tipo DELETE informando o ID do intervalo que gostaria de deletar.');
});

router.delete('/delete/:type', (req, res) => {
  const { type } = req.params;

  if (type === 1) {
    res.send('Tipo 1: deletará um intervalo específico por ID.');
  } else if (type === 2) {
    res.send('Tipo 2: deletará uma regra específica.');
  }

  res.send('A regra deletada será retornada aqui.');
});

module.exports = router;
