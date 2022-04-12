<template>
  <a-card :bordered="false" :bodyStyle="{ padding: '16px 24px', height: '100%', minHeight: '500px' }">
    <a-spin class="redirect-spin" tip="Loading..." size="large"/>
  </a-card>
</template>

<script>
import { TaskAddOrUpdate } from '@/api/task'
import { ClasscipeEventBus, ClasscipeEvent } from '@/classcipeEventBus'
export default {
  name: 'TaskRedirectByMode',
  props: {
    taskMode: {
      type: String,
      default: '1'
    }
  },
  created () {
    this.$logger.info('TaskRedirectByMode ' + this.taskMode)
    ClasscipeEventBus.$on(ClasscipeEvent.GOOGLE_AUTH_REFRESH, this.handleTaskRedirect)
    this.handleTaskRedirect()
  },
  beforeDestroy() {
    ClasscipeEventBus.$off(ClasscipeEvent.GOOGLE_AUTH_REFRESH, this.handleTaskRedirect)
  },
  methods: {
    handleTaskRedirect() {
      if (parseInt(this.taskMode) === 1 || parseInt(this.taskMode) === 2) {
        const data = {
          name: null,
          taskMode: parseInt(this.taskMode),
          status: 0
        }
        this.startCreating = true
        this.$logger.info('create task ', data)
        TaskAddOrUpdate(data).then((response) => {
          this.$logger.info('TaskAddOrUpdate response', response.result)
          if (response.success) {
            if (response.code !== 520) {
              this.$router.replace('/teacher/add-task/' + response.result.id)
              this.$emit('close')
            } else {
              this.$logger.info('等待授权回调')
            }
          } else {
            this.$message.error(response.message)
          }
        }).finally(() => {
          this.startCreating = false
        })
      } else {
        this.$message.error('Task mode is not supported')
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
