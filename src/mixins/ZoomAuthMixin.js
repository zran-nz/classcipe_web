import { mapState } from 'vuex'
import { checkAuthExpired, getThirdAuthURL, thirdAuthCallbackUrl } from '@/api/thirdAuth'
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
    }),
    zoomMeetingCapacity () {
      const extInfoJson = this.$store.state.user.info.zoomAuthToken?.extInfo
      if (extInfoJson) {
        const extInfo = JSON.parse(extInfoJson)
        return extInfo.meeting_capacity
      } else {
        return 100
      }
    }
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
      const height = 600
      const width = 800
      // 获得窗口的垂直位置
      const iTop = (window.screen.availHeight - 30 - height) / 2
      // 获得窗口的水平位置
      const iLeft = (window.screen.availWidth - 10 - width) / 2
      const strWindowFeatures = 'width=' + width + ',height=' + height + ',menubar=yes,location=yes,resizable=yes,scrollbars=true,status=true,top=' + iTop + ',left=' + iLeft
      const windowObjectReference = window.open(url, '_blank', strWindowFeatures)
      if (!windowObjectReference) {
        // 弹出框被拦截
        alert('The zoom authorization window is blocked by the browser, please allow the authorization window to pop up and then refresh the page.')
      }
    },

    handleZoomAuthCallback (event) {
      const data = event.data
      if (data && data.event === 'authUpdate' && data.authType === 'zoom') {
        this.$logger.info('zoom auth update!')
        this.$store.dispatch('GetInfo')
      }
    },

    async checkZoomAuthExpired() {
      const ret = await checkAuthExpired('zoom', this.$store.getters.email)
      this.$logger.info('checkZoomAuthExpired', ret)
      if (ret.code === 0 && ret.success) {
        this.$logger.info('zoom auth no expired!')
        return true
      } else {
        return false
      }
    },

    async checkZoomAuth() {
      if (!this.zoomAccessToken) {
        this.goToZoomAuth()
        return false
      } else {
        const authExpired = await this.checkZoomAuthExpired()
        if (!authExpired) {
          this.$logger.info('zoom auth already expired')
          this.goToZoomAuth()
          return false
        } else {
          this.$logger.info('zoom auth still no expired')
          return true
        }
      }
    }
  }
}
