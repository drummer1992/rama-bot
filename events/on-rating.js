'use strict'

const { MEDALS, RAMA_MEDAL } = require('../constatnts/emoji')

module.exports = async () => {
  const users = await User.find({}, {
    visitCounter: 1,
    firstName   : 1,
    lastName    : 1,
    username    : 1,
  })
    .sort({ visitCounter: -1, isTrainer: -1 })

  const resolveMedal = (user, i) => {
    let medal = RAMA_MEDAL

    if (user.visitCounter !== 0) {
      medal = MEDALS[i] || RAMA_MEDAL
    }

    return medal
  }

  const rating = users.map((user, i) =>
    `${user.getName()} ${user.visitCounter} ${resolveMedal(user, i)}`).join('\n'
  )

  return `Ось рейтинг наших Вандамів:\n\n${rating}\n`
}