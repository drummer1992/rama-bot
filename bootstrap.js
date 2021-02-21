'use strict'

require('dotenv').config()

const TelegramBot = require('node-telegram-bot-api')

const Bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true })

const initDb = require('./db/init')

async function main() {
  await initDb()

  console.log('---- BOT successfully started ----')

  global.Bot = Bot

  require('./app')
}

main().catch(e => {
  console.error(e.message)

  process.exit(-1)
})

Bot.on('polling_error', console.error)