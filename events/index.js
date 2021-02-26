'use strict'

const decorate = require('../decorators')
const { HELP_MESSAGE } = require("../constatnts/messages")
const { Event: e } = require("../constatnts/action")
const { PLUS, MINUS } = require("../constatnts/emoji")

const EVENTS = [
  {
    regExp: /^\/start/,
    module: require('./on-start'),
  },
  {
    regExp: /^\/help/,
    module: () => HELP_MESSAGE,
  },
  {
    regExp: /^[+➕]|PLUS|ПЛЮС/i,
    module: require('./on-make-decision')(PLUS),
  },
  {
    regExp: /^[-➖]|MINUS|М([ИІ])НУС/i,
    module: require('./on-make-decision')(MINUS),
  },
  {
    regExp: /^\/setgroup/,
    module: require('./on-choose-group')(e.SET_GROUP),
  },
  {
    regExp: /^\/createtraining/,
    module: require('./on-choose-group')(e.CREATE_TRAINING),
  },
  {
    regExp: /^\/info/,
    module: require('./on-info'),
  },
  {
    regExp: /\/add(sticker|animation) (\blike|dislike)/g,
    module: require('./on-add-file'),
  },
  {
    regExp: /^\/creategroup(\s)?([a-я]-\d)?/g,
    module: require('./on-create-group'),
  },
]

for (const event of EVENTS) {
  Bot.onText(event.regExp, decorate(event.module))
}

Bot.on('message', require('./on-message'))

// TODO: new_chat_members, left_chat_member

module.exports = EVENTS