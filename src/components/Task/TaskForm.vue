<template>
  <div class="task-form-wrapper split-task">
    <a-row class="unit-content">
      <a-col span="24" class="main-content">
        <a-form-model :model="form" class="my-form-wrapper">
          <div class="form-block-wrapper">

            <div class="form-block" >
              <a-form-item label="Task name" >
                <a-input v-model="form.name" placeholder="Enter Course Name" class="my-form-input"/>
              </a-form-item>
            </div>

            <div class="form-block over-form-block" id="overview" >
              <a-form-model-item class="task-audio-line" label="Task details" ref="overview">
                <a-textarea autoSize v-model="form.overview" placeholder="Overview" allow-clear />
              </a-form-model-item>
            </div>

            <div class="form-block taskType" >
              <a-form-model-item class="task-audio-line" ref="taskType">
                <div slot='label'>
                  Choose Task Type(<span style='font-size: 13px'>Formative Assessment/ Summative Assessment/ Activity</span>)
                </div>
                <div class='self-type-wrapper'>
                  <div class='self-field-label'>
                    <div
                      :class="{'task-type-item': true, 'green-active-task-type': form.taskType === 'FA'}"
                      @click.stop.prevent="handleSelectTaskType('FA')">FA
                    </div>
                    <div
                      :class="{'task-type-item': true, 'red-active-task-type': form.taskType === 'SA'}"
                      @click.stop.prevent="handleSelectTaskType('SA')">SA
                    </div>
                    <div
                      :class="{'task-type-item': true, 'task-type-activity': true,'blue-active-task-type': form.taskType === 'Activity'}"
                      @click.stop.prevent="handleSelectTaskType('Activity')">
                      <a-tooltip title='Teaching/Learning Activity' placement='top'>Activity</a-tooltip>
                    </div>
                  </div>
                </div>
              </a-form-model-item>
            </div>

            <a-form-model-item class="img-wrapper">

              <div class="form-block form-question" v-if="associateQuestionList.length > 0">
                <a-form-model-item label="Choose Key questions">
                  <a-select
                    :getPopupContainer="trigger => trigger.parentElement"
                    size="large"
                    class="my-big-select"
                    v-model="form.questionIds"
                    mode="multiple"
                    placeholder="Choose Key questions"
                    option-label-prop="label"
                  >
                    <a-select-option v-for="(item,index) in associateQuestionList" :value="item.id" :label="item.name" :key="index">
                      <span class="question-options">
                        {{ item.name }}
                      </span>
                      From Unit Plan({{ item.unitName }})
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </div>

              <div class="form-block" >
                <a-form-item label="Set learning objectives" >
                  <a-button type="primary" @click="handleSelectDescription">
                    <div class="btn-text" style="line-height: 20px">
                      Add Learning Objectives
                    </div>
                  </a-button>
                </a-form-item>

                <!--knowledge tag-select -->
                <ui-learn-out ref="learnOut" :learn-outs="form.learnOuts" @remove-learn-outs="handleRemoveLearnOuts" v-if="form.learnOuts.length" />
                <div class='form-block-label'>
                  <a-switch v-model='materialListFlag' @change='handleMaterialListFlagChange' />
                  Material list
                </div>
                <div class='material-list'>
                  <div
                    class='material-item'
                    v-for='(materialItem, mIndex) in form.materialList'
                    :key='mIndex'>
                    <a-row :gutter='[16,16]'>
                      <a-col span='8'>
                        <a-input
                          v-model='materialItem.name'
                          aria-placeholder='Enter material name'
                          placeholder='Enter material name'/>
                      </a-col>
                      <a-col span='14'>
                        <a-tooltip placement='topLeft'>
                          <template slot='title'>
                            The link is provided to help other users or students prepare(purchase) the material
                            for this task
                          </template>
                          <a-input
                            v-model='materialItem.link'
                            aria-placeholder='Enter URL'
                            placeholder='Enter URL' >
                            <a-icon slot='prefix' type='link' />
                          </a-input>
                        </a-tooltip>
                      </a-col>
                      <a-col span='2'>
                        <div class='material-icon'>
                          <a-icon
                            type='plus-circle'
                            :style="{ fontSize: '16px' }"
                            v-if='mIndex === (form.materialList.length - 1)'
                            @click='handleAddMaterial' />
                          <img
                            src='~@/assets/icons/evaluation/delete.png'
                            v-if='mIndex < (form.materialList.length - 1)'
                            class='delete-icon'
                            @click='handleRemoveMaterialItem(materialItem, mIndex)' />
                        </div>
                      </a-col>
                    </a-row>
                  </div>
                </div>
              </div>

              <div class="form-block task-action-line">
                <a-button :loading="loadSaving" class='classcipe-btn' type='primary' @click="handleAddSubTask">
                  Next
                </a-button>
              </div>
            </a-form-model-item></div>
        </a-form-model>
      </a-col>
    </a-row>
    <a-modal
      v-model="selectSyncDataVisible"
      :footer="null"
      destroyOnClose
      width="1200px"
      :dialog-style="{ top: '20px' }"
      :title="null"
      @ok="selectSyncDataVisible = false"
      @cancel="selectSyncDataVisible = false">
      <div class="link-content-wrapper">
        <!-- 此处的questionIndex用于标识区分是哪个组件调用的，返回的事件数据中会带上，方便业务数据处理，可随意写，可忽略-->
        <new-browser
          ref="newBrowser"
          :select-mode="selectModel.syncData"
          question-index="_questionIndex_1"
          :show-menu="[ NavigationType.specificSkills,
                        NavigationType.centurySkills,
                        NavigationType.learningOutcomes,
                        NavigationType.idu,]"
          :default-active-menu="NavigationType.learningOutcomes"
          :recommend-data="recommendData"
          :selected-list="selectedList"
          :selected-id="selectedIdList"
          @select-big-idea="handleSelectListData"
          @select-sync="handleSelectListData"
          @select-curriculum="handleSelectCurriculum"
          @select-subject-specific-skill="handleSelectSubjectSpecificSkillListData"
          @select-century-skill="handleSelect21CenturySkillListData"
          @select-recommend="handleSelectRecommendData"
          @cancel-select="handleCancelSelectData"
          @ensure-select="handleEnsureSelectData"
        />
      </div>
    </a-modal>
  </div>
