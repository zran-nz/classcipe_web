<template>
  <div class='task-assessment-tools'>
    <div class='create-assessment-bar'>
      <a-space>
        <custom-text-button label='Import Assessment tool'>
          <template v-slot:suffix>
            <a-icon type="caret-down" />
          </template>
        </custom-text-button>
        <a-dropdown>
          <custom-text-button label='Add Template'>
            <template v-slot:icon>
              <a-icon type="plus-circle" />
            </template>
          </custom-text-button>
          <a-menu slot="overlay" class='cc-dropdown-menu'>
            <a-menu-item>
              <a href="javascript:;" @click="handleAddAssessmentTool('rubric')">Rubric</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;" @click="handleAddAssessmentTool('singlePointRubric')">Single-point rubric</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;" @click="handleAddAssessmentTool('checkList')">Checklist</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </a-space>
    </div>
    <div class='assessment-list'>
      <template v-if='assessmentList.length'>
        <div class='assessment-item' v-for='assessment in assessmentList' :key='assessment.key'>
          <assessment-tool
            :assessment='assessment'
            @delete='handleDeleteAssessmentTool' />
        </div>
      </template>
      <template v-if='!assessmentList.length'>
        <common-no-data text='No assessment tool.' class='no-assessment'/>
      </template>
    </div>
  </div>
</template>

<script>

import CustomTextButton from '@/components/Common/CustomTextButton'
import CommonNoData from '@/components/Common/CommonNoData'
import AssessmentTool from '@/components/AssessmentTool/AssessmentTool'
import { HeaderType, AssessmentToolType } from '@/components/AssessmentTool/Constant'

export default {
  name: 'TaskAssessmentTools',
  components: {
    AssessmentTool,
    CommonNoData,
    CustomTextButton
  },
  props: {
    taskId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      assessmentList: [],

      // 初始评估表配置
      assessmentToolConfig: {
        rubric: {
          type: AssessmentToolType.Rubric,
          title: 'Rubric',
          canAddCustomRow: true,
          canAddCustomCol: true,
          headerList: [
            {
              title: 'Criteria',
              type: HeaderType.criteria,
              bgColor: '#E6F8F3',
              editing: false
            },
            {
              title: 'Option1',
              type: `${HeaderType.custom}_1`,
              canAddCustomCol: true,
              editing: false
            },
            {
              title: 'Option2',
              type: `${HeaderType.custom}_2`,
              canAddCustomCol: true,
              editing: false
            },
            {
              title: 'Option3',
              type: `${HeaderType.custom}_3`,
              canAddCustomCol: true,
              editing: false
            }
          ],
          bodyList: []
        },
        singlePointRubric: {
          type: AssessmentToolType.SinglePointRubric,
          title: 'Single-point rubric',
          canAddCustomRow: true,
          canAddCustomCol: false,
          headerList: [
            {
              title: 'Areas for improvement',
              type: HeaderType.improvement,
              editing: false
            },
            {
              title: 'Criteria',
              type: HeaderType.criteria,
              bgColor: '#E6E4FF',
              tips: 'Standard for this performance',
              editing: false
            },
            {
              title: 'Evidence of exceeding standards',
              type: HeaderType.exceeding,
              editing: false
            }
          ],
          bodyList: []
        },
        checkList: {
          type: AssessmentToolType.Checklist,
          title: 'Checklist',
          canAddCustomRow: true,
          canAddCustomCol: false,
          headerList: [
            {
              title: 'Criteria',
              type: HeaderType.criteria,
              bgColor: '#E4F8FF',
              editing: false
            },
            {
              title: 'Yes',
              type: HeaderType.yes,
              editing: false
            },
            {
              title: 'No',
              type: HeaderType.no,
              editing: false
            }
          ],
          bodyList: []
        }
      }
    }
  },
  created() {
  },
  methods: {
    handleAddAssessmentTool (type) {
      this.$logger.info('handleAddAssessmentTool', type)
      const config = this.assessmentToolConfig[type]
      if (config) {
        const assessmentTool = JSON.parse(JSON.stringify(config))
        assessmentTool.key = Math.random()
        assessmentTool.taskId = this.taskId
        assessmentTool.sort = this.assessmentList.length
        if (!assessmentTool.bodyList.length) {
          assessmentTool.bodyList.push(this.generateEmptyRowByAssessment(assessmentTool))
        }
        this.assessmentList.push(assessmentTool)
        this.$logger.info('add assessment tool', assessmentTool)
      }
    },
    generateEmptyRowByAssessment(assessment) {
      const row = {
        key: Math.random()
      }
      assessment.headerList.forEach(item => {
        row[item.type] = {
          display: item.type === HeaderType.yes ? 'YES' : (item.type === HeaderType.no ? 'NO' : null),
          type: item.type
        }
      })

      return row
    },

    handleDeleteAssessmentTool (assessment) {
      this.$logger.info('handleDeleteAssessmentTool', assessment)
      this.assessmentList.splice(this.assessmentList.findIndex(item => item.key === assessment.key), 1)
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.assessment-list {
  margin-top: 20px;
  height: calc(100vh - 250px);
  overflow-y: auto;
  .assessment-item {
    margin-bottom: 15px;
  }
}

</style>
