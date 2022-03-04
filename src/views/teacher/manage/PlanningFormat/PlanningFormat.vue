<template>
  <a-card class='planning-format' :body-style="{'padding': 0}" :loading='loading'>
    <a-tabs type="card" v-model='activeKey'>
      <a-tab-pane key="plan" tab="Unit Format" class='planning-content' :forceRender='true'>
        <format-form ref='plan' title='Edit unit-plan info' :common-list='planConfig.commonList' :custom-list='planConfig.customList' v-if='planConfig' />
      </a-tab-pane>
      <a-tab-pane key="task" tab="Task Format" class='planning-content' :forceRender='true'>
        <format-form ref='task' title='Edit task info' :common-list='taskConfig.commonList' :custom-list='taskConfig.customList' v-if='taskConfig' />
      </a-tab-pane>
      <div class='form-config-action' slot="tabBarExtraContent">
        <a-space>
          <a-button @click='handlePreviewPlanningForm'>Preview</a-button>
          <a-button type="primary" @click='handleSavePlanningForm' :loading='saving'>Save changes</a-button>
        </a-space>
      </div>
    </a-tabs>
  </a-card>
</template>

<script>

import { typeMap } from '@/const/teacher'
import { FormConfigData, FormConfigAddOrUpdate } from '@/api/formConfig'
import FormatForm from '@/components/FormConfig/FormatForm'
import { FORM_CONFIG_PREVIEW_DATA } from '@/store/mutation-types'

export default {
  name: 'PlanningFormat',
  components: { FormatForm },
  data () {
    return {
      loading: false,
      planConfig: null,
      taskConfig: null,
      activeKey: 'plan',
      typeMap: typeMap,
      saving: false
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
    },

    getPlanningConfig () {
      this.$logger.info('getPlanningConfig task', this.$refs)
      const taskConfig = this.$refs.task.getFormatConfig()
      const planConfig = this.$refs.plan.getFormatConfig()

      this.$logger.info('getPlanningConfig', taskConfig, planConfig)
      if (taskConfig && planConfig) {
        return {
          taskConfig,
          planConfig
        }
      }
      return false
    },

    handlePreviewPlanningForm () {
      this.$logger.info('handlePreviewPlanningForm')
      if (this.activeKey === 'plan') {
        const planConfig = this.$refs.plan.getFormatConfig()
        if (planConfig) {
          this.$store.commit(FORM_CONFIG_PREVIEW_DATA, {
            commonList: planConfig.commonList,
            customList: planConfig.customList,
            schoolId: this.$store.getters.userInfo.school,
            type: typeMap['unit-plan']
          })
          this.$router.push({
            path: '/teacher/managing/planning-format/unit-plan-preview'
          })
        }
      } else if (this.activeKey === 'task') {
        const taskConfig = this.$refs.task.getFormatConfig()
        if (taskConfig) {
          this.$store.commit(FORM_CONFIG_PREVIEW_DATA, {
            commonList: taskConfig.commonList,
            customList: taskConfig.customList,
            schoolId: this.$store.getters.userInfo.school,
            type: typeMap.task
          })
          this.$router.push({
            path: '/teacher/managing/planning-format/task-preview'
          })
        }
      }
    },

    handleSavePlanningForm () {
      this.$logger.info('handleSavePlanningForm')
      const config = this.getPlanningConfig()
      if (config) {
        if (this.activeKey === 'plan') {
          this.saving = true
          FormConfigAddOrUpdate({
            commonList: config.planConfig.commonList,
            customList: config.planConfig.customList,
            schoolId: this.$store.getters.userInfo.school,
            type: typeMap['unit-plan']
          }).then((response) => {
            if (response.success) {
              this.$message.success('Save unit format successfully')
              this.planConfig = null
              this.loadFormConfigData()
            } else {
              this.$message.error(response.message)
            }
          }).finally(() => {
            this.saving = false
          })
        } else {
          this.saving = true
          FormConfigAddOrUpdate({
            commonList: config.taskConfig.commonList,
            customList: config.taskConfig.customList,
            schoolId: this.$store.getters.userInfo.school,
            type: typeMap.task
          }).then((response) => {
            if (response.success) {
              this.$message.success('Save task format successfully')
              this.taskConfig = null
              this.loadFormConfigData()
            } else {
              this.$message.error(response.message)
            }
          }).finally(() => {
            this.saving = false
          })
        }
      }
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.planning-format {
  border: none;
  padding: 0;
}

.form-config-action {
  height: 32px;
  line-height: 32px;
}
</style>