import { mapState } from 'vuex'
import { getThirdAuthURL, thirdAuthCallbackUrl } from '@/api/thirdAuth'
import { SESSION_CALLBACK_URL } from '@/const/common'
import { getUrlWithNoParams } from '@/utils/util'

/**
 * zoom 授权公共方法
 * @type {{data(), created(), methods: {}}}
 */
export const ZoomAuthMixin = {
  computed: {
    ...mapState({
      zoomAccessToken: state => state.user.info.zoomAuthToken?.accessToken,
      zoomRefreshToken: state => state.user.info.zoomAuthToken?.refreshToken
    })
  },
  created() {
    window.addEventListener('message', this.handleZoomAuthCallback)
  },
  beforeDestroy() {
    window.removeEventListener('message', this.handleZoomAuthCallback)
  },
  methods: {
    /**
     * 进行zoom授权，获取zoom授权token
     * @returns {Promise<any>}
     */
    goToZoomAuth() {
      this.$logger.info('goToZoomAuth')
      let url = getThirdAuthURL('zoom')
      url += `?role=teacher`
      url += `&callbackUrl=`
      url += thirdAuthCallbackUrl
      if (this.callbackUrl) {
        window.sessionStorage.setItem(SESSION_CALLBACK_URL, getUrlWithNoParams(this.callbackUrl))
      }
      this.$logger.info('full auth url ', url)
      window.open(url, '_blank')
    },

    handleZoomAuthCallback (event) {
      const data = event.data
      if (data && data.event === 'authUpdate' && data.authType === 'zoom') {
        this.$logger.info('zoom auth update!')
        this.$store.dispatch('GetInfo')
      }
    }
  }
}
