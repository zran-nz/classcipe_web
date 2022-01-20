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
              Don't have an account? | <span><router-link :to="{ path: '/user/register' }">Sign Up</router-link></span>
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
              Don't have an account? | <span><router-link :to="{ path: '/user/register' }">Sign Up</router-link></span>
            </div>
          </div>
          <a-form :form="form" class="login-form" @submit="handleSubmit">
            <a-form-item class="form-email">
              <a-input
                size="large"
                type="text"
                :placeholder="$t('user.register.email.placeholder')"
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
                :placeholder="$t('user.register.password.placeholder')"
                v-decorator="[
                  'password',
                  {
                    rules: [{ required: true, message: $t('user.password.required') }],
                    validateTrigger: ['change', 'blur'],
                  },
                ]"
              ></a-input-password>
            </a-form-item>

            <!-- <div class="forget-password">
          <a-button type="link">Forget password</a-button>
        </div> -->

            <a-form-item class="form-submit">
              <a-button type="primary" block :loading="loading" size="large" html-type="submit">Sign In</a-button>
            </a-form-item>
          </a-form>

          <div class="or">
            <span>- or -</span>
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
  </div>
</template>

<script>
import TwoStepCaptcha from '@/components/tools/TwoStepCaptcha'
import ThirdLoginButton from '@/components/Button/ThirdLoginButton'
import { mapActions } from 'vuex'
import { getThirdAuthURL, thirdAuthCallbackUrl } from '@/api/thirdAuth'

export default {
  components: {
    TwoStepCaptcha,
    ThirdLoginButton
  },
  data() {
    return {
      loading: false,
      defaultActiveKey: 'teacher',
      // customActiveKey: 'tab1',
      // loginBtn: false,
      // // login type: 0 email, 1 username, 2 telephone
      // loginType: 0,
      // isLoginError: false,
      // requiredTwoStepCaptcha: false,
      // stepCaptchaVisible: false,
      form: this.$form.createForm(this)
      // state: {
      //   time: 60,
      //   loginBtn: false,
      //   // login type: 0 email, 1 username, 2 telephone
      //   loginType: 0,
      //   smsSendBtn: false
      // }
    }
  },
  created() {
    const paramSearch = new URLSearchParams(window.location.search)
    const role = paramSearch.get('role')
    if (role) {
      this.defaultActiveKey = role
    }
  },
  methods: {
    ...mapActions(['Login', 'Logout']),

    thirdSignIn(source, role) {
      console.log('thirdSignIn', source)
      let url = getThirdAuthURL(source)
      url += `?role=${role}&callbackUrl=`
      url += thirdAuthCallbackUrl
      console.log('full auth url ', url)
      window.location.href = url
    },
    // handler
    handleUsernameOrEmail(rule, value, callback) {
      const { state } = this
      const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
      if (regex.test(value)) {
        state.loginType = 0
      } else {
        state.loginType = 1
      }
      callback()
    },
    handleTabClick(key) {
      this.customActiveKey = key
      // this.form.resetFields()
    },
    handleSubmit(e) {
      e.preventDefault()
      const {
        form: { validateFields },
        // state,
        // customActiveKey,
        Login
      } = this

      validateFields({ force: true }, (err, values) => {
        if (!err) {
          this.loading = true
          console.log('login form', values)
          // loginParams.password = md5(values.password)
          Login({
            username: values.email,
            password: values.password
          })
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
          if (this.$store.getters.currentRole) {
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
    }
  }
}
</script>

<style lang="less">
.user-login {
  .ant-form-item-children {
    &::after {
      position: absolute;
      top: -40px;
      left: 24px;
      content: '';
    }
    input {
      height: 80px;
      border-radius: 12px;
      padding: 30px 24px 0px;
    }
  }
  .form-email {
    .ant-form-item-children {
      &::after {
        content: 'Email';
      }
    }
  }
  .form-password {
    .ant-form-item-children {
      &::after {
        content: 'Password';
      }
      .ant-input-suffix {
        top: 70%;
      }
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
    .forget-password {
      text-align: right;
      button {
        padding: 0;
        position: relative;
        bottom: 20px;
      }
    }
    .form-submit {
      margin-bottom: 0px;
      button {
        border-radius: 8px;
      }
    }
    .or{
      margin: 10px 0px;
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
