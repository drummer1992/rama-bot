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
    const user = await User.findOne({ id: msg.from.id }, {
      username : 1,
      firstName: 1,
      lastName : 1,
    })

    const username = user ? user.getName() : msg.username

    await Bot.sendMessage(msg.message.chat.id, `${username}, ${e.message} ${ROBO}`)
  }
})