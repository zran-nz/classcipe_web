
/**
 * debug
 * @param message
 */
function debug (...message) {
  console.debug(...message)
}

/**
 * info
 * @param message
 */
function info (...message) {
  console.log(...message)
}

/**
 * error log
 * @param message
 */
function error (...message) {
  console.error(message)
}

/**
 * warn log
 * @param message
 */
function warn (...message) {
  console.warn(...message)
}

export {
  debug,
  info,
  warn,
  error
}
