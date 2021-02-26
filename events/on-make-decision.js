'use strict'

const { PLUS } = require("../constatnts/emoji")
const { toSentenceCase } = require("../utils/string")

module.exports = decision => async msg => {
  const plus = decision === PLUS

  const user = msg.getUser()

  const training = await Training.findOne({
    date: { $gt: Date.now() },
  }).sort({ date: -1 })
    .populate('group')

  if (training) {
    user.plus = plus
    user.group = training.group

    await user.save()

    const reaction = await ReactionFile.aggregate([
      { $match: { reaction: plus ? 'like' : 'dislike' } },
      { $sample: { size: 1 } },
    ])
      .then(res => res.pop())

    await Bot[`send${toSentenceCase(reaction.type)}`](msg.getChatId(), reaction.id)
  }
}