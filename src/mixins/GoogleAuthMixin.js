import { mapState } from 'vuex'
import { checkAuthExpired, getThirdAuthURL, thirdAuthCallbackUrl, unbindAuth } from '@/api/thirdAuth'
import { SESSION_CALLBACK_URL } from '@/const/common'
import { SET_PROMOTE_CODE } from '@/store/mutation-types'
import { getUrlWithNoParams, getCookie } from '@/utils/util'

/**
 * google 授权公共方法
 * @type {{data(), created(), methods: {}}}
 */
export const GoogleAuthMixin = {
  computed: {
    ...mapState({
      goolgeAccessToken: state => state.user.info.googleAuth?.email,
      googleRefreshToken: state => state.user.info.googleAuth?.refreshToken
    })
  },
  created() {
    window.addEventListener('message', this.handleGoogleAuthCallback)
  },
  beforeDestroy() {
    window.removeEventListener('message', this.handleGoogleAuthCallback)
  },
  methods: {
    /**
     * 进行google授权，获取google授权token 不是登录
     * @returns {Promise<any>}
     */
    goToGoogleAuth() {
      const email = this.$store.getters.email
      this.$logger.info('goToGoogleAuth email:', email)
      let url = getThirdAuthURL('google')
      url += `?role=teacher`
      url += `&channelId=${getCookie(SET_PROMOTE_CODE)}`
      url += `&callbackUrl=`
      url += thirdAuthCallbackUrl
      if (this.callbackUrl) {
        window.sessionStorage.setItem(SESSION_CALLBACK_URL, getUrlWithNoParams(this.callbackUrl))
      }
      window.sessionStorage.setItem('SESSION_AUTH_TYPE', 'google')
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
        alert('The google authorization window is blocked by the browser, please allow the authorization window to pop up and then refresh the page.')
      }
    },

    handleGoogleAuthCallback (event) {
      const data = event.data
      if (data && data.event === 'authUpdate' && data.authType === 'google') {
        this.$logger.info('google auth update!')
        window.sessionStorage.removeItem('SESSION_AUTH_TYPE')
        this.$store.dispatch('GetInfo')
      }
    },

    async checkGoogleAuthExpired() {
      const ret = await checkAuthExpired('google', this.$store.getters.email)
      this.$logger.info('checkGoogleAuthExpired', ret)
      if (ret.code === 0 && ret.success) {
        this.$logger.info('google auth no expired!')
        return true
      } else {
        return false
      }
    },

    async checkGoogleAuth() {
      if (!this.goolgeAccessToken) {
        this.goToGoogleAuth()
        return false
      } else {
        const authExpired = await this.checkGoogleAuthExpired()
        if (!authExpired) {
          this.$logger.info('google auth already expired')
          this.goToGoogleAuth()
          return false
        } else {
          this.$logger.info('google auth still no expired')
          return true
        }
      }
    },

    async unbindGoogleAuth() {
      if (!this.goolgeAccessToken) {
        return false
      } else {
        const res = await unbindAuth('google')
        if (res.success && res.code === 0) {
          this.$message.success('Unbind successfully')
          this.$store.dispatch('GetInfo')
        }
        return true
      }
    }
  }
}
