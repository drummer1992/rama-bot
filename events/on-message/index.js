'use strict'

const HANDLERS = [
  require('./save-reactions')
]

module.exports = async msg => {
  const name = msg.from.first_name || msg.from.last_name || msg.from.username

  console.info({ [name]: msg.text })

  for (const handler of HANDLERS) {
    await handler(msg).catch(e => console.error(e.message))
  }
}