'use strict'

const { botAssert } = require('../errors')
const { START } = require('../constatnts/app')

module.exports = fn =>
  /**
   *
   * @param {MessageWithContext} msg
   * @param rest
   * @returns {Promise<*>}
   */
  async (msg, ...rest) => {
    const user = await User.findOne({ id: msg.from.id })

    if (msg.text !== START) {
      botAssert(user, `Для початку роботи зі мною, Вам необхідно натиснути ${START}`)
    }

    if (!user || !user.isAdmin) {
      botAssert(process.env.MODE !== 'DEBUG', 'Вибачте, я на ремонті 🛠')
    }

    if (user) {
      msg.setUser(user)
    }

    return fn(msg, ...rest)
  }