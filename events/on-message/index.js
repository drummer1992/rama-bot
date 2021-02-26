'use strict'

const decorate = require('../../decorators')

const HANDLERS = [
  require('./save-reactions')
]

module.exports = decorate(async msg => {
  console.info({ [msg.getUserName()]: msg.text })

  for (const handler of HANDLERS) {
    await handler(msg).catch(e => console.error(e.message))
  }
}, [])