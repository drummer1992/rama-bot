'use strict'

require('./models/user')
require('./models/training')

module.exports = () => require('mongoose')
  .connect(
    process.env.MONGO_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
  )