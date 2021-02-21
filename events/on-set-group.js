'use strict'

const { SET_GROUP } = require("../constatnts/routes")
const { assertGroupIsValid } = require("../common/errors")
const { HAPPY } = require("../constatnts/emoji")

module.exports = async msg => {
  const group = msg.text.replace(SET_GROUP, '').trim()

  assertGroupIsValid(group)

  await User.updateOne({ id: msg.from.id }, { group })
  await Bot.sendMessage(msg.chat.id, `${msg.username} вам встановлена нова група: ${group} ${HAPPY}`)
}