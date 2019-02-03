const express = require('express');

const router = express.Router();

router.delete('/delete', (req, res) => {
  res.send('A regra deletada será retornada aqui.');
});

module.exports = router;
