const BaseLogger = require('./base-logger')

class ConsoleLogger extends BaseLogger {
  get name () {
    return 'base-logger'
  }

  log (message) {
    console.log(message)
  }
}

module.exports = ConsoleLogger
