'use strict'

const assert = require('assert')
const { SORRY, FUN, CLOCK, ARM, HAPPY, PLUS, MINUS, SHIT, SNOW_STYLE, WATER, CRAZY } = require('../constatnts/emoji')
const { assertGroupIsValid } = require('../common/errors')
const { getDate } = require('../utils/date')
const hourMessage = group => `Група ${group} у вас трєня ${ARM} через годину ${CLOCK}.\nГостріть лижі ${SNOW_STYLE} і не забувайте водичку ${WATER}`
const trainingStartMessage = group => `Група ${group}, удачної трєні ${ARM}, і памятайте, багато бурпєй не буває ${CRAZY}`

const TIME_BY_DEFAULT = '19:30'

const trainers = [process.env.TRAINER_ID, process.env.ADMIN_ID].filter(Boolean)

const groupRegex = /([a-я]-\d)/
const timeRegex = /(\d\d:\d\d)/

module.exports = async msg => {
  const group = (groupRegex.exec(msg.text) || [])[0]
  const time = (timeRegex.exec(msg.text) || [])[0] || TIME_BY_DEFAULT

  assertGroupIsValid(group)

  assert(trainers.length, `Ще не доданий жоден тренер ${SORRY}`)

  const trainer = await User.findOne({ id: msg.from.id })

  assert(trainer, `Тренер не знайдений ${SORRY}`)
  assert(trainers.includes(trainer.id), `${msg.username} вибачайте але Ви не тренер, і навіть не адмін ${SORRY}`)

  const [hours, minutes] = time.split(':').map(Number)

  const dateNow = getDate()
  const trainingDate = getDate.setTime(hours, minutes)

  const invalidTimeMessage = `Коли це Ви зібралися тренуватися? В нас немає машини часу ${FUN}. ${time} ${CLOCK}`

  assert(dateNow < trainingDate, invalidTimeMessage)

  trainer.group = group
  trainer.plus = true

  await User.updateMany({
    id: { $ne: trainer.id },
  }, { $set: { plus: false } })

  await trainer.save()

  const users = await User.find({ group })

  await Training.create({
    trainer,
    users,
    group,
    date: trainingDate,
  })

  let message = `Всім привіт ${HAPPY}!\n` +
    `${msg.username} ${ARM.repeat(3)} зазиває на тренування групу ${group}\n` +
    `Сьогодні в ${time} ${CLOCK}\n`

  if (users.length) {
    message += `В групу ${group} входять:\n` + users.map(user => user.getStat()).join('\n')
  }

  message += `\n\nПостав ${PLUS} якщо прийдеш, або ${MINUS} раз падаєш на мороз ${SHIT}`

  const reminding = [
    new ScheduledMessage({
      chatId: msg.chat.id,
      text  : trainingStartMessage(group),
      date  : trainingDate,
    }),
  ]

  const isLessThanHourToTraining = hours - 1 < dateNow.getHours()

  if (!isLessThanHourToTraining) {
    reminding.push(new ScheduledMessage({
      chatId: msg.chat.id,
      text  : hourMessage(group),
      date  : getDate.setTime(hours - 1, minutes),
    }))
  }

  await ScheduledMessage.insertMany(reminding)

  return Bot.sendMessage(msg.chat.id, message)
}