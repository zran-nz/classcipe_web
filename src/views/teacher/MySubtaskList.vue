<template>
  <div class='my-sub-task-list'>
    <fixed-form-header>
      <template v-if=''>

      </template>
    </fixed-form-header>
  </div>
</template>

<script>
import { TaskQueryById } from '@/api/task'
import FixedFormHeader from '@/components/Common/FixedFormHeader'

export default {
  name: 'MySubtaskList',
  components: { FixedFormHeader },
  props: {
    taskId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      subTaskList: []
    }
  },
  created() {
    this.initTask()
  },
  methods: {
    initTask() {
      TaskQueryById({
        id: this.taskId
      }).then(res => {
        this.$logger.info('sub task', res.result)
        if (res.code === 0) {
          this.subTaskList = res.result.subtask
        }
      })
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

</style>
