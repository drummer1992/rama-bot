'use strict'

const assert = require('assert')
const { SORRY } = require("../constatnts/emoji")

module.exports = async (msg, match) => {
  const type = match[1]
  const reaction = match[2]

  Bot.onReplyToMessage(msg.chat.id, msg.message_id, async reply => {
    const file = reply[type]

    assert(file, `Файли з типом ${type} не підтримуються ${SORRY}`)

    await ReactionFile.create({
      id      : file.file_id,
      uniqueId: file.file_unique_id,
      type,
      reaction,
    })

    console.log('File by on-add-file flow successfully stored')
  })
}