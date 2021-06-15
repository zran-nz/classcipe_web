<template>
  <div class="library-nav-content">
    <a-breadcrumb>
      <a-breadcrumb-item v-for="(navTitle, navIndex) in navigationList" :key="navIndex">{{ navTitle }}</a-breadcrumb-item>
    </a-breadcrumb>
  </div>
</template>

<script>

import * as logger from '@/utils/logger'
export default {
  name: 'Navigation',
  props: {},
  data () {
    return {
      navigationList: []
    }
  },
  computed: {
  },
  created () {
    const path = this.$route.path
    const libraryPath = path.substr(path.indexOf('/library'))
    logger.info('path ' + path + ' libraryPath ' + libraryPath)
    this.navigationList = libraryPath.split('/')
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";
</style>
