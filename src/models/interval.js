const mongoose = require("mongoose");

const intervalSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    minLength: 1,
  },
  start: {
    type: String,
    required: true,
    minLength: 1,
  },
  end: {
    type: String,
    required: true,
    minLength: 1,
  },
  free: Boolean,
});

module.exports = mongoose.model('Interval', intervalSchema);
