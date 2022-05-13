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
            <a-menu-item>
              <a href="javascript:;" @click="handleAddAssessmentTool('openQuestions')">Open questions</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </a-space>
    </div>
    <div class='assessment-list'>
      <div class='assessment-item' v-for='assessment in assessmentList' :key='assessment.key'>
        <rubric
          :assessment='assessment'
          @delete='handleDeleteAssessmentTool'
          v-if='assessment.type === $classcipe.AssessmentToolType.Rubric' />
        <single-point-rubric
          :assessment='assessment'
          @delete='handleDeleteAssessmentTool'
          v-if='assessment.type === $classcipe.AssessmentToolType.SinglePointRubric' />
        <check-list
          :assessment='assessment'
          @delete='handleDeleteAssessmentTool'
          v-if='assessment.type === $classcipe.AssessmentToolType.CheckList' />
      </div>
    </div>
  </div>
</template>

<script>

import CustomTextButton from '@/components/Common/CustomTextButton'
import Rubric from '@/components/AssessmentTool/Rubric'
import CheckList from '@/components/AssessmentTool/CheckList'
import SinglePointRubric from '@/components/AssessmentTool/SinglePointRubric'

const HeaderType = {
  criteria: 'criteria',
  improvement: 'improvement',
  exceeding: 'exceeding',
  yes: 'yes',
  no: 'no',
  custom: 'custom_'
}

export default {
  name: 'TaskAssessmentTools',
  components: {
    Rubric,
    CheckList,
    SinglePointRubric,
    CustomTextButton
  },
  data() {
    return {
      assessmentList: [],

      // 初始评估表配置
      assessmentToolConfig: {
        rubric: {
          type: this.$classcipe.AssessmentToolType.Rubric,
          title: 'Rubric',
          canAddCustomRow: true,
          headerList: [
            {
              title: 'Criteria',
              type: HeaderType.criteria,
              bgColor: '#E6F8F3'
            },
            {
              title: 'Option1',
              type: `${HeaderType.custom}_1`
            },
            {
              title: 'Option2',
              type: `${HeaderType.custom}_2`
            },
            {
              title: 'Option3',
              type: `${HeaderType.custom}_3`
            }
          ],
          bodyList: []
        },
        singlePointRubric: {
          type: this.$classcipe.AssessmentToolType.SinglePointRubric,
          title: 'Single-point rubric',
          canAddCustomRow: false,
          headerList: [
            {
              title: 'Areas for improvement',
              type: HeaderType.improvement
            },
            {
              title: 'Criteria',
              type: HeaderType.criteria,
              bgColor: '#E6E4FF',
              tips: 'Standard for this performance'
            },
            {
              title: 'Evidence of exceeding standards',
              type: HeaderType.improvement
            }
          ],
          bodyList: []
        },
        checkList: {
          type: this.$classcipe.AssessmentToolType.CheckList,
          title: 'Checklist',
          canAddCustomRow: false,
          headerList: [
            {
              title: 'Areas for improvement',
              type: HeaderType.improvement,
              bgColor: '#E4F8FF'
            },
            {
              title: 'Yes',
              type: HeaderType.yes
            },
            {
              title: 'No',
              type: HeaderType.no
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
        if (!assessmentTool.bodyList.length) {
          assessmentTool.bodyList.push(this.generateEmptyRowByAssessment(assessmentTool))
        }
        this.assessmentList.push(assessmentTool)
        this.$logger.info('add assessment tool', assessmentTool)
      }
    },
    generateEmptyRowByAssessment(assessment) {
      const row = {}
      assessment.headerList.forEach(item => {
        row[item.type] = {
          display: null,
          teacherSelected: false,
          data: null,
          type: item.type,
          ext: null
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
  overflow-y: scroll;
  .assessment-item {
    margin-bottom: 15px;
  }
}

</style>
