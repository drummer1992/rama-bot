'use strict'

const { botAssert } = require('../errors')
const generateUUID = require('../utils/uuid')
const { enrichTaskData } = require("../utils/buttons")

const { HAPPY } = require("../constatnts/emoji")
const { Flow: f, Event: e, ActionTypes: t } = require("../constatnts/action")

module.exports = event => async msg => {
  const groups = await Group.find({ chatId: msg.chat.id })

  botAssert(groups.length, `Поки-що, не створено жодної групи`)

  const buttonsData = []

  const changeDataToIndex = enrichTaskData(buttonsData)

  const id = generateUUID()

  const buttons = groups.map((group, i) => ([{
    text         : group.name,
    callback_data: JSON.stringify({
      decision: changeDataToIndex(group, i),
      id,
    }),
  }]))

  await Action.create({
    id,
    userId : msg.getUserId(),
    payload: {
      [e.CHOOSE_GROUP]: { buttons: buttonsData },
      flow            : f[event],
      step            : 0,
    },
    type   : t.BUTTON_SELECTION,
  })

  await Bot.sendMessage(
    msg.getChatId(),
    `${msg.getUserName()}, Оберіть будь ласка групу ${HAPPY}`,
    { reply_markup: { inline_keyboard: buttons } },
  )
}