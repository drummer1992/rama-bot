'use strict'

const ALREADY_EXISTS = 11000

module.exports = async msg => {
  try {
    await User.create({
      id       : msg.from.id,
      chatId   : msg.chat.id,
      firstName: msg.from.first_name,
      lastName : msg.from.last_name,
      username : msg.from.username,
    })

    await Bot.sendMessage(msg.chat.id, `Человечек ${msg.username} на контроле 😎`)
  } catch (e) {
    if (e.code === ALREADY_EXISTS) {
      e.message = `Человечек ${msg.username} уже и так на контроле 😎`
    }

    throw e
  }
}