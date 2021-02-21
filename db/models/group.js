'use strict'

const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name   : {
    type    : mongoose.Schema.Types.String,
    required: true,
    unique  : true,
  },
  chatId : {
    type    : mongoose.Schema.Types.String,
    required: true,
  },
})

const Group = mongoose.model('Group', schema)

global.Group = Group