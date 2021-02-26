'use strict'

exports.exclude = (array, value) => array.filter(item => item !== value)
exports.compact = array => array.filter(Boolean)

exports.keyBy = (array, key) => {
  const result = {}

  for (const item of array) {
    result[item[key]] = item
  }

  return result
}