const express = require("express");
const moment = require('moment');

const router = express.Router();

// create daily - will apply rule to all days of current month
// create monthly - will apply rule to all days of current month
// if want another month, just choose monthNumber option with the value of month

const Interval = require("../models/interval");

router.get("/create", (req, res) => {
  res.send("Nesse endpoint, você deve fazer uma solicitação POST para adicionar horários de atendimento. Consulte a documentação para verifiar como proceder.");
});

router.post("/create/:type?", async (req, res) => {
  const type = req.params.type ? Number(req.params.type) : 1;
  const { start, end, day, month, weeks, year } = req.body;
  let { weekDays, free } = req.body;

  // defining monday as the first day of week
  moment().isoWeekday(1);

  let interval;

  Interval.find({
    $and: [
      { day: req.body.day },
      { $or: [{ start: req.body.start }, { end: req.body.end }] },
      { free: false },
    ],
  }, (err, entry) => {
    if (entry.length > 0) {
      return res.status(401).send("O horário informado já está ocupado.");
    }

    if (type === 1) {
      interval = new Interval({ start, end, day, free: free || false });

      interval.save()
        .then(created => res.send(created))
        .catch(error => res.status(401).send(error));
    } else if (type === 2) {
      // Getting information for date to pass to the loop
      const currentYear = year ? year : new Date().getFullYear();
      const currentMonth = month ? month : (new Date().getMonth() + 1);
      const currentDay = new Date().getDate();
      const numberOfDaysInMonth = moment(`${currentYear}-${currentMonth}`, "YYYY-MM").daysInMonth();

      // Storing all promises under one array to execute "then" call only once
      const promisesReturn = [];

      for (let c = currentDay; c <= numberOfDaysInMonth; c++) {
        promisesReturn.push(
          new Interval({
            start,
            end,
            day: `${currentYear}-${currentMonth}-${c}`,
            free: free || true,
          }).save()
        );
      }

      Promise.all(promisesReturn)
        .then(entries => res.send(entries))
        .catch(error => res.status(401).send(error));
    } else if (type === 3) {
      // number of weeks to create in the db. If no user's choice, default is 4
      const numberOfWeeks = weeks ? weeks : 4;

      const currentDate = moment();
      const finalDate = moment().add(numberOfWeeks, 'w');
      const numberOfDays = finalDate.diff(currentDate, 'd');

      free = free ? free : false;

      const promisesHolder = [];

      for (let b = 0; b <= numberOfDays; b++) {
        const dayToWorkWith = currentDate.add(1, 'day');
        const indexOfWeekDay = dayToWorkWith.day() + 1;

        weekDays = weekDays ? String(weekDays) : '1, 2, 3, 4, 5';

        // if weekday matches with user's selected days, query db
        if (weekDays.indexOf(indexOfWeekDay) >= 0) {
          promisesHolder.push(
            new Interval({
              start,
              end,
              day: `${dayToWorkWith.format('YYYY')}-${dayToWorkWith.format('M')}-${dayToWorkWith.format('DD')}`,
              free,
            }).save()
          );
        }
      }

      Promise.all(promisesHolder)
        .then(entries => res.send(entries))
        .catch(error => res.status(401).send(error));
    }

    if (err) {
      res.status(401).send(err);
    }
  });
});

module.exports = router;
