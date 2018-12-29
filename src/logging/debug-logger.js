const BaseLogger = require('./base-logger')
const debug = require('debug')

class DebugLogger extends BaseLogger {
  constructor () {
    super()
    this.logger = debug(this.name)
    debug.enable(this.name)
  }

  get name () {
    return 'debug-logger'
  }

  log (message) {
    this.logger(message)
  }
}

module.exports = DebugLogger
