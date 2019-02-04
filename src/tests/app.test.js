const expect = require('expect');
const request = require('supertest');
const moment = require('moment');

const app = require('../app');

const Interval = require('../models/interval');

beforeEach((done) => {
  Interval.deleteMany({})
    .then(() => {
      const intervals = [{
        day: "2018-05-05",
        start: "17:00",
        end: "17:30",
      },
      {
        day: "2018-06-06",
        start: "14:00",
        end: "14:30",
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
    const day = "2017-01-01";
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
    const currentDate = new Date().getDate();
    const entries = numberOfDaysInMonth - (currentDate - 1);

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
