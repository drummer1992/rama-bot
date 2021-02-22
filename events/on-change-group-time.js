'use strict'

const assert = require('assert')
const df = require('dateformat')
const { getDate } = require("../utils/date")

const { HAPPY, CLOCK } = require('../constatnts/emoji')
const { CHANGE_GROUP_TIME } = require('../constatnts/app')

module.exports = async (msg, match) => {
  const name = match[2]
  const time = match[4]

  const wrongTyping = `Ви не корректно ввели команду, ось приклад: ${CHANGE_GROUP_TIME} в-2 19:00`

  assert(name, wrongTyping)
  assert(time, wrongTyping)

  const [hours, minutes] = time.split(':').map(Number)

  const user = await User.findOne({ id: msg.from.id })

  assert(user.isTrainer, `Нажаль тільки тренери можуть змінювати групи`)

  const group = await Group.findOne({ name, chatId: msg.chat.id })

  assert(group, 'Групу не знайдено')

  const newTime = getDate.setTime(hours, minutes)

  group.trainingTime = time

  await group.save()

  await Bot.sendMessage(msg.chat.id,
    `Для групи ${name} встановлено новий час ${CLOCK} тренування ${df(newTime, 'HH:MM')} ${HAPPY}`)
}