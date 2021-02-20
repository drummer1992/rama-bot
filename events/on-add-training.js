'use strict'

const assert = require('assert')
const timer = require('../utils/timer')
const reminding = require('./reminding')
const { getDate } = require("../utils/date")

const hourMessage = group => `Група: ${group} у вас трєня 💪 через годину ⏰, гостріть лижі ⛷ і не забувайте водичку 💧`
const trainingStartMessage = group => `Група: ${group} Удачної трєні 💪, і памятайте, багато бурпєй не буває 😜`

const TIME_BY_DEFAULT = '19:30'

const trainers = [process.env.TRAINER_ID, process.env.ADMIN_ID].filter(Boolean)

module.exports = async (msg, match) => {
  const group = match[1]

  const trainer = await User.findOne({ id: msg.from.id })

  assert(trainers.length, 'Ще не доданий жоден тренер 🤷‍♂')
  assert(trainer, 'Тренер не знайдений 🤷‍♂')
  assert(trainers.includes(trainer.id), `${msg.username} вибачай але ти не тренер, і навіть не адмін 🤷‍♂`)

  const time = match[2] || TIME_BY_DEFAULT

  const [hours, minutes] = time.split(':').map(Number)

  const dateNow = getDate()

  const invalidTimeMessage = `Коли це ти зібрався тренуватись? В нас немає машини часу 🤣. ${time}`

  assert(dateNow.getHours() <= hours, invalidTimeMessage)
  assert(dateNow.getMinutes() < minutes, invalidTimeMessage)

  trainer.group = group
  trainer.plus = true

  await trainer.save()

  const users = await User.find({ group })

  await Training.create({
    trainer,
    users,
    group,
    date: getDate.withTime(hours, minutes),
  })

  let message = 'Здоров бандіти!\n' +
    `${msg.username} 💪💪💪 зазиває на тренування групу: ${group} 😀\n` +
    `Сьогодні в ${match[2]} ⏰\n`

  if (users.length) {
    message += `В групу ${group} входять:\n` +
      users.map(user => user.username && `@${user.username}`)
        .filter(Boolean)
        .join('\n')

    if (hours - 1 !== dateNow.getHours()) {
      timer({ hours: hours - 1, minutes })(interval => reminding(interval, msg.chat.id, hourMessage(group)))
    }

    timer({ hours: hours, minutes })(interval => reminding(interval, msg.chat.id, trainingStartMessage(group)))
  }

  message += '\n\nПостав ➕ якщо прийдеш, або ➖ раз падаєш на мороз 💩'

  return Bot.sendMessage(msg.chat.id, message)
}