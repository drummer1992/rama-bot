'use strict'

const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  firstName: mongoose.Schema.Types.String,
  lastName : mongoose.Schema.Types.String,
  username : mongoose.Schema.Types.String,
  group    : mongoose.Schema.Types.String,
  plus     : {
    type   : mongoose.Schema.Types.Boolean,
    default: true,
  },
  id       : {
    type    : mongoose.Schema.Types.String,
    required: true,
    index   : true,
    unique  : true,
  },
  chatId   : {
    type    : mongoose.Schema.Types.String,
    required: true,
    index   : true,
  },
})

const User = mongoose.model('User', schema)

global.User = User