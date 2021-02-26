'use strict'

const { getDate, hasSameTime } = require("./utils/date")
const { ActionTypes: t, Event: e } = require("./constatnts/action")

const { FUN, CLOCK, ARM, HAPPY, PLUS, MINUS, SHIT, SNOW_STYLE, WATER, CRAZY } = require('./constatnts/emoji')

const hourMessage = group => `Група ${group}, у вас трєнування ${ARM} через годину ${CLOCK}.\n\n` +
  `Гостріть лижі ${SNOW_STYLE} і не забувайте водичку ${WATER}`

const trainingStartMessage = group => `Група ${group}, бажаю вам успішного тренування, ви найкращі ${ARM}\n\n`
  + `Памятайте, багато бурпєй не буває ${CRAZY} і тренер дурного не порадить ${FUN}`

const HANDLERS = {
  [t.NOTIFY]: {
    [e.TRAINING_CREATED]: async ({ groupId }) => {
      const group = await Group.findOne({ _id: groupId })

      const message = `Всім привіт ${HAPPY}!\n\n`
        + `В ${group.trainingTime} ${CLOCK}\n\n`
        + `стартує тренування групи ${group.name}\n\n`
        + `Поставте ${PLUS} якщо прийдете, або ${MINUS} якщо пропускаєте ${SHIT}`

      await Bot.sendMessage(group.chatId, message)
    },
    [e.HOUR_TO_TRAINING]: async ({ groupId }) => {

    },
    [e.TRAINING_STARTS] : async ({ groupId }) => {

    },
    [e.TRAINING_END]    : async ({ groupId }) => {

    },
  }
}

module.exports = async () => {
  const scheduledTasks = await Action.find({ type: t.NOTIFY })

  const dateNow = getDate()

  const actualTasks = scheduledTasks.filter(task => hasSameTime(task.payload.date, dateNow))

  if (actualTasks.length) {
    await Promise.all(actualTasks.map(task => HANDLERS[task.type][task.payload.event](task.payload.data)))

    await Action.deleteMany({ _id: { $in: actualTasks.map(m => m._id) } })
  }
}