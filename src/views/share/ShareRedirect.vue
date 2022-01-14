<template>
  <a-card :bordered="false" :bodyStyle="{ padding: '16px 24px', height: '100%', minHeight: '500px' }">
    <a-spin class="redirect-spin" tip="Loading..." size="large"/>
  </a-card>
</template>

<script>

export default {
  name: 'ShareRedirect',
  props: {
    shareCode: {
      type: String,
      required: true
    }
  },
  created () {
    this.$logger.info('ShareRedirect created ' + this.shareCode)
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
