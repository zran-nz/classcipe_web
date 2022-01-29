<template>
  <div class="user-reset">
    <div class="title">Please Set Your New Password</div>
    <a-form :form="form" @submit="handleSubmit">
      <a-form-item class="form-password">
        <a-input-password
          size="large"
          type="text"
          placeholder="Password"
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
      <a-form-item class="form-password">
        <a-input-password
          size="large"
          type="text"
          placeholder="Confirm Password"
          v-decorator="[
            'password2',
            {
              rules: [
                { required: true, message: $t('user.password.required') },
                {
                  validator: handlePassword2,
                },
              ],
              validateTrigger: ['change', 'blur'],
            },
          ]"
        ></a-input-password>
      </a-form-item>
      <a-form-item class="form-submit">
        <a-button type="primary" block :loading="loading" size="large" html-type="submit">Submit</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { resetPassword } from '@/api/login'

export default {
  components: {},
  data() {
    return {
      loading: false,
      form: this.$form.createForm(this),
      code: undefined
    }
  },
  created() {
    const paramSearch = new URLSearchParams(window.location.search)
    const code = paramSearch.get('code')
    this.code = code
  },
  methods: {
    handlePassword(rule, value, callback) {
      if (value && value.length < 6) {
        callback(new Error('Minimum 6 characters, no common words.'))
      } else {
        callback()
      }
    },
    handlePassword2(rule, value, callback) {
      if (value && value.length < 6) {
        callback(new Error('Minimum 6 characters, no common words.'))
      } else {
        callback()
      }
    },
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields(async (err, values) => {
        if (!err) {
          this.loading = true
          console.log('Received values of form: ', values)
          const params = {
            code: this.code,
            password: values.password
          }
          const res = await resetPassword(params)
          if (res.success) {
            this.loading = false
            this.$message.success('password reset success!')
            this.$router.replace({ path: '/user/login' })
          } else {
            this.loading = false
            this.$message.error(res.message)
          }
        }
      })
    }
  }
}
</script>

<style lang="less">
.user-reset {
  .ant-form-item-children {
    input {
      height: 60px;
      border-radius: 8px;
      padding: 0px 12px 0px;
    }
  }
}
</style>
<style lang="less" scoped>
.user-reset {
  width: 520px;
  min-width: 520px;
  margin: 0 auto;
  border: 1px solid #e8e8e8;
  border-radius: 20px;
  padding: 24px 50px;
  background-color: #fff;
  position: relative;

  .title {
    font-size: 18px;
    color: #000;
    font-family: FZCuYuan-M03S;
    font-weight: 800;
    text-align: center;
    margin-bottom: 40px;
  }
  .form-submit {
    button {
      border-radius: 8px;
    }
  }
}
</style>
