<template>
  <div class="main-content">
    <a-spin size="large">
    </a-spin>
  </div>
</template>

<script>

// 其他课堂、插件端的用户授权跳转
export default {
  name: 'AuthRedirect',
  created () {
    const paramSearch = new URLSearchParams(window.location.search)
    const token = paramSearch.get('token')
    const redirect = paramSearch.get('redirect')
    this.$store.dispatch('LoginWithToken', token).then(() => {
      this.$store.dispatch('GetInfo').then(response => {
        console.info('redirect path is ' + redirect)
        this.$router.push({ path: redirect })
      }).catch((e) => {
        this.$message.error('Redirect Auth Failed,' + e)
      })
    }).catch(() => {
      location.href = '/v2/login?call='+encodeURIComponent(location.pathname+location.search)
    })
  },
  methods: {
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
