'use strict'

const assert = require('assert')
const { SORRY, PLUS } = require("../constatnts/emoji")
const { toSentenceCase } = require("../utils/string")

module.exports = async (msg, match) => {
  const plus = ['+', PLUS].includes(match[0])

  const user = await User.findOne({ id: msg.from.id })

  assert(user.group, `${msg.username}, у тебе не заповнена група ${SORRY}`)

  const training = await Training.findOne({
    group: user.group,
    date : { $gt: Date.now() },
  }).sort({ date: -1 })

  assert(training, `${msg.username}, тренування для твоєї групи ще не створено ${SORRY}️`)

  user.plus = plus

  await user.save()

  const reaction = await ReactionFile.aggregate([
    { $match: { reaction: plus ? 'like' : 'dislike' } },
    { $sample: { size: 1 } },
  ])
    .then(res => res.pop())

  return Bot[`send${toSentenceCase(reaction.type)}`](msg.chat.id, reaction.id)
}