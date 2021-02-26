'use strict'

const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  id     : mongoose.Schema.Types.String,
  userId : mongoose.Schema.Types.Number,
  payload: {
    type    : mongoose.Schema.Types.Mixed,
    required: true,
  },
  type   : {
    type    : mongoose.Schema.Types.Mixed,
    required: true,
  },
})

const Action = mongoose.model('Action', schema)

global.Action = Action