<template>
  <div class="task-library">
    <template v-if='taskLoading'>
      <div class='loading-task'>
        <img src="~@/assets/newBrowser/loading.gif" />
      </div>
    </template>
    <template v-if='!taskLoading'>
      <new-browser
        ref='newBrowser'
        question-index='_questionIndex_1'
        :show-curriculum='true'
        :show-menu='[NavigationType.specificSkills,
                     NavigationType.centurySkills,
                     NavigationType.learningOutcomes,
                     NavigationType.assessmentType,
                     NavigationType.idu]'
        :default-active-menu='NavigationType.learningOutcomes'
        :recommend-data='recommendData'
        :selected-list='selectedList'
        :selected-id='selectedIdList'
        @select-assessmentType='handleSelectAssessmentType'
        @select-sync='handleSelectListData'
        @select-curriculum='handleSelectCurriculum'
        @select-subject-specific-skill='handleSelectSubjectSpecificSkillListData'
        @select-century-skill='handleSelect21CenturySkillListData'
        @select-idu='handleSelectIdu'
        @select-recommend='handleSelectRecommend'
        @cancel-select='handleCancelSelectData'
        @ensure-select='handleEnsureSelectData'
      />
    </template>
  </div>
</template>

<script>
import { NavigationType } from '@/components/NewLibrary/NavigationType'
import * as logger from '@/utils/logger'
import { TaskAddOrUpdate, TaskQueryById } from '@/api/task'
import NewBrowser from '@/components/NewLibrary/NewBrowser'
import { SelectModel } from '@/components/NewLibrary/SelectModel'

