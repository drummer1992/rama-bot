'use strict'

const assert = require('assert')
const df = require('dateformat')
const { getDate } = require("../utils/date")
const { CLOCK, HAPPY } = require("../constatnts/emoji")

module.exports = async msg => {
  const training = await Training.findOne({
    date: { $gt: Date.now() },
  }).sort({ date: -1 })
    .populate('group')

  assert(training, `Наступне тренування ще не створено`)

  const users = await User.find({ group: training.group })

  const message = `Найближче тренування в групи ${training.group.name} ${HAPPY}\n\n` +
    `${df(getDate(training.date), 'HH:MM')} ${CLOCK}\n` +
    users.map(user => user.getStat())
      .join('\n')

  await Bot.sendMessage(msg.chat.id, message)
}