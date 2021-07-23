<template>
  <a-card :bordered="false" :bodyStyle="{ padding: '16px 24px', height: '100%', minHeight: '500px' }">
    <a-spin class="redirect-spin" tip="Loading..." size="large"/>
  </a-card>
</template>

<script>

export default {
  name: 'TaskRedirect',
  props: {
    taskId: {
      type: String,
      default: null
    }
  },
  created () {
    this.$logger.info('task redirecting ' + this.taskId)
    if (this.taskId) {
      this.$router.replace('/teacher/add-task/' + this.taskId)
    } else {
      this.$router.replace('/teacher/add-task')
    }
  }
}
</script>

<style lang="less" scoped>
.redirect-spin {
  position: absolute;
  top: 40%;
  left: 50%;
  margin-left: -20px;
}
</style>
