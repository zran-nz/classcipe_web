<template>
  <div class='base-layout'>
    <base-nav />
    <main class='ant-layout-content ant-pro-basicLayout-content'>
      <router-view />
    </main>
  </div>
</template>

<script>

import BaseNav from '@/components/GlobalHeader/BaseNav'
export default {
  name: 'BlankLayout',
  components: { BaseNav }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";
@import "~ant-design-vue/es/style/themes/default.less";
</style>
