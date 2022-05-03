<template>
  <div class="share-live">
    <div class="share-live-wrap" v-if="result && result.content">
      <div class='share-live-img'>
        <div class='cover-block' :style="{'background-image': 'url(' + result.content.image + ')'}">
        </div>
      </div>
      <div class="share-live-con">
        <div class="share-live-title">
          {{ result.content.name }}
        </div>
        <div class="share-live-author">
          <a-avatar icon="user" />
          <div class="author-name">{{ result.content.createBy }}</div>
        </div>

        <a-divider />
        <div class="share-live-deadline">
          Metting date {{ result.sessionStartTime }} - {{ result.sessionEndTime }}
        </div>
        <div class="share-live-price">
          <price-slider :priceList="result.priceList" :current="result.registeredNum"/>
        </div>
        <div class="share-live-deadline">
          Deadline: {{ result.lastRegisteredTime }}
        </div>
      </div>
      <a-divider />
      <div class="share-live-bottom">
        <div class="share-live-btn">
          <a-button v-if="device !== DEVICE.DESKTOP" @click="handleShare">Share</a-button>
          <a-tooltip
            v-else
            v-model="shareVisible"
            trigger="click"
            :getPopupContainer="trigger => trigger.parentElement"
            @visibleChange="vis => visibleChange(vis, result)"
          >
            <template slot="title">
              <share-button
                :link="wrapperLink(result)"
                :title="result.content.name"
              />
            </template>
            <a-button>Share</a-button>
          </a-tooltip>
          <a-button @click="handleLogin" type="primary">{{ token ? '' : 'Login to ' }}Register</a-button>
        </div>
      </div>
    </div>
    <div v-else>
      <a-result status="404" title="404" sub-title="Sorry, the page you visited does not exist.">
        <template #extra>
          <a-button type="primary" @click="goHome">
            Back Home
          </a-button>
        </template>
      </a-result>
    </div>
    <a-drawer
      placement="bottom"
      v-if="device !== DEVICE.DESKTOP"
      :closable="false"
      :visible="shareVisible"
      class="share-con"
      @close="onClose"
    >
      <div slot="title" class="share-title">Share to</div>
      <div class="share-out">
        <div>
          <img @click="share('fb')" src="~@/assets/icons/share/fb.png" alt="share to facebook" />
          <p>Facebook</p>
        </div>
        <div>
          <img @click="share('in')" src="~@/assets/icons/share/in.png" alt="share to linked in" />
          <p>Linkedin</p>
        </div>
        <div>
          <img @click="share('ins')" src="~@/assets/icons/share/ins.png" alt="share to instagram" />
          <p>Instagram</p>
        </div>
        <div>
          <img @click="share('twitter')" src="~@/assets/icons/share/twitter.png" alt="share to twitter" />
          <p>Twitter</p>
        </div>
      </div>
    </a-drawer>
    <a-modal
      v-model='loginVisible'
      :dialog-style="{ top: '30%' }"
      :closable='true'
      :footer='null'
      :maskClosable='true'
      class="login-con"
      destroyOnClose
      width='80%'
      @cancel='handleCloseLogin'>
      <div class="login-wrapper">
        <div class="login-title">Sign In</div>
        <third-login-button
          icon="googleIcon"
          :label="$t('user.login.loginWithGoogle')"
          :type="'google'"
          @click.native="thirdSignIn('google', 'teacher')"
        />
        <third-login-button
          icon="googleIcon"
          :label="'Sign in with Zoom'"
          :type="'zoom'"
          @click.native="thirdSignIn('zoom', 'teacher')"
        />
      </div>
    </a-modal>
  </div>
</template>

