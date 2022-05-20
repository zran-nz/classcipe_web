<template>
  <div class='video-list'>
    <div class='video-item' v-for='videoItem in videoList' :key='videoItem.url'>
      <custom-cover-media type='video' :url='videoItem.url' />
    </div>
  </div>
</template>

<script>
import CustomCoverMedia from '@/components/Common/CustomCoverMedia'
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
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

</style>
