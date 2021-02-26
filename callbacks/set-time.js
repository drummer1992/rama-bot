'use strict'

const assert = require('assert')

const { enrichTaskData } = require("../utils/buttons")

const { CLOCK } = require("../constatnts/emoji")
const { Event: e } = require("../constatnts/action")

const TIMES = [
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00',
]

module.exports = async (msg, group, action) => {
  assert(msg.from.id === action.userId, 'Ви не маєте прав для встановлення цього часу')

  const chatId = msg.message.chat.id

  const taskData = []

  const changeDataToIndex = enrichTaskData(taskData)

  const buttons = TIMES.map((time, i) => ([{
    text         : time,
    callback_data: JSON.stringify({
      decision: changeDataToIndex({ time, userId: msg.from.id }, i),
      id      : action.id,
    }),
  }]))

  await Bot.sendMessage(
    chatId,
    `${msg.getUser().getName()}, Оберіть будь ласка час ${CLOCK}`,
    { reply_markup: { inline_keyboard: buttons } },
  )

  action.payload[e.CHOOSE_TIME] = { buttons: taskData }
}