<template>
  <div class="main-content">
    <a-spin size="large">
    </a-spin>
  </div>
</template>

<script>

export default {
  name: 'AuthCheck',
  created () {
    this.$logger.info('AuthCheck loaded!')
    // 没有session 数据，尝试验证token，如果失效那么重新登录
    this.$store.dispatch('GetInfo').then((data) => {
      this.$logger.info('AuthCheck token valid, go to path', data)
      const redirect = decodeURIComponent(this.$route.query.redirect)
      this.$logger.info('AuthCheck redirect path', redirect)
      this.$router.push({ path: redirect })
    }).catch(err => {
      this.$logger.warn('AuthCheck token invalid, try login', err)
      this.$store.dispatch('ClearAuth').then(() => {
        this.$router.push({ name: 'login', query: { redirect: this.$route.fullPath } })
      }).catch(err => {
        this.$logger.error('AuthCheck logout failed', err)
        this.goHomeHandle()
      })
    })
  },
  methods: {
    goHomeHandle () {
      this.$router.replace({ name: 'login' })
    }
  }
}
</script>

<style scoped>
.main-content {
  margin-top: 100px;
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
}
</style>
