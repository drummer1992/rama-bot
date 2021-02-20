'use strict'

const assert = require('assert')

const pickName = user => {
  let name = user.username && `@${user.username}` || user.firstName

  if (name) {
    name += ` ${user.plus ? '➕' : '➖'}`
  }

  return name
}

module.exports = async msg => {
  const training = await Training.findOne({
    date: { $gt: Date.now() },
  }).sort({ date: -1 })
    .populate('users')

  assert(training, 'Наступне тренування ще не створено')

  const message = `Найближче тренування в групи ${training.group}:\n` +
    training.users.map(pickName)
      .filter(Boolean)
      .join('\n')


  await Bot.sendMessage(msg.chat.id, message)
}