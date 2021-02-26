class BotError extends Error {
  constructor(message) {
    super(message)

    this.name = BotError.name
  }
}

const botAssert = (condition, message) => {
  if (!condition) {
    throw new BotError(message)
  }
}

module.exports = { botAssert, BotError }