'use strict'

const { SECOND } = require('./date')

exports.pause = seconds => new Promise(resolve => {
  setTimeout(resolve, seconds * SECOND)
})