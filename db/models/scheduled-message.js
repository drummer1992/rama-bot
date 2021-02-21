'use strict'

const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  text  : {
    type    : mongoose.Schema.Types.String,
    required: true,
  },
  chatId: {
    type    : mongoose.Schema.Types.String,
    required: true,
  },
  date  : {
    type    : mongoose.Schema.Types.Date,
    required: true,
  },
})

const ScheduledMessage = mongoose.model('ScheduledMessage', schema)

global.ScheduledMessage = ScheduledMessage