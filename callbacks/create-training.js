'use strict'

const assert = require('assert')
const df = require('dateformat')
const { getDate } = require('../utils/date')

const { FUN, CLOCK, ARM, HAPPY, PLUS, MINUS, SHIT, SNOW_STYLE, WATER, CRAZY } = require('../constatnts/emoji')

const hourMessage = group => `Група ${group}, у вас трєня ${ARM} через годину ${CLOCK}.\n\n` +
  `Гостріть лижі ${SNOW_STYLE} і не забувайте водичку ${WATER}`

const trainingStartMessage = group => `Група ${group}, удачної трєні ${ARM}\n\n`
  + `Памятайте, багато бурпєй не буває ${CRAZY}`

module.exports = async (msg, { g: groupName, u: userId }) => {
  const chatId = msg.message.chat.id

  const [group, trainer] = await Promise.all([
    Group.findOne({ name: groupName }),
    User.findOne({ id: userId }),
  ])

  assert(group, 'Групу не знайдено')
  assert(trainer, 'Тренера не знайдено')
  assert(trainer.isTrainer, `Ви не тренер`)

  const time = group.trainingTime

  const [hours, minutes] = time.split(':').map(Number)

  const dateNow = getDate()
  const trainingDate = getDate.setTime(hours, minutes)

  trainingDate.setMilliseconds(0)
  trainingDate.setSeconds(0)

  const invalidTimeMessage = `В нас немає машини часу ${FUN}. ${time} ${CLOCK}`

  assert(dateNow < trainingDate, invalidTimeMessage)

  assert(trainer.id === msg.from.id, `Нажаль зараз групу встановлює ${trainer.getName()}`)

  assert(!await Training.exists({
    date: trainingDate,
    group,
  }), `Тренування вже створено на цей час: ${df(trainingDate, 'HH:MM')}`)

  trainer.group = group
  trainer.plus = true

  await User.updateMany({
    id: { $ne: trainer.id },
    group,
  }, { $set: { plus: false } })

  await trainer.save()

  const users = await User.find({ group: group })

  await Training.create({
    trainer,
    group,
    date: trainingDate,
  })

  let message = `Всім привіт ${HAPPY}!\n\n` +
    `Сьогодні в ${time} ${CLOCK}\n\n` +
    `${msg.username} ${ARM.repeat(3)} зазиває на тренування групу ${groupName}\n\n`

  if (users.length) {
    message += `Учасники ${groupName}:\n` + users.map(user => user.getStat()).join('\n')
  }

  message += `\n\nПостав ${PLUS} якщо прийдеш, або ${MINUS} раз падаєш на мороз ${SHIT}`

  const reminding = [
    new ScheduledMessage({
      chatId,
      text: trainingStartMessage(groupName),
      date: trainingDate,
    }),
  ]

  const isLessThanHourToTraining = hours - 1 < dateNow.getHours()

  if (!isLessThanHourToTraining) {
    reminding.push(new ScheduledMessage({
      chatId,
      text: hourMessage(groupName),
      date: getDate.setTime(hours - 1, minutes),
    }))
  }

  await ScheduledMessage.insertMany(reminding)

  return Bot.sendMessage(chatId, message)
}