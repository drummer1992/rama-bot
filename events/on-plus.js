'use strict'

const assert = require('assert')
const { PLUS, ARM } = require("../constatnts/emoji")
const { FORCE } = require("../constatnts/app")
const { toSentenceCase } = require("../utils/string")

const rejectMessage = name => `${name}, тренування для твоєї групи ще не створено\n` +
  `Якщо ви хочете всеодно сьогодні прийти ${ARM}, натисніть будь ласка ${FORCE}`

module.exports = async (msg, match) => {
  const plus = ['+', PLUS].includes(match[0])

  const user = await User.findOne({ id: msg.from.id })

  assert(user.plus !== plus, `Я вже запамятав ваш вибір`)

  const training = await Training.findOne({
    group: user.group,
    date : { $gt: Date.now() },
  }).sort({ date: -1 })

  assert(training, rejectMessage(user.getName()))

  user.plus = plus

  await user.save()

  const reaction = await ReactionFile.aggregate([
    { $match: { reaction: plus ? 'like' : 'dislike' } },
    { $sample: { size: 1 } },
  ])
    .then(res => res.pop())

  return Bot[`send${toSentenceCase(reaction.type)}`](msg.chat.id, reaction.id)
}