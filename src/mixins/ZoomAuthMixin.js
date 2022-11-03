import { mapState } from 'vuex'
import { checkAuthExpired, getThirdAuthURL, thirdAuthCallbackUrl, unbindAuth } from '@/api/thirdAuth'
import { SESSION_CALLBACK_URL } from '@/const/common'
import { SET_PROMOTE_CODE } from '@/store/mutation-types'
import { getUrlWithNoParams, getCookie } from '@/utils/util'
import notification from 'ant-design-vue/lib/notification'

/**
 * zoom 授权公共方法
 * @type {{data(), created(), methods: {}}}
 */
export const ZoomAuthMixin = {
  computed: {
    ...mapState({
      zoomAccessToken: state => state.user.info.zoomAuth?.email,
      zoomRefreshToken: state => state.user.info.zoomAuth?.refreshToken
    }),
    zoomMeetingCapacity () {
      const extInfoJson = this.$store.state.user.info.zoomAuth?.extInfo
      if (extInfoJson) {
        const extInfo = JSON.parse(extInfoJson)
        return extInfo.meeting_capacity
      } else {
        return 500
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
     * 进行zoom授权，获取zoom授权token 不是登录
     * @returns {Promise<any>}
     */
    goToZoomAuth() {
      const email = this.$store.getters.email
      console.info('goToZoomAuth email:', email)
      let url = getThirdAuthURL('zoom')
      url += `?role=teacher`
      url += `&email=${email}`
      url += `&slideAuth=2`
      url += `&channelId=${getCookie(SET_PROMOTE_CODE)}`
      url += `&callbackUrl=`
      url += thirdAuthCallbackUrl
      if (this.callbackUrl) {
        window.sessionStorage.setItem(SESSION_CALLBACK_URL, getUrlWithNoParams(this.callbackUrl))
      }
      window.sessionStorage.setItem('SESSION_AUTH_TYPE', 'zoom')
      console.info('full auth url ', url)
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
        alert('The zoom authorization window is blocked by the browser, please allow the authorization window to pop up and then refresh the page.')
      }
    },

    handleZoomAuthCallback (event) {
      const data = event.data
      if (data && data.event === 'authUpdate' && data.authType === 'zoom') {
        console.info('zoom auth update!')
        window.sessionStorage.removeItem('SESSION_AUTH_TYPE')
        this.$store.dispatch('GetInfo')
        this.$store.commit('SET_ZOOM_CHECKED', true)
      }
    },

    async checkZoomAuthExpired() {
      const ret = await checkAuthExpired('zoom', this.$store.getters.email)
      console.info('checkZoomAuthExpired', ret)
      if (ret.code === 0 && ret.success) {
        console.info('zoom auth no expired!')
        return true
      } else {
        this.$store.commit('SET_ZOOM_CHECKED', false)
        notification.warning({
          message: 'Reminder',
          description: ret.message,
          icon: h => {
            return h('a-icon', {
              props: {
                type: 'alert'
              }
            })
          }
        })
        return false
      }
    },

    async checkZoomAuth() {
      if (!this.zoomAccessToken) {
        // this.goToZoomAuth()
        this.$store.commit('SET_ZOOM_CHECKED', false)
        return false
      } else {
        const authExpired = await this.checkZoomAuthExpired()
        if (!authExpired) {
          console.info('zoom auth already expired')
          // this.goToZoomAuth()
          this.$store.commit('SET_ZOOM_CHECKED', false)
          return false
        } else {
          console.info('zoom auth still no expired')
          this.$store.commit('SET_ZOOM_CHECKED', true)
          return true
        }
      }
    },

    async unbindZoomAuth() {
      if (!this.zoomAccessToken) {
        return false
      } else {
        const res = await unbindAuth('zoom')
        if (res.success && res.code === 0) {
          this.$message.success('Unbind successfully')
          this.$store.dispatch('GetInfo')
          this.$store.commit('SET_ZOOM_CHECKED', false)
        }
        return true
      }
    }
  }
}
