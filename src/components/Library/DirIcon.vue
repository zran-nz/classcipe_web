<template>
  <div class="dir-icon">
    <img src="~@/assets/icons/library/dir-blue.png" class="blue" v-if="dirType === 'blue'"/>
    <img src="~@/assets/icons/library/dir-yellow.png" v-else-if="dirType === 'yellow'"/>
    <img src="~@/assets/icons/library/dir-opened.png" class="opened" v-else-if="dirType === 'opened'"/>
    <img src="~@/assets/icons/library/Lesson.png" v-else-if="contentType === typeMap.lesson"/>
    <img src="~@/assets/icons/library/Task.png" v-else-if="contentType === typeMap.task"/>
    <img src="~@/assets/icons/library/unitplan.png" v-else-if="contentType === typeMap['unit-plan']"/>
    <img src="~@/assets/icons/library/topic.png" v-else-if="contentType === typeMap.topic"/>
    <img src="~@/assets/icons/library/evaluation.png" v-else-if="contentType === typeMap.evaluation"/>
    <img src="~@/assets/icons/library/evaluation.png" v-else/>
  </div>
</template>

<script>

import { typeMap } from '@/const/teacher'
export default {
  name: 'DirIcon',
  props: {
    dirType: {
      type: String,
      default: null
    },
    contentType: {
      type: Number,
      default: null
    }
  },
  data: function () {
    return {
      typeMap: typeMap
    }
  },
  created () {
    this.$logger.info('dir icon ' + this.contentType)
  }
}
</script>

<style lang="less" scoped>
@import url('../index.less');

.dir-icon {
  padding: 0 10px 0 0;
  width: 40px;
  img {
    width: 25px;
  }

  .blue {
    width: 23px;
  }
}
</style>
