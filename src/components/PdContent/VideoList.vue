<template>
  <div class='video-list'>
    <div class='video-item' v-for='videoItem in videoList' :key='videoItem.url'>
      <custom-cover-media
        :show-delete-button='true'
        :emit-global-event='false'
        :show-upload-button='false'
        :show-edit-button='true'
        :video-item='videoItem'
        type='video'
        @delete='handleDeleteVideo'
        :url='videoItem.filePath' />
    </div>
  </div>
</template>

<script>
import CustomCoverMedia from '@/components/Common/CustomCoverMedia'
import ClasscipeDriveEvent from '@/components/ClasscipeDrive/ClasscipeDriveEvent'
export default {
  name: 'VideoList',
  components: { CustomCoverMedia },
  props: {
    videoList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {}
  },
  created() {
  },
  methods: {
    handleDeleteVideo (videoItem) {
      this.$logger.info('handleDeleteVideo', videoItem)
      this.$EventBus.$emit(ClasscipeDriveEvent.DELETE_VIDEO, videoItem)
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.video-list {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;

  .video-item {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
</style>
