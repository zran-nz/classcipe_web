<template>
  <a-card :bordered="false" :bodyStyle="{ padding: '16px 24px', height: '100%', minHeight: '500px' }">
    <a-row class="evaluation-header">
      <a-col span="12">
        <a-space>
          <a-button shape="round" class="nav-back-btn" type="link" @click="goBack"> <a-icon type="left" /> {{ $t('teacher.add-evaluation.back') }}</a-button>
          <span class="unit-last-change-time" v-if="lastChangeSavedTime">
            <span class="unit-nav-title">
              {{ form.name }}
            </span>
            <a-divider type="vertical" v-if="!!form.name" />
            {{ $t('teacher.add-evaluation.last-change-saved-at-time', {time: lastChangeSavedTime}) }}
          </span>
        </a-space>
      </a-col>
      <a-col span="12" class="unit-right-action">
        <a-space>
          <a-button shape="round" @click="handleSaveEvaluation"> <a-icon type="save" /> {{ $t('teacher.add-evaluation.save') }}</a-button>
          <a-button shape="round" type="primary" @click="handlePublishEvaluation"> <a-icon type="cloud-upload" /> {{ $t('teacher.add-evaluation.publish') }}</a-button>
          <a-button shape="round" @click="$refs.collaborate.visible = true"><a-icon type="share-alt" ></a-icon>Collaborate</a-button>
          <Collaborate ref="collaborate" :id="evaluationId" :type="contentType.evaluation" ></Collaborate>
        </a-space>
      </a-col>
    </a-row>
    <a-row class="unit-content" v-if="!contentLoading">
      <a-col span="3">
        <div class="unit-menu-list">
          <div class="menu-category-item">
            <associate-sidebar :name="form.name" :type="contentType.evaluation" :id="evaluationId" ref="associate"/>
          </div>
          <div class="menu-category-item">
            <div class="menu-sub-add-action">
              <div class="action-item" @click="selectLinkContentVisible = true">
                <a-icon type="link" /> {{ $t('teacher.add-evaluation.link-content') }}
              </div>
            </div>
          </div>
        </div>
      </a-col>
      <a-col span="21" class="main-content">
        <div class="rubric-content">
          <a-row :gutter="[16,24]">
            <a-col span="18">
              <div class="rubric-wrapper">
                <div class="rubric-name">
                  <a-input v-model="form.name" aria-placeholder="Name of the evaluation" placeholder="Name of the evaluation"/>
                </div>
                <div class="rubric-item">
                  <rubric-one
                    ref="rubric"
                    :description-list="evaluationTableList"
                    :init-raw-headers="initRawHeaders"
                    :init-raw-data="initRawData"
                    :allow-add-column="form.tableMode === 1"
                    v-if="form.tableMode !== 0"/>
                </div>
              </div>
            </a-col>
            <a-col span="6">
              <div class="toggle-wrapper">
                <div class="self-type">
                  <div class="self-type-item">
                    <div class="name" >
                      Student Evaluation
                    </div>
                    <div class="action-item">
                      <a-switch v-model="se"/>
                    </div>
                    <div class="name">
                      Peer Evaluation
                    </div>
                    <div class="action-item">
                      <a-switch v-model="pe"/>
                    </div>
                  </div>
                </div>
              </div>
            </a-col>
          </a-row>
        </div>
      </a-col>
    </a-row>

    <a-modal
      v-model="selectLinkContentVisible"
      :footer="null"
      :maskClosable="false"
      :closable="false"
      destroyOnClose
      width="80%"
      @ok="selectLinkContentVisible = false"
      @cancel="selectLinkContentVisible = false">
      <div class="link-content-wrapper">
        <my-content-selector :filter-type-list="['task', 'lesson']" :mode="displayMode.Evaluatioin"/>
      </div>
    </a-modal>

    <a-modal
      v-model="associateEvaluationVisible"
      :footer="null"
      :maskClosable="false"
      :closable="false"
      destroyOnClose
      @ok="associateEvaluationVisible = false"
      @cancel="associateEvaluationVisible = false">
      <div class="evaluation-modal">
        <div class="evaluation-header">
          <div class="my-modal-header">
            <div class="my-modal-icon">
              <img src="~@/assets/icons/evaluation/evaluation_icon.png" alt="rubric">
            </div>
            <div class="my-modal-title">
              Create evaluation
            </div>
          </div>
        </div>
        <div class="associate-evaluation">
          <div class="tips-area">
            <img src="@/assets/icons/evaluation/Collaboration-Develope-Website@2x.png" alt="">
          </div>
          <div class="tips">
            Evaluation can be added to a lesson or task
          </div>
        </div>
        <div class="associate-my-content-action">
          <a-button shape="round" type="primary" @click="selectLinkContentVisible = true">Open My Content</a-button>
        </div>
      </div>
    </a-modal>

    <a-modal
      v-model="selectRubricVisible"
      :footer="null"
      :maskClosable="false"
      :closable="false"
      width="600px"
      destroyOnClose>
      <div class="rubric">
        <div class="rubric-header">
          <div class="my-modal-header">
            <div class="my-modal-icon">
              <img src="~@/assets/icons/evaluation/rubric_icon.png" alt="rubric">
            </div>
            <div class="my-modal-title">
              Choose rubric format
            </div>
          </div>
        </div>
        <div class="select-rubric-wrapper">
          <div
            :class="{
              'rubric-item': true,
              'active-rubric': tableMode === 1
            }"
            @click="handleSelectRubric(1)"
          >
            <div class="rubric-preview">
              <img src="~@/assets/icons/evaluation/rubric1.png" alt="rubric">
            </div>
            <div class="rubric-active-icon">
              <a-icon type="check-circle" theme="filled"/>
            </div>
          </div>
          <div
            :class="{
              'rubric-item': true,
              'active-rubric': tableMode === 2
            }"
            @click="handleSelectRubric(2)"
          >
            <div class="rubric-preview">
              <img src="~@/assets/icons/evaluation/rubric2.png" alt="rubric">
            </div>
            <div class="rubric-active-icon">
              <a-icon type="check-circle" theme="filled"/>
            </div>
          </div>
        </div>
        <div class="select-rubric-action">
          <a-button shape="round" style="width: 80px;" type="primary" @click="handleEnsureSelectRubric">Ok</a-button>
        </div>
      </div>
    </a-modal>

    <a-modal
      v-model="showRelevantQuestionVisible"
      :footer="null"
      :maskClosable="false"
      :closable="false"
      destroyOnClose
      top="50px"
      width="50%"
      title="Select existing tags from associated content for insertion"
      @ok="showRelevantQuestionVisible = false"
      @cancel="showRelevantQuestionVisible = false">
      <div class="select-relevant-tag">
        <relevant-tag-selector :relevant-question-list="relevantQuestionList" @update-selected="handleUpdateSelected"/>
      </div>
      <div class="action-line">
        <a-button shape="round" @click="handleCancelSelectedRelevant" class="button-item">Cancel</a-button>
        <a-button shape="round" @click="handleConfirmSelectedRelevant" type="primary" class="button-item">Confirm</a-button>
      </div>
    </a-modal>

    <a-skeleton :loading="contentLoading" active>
    </a-skeleton>
  </a-card>
