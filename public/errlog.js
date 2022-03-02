window.ErrCall = function (o) {
  Object.assign(o, { lang: navigator.language, href: location.href, ua: navigator.userAgent })
  fetch('https://dev.classcipe.com/fio/log', { method: 'POST',
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    body: JSON.stringify(o)
  }).then(r => r.json())
  return false
}
window.onerror = function (msg, url, num, line, error) {
  return ErrCall({ type: 'error', msg, url, num, line, stack: error.stack })
}
window.addEventListener('unhandledrejection', (err) => {
  console.log('unhandledrejection', err)
  return ErrCall({ type: 'unhandledrejection', msg: err.reason.message, stack: err.reason.stack })
})
window.VueError = function (err, vm, info) {
  return ErrCall({ type: 'vueError', msg: JSON.stringify(vm), info: JSON.stringify(info), stack: JSON.stringify(err) })
}
