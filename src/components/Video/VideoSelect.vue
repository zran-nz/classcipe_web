<template>
  <div class='video-select'>
    <div class='video-select-action'>
      <a-space>
        <classcipe-drive-button
          :content-id='contentId'
          :content-type='contentType'
          :field='field'
          filter-file-type='video'
          ref='drive' />
        <screen-capture
          :content-id='contentId'
          :content-type='contentType'
          :field='field' />
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
        :media-url='currentMediaFileUrl' />
    </div>
  </div>
</template>

<script>
import CustomTextButton from '@/components/Common/CustomTextButton'
import ClasscipeDriveButton from '@/components/ClasscipeDrive/ClasscipeDriveButton'
import ScreenCapture from '@/components/ScreenCapture/ScreenCapture'
import ClasscipeDriveEvent from '@/components/ClasscipeDrive/ClasscipeDriveEvent'
import VideoViewer from '@/components/Video/VideoViewer'
import ScreenCaptureEvent from '@/components/ScreenCapture/ScreenCaptureEvent'

export default {
  name: 'VideoSelect',
  components: { VideoViewer, ScreenCapture, ClasscipeDriveButton, CustomTextButton },
  props: {
    defaultVideo: {
      type: String,
      default: null
    },
    field: {
      type: String,
      default: null
    },
    contentId: {
      type: String,
      default: null
    },
    contentType: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      currentMediaFileUrl: null
    }
  },
  watch: {
    defaultVideo(val) {
      if (!this.currentMediaFileUrl) {
        this.currentMediaFileUrl = val
      }
    }
  },
  created() {
    this.$EventBus.$on(ClasscipeDriveEvent.INSERT_UPLOADED_VIDEO, this.handleSelectUploadItem)
    this.$EventBus.$on(ClasscipeDriveEvent.INSERT_DRIVE_ITEM, this.handleSelectDriveItem)
    this.$EventBus.$on(ClasscipeDriveEvent.INSERT_YOUTUBE_ITEM, this.handleSelectYoutube)
    this.$EventBus.$on(ClasscipeDriveEvent.INSERT_GOOGLE_DRIVE, this.handleSelectGoogleDrive)
    this.$EventBus.$on(ScreenCaptureEvent.SCREEN_CAPTURE_VIDEO_ADD, this.handleAddScreenCapture)

    if (this.defaultVideo) {
      this.currentMediaFileUrl = this.defaultVideo
    }
  },
  beforeDestroy() {
    this.$EventBus.$off(ClasscipeDriveEvent.INSERT_UPLOADED_VIDEO, this.handleSelectUploadItem)
    this.$EventBus.$off(ClasscipeDriveEvent.INSERT_DRIVE_ITEM, this.handleSelectDriveItem)
    this.$EventBus.$off(ClasscipeDriveEvent.INSERT_YOUTUBE_ITEM, this.handleSelectYoutube)
    this.$EventBus.$off(ClasscipeDriveEvent.INSERT_GOOGLE_DRIVE, this.handleSelectGoogleDrive)
    this.$EventBus.$off(ScreenCaptureEvent.SCREEN_CAPTURE_VIDEO_ADD, this.handleAddScreenCapture)
  },
  methods: {
    updateRecording(status) {
      this.recording = status
    },
    handleDelete () {
      this.$logger.info('CustomCoverMedia handleDelete', this.url)
      this.$emit('delete')
    },

    handleSelectUploadItem (eventData) {
      this.$logger.info('CustomCoverMedia handleSelectUploadItem', eventData)
      if (eventData && eventData.field === this.field) {
        this.currentMediaFileUrl = eventData.data
        this.afterSelectInsert()
      }
    },

    handleSelectDriveItem (eventData) {
      this.$logger.info('CustomCoverMedia handleSelectDriveItem', eventData)
      if (eventData && eventData.field === this.field) {
        this.currentMediaFileUrl = eventData.data[0].filePath
        this.afterSelectInsert()
      }
    },
    handleSelectYoutube (eventData) {
      this.$logger.info('CustomCoverMedia handleSelectYoutube', eventData)
      if (eventData && eventData.field === this.field) {
        this.currentMediaFileUrl = eventData.data.link
        this.afterSelectInsert()
      }
    },
    handleSelectGoogleDrive (eventData) {
      this.$logger.info('CustomCoverMedia handleSelectGoogleDrive', eventData)
      if (eventData && eventData.field === this.field) {
        this.currentMediaFileUrl = eventData.data
        this.afterSelectInsert()
      }
    },

    handleAddScreenCapture (eventData) {
      this.$logger.info('CustomCoverMedia handleAddScreenCapture', eventData)
      if (eventData && eventData.field === this.field) {
        this.currentMediaFileUrl = eventData.data
        this.afterSelectInsert()
      }
    },

    afterSelectInsert() {
      this.$logger.info('CustomCoverMedia handleAddVideo done', this.currentMediaFileUrl)
      this.$refs.drive.hiddenClasscipeDrive()
      this.$emit('update', {
        url: this.currentMediaFileUrl,
        type: 'video'
      })
    },

    viewItem () {
      window.open(this.url, '_blank')
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
