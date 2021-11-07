<template>
  <div>
  </div>
</template>

<script>

import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import {
  SESSION_ACTIVE_KEY,
  SESSION_CURRENT_PAGE,
  SESSION_CURRENT_TYPE,
  SESSION_CURRENT_TYPE_LABEL
} from '@/const/common'
import store from '@/store'

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
    // del cache
    sessionStorage.removeItem(SESSION_CURRENT_PAGE)
    sessionStorage.removeItem(SESSION_CURRENT_TYPE_LABEL)
    sessionStorage.removeItem(SESSION_CURRENT_TYPE)

    if (store.getters.roles.length === 0) {
        this.$store.dispatch('GetInfo').then((data) => {
          this.$router.push('/teacher/add-task/' + this.id)
        })
    } else {
      this.$router.push('/teacher/add-task/' + this.id)
    }
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
