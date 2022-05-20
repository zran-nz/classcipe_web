<template>
  <div class='screen-capture'>
    <custom-text-button label='Screen Capture' @click='handleScreenCapture'>
      <template v-slot:icon>
        <a-icon type='plus-circle' />
      </template>
    </custom-text-button>
  </div>
</template>

<script>

import CustomTextButton from '@/components/Common/CustomTextButton'
import { screenCapture } from '@/utils/screenCapture'
export default {
  name: 'ScreenCapture',
  components: { CustomTextButton },
  data() {
    return {
      recordChunks: []
    }
  },
  created() {
  },
  methods: {
    async handleScreenCapture () {
      this.$logger.info('handleScreenCapture')
      this.recordChunks = []
      await screenCapture(this.handleOnDataAvailable, this.handleScreenCaptureFinish)
    },

    handleOnDataAvailable (event) {
      this.recordChunks.push(event.data)
    },

    handleScreenCaptureFinish (event) {
      this.$logger.info('ScreenCapture end', event)
      this.$logger.info('blob data', this.screenCaptureRecorder.requestData())
      this.screenCaptureStream = null
      this.screenCaptureRecorder = null
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

</style>
