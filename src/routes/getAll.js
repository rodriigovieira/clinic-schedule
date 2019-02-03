const express = require('express');

const router = express.Router();

const Interval = require("../models/interval");

router.get('/all', (req, res) => {
  Interval.find({})
    .then(intervals => res.send(intervals))
    .catch(error => res.status(401).send(error));
});

module.exports = router;
