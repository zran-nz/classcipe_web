<template>
  <div class='planning-format'>
    <a-spin :spinning='loading'>
      <a-tabs type="card">
        <a-tab-pane key="1" tab="Unit Format">
          <format-form title='Edit task info' :common-list='planConfig.commonList' :custom-list='planConfig.customList' v-if='planConfig' />
        </a-tab-pane>
        <a-tab-pane key="2" tab="Task Format">
          <format-form title='Edit unit-plan info' :common-list='taskConfig.commonList' :custom-list='taskConfig.customList' v-if='taskConfig' />
        </a-tab-pane>
        <div class='form-config-action' slot="tabBarExtraContent">
          <a-space>
            <a-button>Preview</a-button>
            <a-button type="primary">Save changes</a-button>
          </a-space>
        </div>
      </a-tabs>
    </a-spin>
  </div>
</template>

<script>

import { FormConfigData } from '@/api/formConfig'
import FormatForm from '@/components/FormConfig/FormatForm'

export default {
  name: 'PlanningFormat',
  components: { FormatForm },
  data () {
    return {
      loading: false,
      planConfig: null,
      taskConfig: null
    }
  },
  created() {
    this.loadFormConfigData()
  },
  methods: {
    loadFormConfigData() {
      this.$logger.info('loadFormConfigData')
      this.loading = true
      FormConfigData({
        schoolId: this.$store.getters.userInfo.school
      }).then((response) => {
        this.$logger.info('loadFormConfigData response', response)
        this.planConfig = response.result.plan
        this.taskConfig = response.result.task
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.form-config-action {
  height: 32px;
  line-height: 32px;
}
</style>
