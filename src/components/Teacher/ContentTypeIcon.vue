<template>
  <div class="status-icon-item">
    <img src="~@/assets/icons/library/Lesson.png" v-if="type === typeMap.lesson"/>
    <img src="~@/assets/icons/library/Task.png" v-if="type === typeMap.task"/>
    <img src="~@/assets/icons/library/unitplan.png" v-if="type === typeMap['unit-plan']"/>
    <img src="~@/assets/icons/library/topic.png" v-if="type === typeMap.topic"/>
    <img src="~@/assets/icons/library/evaluation.png" v-if="type === typeMap.evaluation"/>
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
  img {
    width: 25px;
  }
}

.ant-menu-item .anticon, .ant-menu-submenu-title .anticon {
  margin-right: 0;
}
</style>
