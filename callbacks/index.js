'use strict'

const { Callback: { SET_GROUP, CREATE_TRAINING } } = require('../constatnts/app')
const { ROBO } = require('../constatnts/emoji')

const CALLBACKS = {
  [SET_GROUP]      : require('./set-group'),
  [CREATE_TRAINING]: require('./create-training'),
}

Bot.on('callback_query', async msg => {
  msg.username = msg.from.first_name || msg.from.last_name || msg.from.username

  try {
    const action = JSON.parse(msg.data)

    const flow = CALLBACKS[action.type]

    await flow(msg, action.payload)
  } catch (e) {
    await Bot.sendMessage(msg.message.chat.id, `${msg.username}, ${e.message} ${ROBO}`)
  }
})