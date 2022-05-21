<template>
  <a-card :bordered="false" :bodyStyle="{ padding: '16px 24px', height: '100%', minHeight: '500px' }">
    <a-spin class="redirect-spin" tip="Loading..." size="large"/>
  </a-card>
</template>

<script>
import { SET_PROMOTE_CODE } from '@/store/mutation-types'
import { mapMutations } from 'vuex'
export default {
  name: 'PromoteTg',
  props: {
    code: {
      type: String,
      default: null
    }
  },
  created () {
    this.$logger.info('promote redirecting ' + this.code)
    this.handleRedirect()
  },
  methods: {
    ...mapMutations([SET_PROMOTE_CODE]),
    handleRedirect() {
      this.$logger.info('promote redirecting ' + this.code)
      if (this.code) {
        this[SET_PROMOTE_CODE](this.code)
      }
      this.$router.replace('/teacher/main/live-workshops')
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
