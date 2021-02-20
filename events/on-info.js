'use strict'

const assert = require('assert')

const pickName = user => {
  let name = user.firstName || user.username || user.lastName

  if (name) {
    name += ` ${user.plus ? '➕' : '➖'}`
  }

  return name
}

module.exports = async msg => {
  const training = await Training.findOne({
    date: { $gt: Date.now() },
  }).sort({ date: -1 })

  assert(training, 'Наступне тренування ще не створено')

  const users = await User.find({ group: training.group })

  const message = `Найближче тренування в групи ${training.group}:\n` +
    users.map(pickName)
      .filter(Boolean)
      .join('\n')


  await Bot.sendMessage(msg.chat.id, message)
}