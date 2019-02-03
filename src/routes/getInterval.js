const express = require('express');

const router = express.Router();

const Interval = require("../models/interval");

router.get('/list', (req, res) => {
  res.send('A lista de horários disponíveis será mostrada aqui.');
});

module.exports = router;
