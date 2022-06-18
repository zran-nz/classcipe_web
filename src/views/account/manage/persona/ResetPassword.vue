<template>
  <a-form-model
    layout="horizontal"
    :model="formModel"
    v-bind="formItemLayout"
    :rules="validatorRules"
    ref="form">
    <a-form-model-item label="Old Password" prop="password">
      <a-input autocomplete="off" :required="true" type="password" v-model="formModel.password" placeholder="input password" />
    </a-form-model-item >
    <a-form-model-item label="New Password" prop="newPassword">
      <a-input autocomplete="off" type="password" v-model="formModel.newPassword" placeholder="input password" />
    </a-form-model-item >
    <a-form-model-item label="Confirm Password" prop="confirmPassword">
      <a-input autocomplete="off" type="password" v-model="formModel.confirmPassword" placeholder="input password" />
    </a-form-model-item >
    <a-form-model-item :wrapperCol="{offset: 6, span: 12}" label="">
      <a-button type="primary">update</a-button>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
export default {
  name: 'ResetPassword',
  data() {
    const reg = /^(?=.*[a-z])(?=.*[A-Z])[^]{8,}$/
    const validateRemote = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('Please input the password'))
      } else {
        // 调用封装了的异步效验方法，
        // checkPassword(value).then(response => {
        //   if (response.data) {
        //     callback(new Error('Incorrect password'))
        //   } else {
        //     callback()
        //   }
        // })
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input the password'))
      } else if (!reg.test(value)) {
        callback(new Error('Your password needs to :Include both lower and upper case characters; Be at least 8 characters long. '))
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
  }
}
</script>

<style scoped>

</style>
