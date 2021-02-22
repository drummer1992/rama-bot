'use strict'

const assert = require("assert")
const { setGroup, createTraining } = require("../callbacks/actions")
const { HELP_MESSAGE } = require("../constatnts/messages")
const { START } = require("../constatnts/app")
const { ROBO } = require("../constatnts/emoji")

const onHelp = msg => Bot.sendMessage(msg.chat.id, HELP_MESSAGE)

const EVENTS = [
  {
    regExp: /^\/start/,
    module: require('./on-start'),
  },
  {
    regExp: /^\/help/,
    module: onHelp,
  },
  {
    regExp: /^[+-➕➖]$/i,
    module: require('./on-plus'),
  },
  {
    regExp: /^\/force/i,
    module: require('./on-force'),
  },
  {
    regExp: /^\/setgroup/,
    module: require('./on-choose-group')(setGroup),
  },
  {
    regExp: /^\/createtraining/,
    module: require('./on-choose-group')(createTraining),
  },
  {
    regExp: /^\/info/,
    module: require('./on-info'),
  },
  {
    regExp: /\/add(sticker|animation) (\blike|dislike)/g,
    module: require('./on-add-file'),
  },
  {
    regExp: /^\/creategroup(\s)?([a-я]-\d)?/g,
    module: require('./on-create-group'),
  },
  {
    regExp: /^\/changegrooptime(\s)?([a-я]-\d)?(\s)?(\d\d:\d\d)?/g,
    module: require('./on-change-group-time'),
  }
]

const onTextHandler = event => async (msg, match) => {
  const start = msg.text === START

  msg.username = msg.from.first_name || msg.from.last_name || msg.from.username

  try {
    if (!start) {
      const eMessage = `Для початку роботи зі мною, Вам необхідно натиснути ${START}`

      assert(await User.exists({ id: msg.from.id }), eMessage)
    }

    await event.module(msg, match)
  } catch (e) {
    const user = await User.findOne({ id: msg.from.id }, {
      username : 1,
      firstName: 1,
      lastName : 1,
    })

    const username = user ? user.getName() : msg.username

    await Bot.sendMessage(msg.chat.id, `${username}, ${e.message} ${ROBO}`)
  }
}

for (const event of EVENTS) {
  Bot.onText(event.regExp, onTextHandler(event))
}

Bot.on('message', require('./on-message'))

// TODO: new_chat_members, left_chat_member

module.exports = EVENTS