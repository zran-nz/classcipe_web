<template>
  <div class="user-login">
    <a-tabs type="card" :defaultActiveKey="defaultActiveKey">
      <a-tab-pane key="teacher" tab="Teacher">
        <div class="login">
          <div>
            <!-- <div><img src="~@/assets/logo/logo2.png" class="logo" /></div>
            <div><img src="~@/assets/logo/Lasscipe-dark.png" class="name" /></div> -->
            <div class="desc">Sign In</div>
            <div class="desc2">
              Don't have an account? | <span><router-link :to="{ path: registerPath }">Sign Up</router-link></span>
            </div>
          </div>

          <div class="third-login-wrapper">
            <third-login-button
              icon="googleIcon"
              :label="$t('user.login.loginWithGoogle')"
              @click.native="thirdSignIn('google', 'teacher')"
            />
          </div>

          <!-- <div class="info">
            Sign in or sign up means you agree to Classcipe's
            <span><a href="https://www.classcipe.com/term.html" target="_blank">Terms of service</a></span>
            and
            <span><a href="https://www.classcipe.com/policy.html" target="_blank">Privacy Policy</a></span>
          </div> -->
        </div>
      </a-tab-pane>
      <a-tab-pane key="student" tab="Student">
        <div class="login">
          <div>
            <!-- <div><img src="~@/assets/logo/logo2.png" class="logo" /></div>
            <div><img src="~@/assets/logo/Lasscipe-dark.png" class="name" /></div> -->
            <div class="desc">Sign In</div>
            <div class="desc2">
              Don't have an account? | <span><router-link :to="{ path: registerPath }">Sign Up</router-link></span>
            </div>
          </div>

          <a-form :form="form" class="login-form" @submit="handleSubmit">
            <a-form-item class="form-email">
              <a-input
                size="large"
                type="text"
                :placeholder="$t('user.login.username.placeholder')"
                v-decorator="[
                  'email',
                  {
                    rules: [
                      {
                        required: true,
                        type: 'email',
                        message: $t('user.email.required'),
                      },
                    ],
                    validateTrigger: ['change', 'blur'],
                  },
                ]"
              ></a-input>
            </a-form-item>

            <a-form-item class="form-password">
              <a-input-password
                size="large"
                :placeholder="$t('user.login.password.placeholder')"
                v-decorator="[
                  'password',
                  {
                    rules: [{ required: true, message: $t('user.password.required') }],
                    validateTrigger: ['change', 'blur'],
                  },
                ]"
              ></a-input-password>
            </a-form-item>

            <a-form-item class="form-btn">
              <a-checkbox defaultChecked @change="handleChange">Remember me</a-checkbox>
              <a @click="handleForget" class="forget-password">Forget password</a>
              <a-button type="primary" block :loading="loading" size="large" html-type="submit"> Log In </a-button>
            </a-form-item>
          </a-form>

          <div class="or">
            <div class="line"></div>
            <div class="text">OR</div>
            <div class="line"></div>
          </div>

          <div class="third-login-wrapper">
            <third-login-button
              icon="googleIcon"
              :label="$t('user.login.loginWithGoogle')"
              @click.native="thirdSignIn('google', 'student')"
            />
          </div>
          <!-- <div class="info">
            Sign in or sign up means you agree to Classcipe's
            <span><a href="https://www.classcipe.com/term.html" target="_blank">Terms of service</a></span>
            and
            <span><a href="https://www.classcipe.com/policy.html" target="_blank">Privacy Policy</a></span>
          </div> -->
        </div>
      </a-tab-pane>
    </a-tabs>
    <forget-password-modal ref="modal" />
  </div>
</template>

<script>
import TwoStepCaptcha from '@/components/tools/TwoStepCaptcha'
import ThirdLoginButton from '@/components/Button/ThirdLoginButton'
import ForgetPasswordModal from './ForgetPasswordModal.vue'
import { mapActions } from 'vuex'
import { getThirdAuthURL, thirdAuthCallbackUrl } from '@/api/thirdAuth'
import { NOT_REMEMBER_ME } from '@/store/mutation-types'
import storage from 'store'

