'use strict'

const assert = require("assert")
const { ABOUT_MESSAGE } = require("../constatnts/messages")
const { START } = require("../constatnts/routes")
const { ROBO } = require("../constatnts/emoji")
const EVENTS = [
  {
    regExp: /^\/start$/,
    module: require('./on-start'),
  },
  {
    regExp: /^\/about$/,
    module: msg => Bot.sendMessage(msg.chat.id, ABOUT_MESSAGE),
  },
  {
    regExp: /^[+-➕➖]$/i,
    module: require('./on-plus'),
  },
  {
    regExp: /^\/force$/i,
    module: require('./on-force'),
  },
  {
    regExp: /^\/setgroup/,
    module: require('./on-set-group'),
  },
  {
    regExp: /^\/addtraining/,
    module: require('./on-add-training'),
  },
  {
    regExp: /^\/info$/,
    module: require('./on-info'),
  },
  {
    regExp: /\/add(sticker|animation) (\blike|dislike)$/g,
    module: require('./on-add-file'),
  },
]

const onTextHandler = event => async (msg, match) => {
  const start = msg.text === START

  msg.username = msg.from.first_name || msg.from.last_name || msg.from.username

  try {
    if (!start) {
      const eMessage = `Для початку роботи зі мною ${ROBO} Вам потрібно виконати команду ${START}`

      assert(await User.exists({ id: msg.from.id }), eMessage)
    }

    await event.module(msg, match)
  } catch (e) {
    await Bot.sendMessage(msg.chat.id, e.message)
  }
}

for (const event of EVENTS) {
  Bot.onText(event.regExp, onTextHandler(event))
}

Bot.on('message', require('./on-message'))

module.exports = EVENTS