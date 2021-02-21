'use strict'

const { ROBO } = require('../constatnts/emoji')
const { HELP } = require('../constatnts/app')
const { Codes: { ALREADY_EXISTS } } = require('../constatnts/error')

const successMessage = name => `${name}, з цього моменту ви можете звернутись до мене за допомогою команд ${ROBO}\n`
+ `Щоб подивитися список доступних команд натисніть ${HELP}`

module.exports = async msg => {
  try {
    await User.create({
      id       : msg.from.id,
      firstName: msg.from.first_name,
      lastName : msg.from.last_name,
      username : msg.from.username,
    })

    await Bot.sendMessage(msg.chat.id, successMessage(msg.username))
  } catch (e) {
    if (e.code === ALREADY_EXISTS) {
      e.message = `${msg.username} я вже й так працюю для Вас`
    }

    throw e
  }
}