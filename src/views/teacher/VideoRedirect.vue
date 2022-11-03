<template>
  <a-card :bordered="false" :bodyStyle="{ padding: '16px 24px', height: '100%', minHeight: '500px' }">
    <a-spin class="redirect-spin" tip="Loading..." size="large"/>
  </a-card>
</template>

<script>
import { VideoAddOrUpdate } from '@/api/video'
import * as logger from '@/utils/logger'

export default {
  name: 'VideoRedirect',
  props: {
    videoId: {
      type: String,
      default: null
    }
  },
  created () {
    if (this.videoId !== 'create') {
      this.$router.replace('/teacher/video/' + this.videoId)
    } else {
      const videoData = {
        name: 'Unnamed Video'
      }

      VideoAddOrUpdate(videoData).then((response) => {
        console.info('VideoAddOrUpdate response', response.result)
        if (response.success) {
          this.$router.replace({
            path: '/teacher/video/' + response.result.id
          })
        } else {
          this.$message.error(response.message)
        }
      })
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
