<template>
  <div class="main-content">
    <a-spin size="large" v-if='!authFailed'>
    </a-spin>
    <div class='auth-failed' v-if='authFailed'>
      <div class='auth-failed-detail'>
        <no-more-resources tips=''/>
      </div>
      <div class='auth-failed-tips'>
        Classcipe needs access to your google account to work properly, please grant permission again.
      </div>
      <div class='auth-failed-action'>
        <a-button icon='redo' @click='handleRetryAuth' shape='round' type='primary'>Retry</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import { selectRoleRouter } from '@/config/router.config'
import { getThirdAuthURL, thirdAuthCallbackUrl } from '@/api/thirdAuth'
import NoMoreResources from '@/components/Common/NoMoreResources'
import { SESSION_CALLBACK_URL } from '@/const/common'
import { SET_PROMOTE_CODE } from '@/store/mutation-types'
import { getCookie } from '@/utils/util'

export default {
  name: 'AuthResult',
  components: { NoMoreResources },
  data() {
    return {
      authFailed: false,
      failedMessage: ''
    }
  },
  created () {
    const paramSearch = new URLSearchParams(window.location.search)
    const accessToken = paramSearch.get('accessToken')
    this.$store.dispatch('LoginWithToken', accessToken).then(() => {
      this.$store.dispatch('GetInfo').then(response => {
        this.$logger.info('auth-result-redirect', this.$route)
        const callbackUrl = window.sessionStorage.getItem(SESSION_CALLBACK_URL)

        // 如果有zoom授权token，且当前窗口有opener发送zoom 授权更新消息
        if (window.opener) {
          if (window.opener.postMessage) {
            if (this.$store.state.user.info.zoomAuthToken.accessToken) {
              window.opener.postMessage({
                authType: 'zoom',
                event: 'authUpdate',
                data: null
              }, '*')
            }
            if (this.$store.state.user.info.googleAuthToken.accessToken) {
              window.opener.postMessage({
                authType: 'google',
                event: 'authUpdate',
                data: null
              }, '*')
            }
          }
          window.close()
        }
        if (callbackUrl) {
          window.sessionStorage.removeItem(SESSION_CALLBACK_URL)
          window.location.href = callbackUrl + (callbackUrl.indexOf('?') > -1 ? '&' : '?') + 'token=' + accessToken
        } else if (this.$store.getters.currentRole) {
          this.$router.push(this.$store.getters.defaultRouter)
        } else {
          this.$router.push({ path: selectRoleRouter })
        }
      }).catch((e) => {
        this.authFailed = true
        this.failedMessage = e
      })
    }).catch(() => {
      this.$router.push({ path: '/user/login' })
    })
  },
  methods: {
    handleRetryAuth () {
      let url = getThirdAuthURL('google')
      url += `?role=teacher`
      url += `&channelId=${getCookie(SET_PROMOTE_CODE)}`
      url += `&callbackUrl=`
      url += thirdAuthCallbackUrl
      window.location.href = url
    }
  }
}
</script>

<style scoped lang='less'>
@import "~@/components/index.less";
  .main-content {
    margin-top: 100px;
    display: flex;
    justify-content: center;
    flex-direction: row;
    align-items: center;
  }

  .auth-failed {
    text-align: center;
  }

  .auth-failed-tips {
    padding: 20px 10px;
    color: #333;
    width: 350px;
  }
</style>
