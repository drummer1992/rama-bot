'use strict'

require('./events')

const { SECOND } = require('./utils/date')

const timer = require('./utils/timer')
const sendScheduledMessages = require('./send-scheduled-messages')

timer(sendScheduledMessages, SECOND * 30)