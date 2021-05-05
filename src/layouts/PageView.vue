<template>
  <page-header-wrapper>
    <router-view />
  </page-header-wrapper>
</template>

<script>

import * as logger from '@/utils/logger'

export default {
  name: 'PageView',
  created () {
    logger.info('PageView created')
  }
}
</script>
