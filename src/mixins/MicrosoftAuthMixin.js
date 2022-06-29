import { mapState } from 'vuex'
import { checkAuthExpired, getThirdAuthURL, thirdAuthCallbackUrl, unbindAuth } from '@/api/thirdAuth'
import { SESSION_CALLBACK_URL } from '@/const/common'
import { SET_PROMOTE_CODE } from '@/store/mutation-types'
import { getUrlWithNoParams, getCookie } from '@/utils/util'

/**
 * microsoft 授权公共方法
 * @type {{data(), created(), methods: {}}}
 */
export const MicrosoftAuthMixin = {
  computed: {
    ...mapState({
      microsoftAccessToken: state => state.user.info.mircosoftAuthToken?.accessToken,
      microsoftRefreshToken: state => state.user.info.mircosoftAuthToken?.refreshToken
    })
  },
  created() {
    window.addEventListener('message', this.handleMicrosoftAuthCallback)
  },
  beforeDestroy() {
    window.removeEventListener('message', this.handleMicrosoftAuthCallback)
  },
  methods: {
    /**
     * 进行microsoft授权，获取microsoft授权token 不是登录
     * @returns {Promise<any>}
     */
    goToMicrosoftAuth() {
      const email = this.$store.getters.email
      this.$logger.info('goToMicrosoftAuth email:', email)
      let url = getThirdAuthURL('microsoft')
      url += `?role=teacher`
      url += `&email=${email}`
      url += `&slideAuth=2`
      url += `&channelId=${getCookie(SET_PROMOTE_CODE)}`
      url += `&callbackUrl=`
      url += thirdAuthCallbackUrl
      if (this.callbackUrl) {
        window.sessionStorage.setItem(SESSION_CALLBACK_URL, getUrlWithNoParams(this.callbackUrl))
      }
      window.sessionStorage.setItem('SESSION_AUTH_TYPE', 'microsoft')
      this.$logger.info('full auth url ', url)
      const height = 600
      const width = 800
      // 获得窗口的垂直位置
      const iTop = (window.screen.availHeight - 30 - height) / 2
      // 获得窗口的水平位置
      const iLeft = (window.screen.availWidth - 10 - width) / 2
      const strWindowFeatures = 'width=' + width + ',height=' + height + ',menubar=yes,location=yes,resizable=yes,scrollbars=true,top=' + iTop + ',left=' + iLeft
      const windowObjectReference = window.open(url, '_blank', strWindowFeatures)
      if (!windowObjectReference) {
        // 弹出框被拦截
        alert('The microsoft authorization window is blocked by the browser, please allow the authorization window to pop up and then refresh the page.')
      }
    },

    handleMicrosoftAuthCallback (event) {
      const data = event.data
      if (data && data.event === 'authUpdate' && data.authType === 'microsoft') {
        this.$logger.info('microsoft auth update!')
        window.sessionStorage.removeItem('SESSION_AUTH_TYPE')
        this.$store.dispatch('GetInfo')
      }
    },

    async checkMicrosoftAuthExpired() {
      const ret = await checkAuthExpired('microsoft', this.$store.getters.email)
      this.$logger.info('checkMicrosoftAuthExpired', ret)
      if (ret.code === 0 && ret.success) {
        this.$logger.info('microsoft auth no expired!')
        return true
      } else {
        return false
      }
    },

    async checkMicrosoftAuth() {
      if (!this.microsoftAccessToken) {
        this.goToMicrosoftAuth()
        return false
      } else {
        const authExpired = await this.checkMicrosoftAuthExpired()
        if (!authExpired) {
          this.$logger.info('microsoft auth already expired')
          this.goToMicrosoftAuth()
          return false
        } else {
          this.$logger.info('microsoft auth still no expired')
          return true
        }
      }
    },

    async unbindMicrosoftAuth() {
      if (!this.microsoftAccessToken) {
        return false
      } else {
        const res = await unbindAuth('microsoft')
        if (res.success && res.code === 0) {
          this.$message.success('Unbind successfully')
          this.$store.dispatch('GetInfo')
        }
        return true
      }
    }
  }
}
