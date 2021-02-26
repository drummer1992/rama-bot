'use strict'

require('./models/user')
require('./models/training')
require('./models/reaction-file')
require('./models/group')
require('./models/action')

module.exports = () => require('mongoose')
  .connect(
    process.env.MONGO_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
  )