'use strict'

const mongoose = require('mongoose')
const { PLUS, MINUS } = require("../../constatnts/emoji")

const schema = new mongoose.Schema({
  firstName   : mongoose.Schema.Types.String,
  lastName    : mongoose.Schema.Types.String,
  username    : mongoose.Schema.Types.String,
  visitCounter: {
    type   : mongoose.Schema.Types.Number,
    default: 0,
  },
  isTrainer   : {
    type   : mongoose.Schema.Types.Boolean,
    default: false,
  },
  isAdmin     : {
    type   : mongoose.Schema.Types.Boolean,
    default: false,
  },
  group       : {
    type: mongoose.Schema.Types.ObjectId,
    ref : 'Group',
  },
  plus        : {
    type   : mongoose.Schema.Types.Boolean,
    default: false,
  },
  id          : {
    type    : mongoose.Schema.Types.Number,
    required: true,
    index   : true,
    unique  : true,
  },
})

schema.methods.getName = function () {
  return this.firstName || this.lastName || this.username
}

schema.methods.getStat = function () {
  return `${this.getName()} ${this.plus ? PLUS : MINUS}`
}

const User = mongoose.model('User', schema)

global.User = User