<template>
  <div class="main-content">
    <a-spin size="large" v-if='authLoading'>
    </a-spin>
    <div class='auth-success' v-if='!authLoading'>
      <div class='auth-success-detail'>
        <a-icon type="check-circle" :style="{ fontSize: '50px', color: '#15C39A' }" theme="filled" v-if='authSuccess'/>
        <a-icon type="exclamation-circle" :style="{ fontSize: '50px', color: '#ff4d4f' }" theme="filled" v-if='!authSuccess'/>
      </div>
      <div class='auth-success-tips'>
        {{ authMessage }}
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'AuthSuccess',
  data() {
    return {
      authLoading: true,
      authMessage: null,
      authSuccess: false
    }
  },
  created () {
    const paramSearch = new URLSearchParams(window.location.search)
    const accessToken = paramSearch.get('accessToken')
    if (accessToken) {
      this.$store.dispatch('LoginWithToken', accessToken).then(() => {
        this.$store.dispatch('GetInfo').then(response => {
          this.authSuccess = true
          this.authLoading = false
          this.authMessage = 'Successful authorization.'
          setTimeout(() => {
            window.close()
          }, 1000)
        }).catch((e) => {
          this.authLoading = false
          this.authMessage = 'Processing Failure.' + e
          this.$logger.error('Processing Failure 1.', e)
        })
      }).catch((e) => {
        this.authLoading = false
        this.authMessage = 'Processing Failure.' + e
        this.$logger.error('Processing Failure 2.', e)
      })
    } else {
      this.authLoading = false
      this.authMessage = 'Wrong response parameters.'
      this.$logger.error('Wrong response parameters.')
    }
  }
}
</script>

<style scoped lang='less'>
@import "~@/components/index.less";
  .main-content {
    margin-top: 100px;
    display: flex;
    justify-content: center;
    flex-direction: row;
    align-items: center;
  }

  .auth-success {
    text-align: center;
  }

  .auth-success-tips {
    padding: 20px 10px;
    color: #333;
    width: 350px;
  }
</style>
