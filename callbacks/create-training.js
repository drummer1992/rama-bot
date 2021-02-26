'use strict'

const df = require('dateformat')
const { botAssert } = require('../errors')
const { getDate, addDays, addMinutes } = require('../utils/date')

const { Event: e, ActionTypes: t } = require('../constatnts/action')

module.exports = async (msg, { time }, action) => {
  const trainer = msg.getUser()

  const [hours, minutes] = time.split(':').map(Number)

  let trainingDate = getDate.setTime(hours, minutes)

  const dateNow = getDate()

  trainingDate.setMilliseconds(0)
  trainingDate.setSeconds(0)

  if (dateNow > trainingDate) {
    trainingDate = addDays(trainingDate, 1)
  }

  const chooseGroupData = action.payload[e.CHOOSE_GROUP]
  const group = chooseGroupData.buttons[chooseGroupData.decision]

  botAssert(!await Training.exists({
    date: trainingDate,
    group,
  }), `Тренування вже створено на цей час: ${df(trainingDate, 'HH:MM')}`)

  trainer.group = group
  trainer.plus = true

  const isLessThanHourToTraining = hours - 1 < dateNow.getHours()

  const buildAction = (event, date,) => new Action({
    type   : t.NOTIFY,
    payload: {
      event,
      date,
      data: { groupId: group._id },
    }
  })

  const actions = [
    buildAction(e.TRAINING_CREATED, addMinutes(dateNow, 1)),
    buildAction(e.TRAINING_STARTS, getDate.setTime(hours, minutes)),
    buildAction(e.TRAINING_END, getDate.setTime(hours + 2.5, minutes)),
  ]

  if (!isLessThanHourToTraining) {
    actions.push(buildAction(e.HOUR_TO_TRAINING, getDate.setTime(hours - 1, minutes)))
  }

  await Promise.all([
    User.updateMany({ _id: { $ne: trainer._id }, group, }, { $set: { plus: false } }),
    Training.create({ trainer, group, date: trainingDate }),
    Group.updateOne({ _id: group._id }, { trainingTime: time }),
    Action.insertMany(actions),
    trainer.save(),
  ])

  return 'OK'
}