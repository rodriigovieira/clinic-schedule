const express = require('express');

const router = express.Router();

router.get('/list', (req, res) => {
  res.send('A lista de horários disponíveis será mostrada aqui.');
});

module.exports = router;
