'use strict'

const { BotError } = require('../errors')
const { ROBO } = require('../constatnts/emoji')

module.exports = function (fn) {
  return async function (...args) {
    let responseMessage

    try {
      responseMessage = await fn(...args)
    } catch (e) {
      if (e instanceof BotError) {
        responseMessage = e.message
      } else {
        console.error(e.stack)

        responseMessage = 'Вибачте, мені погано, повідомте будь ласка мого розробника'
      }
    }

    const [{ from, message, chat }] = args

    const username = from.first_name || from.last_name || from.username
    const chatId = chat && chat.id || message.chat.id

    responseMessage && await Bot.sendMessage(chatId, `${username}, ${responseMessage} ${ROBO}`)
  }
}