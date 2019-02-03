const express = require('express');

const router = express.Router();

router.get('/all', (req, res) => {
  res.send('Todas as regras serão mostradas aqui.');
});

module.exports = router;
