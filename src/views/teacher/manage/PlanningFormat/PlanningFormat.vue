<template>
  <a-card class='planning-format' :body-style="{'padding': 20}">
    <a-tabs type="card" v-model='activeKey' v-if='!loading'>
      <a-tab-pane key="plan" tab="Unit Format" class='planning-content' :forceRender='true'>
        <h2 class="template-title">{{ getCurrentTemplateName() }}</h2>
        <format-form-with-step
          ref='plan'
          :saving='saving || loading'
          :common-list='planConfig.commonList'
          :custom-list='planConfig.customList'
          :step-list='planConfig.steps'
          :step-type='typeMap["unit-plan"]'
          :required-field-list='planRequiredFields'
          @save='handleSavePlanningForm(false)'
          v-if='planConfig' />
      </a-tab-pane>
      <a-tab-pane key="task" tab="Task Format" class='planning-content' :forceRender='true'>
        <h2 class="template-title">{{ getCurrentTemplateName() }}</h2>
        <format-form-with-step
          ref='task'
          :saving='saving || loading'
          :common-list='taskConfig.commonList'
          :custom-list='taskConfig.customList'
          :step-list='taskConfig.steps'
          :step-type='typeMap.task'
          :required-field-list='taskRequiredFields'
          @save='handleSavePlanningForm(false)'
          v-if='taskConfig' />
      </a-tab-pane>
      <div class='form-config-action' slot="tabBarExtraContent">
        <a-space>
          <!--          <a-button @click='handleAddStep' type="primary"><a-icon type="plus" /> Add step</a-button>-->
          <!--          <a-divider type="vertical" />-->
          <a-button @click='handleShowSelectTemplate' type="primary"><a-icon type="plus" /> Select Template</a-button>
          <a-divider type="vertical" />
          <a-button @click='handlePreviewPlanningForm'>Preview</a-button>
          <a-button type="primary" @click='handleSavePlanningForm' :loading='saving'>Save changes</a-button>
        </a-space>
      </div>
    </a-tabs>

    <a-modal
      v-model='selectTemplateVisible'
      :dialog-style="{ top: '50px'}"
      :footer='null'
      destroyOnClose
      width='900px'>
      <div slot='title' class='my-modal-title'>
        Format templates
      </div>
      <div class='content-wrapper'>
        <select-template
          :template-list="templateList"
          :active-key="activeKey"
          :current-id="getCurrentId"
          @cancel='selectTemplateVisible = false'
          @ensure='handleSelectTemplate' />
      </div>
    </a-modal>
  </a-card>
</template>

<script>

import { typeMap } from '@/const/teacher'
import { FormConfigAddOrUpdate, FormConfigData, GetTemplates, ImportTemplate } from '@/api/formConfig'
import { FORM_CONFIG_PREVIEW_DATA } from '@/store/mutation-types'
import { PlanField, TaskField, USER_MODE } from '@/const/common'
import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'
import { mapState } from 'vuex'
import FormatFormWithStep from '@/components/FormConfig/FormatFormWithStep'
import SelectTemplate from '@/views/teacher/manage/PlanningFormat/SelectTemplate'

