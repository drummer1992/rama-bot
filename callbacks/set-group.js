'use strict'

const { HAPPY } = require('../constatnts/emoji')

module.exports = async (msg, group) => {
  await User.updateOne({ id: msg.getUserId() }, { group })

  return `Групу успішно змінено на ${group.name} ${HAPPY}`
}