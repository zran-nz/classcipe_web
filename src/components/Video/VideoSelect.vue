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
import VideoEvent from '@/components/Video/VideoEvent'
export default {
  name: 'VideoSelect',
  components: { VideoViewer, ScreenCapture, ClasscipeDriveButton, CustomTextButton },
  props: {
    defaultVideo: {
      type: String,
      default: null
    },
    defaultType: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      currentMediaFileUrl: null,
      currentDriveType: null
    }
  },
  watch: {
    defaultVideo(val) {
      if (!this.currentMediaFileUrl) {
        this.currentMediaFileUrl = val
      }
    },
    defaultType(val) {
      if (!this.currentDriveType) {
        this.currentDriveType = val
      }
    }
  },
  created() {
    this.$EventBus.$on(ClasscipeDriveEvent.INSERT_DRIVE_ITEM, this.handleSelectDriveItem)
    this.$EventBus.$on(ClasscipeDriveEvent.INSERT_YOUTUBE_ITEM, this.handleSelectYoutube)
    this.$EventBus.$on(ClasscipeDriveEvent.INSERT_GOOGLE_DRIVE, this.handleSelectGoogleDrive)
    this.$EventBus.$on(VideoEvent.VIDEO_ADD, this.handleAddScreenCapture)

    if (this.defaultVideo) {
      this.currentMediaFileUrl = this.defaultVideo
      this.currentDriveType = this.defaultType
    }
  },
  beforeDestroy() {
    this.$EventBus.$off(ClasscipeDriveEvent.INSERT_DRIVE_ITEM, this.handleSelectDriveItem)
    this.$EventBus.$off(ClasscipeDriveEvent.INSERT_YOUTUBE_ITEM, this.handleSelectYoutube)
    this.$EventBus.$off(ClasscipeDriveEvent.INSERT_GOOGLE_DRIVE, this.handleSelectGoogleDrive)
    this.$EventBus.$off(VideoEvent.VIDEO_ADD, this.handleAddScreenCapture)
  },
  methods: {
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
    },

    afterSelectInsert() {
      this.$logger.info('handleAddScreenCapture done', this.currentMediaFileUrl, this.currentDriveType)
      this.$refs.drive.hiddenClasscipeDrive()
      this.$emit('update-video', {
        url: this.currentMediaFileUrl,
        type: this.currentDriveType
      })
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
