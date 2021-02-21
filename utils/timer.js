'use strict'

const { MINUTE } = require('./date')

module.exports = (fn, period = MINUTE) => {
  const interval = setInterval(() => fn(interval), period)
}