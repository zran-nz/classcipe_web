<template>
  <div class="class-session-evaluation">
    ClassSessionEvaluation
  </div>
</template>

<script>
export default {
  name: 'ClassSessionEvaluation',
  props: {
    taskId: {
      type: String,
      required: true
    },
    classId: {
      type: String,
      required: true
    }
  },
  created () {
    this.$logger.info('created ClassSessionEvaluation classId' + this.classId + ' taskId ' + this.taskId)
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

</style>