<script>
import { DetailBySessionId } from '@/api/v2/live'
import { getThirdAuthURL, thirdAuthCallbackUrl } from '@/api/thirdAuth'
import { SESSION_CALLBACK_URL, DEVICE } from '@/const/common'
import PriceSlider from '@/components/Slider/PriceSlider'
import ThirdLoginButton from '@/components/Button/ThirdLoginButton'
import ShareButton from '@/components/Share/ShareButton'
import { mapState } from 'vuex'
import { NOT_REMEMBER_ME } from '@/store/mutation-types'
import { getUrlWithNoParams } from '@/utils/util'
import storage from 'store'
export default {
  name: 'H5Live',
  components: {
    PriceSlider,
    ThirdLoginButton,
    ShareButton
  },
  props: {
    code: {
      type: String,
      default: '',
      reqiured: true
    }
  },
  data() {
    return {
      DEVICE: DEVICE,
      loading: false,
      shareVisible: false,
      loginVisible: false,
      callbackUrl: '',
      result: {
        content: {}
      }
    }
  },
  created() {
    this.init()
  },
  computed: {
    ...mapState({
      token: state => state.user.token,
      device: state => state.app.device
    })
  },
  methods: {
    init() {
      if (this.code) {
        DetailBySessionId({
          sessionId: this.code
        }).then(res => {
          if (res.success) {
            this.result = res.result
          } else {
            this.result = null
          }
        })
      } else {
        this.result = null
      }
    },
    visibleChange(visible, content) {
      if (visible && content.name) {
        this.shareVisible = true
      }
    },
    wrapperLink(item) {
      if (item && item.sessionId) {
        return `${process.env.VUE_APP_BASE_URL}/h5/live/${item.sessionId}`
      } else {
        return ''
      }
    },
    handleShare() {
      this.shareVisible = true
    },
    onClose() {
      this.shareVisible = false
    },
    handleCloseLogin() {
      this.loginVisible = false
    },
    handleLogin() {
      if (!this.token) {
        this.loginVisible = true
      }
    },
    thirdSignIn(source, role) {
      if (role === 'teacher') {
        storage.set(NOT_REMEMBER_ME, false)
      }
      let url
      switch (source) {
        case 'google':
        case 'zoom':
          this.$logger.info('thirdSignIn google', source)
          url = getThirdAuthURL(source)
          url += `?role=${role}`
          url += `&callbackUrl=`
          url += thirdAuthCallbackUrl
          window.sessionStorage.setItem(SESSION_CALLBACK_URL, getUrlWithNoParams(window.location.href))
          this.$logger.info('full auth url ', url)
          window.location.href = url
          break
        default:
          break
      }
    },
    share(type) {
      if (this.result && this.result.content && this.result.sessionId) {
        let wrapperLink = ''
        const title = this.result.content.name
        const link = `${process.env.VUE_APP_BASE_URL}/h5/live/${this.result.sessionId}`
        switch (type) {
          case 'fb':
            wrapperLink = `https://www.facebook.com/share.php?title=${title}&u=${encodeURIComponent(link)}`
            break
          case 'in':
            wrapperLink = `https://www.linkedin.com/shareArticle?mini=true&source=str&title=${title}&url=${encodeURIComponent(link)}`
            break
          case 'twitter':
            wrapperLink = `https://twitter.com/intent/tweet?text=${title}&url=${encodeURIComponent(link)}`
            break
          default:
            break
        }
        window.open(wrapperLink, '_blank')
      }
    },
    goHome() {
      window.location.href = `${process.env.VUE_APP_BASE_URL}`
    }
  }
}
</script>

