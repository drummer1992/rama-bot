'use strict'

const { Callback: { SET_GROUP, CREATE_TRAINING } } = require('../constatnts/app')

exports.setGroup = payload => ({
  type: SET_GROUP,
  payload
})

exports.createTraining = payload => ({
  type: CREATE_TRAINING,
  payload,
})