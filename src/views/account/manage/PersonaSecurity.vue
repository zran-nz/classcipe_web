<template>
  <div class='my-full-form-wrapper' id='formRoot'>
    <fixed-form-header>
      <template v-slot:header>
        <form-header
          title='Login & Security'
          :show-share='false'
          :show-collaborate='false'
          :is-preview-mode='true'
          @back='goBack'>
          <template v-slot:back>
            <img @click.stop="$router.push('/')" src="~@/assets/logo/50.png" class='single-logo-img' alt='classcipe' />
          </template>
          <template v-slot:left>
            <a-space :size="5" align="center" @click.stop>
              <label style="cursor: pointer" @click="$router.push('/account/info')">Account Info</label>
              <label for="">></label>
              <label style="font-weight: normal">Login & Security</label>
            </a-space>
          </template>
          <template v-slot:right>
          </template>
        </form-header>
      </template>
    </fixed-form-header>
    <div class="form-content">
      <div class="form-content-item">
        <div class="content-item-title">Login</div>
        <div class="content-item-child">
          <div class="item-child">
            <div class="item-child-title">Password</div>
            <div class="item-child-content">
              <div class="child-content-item">
                <label for="">Last updated {{ getUpdateTime }} ago</label>
                <a-button type="primary" @click="handleReset">update</a-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="form-content-item">
        <div class="content-item-title">Social accounts</div>
        <div class="content-item-child">
          <div class="item-child">
            <div class="item-child-title">Google Account</div>
            <div class="item-child-content">
              <div class="child-content-item">
                <label for="">{{ googleAuth ? googleAuth.email + ' connected' : 'Not connect' }}</label>
                <a-button :loading="loading" :disabled="true || onlyOneAuth" @click="connect('googleAuth')" type="primary" v-if="googleAuth">disconnect</a-button>
                <a-button :loading="loading" @click="connect('googleAuth')" type="primary" v-else>connect</a-button>
              </div>
            </div>
          </div>
          <!-- <div class="item-child">
            <div class="item-child-title">Microsoft Account</div>
            <div class="item-child-content">
              <div class="child-content-item">
                <label for="">{{ mircosoftAuth ? mircosoftAuth.email + ' connected' : 'Not connect' }}</label>
                <a-button :loading="loading" :disabled="onlyOneAuth" @click="disconnect('mircosoftAuth')" type="primary" v-if="mircosoftAuth">disconnect</a-button>
                <a-button :loading="loading" @click="connect('mircosoftAuth')" type="primary" v-else>connect</a-button>
              </div>
            </div>
          </div> -->
          <div class="item-child">
            <div class="item-child-title">Zoom Account</div>
            <div class="item-child-content">
              <div class="child-content-item">
                <label for="">{{ zoomAuth ? zoomAuth.email + ' connected' : 'Not connect' }}</label>
                <a-button :loading="loading" :disabled="onlyOneAuth" @click="disconnect('zoomAuth')" type="primary" v-if="zoomAuth">disconnect</a-button>
                <a-button :loading="loading" @click="connect('zoomAuth')" type="primary" v-else>connect</a-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <a-modal
      v-model='passwordVis'
      destroyOnClose
      title='Reset Password'
      width='600px'
      :footer="null"
    >
      <reset-password @save="handleClose"/>
    </a-modal>
  </div>
</template>

<script>
import { USER_MODE } from '@/const/common'
import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'
import { ZoomAuthMixin } from '@/mixins/ZoomAuthMixin'
import { GoogleAuthMixin } from '@/mixins/GoogleAuthMixin'
import { MicrosoftAuthMixin } from '@/mixins/MicrosoftAuthMixin'

import FixedFormHeader from '@/components/Common/FixedFormHeader'
import FormHeader from '@/components/FormHeader/FormHeader'
import CustomTextButton from '@/components/Common/CustomTextButton'
import ResetPassword from './persona/ResetPassword.vue'

