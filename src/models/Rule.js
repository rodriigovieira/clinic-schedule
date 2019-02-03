const mongoose = require('mongoose');

const Rule = new mongoose.Model('Rule', {
  type: {
    type: 'number',
    required: true,
    minLength: 1,
  },
  // interval: {
    // type: 
  // }
})

module.exports = { Rule };
