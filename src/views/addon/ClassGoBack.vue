<template>
  <div>
  </div>
</template>

<script>

import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'

export default {
  name: 'ClassGoBack',
  components: {
  },
  data () {
    return {
    }
  },
  created () {
    const token = storage.get(ACCESS_TOKEN)
    if (!token) {
      window.location.href = 'https://www.classcipe.com/'
    }
    this.$store.dispatch('GetInfo').then((data) => {
      this.$router.push(this.$store.getters.defaultRouter)
    }).catch(err => {
      this.$logger.warn('AuthCheck token invalid, go to website', err)
      window.location.href = 'https://www.classcipe.com/'
    })
  },
  props: {},
  methods: {
  }
}
</script>

<style lang="less" scoped>
.preview-detail{
  /*margin: 0 auto;*/
}
</style>
