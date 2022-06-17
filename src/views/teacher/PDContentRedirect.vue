<template>
  <a-card :bordered="false" :bodyStyle="{ padding: '16px 24px', height: '100%', minHeight: '500px' }">
    <a-spin class="redirect-spin" tip="Loading..." size="large"/>
  </a-card>
</template>

<script>
import { PDContentAddOrUpdate } from '@/api/pdContent'
import { ClasscipeEvent, ClasscipeEventBus } from '@/classcipeEventBus'

export default {
  name: 'PDContentRedirect',
  props: {
    pdId: {
      type: String,
      default: null
    }
  },
  created () {
    this.$logger.info('pd redirecting ' + this.pdId)
    ClasscipeEventBus.$on(ClasscipeEvent.GOOGLE_AUTH_REFRESH, this.handlePdRedirect)
    this.handlePdRedirect()
  },
  beforeDestroy() {
    ClasscipeEventBus.$off(ClasscipeEvent.GOOGLE_AUTH_REFRESH, this.handlePdRedirect)
  },
  methods: {
    handlePdRedirect() {
      this.$logger.info('task redirecting ' + this.pdId)
      if (this.pdId) {
        this.$router.replace('/teacher/pd-content/' + this.pdId)
      } else {
        const data = {
          name: 'Unnamed PD Content',
          status: 0
        }

        PDContentAddOrUpdate(data).then((response) => {
          this.$logger.info('PDContentAddOrUpdate response', response.result)
          if (response.success) {
            if (response.code !== 520 && response.code !== 403) {
              this.$router.replace('/teacher/pd-content/' + response.result.id)
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
