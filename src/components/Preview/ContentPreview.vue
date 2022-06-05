<template>
  <a-drawer
    class='cc-content-preview-drawer'
    :visible='true'
    :title='null'
    width='800px'
    :bodyStyle="{ padding: 0, height: '100%' }"
    @close='handleClose'
  >
    <div class='content-preview'>
      <iframe :src="iframeSrc" class='preview-iframe' id='library-iframe' v-if='iframeSrc'></iframe>
    </div>
  </a-drawer>
</template>

<script>

import { ClasscipeEvent, ClasscipeEventBus } from '@/classcipeEventBus'

export default {
  name: 'ContentPreview',
  props: {
   contentId: {
     type: String,
     required: true
   },
   contentType: {
     type: Number,
     required: true
   }
  },
  computed: {
    iframeSrc() {
      if (this.baseUrl) {
        return this.baseUrl + '/v2/detail/' + this.contentType + '/' + this.contentId
      }
      return null
    }
  },
  data() {
    return {
      baseUrl: null
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
    ClasscipeEventBus.$on(ClasscipeEvent.LIBRARY_IFRAME_EVENT, this.handleIframeEvent)
  },
  beforeDestroy() {
    ClasscipeEventBus.$off(ClasscipeEvent.LIBRARY_IFRAME_EVENT, this.handleIframeEvent)
  },
  methods: {

    async handleIframeEvent (data) {
      this.$logger.info('handleIframeEvent', JSON.stringify(data))
    },
    handleClose () {
      this.$emit('close')
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.content-preview {
  height: 100vh;
  width: 100%;
  .preview-iframe {
    height: 100vh;
    width: 100%;
    border: none;
    outline: none;
  }
}
</style>