</template>

<script>
import * as logger from '@/utils/logger'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import { typeMap } from '@/const/teacher'
import { GetMyGrades } from '@/api/teacher'
import InputSearch from '@/components/UnitPlan/InputSearch'
import SdgTagInput from '@/components/UnitPlan/SdgTagInput'
import NewUiClickableKnowledgeTag from '@/components/UnitPlan/NewUiClickableKnowledgeTag'
import SkillTag from '@/components/UnitPlan/SkillTag'
import { formatLocalUTC } from '@/utils/util'
import MyContentSelector from '@/components/MyContent/MyContentSelector'
import RelevantTagSelector from '@/components/UnitPlan/RelevantTagSelector'
import { TemplateTypeMap } from '@/const/template'
import { commonAPIUrl } from '@/api/common'
import { SubjectTree } from '@/api/subject'
import { formatSubjectTree } from '@/utils/bizUtil'
import UiLearnOut from '@/components/UnitPlan/UiLearnOut'
import { SelectModel } from '@/components/NewLibrary/SelectModel'
import { NavigationType } from '@/components/NewLibrary/NavigationType'
import NewBrowser from '@/components/NewLibrary/NewBrowser'
import CustomTag from '@/components/UnitPlan/CustomTag'
import { UtilMixin } from '@/mixins/UtilMixin'