</template>

<script>

import * as logger from '@/utils/logger'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import { typeMap } from '@/const/teacher'
import { UpdateContentStatus, Associate } from '@/api/teacher'
import InputSearch from '@/components/UnitPlan/InputSearch'
import { TemplatesGetTemplates } from '@/api/template'
import { MyContentEventBus, MyContentEvent } from '@/components/MyContent/MyContentEventBus'
import { EvaluationQueryById, EvaluationAddOrUpdate } from '@/api/evaluation'
import { TaskQueryById } from '@/api/task'
import { LessonQueryById } from '@/api/myLesson'
import { formatLocalUTC } from '@/utils/util'
import MyContentSelector from '@/components/MyContent/MyContentSelector'
import RelevantTagSelector from '@/components/UnitPlan/RelevantTagSelector'
import { TemplateTypeMap } from '@/const/template'
import DisplayMode from '@/components/MyContent/DisplayMode'
import RubricOne from '@/components/Evaluation/RubricOne'
import AssociateSidebar from '@/components/Associate/AssociateSidebar'
import Collaborate from '@/components/UnitPlan/Collaborate'

const TagOriginType = {
  Origin: 'Origin',
  Search: 'Search',
  Description: 'Description',
  Create: 'Create',
  Extension: 'Extension'
}

