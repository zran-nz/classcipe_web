<template>
  <div class='case-video'>
    <div class='action-bar'>
      <a-space>
        <classcipe-drive />
        <screen-capture />
      </a-space>
    </div>
    <div class='video-list'>
      <video-list v-bind="$attrs" />
    </div>
  </div>
</template>

<script>

import ClasscipeDrive from '@/components/ClasscipeDrive/ClasscipeDrive'
import ScreenCapture from '@/components/ScreenCapture/ScreenCapture'
import VideoList from '@/components/PdContent/VideoList'

export default {
  name: 'CaseVideo',
  components: { VideoList, ScreenCapture, ClasscipeDrive },
  data() {
    return {
    }
  },
  created() {
  },
  methods: {}
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.action-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-top: 10px;
}

.video-list {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  flex-wrap: wrap;
  justify-content: flex-start;
}

</style>
