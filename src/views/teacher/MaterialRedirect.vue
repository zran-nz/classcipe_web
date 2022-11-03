<template>
  <a-card :bordered="false" :bodyStyle="{ padding: '16px 24px', height: '100%', minHeight: '500px' }">
    <a-spin class="redirect-spin" tip="Loading..." size="large"/>
  </a-card>
</template>

<script>
import { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import * as logger from '@/utils/logger'
import { MaterialAddOrUpdate } from '@/api/material'

export default {
  name: 'MaterialRedirect',
  components: {
    PageHeaderWrapper
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    unitPlanId: null,
    // eslint-disable-next-line vue/require-default-prop
    materialId: null
  },
  created () {
    if (this.unitPlanId === 'none' && this.materialId === 'create') {
      const materialData = {
        name: 'Unnamed Material',
        overview: '',
        fileUrl: '',
        fileType: 0,
        questions: [],
        status: 0
      }

      MaterialAddOrUpdate(materialData).then((response) => {
        console.info('MaterialAddOrUpdate none unit plan response', response.result)
        if (response.success) {
          this.$router.replace({
            path: '/teacher/add-material/' + response.result.id
          })
        } else {
          this.$message.error(response.message)
        }
      })
    } else if (this.materialId && this.materialId !== 'create') {
      this.$router.replace('/teacher/unit-plan-material/' + this.unitPlanId + '/' + this.materialId)
    } else if (this.unitPlanId && this.materialId && this.materialId === 'create') {
      const materialData = {
        name: 'Unnamed Material',
        overview: '',
        planId: this.unitPlanId,
        fileUrl: '',
        fileType: 0,
        questions: [],
        status: 0
      }

      MaterialAddOrUpdate(materialData).then((response) => {
        console.info('MaterialAddOrUpdate response', response.result)
        if (response.success) {
          this.$router.replace({
            path: '/teacher/unit-plan-material/' + this.unitPlanId + '/' + response.result.id
          })
        } else {
          this.$message.error(response.message)
        }
      })
    } else {
      logger.error('url param invalid unitPlanId:' + this.unitPlanId + ' materialId:' + this.materialId)
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
