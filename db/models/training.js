'use strict'

const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  trainer: {
    type    : mongoose.Schema.Types.ObjectId,
    ref     : 'User',
    required: true,
  },
  group  : {
    type: mongoose.Schema.Types.ObjectId,
    ref : 'Group',
  },
  date   : {
    type    : mongoose.Schema.Types.Date,
    required: true,
  },
})

const Training = mongoose.model('Training', schema)

global.Training = Training