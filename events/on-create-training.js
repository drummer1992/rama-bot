// 'use strict'
//
// const assert = require('assert')
// const { getDate } = require('../utils/date')
//
// const { FUN, CLOCK, ARM, HAPPY, PLUS, MINUS, SHIT, SNOW_STYLE, WATER, CRAZY } = require('../constatnts/emoji')
// const { CREATE_TRAINING } = require('../constatnts/app')
//
// const hourMessage = group => `Група ${group}, у вас трєня ${ARM} через годину ${CLOCK}.\n\n` +
//   `Гостріть лижі ${SNOW_STYLE} і не забувайте водичку ${WATER}`
//
// const trainingStartMessage = group => `Група ${group}, удачної трєні ${ARM}\n\n`
//   + `Памятайте, багато бурпєй не буває ${CRAZY}`
//
// const TIME_BY_DEFAULT = '19:30'
//
// const groupRegex = /([a-я]-\d)/
// const timeRegex = /(\d\d:\d\d)/
//
// module.exports = async msg => {
//   const groupName = (groupRegex.exec(msg.text) || [])[0]
//   const time = (timeRegex.exec(msg.text) || [])[0] || TIME_BY_DEFAULT
//
//   assert(groupName, `Ви не вказали групу, ось приклад: ${CREATE_TRAINING} в-2 19:30`)
//
//   const [group, trainer] = await Promise.all([
//     Group.findOne({ name: groupName }),
//     User.findOne({ id: msg.from.id, isTrainer: true }),
//   ])
//
//   assert(trainer, `Тренера не знайдено`)
//   assert(group, `Групу не знайдено`)
//
//   const [hours, minutes] = time.split(':').map(Number)
//
//   const dateNow = getDate()
//   const trainingDate = getDate.setTime(hours, minutes)
//
//   const invalidTimeMessage = `В нас немає машини часу ${FUN}. ${time} ${CLOCK}`
//
//   assert(dateNow < trainingDate, invalidTimeMessage)
//
//   trainer.group = group
//   trainer.plus = true
//
//   await User.updateMany({
//     id: { $ne: trainer.id },
//     group,
//   }, { $set: { plus: false } })
//
//   await trainer.save()
//
//   const users = await User.find({ group: group })
//
//   await Training.create({
//     trainer,
//     group,
//     date: trainingDate,
//   })
//
//   let message = `Всім привіт ${HAPPY}!\n\n` +
//     `Сьогодні в ${time} ${CLOCK}\n\n` +
//     `${msg.username} ${ARM.repeat(3)} зазиває на тренування групу ${groupName}\n\n`
//
//   if (users.length) {
//     message += `Учасники ${groupName}:\n` + users.map(user => user.getStat()).join('\n')
//   }
//
//   message += `\n\nПостав ${PLUS} якщо прийдеш, або ${MINUS} раз падаєш на мороз ${SHIT}`
//
//   const reminding = [
//     new ScheduledMessage({
//       chatId: msg.chat.id,
//       text  : trainingStartMessage(groupName),
//       date  : trainingDate,
//     }),
//   ]
//
//   const isLessThanHourToTraining = hours - 1 < dateNow.getHours()
//
//   if (!isLessThanHourToTraining) {
//     reminding.push(new ScheduledMessage({
//       chatId: msg.chat.id,
//       text  : hourMessage(groupName),
//       date  : getDate.setTime(hours - 1, minutes),
//     }))
//   }
//
//   await ScheduledMessage.insertMany(reminding)
//
//   return Bot.sendMessage(msg.chat.id, message)
// }