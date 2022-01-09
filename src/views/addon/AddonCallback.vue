<template>
  <div style="width: 600px">
    <div class="preview-wrapper">

    </div>
  </div>
</template>

<script>
  // import storage from 'store'
  // import { ACCESS_TOKEN } from '../../store/mutation-types'

  export default {
  name: 'AddonCallback',
  components: {
  },
  data () {
  },
  created () {
    // let token = this.$route.query.token
    // if (!token) {
    //   token = this.$route.query.accessToken
    // }
    // storage.set(ACCESS_TOKEN, token)
    setTimeout(() => {
      window.location.href = 'about:blank'
      window.close()
    }, 1000)
  },
  props: {

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
