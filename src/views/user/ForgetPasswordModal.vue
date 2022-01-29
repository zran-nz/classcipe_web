<template>
  <a-modal :footer="null" :visible="visible" @cancel="handleCancel" class="user-forget">
    <div class="user-forget-wrapper">
      <div class="title">Reset Your Password</div>

      <div class="desc">
        Enter the <span>Email Address</span> you used to create an account,and we will send you instructions on how to
        change your password.
      </div>

      <a-form :form="form" @submit="handleSubmit">
        <a-form-item class="form-email">
          <a-input
            size="large"
            type="text"
            :placeholder="$t('user.login.username.placeholder')"
            v-decorator="[
              'username',
              {
                rules: [
                  {
                    required: true,
                    type: 'email',
                    message: 'Please enter a valid email address',
                  },
                ],
                validateTrigger: ['change', 'blur'],
              },
            ]"
          ></a-input>
        </a-form-item>

        <a-form-item class="form-submit">
          <a-button type="primary" block :loading="loading" size="large" html-type="submit">Submit</a-button>
        </a-form-item>
      </a-form>

      <div class="desc">
        Forget your email? Contact us at <a href="mailto:support@Classcipe.com">support@Classcipe.com</a>
      </div>
    </div>
  </a-modal>
</template>

<script>
import { forgePassword } from '@/api/login'

export default {
  components: {},
  data() {
    return {
      form: this.$form.createForm(this),
      visible: false,
      loading: false
    }
  },
  created() {},
  methods: {
    show() {
      this.visible = true
    },
    handleCancel() {
      this.visible = false
    },
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields(async (err, values) => {
        if (!err) {
          this.loading = true
          console.log('Received values of form: ', values)
          const params = {
            ...values
          }
          const res = await forgePassword(params)
          if (res.success) {
            this.loading = false
            this.$message.success('send email success')
            this.visible = false
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
.user-forget {
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
.user-forget {
  width: 520px;
  min-width: 520px;

  .user-forget-wrapper {
    padding: 24px;
  }

  .form-submit {
    button {
      border-radius: 8px;
    }
  }

  .title {
    margin-bottom: 10px;
    font-size: 18px;
    color: #000;
    font-family: FZCuYuan-M03S;
    font-weight: 800;
    text-align: center;
  }
  .desc {
    margin-bottom: 20px;
    span {
      color: @primary-color;
    }
  }
}
</style>
