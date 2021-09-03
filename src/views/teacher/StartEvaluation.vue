<template>
  <div class="my-full-form-wrapper">
    <div class="form-header">
      <common-form-header
        ref="commonFormHeader"
        :form="form"
        :last-change-saved-time="lastChangeSavedTime"
        :show-collaborate="false"
        @back="goBack"
        @save="handleSaveEvaluation"
        @publish="handlePublishEvaluation"
      />
    </div>
    <a-card :bordered="false" :bodyStyle="{ padding: '16px 24px', height: '100%', minHeight: '500px' }" :loading="contentLoading">
      <div>
        <div class="start-evaluation-content">
          <div class="class-student-wrapper">
            <div class="search-student">
              <a-input
                v-model="searchStudentInput"
                class="user-search"
                aria-placeholder="Search"
                placeholder="Search"
                @change="handleSearchStudent">
                <img slot="prefix" src="~@/assets/icons/collaborate/search.png" class="search-icon" />
              </a-input>
            </div>
            <div class="student-list-area">
              <div class="class-name">
                <div class="class-name-tag">
                  班级tag
                </div>
              </div>
              <div class="students-bar">
                <div class="student-bar-item">
                  All Students（{{ studentList.length }}）<a-icon type="caret-down" />
                </div>
              </div>
              <div class="student-list-wrapper">
                <div class="student-list">
                  <div :class="{'list-item': true, 'selected-student': selectedStudentEmailList.indexOf(student.email) !== -1}" v-for="(student, sIndex) in studentList" :key="sIndex" @click="handleClickStudent(student)">
                    <div class="student-avatar">
                      <img :src="student.avatar" alt="" v-if="student.avatar" />
                      <img slot="prefix" src="~@/assets/icons/evaluation/default_avatar.png" alt="" v-if="!student.avatar" />
                    </div>
                    <div class="student-name" :data-email="student.email">
                      {{ student.user_name }}
                    </div>
                    <div class="select-status-icon" v-if="(selectedStudentEmailList.indexOf(student.email) !== -1)">
                      <img slot="prefix" src="~@/assets/icons/evaluation/selected.png" />
                    </div>
                  </div>
                </div>
                <div class="select-mode-toggle">
                  <a-switch v-model="groupSelectMode" size="small" @change="handleToggleSelectMode" />
                  <div class="select-tips">
                    Single student Group
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="student-evaluation-form">
            <div class="rubric-wrapper">
              <div class="rubric-item" v-if="form.tableMode === 1 ">
                <rubric-one ref="rubric" :description-list="evaluationTableList" :init-raw-headers="initRawHeaders" :init-raw-data="initRawData" mode="evaluate"/>
              </div>
            </div>
            <div class="action-line">
              <a-button type="primary">Complete</a-button>
            </div>
          </div>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>

import * as logger from '@/utils/logger'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import { typeMap } from '@/const/teacher'
import { UpdateContentStatus, Associate, GetAssociate } from '@/api/teacher'
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
import CommonFormHeader from '@/components/Common/CommonFormHeader'
import { GetStudents } from '@/api/lesson'

const TagOriginType = {
  Origin: 'Origin',
  Search: 'Search',
  Description: 'Description',
  Create: 'Create',
  Extension: 'Extension'
}

