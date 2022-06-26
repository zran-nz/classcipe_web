<template>
  <div class='case-video'>
    <div class='action-bar'>
      <a-space>
        <classcipe-drive-button
          :field='field'
          ref='drive'
          filter-file-type='video'
          :max-selected-num='5' />
        <screen-capture
          :field='field'
          @capture-done='handleCapturedVideoData'/>
      </a-space>
    </div>
    <div class='video-list'>
      <video-list
        :field='field'
        v-bind="$attrs"/>
    </div>
  </div>
</template>

<script>

import ClasscipeDriveButton from '@/components/ClasscipeDrive/ClasscipeDriveButton'
import ScreenCapture from '@/components/ScreenCapture/ScreenCapture'
import VideoList from '@/components/PdContent/VideoList'
import ClasscipeDriveEvent from '@/components/ClasscipeDrive/ClasscipeDriveEvent'
import ScreenCaptureEvent from '@/components/ScreenCapture/ScreenCaptureEvent'
import DriveType from '@/components/ClasscipeDrive/Content/DriveType'

export default {
  name: 'CaseVideo',
  components: { VideoList, ScreenCapture, ClasscipeDriveButton },
  props: {
    field: {
      type: String,
      default: null
    }
  },
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

    handleSelectDrive (eventData) {
      this.$logger.info('case video handleSelectDriveItem', eventData)
      if (eventData?.field === this.field) {
        this.$emit('add-video', eventData.data)
        this.$refs.drive.hiddenClasscipeDrive()
      }
    },
    handleSelectYoutube (eventData) {
      this.$logger.info('handleSelectYoutube', eventData)
      if (eventData && eventData.field === this.field) {
        this.afterSelectInsert()
      }
    },
    handleSelectGoogleDrive (eventData) {
      this.$logger.info('handleSelectGoogleDrive', eventData)
      if (eventData && eventData.field === this.field) {
        this.currentMediaFileUrl = eventData.data.url
        this.currentDriveType = DriveType.GoogleDrive
        this.afterSelectInsert()
      }
    },

    handleAddScreenCapture (eventData) {
      this.$logger.info('handleAddScreenCapture', eventData)
      if (eventData && eventData.field === this.field) {
        this.currentMediaFileUrl = eventData.data
        this.currentDriveType = DriveType.Upload
        this.afterSelectInsert()
      }
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
