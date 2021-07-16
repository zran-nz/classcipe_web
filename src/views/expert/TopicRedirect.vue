<template>
  <a-card :bordered="false" :bodyStyle="{ padding: '16px 24px', height: '100%', minHeight: '500px' }">
    <a-spin class="redirect-spin" tip="Loading..." size="large"/>
  </a-card>
</template>

<script>
import { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import { TopicAddOrUpdate } from '@/api/topic'
import * as logger from '@/utils/logger'

export default {
  name: 'TopicRedirect',
  components: {
    PageHeaderWrapper
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    topicId: null
  },
  created () {
    if (this.topicId !== 'create') {
      this.$router.replace('/expert/topic/' + this.topicId)
    } else {
      const topicData = {
        name: 'Unnamed Topic'
      }

      TopicAddOrUpdate(topicData).then((response) => {
        logger.info('creatingTopic response', response.result)
        if (response.success) {
          this.$router.replace({
            path: '/expert/topic/' + response.result.id
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
