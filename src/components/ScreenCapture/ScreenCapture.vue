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
export default {
  name: 'ScreenCapture',
  components: { CustomTextButton },
  data() {
    return {}
  },
  created() {
  },
  methods: {
    handleScreenCapture () {

    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

</style>