export default {
  name: 'TaskForm',
  components: {
    ContentTypeIcon,
    InputSearch,
    SdgTagInput,
    NewBrowser,
    NewUiClickableKnowledgeTag,
    SkillTag,
    MyContentSelector,
    CustomTag,
    RelevantTagSelector,
    UiLearnOut
  },
  props: {
    taskId: {
      type: String,
      default: ''
    },
    pptTitle: {
      type: String,
      default: ''
    },
    selectIds: {
      type: Array,
      default: () => {
        return []
      }
    },
    taskPrefix: {
      type: String,
      default: '',
      required: true
    },
    parentFormData: {
      type: Object,
      required: true
    },
    selectedPageItemData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  mixins: [UtilMixin],
  data () {
    return {
      contentType: typeMap,
      templateTypeMap: TemplateTypeMap,

      creating: false,
      loadSaving: false,

      leftAddExpandStatus: false,
      selectLinkContentVisible: false,
      viewInGoogleSlideVisible: false,
      selectTemplateVisible: false,
      showAddAudioVisible: false,

      labelCol: { span: 4 },
      wrapperCol: { span: 18 },

      presentationLink: null,
      form: {
        selectPageObjectIds: [],
        __taskId: null,
        id: null,
        image: '',
        presentationId: '',
        name: 'Untitled Task',
        overview: '',
        tasks: [],
        status: 0,
        taskType: '',
        createTime: '',
        updateTime: '',
        subjectIds: [],
        gradeIds: [],
        bloomCategories: '',
        learnOuts: [],
        materialList: []
      },
      // Grades
      gradeList: [],
      // SubjectTree
      subjectTree: [],

      // 将questions转成对象
      questionTotal: 0,
      questionMaxIndex: 0,
      questionPrefix: '__question_',
      questionDataObj: {
      },

      extKnowledgeTagList: [],
      extSkillTagList: [],

      audioUrl: null,
      currentUploading: false,

      associateQuestionList: [],

      selectModel: SelectModel,

      NavigationType: NavigationType,
      groupNameList: [],
      groupNameListOther: [],
      syncData: [],
      selectSyncDataVisible: false,
      selectedSyncList: [],
      // 已选择的大纲知识点描述数据
      selectedCurriculumList: [],
      // specific skill
      selectedSpecificSkillList: [],
      // century skill
      selectedCenturySkillList: [],
      selectedRecommendList: [],
      selectedIduList: [],
      uploading: false,
      taskNum: 1,

      parentData: null,
      recommendData: [],
      selectedIdList: [],

      selectedList: [],

      materialListFlag: false
    }
  },
  computed: {
    lastChangeSavedTime () {
      const time = this.form.updateTime || this.form.createTime
      if (time) {
        return formatLocalUTC(this.form.updateTime || this.form.createTime)
      } else {
        return ''
      }
    },
    selectedTemplateIdList () {
      const list = []
      this.selectedTemplateList.forEach(item => {
        list.push(item.id)
      })

      return list
    }
  },
  watch: {
    selectIds (value) {
      this.$logger.info('selectPageObjectIds update', value)
      this.form.selectPageObjectIds = value
    },
    'parentFormData.image': {
      handler (v) {
        this.$logger.info('parentFormData.image', v)
        this.form.image = v
      },
      deep: true
    },
    'parentFormData.customTags': {
      handler (v) {
        this.$logger.info('parentFormData.customTag', v)
        this.form.customTags = v
      },
      deep: true
    }
  },
  created () {
    logger.info('add task created ' + this.taskId + ' ' + this.$route.path)
    this.initForm()
    this.initData()
  },
  methods: {
    initForm() {
      this.questionPrefix = '' + this.taskPrefix + '__question_'
      this.parentData = JSON.parse(JSON.stringify(this.parentFormData))
      const formData = JSON.parse(JSON.stringify(this.parentFormData))
      formData.id = null
      formData.selectPageObjectIds = []
      formData.materialList = []
      formData.learnOuts = []
      formData.__taskId = '__taskId_' + this.taskPrefix
      formData.name = formData.name ? (formData.name + ' sub task' + this.taskNum) : 'sub task' + this.taskNum
      this.$logger.info('TaskForm parentFormData', formData)
      this.$logger.info('TaskForm selectedPageItemData', this.selectedPageItemData)
      this.form = formData
      this.$logger.info('questionPrefix ' + this.questionPrefix)
      this.$logger.info('questionDataObj ', this.questionDataObj)
    },
    initData () {
      logger.info('initData doing...')
      GetMyGrades().then((response) => {
        this.$logger.info('add task initData done', response)
        this.$logger.info('GetMyGrades', response.result)
        this.gradeList = response.result
      }).catch((e) => {
        this.$logger.error(e)
        this.$message.error(this.$t('teacher.add-task.init-data-failed'))
      })

       SubjectTree({ curriculumId: this.$store.getters.bindCurriculum }).then((response) => {
         logger.info('SubjectTree', response.result)
         let subjectTree = response.result
         subjectTree = formatSubjectTree(subjectTree)
         this.subjectTree = subjectTree
         logger.info('after format subjectTree', subjectTree)
      })
    },

    // 此处只是添加到外层的数组中，并未保存。
    handleAddSubTask () {
      logger.info('handleAddSubTask', this.form)

      if (this.form.selectPageObjectIds.length) {
        const taskData = JSON.parse(JSON.stringify(this.form))
        taskData.selectPageObjectIds = this.form.selectPageObjectIds
        const SubTaskData = {
          'taskId': this.taskId,
          'subTask': taskData
        }
        logger.info('add-sub-task', taskData)
        this.$emit('add-sub-task', SubTaskData)
        const formData = JSON.parse(JSON.stringify(this.parentFormData))
        formData.id = null
        this.form = formData
        this.materialListFlag = false
        this.form.name = ''
        this.form.overview = ''
        this.form.image = ''
        this.form.selectPageObjectIds = []
        this.form.learnOuts = []
        this.form.materialList = []

      } else {
        this.$message.warn('Please pick slide(s)')
      }
    },

    handleSelectTaskType (type) {
      this.$logger.info('handleSelectTaskType ' + type)
      this.form.taskType = type
      this.$emit('select-task-type', type)
    },

    handleSelectListData (data) {
      this.$logger.info('handleSelectListData', data)
      this.selectedSyncList = data
    },

    handleSelectCurriculum (data) {
      this.$logger.info('handleSelectCurriculum', data)
      this.selectedCurriculumList = data
    },

    handleSelectSubjectSpecificSkillListData (data) {
      this.selectedSpecificSkillList = data
      this.$logger.info('handleSelectSubjectSpecificSkillListData', data)
    },

    handleSelect21CenturySkillListData (data) {
      this.$logger.info('handleSelect21CenturySkillListData', data)
      this.selectedCenturySkillList = data
    },

    handleSelectRecommendData (data) {
      this.$logger.info('handleSelectRecommendData')
      this.selectedRecommendList = data
    },

    handleCancelSelectData () {
      this.selectedSyncList = []
      this.selectedCurriculumList = []
      this.selectedSpecificSkillList = []
      this.selectedCenturySkillList = []
      this.selectedIduList = []
      this.selectedRecommendList = []
      this.selectSyncDataVisible = false
    },

    handleEnsureSelectData () {
      this.$logger.info('handleEnsureSelectData',
        this.selectedCurriculumList,
        this.selectedSpecificSkillList,
        this.selectedCenturySkillList,
        this.selectedIduList,
        this.selectedRecommendList,
        this.selectedSyncList)
      this.$logger.info('mySelectedList', this.$refs.newBrowser.mySelectedList)
      this.$logger.info('learnOuts', this.form.learnOuts)
      this.form.learnOuts = this.$refs.newBrowser.mySelectedList
      this.$refs.newBrowser.selectedRecommendList.forEach(item => {
        const index = this.form.learnOuts.findIndex(dataItem => dataItem.knowledgeId === item.knowledgeId)
        if (index === -1) {
          this.form.learnOuts.push(item)
        }
      })
      this.$logger.info('learnOuts after selectedRecommendList', this.form.learnOuts)
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
      this.selectedIduList.forEach(data => {
        const filterLearnOuts = this.form.learnOuts.filter(item => item.knowledgeId === data.id)
        if (filterLearnOuts.length > 0) {
          return
        }
        this.form.learnOuts.push({
          knowledgeId: data.knowledgeData.id,
          name: data.knowledgeData.name,
          tagType: data.knowledgeData.tagType,
          path: data.knowledgeData.path,
          tags: data.tags
        })
      })
      const selectList = this.selectedCurriculumList.concat(this.selectedSpecificSkillList).concat(this.selectedCenturySkillList)
      console.log(selectList)
      if (this.selectIdea) {
        if (selectList.length > 0) {
          this.form.inquiry = selectList[0].knowledgeData.name
        }
        this.selectSyncDataVisible = false
        return
      }
      selectList.forEach(data => {
        const filterLearnOuts = this.form.learnOuts.filter(item => item.knowledgeId === data.knowledgeId)
        if (filterLearnOuts.length > 0) {
          return
        }
        if (data.knowledgeData) {
          this.form.learnOuts.push({
            knowledgeId: data.knowledgeData.id,
            name: data.knowledgeData.name,
            tagType: data.knowledgeData.tagType
          })
        }
      })

      this.$logger.info('this.form.learnOuts', this.form.learnOuts)
      this.selectSyncDataVisible = false
      this.handleCancelSelectData()
    },
    handleRemoveLearnOuts (data) {
      this.$logger.info('handleRemoveLearnOuts', data)
      var index = this.form.learnOuts.findIndex(item => (item.knowledgeId === data.knowledgeId))
      if (index > -1) {
        this.form.learnOuts.splice(index, 1)
      }
    },
    handleSelectDescription () {
      this.selectedIdList = []
      const learnOutsListData = JSON.parse(JSON.stringify(this.parentData.learnOuts))
      learnOutsListData.forEach(item => {
        item.newPath = item.path.split('>')
        item.newPathName = item.newPath.slice(0, 4).join('>')
      })
      this.selectedList = JSON.parse(JSON.stringify(this.form.learnOuts))
      this.recommendData = [{
        fromName: this.parentData.name,
        fromTypeName: this.type2Name[this.contentType.task],
        list: learnOutsListData
      }]
      this.$logger.info('parentData.learnOuts', this.parentData.learnOuts)
      this.form.learnOuts.forEach(item => {
        if (item.knowledgeId) {
          this.selectedIdList.push(item.knowledgeId)
        } else {
          this.$logger.info('parentData selected id not exist ', item)
        }
      })
      this.$logger.info('selectedPageItemData', this.selectedPageItemData)
      if (this.selectedPageItemData.length) {
        this.$logger.info('selectedPageItemData exist ', this.selectedPageItemData)
        const pageItemLearnOuts = []
        this.selectedPageItemData.forEach(item => {
            item.data.learnOuts.forEach(data => {
              const exist = pageItemLearnOuts.find(item => data.knowledgeId === item.knowledgeId)
              this.$logger.info('add pageItemLearnOuts', data, 'existed ', !!exist)
              if (data.knowledgeId && !exist) {
                if (data && data.path) {
                  data.newPath = data.path.split('>')
                  data.newPathName = data.newPath.slice(0, 4).join('>')
                }
                pageItemLearnOuts.push(data)
              } else {
                if (exist) {
                  this.$logger.info('selected id existed ', data)
                } else {
                  this.$logger.info('selected id not exist ', data)
                }
              }
            })
        })
        this.recommendData.push({
          fromName: this.pptTitle,
          fromTypeName: 'PPT',
          list: pageItemLearnOuts
        })
      } else {
        this.$logger.info('selectedPageItemData empty!', this.selectedPageItemData)
      }
      this.$logger.info('handleSelectDescription recommendData', this.recommendData)
      this.selectSyncDataVisible = true
    },

    handleUploadImage (data) {
      logger.info('handleUploadImage', data)
      const formData = new FormData()
      formData.append('file', data.file, data.file.name)
      this.uploading = true
      this.$http.post(commonAPIUrl.UploadFile, formData, { contentType: false, processData: false, headers: { 'Content-Type': 'multipart/form-data' }, timeout: 60000 })
        .then((response) => {
          logger.info('handleUploadImage upload response:', response)
          this.form.image = this.$store.getters.downloadUrl + response.result
        }).catch(err => {
        logger.error('handleUploadImage error', err)
        this.$message.error(this.$t('teacher.add-unit-plan.upload-image-file-failed'))
      }).finally(() => {
        this.uploading = false
      })
    },

    handleDeleteImage (e) {
      logger.info('handleDeleteImage ', e)
      e.stopPropagation()
      e.preventDefault()
      this.form.image = null
    },

    handleMaterialListFlagChange(checked) {
      this.$logger.info('handleMaterialListFlagChange ', checked)
      if (checked) {
        if (this.form.materialList.length === 0) {
          this.handleAddMaterial()
        }
      } else {
        this.form.materialList = []
      }
      this.materialListFlag = checked
    },

    handleAddMaterial() {
      this.form.materialList.push({
        name: null,
        link: null
      })
      this.$logger.info('handleAddMaterial', this.form.materialList)
    },

    handleRemoveMaterialItem(item, index) {
      this.form.materialList = this.form.materialList.filter((it, idx) => idx !== index)
      this.$logger.info('handleRemoveMaterialItem ', this.form.materialList)
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.task-form-wrapper {
  padding-top: 10px;
  position: relative;
}

.tag-select-wrapper {
  position: absolute;
  left: 800px;
  top: 100px;
}

.task-header {
  padding-bottom: 16px;
  border-bottom: 1px solid  rgb(235, 238, 240);

  .nav-back-btn {
    padding-left: 0;
  }

  .unit-nav-title {
    color: @text-color;
    font-weight: bold;
  }

  .unit-last-change-time {
    line-height: 32px;
    color: @text-color-secondary;
  }

  .unit-right-action {
    display: flex;
    justify-content: flex-end;
  }
}

.unit-content {

  .main-content {

    .image-preview {
      img {
        max-width: 100%;
      }
    }

    p.ant-upload-text {
      color: @text-color;
    }

    .upload-container {
      padding: 16px 0;
    }

    .uploading-tips {
      padding-left: 10px;
    }

    .select-template {
      text-align: center;
    }

    .form-block-title {
      font-size: @font-size-lg;
      color: #000;
    }

    .form-block-action {
      padding: 10px 0 0 0;
      text-align: center;
    }

    .action-line {
      padding: 50px 0;
      display: flex;
      justify-content: center;
    }

    .question-item {
      padding-bottom: 24px;
      padding-top: 24px;
    }

    .content-blocks {
      position: relative;
      border: 1px dotted #fff;
      .sdg-delete-wrapper {
        transition: all 0.2s ease-in;
        display: none;
        position: absolute;
        text-align: center;
        right: 15px;
        top: 80px;
        line-height: 50px;
        width: 50px;
        height: 50px;
        cursor: pointer;
        color: @link-hover-color;
        z-index: 1000;
      }

      .knowledge-delete-wrapper {
        transition: all 0.2s ease-in;
        display: none;
        position: absolute;
        text-align: center;
        right: 15px;
        top: 180px;
        line-height: 50px;
        width: 50px;
        height: 50px;
        cursor: pointer;
        color: @link-hover-color;
        z-index: 1000;
      }

      .tag-select {
        padding-bottom: 24px;

        .tag-label {
          color: @text-color-secondary;
          text-align: center;
          padding-bottom: 5px;
        }
      }
    }

    .img-wrapper {
      position: relative;
    }
    .delete-img {
      position: absolute;
      top: -10px;
      right: -10px;
      background-color: #fafafa;
      border-radius: 50%;
      height: 30px;
      width: 30px;
      text-align: center;
      vertical-align: middle;
      color: @red-5;
      z-index: 100;
      font-size: 20px;
    }
  }

  .add-to-item {
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
    padding: 0 5px;
    box-sizing: border-box;
    cursor: pointer;
    &:hover {
      background-color: fade(@outline-color, 20%);
    }

    a {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      white-space: nowrap;

      i {
        padding-right: 5px;
      }
    }

    .material-name {
      max-width: 120px;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      white-space: nowrap;
    }

    .hover-delete {
      color: @red-4;
      display: none;
      cursor: pointer;
      justify-content: center;
      align-items: center;
      padding-left: 5px;
    }

    &:hover {
      .hover-delete {
        display: flex;
      }
    }
  }

  .long-form-item-label {
    padding: 10px;
  }
}

.add-content-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  .add-content-item {
    width: 40%;
    margin-right: 10px;
    margin-left: 10px;
    margin-bottom: 20px;
    padding: 20px;
    border: 1px solid #eee;
    cursor: pointer;

    &:hover {
      background-color: fade(@outline-color, 20%);
      border: 1px solid @primary-color;
    }
  }
}

.link-content-wrapper {

}

.select-template-wrapper {
  display: flex;
  cursor: pointer;
  user-select: none;
  flex-direction: column;

  .template-type-list {
    display: flex;
    flex-direction: row;
    justify-content: center;

    .template-type-item {
      padding: 10px 15px;
      max-height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      min-width: 70px;
    }

    .active-template-type {
      background-color: fade(@outline-color, 20%);
      color: @primary-color;
      border-radius: 40px;
    }
  }

  .template-list-wrapper {
    margin-top: 20px;
    min-height: 250px;

    .template-list {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: flex-start;
      flex-wrap: wrap;

      .template-item {
        background-size: cover;
        margin-right: 10px;
        margin-bottom: 10px;
        border: 1px solid #eee;
        padding: 0;
        box-sizing: border-box;
        width: 23%;
        box-shadow: 0 4px 4px 2px #fff;
        transition: all 0.2s ease-in;

        .template-cover {
          height: 150px;
          width: 100%;
          background-color: #ddd;
          box-sizing: border-box;
          padding: 0;
          border-bottom: 1px solid #eee;
        }

        &:hover {
          box-shadow: 0 4px 4px 2px #eee;
          border: 1px solid fade(@outline-color, 40%);
        }

        .template-info {
          padding: 10px;
          display: flex;
          position: relative;
          flex-direction: column;
          justify-content: flex-start;

          .template-name {
            font-weight: 500;
            font-size: 15px;
            z-index: 10;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            word-break: break-all;
          }
          .template-intro {
            z-index: 10;
            padding: 5px 0 0 0;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            word-break: break-all;
            color: rgba(0,0,0,.45);
            font-size: 12px;
          }

          .template-select-icon {
            z-index: 50;
            position: absolute;
            right: 5px;
            bottom: 5px;
            font-size: 10px;
            background-color: fade(@outline-color, 60%);
            padding: 2px 5px;
            color: #fff;
          }
        }
      }
    }
  }

  .template-action {
    padding: 10px 0;
    text-align: right;

    .create-loading {
      display: inline-block;
      margin-right: 20px;
    }
  }
}

.template-loading {
  margin-top: 20px;
  min-height: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.no-template {
  margin-top: 20px;
}

.task-type-line {
  position: relative;
  .task-type {
    position: absolute;
    right: -100px;
    top: -5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    width: 90px;
    .task-type-item {
      margin-right: 10px;
      width: 33px;
      height: 33px;
      border-radius: 33px;
      border: 2px solid #ddd;
      font-weight: bold;
      display: flex;
      color: #bbb;
      align-items: center;
      justify-content: center;
    }

    .green-active-task-type {
      background: rgba(21, 195, 154, 0.1);
      border: 2px solid #15C39A;
      border-radius: 50%;
      font-weight: bold;
      color: #15C39A;
    }

    .red-active-task-type {
      background: rgba(255, 51, 85, 0.1);
      border: 2px solid #FF3355;
      border-radius: 50%;
      opacity: 1;
      font-weight: bold;
      color: #FF3355;
      opacity: 1;
    }
  }
}

.task-audio-line {
  position: relative;
  .task-audio {
    position: absolute;
    right: -55px;
    top: -30px;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;

    img {
      height: 40px;
    }
  }
}

.view-in-google-slider {
  display: flex;
  min-height: 100px;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  .view-line {
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: flex-start;

    .link-url {
      width: 100%;
      word-break: break-all;
      overflow: hidden;
    }

    .view-action {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      margin-top: 20px;
      text-align: right;
    }
  }
}

.select-relevant-tag {
  max-height: 60vh;
  overflow-y: scroll;
}

.action-line {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px;
  .button-item {
    margin-left: 10px;
  }
}

*::-webkit-scrollbar {
  width: 3px;
  height: 0;
}
*::-webkit-scrollbar-track {
  border-radius: 1px;
  background: rgba(0,0,0,0.00);
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.08);
}
/* 滚动条滑块 */
*::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: rgba(0,0,0,0.12);
  -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.2);
}

.audio-material-action {
  position: relative;
  display: flex;
  flex-direction: column;

  .uploading-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: fade(#eee, 80%);
    z-index: 100;
    .uploading {
      z-index: 110;
      position: absolute;
      display: flex;
      flex-direction: row;
      justify-content: center;
      width: 100px;
      left: 50%;
      top: 45%;
      margin-left: -50px;
    }
  }

  .action-item {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-right: 10px;
  }

  .action-item-column {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 15px 0;
    .action-tips {
      line-height: 32px;
      cursor: pointer;
      user-select: none;
    }
  }
}

.material-action {
  padding: 10px 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.audio-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 30px;
  audio {
    height: 30px;
    border: none;
    outline: none;
  }

  span {
    padding: 0 10px;
    color: red;
    cursor: pointer;
  }
}

.save-task {
  display: flex;
  padding: 10px 0;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
}

.btn-icon {
  height: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  img {
    height: 15px;
    width: 15px;
  }
}

.btn-text {
  font-family: Inter-Bold;
  line-height: 24px;
  padding-left: 5px;
}

.subject-grade-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  .select-item {
    width: 280px;
  }
}

