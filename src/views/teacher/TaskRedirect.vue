<template>
  <a-card :bordered="false" :bodyStyle="{ padding: '16px 24px', height: '100%', minHeight: '500px' }">
    <a-spin class="redirect-spin" tip="Loading..." size="large"/>
  </a-card>
</template>

<script>
import { TaskAddOrUpdate } from '@/api/task'
import { ClasscipeEventBus, ClasscipeEvent } from '@/classcipeEventBus'
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
    ClasscipeEventBus.$on(ClasscipeEvent.GOOGLE_AUTH_REFRESH, this.handleTaskRedirect)
    this.handleTaskRedirect()
  },
  beforeDestroy() {
    ClasscipeEventBus.$off(ClasscipeEvent.GOOGLE_AUTH_REFRESH, this.handleTaskRedirect)
  },
  methods: {
    handleTaskRedirect() {
      this.$logger.info('task redirecting ' + this.taskId)
      if (this.taskId) {
        this.$router.replace('/teacher/add-task/' + this.taskId)
      } else {
        const data = {
          name: null,
          status: 0
        }

        TaskAddOrUpdate(data).then((response) => {
          this.$logger.info('TaskAddOrUpdate response', response.result)
          if (response.success) {
            if (response.code !== 520) {
              this.$router.replace('/teacher/add-task/' + response.result.id)
            } else {
              this.$logger.info('等待授权回调')
            }
          } else {
            this.$message.error(response.message)
          }
        })
      }
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
