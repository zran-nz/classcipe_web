<template>
  <div>My Content</div>
</template>

<script>
import * as logger from '@/utils/logger'

export default {
  name: 'MyContent',
  components: {
  },
  data () {
    return {
    }
  },
  computed: {
  },
  created () {
    logger.info('teacher my content')
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
</style>
