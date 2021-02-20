'use strict'

const assert = require('assert')
const { pause } = require("../utils/async")

const plusMessage = name => `${name} сьогодні буде на трєні 💪`
const minusMessage = name => ` ${name} морозиться від трєні 💩`

module.exports = async (msg, match) => {
  const plus =  ['+', '➕'].includes(match[0])

  await pause(1)

  const user = await User.findOne({ id: msg.from.id })

  assert(user.group, `${msg.username}, у тебе не заповнена група 🤷‍♂️`)

  const training = await Training.findOne({
    group: user.group,
    date : { $gt: Date.now() },
  }).sort({ date: -1 })

  assert(training, `${msg.username}, тренування для твоєї групи ще не створено 🤷‍♂️`)

  user.plus = plus

  await user.save()

  return Bot.sendMessage(msg.chat.id, (plus ? plusMessage : minusMessage)(msg.username))
}