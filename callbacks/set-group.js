'use strict'

const assert = require('assert')

const { HAPPY } = require('../constatnts/emoji')

module.exports = async (msg, { g: groupName, u: userId }) => {
  const user = await User.findOne({ id: userId }).populate('group')

  const chatId = msg.message.chat.id

  assert(user, `Користувач по id ${user} не знайдений`)
  assert(user.id === msg.from.id, `Це я ${user.getName()} запитував`)

  const group = await Group.findOne({
    name  : groupName,
    chatId,
  })

  assert(group, `Нажаль не вдається знайти групу ${groupName}`)

  if (user.group) {
    assert(user.group.name !== groupName, `Ви вже належите до групи ${groupName}`)
  }

  user.group = group

  await user.save()


  await Bot.sendMessage(chatId, `${user.getName()}, групу успішно змінено на ${groupName} ${HAPPY}`)
}