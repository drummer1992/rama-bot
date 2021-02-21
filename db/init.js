'use strict'

require('./models/user')
require('./models/training')
require('./models/reaction-file')
require('./models/scheduled-message')

module.exports = () => require('mongoose')
  .connect(
    process.env.MONGO_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
  )