export default {
  components: {
    TwoStepCaptcha,
    ThirdLoginButton,
    ForgetPasswordModal
  },
  data() {
    return {
      loading: false,
      defaultActiveKey: 'teacher',
      form: this.$form.createForm(this),
      registerPath: '/user/register',
      callBackUrl: ''
    }
  },
  created() {
    const paramSearch = new URLSearchParams(window.location.search)
    const role = paramSearch.get('role')
    const callBackUrl = paramSearch.get('callBackUrl')
    const redirect = paramSearch.get('redirect')
    if (redirect) {
      this.registerPath = `/user/register?redirect=${redirect}`
    }
    if (role) {
      this.defaultActiveKey = role
    }
    if (callBackUrl) {
      this.callBackUrl = callBackUrl
    }
  },
  methods: {
    ...mapActions(['Login', 'Logout']),

    thirdSignIn(source, role) {
      if (role === 'teacher') {
        storage.set(NOT_REMEMBER_ME, false)
      }
      console.log('thirdSignIn', source)
      let url = getThirdAuthURL(source)
      url += `?role=${role}`
      url += `&callbackUrl=`
      url += thirdAuthCallbackUrl
      console.log('full auth url ', url)
      window.location.href = url
    },
    handleSubmit(e) {
      e.preventDefault()
      const {
        form: { validateFields },
        Login
      } = this

      validateFields({ force: true }, (err, values) => {
        if (!err) {
          this.loading = true
          console.log('login form', values)
          const loginParams = {
            username: values.email,
            password: values.password
          }
          Login(loginParams)
            .then(res => this.loginSuccess(res))
            .catch(err => this.requestFailed(err))
            .finally(() => {
              this.loading = false
            })
        }
      })
    },
    loginSuccess(res) {
      this.$message.success(res.message)
      this.$store
        .dispatch('GetInfo')
        .then(response => {
          if (this.callBackUrl) {
            window.location.href = this.callBackUrl + '?token=' + response.result.token
          } else if (this.$store.getters.currentRole) {
            this.$router.push(this.$store.getters.defaultRouter)
          } else {
            this.$router.push({ path: '/user/login' })
          }
        })
        .catch(e => {
          this.$message.error('GetInfo Failed,' + e)
        })
      // check res.homePage define, set $router.push name res.homePage
      // Why not enter onComplete
      /*
      this.$router.push({ name: 'analysis' }, () => {
        console.log('onComplete')
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`
        })
      })
      */
      // this.$router.push({ path: '/' })
    },
    requestFailed(err) {
      this.$message.error(err.message)

      // this.$notification['error']({
      //   message: 'error',
      //   description: ((err.response || {}).data || {}).message || 'Error',
      //   duration: 4
      // })
    },
    handleForget() {
      this.$refs.modal.show()
    },
    handleChange(e) {
      const checked = e.target.checked
      storage.set(NOT_REMEMBER_ME, !checked)
    }
  }
}
</script>

<style lang="less">
.user-login {
  .ant-form-item-children {
    // &::after {
    //   position: absolute;
    //   top: -40px;
    //   left: 24px;
    //   content: '';
    // }
    input {
      height: 60px;
      border-radius: 8px;
      padding: 0px 12px 0px;
    }
  }
  .form-email {
    .ant-form-item-children {
      // &::after {
      //   content: 'Email';
      // }
    }
  }
  .form-password {
    .ant-form-item-children {
      // &::after {
      //   content: 'Password';
      // }
      // .ant-input-suffix {
      //   top: 70%;
      // }
    }
  }
  .ant-tabs {
    .ant-tabs-bar {
      margin: 0;
      border-bottom: none;
    }
  }
}
</style>
<style lang="less" scoped>
.user-login {
  margin: 0 auto;
  width: 520px;
  min-width: 520px;

  .login {
    background-color: #fff;
    padding: 40px 50px 55px;
    border: 1px solid #e8e8e8;
    border-top-right-radius: 20px;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    text-align: center;
    .login-form {
      text-align: left;
    }
    .logo {
      margin-bottom: 5px;
    }
    .name {
      margin-bottom: 10px;
    }
    .desc {
      margin-bottom: 10px;
      font-size: 24px;
      color: #000;
      font-family: FZCuYuan-M03S;
      font-weight: 800;
    }
    .desc2 {
      margin-bottom: 20px;
    }
    .form-btn {
      .forget-password {
        float: right;
        padding: 0;
      }
      button {
        border-radius: 8px;
      }
    }
    .or {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      margin: 20px 0px;
      .line {
        border-top: 1px solid rgba(0, 0, 0, 0.08);
        height: 1px;
        width: 40px;
      }
      .text {
        padding: 2px 16px;
        border-radius: 20px;
        border: 1px solid rgba(0, 0, 0, 0.08);
      }
    }
    .third-login-wrapper {
      margin-bottom: 20px;
    }
    .info {
      text-align: left;
    }
  }
}
</style>
