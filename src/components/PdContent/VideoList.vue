<template>
  <div class='video-list'>
    <div class='video-item' v-for='videoItem in videoList' :key='videoItem.filePath'>
      <video-item
        :url='videoItem.filePath'
        :field='field'
        :title='videoItem.fileName || "Untitled"'
        :size='videoItem.fileLength'
        :video-item='videoItem'
      />
    </div>
  </div>
</template>

<script>
import CustomCoverMedia from '@/components/Common/CustomCoverMedia'
import VideoItem from '@/components/PdContent/VideoItem'
export default {
  name: 'VideoList',
  components: { VideoItem, CustomCoverMedia },
  props: {
    videoList: {
      type: Array,
      default: () => []
    },
    field: {
      type: String,
      default: null
    }
  },
  data() {
    return {}
  },
  created() {
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
