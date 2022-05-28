<template>
  <div class="library-iframe-container">
    <iframe v-if='iframeSrc' :src='iframeSrc' class='library-iframe' />
  </div>
</template>

<script>

export default {
  name: 'LibraryIframe',
  data () {
    return {
      baseUrl: null
    }
  },
  computed: {
    iframeSrc() {
      if (this.baseUrl) {
        return this.baseUrl + '/v2/iframe/library'
      }
      return null
    }
  },
  created() {
    const host = window.location.host
    if (host.indexOf('localhost') !== -1) {
      this.baseUrl = 'http://localhost:9004'
    } else if (host.indexOf('dev.classcipe.com') !== -1) {
      this.baseUrl = 'https://dev.rssmv.cn'
    } else if (host.indexOf('my.classcipe.com') !== -1) {
      this.baseUrl = 'https://my.classcipe.com'
    } else {
      this.$logger.warn('ContentPreview: unknown host', host)
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
.library-iframe-container {
  height: 100vh;
  width: 100%;
  .library-iframe {
    height: 100vh;
    width: 100%;
    border: none;
    outline: none;
  }
}
</style>