<style scoped lang="less">
.share-live {
  display: flex;
  flex-direction: column;
  width: 100vw;
  min-height: 100vh;
  height: 100%;
  padding-bottom: 2.133333rem /* 50/23.4375 */;
  position: relative;
  .share-live-img {
    width: 100vw;
    height: 8.533333rem /* 200/23.4375 */;
    .cover-block {
      width: 100%;
      height: 100%;
      background-position: center center;
      background-size: cover;
      background-repeat: no-repeat;
    }
  }
  .share-live-con {
    display: flex;
    flex-direction: column;
    margin-top: 0.853333rem /* 20/23.4375 */;
    .share-live-title {
      font-size: 0.853333rem /* 20/23.4375 */;
      font-weight: bold;
      margin-bottom: 0.426667rem /* 10/23.4375 */;
      padding: 0 0.853333rem /* 20/23.4375 */;
    }
    .share-live-author {
      font-size: 0.597333rem /* 14/23.4375 */;
      padding: 0 0.853333rem /* 20/23.4375 */;
      display: flex;
      align-items: center;
      .author-name {
        margin-left: 0.341333rem /* 8/23.4375 */;
      }
      /deep/ .ant-avatar {
        width: 1.28rem /* 30/23.4375 */;
        height: 1.28rem /* 30/23.4375 */;
        i {
          font-size: 1.024rem /* 24/23.4375 */;
        }
      }
    }

    .share-live-price {
      margin: 0.426667rem /* 10/23.4375 */;
      padding: 0 0.853333rem /* 20/23.4375 */;
      /deep/ .price-slider {
        .slider-label {
          width: calc(100% - 0.533333rem /* 12.5/23.4375 */);
          left: 0.074667rem /* 1.75/23.4375 */;
          .slider-label-item {
            font-size: 0.469333rem /* 11/23.4375 */;
            width: 0.853333rem /* 20/23.4375 */;
          }
        }
        .ant-slider {
          height: 0.768rem /* 18/23.4375 */;
          .ant-slider-rail {
            height: 0.512rem /* 12/23.4375 */;
          }
          .ant-slider-dot {
            width: 0.853333rem /* 20/23.4375 */;
            height: 0.853333rem /* 20/23.4375 */;
          }
          .ant-slider-track {
            height: 0.512rem /* 12/23.4375 */;;
          }
          .ant-slider-mark {
            top: 0.768rem /* 18/23.4375 */;
            font-size: 0.512rem /* 12/23.4375 */;
          }
        }
      }
    }
    .share-live-deadline {
      width: 100%;
      text-align: center;
      font-weight: bold;
      font-size: 0.512rem /* 12/23.4375 */;
    }
  }
  .share-live-bottom {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 2.133333rem /* 50/23.4375 */;
    position: absolute;
    bottom: 0;
    .share-live-btn {
      position: relative;
      & > button {
        margin-right: 0.341333rem /* 8/23.4375 */;
      }
      /deep/ .ant-btn {
        height: 1.28rem /* 30/23.4375 */;
        padding: 0 0.64rem /* 15/23.4375 */;
        font-size: 0.597333rem /* 14/23.4375 */;
      }
    }
  }
}
.share-con {
  /deep/ .ant-drawer-content-wrapper {
    height: auto!important;
  }
  /deep/ .ant-drawer-header {
    padding: 0.426667rem /* 10/23.4375 */;
  }
  .share-title {
    font-size: 0.682667rem /* 16/23.4375 */;
    font-weight: bold;
    height: 1.28rem /* 30/23.4375 */;
    line-height: 1.28rem /* 30/23.4375 */;
  }
  .share-out {
    display: flex;
    width: 100%;
    align-items: center;
    div {
      flex: 1;
      text-align: center;
      img {
        width: 2.133333rem /* 50/23.4375 */;
        height: 2.133333rem /* 50/23.4375 */;
        cursor: pointer;
      }
      p {
        font-size: 0.512rem /* 12/23.4375 */;
      }
    }
  }
}
.login-con {
  /deep/ .ant-modal-close-x {
    width: 1.024rem /* 24/23.4375 */;
    height: 1.024rem /* 24/23.4375 */;
    line-height: 1.024rem /* 24/23.4375 */;
    margin-top: 0.213333rem /* 5/23.4375 */;
    i {
      font-size: 0.682667rem /* 16/23.4375 */;
    }
  }
  /deep/ .ant-modal-body {
    padding: 0.64rem /* 15/23.4375 */ 1.066667rem /* 25/23.4375 */;
  }
  .login-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    .login-title {
      width: 100%;
      text-align: center;
      font-size: 0.853333rem /* 20/23.4375 */;
    }
    /deep/ .third-login-btn {
      height: 1.706667rem /* 40/23.4375 */;
      font-size: 0.682667rem /* 16/23.4375 */;
      margin: 0.426667rem /* 10/23.4375 */ 0;
      .svg-icon {
        width: 1.706667rem /* 40/23.4375 */;
        svg {
          width: 1.706667rem /* 40/23.4375 */;
          height: 1.706667rem /* 40/23.4375 */;
        }
        .zoom-icon {
          width: 1.024rem /* 24/23.4375 */;
          height: 1.024rem /* 24/23.4375 */;
        }
      }
      .label {
        font-size: 0.682667rem /* 16/23.4375 */;
      }
    }
  }
}
</style>
