'use strict'

require('./events')
require('./callbacks')

const { SECOND } = require('./utils/date')

const timer = require('./utils/timer')
const processScheduledTasks = require('./process-scheduled-tasks')

timer(processScheduledTasks, SECOND * 20)