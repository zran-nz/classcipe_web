<template>
  <a-card :bordered="false" :bodyStyle="{ padding: '16px 24px', height: '100%', minHeight: '500px' }">
    <a-spin class="redirect-spin" tip="Loading..." size="large"/>
  </a-card>
</template>

<script>
import { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import { UnitPlanAddOrUpdate } from '@/api/unitPlan'
import * as logger from '@/utils/logger'

export default {
  name: 'UnitPlanRedirect',
  components: {
    PageHeaderWrapper
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    unitPlanId: null
  },
  created () {
    if (this.unitPlanId !== 'create') {
      this.$router.replace('/teacher/unit-plan/' + this.unitPlanId)
    } else {
      const unitPlanData = {
        name: 'Unnamed Unit Plan'
      }

      UnitPlanAddOrUpdate(unitPlanData).then((response) => {
        logger.info('creatingUnitPlan response', response.result)
        if (response.success) {
          this.$router.replace({
            path: '/teacher/unit-plan/' + response.result.id
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
