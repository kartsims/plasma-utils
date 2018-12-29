/**
 * A base class for loggers.
 */
class BaseLogger {
  /**
   * Returns the name of this logger.
   * @returns {string} Name of the logger.
   */
  get name () {
    throw new Error('Classes that extend BaseLogger must implement this method')
  }

  /**
   * Logs a message.
   * @param {*} message Message to be logged.
   */
  log (message) {
    throw new Error('Classes that extend BaseLogger must implement this method')
  }
}

module.exports = BaseLogger
