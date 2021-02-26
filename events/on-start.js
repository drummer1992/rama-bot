'use strict'

const { BotError } = require('../errors')

const { ROBO } = require('../constatnts/emoji')
const { HELP } = require('../constatnts/app')
const { Codes: { ALREADY_EXISTS } } = require('../constatnts/error')

module.exports = async msg => {
  try {
    await User.create({
      id       : msg.from.id,
      firstName: msg.from.first_name,
      lastName : msg.from.last_name,
      username : msg.from.username,
    })

    return `З цього моменту ви можете звернутись до мене за допомогою команд ${ROBO}\n`
      + `Щоб подивитися список доступних команд натисніть ${HELP}`
  } catch (e) {
    if (e.code === ALREADY_EXISTS) {
      throw new BotError(`Я вже й так працюю для Вас`)
    }

    throw e
  }
}