<template>
  <div class='base-layout'>
    <main class='ant-layout-content ant-pro-basicLayout-content'>
      <router-view />
    </main>
  </div>
</template>

<script>
import { initRatio, resetRatio } from '@/utils/rem.js'

export default {
  name: 'H5Layout',
  mounted() {
    initRatio()
  },
  beforeDestroy() {
    resetRatio()
  }
}
</script>

<style lang="less" scoped>

</style>
