
/**
 * info
 * @param message
 */
function info (...message) {
  console.log(message)
}

/**
 * error log
 * @param message
 */
function error (...message) {
  console.log(message)
}

/**
 * warn log
 * @param message
 */
function warn (...message) {
  console.log(message)
}

export {
  info,
  warn,
  error
}
