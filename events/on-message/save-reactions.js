'use strict'

const { LIKE, DISLIKE } = require('../../constatnts/emoji')

const REACTION_BY_EMOJI = {
  [LIKE]   : 'like',
  [DISLIKE]: 'dislike',
}

module.exports = async msg => {
  if (msg.sticker) {
    const file = msg.sticker
    const reaction = REACTION_BY_EMOJI[file.emoji]

    if (reaction) {
      await ReactionFile.create({
        id      : file.file_id,
        uniqueId: file.file_unique_id,
        type    : 'sticker',
        reaction,
      })

      console.log(`Reaction: ${reaction} stored`)
    }
  }
}