'use strict'

const { BotError } = require('../errors')
const { ROBO } = require('../constatnts/emoji')

module.exports = function (fn) {
  return async function (msg, ...rest) {
    let responseMessage

    try {
      responseMessage = await fn(msg, ...rest)
    } catch (e) {
      if (e instanceof BotError) {
        responseMessage = e.message
      } else {
        console.error(e.stack)

        responseMessage = 'Вибачте, мені погано, повідомте будь ласка мого розробника'
      }
    }

    responseMessage && await Bot.sendMessage(
      msg.getChatId(),
      `${msg.getUserName()}, ${responseMessage} ${ROBO}`,
    )
  }
}