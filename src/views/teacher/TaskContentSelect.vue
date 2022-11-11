<template>
  <div class="task-content-select">
    <content-select
      :type="type"
      :title="type === typeMap.task ? 'Select Task content' : 'Select PD content'"
      @choose="handleChoose"
      @cancel="handleCloseImport"
    />
  </div>
</template>

<script>
import ContentSelect from '@/components/MyContentV2/ContentSelect'

import { typeMap } from '@/const/teacher'
export default {
  name: 'TaskContentSelect',
  props: {
    type: {
      type: Number,
      default: undefined
    }
  },
  components: {
    ContentSelect
  },
  data() {
    return {
      typeMap: typeMap
    }
  },
  methods: {
    handleChoose(item) {
      this.$router.push({
        path: '/teacher/live-workshop/' + item.id + '/' + item.type
      })
    },
    handleCloseImport() {
      if (window.history.length <= 1) {
        location.href = '/v2/my/workshop'
        return false
      } else {
        this.$router.go(-1)
      }
    }
  }
}
</script>

<style scoped lang="less">
.task-content-select {
  padding: 20px;
  height: 100vh;
  overflow: hidden;
  /deep/ .content-select {
    .content-select-title {
      font-size: 18px;
      height: 40px;
      line-height: 40px;
    }
    .content-select-wrap {
      height: calc(100vh - 110px);
      overflow: auto;
      padding: 10px 0;
      margin: 0;
      .content-select-left {
        padding: 20px;
      }
      .content-select-right {
        height: auto;
      }
    }
    .content-select-action {
      height: 30px;
    }
  }
}
</style>
