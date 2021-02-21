'use strict'

const assert = require('assert')
const { SORRY, PLUS, ARM, ROBO } = require("../constatnts/emoji")
const { FORCE } = require("../constatnts/routes")
const { toSentenceCase } = require("../utils/string")

const rejectMessage = name => `${name}, тренування для твоєї групи ще не створено ${SORRY}\n` +
  `Якщо ти хочеш всеодно сьогодні прийти на тренування ${ARM} натисни ${FORCE}`

module.exports = async (msg, match) => {
  const plus = ['+', PLUS].includes(match[0])

  const user = await User.findOne({ id: msg.from.id })

  assert(user.plus !== plus, `${user.getName()} я вже запамятав ваш вибір ${ROBO}`)

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