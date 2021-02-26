'use strict'

exports.ActionTypes = {
  NOTIFY          : 'NOTIFY',
  BUTTON_SELECTION: 'BUTTON_SELECTION',
}

const e = exports.Event = {
  TRAINING_CREATED: 'TRAINING_CREATED',
  HOUR_TO_TRAINING: 'HOUR_TO_TRAINING',
  TRAINING_STARTS : 'TRAINING_STARTS',
  TRAINING_END    : 'TRAINING_END',
  SET_GROUP       : 'SET_GROUP',
  CREATE_TRAINING : 'CREATE_TRAINING',
  CHOOSE_TIME     : 'CHOOSE_TIME',
  CHOOSE_GROUP    : 'CHOOSE_GROUP',
}

exports.Flow = {
  SET_GROUP      : [e.CHOOSE_GROUP, e.SET_GROUP],
  CREATE_TRAINING: [e.CHOOSE_GROUP, e.CHOOSE_TIME, e.CREATE_TRAINING],
}


