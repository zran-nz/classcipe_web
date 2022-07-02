<template>
  <div class='screen-capture'>
    <RecordVideo
      v-if='recording'
      :content-id='contentId'
      :content-type='contentType'
      :onSend="onSendVideo"
      :cancel="cancelRecord" />

    <custom-button label='Screen Capture' @click='handleScreenCapture' style='width: 160px;'>
      <template v-slot:icon>
        <a-icon type="video-camera" />
      </template>
    </custom-button>
  </div>
</template>

<script>

import RecordVideo from '@/components/AddMaterial/Video/RecordVideo'
import ScreenCaptureEvent from '@/components/ScreenCapture/ScreenCaptureEvent'
import CustomButton from '@/components/Common/CustomButton'

export default {
  name: 'ScreenCapture',
  components: { CustomButton, RecordVideo },
  props: {
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
      recording: false
    }
  },
  methods: {
    handleScreenCapture () {
      this.$logger.info(`handleScreenCapture ${this.recording}`)
      if (!this.recording) {
        this.recording = true
        this.$emit('update-recording', this.recording)
      }
    },

    onSendVideo(url) {
      this.$logger.info('onSendVideo', url)
      this.recording = false
      this.$EventBus.$emit(ScreenCaptureEvent.SCREEN_CAPTURE_VIDEO_ADD, {
        field: this.field,
        data: url
      })
      this.$emit('update-recording', this.recording)
    },

    cancelRecord (data) {
      this.$logger.info('cancelRecord', data)
      this.recording = false
      this.$emit('update-recording', this.recording)
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";
.fixed-capture-preview {
  position: fixed;
  right: 10px;
  top: 10px;
  width: 280px;
  height: 150px;
  z-index: 5000;
  video {
    z-index: 5000;
  }
}
</style>
