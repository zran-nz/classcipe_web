<template>
  <div class='video-viewer-wrapper'>
    <div class='video-viewer-content'>
      <template v-if='!isYoutubeIframeUrl'>
        <video :src='mediaUrl' v-if='mediaUrl' controls></video>
      </template>
      <template v-if='isYoutubeIframeUrl'>
        <iframe :src='mediaUrl' class='video-iframe'/>
      </template>
    </div>
  </div>
</template>

<script>

export default {
  name: 'VideoViewer',
  props: {
    mediaUrl: {
      type: String,
      default: null
    }
  },
  data() {
    return {
    }
  },
  computed: {
    isYoutubeIframeUrl() {
      return this.mediaUrl && this.mediaUrl.indexOf('youtube.com/embed') !== -1
    }
  },
  watch: {
    mediaUrl(value) {
      this.$logger.info('mediaUrl changed ', value)
    }
  },
  methods: {}
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.video-viewer-wrapper {
  margin-top: 20px;

  .video-viewer-content {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    video {
      max-height: 500px;
      width: auto;
    }

    .video-iframe {
      border: none;
      overflow: hidden;
      height: 500px;
      width: 900px;
    }
  }
}

</style>
