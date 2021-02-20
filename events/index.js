'use strict'

const assert = require("assert")
const EVENTS = [
  {
    regExp: /\/(start)/g,
    module: require('./on-start'),
  },
  {
    regExp: /^[+-➕➖]$/,
    module: require('./on-plus'),
  },
  {
    regExp: /^\/setgroup ([bd]-[12])$/g,
    module: require('./on-set-group'),
  },
  {
    regExp: /^\/addtraining ([bd]-[12])(\s\d\d:\d\d)?$/g,
    module: require('./on-add-training'),
  }
]

const onTextHandler = event => async (msg, match) => {
  const start = match[1] === 'start'

  msg.username = msg.from.first_name || msg.from.last_name || msg.from.username

  try {
    if (!start) {
      const eMessage = 'Человечка сначала нужно поставить на контроль 😎. /start'

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

module.exports = EVENTS