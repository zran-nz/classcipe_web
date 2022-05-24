<template>
  <div class='video-viewer-wrapper'>
    <div class='video-viewer-content'>
      <template v-if='driveType === DriveTypeMap.ClasscipeDrive || driveType === DriveTypeMap.GoogleDrive || driveType === DriveTypeMap.Upload'>
        <video :src='mediaUrl' v-if='mediaUrl' controls></video>
      </template>
      <template v-if='driveType === DriveTypeMap.Youtube'>
        <iframe :src='mediaUrl' class='video-iframe'/>
      </template>
    </div>
  </div>
</template>

<script>

import DriveType from '@/components/ClasscipeDrive/Content/DriveType'

export default {
  name: 'VideoViewer',
  props: {
    mediaUrl: {
      type: String,
      default: null
    },
    mediaType: {
      type: String,
      default: null
    },
    driveType: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      DriveTypeMap: DriveType
    }
  },
  created() {
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
