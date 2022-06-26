<template>
  <div class='custom-cover-media' :style="{width: width, 'min-height': height}">
    <template v-if='isYoutubeIframeUrl'>
      <iframe :src='url' class='youtube-video-img' :style="{width: width, 'min-height': height}"/>
    </template>
    <template v-else>
      <video :src='url' v-if='url' :controls='videoControls'></video>
    </template>
    <common-no-data text='Upload Video' v-if='!url'/>
    <div class='upload-mask' v-if='field'>
      <div class='edit-icon' @click='editVisible = true' v-show='url'>
        <a-icon type="eye" />
        <div class='edit-text' @click='viewItem'>View it</div>
      </div>
      <classcipe-drive-button
        :field='field'
        class='upload-btn'
        filter-type='video'
        ref='drive' />
      <screen-capture :field='field' :class="{'recording': recording}" class='upload-btn' @update-recording='updateRecording' />
      <custom-button class='upload-btn' label='Delete video' @click='handleDelete' v-if='url'>
        <template v-slot:icon>
          <a-icon type='delete' />
        </template>
      </custom-button>
    </div>

    <a-modal
      v-model="previewVisible"
      :body-style="{ padding: '0', 'background': 'transparent' }"
      class='video-preview-modal'
      :footer="null"
      destroyOnClose
      width="700px"
      @ok="previewVisible = false"
      @cancel="previewVisible = false">
      <div class='video-preview-wrapper'>
        <template v-if='isYoutubeIframeUrl'>
          <iframe :src='url' />
        </template>
        <template v-else>
          <video :src='url' v-if='url' :controls='videoControls'></video>
        </template>
      </div>
    </a-modal>
  </div>
</template>

<script>
import CustomButton from '@/components/Common/CustomButton'
import CustomMediaCoverButton from '@/components/Common/CustomMediaCoverButton'
import CustomLinkText from '@/components/Common/CustomLinkText'
import ClasscipeDrive from '@/components/AddMaterial/ClasscipeDrive/ClasscipeDrive'
import ClasscipeDriveButton from '@/components/ClasscipeDrive/ClasscipeDriveButton'
import ScreenCapture from '@/components/ScreenCapture/ScreenCapture'
import CommonNoData from '@/components/Common/CommonNoData'
import ClasscipeDriveEvent from '@/components/ClasscipeDrive/ClasscipeDriveEvent'
import ScreenCaptureEvent from '@/components/ScreenCapture/ScreenCaptureEvent'
import DriveType from '@/components/ClasscipeDrive/Content/DriveType'

export default {
  name: 'CustomCoverMedia',
  components: { CommonNoData, ScreenCapture, ClasscipeDriveButton, ClasscipeDrive, CustomLinkText, CustomMediaCoverButton, CustomButton },
  props: {
    url: {
      type: String,
      default: null
    },
    field: {
      type: String,
      default: null
    },
    videoControls: {
      type: Boolean,
      default: true
    },
    width: {
      type: String,
      default: '352px'
    },
    height: {
      type: String,
      default: '216px'
    },
    showDeleteButton: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isYoutubeIframeUrl() {
      return this.url && this.url.indexOf('youtube.com/embed') !== -1
    }
  },
  data() {
    return {
      recording: false,
      previewVisible: false
    }
  },
  created() {
    this.$logger.info(`CustomCoverMedia field ${this.field}`)
    this.$EventBus.$on(ClasscipeDriveEvent.INSERT_UPLOADED_VIDEO, this.handleSelectUploadItem)
    this.$EventBus.$on(ClasscipeDriveEvent.INSERT_DRIVE_ITEM, this.handleSelectDriveItem)
    this.$EventBus.$on(ClasscipeDriveEvent.INSERT_YOUTUBE_ITEM, this.handleSelectYoutube)
    this.$EventBus.$on(ClasscipeDriveEvent.INSERT_GOOGLE_DRIVE, this.handleSelectGoogleDrive)
    this.$EventBus.$on(ScreenCaptureEvent.SCREEN_CAPTURE_VIDEO_ADD, this.handleAddScreenCapture)
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
        this.currentDriveType = DriveType.Upload
        this.afterSelectInsert()
      }
    },

    handleSelectDriveItem (eventData) {
      this.$logger.info('CustomCoverMedia handleSelectDriveItem', eventData)
      if (eventData && eventData.field === this.field) {
        this.currentMediaFileUrl = eventData.data[0].filePath
        this.currentDriveType = DriveType.ClasscipeDrive
        this.afterSelectInsert()
      }
    },
    handleSelectYoutube (eventData) {
      this.$logger.info('CustomCoverMedia handleSelectYoutube', eventData)
      if (eventData && eventData.field === this.field) {
        this.currentMediaFileUrl = eventData.data.link
        this.currentDriveType = DriveType.Youtube
        this.afterSelectInsert()
      }
    },
    handleSelectGoogleDrive (eventData) {
      this.$logger.info('CustomCoverMedia handleSelectGoogleDrive', eventData)
      if (eventData && eventData.field === this.field) {
        this.currentMediaFileUrl = eventData.data
        this.currentDriveType = DriveType.GoogleDrive
        this.afterSelectInsert()
      }
    },

    handleAddScreenCapture (eventData) {
      this.$logger.info('CustomCoverMedia handleAddScreenCapture', eventData)
      if (eventData && eventData.field === this.field) {
        this.currentMediaFileUrl = eventData.data
        this.currentDriveType = DriveType.Upload
        this.afterSelectInsert()
      }
    },

    afterSelectInsert() {
      this.$logger.info('CustomCoverMedia handleAddVideo done', this.currentMediaFileUrl, this.currentDriveType)
      this.$refs.drive.hiddenClasscipeDrive()
      this.$emit('update', {
        url: this.currentMediaFileUrl,
        type: 'video'
      })
    },

    viewItem () {
      this.previewVisible = true
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.custom-cover-media {
  position: relative;
  video {
    width: 100%;
    height: 100%;
  }

  .upload-mask {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.0);
    transition: all 0.3s ease-in-out;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .upload-btn {
      opacity: 0;
      transition: all 0.3s ease-in-out;
      margin-top: 15px;
      width: 160px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: row;

      div {
        margin: 8px 0;
      }
    }

    .edit-icon {
      opacity: 0;
      cursor: pointer;
      user-select: none;
      position: absolute;
      right: 10px;
      top: 10px;
      color: #fff;
      display: flex;
      flex-direction: row;
      font-size: 13px;
      text-decoration: underline;
      align-items: center;
      height: 15px;

      .edit-text {
        padding: 0 5px;
      }
    }
  }

  &:hover {
    .upload-mask {
      background-color: rgba(0, 0, 0, 0.7);
    }

    .upload-btn, .edit-icon {
      opacity: 1;
    }
  }
}

.youtube-video-iframe {
  border: none;
}

.recording {
  opacity: 1 !important;
}

.video-preview-modal {

}

.video-preview-wrapper {
  width: 100%;
  height: 400px;
  iframe, video {
    border: none;
    height: 100%;
    width: 100%;
  }
}
</style>
