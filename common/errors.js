'use strict'

const assert = require('assert')

const { Groups } = require("../constatnts/training")
const { SORRY } = require("../constatnts/emoji")

const availableGroups = Object.values(Groups)

const assertGroupIsValid = group => assert(availableGroups.includes(group),
  `Ви передали не корректну групу ${SORRY}\nПовинна бути одна з [${availableGroups.join(', ')}]`)

module.exports = { assertGroupIsValid }