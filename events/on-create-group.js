'use strict'

const { botAssert, BotError } = require('../errors')

const { HAPPY } = require('../constatnts/emoji')
const { Codes: { ALREADY_EXISTS } } = require('../constatnts/error')
const { CREATE_GROUP } = require('../constatnts/app')

module.exports = async (msg, match) => {
  const name = match[2]

  botAssert(msg.getUser().isTrainer, `Нажаль тільки тренери можуть створювати групи`)
  botAssert(name, `Ви не корректно ввели команду, ось приклад: ${CREATE_GROUP} в-2`)

  try {
    await Group.create({
      name,
      chatId: msg.getChatId(),
    })
  } catch (e) {
    if (e.code === ALREADY_EXISTS) {
      throw new BotError(`Оберіть будь ласка інше ім'я для групи, ${name} вже зайняте`)
    }

    throw e
  }

  return `Група ${name} успішно створена, тепер бажаючі можуть вступити до неї ${HAPPY}`
}