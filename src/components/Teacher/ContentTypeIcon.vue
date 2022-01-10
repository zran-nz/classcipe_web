<template>
  <div class="status-icon-item">
    <img src="~@/assets/icons/library/Lesson.png" :style="{width: size}" v-if="type === typeMap.lesson"/>
    <task-svg :style="{height: size}" v-else-if="type === typeMap.task"/>
    <unit-svg :style="{height: size}" v-else-if="type === typeMap['unit-plan']"/>
    <to-svg :style="{ height: size}" v-else-if="type === typeMap.topic"/>
    <ev-svg :style="{height: size}" v-else-if="type === typeMap.evaluation"/>
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
import EvSvg from '@/assets/svgIcon/contentType/EV.svg?inline'
import TaskSvg from '@/assets/svgIcon/contentType/Task.svg?inline'
import ToSvg from '@/assets/svgIcon/contentType/To.svg?inline'
import UnitSvg from '@/assets/svgIcon/contentType/Unit.svg?inline'

export default {
  name: 'ContentTypeIcon',
  components: {
    EvSvg,
    ToSvg,
    UnitSvg,
    TaskSvg
  },
  props: {
    type: {
      type: Number,
      default: -1
    },
    size: {
      type: String,
      default: '30px'
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
  display: flex;
  justify-content: center;
  align-items: center;
}

.ant-menu-item .anticon, .ant-menu-submenu-title .anticon {
  margin-right: 0;
}
</style>
