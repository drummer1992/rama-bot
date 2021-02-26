'use strict'

const { botAssert } = require('../errors')
const df = require('dateformat')
const { getDate, trimTime } = require("../utils/date")
const { CLOCK, HAPPY } = require("../constatnts/emoji")

module.exports = async () => {
  const training = await Training.findOne({
    date: { $gt: trimTime(getDate()) },
  }).sort({ date: 1 })
    .populate('group')

  botAssert(training, `Наступне тренування ще не створено`)

  const users = await User.find({ group: training.group })

  return `Найближче тренування в групи ${training.group.name} ${HAPPY}\n\n` +
    `${df(training.date, 'HH:MM')} ${CLOCK}\n` +
    users.map(user => user.getPlusStatus())
      .join('\n')
}