import { mapState } from 'vuex'
import moment from 'moment'

const { debounce } = require('lodash-es')

export default {
  name: 'PersonaSecurity',
  mixins: [
    UserModeMixin,
    CurrentSchoolMixin,
    GoogleAuthMixin,
    ZoomAuthMixin,
    MicrosoftAuthMixin
  ],
  components: {
    FixedFormHeader,
    FormHeader,
    CustomTextButton,
    ResetPassword
  },
  data() {
    return {
      USER_MODE: USER_MODE,
      loading: false,
      queryParams: {
        keywords: ''
      },
      datas: [],
      debounceInit: null,
      passwordVis: false
    }
  },
  created() {
    this.initData()
    this.debounceInit = debounce(this.initData, 300)
  },
  computed: {
    ...mapState({
      userMode: state => state.app.userMode,
      currentSchool: state => state.user.currentSchool,
      info: state => state.user.info
    }),
    getUpdateTime() {
      if (this.info) {
        const passwordUpdateTime = this.info.passwordUpdateTime || this.info.createTime
        const diffDays = moment().diff(moment(passwordUpdateTime), 'days')
        return diffDays + ' days'
      }
      return ''
    },
    mircosoftAuth() {
      return (this.info && this.info.mircosoftAuth && this.info.mircosoftAuth.email) ? this.info.mircosoftAuth : null
    },
    googleAuth() {
      return (this.info && this.info.googleAuth && this.info.googleAuth.email) ? this.info.googleAuth : null
    },
    zoomAuth() {
      return (this.info && this.info.zoomAuth && this.info.zoomAuth.email) ? this.info.zoomAuth : null
    },
    onlyOneAuth() {
      const nums = [this.mircosoftAuth, this.googleAuth, this.zoomAuth].filter(auth => auth === null).length
      return nums === 2
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    handleSchoolChange(currentSchool) {
      if (this.userMode === USER_MODE.SCHOOL) {
        this.debounceInit()
      }
    },
    handleModeChange(userMode) {
      // 模式切换，个人还是学校 个人接口
      this.debounceInit()
    },
    initData() {
      this.loadData()
    },
    loadData() {

    },
    handleReset() {
      this.passwordVis = true
    },
    handleClose() {
      this.loadData()
    },
    async disconnect(tokenKey) {
      if (tokenKey === 'zoomAuth') {
        this.loading = true
        await this.unbindZoomAuth()
        this.loading = false
      } else if (tokenKey === 'googleAuth') {
        this.loading = true
        await this.unbindGoogleAuth()
        this.loading = false
      } else if (tokenKey === 'mircosoftAuth') {
        this.loading = true
        await this.unbindMicrosoftAuth()
        this.loading = false
      }
    },
    connect(tokenKey) {
      if (tokenKey === 'zoomAuth') {
        this.goToZoomAuth()
      } else if (tokenKey === 'googleAuth') {
        this.goToGoogleAuth()
      } else if (tokenKey === 'mircosoftAuth') {
        this.goToMicrosoftAuth()
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import "~@/components/index.less";
.cc-fixed-form-header {
  height: 60px;
}
.form-content {
  margin-top: 60px;
  height: calc(100vh - 60px);
  padding: 60px 60px;
  transition: all 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  overflow: auto;
  .form-content-item {
    display: flex;
    flex-direction: column;
    margin-bottom: 30px;
    .content-item-title {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 30px;
    }
    .content-item-child {
      display: flex;
      flex-direction: column;
      .item-child {
        margin-bottom: 20px;
        .item-child-title {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 15px;
        }
        .item-child-content {
          display: flex;
          flex-direction: column;
          .child-content-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            font-size: 14px;;
            border-bottom: 1px solid #dfdfdf;
            &:first-child {
              border-top: 1px solid #dfdfdf;
            }
          }
        }
      }
    }
  }
}

</style>
