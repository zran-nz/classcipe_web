<template>
  <div class='case-video'>
    <div class='action-bar'>
      <a-space>
        <classcipe-drive-button ref='drive' filter-file-type='video' :max-selected-num='5' />
        <screen-capture @capture-done='handleCapturedVideoData'/>
      </a-space>
    </div>
    <div class='video-list'>
      <video-list v-bind="$attrs"/>
    </div>
  </div>
</template>

<script>

import ClasscipeDriveButton from '@/components/ClasscipeDrive/ClasscipeDriveButton'
import ScreenCapture from '@/components/ScreenCapture/ScreenCapture'
import VideoList from '@/components/PdContent/VideoList'
import ClasscipeDriveEvent from '@/components/ClasscipeDrive/ClasscipeDriveEvent'
import ScreenCaptureEvent from '@/components/ScreenCapture/ScreenCaptureEvent'

export default {
  name: 'CaseVideo',
  components: { VideoList, ScreenCapture, ClasscipeDriveButton },
  data() {
    return {
    }
  },
  created() {
    this.$EventBus.$on(ClasscipeDriveEvent.INSERT_DRIVE_ITEM, this.handleSelectDrive)
    this.$EventBus.$on(ClasscipeDriveEvent.INSERT_YOUTUBE_ITEM, this.handleSelectYoutube)
    this.$EventBus.$on(ClasscipeDriveEvent.INSERT_GOOGLE_DRIVE, this.handleSelectGoogleDrive)
    this.$EventBus.$on(ClasscipeDriveEvent.DELETE_VIDEO, this.handleDeleteVideo)
    this.$EventBus.$on(ScreenCaptureEvent.SCREEN_CAPTURE_VIDEO_ADD, this.handleAddScreenCapture)
  },
  beforeDestroy() {
    this.$EventBus.$off(ClasscipeDriveEvent.INSERT_DRIVE_ITEM, this.handleSelectDrive)
    this.$EventBus.$off(ClasscipeDriveEvent.INSERT_YOUTUBE_ITEM, this.handleSelectYoutube)
    this.$EventBus.$off(ClasscipeDriveEvent.INSERT_GOOGLE_DRIVE, this.handleSelectGoogleDrive)
    this.$EventBus.$off(ClasscipeDriveEvent.DELETE_VIDEO, this.handleDeleteVideo)
    this.$EventBus.$off(ScreenCaptureEvent.SCREEN_CAPTURE_VIDEO_ADD, this.handleAddScreenCapture)
  },
  methods: {
    handleCapturedVideoData(data) {
      this.$logger.info('handleCapturedVideoData', data)
    },

    handleSelectDrive (driveItemList) {
      this.$logger.info('case video handleSelectDriveItem', driveItemList)
      this.$emit('add-video', driveItemList)
      this.$refs.drive.hiddenClasscipeDrive()
    },
    handleSelectYoutube (youtubeItem) {
      this.$logger.info('handleSelectYoutube', youtubeItem)
    },
    handleSelectGoogleDrive (googleDriveItem) {
      this.$logger.info('handleSelectGoogleDrive', googleDriveItem)
    },

    handleAddScreenCapture (url) {
      this.$logger.info('handleAddScreenCapture', url)
      this.$emit('add-video', [{
        filePath: url
      }])
    },

    handleDeleteVideo (item) {
      this.$emit('delete-video', item)
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.action-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-top: 10px;
}

.video-list {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  flex-wrap: wrap;
  justify-content: flex-start;
}

</style>