.form-block {
  width: 100%;
}

.ant-form-item label {
  font-size: 16px;
  font-weight: 500;
  font-family: Inter-Bold;
  line-height: 24px;
}

.self-type-wrapper {
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  .self-field-label {
    width: 180px;
    display: flex;
    flex-direction: row;
    align-items: center;

    .task-type-item {
      margin-right: 10px;
      width: 33px;
      height: 33px;
      border-radius: 33px;
      border: 2px solid #ddd;
      font-weight: bold;
      display: flex;
      color: #bbb;
      align-items: center;
      justify-content: center;
    }

    .task-type-activity {
      width: 70px;
      border-radius: 50px;
    }

    .green-active-task-type {
      background: rgba(21, 195, 154, 0.1);
      border: 2px solid #15C39A;
      border-radius: 50%;
      font-weight: bold;
      color: #15C39A;
    }

    .red-active-task-type {
      background: rgba(255, 51, 85, 0.1);
      border: 2px solid #FF3355;
      border-radius: 50%;
      opacity: 1;
      font-weight: bold;
      color: #FF3355;
      opacity: 1;
    }

    .blue-active-task-type {
      background: rgb(230, 247, 255);
      border: 2px solid rgb(145, 213, 255);
      border-radius: 50px;
      opacity: 1;
      font-weight: bold;
      color: rgb(24, 144, 255);
    }
  }

  .self-type-filter {
    width: 500px;
  }
}

.form-block-wrapper {
  display: flex;
  flex-direction: column;
}

.task-action-line {
  margin-top: 15px;
  padding-right: 10px;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: flex-end;
}

.classcipe-btn {
  line-height: 20px;
}

.material-list {
  margin-top: 10px;
}

.material-icon {
  height: 35px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.delete-icon {
  width: 35px;
}

</style>
