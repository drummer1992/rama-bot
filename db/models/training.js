'use strict'

const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  trainer: {
    type    : mongoose.Schema.Types.ObjectId,
    ref     : 'User',
    required: true,
  },
  group  : mongoose.Schema.Types.String,
  date   : {
    type    : mongoose.Schema.Types.Date,
    required: true,
    default : () => {
      const date = new Date()

      date.setHours(19)
      date.setMinutes(30)

      return date
    },
  },
  users  : [{
    type: mongoose.Schema.Types.ObjectId,
    ref : 'User',
  }]
})

const Training = mongoose.model('Training', schema)

global.Training = Training