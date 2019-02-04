const expect = require('expect');
const request = require('supertest');
const moment = require('moment');

const app = require('../app');

const Interval = require('../models/interval');

beforeEach((done) => {
  Interval.deleteMany({})
    .then(() => {
      const intervals = [{
        day: moment("05-05-2019", "DD-MM-YYYY").format('DD-MM-YYYY'),
        start: "17:00",
        end: "17:30",
        timestamp: moment('05-05-2019', 'DD-MM-YYYY').format('x'),
      },
      {
        day: "06-06-2019",
        start: "14:00",
        end: "14:30",
        timestamp: moment('06-06-2019', 'DD-MM-YYYY').format('x'),
      }];

      Interval.insertMany(intervals)
        .then(() => done())
        .catch(err => done(err));
    })
    .catch(err => done(err));
});

describe('GET /all', () => {
  it('should return all db entries', (done) => {
    request(app)
      .get('/all')
      .expect(200)
      .expect((res) => {
        expect(res.body.length).toBe(2);
      })
      .end(done);
  });
});

describe('POST /create', () => {
  it('should use type 1 if no type selected and create rule', (done) => {
    const day = "01-01-2017";
    const start = "12:00";
    const end = "12:30";

    request(app)
      .post('/create')
      .send({ day, start, end })
      .expect(200)
      .expect((res) => {
        expect(res.body).toMatchObject({ day, start, end, free: false });
      })
      .end(done);
  });

  it('should create with daily rule of type 2', (done) => {
    const start = "15:30";
    const end = "16:00";

    const numberOfDaysInMonth = moment().daysInMonth();
    const currentDate = moment().format('DD');
    const entries = numberOfDaysInMonth - currentDate;

    request(app)
      .post('/create/2')
      .send({ start, end })
      .expect(200)
      .expect((res) => {
        expect(res.body.length).toBe(entries);
        expect(res.body[0]).toMatchObject({ start, end, free: true });
      })
      .end(done);
  });

  it('should create weekly rule of type 3 with custom free option', (done) => {
    const start = "16:30";
    const end = "17:00";
    const free = true;

    request(app)
      .post('/create/3')
      .send({ start, end, free })
      .expect(200)
      .expect((res) => {
        expect(res.body.length > 0).toBe(true);
      })
      .end(done);
  });
});

describe('POST /list', () => {
  it('should return intervals with search params', (done) => {
    const startDate = "01-05-2019";
    const endDate = "01-06-2019";

    request(app)
      .post('/list')
      .send({ startDate, endDate })
      .expect(200)
      .expect((res) => {
        expect(res.body.length).toBe(1);
        expect(res.body[0]).toMatchObject({
          day: "05-05-2019",
          start: "17:00",
          end: "17:30",
        });
      })
      .end(done);
  });
});

describe('DELETE /delete', () => {
  it('should delete with date, default option', (done) => {
    const day = moment('05-05-2019', 'DD-MM-YYYY').format('DD-MM-YYYY');
    const start = "17:00";

    request(app)
      .delete('/delete')
      .send({ start, day })
      .expect(200)
      .expect((res) => {
        expect(res.body.deletedCount).toBe(1);
      })
      .end(done);
  });

  it('should delete using monthly rule', (done) => {
    const month = 6;
    const start = '14:00';
    const end = "14:30";

    request(app)
      .delete('/delete/2')
      .send({ month, start, end })
      .expect(200)
      .expect((res) => {
        expect(res.body.deletedCount).toBe(1);
      })
      .end(done);
  });

  it('should delete with weekly rule', (done) => {
    const start = "14:00";
    const end = "14:30";
    const day = "06-06-2019";
    const weeks = 20;

    request(app)
      .delete('/delete/3')
      .send({ start, end, weeks, day })
      .expect(200)
      .expect((res) => {
        expect(res.body.deletedCount).toBe(1);
      })
      .end(done);
  });
});
