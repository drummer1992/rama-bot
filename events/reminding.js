'use strict'

module.exports = async (interval, chatId, message) => {
  clearInterval(interval)

  await Bot.sendMessage(chatId, message)
}