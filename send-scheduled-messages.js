'use strict'

const { getDate, hasSameTime } = require("./utils/date")

module.exports = async () => {
  const scheduledMessages = await ScheduledMessage.find()

  const dateNow = getDate()

  const actualMessages = scheduledMessages.filter(message => hasSameTime(message.date, dateNow))

  if (actualMessages.length) {
    await Promise.all(actualMessages.map(message => Bot.sendMessage(message.chatId, message.text)))

    await ScheduledMessage.deleteMany({ _id: { $in: actualMessages.map(m => m._id) } })
  }
}