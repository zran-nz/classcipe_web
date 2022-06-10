<template>
  <a-card :bordered="false" :bodyStyle="{ padding: '16px 24px', height: '100%', minHeight: '500px' }">
    <a-spin class="redirect-spin" tip="Loading..." size="large"/>
  </a-card>
</template>

<script>
import { addPvCount, queryById } from '@/api/v2/promotionChannel'
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
  data() {
    return {
      redirects: ['', '/teacher/library', '/teacher/main/live-workshops']
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
        queryById({
          id: this.code
        }).then(res => {
          if (res.success && res.result && res.result.promotionContent) {
            addPvCount({
              channelId: this.code
            })
            this[SET_PROMOTE_CODE](this.code)
            // 根据promotionContent 决定跳转地址
            // （1：Latest publishing；2：Featured workshops）
            this.$router.replace(this.redirects[res.result.promotionContent])
          } else {
            this.doDefault()
          }
        }).catch(() => {
          this.doDefault()
        })
      } else {
        this.doDefault()
      }
    },
    doDefault() {
      this.$router.replace('/teacher/main/created-by-me')
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
