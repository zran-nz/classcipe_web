<template>
  <div class="user-register">
    <div class="steps-action" v-if="currentStep === 1" @click="back">
      <img src="~@/assets/icons/user/morfanhui@2x.png" class="logo" style="width: 18px" />
      <span>Back</span>
    </div>

    <div class="steps-content">
      <div class="role" v-if="currentStep === 0">
        <div>
          <!-- <div><img src="~@/assets/logo/logo2.png" class="logo" /></div>
          <div><img src="~@/assets/logo/Lasscipe-dark.png" class="name" /></div> -->
          <div class="desc">Choose your role to enter</div>
        </div>
        <div class="role-item" :class="{ selected: selectedRole === 2 }" @click="handleSelectRole(2)">
          <div class="role-info">
            <img src="~@/assets/icons/role/teacher@2x.png" class="role-img" />
            <div>
              <div class="role-name">I am a teacher/admin/expert</div>
            </div>
          </div>
          <div class="arrow">
            <span></span>
          </div>
        </div>
        <div class="role-item" :class="{ selected: selectedRole === 4 }" @click="handleSelectRole(4)">
          <div class="role-info">
            <img src="~@/assets/icons/role/student@2x.png" class="role-img" />
            <div>
              <div class="role-name">I am a Student</div>
            </div>
          </div>
          <div class="arrow">
            <span></span>
          </div>
        </div>
      </div>
      <div class="register" v-if="currentStep === 1">
        <!-- 老师注册 -->
        <div v-if="selectedRole === 2">
          <div>
            <!-- <div><img src="~@/assets/logo/logo2.png" class="logo" /></div>
            <div><img src="~@/assets/logo/Lasscipe-dark.png" class="name" /></div> -->
            <div class="desc">Sign Up</div>
            <div class="desc2">Sign Up to Classcipe using your Google account</div>
            <div class="desc2">
              Already have an account? |
              <span><router-link :to="{ path: teacherLoginPath }">Sign In</router-link></span>
            </div>
          </div>
          <div class="third-login-wrapper">
            <third-login-button
              icon="googleIcon"
              :label="$t('user.login.SignUpWithGoogle')"
              @click.native="thirdSignIn('google', 'teacher')"
            />
          </div>
          <div class="info">
            Sign in or sign up means you agree to Classcipe's
            <span><a href="https://www.classcipe.com/term.html" target="_blank">Terms of service</a></span>
            and
            <span><a href="https://www.classcipe.com/policy.html" target="_blank">Privacy Policy</a></span>
          </div>
        </div>
        <!-- 学生注册 -->
        <div v-if="selectedRole === 4">
          <div>
            <!-- <div><img src="~@/assets/logo/logo2.png" class="logo" /></div>
            <div><img src="~@/assets/logo/Lasscipe-dark.png" class="name" /></div> -->
            <div class="desc">Sign Up</div>
            <div class="desc2">
              Already have an account? |
              <span><router-link :to="{ path: studentLoginPath }">Sign In</router-link></span>
            </div>
          </div>
          <a-form :form="form" class="register-form" @submit="handleSubmit">
            <a-form-item class="form-name">
              <a-input
                size="large"
                type="text"
                :placeholder="$t('user.register.name.placeholder')"
                v-decorator="[
                  'name',
                  {
                    rules: [
                      {
                        required: true,
                        message: $t('user.register.name.required'),
                      },
                    ],
                    validateTrigger: ['change', 'blur'],
                  },
                ]"
              ></a-input>
            </a-form-item>

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
                    rules: [
                      { required: true, message: $t('user.password.required') },
                      {
                        validator: handlePassword,
                      },
                    ],
                    validateTrigger: ['change', 'blur'],
                  },
                ]"
              ></a-input-password>
            </a-form-item>

            <!-- <div class="forget-password">
            <a-button type="link">Forget password</a-button>
          </div> -->

            <a-form-item class="form-sumit">
              <a-button type="primary" block :loading="loading" size="large" html-type="submit">Sign Up</a-button>
            </a-form-item>

            <div class="third-login-wrapper">
              <third-login-button
                icon="googleIcon"
                :label="$t('user.login.SignUpWithGoogle')"
                @click.native="thirdSignIn('google', 'student')"
              />
            </div>
          </a-form>
          <div class="info">
            Sign in or sign up means you agree to Classcipe's
            <span><a href="https://www.classcipe.com/term.html" target="_blank">Terms of service</a></span>
            and
            <span><a href="https://www.classcipe.com/policy.html" target="_blank">Privacy Policy</a></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { deviceMixin } from '@/store/device-mixin'
import ThirdLoginButton from '@/components/Button/ThirdLoginButton'
import { getThirdAuthURL, thirdAuthCallbackUrl } from '@/api/thirdAuth'
import { mapActions } from 'vuex'

