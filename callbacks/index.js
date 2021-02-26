'use strict'

const decorate = require('../decorators')

const { ActionTypes: t, Event: e } = require('../constatnts/action')

const ACTION_HANDLERS = {
  [e.SET_GROUP]      : require('./set-group'),
  [e.CREATE_TRAINING]: require('./create-training'),
  [e.CHOOSE_TIME]    : require('./set-time'),
}

Bot.on('callback_query', decorate(async msg => {
  const { decision, id } = JSON.parse(msg.data)

  const action = await Action.findOne({ id, type: t.BUTTON_SELECTION })

  if (action && action.userId === msg.getUserId()) {
    let { flow: actionFlow, step } = action.payload

    const currentEvent = actionFlow[step]
    const nextEvent = actionFlow[step + 1]

    const shouldDeleteAction = !actionFlow[step + 2]

    const currentFlowData = action.payload[currentEvent].buttons[decision]

    action.payload[currentEvent].decision = decision

    const flow = ACTION_HANDLERS[nextEvent]

    const responseMessage = await flow(msg, currentFlowData, action)

    action.payload.step = step + 1

    if (shouldDeleteAction) {
      await Action.deleteOne({ _id: action._id })
    } else {
      await Action.updateOne({ _id: action._id }, action)
    }

    return responseMessage
  }
}))