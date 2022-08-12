var renderTime

const initPage = function() {
  var docElem = document.documentElement
  var htmlWidth = docElem.getBoundingClientRect().width
  // htmlWidth / ratio > 540 && (htmlWidth = 540 * ratio);
  if (htmlWidth > 1024) htmlWidth = 480
  window.rem = htmlWidth / 16
  docElem.style.fontSize = window.rem + 'px'
}

const resizeFn = function () {
  clearTimeout(renderTime)
  renderTime = setTimeout(initPage, 300)
}

/* eslint-disable indent */
export const initRatio = function() {
  const win = window
  var ratio
    var scaleValue
    var renderTime
    var document = window.document
    var docElem = document.documentElement
    var vpm = document.querySelector('meta[name="viewport"]')

  if (vpm) {
    var tempArray = vpm
      .getAttribute('content')
      // eslint-disable-next-line no-useless-escape
      .match(/initial\-scale=(["']?)([\d\.]+)\1?/)
    if (tempArray) {
      scaleValue = parseFloat(tempArray[2])
      ratio = parseInt(1 / scaleValue)
    }
  } else {
    vpm = document.createElement('meta')
    vpm.setAttribute('name', 'viewport')
    vpm.setAttribute(
      'content',
      'width=device-width, initial-scale=1, user-scalable=no, minimal-ui'
    )
    docElem.firstElementChild.appendChild(vpm)
  }

  win.addEventListener(
    'resize',
    resizeFn,
    false
  )

  win.addEventListener(
    'pageshow',
    function (e) {
      // eslint-disable-next-line no-unused-expressions
      e.persisted &&
        (clearTimeout(renderTime), (renderTime = setTimeout(initPage, 300)))
    },
    false
  )

  document.readyState === 'complete'
    ? (document.body.style.fontSize = 12 * ratio + 'px')
    : document.addEventListener(
        'DOMContentLoaded',
        function () {
          document.body.style.fontSize = 12 * ratio + 'px'
        },
        false
      )

  initPage()
}

export const resetRatio = function() {
  document.body.style.fontSize = ''
  document.documentElement.style.fontSize = ''
  window.removeEventListener('resize', resizeFn)
}
