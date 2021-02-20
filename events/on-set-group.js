'use strict'

module.exports = async (msg, match) => {
  const group = match[1]

  await User.updateOne({ id: msg.from.id }, { group })
  await Bot.sendMessage(msg.chat.id, `${msg.username} вам встановлена нова група: ${group}`)
}