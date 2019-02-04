const express = require("express");
const moment = require('moment');
const fs = require('fs');

const router = express.Router();

const Interval = require("../models/interval");

router.get("/create", (req, res) => {
  res.send("Nesse endpoint, você deve fazer uma solicitação POST para adicionar horários de atendimento. Consulte a documentação para verifiar como proceder.");
});

router.post("/create/:type?", async (req, res) => {
  const type = req.params.type ? Number(req.params.type) : 1;
  const { start, end, day, month, weeks, year } = req.body;
  let { free } = req.body;
  const weekDays = req.body.weekDays ? String(req.body.weekDays) : '1, 2, 3, 4, 5';

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
      let jsonData;

      fs.readFile('data.json', 'utf8', (error, data) => {
        jsonData = !data ? [] : JSON.parse(data);

        jsonData.push({ start, end, day, free: free || false });
        fs.writeFile('data.json', JSON.stringify(jsonData), () => undefined);
      });

      interval = new Interval({ start, end, day, free: free || false, timestamp: moment(day).format('x') });

      interval.save()
        .then(created => res.send(created))
        .catch(error => res.status(401).send(error));
    } else if (type === 2) {
      let jsonData;

      // Getting information for date to pass to the loop
      const currentYear = year ? year : new Date().getFullYear();
      const currentMonth = (new Date().getMonth() + 1);
      const finalMonth = month ? month : currentMonth;
      const dayToStart = (month && month !== currentMonth) ? 1 : new Date().getDate() + 1;
      const numberOfDaysInMonth = moment(`${currentYear}-${finalMonth}`, "YYYY-MM").daysInMonth();

      // Storing all promises under one array to execute "then" call only once
      const promisesReturn = [];

      fs.readFile('data.json', 'utf8', (error, data) => {
        jsonData = !data ? [] : JSON.parse(data);

        for (let c = dayToStart; c <= numberOfDaysInMonth; c++) {
          promisesReturn.push({
            start,
            end,
            day: `${currentYear}-${finalMonth}-${c}`,
            free: free || true,
            timestamp: moment(`${currentYear}-${finalMonth}-${c}`).format('x'),
          });

          jsonData.push({
            start,
            end,
            day: `${currentYear}-${finalMonth}-${c}`,
            free: free || true,
            timestamp: moment(`${currentYear}-${finalMonth}-${c}`).format('x'),
          });
        }

        fs.writeFile('data.json', JSON.stringify(jsonData), () => undefined);

        Interval.insertMany(promisesReturn)
          .then(entries => res.send(entries))
          .catch(() => res.status(401));
      });
    } else if (type === 3) {
      // number of weeks to create in the db. If no user's choice, default is 4
      const numberOfWeeks = weeks ? weeks : 4;

      const currentDate = moment();
      const finalDate = moment().add(numberOfWeeks, 'w');
      const numberOfDays = finalDate.diff(currentDate, 'd');

      free = free ? free : false;

      const promisesHolder = [];
      let jsonData;

      fs.readFile('data.json', 'utf8', (error, data) => {
        jsonData = !data ? [] : JSON.parse(data);

        for (let b = 0; b <= numberOfDays; b++) {
          const dayToWorkWith = currentDate.add(1, 'day');
          const indexOfWeekDay = dayToWorkWith.day() + 1;

          // if weekday matches with user's selected days, query db
          if (weekDays.indexOf(indexOfWeekDay) >= 0) {
            jsonData.push({
              start,
              end,
              day: `${dayToWorkWith.format('YYYY')}-${dayToWorkWith.format('M')}-${dayToWorkWith.format('DD')}`,
              free,
              timestamp: moment(`${dayToWorkWith.format('YYYY')}-${dayToWorkWith.format('M')}-${dayToWorkWith.format('DD')}`).format('x'),
            });

            fs.writeFile('data.json', JSON.stringify(jsonData), () => undefined);

            promisesHolder.push({
              start,
              end,
              day: `${dayToWorkWith.format('YYYY')}-${dayToWorkWith.format('M')}-${dayToWorkWith.format('DD')}`,
              free,
              timestamp: moment(`${dayToWorkWith.format('YYYY')}-${dayToWorkWith.format('M')}-${dayToWorkWith.format('DD')}`).format('x'),
            });
          }
        }

        Interval.insertMany(promisesHolder)
          .then(entries => res.send(entries))
          .catch(e => res.send(e));
      });
    }

    if (err) {
      res.status(401).send(err);
    }
  });
});

module.exports = router;
