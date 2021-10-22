<template>
  <div>
  </div>
</template>

<script>

import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { SESSION_ACTIVE_KEY } from '@/const/common'

export default {
  name: 'PageRedirect',
  components: {
  },
  data () {
    return {
      type: 4
    }
  },
  created () {
    let token = this.$route.query.token
    if (!token) {
      token = this.$route.query.accessToken
    }
    if (token) {
      storage.set(ACCESS_TOKEN, token)
      window.sessionStorage.setItem(SESSION_ACTIVE_KEY, token)
    }

    this.$logger.info('AuthCheck loaded!')
    // 没有session 数据，尝试验证token，如果失效那么重新登录
    this.$store.dispatch('GetInfo').then((data) => {
      this.$logger.info('AuthCheck token valid, go to path', data)
      this.$router.push('/teacher/add-task/' + this.id)
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
  props: {
    id: {
      type: String,
      default: null
    },
    sourceType: {
      type: String,
      default: null
    }
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
.preview-detail{
  /*margin: 0 auto;*/
}
</style>
