'use strict'

const decorate = require('../decorators')
const { assertUserHasAccess } = require("../assertions")

const { ActionTypes: t, Event: e, Flow: f } = require('../constatnts/action')

const ACTION_HANDLERS = {
  [e.SET_GROUP]      : require('./set-group'),
  [e.CREATE_TRAINING]: require('./create-training'),
  [e.CHOOSE_TIME]    : require('./set-time'),
}

Bot.on('callback_query', decorate(async msg => {
  const { decision, id } = JSON.parse(msg.data)

  const action = await Action.findOne({ id, type: t.BUTTON_SELECTION })

  if (
    action
    && action.userId === msg.getUserId()
    && !action.payload.processed
  ) {
    const { payload: { step, data, flow } } = action

    assertUserHasAccess(msg.getUser(), flow)

    const result = data[decision]

    const handlerName = f[flow][step + 1]

    const message = await ACTION_HANDLERS[handlerName](msg, result, action)

    action.payload.result = result
    action.payload.processed = true

    await Action.updateOne({ id }, action)

    return message
  }
}))