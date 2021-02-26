'use strict'

const { getDate, hasSameTime } = require("./utils/date")
const { ActionTypes: t, Event: e } = require("./constatnts/action")
const getRating = require("./rating/get")

const { CLOCK, ARM, HAPPY, PLUS, MINUS, SHIT, SNOW_STYLE, WATER, RAMA_MEDAL } = require('./constatnts/emoji')

const hourToTrainingMessage = group => `Група ${group}, у вас тренування ${ARM} через годину ${CLOCK}.\n\n` +
  `Гостріть лижі ${SNOW_STYLE} і не забувайте водичку ${WATER}`

const trainingStartsMessage = group => `Група ${group}, бажаю вам успішного тренування, ви найкращі ${ARM}\n\n`

const trainingEndsMessage = (group, rating) => `Вітаю вас група ${group}, сьогодні ви стали ще на крок ближче до Рами Вандама\n`
  + `Кожен з вас отримує по Вандамській медалькі ${RAMA_MEDAL}\n\n`
  + `На даний момент маємо такий рейтинг Вандамів\n\n${rating}`

const HANDLERS = {
  [t.NOTIFY]: {
    [e.TRAINING_CREATED]: async ({ groupId }) => {
      const group = await Group.findOne({ _id: groupId })

      const message = `Всім привіт ${HAPPY}!\n\n`
        + `В ${group.trainingTime} ${CLOCK} стартує тренування групи ${group.name}\n\n`
        + `Поставте ${PLUS} якщо прийдете, або ${MINUS} якщо пропускаєте ${SHIT}`

      await Bot.sendMessage(group.chatId, message)
    },
    [e.HOUR_TO_TRAINING]: async ({ groupId }) => {
      const group = await Group.findOne({ _id: groupId })

      await Bot.sendMessage(group.chatId, hourToTrainingMessage(group.name))
    },
    [e.TRAINING_STARTS] : async ({ groupId }) => {
      const group = await Group.findOne({ _id: groupId })

      await Bot.sendMessage(group.chatId, trainingStartsMessage(group.name))
    },
    [e.TRAINING_END]    : async ({ groupId }) => {
      const group = await Group.findOne({ _id: groupId })

      await User.updateMany({ group, plus: true }, { $inc: { visitCounter: 1 } })

      const rating = await getRating()

      await Bot.sendMessage(group.chatId, trainingEndsMessage(group.name, rating))
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