'use strict'

const { MINUTE } = require('./date')

module.exports = ({ hours, minutes }) => fn => {
  const interval = setInterval(() => {
    const date = new Date()

    const hoursMatch = hours === date.getHours()
    const minutesMatch = minutes === date.getMinutes()

    if (hoursMatch && minutesMatch) {
      fn(interval)
    }
  }, MINUTE)
}