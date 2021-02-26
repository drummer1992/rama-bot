'use strict'

exports.exclude = (array, value) => array.filter(item => item !== value)
exports.compact = array => array.filter(Boolean)