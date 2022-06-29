<template>
  <a-modal
    v-model='selVis'
    destroyOnClose
    title='Teacher Verification'
    width='500px'
    :maskClosable="false"
    :zIndex="2000"
    :confirmLoading="loading"
    @cancel="handleCancel"
    :footer="null">
    <div class="teacher-verification-tip">
      <div class="verification-tip-title">
        <a-icon type="check-circle" />
        <label for="">Would you like to complete the verification so that you will be shown as a verified teacher on the content page in Classcipe library?</label>
      </div>
      <div class="verification-tip-opt">
        <a-button type="primary" @click="handleConfirm">Yes</a-button>
        <a-button style="margin-left: 20px" type="" @click="handleCancel">No now</a-button>
      </div>
      <div class="verification-tip-foot">
        <a-checkbox v-model="remember" @change="handleRemember">Please do not show this again</a-checkbox>
      </div>
    </div>
  </a-modal>
</template>

<script>
import { TEACHER_SECURITY_NOT_SHOW } from '@/store/mutation-types'
import { setCookie } from '@/utils/util'
export default {
  name: 'VerificationTip',
  data() {
    return {
      selVis: false,
      loading: false,
      remember: false
    }
  },
  mounted() {
  },
  methods: {
    handleRemember(e) {
      setCookie(TEACHER_SECURITY_NOT_SHOW, e.target.checked || '')
    },
    doCreate() {
      this.selVis = true
    },
    handleConfirm() {
      this.selVis = false
      this.$router.push('/manage/verification')
    },
    handleCancel() {
      this.selVis = false
      this.$emit('continue')
    }
  }
}
</script>

<style scoped lang="less">
.teacher-verification-tip {
  position: relative;
  .verification-tip-title {
    display: flex;
    align-items: center;
    i {
      font-size: 20px;
      color: @primary-color;
    }
    label {
      margin-left: 10px;
    }
  }
  .verification-tip-opt {
    margin-top: 20px;
    width: 100%;
    text-align: center;
  }
  .verification-tip-foot {
    margin-top: 20px;
    width: 100%;
    text-align: center;
  }
}
</style>
