<template>
  <div class='task-assessment-tools'>
    <div class='create-assessment-bar'>
      <a-space>
        <custom-text-button label='Import Assessment tool' @click='showAssessmentToolList'>
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
        <div class='assessment-item' v-for='assessment in assessmentList' :key='assessment.key' @click='handleSelectActiveTable(assessment)'>
          <assessment-tool
            :assessment='assessment'
            ref='assessmentTool'
            :is-active-table='activeAssessmentTableKey === assessment.key'
            @delete='handleDeleteAssessmentTool' />
        </div>
      </template>
      <template v-if='!assessmentList.length'>
        <common-no-data text='No assessment tool.' class='no-assessment'/>
      </template>
    </div>

    <a-modal
      v-model="assessmentToolListVisible"
      width="700px"
      destory-on-close
      :maskClosable="false"
      :keyboard="false"
      :footer="null"
      :closable="false"
    >
      <modal-header @close='assessmentToolListVisible = false' title='Import Assessment tool' />
      <assessment-tool-list v-if='assessmentToolListVisible' @confirm-select='handleInsertSelectAssessmentTool' @cancel-select='assessmentToolListVisible = false' :task-id='taskId'/>
    </a-modal>
  </div>
</template>

<script>

import CustomTextButton from '@/components/Common/CustomTextButton'
import CommonNoData from '@/components/Common/CommonNoData'
import AssessmentTool from '@/components/AssessmentTool/AssessmentTool'
import { HeaderType, AssessmentToolType } from '@/components/AssessmentTool/Constant'
import { AssessmentToolInfoList } from '@/api/v2/assessment'
import AssessmentToolList from '@/components/AssessmentTool/AssessmentToolList'
import ModalHeader from '@/components/Common/ModalHeader'

export default {
  name: 'TaskAssessmentTools',
  components: {
    ModalHeader,
    AssessmentToolList,
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
          bodyList: [],
          extraCriteriaBodyList: []
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
          bodyList: [],
          extraCriteriaBodyList: []
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
          bodyList: [],
          extraCriteriaBodyList: []
        }
      },

      // 当前正在操作的评估表
      activeAssessmentTableKey: null,

      assessmentToolListVisible: false
    }
  },
  created() {
    this.$logger.info('TaskAssessmentTools created')
    this.getAssessmentList()
    this.$EventBus.$on('assessment-saved', this.autoSaveMixinUpdateKeyId)
  },
  beforeDestroy() {
    this.$EventBus.$off('assessment-saved', this.autoSaveMixinUpdateKeyId)
  },
  methods: {

    getAssessmentList () {
      this.assessmentList = []
      AssessmentToolInfoList({
        taskId: this.taskId,
        pageNo: 1,
        pageSize: 100
      }).then(res => {
        this.$logger.info('getAssessmentList res', res)
        if (res.code === 0) {
          res.result.records.forEach(item => {
            const assessment = {
              ...item
            }
            assessment.headerList = item.headerListJson ? JSON.parse(item.headerListJson) : []
            assessment.bodyList = item.bodyListJson ? JSON.parse(item.bodyListJson) : []
            assessment.extraCriteriaBodyList = item.extraCriteriaBodyListJson ? JSON.parse(item.extraCriteriaBodyListJson) : []
            delete assessment.headerListJson
            delete assessment.bodyListJson
            delete assessment.extraCriteriaBodyListJson
            this.assessmentList.push(assessment)
          })

          this.$logger.info('init assessmentList', this.assessmentList)
          if (this.assessmentList.length) {
            this.activeAssessmentTableKey = this.assessmentList[0].key
          }
        } else {
          this.$message.error('getAssessmentList error. ' + res.message)
        }
      })
    },

    autoSaveMixinUpdateKeyId (data) {
      this.$logger.info('autoSaveMixinUpdateKeyId', data)
      const { key, id } = data
      this.assessmentList.forEach(item => {
        if (item.key === key) {
          item.id = id
        }
      })
    },
    handleAddAssessmentTool (type) {
      this.$logger.info('handleAddAssessmentTool', type)
      const config = this.assessmentToolConfig[type]
      if (config) {
        const assessmentTool = JSON.parse(JSON.stringify(config))
        assessmentTool.key = Date.now().toString(36) + '_' + Math.random().toString(36).substr(2)
        assessmentTool.taskId = this.taskId
        assessmentTool.sort = this.assessmentList.length
        if (!assessmentTool.bodyList.length) {
          assessmentTool.bodyList.push(this.generateEmptyRowByAssessment(assessmentTool))
        }
        this.assessmentList.push(assessmentTool)
        this.$logger.info('add assessment tool', assessmentTool)
        this.activeAssessmentTableKey = assessmentTool.key
      }
    },
    generateEmptyRowByAssessment(assessment) {
      const row = {
        key: Date.now().toString(36) + '_' + Math.random().toString(36).substr(2)
      }
      assessment.headerList.forEach(item => {
        row[item.type] = {
          display: item.type === HeaderType.yes ? 'YES' : (item.type === HeaderType.no ? 'NO' : null),
          type: item.type
        }
      })
      return row
    },

    handleDeleteAssessmentTool (key) {
      this.$logger.info('handleDeleteAssessmentTool', key)
      this.assessmentList.splice(this.assessmentList.findIndex(item => item.key === key), 1)
    },

    handleSelectActiveTable (assessmentTable) {
      this.$logger.info('handleSelectActiveTable', assessmentTable)
      this.activeAssessmentTableKey = assessmentTable.key
    },

    showAssessmentToolList () {
      this.assessmentToolListVisible = true
    },

    handleInsertSelectAssessmentTool (selectedAssessmentList) {
      this.$logger.info('handleInsertSelectAssessmentTool', selectedAssessmentList)
      const newAssessmentKeyList = []
      selectedAssessmentList.forEach(item => {
        const assessment = {
          ...item
        }
        assessment.key = Date.now().toString(36) + '_' + Math.random().toString(36).substr(2)
        newAssessmentKeyList.push(assessment.key)
        assessment.taskId = this.taskId
        assessment.headerList = item.headerListJson ? JSON.parse(item.headerListJson) : []
        assessment.bodyList = item.bodyListJson ? JSON.parse(item.bodyListJson) : []
        assessment.extraCriteriaBodyList = item.extraCriteriaBodyListJson ? JSON.parse(item.extraCriteriaBodyListJson) : []
        delete assessment.id
        delete assessment.createBy
        delete assessment.createTime
        delete assessment.createUserId
        delete assessment.headerListJson
        delete assessment.bodyListJson
        delete assessment.extraCriteriaBodyListJson
        this.assessmentList.push(assessment)
      })
      setTimeout(() => {
       this.$nextTick(() => {
         this.$logger.info('newAssessmentKeyList', newAssessmentKeyList)
         this.$refs.assessmentTool.forEach(compRef => {
           if (newAssessmentKeyList.includes(compRef.assessment.key)) {
             compRef.saveAssessment()
           }
         })
         this.assessmentToolListVisible = false
       })
      }, 0)
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
