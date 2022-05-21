<template>
  <div class='screen-capture'>
    <RecordVideo v-if='recording' :onSend="onSendVideo" :cancel="cancelRecord" />
    <custom-text-button label='Screen Capture' @click='handleScreenCapture'>
      <template v-slot:icon>
        <a-icon type='plus-circle' />
      </template>
    </custom-text-button>
  </div>
</template>

<script>

import CustomTextButton from '@/components/Common/CustomTextButton'
import RecordVideo from '@/components/AddMaterial/Video/RecordVideo'
import PdEvent from '@/components/PdContent/PdEvent'
export default {
  name: 'ScreenCapture',
  components: { RecordVideo, CustomTextButton },
  data() {
    return {
      recording: false
    }
  },
  methods: {
    handleScreenCapture () {
      this.$logger.info('handleScreenCapture')
      this.recording = true
    },

    onSendVideo(url) {
      this.$logger.info('onSendVideo', url)
      this.recording = false
      this.$EventBus.$emit(PdEvent.PD_VIDEO_ADD, url)
    },

    cancelRecord (data) {
      this.$logger.info('cancelRecord', data)
      this.recording = false
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
