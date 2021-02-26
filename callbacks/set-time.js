'use strict'

const generateUUID = require('../utils/uuid')
const { enrichTaskData } = require("../utils/buttons")

const { CLOCK } = require("../constatnts/emoji")
const { Event: e, Flow: f, ActionTypes: t } = require("../constatnts/action")

const TIMES = [
  '14:30',
  '19:30',
]

module.exports = async (msg, group, action) => {
  const buttonsData = []

  const changeDataToIndex = enrichTaskData(buttonsData)

  const id = generateUUID()

  const buttons = TIMES.map((time, i) => ([{
    text         : time,
    callback_data: JSON.stringify({
      decision: changeDataToIndex({ time, userId: msg.getUserId() }, i),
      id,
    }),
  }]))

  const { flow, flowId } = action.payload

  await Action.create({
    id,
    userId : msg.getUserId(),
    payload: {
      flowId,
      flow,
      step     : f[flow].indexOf(e.CHOOSE_TIME),
      data     : buttonsData,
      processed: false,
      event    : e.CHOOSE_TIME,
    },
    type   : t.BUTTON_SELECTION,
  })

  await Bot.sendMessage(
    msg.getChatId(),
    `${msg.getUserName()}, Оберіть будь ласка час ${CLOCK}`,
    { reply_markup: { inline_keyboard: buttons } },
  )
}