<template>
  <div class='cc-youtube'>
    <google-youtube-video
      :show-cancel='false'
      :next-youtube='handleSelectYoutube'
      style="width: 100%; background-color: transparent" />
  </div>
</template>

<script>
import GoogleYoutubeVideo from '@/components/AddMaterial/Google/GoogleYoutubeVideo'
import ClasscipeDriveEvent from '@/components/ClasscipeDrive/ClasscipeDriveEvent'

export default {
  name: 'Youtube',
  components: { GoogleYoutubeVideo },
  data() {
    return {}
  },
  created() {
  },
  methods: {
    handleSelectYoutube (item) {
      if (item) {
        this.$logger.info('handleSelectYoutube ', item)
        this.$EventBus.$emit(ClasscipeDriveEvent.INSERT_YOUTUBE_ITEM, item)
      }
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

</style>