export default {
  name: 'Register',
  components: {
    ThirdLoginButton
  },
  mixins: [deviceMixin],
  data() {
    return {
      loading: false,
      currentStep: 0,
      selectedRole: null,
      form: this.$form.createForm(this),
      loginPath: '/user/login',
      teacherLoginPath: '/user/login?role=teacher',
      studentLoginPath: '/user/login?role=student',
      inviteCode: ''
    }
  },
  created() {
    const paramSearch = new URLSearchParams(window.location.search)
    const inviteCode = paramSearch.get('inviteCode')
    if (inviteCode) {
      this.inviteCode = inviteCode
      this.loginPath = `/user/login?inviteCode=${inviteCode}`
      this.teacherLoginPath = `/user/login?role=teacher&inviteCode=${inviteCode}`
      this.studentLoginPath = `/user/login?role=student&inviteCode=${inviteCode}`
    }
  },
  computed: {},
  methods: {
    ...mapActions(['SignUp']),

    back() {
      this.currentStep = 0
    },
    next() {
      this.currentStep = 1
    },
    handleSelectRole(role) {
      this.selectedRole = role
      this.next()
    },
    thirdSignIn(source, role) {
      console.log('thirdSignIn', source)
      let url = getThirdAuthURL(source)
      url += `?role=${role}`
      if (this.inviteCode) {
        url += `&inviteCode=${this.inviteCode}`
      }
      url += `&callbackUrl=`
      url += thirdAuthCallbackUrl
      console.log('full auth url ', url)
      window.location.href = url
    },
    handleSubmit(e) {
      e.preventDefault()
      const {
        form: { validateFields },
        // $router
        SignUp
      } = this
      validateFields({ force: true }, (err, values) => {
        if (!err) {
          this.loading = true
          console.log('signup submit', values)
          const signUpParams = {
            nickname: values.name,
            password: values.password,
            username: values.email,
            role: this.selectedRole
          }
          if (this.inviteCode) {
            signUpParams.inviteCode = this.inviteCode
          }
          SignUp(signUpParams)
            .then(res => this.loginSuccess(res))
            .catch(err => this.requestFailed(err))
            .finally(() => {
              this.loading = false
            })
        }
      })
    },
    handleEmail(rule, value, callback) {
      if (!value) {
        callback(new Error(this.$t('user.email.required')))
        return
      }
      const reg = /^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/
      if (!reg.test(value)) {
        callback(new Error(this.$t('user.email.required')))
        return
      }
      if (this.selectedRole === 2 && value && !value.endsWith('@gmail.com')) {
        callback(new Error('please use your google email'))
      } else {
        callback()
      }
    },
    handlePassword(rule, value, callback) {
      if (value && value.length < 6) {
        callback(new Error(this.$t('user.password.strength.msg')))
      } else {
        callback()
      }
    },
    loginSuccess(res) {
      this.$message.success(res.message)
      this.$store
        .dispatch('GetInfo')
        .then(response => {
          if (this.$store.getters.currentRole) {
            this.$router.push(this.$store.getters.defaultRouter)
          } else {
            this.$router.push({ path: this.loginPath })
          }
        })
        .catch(e => {
          this.$message.error('GetInfo Failed,' + e)
        })
    },
    requestFailed(err) {
      this.$message.error(err.message)
    }
  }
}
</script>
<style lang="less">
.user-register {
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
  .form-name {
    .ant-form-item-children {
      &::after {
        content: 'Name';
      }
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
}
</style>
<style lang="less" scoped>
.user-register {
  width: 520px;
  min-width: 520px;
  margin: 0 auto;
  border: 1px solid #e8e8e8;
  border-radius: 20px;
  padding: 0px 50px;
  background-color: #fff;
  position: relative;

  .steps-action {
    position: absolute;
    top: 30px;
    left: 50px;
    cursor: pointer;
    img {
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
      color: #000;
      font-size: 16px;
      line-height: 18px;
      font-family: Leelawadee UI;
      font-weight: 800;
      margin-left: 6px;
    }
  }
  .steps-content {
    .role {
      padding: 82px 0px 96px;
      text-align: center;
      .logo {
        margin-bottom: 9px;
      }
      .name {
        margin-bottom: 17px;
      }
      .desc {
        margin-bottom: 61px;
        font-size: 16px;
        color: #000;
        font-family: FZCuYuan-M03S;
        font-weight: 800;
      }
      .role-item {
        &:hover {
          border: 1px solid @primary-color;
        }
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 80px;
        border: 1px solid #d3d7ec;
        border-radius: 10px;
        margin-bottom: 20px;
        justify-content: space-between;
        padding: 0px 37px 0px 15px;
        cursor: pointer;
        .role-info {
          display: flex;
          flex-direction: row;
          align-items: center;
          text-align: left;
          .role-img {
            width: 66px;
            height: 66px;
            margin-right: 15px;
          }
          .role-name {
            font-size: 16px;
            font-family: ZCuYuan-M03S;
            font-weight: 800;
            color: #000;
          }
          .role-desc {
            font-size: 14px;
            color: #000;
          }
        }
        .arrow {
          background-color: #828282;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          padding-right: 3px;
          span {
            display: inline-block;
            margin: 2px;
            border-top: 1px solid #fff;
            border-right: 1px solid #fff;
            width: 8px;
            height: 8px;
            transform: rotate(45deg);
          }
        }
      }
      .selected {
        border: 1px solid @primary-color;
        .arrow {
          background-color: @primary-color;
        }
      }
    }
    .register {
      padding: 40px 0px 55px;
      text-align: center;
      .logo {
        margin-bottom: 5px;
      }
      .name {
        margin-bottom: 10px;
      }
      .desc {
        margin-top: 10px;
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
      .form-sumit {
        button {
          border-radius: 8px;
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
}
</style>