export default {
  name: 'PlanningFormat',
  mixins: [UserModeMixin, CurrentSchoolMixin],
  components: { FormatFormWithStep, SelectTemplate },
  data () {
    return {
      loading: false,
      planConfig: null,
      taskConfig: null,
      activeKey: 'plan',
      typeMap: typeMap,
      saving: false,
      templateList: [],
      selectTemplateVisible: false,
      planRequiredFields: [ PlanField.Name, PlanField.Image, PlanField.Inquiry, PlanField.Sdg, PlanField.Question, PlanField.SubjectIds, PlanField.GradeIds ],
      taskRequiredFields: [ TaskField.Name, TaskField.Image, TaskField.Overview, TaskField.TaskType ]
    }
  },
  created() {
    this.loadFormConfigData()
    this.GetTemplates()
  },
  computed: {
    ...mapState({
      userMode: state => state.app.userMode,
      currentSchool: state => state.user.currentSchool
    }),
    getCurrentId() {
      if (this.planConfig?.steps || this.taskConfig?.steps) {
        if (this.activeKey === 'plan') {
          return this.planConfig?.steps ? this.planConfig?.steps[0].templateId : ''
        } else {
          return this.taskConfig?.steps ? this.taskConfig?.steps[0].templateId : ''
        }
      }
    }
  },
  methods: {
    getCurrentTemplateName() {
      let id = ''
      if (this.activeKey === 'plan') {
        id = this.planConfig.steps ? this.planConfig.steps[0].templateId : ''
      } else {
        id = this.taskConfig.steps ? this.taskConfig.steps[0].templateId : ''
      }
      const tem = this.templateList.filter(item => item.id === id)
      return tem ? tem[0].name : ''
    },
    handleSchoolChange(currentSchool) {
      if (this.userMode === USER_MODE.SCHOOL) {
        this.loadFormConfigData()
      }
    },
    handleModeChange(userMode) {
      // 模式切换，个人还是学校 TODO 个人接口
      this.loadFormConfigData()
    },
    loadFormConfigData() {
      this.$logger.info('loadFormConfigData')
      this.loading = true
      FormConfigData({
        schoolId: this.currentSchool.id
      }).then((response) => {
        this.$logger.info('loadFormConfigData response', response)
        this.planConfig = response.result.plan
        this.taskConfig = response.result.task
      }).finally(() => {
        this.loading = false
      })
    },
    handleAddStep () {
      if (this.activeKey === 'plan') {
        this.$refs.plan.handleAddStep()
      } else {
        this.$refs.task.handleAddStep()
      }
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
            steps: planConfig.steps,
            type: typeMap['unit-plan']
          })
          window.open('/teacher/managing/planning-format/unit-plan-preview', '_blank')
        }
      } else if (this.activeKey === 'task') {
        const taskConfig = this.$refs.task.getFormatConfig()
        if (taskConfig) {
          this.$store.commit(FORM_CONFIG_PREVIEW_DATA, {
            commonList: taskConfig.commonList,
            customList: taskConfig.customList,
            steps: taskConfig.steps,
            type: typeMap.task
          })
          window.open('/teacher/managing/planning-format/task-preview', '_blank')
        }
      }
    },

    handleSavePlanningForm (showTips = true) {
      this.$logger.info('handleSavePlanningForm', showTips)
      const config = this.getPlanningConfig()
      if (config) {
        if (this.activeKey === 'plan') {
          this.saving = true
          FormConfigAddOrUpdate({
            commonList: config.planConfig.commonList,
            customList: config.planConfig.customList,
            steps: config.planConfig.steps,
            schoolId: this.currentSchool.id,
            type: typeMap['unit-plan']
          }).then((response) => {
            if (response.success) {
              if (showTips) {
                this.$message.success('Save unit format successfully')
                this.planConfig = null
                this.loadFormConfigData()
              }
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
            steps: config.taskConfig.steps,
            schoolId: this.currentSchool.id,
            type: typeMap.task
          }).then((response) => {
            if (response.success) {
              if (showTips) {
                this.$message.success('Save task format successfully')
                this.taskConfig = null
                this.loadFormConfigData()
              }
            } else {
              this.$message.error(response.message)
            }
          }).finally(() => {
            this.saving = false
          })
        }
      }
    },

    handleShowSelectTemplate() {
      this.selectTemplateVisible = true
    },

    GetTemplates() {
      this.$logger.info('GetTemplates')
      GetTemplates().then((response) => {
        this.$logger.info('GetTemplates response', response)
        this.templateList = response.result
      }).finally(() => {
      })
    },

    handleSelectTemplate(id) {
      this.selectTemplateVisible = false
      this.saving = true
      ImportTemplate({
        templateId: id
      }).then((response) => {
        if (response.success) {
          this.$message.success('Import format template successfully')
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
.template-title{
  text-align: center;
}
</style>
