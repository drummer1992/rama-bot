'use strict'

const { ROBO } = require('../constatnts/emoji')
const { ABOUT } = require('../constatnts/routes')

const ALREADY_EXISTS = 11000

const successMessage = name => `${name}, з цього моменту ви можете звернутись до мене за допомогою команд ${ROBO}\n`
+ `Щоб подивитися список доступних команд натисніть ${ABOUT}`

module.exports = async msg => {
  try {
    await User.create({
      id       : msg.from.id,
      chatId   : msg.chat.id,
      firstName: msg.from.first_name,
      lastName : msg.from.last_name,
      username : msg.from.username,
    })

    await Bot.sendMessage(msg.chat.id, successMessage(msg.username))
  } catch (e) {
    if (e.code === ALREADY_EXISTS) {
      e.message = `${msg.username} я вже й так працюю для Вас ${ROBO}`
    }

    throw e
  }
}