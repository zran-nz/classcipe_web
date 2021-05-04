<template>
  <div class="main-content">
    <a-spin size="large">
    </a-spin>
  </div>
</template>

<script>
import { defaultDashboardRouter, selectRoleRouter } from '@/config/router.config'

export default {
  name: 'AuthResult',
  created () {
    const paramSearch = new URLSearchParams(window.location.search)
    const accessToken = paramSearch.get('accessToken')
    this.$store.dispatch('LoginWithToken', accessToken).then(() => {
      this.$store.dispatch('GetInfo').then(response => {
        if (this.$store.getters.currentRole) {
          this.$router.push({ path: defaultDashboardRouter })
        } else {
          this.$router.push({ path: selectRoleRouter })
        }
      }).catch((e) => {
        this.$message.error('GetInfo Failed,' + e)
      })
    }).catch(() => {
      this.$router.push({ path: '/user/login' })
    })
  },
  methods: {
    goHomeHandle () {
      this.$router.push({ name: 'login' })
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
