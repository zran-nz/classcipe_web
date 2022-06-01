<template>
  <div class='case-video'>
    <div class='action-bar'>
      <a-space>
        <classcipe-drive-button />
        <screen-capture @capture-done='handleCapturedVideoData'/>
      </a-space>
    </div>
    <div class='video-list'>
      <video-list v-bind="$attrs" />
    </div>
  </div>
</template>

<script>

import ClasscipeDriveButton from '@/components/ClasscipeDrive/ClasscipeDriveButton'
import ScreenCapture from '@/components/ScreenCapture/ScreenCapture'
import VideoList from '@/components/PdContent/VideoList'
import ClasscipeDriveEvent from '@/components/ClasscipeDrive/ClasscipeDriveEvent'
import VideoEvent from '@/components/Video/VideoEvent'
import DriveType from '@/components/ClasscipeDrive/Content/DriveType'

export default {
  name: 'CaseVideo',
  components: { VideoList, ScreenCapture, ClasscipeDriveButton },
  data() {
    return {
    }
  },
  created() {
    this.$EventBus.$on(ClasscipeDriveEvent.INSERT_DRIVE_ITEM, this.handleSelectDriveItem)
    this.$EventBus.$on(ClasscipeDriveEvent.INSERT_YOUTUBE_ITEM, this.handleSelectYoutube)
    this.$EventBus.$on(ClasscipeDriveEvent.INSERT_GOOGLE_DRIVE, this.handleSelectGoogleDrive)
    this.$EventBus.$on(VideoEvent.VIDEO_ADD, this.handleAddScreenCapture)
  },
  methods: {
    handleCapturedVideoData(data) {

    },

    handleSelectDriveItem (driveItem) {
      this.$logger.info('handleSelectDriveItem', driveItem[[0]])
      this.currentMediaFileUrl = driveItem[0].filePath
      this.currentDriveType = DriveType.ClasscipeDrive
      this.afterSelectInsert()
    },
    handleSelectYoutube (youtubeItem) {
      this.$logger.info('handleSelectYoutube', youtubeItem)
      this.currentMediaFileUrl = youtubeItem.link
      this.currentDriveType = DriveType.Youtube
      this.afterSelectInsert()
    },
    handleSelectGoogleDrive (googleDriveItem) {
      this.$logger.info('handleSelectGoogleDrive', googleDriveItem)
      this.currentMediaFileUrl = googleDriveItem.url
      this.currentDriveType = DriveType.GoogleDrive
      this.afterSelectInsert()
    },

    handleAddScreenCapture (url) {
      this.$logger.info('handleAddScreenCapture', url)
      this.currentMediaFileUrl = url
      this.currentDriveType = DriveType.Upload
      this.afterSelectInsert()
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