export default {
  name: 'AddEvaluation',
  components: {
    RubricOne,
    ContentTypeIcon,
    InputSearch,
    MyContentSelector,
    RelevantTagSelector,
    AssociateSidebar,
    Collaborate
  },
  props: {
    evaluationId: {
      type: String,
      default: null
    },
    mode: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      contentLoading: true,
      referenceLoading: false,
      contentType: typeMap,
      templateTypeMap: TemplateTypeMap,
      displayMode: DisplayMode,

      creating: false,

      selectLinkContentVisible: false,
      associateEvaluationVisible: false,
      selectRubricVisible: false,

      labelCol: { span: 4 },
      wrapperCol: { span: 18 },

      form: {
        id: null,
        name: 'Unnamed Evaluation',
        status: 0,
        se: 0,
        pe: 0,
        table: [],
        tableMode: 0,
        createTime: '',
        updateTime: ''
      },

      // 待选择的unit plan中的描述标签
      relevantQuestionList: [],
      showRelevantQuestionVisible: false,
      relevantSelectedQuestionList: [],

      subKnowledgeId2InfoMap: new Map(),
      descriptionId2InfoMap: new Map(),
      audioUrl: null,
      currentUploading: false,

      evaluationTableList: [],
      initRawHeaders: [],
      initRawData: [],
      se: false,
      pe: false,
      tableMode: 0
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
    }
  },
  created () {
    logger.info('AddEvaluation created ' + this.evaluationId + ', mode ' + this.mode)
    this.form.id = this.evaluationId

    if (this.mode === 'create') {
      this.associateEvaluationVisible = true
    }
    // 初始化关联事件处理
    MyContentEventBus.$on(MyContentEvent.LinkToMyContentItem, this.handleLinkMyContent)
    this.initData()
  },
  beforeDestroy () {
    MyContentEventBus.$off(MyContentEvent.LinkToMyContentItem, this.handleLinkMyContent)
  },
  methods: {
    initData () {
      logger.info('initData doing...')
      EvaluationQueryById({ id: this.evaluationId }).then(response => {
        this.$logger.info('EvaluationQueryById response', response.result)
        const evaluationData = response.result
        this.form.name = evaluationData.name
        this.form.id = evaluationData.id
        this.form.se = evaluationData.se
        this.form.pe = evaluationData.pe
        this.pe = evaluationData.pe === 1
        this.se = evaluationData.se === 1
        this.form.tableMode = evaluationData.tableMode
        if (evaluationData.table.length) {
          const headers = evaluationData.table.splice(0, 1)[0]
          this.$logger.info('headers ', headers)
          const formatHeaders = []
          headers.forEach(header => {
            this.$logger.info('header ', header)
            if (!header.itemType.startsWith('user_ext')) {
              formatHeaders.push({
                label: header.itemName,
                previewLabel: header.itemName,
                type: header.itemType,
                editable: false,
                required: true
              })
            } else {
              formatHeaders.push({
                label: header.itemName,
                previewLabel: header.itemName,
                type: header.itemType,
                editable: false,
                required: false
              })
            }
          })
          this.$logger.info('formatHeaders', formatHeaders)
          if (formatHeaders.length) {
            this.initRawHeaders = formatHeaders
          }

          const bodyList = evaluationData.table
          const initRawData = []
          this.$logger.info('bodyList ', bodyList)
          bodyList.forEach(lineData => {
            const line = {}
            lineData.forEach(lineItem => {
                if (!lineItem.itemType.startsWith('keywords')) {
                  line[lineItem.itemType] = lineItem.itemName
                } else {
                  line[lineItem.itemType] = lineItem.itemName ? JSON.parse(lineItem.itemName) : []
                }
            })

            initRawData.push(line)
          })
          this.$logger.info('initRawData', initRawData)
          this.initRawData = initRawData
        }
      }).then(() => {
        this.contentLoading = false
        this.referenceLoading = false
      })
    },

    handleLinkMyContent (data) {
      this.$logger.info('handleLinkMyContent ', data)
      Associate({
        fromId: this.form.id,
        fromType: this.contentType.evaluation,
        toId: data.item.id,
        toType: data.item.type
      }).then(response => {
        this.$logger.info('handleLinkMyContent response ', response)
        // 刷新子组件的关联数据
        this.$refs.associate.loadAssociateData()
        this.loadRelevantTagInfo(data.item)
      }).finally(() => {
        this.selectLinkContentVisible = false
        this.associateEvaluationVisible = false
      })
    },

    loadRelevantTagInfo (item) {
      this.$logger.info('loadRelevantTagInfo', item)
      this.showRelevantQuestionVisible = false
      if (item.type === this.contentType.task) {
        TaskQueryById({ id: item.id }).then(response => {
          this.$logger.info('loadRelevantTagInfo LessonQueryById ' + item.id, response)
          const data = response.result
          this.formatRelevantData(data)
        })
      }

      if (item.type === this.contentType.lesson) {
        LessonQueryById({ id: item.id }).then(response => {
          this.$logger.info('loadRelevantTagInfo UnitPlanQueryById ' + item.id, response)
          const data = response.result
          this.formatRelevantData(data)
        })
      }
    },

    formatRelevantData (data) {
      this.$logger.info('formatRelevantData', data)
      if (data.suggestingTag && (data.suggestingTag.knowledgeTags.length || data.suggestingTag.skillTags.length)) {
        const questionMap = new Map()
        const relevantTagList = []

        // 处理knowledge tags
        const knowledgeTagMap = new Map()
        const knowledgeTagList = []
        data.suggestingTag.knowledgeTags.forEach(item => {
          if (!!item.subKnowledgeId && item.curriculumId === this.$store.getters.bindCurriculum) {
            if (!knowledgeTagMap.has(item.subKnowledgeId)) {
              knowledgeTagMap.set(item.subKnowledgeId, [])
              this.subKnowledgeId2InfoMap.set(item.subKnowledgeId, {
                ...item
              })
            }

            const tagList = knowledgeTagMap.get(item.subKnowledgeId)
            tagList.push({
              ...item,
              type: TagOriginType.Origin
            })
            knowledgeTagMap.set(item.subKnowledgeId, tagList)
          }
        })
        for (const [id, tagList] of knowledgeTagMap) {
          knowledgeTagList.push({
            id: tagList[0].id,
            tagList,
            info: this.subKnowledgeId2InfoMap.get(id)
          })
        }

        // 处理skill tags
        const skillTagMap = new Map()
        const skillTagList = []
        data.suggestingTag.skillTags.forEach(item => {
          if (!!item.descriptionId && item.curriculumId === this.$store.getters.bindCurriculum) {
            if (!skillTagMap.has(item.descriptionId)) {
              skillTagMap.set(item.descriptionId, [])
              this.descriptionId2InfoMap.set(item.descriptionId, {
                ...item
              })
            }

            const tagList = skillTagMap.get(item.descriptionId)
            tagList.push({
              ...item,
              type: TagOriginType.Origin
            })
            skillTagMap.set(item.descriptionId, tagList)
          }
        })
        for (const [id, tagList] of skillTagMap) {
          skillTagList.push({
            id: tagList[0].id,
            tagList,
            info: this.descriptionId2InfoMap.get(id)
          })
        }

        relevantTagList.push({
          questionName: 'Select from the relevant ',
          questionId: 1,
          skillTagList,
          knowledgeTagList
        })
        questionMap.clear()

        this.relevantQuestionList = relevantTagList
        this.$logger.info('relevantQuestionList', this.relevantQuestionList)
      } else {
        this.$logger.warn('formatRelevantData data empty')
      }

      // 选择rubric
      if (this.mode === 'create' && this.form.tableMode === 0) {
        this.selectRubricVisible = true
      }
    },

    handleSaveEvaluation () {
      logger.info('handleSaveEvaluation', this.$refs.rubric.headers, this.$refs.rubric.list)

      const headers = this.$refs.rubric.headers
      const dataList = this.$refs.rubric.list
      const evaluationData = {
        name: this.form.name,
        pe: this.pe ? 1 : 0,
        se: this.se ? 1 : 0,
        tableMode: this.form.tableMode,
        table: []
      }
      if (this.form.id) {
        evaluationData.id = this.form.id
      }
      const headerLine = []
      headers.forEach(item => {
        headerLine.push({
          itemType: item.type,
          itemName: item.label
        })
      })
      evaluationData.table.push(headerLine)
      this.$logger.info('header line ', headerLine)

      dataList.forEach(lineItem => {
        if ((lineItem['description'] || lineItem['level'])) {
          const line = []
          headers.forEach(header => {
            line.push({
              itemType: header.type,
              itemName: header.type === 'keywords' ? JSON.stringify(lineItem[header.type]) : lineItem[header.type]
            })
          })
          evaluationData.table.push(line)
        }
      })

      logger.info('evaluationData add line list', evaluationData)
      EvaluationAddOrUpdate(evaluationData).then((response) => {
        logger.info('EvaluationAddOrUpdate', response.result)
        if (response.success) {
            this.$router.replace('/teacher/evaluation-redirect/' + response.result.id)
        } else {
          this.$message.error(response.message)
        }
      })
    },
    handlePublishEvaluation () {
      logger.info('handlePublishEvaluation', {
        id: this.evaluationId,
        status: 1
      })

      if (this.evaluationId) {
        UpdateContentStatus({
          id: this.evaluationId,
          status: 1,
          type: this.contentType.evaluation
        }).then(response => {
          this.$logger.info('UpdateContentStatus response', response)
          // this.$message.success('Publish success')
          this.form.status = 1
        }).then(() => {
          this.$message.success(this.$t('teacher.add-evaluation.publish-success'))
          this.form.status = 1
        })
      }
    },

    goBack () {
      if (window.history.length <= 1) {
        this.$router.push({ path: '/teacher/main/created-by-me' })
        return false
      } else {
        this.$router.go(-1)
      }

      setTimeout(() => {
        this.$router.push({ path: '/teacher/main/created-by-me' })
      }, 500)
    },

    handleToggleTemplateType (templateType) {
      this.$logger.info('handleToggleTemplateType ' + templateType)
      this.templateLoading = true
      this.currentTemplateType = templateType
      this.selectedTemplateList = []
      TemplatesGetTemplates({ category: this.currentTemplateType }).then(response => {
        this.$logger.info('handleToggleTemplateType ', response)
        this.templateList = response.result
      }).finally(() => {
        this.templateLoading = false
      })
    },

    handleShowSelectTemplate () {
      this.selectedTemplateList = []
      this.templateLoading = false
      this.presentationLink = null
      this.selectTemplateVisible = true
    },

    handleSelectTemplate (template) {
      this.$logger.info('handleSelectTemplate ', template)
      if (this.selectedTemplateList.length && this.selectedTemplateList[0].id === template.id) {
        this.selectedTemplateList = []
      } else {
        this.selectedTemplateList = [template]
      }
    },

    handleOpenGoogleSlide (slideUrl) {
      this.$logger.info('handleOpenGoogleSlide ' + slideUrl)
      window.open(slideUrl, '_blank')
    },

    handleViewDetail (item) {
      this.$logger.info('handleViewDetail ', item)
      if (item.type === this.contentType['unit-plan']) {
        this.$router.push({
          path: '/teacher/unit-plan-redirect/' + item.id
        })
      }
    },

    handleUpdateSelected (data) {
      this.$logger.info('handleUpdateSelected', data)
      this.relevantSelectedQuestionList = data.questionList
    },

    handleCancelSelectedRelevant () {
      this.showRelevantQuestionVisible = false
      this.relevantSelectedQuestionList = []
    },

    handleConfirmSelectedRelevant () {
      this.$logger.info('handleConfirmSelectedRelevant', this.relevantSelectedQuestionList)
      this.showRelevantQuestionVisible = false
      const knowledgeDescriptionMap = new Map()
      const skillDescriptionMap = new Map()
      this.relevantSelectedQuestionList.forEach(item => {
        item.knowledgeTags.forEach(tagItem => {
          if (!knowledgeDescriptionMap.has(tagItem.description)) {
            knowledgeDescriptionMap.set(tagItem.description, [])
          }

          const tagList = knowledgeDescriptionMap.get(tagItem.description)
          if (tagList.indexOf(tagItem.name) === -1) {
            tagList.push(tagItem.name)
          }
          knowledgeDescriptionMap.set(tagItem.description, tagList)
        })

        item.skillTags.forEach(skillItem => {
          if (!skillDescriptionMap.has(skillItem.description)) {
            skillDescriptionMap.set(skillItem.description, [])
          }

          const tagList = skillDescriptionMap.get(skillItem.description)
          if (tagList.indexOf(skillItem.name) === -1) {
            tagList.push(skillItem.name)
          }
          skillDescriptionMap.set(skillItem.description, tagList)
        })
      })

      this.$logger.info('knowledgeDescriptionMap', knowledgeDescriptionMap)
      this.$logger.info('skillDescriptionMap', skillDescriptionMap)

      for (const [description, tagList] of knowledgeDescriptionMap) {
        this.evaluationTableList.push({
          description: description,
          tagList,
          type: 'knowledge'
        })
      }

      for (const [description, tagList] of skillDescriptionMap) {
        this.evaluationTableList.push({
          description: description,
          tagList,
          type: 'skill'
        })
      }
      this.$logger.info('evaluation table list', this.evaluationTableList)
    },

    handleSelectRubric (tableMode) {
      this.$logger.info('handleSelectRubric ' + tableMode)
      this.tableMode = tableMode
    },

    handleEnsureSelectRubric () {
      this.$logger.info('handleEnsureSelectRubric ' + this.tableMode)
      if (this.tableMode !== 0) {
        this.selectRubricVisible = false
        this.form.tableMode = this.tableMode

        if (this.form.tableMode === 1) {
          this.$logger.info('relevantQuestionList length', this.relevantQuestionList.length)
          if (this.relevantQuestionList.length) {
            this.showRelevantQuestionVisible = true
          } else {
            this.$logger.info('skip!, empty relevantQuestionList!')
          }
        }
      } else {
        this.$message.warn('Choose rubric format!')
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.evaluation-header {
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
  .unit-menu-list {
    margin-top: 10px;
    padding: 0 0 16px 0;

    .menu-category-item {
      user-select: none;
      cursor: pointer;

      .menu-category-item-label {
        font-weight: 600;
        padding: 10px 0;
      }

      .menu-category-list {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;

        .include-item {
          color: @primary-color;
          padding: 5px 0;
          max-width: 100%;
          text-decoration: underline;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }

      .menu-sub-add-action {
        cursor: pointer;

        .action-item {
          color: @primary-color;
          padding: 5px 0;
          text-decoration: underline;
        }
      }
    }

    .already-add-to-list {
      .add-to-type {
        border-right: none;
        color: @text-color;
        .add-to-type-label {
          padding: 15px 0 5px 0;
          cursor: pointer;
        }
        .add-to-list {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          line-height: 30px;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
          white-space: nowrap;
        }
      }
    }
  }

  .main-content {
    padding: 20px ;
    .rubric-content {
      padding: 30px 20px ;
      min-height: 400px;
      background: #FFFFFF;
      border: 1px solid #D8D8D8;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      opacity: 1;
      border-radius: 6px;
    }
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

      &:hover {
        border: 1px dotted @link-hover-color;
        box-sizing: border-box;
        .sdg-delete-wrapper {
          display: block;
        }
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

      &:hover {
        border: 1px dotted @link-hover-color;
        cursor: pointer;
        box-sizing: border-box;
        .knowledge-delete-wrapper {
          display: block;
        }
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

.evaluation-type-line {
  position: relative;
  .evaluation-type {
    position: absolute;
    right: -75px;
    top: -5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;

    .evaluation-type-item {
      margin-right: 5px;
      cursor: pointer;
      padding: 5px;
      line-height: 15px;
      width: 25px;
      height: 25px;
      font-size: 14px;
      color: @text-color-secondary;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
    }

    .active-evaluation-type {
      background-color: fade(@outline-color, 20%);
      color: @primary-color;
      border-radius: 50%;
      font-weight: 500;
    }
  }
}

.evaluation-audio-line {
  position: relative;
  .evaluation-audio {
    position: absolute;
    right: -35px;
    top: -20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
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
  width: 5px;
  height: 5px;
}
*::-webkit-scrollbar-track {
  border-radius: 3px;
  background: rgba(0,0,0,0.01);
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.02);
}
/* 滚动条滑块 */
*::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background: rgba(0,0,0,0.1);
  -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.1);
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

.evaluation-modal {
  display: flex;
  flex-direction: column;
  .evaluation-header {
    .my-modal-header {
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 40px;
      .my-modal-icon {
        img {
          height: 25px;
        }
      }
      .my-modal-title {
        padding-left: 10px;
        font-family: Inter-Bold;
        color: #000000;
      }
    }
  }
  .associate-evaluation {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid #D8D8D8;
    padding: 15px;
    border-radius: 6px;
    .tips-area {
      display: flex;
      justify-content: center;
      padding: 10px;
      box-sizing: border-box;
      margin-bottom: 20px;
      img {
        height: 150px;
      }
    }
    .tips {
      text-align: center;
      font-family: Inter-Bold;
      color: #000;
      margin: auto;
    }
  }

  .associate-my-content-action {
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    padding-right: 10px;
  }
}

.rubric {
  display: flex;
  flex-direction: column;

  .rubric-header {
    .my-modal-header {
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 40px;
      .my-modal-icon {
        img {
          height: 25px;
        }
      }
      .my-modal-title {
        padding-left: 10px;
        font-family: Inter-Bold;
        color: #000000;
      }
    }
    margin-bottom: 15px;
  }
  .select-rubric-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30px;

    .rubric-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: #FFFFFF;
      border-radius: 6px;
      position: relative;
      .rubric-preview {
        border-radius: 6px;
        padding: 35px 10px 10px 10px;
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        opacity: 1;
        border-radius: 6px;
        img {
          width: 245px;
          margin: 0;
          outline: none;
        }
      }

      .rubric-active-icon {
        position: absolute;
        top: 8px;
        left: 10px;
        opacity: 0;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .active-rubric {
      font-size: 20px;
      font-weight: bold;
      color: @primary-color;

      .rubric-active-icon {
        opacity: 1;
      }
    }
  }
}
.select-rubric-action {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding-right: 10px;
}

.rubric-wrapper {
  box-sizing: border-box;
  max-width: 100%;
  overflow-x: auto;
  padding: 0 40px 20px 20px;
  .rubric-name {
    width: 300px;
    margin-bottom: 15px;
    input {
      border-radius: 3px;
    }
  }
}

.toggle-wrapper {

  padding: 10px;
  .self-type {

    padding: 10px;
    border: 1px solid #F7F8FF;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    margin-top: 34px;
    display: flex;
    flex-direction: column;
    .self-type-item {
      margin-right: 20px;
      margin-bottom: 10px;
      display: flex;
      flex-direction: column;
      .name {
        padding: 5px 0;
        display: inline-block;
      }
    }
  }
}
</style>
