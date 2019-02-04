const express = require("express");
const moment = require('moment');

const router = express.Router();

const Interval = require("../models/interval");

router.get("/create", (req, res) => {
  res.send("Nesse endpoint, você deve fazer uma solicitação POST para adicionar horários de atendimento. Consulte a documentação para verifiar como proceder.");
});

router.post("/create/:type?", async (req, res) => {
  const type = req.params.type ? Number(req.params.type) : 1;
  const { start, end, month, weeks, year } = req.body;

  const day = moment(req.body.day, 'DD-MM-YYYY') || moment();
  let { free } = req.body;
  const weekDays = req.body.weekDays ? String(req.body.weekDays) : '1, 2, 3, 4, 5';

  // defining monday as the first day of week
  moment().isoWeekday(1);

  let interval;

  Interval.find({
    $and: [
      { day: day.format('DD-MM-YYYY') },
      { $or: [{ start: req.body.start }, { end: req.body.end }] },
      { free: false },
    ],
  }, (err, entry) => {
    if (entry.length > 0) {
      return res.status(401).send("O horário informado já está ocupado.");
    }

    if (type === 1) {
      interval = new Interval({
        start,
        end,
        day: day.format('DD-MM-YYYY'),
        free: free || false,
        timestamp: moment(day).format('x'),
      });

      interval.save()
        .then(created => res.send(created))
        .catch(error => res.status(401).send(error));
    } else if (type === 2) {
      const currentYear = year || moment().format('YYYY');
      const currentMonth = moment().format('MM');
      const finalMonth = month || currentMonth;

      const dayToStart = (month && month !== currentMonth) ? '01' : (Number(moment().format('DD')) + 1);

      const numberOfDaysInMonth = moment(`${finalMonth}-${currentYear}`, 'MM-YYYY').daysInMonth();

      const dataToCreate = [];

      for (let c = dayToStart; c <= numberOfDaysInMonth; c++) {
        dataToCreate.push({
          start,
          end,
          day: moment(`${c}-${finalMonth}-${currentYear}`, 'DD-MM-YYYY').format('DD-MM-YYYY'),
          free: free || true,
          timestamp: moment(`${c}-${finalMonth}-${currentYear}`, 'DD-MM-YYYY').format('x')
        });
      }

      Interval.insertMany(dataToCreate)
        .then(entries => res.send(entries))
        .catch(() => res.status(401));
    } else if (type === 3) {
      // number of weeks to create in the db. If no user's choice, default is 4
      const numberOfWeeks = weeks || 4;

      const finalDate = moment().add(numberOfWeeks, 'w');
      // const numberOfDays = finalDate.diff(moment(), 'd');

      free = free || false;

      const promisesHolder = [];

      let dayToWorkWith = moment();

      for (let b = 0; b <= numberOfWeeks * 7; b++) {
        dayToWorkWith = dayToWorkWith.add(1, 'day');
        const indexOfWeekDay = dayToWorkWith.day() + 1;

        // if weekday matches with user's selected days, query db
        if (weekDays.indexOf(indexOfWeekDay) >= 0) {
          promisesHolder.push({
            start,
            end,
            day: dayToWorkWith.format('DD-MM-YYYY'),
            free,
            timestamp: dayToWorkWith.format('x'),
          });
        }
      }

      Interval.insertMany(promisesHolder)
        .then(entries => res.send(entries))
        .catch(e => res.send(e));
    }

    if (err) {
      res.status(401).send(err);
    }
  });
});

module.exports = router;
