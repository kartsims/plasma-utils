const ConsoleLogger = require('./console-logger')
const DebugLogger = require('./debug-logger')

module.exports = {
  ConsoleLogger,
  DebugLogger,
  DefaultLogger: DebugLogger
}
