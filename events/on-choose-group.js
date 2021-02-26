'use strict'

const generateUUID = require('../utils/uuid')
const { botAssert } = require('../errors')
const { enrichTaskData } = require("../utils/buttons")
const { assertUserHasAccess } = require("../assertions")

const { HAPPY } = require("../constatnts/emoji")
const { Flow: f, Event: e, ActionTypes: t } = require("../constatnts/action")

module.exports = flowName => async msg => {
  assertUserHasAccess(msg.getUser(), flowName)

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
      flowId   : id,
      step     : f[flowName].indexOf(e.CHOOSE_GROUP),
      flow     : flowName,
      data     : buttonsData,
      processed: false,
      event    : e.CHOOSE_GROUP,
    },
    type   : t.BUTTON_SELECTION,
  })

  await Bot.sendMessage(
    msg.getChatId(),
    `${msg.getUserName()}, Оберіть будь ласка групу ${HAPPY}`,
    { reply_markup: { inline_keyboard: buttons } },
  )
}