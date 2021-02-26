'use strict'

exports.enrichTaskData = taskData => (data, i) => {
  taskData[i] = data

  return i
}