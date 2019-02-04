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
      const datesArray = allEntries.map((value) => {
        if (value.timestamp >= startTimestamp && value.timestamp <= endTimestamp) {
          return value.day;
        }
      });
      const noRepetition = [...new Set(datesArray)];
      noRepetition.pop();

      const final = noRepetition.map((dateValue) => {
        const intervalForDay = allEntries.map((data) => {
          if (data.day === dateValue) {
            return { start: data.start, end: data.end }
          }
        });
        
        const arrayMaster = [...new Set(intervalForDay)];
        const filtered = arrayMaster.filter(value => value != null);

        return { day: dateValue, intervals: filtered };
      });
      res.send(final);
    })
    .catch(e => res.send(e));
});

module.exports = router;
