<template>
  <div class="status-icon-item">
    <img src="~@/assets/icons/library/Lesson.png" :style="{width: size}" v-if="type === typeMap.lesson"/>
    <img src="~@/assets/icons/library/Task.png" :style="{width: size}" v-else-if="type === typeMap.task"/>
    <img src="~@/assets/icons/library/unitplan.png" :style="{width: size}" v-else-if="type === typeMap['unit-plan']"/>
    <img src="~@/assets/icons/library/topic.png" :style="{width: size}" v-else-if="type === typeMap.topic"/>
    <img src="~@/assets/icons/library/evaluation.png" :style="{width: size}" v-else-if="type === typeMap.evaluation"/>
    <a-icon type="question-circle" :style="{fontSize: '18px'}" v-else/>
  </div>
</template>

<script>
/**
 'topic': 1,
 'unit-plan': 2,
 'material': 3,
 'task': 4,
 'lesson': 5,
 'evaluation': 6
 */
import { typeMap } from '@/const/teacher'
export default {
  name: 'ContentTypeIcon',
  props: {
    type: {
      type: Number,
      default: -1
    },
    size: {
      type: String,
      default: '25px'
    }
  },
  data: function () {
    return {
      typeMap: typeMap
    }
  }
}
</script>

<style lang='less' scoped>
.status-icon-item {
  text-align: center;
  display: inline-block;
}

.ant-menu-item .anticon, .ant-menu-submenu-title .anticon {
  margin-right: 0;
}
</style>
