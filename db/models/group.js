'use strict'

const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name        : {
    type    : mongoose.Schema.Types.String,
    required: true,
    unique  : true,
  },
  chatId      : {
    type    : mongoose.Schema.Types.String,
    required: true,
  },
  trainingTime: {
    type   : mongoose.Schema.Types.String,
    default: '19:30',
  },
})

const Group = mongoose.model('Group', schema)

global.Group = Group