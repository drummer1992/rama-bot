'use strict'

const assert = require('assert')
const { getDate } = require("../utils/date")
const { PLUS } = require('../constatnts/emoji')

module.exports = async msg => {
  const user = await User.findOne({ id: msg.from.id })

  const training = await Training.findOne({
    date : { $gt: getDate() },
  }).sort({ date: -1 })

  assert(training, `Покищо не створено жодного тренування`)

  user.group = training.group
  user.plus = false

  await user.save()

  return require('./on-plus')(msg, [PLUS])
}