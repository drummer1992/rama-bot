'use strict'

const { MINUTE, getDate } = require('./date')

module.exports = ({ hours, minutes }) => fn => {
  const interval = setInterval(() => {
    const date = getDate()

    const hoursMatch = hours === date.getHours()
    const minutesMatch = minutes === date.getMinutes()

    if (hoursMatch && minutesMatch) {
      fn(interval)
    }
  }, MINUTE)
}