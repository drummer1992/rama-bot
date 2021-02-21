'use strict'

const assert = require('assert')

const { HAPPY } = require('../constatnts/emoji')
const { Codes: { ALREADY_EXISTS } } = require('../constatnts/error')
const { CREATE_GROUP } = require('../constatnts/app')

module.exports = async (msg, match) => {
  const name = match[2]

  assert(name, `Ви не корректно ввели команду, ось приклад: ${CREATE_GROUP} в-2`)

  const user = await User.findOne({ id: msg.from.id })

  assert(user.isTrainer, `Нажаль тільки тренери можуть створювати групи`)

  try {
    await Group.create({
      name,
      chatId : msg.chat.id,
    })
  } catch (e) {
    if (e.code === ALREADY_EXISTS) {
      e.message = `Оберіть будь ласка інше ім'я для групи, ${name} вже зайняте`
    }

    throw e
  }

  await Bot.sendMessage(msg.chat.id, `Група ${name} успішно створена, тепер бажаючі можуть вступити до неї ${HAPPY}`)
}