export default {
  name: 'StartEvaluation',
  components: {
    RubricOne,
    ContentTypeIcon,
    InputSearch,
    CommonFormHeader,
    MyContentSelector,
    RelevantTagSelector
  },
  props: {
    evaluationId: {
      type: String,
      default: null
    },
    classId: {
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

      leftAddExpandStatus: false,
      selectLinkContentVisible: false,
      associateEvaluationVisible: false,
      selectRubricVisible: false,

      labelCol: { span: 4 },
      wrapperCol: { span: 18 },

      form: {
        id: null,
        name: '',
        status: 0,
        selfType: 0,
        table: [],
        tableMode: 0,
        createTime: '',
        updateTime: ''
      },

      // 关联信息
      ownerAssociateData: [],
      othersAssociateData: [],

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
      selfType: false,

      studentList: [],
      selectedStudentEmailList: [],
      searchStudentInput: '',
      groupSelectMode: false
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
    logger.info('AddEvaluation created ' + this.evaluationId)
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
        this.form.selfType = evaluationData.selfType
        this.selfType = evaluationData.selfType === 2
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
        GetAssociate({
          id: this.evaluationId,
          type: this.contentType.evaluation
        }).then(response => {
          this.$logger.info('EvaluationQueryById GetAssociate response', response)
          const associateData = response.result
          if (!(associateData.others.length && associateData.owner.length)) {
            this.associateEvaluationVisible = true
          } else {
            this.ownerAssociateData = associateData.owner
            this.othersAssociateData = associateData.others
            this.$logger.info('associateData ', associateData)
          }
        }).finally(() => {
          this.contentLoading = false
          this.referenceLoading = false
        })
      })

      // 获取班级学生
      // TODO 写死了class_id
      GetStudents({ class_id: '95585170' }).then(response => {
      // GetStudents({ class_id: this.classId }).then(response => {
        this.$logger.info('start evaluation GetStudents', response)
        this.studentList = response.data
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
        this.loadAssociate()
        this.loadRelevantTagInfo(data.item)
      }).finally(() => {
        this.selectLinkContentVisible = false
        this.associateEvaluationVisible = false
      })
    },
    loadAssociate () {
      GetAssociate({
        id: this.evaluationId,
        type: this.contentType.evaluation
      }).then(response => {
        this.$logger.info('GetAssociate response', response)
        const associate = response.result
        this.ownerAssociateData = associate.owner
        this.othersAssociateData = associate.others
        this.$logger.info('ownerAssociateData ', this.ownerAssociateData, 'othersAssociateData', this.othersAssociateData)
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
        selfType: this.selfType ? 2 : 1,
        tableMode: this.form.tableMode,
        table: []
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
        if (lineItem['description']) {
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
        })
      }
    },

    handleSelectEvaluationType (type) {
      this.$logger.info('handleSelectEvaluationType ' + type)
      this.form.selfType = type
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
      this.form.tableMode = tableMode
    },

    handleEnsureSelectRubric () {
      this.$logger.info('handleEnsureSelectRubric ' + this.form.tableMode)
      if (this.form.tableMode !== 0) {
        this.selectRubricVisible = false

        if (this.form.tableMode === 1) {
          this.showRelevantQuestionVisible = true
        }
      } else {
        this.$message.warn('Choose rubric format!')
      }
    },

    handleSearchStudent () {
      this.$logger.info('searchStudentInput ' + this.searchStudentInput)
    },

    handleClickStudent (student) {
      this.$logger.info('handleClickStudent', student)
      if (this.groupSelectMode) {
        this.$logger.info('groupSelectMode')
        const index = this.selectedStudentEmailList.indexOf(student.email)
        if (index === -1) {
          this.selectedStudentEmailList.push(student.email)
        } else {
          this.selectedStudentEmailList.splice(index, 1)
        }
      } else {

      }
    },

    handleToggleSelectMode () {
      this.$logger.info('handleToggleSelectMode', this.groupSelectMode)
      if (!this.groupSelectMode) {
        this.selectedStudentEmailList = []
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.start-evaluation-content {
  display: flex;
  flex-direction: row;

  .class-student-wrapper {
    width: 260px;
    .search-student {
      margin-bottom: 10px;
      border-radius: 4px;
      .user-search {
        border-radius: 4px;
        outline: none;
        border: none;
        box-shadow: none;
      }
      .search-icon {
        height: 15px;
      }
    }

    .student-list-area {
      background: rgba(228, 228, 228, 0.2);
      opacity: 1;
      border-radius: 4px;
      padding: 15px 0;
      position: relative;
      display: flex;
      flex-direction: column;
      min-height: 500px;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      opacity: 1;

      .class-name {
        margin-bottom: 15px;
        padding: 0 10px;
        .class-name-tag {
          padding: 5px 15px;
          display: inline-block;
          background: #15C39A;
          opacity: 1;
          border-radius: 4px;
          font-size: 12px;
          color: #fff;
        }
      }

      .students-bar {
        padding: 0 10px;
        margin-bottom: 15px;
        .student-bar-item {
          padding: 10px;
          background: rgba(228, 228, 228, 0.2);
          border: 1px solid rgba(216, 216, 216, 1);
          opacity: 1;
          border-radius: 4px;
          font-family: Inter-Bold;
          line-height: 24px;
          color: #000000;
          text-align: right;
        }
      }

      .student-list-wrapper {
        display: flex;
        flex-direction: column;
        padding-bottom: 50px;
        box-sizing: border-box;
        position: relative;
        min-height: 450px;

        .list-item {
          cursor: pointer;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
          position: relative;
          padding: 10px;

          .student-avatar {
            display: flex;
            flex-direction: row;
            align-items: center;
            img {
              height: 30px;
              border-radius: 30px;
            }
          }

          .student-name {
            padding: 0 5px;
            box-sizing: border-box;
            font-size: 14px;
            font-family: Inter-Bold;
            line-height: 24px;
            color: #11142D;
          }

          .select-status-icon {
            position: absolute;
            right: 10px;
            top: 50%;
            height: 20px;
            margin-top: -10px;
            display: flex;
            flex-direction: row;
            align-items: center;

            img {
              height: 20px;
            }
          }
        }

        .list-item:hover {
          background: rgba(21, 195, 154, 0.1);
        }

        .selected-student {
          background: rgba(21, 195, 154, 0.1);
        }

        .select-mode-toggle {
          position: absolute;
          bottom: 0px;
          left: 10px;
          right: 10px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          background: #FFFFFF;
          border: 1px solid #F7F8FF;
          box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
          opacity: 1;
          border-radius: 6px;
          padding: 10px;

          .select-tips {
            padding: 0 10px;
          }
        }
      }
    }
  }

  .student-evaluation-form {
    padding: 0 15px;
  }
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
  background: rgba(0,0,0,0.00);
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.08);
}
/* 滚动条滑块 */
*::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background: rgba(0,0,0,0.12);
  -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.2);
}
</style>
