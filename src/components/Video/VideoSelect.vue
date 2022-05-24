<template>
  <div class='video-select'>
    <div class='video-select-action'>
      <a-space>
        <classcipe-drive-button filter-file-type='video' ref='drive' />
        <screen-capture />
      </a-space>
    </div>
    <div class='video-select-wrapper'>
      <div class='no-video-viewer' v-if='!currentMediaFileUrl'>
        <div class='video-select-tips'>
          Select from Classcipe or Screen capture
        </div>
      </div>
      <video-viewer
        v-if='currentMediaFileUrl'
        :media-url='currentMediaFileUrl'
        :media-type='currentMediaType'
        :drive-type='currentDriveType' />
    </div>
  </div>
</template>

<script>
import CustomTextButton from '@/components/Common/CustomTextButton'
import ClasscipeDriveButton from '@/components/ClasscipeDrive/ClasscipeDriveButton'
import ScreenCapture from '@/components/ScreenCapture/ScreenCapture'
import ClasscipeDriveEvent from '@/components/ClasscipeDrive/ClasscipeDriveEvent'
import VideoViewer from '@/components/Video/VideoViewer'
import DriveType from '@/components/ClasscipeDrive/Content/DriveType'
export default {
  name: 'VideoSelect',
  components: { VideoViewer, ScreenCapture, ClasscipeDriveButton, CustomTextButton },
  data() {
    return {
      currentMediaFileUrl: null,
      currentMediaType: null,
      currentDriveType: null
    }
  },
  created() {
    this.$EventBus.$on(ClasscipeDriveEvent.INSERT_DRIVE_ITEM, this.handleSelectDriveItem)
    this.$EventBus.$on(ClasscipeDriveEvent.INSERT_YOUTUBE_ITEM, this.handleSelectYoutube)
    this.$EventBus.$on(ClasscipeDriveEvent.INSERT_GOOGLE_IMAGE, this.handleSelectGoogleImage)
    this.$EventBus.$on(ClasscipeDriveEvent.INSERT_GOOGLE_DRIVE, this.handleSelectGoogleDrive)
  },
  beforeDestroy() {
    this.$EventBus.$off(ClasscipeDriveEvent.INSERT_DRIVE_ITEM, this.handleSelectDriveItem)
    this.$EventBus.$off(ClasscipeDriveEvent.INSERT_YOUTUBE_ITEM, this.handleSelectYoutube)
    this.$EventBus.$off(ClasscipeDriveEvent.INSERT_GOOGLE_IMAGE, this.handleSelectGoogleImage)
    this.$EventBus.$off(ClasscipeDriveEvent.INSERT_GOOGLE_DRIVE, this.handleSelectGoogleDrive)
  },
  methods: {
    handleSelectDriveItem (driveItem) {
      this.$logger.info('handleSelectDriveItem', driveItem[[0]])
      this.currentMediaFileUrl = driveItem[0].filePath
      this.currentMediaType = driveItem[0].fileType
      this.currentDriveType = DriveType.ClasscipeDrive
      this.$logger.info('handleSelectDriveItem done', this.currentMediaFileUrl, this.currentMediaType, this.currentDriveType)
      this.$refs.drive.hiddenClasscipeDrive()
    },
    handleSelectYoutube (youtubeItem) {
      this.$logger.info('handleSelectYoutube', youtubeItem)
      this.currentMediaFileUrl = youtubeItem.link
      this.currentMediaType = 'youtube'
      this.currentDriveType = DriveType.Youtube
      this.$logger.info('handleSelectDriveItem done', this.currentMediaFileUrl, this.currentMediaType, this.currentDriveType)
      this.$refs.drive.hiddenClasscipeDrive()
    },
    handleSelectGoogleImage (url) {
      this.$logger.info('handleSelectGoogleImage', url)
    },
    handleSelectGoogleDrive (url, mediaType) {
      this.$logger.info('handleSelectGoogleDrive', url, mediaType)
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.video-select-wrapper {
  margin-top: 15px;
  .no-video-viewer {
    background: #F7F8F9;
    border: 2px dashed #D3D8DB;
    border-radius: 9px;
    min-height: 400px;
    width: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    .video-select-tips {
      cursor: pointer;
      user-select: none;
      font-size: 15px;
      font-weight: bold;
      color: #999999;
    }
  }
}
</style>
