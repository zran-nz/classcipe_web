<template>
  <div style="width: 600px">
    <div class="preview-wrapper">

    </div>
  </div>
</template>

<script>

import { ClasscipeEvent } from '@/classcipeEventBus'

  import { ACCESS_TOKEN } from '@/store/mutation-types'
  import storage from 'store'
  export default {
  name: 'AddonCallback',
  components: {
  },
  data () {
  },
  created () {
    const token = this.$route.query.token
    if (token) {
      storage.set(ACCESS_TOKEN, token)
    }
    if (window.opener) {
      this.$logger.info('发送消息给父窗口，通知授权更新')
      window.opener.postMessage({
        event: ClasscipeEvent.GOOGLE_AUTH_REFRESH
      }, '*')
    }
    // setTimeout(() => {
    //   window.location.href = 'about:blank'
    //   window.close()
    // }, 1000)
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
