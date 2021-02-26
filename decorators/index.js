'use strict'

const assert = require('assert')

const errorHandler = require('./error-handler')
const userProvider = require('./user-provider')

const DEFAULT_DECORATORS = [userProvider, errorHandler]

/**
 * @typedef {Object} From
 * @property {String} first_name
 * @property {String} last_name
 * @property {String} username
 */

/**
 * @typedef {Object} Chat
 * @typedef {String} id
 */

/**
 * @property {String} text
 * @property {From} from
 * @property {Chat} [chat]
 * @property {{ chat: Chat }} [message]
 */
class MessageWithContext {
  constructor(msg) {
    Object.assign(this, msg)
  }

  /**
   * @type {User}
   */
  #user = null

  getChatId() {
    return this.chat && this.chat.id || this.message.chat.id
  }

  setUser(user) {
    assert(user instanceof User, 'invalid user instance')

    this.#user = user
  }

  getUser() {
    return this.#user
  }

  getUserName() {
    if (this.#user) {
      return this.#user.getName()
    }

    return this.from.first_name || this.from.last_name || this.from.username
  }

  getUserId() {
    assert(this.#user, 'user is not filled')

    return this.#user.id
  }
}

module.exports = (fn, decorators = DEFAULT_DECORATORS) =>
  (msg, ...rest) => {
    decorators.forEach(decorator => fn = decorator(fn))

    return fn(new MessageWithContext(msg), ...rest)
  }