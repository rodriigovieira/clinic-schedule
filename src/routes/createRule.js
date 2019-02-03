const express = require('express');

const router = express.Router();

router.post('/create', (req, res) => {
  res.send('Regra será criada aqui');
});

module.exports = router;
