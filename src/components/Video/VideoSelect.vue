<template>
  <div class='video-select'>
    <div class='video-select-action'>
      <a-space>
        <classcipe-drive-button filter-file-type='video' />
        <screen-capture />
      </a-space>
    </div>
    <div class='video-select-wrapper'></div>
  </div>
</template>

<script>
import CustomTextButton from '@/components/Common/CustomTextButton'
import ClasscipeDriveButton from '@/components/ClasscipeDrive/ClasscipeDriveButton'
import ScreenCapture from '@/components/ScreenCapture/ScreenCapture'
export default {
  name: 'VideoSelect',
  components: { ScreenCapture, ClasscipeDriveButton, CustomTextButton },
  data() {
    return {}
  },
  created() {
  },
  methods: {}
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

</style>
