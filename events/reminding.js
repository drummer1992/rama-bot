'use strict'

const sendGreeting = message => user => Bot.sendMessage(user.id, message)

module.exports = async (interval, message) => {
  clearInterval(interval)

  const training = await Training.findOne().sort({ date: -1 })

  const users = await User.find({ group: training.group, plus: true })

  await Promise.all(users.map(sendGreeting(message)))
}