
import router from '../router'

/**
 * third auth callback url with vue router path
 * @type {string}
 */
export const thirdAuthCallbackUrl = window.location.origin + (router.mode === 'hash' ? '#' : '') + '/user/auth-result'

/**
 * get auth url by source
 * @param source
 * @returns {string}
 */
export const getThirdAuthURL = function (source) {
  if (!source) {
    throw new Error('getThirdAuthURL got a illegal source: ' + source)
  }
  switch (source.toString().trim()) {
    case 'google':
      return process.env.VUE_APP_API_BASE_URL + '/classcipe/thirdLogin/render/google'
    case 'zoom':
      return process.env.VUE_APP_API_BASE_URL + '/classcipe/thirdLogin/render/zoom'
    default:
      throw new Error('not config auth url for source[' + source + ']')
  }
}
