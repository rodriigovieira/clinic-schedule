const express = require('express');
const moment = require('moment');

const router = express.Router();

const Interval = require("../models/interval");

router.get('/list', (req, res) => {
  res.send('Nesse endpoint você deve efetuar uma solicitação do tipo POST para verificar os intervalos disponíveis.');
});

router.post('/list', (req, res) => {
  const { startDate, endDate } = req.body;

  const startTimestamp = moment(startDate, 'DD-MM-YYYY').format('x');
  const endTimestamp = moment(endDate, 'DD-MM-YYYY').format('x');

  Interval.find({})
    .then((allEntries) => {
      const dataToSend = allEntries.map((value) => {
        if (value.timestamp >= startTimestamp && value.timestamp <= endTimestamp) {
          return value.day;
        }
      });
      return dataToSend;
    })
    .then((dataToSend) => {
      Interval.find({ day: { $in: [...dataToSend] } })
        .then(found => res.send(found))
        .catch(error => res.send(error));
    })
    .catch(e => res.send(e));
});

module.exports = router;
