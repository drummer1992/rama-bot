'use strict'

const assert = require('assert')
const { SORRY, PLUS } = require('../constatnts/emoji')

module.exports = async msg => {
  const user = await User.findOne({ id: msg.from.id })

  const training = await Training.findOne({
    date : { $gt: Date.now() },
  }).sort({ date: -1 })

  assert(training, `Покищо не створено жодного тренування ${SORRY}`)

  user.group = training.group

  await user.save()

  return require('./on-plus')(msg, [PLUS])
}