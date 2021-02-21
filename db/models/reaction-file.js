'use strict'

const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  type    : mongoose.Schema.Types.String,
  reaction: mongoose.Schema.Types.String,
  id      : {
    type  : mongoose.Schema.Types.String,
    unique: true,
  },
  uniqueId: {
    type  : mongoose.Schema.Types.String,
    unique: true,
  },
})

const ReactionFile = mongoose.model('ReactionFile', schema)

global.ReactionFile = ReactionFile