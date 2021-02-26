'use strict'

const { Event: e } = require('./constatnts/action')
const { botAssert } = require('./errors')

const assertUserHasAccess = (user, flow) => {
  const trainerFlows = [e.CREATE_TRAINING]

  if (trainerFlows.includes(flow)) {
    botAssert(user.isTrainer, 'Тільки тренер може викликати цю команду')
  }
}

module.exports = { assertUserHasAccess }