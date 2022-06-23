<template>
  <a-form-model
    layout="horizontal"
    :model="formModel"
    v-bind="formItemLayout"
    :rules="validatorRules"
    ref="form">
    <a-form-model-item v-if="needOld" label="Old Password" prop="password">
      <a-input autocomplete="off" :required="true" type="password" v-model="formModel.password" placeholder="input password" />
    </a-form-model-item >
    <a-form-model-item label="New Password" prop="newPassword">
      <a-input autocomplete="off" type="password" v-model="formModel.newPassword" placeholder="input password" />
    </a-form-model-item >
    <a-form-model-item label="Confirm Password" prop="confirmPassword">
      <a-input autocomplete="off" type="password" v-model="formModel.confirmPassword" placeholder="input password" />
    </a-form-model-item >
    <a-form-model-item :wrapperCol="{offset: 6, span: 12}" label="">
      <a-button type="primary" @click="handleSave">update</a-button>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
import { CheckPassword } from '@/api/login'
export default {
  name: 'ResetPassword',
  props: {
    needOld: {
      type: Boolean,
      default: true
    }
  },
  data() {
    const reg = /^(?=.*[a-zA-Z])(?=.*[0-9])[^]{8,}$/
    const validateRemote = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('Please input the password'))
      } else {
        // 调用封装了的异步效验方法，
        CheckPassword({
          password: value
        }).then(response => {
          if (response.result !== 'Success') {
            callback(new Error('Incorrect password'))
          } else {
            callback()
          }
        })
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input the password'))
      } else if (!reg.test(value)) {
        callback(new Error('The password must be a combination of letters and numbers, and it must be 8 characters or more.'))
      } else {
        if (this.formModel.confirmPassword !== '') {
          this.$refs.form.validateField('confirmPassword')
        }
        callback()
      }
    }
    const validatePassConfirm = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input the password again'))
      } else if (value !== this.formModel.newPassword) {
        callback(new Error('Passwords did not match!'))
      } else {
        callback()
      }
    }
    return {
      formModel: {
        password: '',
        newPassword: '',
        confirmPassword: ''
      },
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
      },
      validatorRules: {
        password: [{ required: true, trigger: 'change', message: 'Please input the password' }, { validator: validateRemote, trigger: 'blur' }],
        newPassword: [{ validator: validatePass, trigger: 'change' }],
        confirmPassword: [{ validator: validatePassConfirm, trigger: 'change' }]
      }
    }
  },
  methods: {
    handleSave() {
      this.$refs.form.validate(valid => {
        if (valid) {

        }
      })
    }
  }
}
</script>

<style scoped>

</style>
