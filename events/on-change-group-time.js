'use strict'

const { botAssert } = require('../errors')
const df = require('dateformat')
const { getDate } = require("../utils/date")

const { HAPPY, CLOCK } = require('../constatnts/emoji')
const { CHANGE_GROUP_TIME } = require('../constatnts/app')

module.exports = async (msg, match) => {
  const name = match[2]
  const time = match[4]

  const wrongTyping = `Ви не корректно ввели команду, ось приклад: ${CHANGE_GROUP_TIME} в-2 19:00`

  botAssert(name, wrongTyping)
  botAssert(time, wrongTyping)

  const [hours, minutes] = time.split(':').map(Number)

  const user = msg.getUser()

  botAssert(user.isTrainer, `Нажаль тільки тренери можуть змінювати групи`)

  const group = await Group.findOne({ name, chatId: msg.chat.id })

  botAssert(group, 'Групу не знайдено')

  const newTime = getDate.setTime(hours, minutes)

  group.trainingTime = time

  await group.save()

  return `Для групи ${name} встановлено новий час ${CLOCK} тренування ${df(newTime, 'HH:MM')} ${HAPPY}`
}