'use strict'

const assert = require('assert')

const { HAPPY } = require("../constatnts/emoji")

module.exports = action => async msg => {
  const groups = await Group.find({ chatId: msg.chat.id })

  assert(groups.length, `Поки-що, не створено жодної групи`)

  const buttons = groups.map(group => ([{
    text         : group.name,
    callback_data: JSON.stringify(action({ u: msg.from.id, g: group.name })),
  }]))

  await Bot.sendMessage(
    msg.chat.id,
    `${msg.username}, Оберіть будь ласка групу ${HAPPY}`,
    { reply_markup: { inline_keyboard: buttons } },
  )
}