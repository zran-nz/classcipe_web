<template>
  <a-card :bordered="false" :bodyStyle="{ padding: '16px 24px', height: '100%', minHeight: '500px' }">
    <a-spin class="redirect-spin" tip="Loading..." size="large"/>
  </a-card>
</template>

<script>
// import { PDContentAddOrUpdate } from '@/api/pdContent'
// import * as logger from '@/utils/logger'

export default {
  name: 'PDContentRedirect',
  props: {
    pdId: {
      type: String,
      default: null
    }
  },
  created () {
    if (this.pdId !== 'create') {
      this.$router.replace('/teacher/pd-content/' + this.pdId)
    } else {
      // const pdData = {
      //   name: 'Unnamed PD Content'
      // }

      // TODO 创建PD Content
      this.$router.replace({
        path: '/teacher/pd-content/testPdId'
      })
      // PDContentAddOrUpdate(pdData).then((response) => {
      //   logger.info('PDContentAddOrUpdate response', response.result)
      //   if (response.success) {
      //     this.$router.replace({
      //       path: '/teacher/pd-content/' + response.result.id
      //     })
      //   } else {
      //     this.$message.error(response.message)
      //   }
      // })
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
