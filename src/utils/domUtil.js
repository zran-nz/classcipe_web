import config from '@/config/defaultSettings'
import * as logger from '@/utils/logger'

export const setDocumentTitle = function (title) {
  document.title = title
  const ua = navigator.userAgent
  // eslint-disable-next-line
  const regex = /\bMicroMessenger\/([\d\.]+)/
  if (regex.test(ua) && /ip(hone|od|ad)/i.test(ua)) {
    const i = document.createElement('iframe')
    i.src = '/favicon.ico'
    i.style.display = 'none'
    i.onload = function () {
      setTimeout(function () {
        i.remove()
      }, 9)
    }
    document.body.appendChild(i)
  }
}

export const domTitle = config.title

export function scrollIntoViewById (domId) {
  const element = document.getElementById(domId)
  if (element) {
    logger.info('scrollIntoViewById ' + domId)
    element.scrollIntoView({
      block: 'center',
      inline: 'center',
      behavior: 'smooth'
    })
  } else {
    logger.info('scrollIntoViewById not found dom with id ' + domId)
  }
}