export default {
  name: 'TaskLibrary',
  components: {
    NewBrowser
  },
  props: {
    taskId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      taskLoading: true,
      recommendData: [],
      recommendDataIdList: [],
      selectedList: [],
      selectedIdList: [],

      form: {
        id: null,
        image: '',
        copyFromSlide: null,
        presentationId: '',
        pageObjectIds: '',
        name: 'Untitled Task',
        overview: '',
        tasks: [],
        status: 0,
        taskType: '',
        createTime: '',
        createBy: '',
        updateTime: '',
        customTags: [],
        subjectIds: [],
        gradeIds: [],
        bloomCategories: '',
        learnOuts: [],
        selfOuts: [],
        showSelect: false,
        startDate: '',
        endDate: '',
        gradeId: undefined,
        materialList: [],
        taskClassList: [],
        customFieldData: null
      },

      selectedSyncList: [],
      // 已选择的大纲知识点描述数据
      selectedCurriculumList: [],
      // specific skill
      selectedSpecificSkillList: [],
      // century skill
      selectedCenturySkillList: [],
      selectedAssessmentList: [],
      selectModel: SelectModel,

      selectedIduList: [],
      selectedRecommendList: [],

      NavigationType: NavigationType
    }
  },
  created() {
    this.loadTaskData(this.taskId)
  },
  methods: {

    loadTaskData(taskId) {
      logger.info('loadTaskData ' + taskId)
      TaskQueryById({
        id: taskId
      }).then(response => {
        logger.info('TaskQueryById ' + taskId, response.result)
        const taskData = response.result
        if (!taskData.materialList) {
          taskData.materialList = []
        }
        this.form = taskData
        this.selectedList = JSON.parse(JSON.stringify(this.form.learnOuts))
        this.form.learnOuts.forEach(item => {
          if (item.knowledgeId) {
            this.selectedIdList.push(item.knowledgeId)
          } else {
            this.$logger.info('parentData selected id not exist ', item)
          }
        })
      }).finally(() => {
        this.taskLoading = false
      })
    },

    handleSelectAssessmentType(data) {
      this.$logger.info('handleSelectAssessmentType', data)
      this.selectedAssessmentList = data
    },

    handleSelectListData(data) {
      this.$logger.info('handleSelectListData', data)
      this.selectedSyncList = data
    },

    handleSelectCurriculum(data) {
      this.$logger.info('handleSelectCurriculum', data)
      this.selectedCurriculumList = data
    },

    handleSelectSubjectSpecificSkillListData(data) {
      this.selectedSpecificSkillList = data
      this.$logger.info('handleSelectSubjectSpecificSkillListData', data)
    },

    handleSelect21CenturySkillListData(data) {
      this.$logger.info('handleSelect21CenturySkillListData', data)
      this.selectedCenturySkillList = data
    },

    handleSelectIdu(data) {
      this.$logger.info('handleSelectIdu', data)
      this.selectedIduList = data
    },

    handleSelectRecommend(data) {
      this.$logger.info('handleSelectRecommend', data)
      this.selectedRecommendList = data
    },

    handleCancelSelectData() {
      this.selectedSyncList = []
      this.selectedCurriculumList = []
      this.selectedSpecificSkillList = []
      this.selectedCenturySkillList = []
      this.selectedAssessmentList = []
      this.selectedIduList = []
      this.selectedRecommendList = []
      this.selectSyncDataVisible = false
    },

    handleEnsureSelectData() {
      this.$logger.info('handleEnsureSelectData',
        this.selectedCurriculumList,
        this.selectedSpecificSkillList,
        this.selectedCenturySkillList,
        this.selectedAssessmentList,
        this.selectedIduList,
        this.selectedRecommendList,
        this.selectedSyncList)
      this.$logger.info('mySelectedList', this.$refs.newBrowser.mySelectedList)
      this.$logger.info('learnOuts', this.form.learnOuts)
      const filterLearnOuts = this.$refs.newBrowser.mySelectedList.filter(item => (!item.hasOwnProperty('isSelfCustom') || (item.hasOwnProperty('isSelfCustom') && !item.isSelfCustom)))
      this.$logger.info('filterLearnOuts', filterLearnOuts)
      this.form.learnOuts = JSON.parse(JSON.stringify(filterLearnOuts))
      this.$refs.newBrowser.selectedRecommendList.forEach(item => {
        if (item.hasOwnProperty('isSelfCustom') && item.isSelfCustom) {
          // 自定义大纲不用判断重复，直接插入
          const copyItem = JSON.parse(JSON.stringify(item))
          copyItem.key = Math.random() + ''
          this.form.selfOuts.push(copyItem)
        } else {
          const index = this.form.learnOuts.findIndex(dataItem => dataItem.knowledgeId === item.knowledgeId)
          if (index === -1) {
            this.form.learnOuts.push(item)
          }
        }
      })
      this.selectedSyncList.forEach(data => {
        const filterLearnOuts = this.form.learnOuts.filter(item => item.knowledgeId === data.knowledgeId)
        if (filterLearnOuts.length > 0) {
          return
        }
        this.form.learnOuts.push({
          knowledgeId: data.knowledgeId,
          name: data.name,
          tags: data.tags,
          tagType: data.tagType,
          path: data.path
        })
      })

      this.selectedRecommendList.forEach(data => {
        if (!(data.hasOwnProperty('isSelfCustom') && data.isSelfCustom)) {
          const filterLearnOuts = this.form.learnOuts.filter(item => item.knowledgeId === data.knowledgeId)
          if (filterLearnOuts.length > 0) {
            return
          }
          this.form.learnOuts.push({
            knowledgeId: data.knowledgeId,
            name: data.name,
            tags: data.tags,
            tagType: data.tagType,
            path: data.path
          })
        }
      })

      this.selectedIduList.forEach(data => {
        const filterLearnOuts = this.form.learnOuts.filter(item => item.knowledgeId === data.id)
        if (filterLearnOuts.length > 0) {
          return
        }
        this.form.learnOuts.push({
          knowledgeId: data.knowledgeData.id,
          name: data.knowledgeData.name,
          tagType: data.knowledgeData.tagType,
          gradeId: data.knowledgeData.selectedGradeId,
          path: data.knowledgeData.path,
          tags: data.tags
        })
      })
      const selectList = this.selectedCurriculumList.concat(this.selectedSpecificSkillList).concat(this.selectedCenturySkillList)
        .concat(this.selectedAssessmentList)
      selectList.forEach(data => {
        const filterLearnOuts = this.form.learnOuts.filter(item => item.knowledgeId === data.knowledgeId)
        if (filterLearnOuts.length > 0) {
          return
        }
        this.form.learnOuts.push({
          knowledgeId: data.knowledgeData.id,
          name: data.knowledgeData.name,
          gradeId: data.knowledgeData.selectedGradeId,
          tagType: data.knowledgeData.tagType,
          path: data.knowledgeData.path
        })
      })
      this.$logger.info('this.form.learnOuts', this.form.learnOuts)
      this.selectSyncDataVisible = false
      this.autoSave()
    },

    async autoSave() {
      const taskData = Object.assign({}, this.form)
      if (taskData.customFieldData) {
        taskData.customFieldData = JSON.stringify(taskData.customFieldData)
      }
      logger.info('basic taskData', taskData)
      await TaskAddOrUpdate(taskData).then((response) => {
        logger.info('TaskAddOrUpdate', response.result)
        if (response.success) {
          this.$message.success('add successfully')
        } else {
          this.$message.error(response.message)
        }
      })
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";
.task-library {
  height: 100%;
  width: 100%;
  .loading-task {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      height: 200px;
    }
  }
}
</style>
