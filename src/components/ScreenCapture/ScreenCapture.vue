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
      await screenCapture(this.handleScreenCaptureFinish)
    },
    handleScreenCaptureFinish (data) {
      this.$logger.info('ScreenCapture end', data)
      this.recordChunks = data
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

</style>
