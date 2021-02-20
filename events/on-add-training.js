'use strict'

const assert = require('assert')
const timer = require('../utils/timer')
const reminding = require('./reminding')

const hourMessage = `Ну шо бандіт, трєня 💪 через години ⏰, гостри лижі ⛷ і не забудь водичку 💧`
const trainingStartMessage = `Удачної трєні 💪, і помни, багато бурпєй не буває 😜`

const getTime = (hours, minutes) => {
  if (hours && minutes) {
    const date = new Date()

    date.setHours(hours)
    date.setMinutes(minutes)

    return date
  }
}

module.exports = async (msg, match) => {
  const trainer = await User.findOne({ id: msg.from.id })

  const group = match[1]

  const [hours = 19, minutes = 30] = (match[2] || '').split(':').map(Number)

  const dateNow = new Date()

  const invalidTimeMessage = `Коли це ти зібрався тренуватись? ${match[2]} 🤣`

  assert(dateNow.getHours() <= hours, invalidTimeMessage)
  assert(dateNow.getMinutes() <= minutes, invalidTimeMessage)

  trainer.group = group

  await trainer.save()

  const users = await User.find({ group })

  const date = getTime(hours, minutes)

  await Training.create({
    trainer,
    users,
    group,
    date,
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
      timer({ hours: hours - 1, minutes })(interval => reminding(interval, hourMessage))
    }

    timer({ hours: hours, minutes })(interval => reminding(interval, trainingStartMessage))
  }

  message += '\n\nПостав ➕ якщо прийдеш, або ➖ раз падаєш на мороз 💩'

  return Bot.sendMessage(msg.chat.id, message)
}