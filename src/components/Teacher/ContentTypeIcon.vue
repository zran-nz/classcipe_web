<template>
  <div class="status-icon-item">
    <span v-if="type === typeMap.task">Task</span>
    <span v-if="type === typeMap['unit-plan']">Unit</span>
    <span v-if="type === typeMap.pd">PD</span>
    <span v-if="type === typeMap.video">Video</span>
  </div>
</template>

<script>

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
  cursor: pointer;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ced8dd;
  color: #fff;
  font-weight: bold;
  border-radius: 30px;
  padding: 3px 8px;
  font-size: 0.7rem;
}
</style>
