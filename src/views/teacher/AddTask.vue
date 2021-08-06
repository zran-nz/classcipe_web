<template>
  <a-card :bordered="false" :bodyStyle="{ padding: '16px 24px', height: '100%', minHeight: '500px' }">
    <a-row class="task-header">
      <a-col span="12">
        <a-space>
          <a-button class="nav-back-btn" type="link" @click="goBack"> <a-icon type="left" /> {{ $t('teacher.add-task.back') }}</a-button>
          <span class="unit-last-change-time" v-if="lastChangeSavedTime">
            <span class="unit-nav-title">
              {{ form.name }}
            </span>
            <a-divider type="vertical" v-if="!!form.name" />
            {{ $t('teacher.add-task.last-change-saved-at-time', {time: lastChangeSavedTime}) }}
          </span>
        </a-space>
      </a-col>
      <a-col span="12" class="unit-right-action">
        <a-space>
          <a-button @click="handleSaveTask"> <a-icon type="save" /> {{ $t('teacher.add-task.save') }}</a-button>
          <a-button type="primary" @click="handlePublishTask"> <a-icon type="cloud-upload" /> {{ $t('teacher.add-task.publish') }}</a-button>
          <a-button @click="$refs.collaborate.visible = true"><a-icon type="share-alt" ></a-icon>Collaborate</a-button>
          <a-dropdown >
            <a-icon type="more" />
            <a-menu slot="overlay" style="top:10px">
              <a-menu-item>
                <a :href="'https://docs.google.com/presentation/d/' + form.presentationId">
                  {{ $t('teacher.my-content.edit-slide-task') }}
                </a>
              </a-menu-item>
              <a-menu-item>
                <a @click="handleStartSession()">
                  {{ $t('teacher.my-content.action-session-new') }}
                </a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
          <Collaborate ref="collaborate" :id="taskId" :type="contentType.task" ></Collaborate>

        </a-space>
      </a-col>
    </a-row>
    <a-row class="unit-content" v-if="!contentLoading">
      <a-col span="3">
        <div class="unit-menu-list">
          <div class="menu-category-item">
            <associate-sidebar :name="form.name" :type="contentType.task" :id="taskId" ref="associate"/>
          </div>
          <div class="menu-category-item">
            <div class="action-item" @click="selectLinkContentVisible = true">
              <a-icon type="link" /> {{ $t('teacher.add-unit-plan.link-content') }}
            </div>
          </div>
        </div>
      </a-col>
      <a-col span="21" class="main-content">
        <a-card :bordered="false" :style="{ borderLeft: '1px solid rgb(235, 238, 240)', borderRight: '1px solid rgb(235, 238, 240)' }" :body-style="{padding: '16px'}">
          <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" >
            <div class="form-block" v-if="mode === 'edit'">
              <a-form-model-item :label="$t('teacher.add-task.task-name')" class="task-type-line">
                <a-input v-model="form.name" />
                <div class="task-type">
                  <div :class="{'task-type-item': true, 'active-task-type': form.taskType === 'FA'}" @click="handleSelectTaskType('FA')">FA</div>
                  <div :class="{'task-type-item': true, 'active-task-type': form.taskType === 'SA'}" @click="handleSelectTaskType('SA')">SA</div>
                </div>
              </a-form-model-item>
              <a-form-model-item :label="$t('teacher.add-task.overview')" class="task-audio-line">
                <a-textarea v-model="form.overview" allow-clear />
                <div class="audio-wrapper" v-if="form.audioUrl">
                  <audio :src="form.audioUrl" controls />
                  <span @click="form.audioUrl = null"><a-icon type="delete" /></span>
                </div>
                <div class="task-audio" @click="handleAddAudioOverview">
                  <a-icon type="audio" />
                </div>
              </a-form-model-item>
              <div class="content-blocks question-item" v-for="(questionItem, questionIndex) in questionDataObj" :key="questionIndex" v-if="questionItem !== null">
                <!--knowledge tag-select -->
                <!--knowledge tag-select -->
                <new-ui-clickable-knowledge-tag
                  :question-index="questionIndex"
                  :selected-knowledge-tags="questionItem.knowledgeTags"
                  :selected-skill-tags="questionItem.skillTags"
                  @remove-knowledge-tag="handleRemoveKnowledgeTag"
                  @add-knowledge-tag="handleAddKnowledgeTag"
                  @remove-skill-tag="handleRemoveSkillTag"
                  @add-skill-tag="handleAddSkillTag"
                />

              </div>
            </div>
            <div class="form-block" v-if="mode === 'create'">
              <div class="task-action-wrapper">
                <div class="action-item-line">
                  <img src="~@/assets/icons/lesson/Presentation-Collaboration@2x.png" alt="" class="action-img">
                  <div class="action-label">
                    <a-button shape="round" @click="handleShowSelectTemplate" class="action-item">
                      {{ $t('teacher.add-task.choose-a-template') }}
                    </a-button>
                  </div>
                </div>
              </div>
            </div>

            <a-row>
              <a-col offset="4" span="18">
                <custom-tag v-if="mode === 'edit'" ref="customTag" :selected-tags-list="form.customTags" @change-user-tags="handleChangeUserTags"></custom-tag>
              </a-col>
            </a-row>
          </a-form-model>
        </a-card>
      </a-col>
    </a-row>

    <a-modal
      v-model="selectLinkContentVisible"
      :footer="null"
      destroyOnClose
      width="80%"
      title="Link in my content"
      @ok="selectLinkContentVisible = false"
      @cancel="selectLinkContentVisible = false">
      <div class="link-content-wrapper">
        <my-content-selector v-if="$store.getters.currentRole === 'expert'" :filter-type-list="['topic']" />
        <my-content-selector v-else :filter-type-list="['unit-plan']" />
      </div>
    </a-modal>

    <a-modal
      v-model="viewInGoogleSlideVisible"
      :footer="null"
      destroyOnClose
      title="Create Success"
      @ok="viewInGoogleSlideVisible = false"
      @cancel="viewInGoogleSlideVisible = false">
      <div class="view-in-google-slider">
        <div class="view-line">
          <div class="link-url">
            <a :href="presentationLink" target="_blank">{{ presentationLink }}</a>
          </div>
          <div class="view-action">
            <a-button type="primary" @click="handleOpenGoogleSlide(presentationLink)">Edit In Google Slide</a-button>
          </div>
        </div>
      </div>
    </a-modal>

    <a-modal
      v-model="selectTemplateVisible"
      :footer="null"
      destroyOnClose
      title="Teaching Templates"
      width="50%"
      @ok="selectTemplateVisible = false"
      @cancel="selectTemplateVisible = false">
      <div class="select-template-wrapper">
        <div class="template-type-list">
          <div :class="{'template-type-item': true, 'active-template-type' : currentTemplateType === templateTypeMap['visible-thinking-tool']}" @click="handleToggleTemplateType(templateTypeMap['visible-thinking-tool'])">
            Visible thinking tool
          </div>
          <div :class="{'template-type-item': true, 'active-template-type' : currentTemplateType === templateTypeMap.worksheet}" @click="handleToggleTemplateType(templateTypeMap.worksheet)">
            Worksheet
          </div>
          <div :class="{'template-type-item': true, 'active-template-type' : currentTemplateType === templateTypeMap.quiz}" @click="handleToggleTemplateType(templateTypeMap.quiz)">
            Quiz
          </div>
          <div :class="{'template-type-item': true, 'active-template-type' : currentTemplateType === templateTypeMap['summative-evaluation-task']}" @click="handleToggleTemplateType(templateTypeMap['summative-evaluation-task'])">
            Summative evaluation task
          </div>
        </div>
        <div class="template-list-wrapper">
          <div class="template-list" v-if="!templateLoading">
            <div class="template-item" v-for="(template,index) in templateList" :key="index" @click="handleSelectTemplate(template)">
              <div class="template-cover" :style="{backgroundImage: 'url(' + template.cover + ')'}">
              </div>
              <div class="template-info">
                <div class="template-name">{{ template.name }}</div>
                <div class="template-intro">{{ template.introduce }}</div>
                <div class="template-select-icon" v-if="template.id && selectedTemplateIdList.indexOf(template.id) !== -1">
                  <a-icon type="check" />
                </div>
              </div>
            </div>
          </div>
          <div class="no-template" v-if="!templateLoading && templateList.length === 0">
            <a-empty />
          </div>
          <div class="template-loading" v-if="templateLoading">
            <a-spin />
          </div>
        </div>
        <div class="template-action">
          <div class="create-loading" v-if="creating">
            <a-spin />
          </div>
          <a-button @click="handleAddTemplate" type="primary" :loading="creating">Add</a-button>
        </div>
      </div>
    </a-modal>

    <a-modal
      v-model="showRelevantQuestionVisible"
      :footer="null"
      destroyOnClose
      top="50px"
      width="50%"
      title="Select from the relevant Unit"
      @ok="showRelevantQuestionVisible = false"
      @cancel="showRelevantQuestionVisible = false">
      <div class="select-relevant-tag">
        <relevant-tag-selector :relevant-question-list="relevantQuestionList" @update-selected="handleUpdateSelected"/>
      </div>
      <div class="action-line">
        <a-button @click="handleCancelSelectedRelevant" class="button-item">Cancel</a-button>
        <a-button @click="handleConfirmSelectedRelevant" type="primary" class="button-item">Confirm</a-button>
      </div>
    </a-modal>

    <a-modal
      v-model="showAddAudioVisible"
      :footer="null"
      destroyOnClose
      title="Add Audio"
      @ok="showAddAudioVisible = false"
      @cancel="showAddAudioVisible = false">

      <div class="audio-material-action">
        <div class="uploading-mask" v-show="currentUploading">
          <div class="uploading">
            <a-spin large />
          </div>
        </div>
        <div class="action-item">
          <a-upload name="file" accept="audio/*" :customRequest="handleUploadAudio" :showUploadList="false">
            <a-button type="primary" icon="upload">{{ $t('teacher.add-unit-plan.upload-audio') }}</a-button>
          </a-upload>
        </div>
        <a-divider>
          {{ $t('teacher.add-unit-plan.or') }}
        </a-divider>
        <div class="action-item-column">
          <vue-record-audio mode="press" @result="handleAudioResult" />
          <div class="action-tips">
            {{ $t('teacher.add-unit-plan.record-your-voice') }}
          </div>
        </div>
        <div class="material-action" >
          <a-button key="back" @click="handleCancelAddAudio" class="action-item">
            Cancel
          </a-button>
          <a-button key="submit" type="primary" @click="handleConfirmAddAudio" class="action-item">
            Ok
          </a-button>
        </div>
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
import { UpdateContentStatus, GetMyGrades, Associate } from '@/api/teacher'
import InputSearch from '@/components/UnitPlan/InputSearch'
import SdgTagInput from '@/components/UnitPlan/SdgTagInput'
import SkillTag from '@/components/UnitPlan/SkillTag'
import { TemplatesGetTemplates } from '@/api/template'
import { MyContentEventBus, MyContentEvent } from '@/components/MyContent/MyContentEventBus'
import { TaskCreateTaskPPT, TaskQueryById, TaskAddOrUpdate } from '@/api/task'
import { UnitPlanQueryById } from '@/api/unitPlan'
import { TopicQueryById } from '@/api/topic'
import { formatLocalUTC } from '@/utils/util'
import MyContentSelector from '@/components/MyContent/MyContentSelector'
import RelevantTagSelector from '@/components/UnitPlan/RelevantTagSelector'
import { TemplateTypeMap } from '@/const/template'
import { commonAPIUrl } from '@/api/common'
import Collaborate from '@/components/UnitPlan/Collaborate'
import AssociateSidebar from '@/components/Associate/AssociateSidebar'
import CustomTag from '@/components/UnitPlan/CustomTag'
import NewUiClickableKnowledgeTag from '@/components/UnitPlan/NewUiClickableKnowledgeTag'
import { lessonHost, lessonStatus } from '@/const/googleSlide'
import { StartLesson } from '@/api/lesson'

const TagOriginType = {
  Origin: 'Origin',
  Search: 'Search',
  Description: 'Description',
  Create: 'Create',
  Extension: 'Extension'
}

export default {
  name: 'AddTask',
  components: {
    ContentTypeIcon,
    InputSearch,
    SdgTagInput,
    NewUiClickableKnowledgeTag,
    SkillTag,
    MyContentSelector,
    RelevantTagSelector,
    Collaborate,
    AssociateSidebar,
    CustomTag
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    taskId: null
  },
  data () {
    return {
      mode: 'create',
      contentLoading: true,
      referenceLoading: false,
      contentType: typeMap,
      templateTypeMap: TemplateTypeMap,

      creating: false,

      leftAddExpandStatus: false,
      selectLinkContentVisible: false,
      viewInGoogleSlideVisible: false,
      selectTemplateVisible: false,
      showAddAudioVisible: false,

      labelCol: { span: 4 },
      wrapperCol: { span: 18 },

      presentationLink: null,
      form: {
        id: null,
        image: '',
        lessonId: '',
        audioUrl: '',
        name: 'Untitled task',
        overview: '',
        presentationId: '',
        questions: [{
          knowledgeTags: [
            {
              description: '',
              id: '',
              name: ''
            }
          ],
          name: '',
          skillTags: [
            {
              description: '',
              id: '',
              name: ''
            }
          ]
        }],
        suggestingTag: [],
        status: 0,
        taskType: '',
        createTime: '',
        updateTime: '',
        customTags: []
      },
      // Grades
      gradeList: [],

      // 将questions转成对象
      questionTotal: 0,
      questionMaxIndex: 0,
      questionPrefix: '__question_',
      questionDataObj: {
        __question_0: {
          questionId: null,
          visible: false,
          name: '',
          knowledgeMainSubjectId: '',
          knowledgeSubSubjectId: '',
          knowledgeGradeId: '',
          knowledgeTags: [],
          skillGradeId: '',
          skillTags: []
        }
      },

      currentTemplateType: TemplateTypeMap['visible-thinking-tool'],
      templateList: [],
      templateLoading: false,
      selectedTemplateList: [],

      // 待选择的unit plan中的描述标签
      relevantQuestionList: [],
      showRelevantQuestionVisible: false,
      relevantSelectedQuestionList: [],
      relevantSelectedSource: {},

      extKnowledgeTagList: [],
      extSkillTagList: [],

      subKnowledgeId2InfoMap: new Map(),
      descriptionId2InfoMap: new Map(),
      audioUrl: null,
      currentUploading: false
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
  created () {
    logger.info('add task created ' + this.taskId + ' ' + this.$route.path)
    this.mode = this.taskId ? 'edit' : 'create'

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
      Promise.all([
        GetMyGrades(),
        TemplatesGetTemplates({ category: this.currentTemplateType })
      ]).then((response) => {
        this.$logger.info('add task initData done', response)

        // GetMyGrades
        if (!response[0].code) {
          this.$logger.info('GetMyGrades', response[0].result)
          this.gradeList = response[0].result
        }

        if (!response[1].code) {
          this.$logger.info('template list', response[1].result)
          this.templateList = response[1].result
        }
      }).then(() => {
        if (this.taskId) {
          this.$logger.info('restore task data ' + this.taskId)
          this.restoreTask(this.taskId, true)
        } else {
          this.contentLoading = false
        }
      }).catch((e) => {
        this.$logger.error(e)
        this.$message.error(this.$t('teacher.add-task.init-data-failed'))
      }).finally(() => {
        this.referenceLoading = false
      })
    },

    restoreTask (taskId, isFirstLoad) {
      if (isFirstLoad) {
        this.contentLoading = true
      }
      logger.info('restoreTask ' + taskId)
      TaskQueryById({
        id: taskId
      }).then(response => {
        logger.info('TaskQueryById ' + taskId, response.result)
        const taskData = response.result

        const questionKeys = Object.keys(this.questionDataObj)
        questionKeys.forEach(questionKey => {
          logger.info('questionDataObj delete ' + questionKey)
          this.$delete(this.questionDataObj, questionKey)
        })
        if (taskData.questions && taskData.questions.length) {
          taskData.questions.forEach(questionItem => {
            const question = {
              questionId: questionItem.id,
              visible: false,
              name: questionItem.name,
              knowledgeMainSubjectId: '',
              knowledgeSubSubjectId: '',
              knowledgeGradeId: '',
              knowledgeTags: questionItem.knowledgeTags,
              skillGradeId: '',
              skillTags: questionItem.skillTags,
              origin: 'question'
            }
            this.$set(this.questionDataObj, this.questionPrefix + this.questionMaxIndex, question)
            logger.info('restore default questionDataObj: ' + (this.questionPrefix + this.questionMaxIndex), question, ' questionDataObj ', this.questionDataObj)
            this.questionMaxIndex = this.questionMaxIndex + 1
            this.questionTotal = this.questionTotal + 1
          })
        }

        if (taskData.suggestingTag && (taskData.suggestingTag.knowledgeTags.length || taskData.suggestingTag.skillTags.length)) {
          const question = {
            questionId: null,
            visible: false,
            name: null,
            knowledgeMainSubjectId: '',
            knowledgeSubSubjectId: '',
            knowledgeGradeId: '',
            knowledgeTags: taskData.suggestingTag.knowledgeTags,
            skillGradeId: '',
            skillTags: taskData.suggestingTag.skillTags,
            origin: 'suggesting'
          }
          this.$set(this.questionDataObj, this.questionPrefix + this.questionMaxIndex, question)
          logger.info('suggestingTag restore questionDataObj: ' + (this.questionPrefix + this.questionMaxIndex), question, ' questionDataObj ', this.questionDataObj)
          this.questionMaxIndex = this.questionMaxIndex + 1
          this.questionTotal = this.questionTotal + 1
        }

        if (this.questionMaxIndex === 0) {
          const question = {
            name: '',
            knowledgeMainSubjectId: '',
            knowledgeSubSubjectId: '',
            knowledgeGradeId: '',
            knowledgeTags: [],
            skillGradeId: '',
            skillTags: []
          }
          this.$set(this.questionDataObj, this.questionPrefix + this.questionMaxIndex, question)
          this.questionMaxIndex = this.questionMaxIndex + 1
          this.questionTotal = this.questionTotal + 1
        }

        this.form = taskData
        // 未绑定成功ppt
        if (!this.form.presentationId) {
          this.handleShowSelectTemplate()
        }
        logger.info('after restoreTask', this.form, this.questionDataObj)
      }).finally(() => {
        this.contentLoading = false
      })
    },

    handleLinkMyContent (data) {
      this.$logger.info('handleLinkMyContent ', data)
      this.selectLinkContentVisible = false
      if (data.item.type === this.contentType['unit-plan'] || data.item.type === this.contentType['topic']) {
        this.loadRelevantTagInfo(data.item)
      } else {
        Associate({
          fromId: this.form.id,
          fromType: this.contentType.task,
          toId: data.item.id,
          toType: data.item.type
        }).then(response => {
          this.$logger.info('handleLinkMyContent response ', response)
          this.$refs.associate.loadAssociateData()
        })
      }
    },

    loadRelevantTagInfo (item) {
      this.$logger.info('loadRelevantTagInfo', item)
      this.showRelevantQuestionVisible = false
      this.relevantSelectedSource = item
      const relevantQuery = new Promise((resolve, reject) => {
        if (item.type === this.contentType['unit-plan']) {
          UnitPlanQueryById({ id: item.id }).then(response => {
            resolve(response)
          })
        }
        if (item.type === this.contentType.topic) {
          TopicQueryById({ id: item.id }).then(response => {
            resolve(response)
          })
        }
      })
      Promise.all([relevantQuery]).then(response => {
          this.$logger.info('loadRelevantTagInfo QueryById ' + item.id, response[0])
          const unitPlanData = response[0].result
          const that = this
          if (unitPlanData.questions.length === 0) {
            this.$confirm({
              title: item.name,
              content: 'Please add questions and tags before linking',
              onOk: function () {
                that.$router.push({
                  path: (item.type === that.contentType['unit-plan'] ? '/teacher/unit-plan-redirect/' : '/expert/topic-redirect/') + item.id
                })
              }
            })
            return
          }
          if (unitPlanData.questions && unitPlanData.questions.length) {
            const questionList = unitPlanData.questions
            const questionMap = new Map()
            const relevantTagList = []
            questionList.forEach(questionItem => {
              if (questionItem.id && !questionMap.has(questionItem.id)) {
                // 处理knowledge tags
                const knowledgeTagMap = new Map()
                const knowledgeTagList = []
                questionItem.knowledgeTags.forEach(item => {
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
                questionItem.skillTags.forEach(item => {
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
                  questionName: questionItem.name,
                  questionId: questionItem.id,
                  skillTagList,
                  knowledgeTagList
                })
              }
            })
            questionMap.clear()

            this.relevantQuestionList = relevantTagList
            this.showRelevantQuestionVisible = true
            this.$logger.info('relevantQuestionList', this.relevantQuestionList)
          } else {
            this.$logger.info('no relevantQuestionList')
          }
        })
    },
    handleRemoveKnowledgeTag (data) {
      logger.info('Unit Plan handleRemoveKnowledgeTag', data)
      logger.info('target question data', this.questionDataObj[data.questionIndex.knowledgeTags])
      this.questionDataObj[data.questionIndex].knowledgeTags = this.questionDataObj[data.questionIndex].knowledgeTags.filter(item => item.id !== data.id)
      logger.info('Unit Plan after handleRemoveKnowledgeTag ', this.questionDataObj[data.questionIndex].knowledgeTags)
    },

    handleAddKnowledgeTag (data) {
      logger.info('Unit Plan handleAddKnowledgeTag', data)
      logger.info('target question data', this.questionDataObj[data.questionIndex])
      const newTag = {
        description: data.description,
        name: data.name,
        gradeId: data.gradeId,
        mainSubjectId: data.mainSubjectId,
        subSubjectId: data.subSubjectId,
        mainKnowledgeId: data.mainKnowledgeId,
        subKnowledgeId: data.subKnowledgeId,
        origin: 'suggesting'
      }
      this.questionDataObj[data.questionIndex].knowledgeTags.push(newTag)
    },

    handleRemoveSkillTag (data) {
      logger.info('Unit Plan handleRemoveSkillTag', data)
      logger.info('target question data', this.questionDataObj[data.questionIndex])
      this.questionDataObj[data.questionIndex].skillTags = this.questionDataObj[data.questionIndex].skillTags.filter(item => item.id !== data.id)
      logger.info('Unit Plan after handleRemoveSkillTag ', this.questionDataObj[data.questionIndex].skillTags)
    },

    handleAddSkillTag (data) {
      logger.info('Unit Plan handleAddSkillTag', data)
      logger.info('target question data', this.questionDataObj[data.questionIndex])
      this.questionDataObj[data.questionIndex].skillTags.push(Object.assign({}, data))
      this.$logger.info('after handleAddSkillTag questionDataObj ' + data.questionIndex, this.questionDataObj[data.questionIndex])
    },

    handleSaveTask () {
      logger.info('handleSaveTask', this.form, this.questionDataObj)

      const taskData = Object.assign({}, this.form)

      if (this.taskId) {
        taskData.id = this.taskId
      }
      logger.info('basic taskData', taskData)

      const question = this.questionDataObj['__question_0']
      logger.info('question __question_0', question)
      if (question.knowledgeTags && question.knowledgeTags.length) {
        question.knowledgeTags.forEach(item => {
          item.curriculumId = this.$store.getters.bindCurriculum
        })
      }
      if (question.skillTags && question.skillTags.length) {
        question.skillTags.forEach(item => {
          item.curriculumId = this.$store.getters.bindCurriculum
        })
      }
      const questionItem = {
        knowledgeTags: question.knowledgeTags,
        skillTags: question.skillTags,
        name: question.name
      }
      if (question.questionId) {
        questionItem.id = question.questionId
        this.$logger.info('old question item', questionItem)
      } else {
        this.$logger.info('new question item', questionItem)
      }

      taskData.suggestingTag = questionItem
      logger.info('question taskData', taskData)
      TaskAddOrUpdate(taskData).then((response) => {
        logger.info('TaskAddOrUpdate', response.result)
        if (response.success) {
          this.restoreTask(response.result.id, false)
          // this.$message.success(this.$t('teacher.add-task.save-success'))
        } else {
          this.$message.error(response.message)
        }
      })
    },
    handlePublishTask () {
      logger.info('handlePublishTask', {
        id: this.taskId,
        status: 1
      })

      UpdateContentStatus({
        id: this.taskId,
        status: 1,
        type: this.contentType.task
      }).then(response => {
        this.$logger.info('UpdateContentStatus response', response)
        // this.$message.success('Publish success')
        this.form.status = 1
      }).then(() => {
        this.$message.success(this.$t('teacher.add-task.publish-success'))
        this.form.status = 1
      })
    },

    handleSelectTaskType (type) {
      this.$logger.info('handleSelectTaskType ' + type)
      this.form.taskType = type
    },

    goBack () {
      if (window.history.length <= 1) {
        this.$router.push({ path: '/teacher/main/created-by-me' })
        return false
      } else {
        this.$router.go(-1)
      }

      // setTimeout(() => {
      //   this.$router.push({ path: '/teacher/main/created-by-me' })
      // }, 500)
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

    handleAddTemplate () {
      this.$logger.info('handleAddTemplate ', this.selectedTemplateList)
      if (!this.creating) {
        if (this.selectedTemplateList.length) {
          this.creating = true
          TaskCreateTaskPPT({
            taskId: this.taskId ? this.taskId : '',
            name: this.form.name,
            overview: this.form.overview,
            pageObjectIds: this.selectedTemplateList[0].pageObjectIds,
            templatePresentationId: this.selectedTemplateList[0].presentationId
          }).then(response => {
            this.$logger.info('handleAddTemplate response', response.result)
            this.form.id = response.result.id
            this.presentationLink = response.result.presentationLink
            this.form.presentationId = this.selectedTemplateList[0].presentationId
            this.selectTemplateVisible = false
            this.mode = 'edit'
            this.viewInGoogleSlideVisible = true
            this.$router.replace({
              path: '/teacher/add-task/' + response.result.id
            })
          }).finally(() => {
            this.templateLoading = false
            this.creating = false
          })
        } else {
          this.$message.warn('Please select template!')
        }
      } else {
        this.$logger.info('creating wait...')
      }
    },

    handleOpenGoogleSlide (slideUrl) {
      this.$logger.info('handleOpenGoogleSlide ' + slideUrl)
      // window.open(slideUrl, '_blank')
      window.location.href = slideUrl
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
      const questionDataObj = Object.assign({}, this.questionDataObj['__question_0'])
      this.$delete(this.questionDataObj, '__question_0')
      this.$logger.info('questionDataObj __question_0', questionDataObj)
      this.relevantSelectedQuestionList.forEach(item => {
        item.knowledgeTags.forEach(tagItem => {
          if (!questionDataObj.knowledgeTags.find(kItem => kItem.name === tagItem.name && kItem.description === tagItem.description)) {
            questionDataObj.knowledgeTags.push(tagItem)
          }
        })

        item.skillTags.forEach(skillItem => {
          if (!questionDataObj.skillTags.find(qItem => qItem.name === skillItem.name && qItem.description === skillItem.description)) {
            questionDataObj.skillTags.push(skillItem)
          }
        })
      })

      this.$nextTick(() => {
        this.$set(this.questionDataObj, '__question_0', questionDataObj)
      })
      this.$logger.info('after $set questionDataObj __question_0', this.questionDataObj)
      Associate({
        fromId: this.form.id,
        fromType: this.contentType.task,
        toId: this.relevantSelectedSource.id,
        toType: this.relevantSelectedSource.type,
        questions: this.relevantSelectedQuestionList
      }).then(response => {
        this.$logger.info('handleLinkMyContent response ', response)
        this.$refs.associate.loadAssociateData()
      })
    },

    handleAddAudioOverview () {
      this.$logger.info('handleAddAudioOverview')
      this.showAddAudioVisible = true
    },

    handleAudioResult (data) {
      logger.info('handleAudioResult', data)
      this.currentUploading = true
      const formData = new FormData()
      formData.append('file', data, 'audio.wav')
      this.$http.post(commonAPIUrl.UploadFile, formData, { contentType: false, processData: false, headers: { 'Content-Type': 'multipart/form-data' }, timeout: 60000 })
        .then((response) => {
          logger.info('handleAudioResult upload response:', response)
          this.audioUrl = this.$store.getters.downloadUrl + response.result
          logger.info('handleAudioResult audioUrl', this.audioUrl)
        }).catch(err => {
        logger.error('handleAudioResult error', err)
      }).finally(() => {
        this.currentUploading = false
      })
    },

    handleUploadAudio (data) {
      logger.info('handleUploadAudio', data)
      this.currentUploading = true
      const formData = new FormData()
      formData.append('file', data.file, data.file.name)
      this.uploading = true
      this.$http.post(commonAPIUrl.UploadFile, formData, { contentType: false, processData: false, headers: { 'Content-Type': 'multipart/form-data' }, timeout: 60000 })
        .then((response) => {
          logger.info('handleUploadAudio upload response:', response)
          this.audioUrl = this.$store.getters.downloadUrl + response.result
        }).catch(err => {
        logger.error('handleUploadImage error', err)
      }).finally(() => {
        this.currentUploading = false
      })
    },

    handleCancelAddAudio () {
      this.$logger.info('handleCancelAddAudio')
      this.audioUrl = null
      this.showAddAudioVisible = false
    },

    handleConfirmAddAudio () {
      if (this.audioUrl) {
        this.form.audioUrl = this.audioUrl
       this.audioUrl = null
       this.showAddAudioVisible = false
      }
    },
    handleChangeUserTags (tags) {
      this.form.customTags = tags
    },
    handleStartSession () {
      this.$logger.info('handleStartSession', this.form)
      if (this.form.presentationId) {
        const requestData = {
          author: this.$store.getters.email,
          slide_id: this.form.presentationId,
          file_name: this.form.name,
          status: lessonStatus.studentPaced,
          redirect_url: null
        }

        this.$logger.info('handleStartSession', requestData)
        StartLesson(requestData).then(res => {
          this.$logger.info('StartLesson res', res)
          if (res.code === 'ok') {
            const targetUrl = lessonHost + 'slide_id=' + this.form.presentationId + '&class_id=' + res.data.class_id + '&type=classroom'
            this.$logger.info('try open ' + targetUrl)
            window.open(targetUrl, '_blank')
          } else {
            this.$message.warn('StartLesson Failed! ' + res.message)
          }
        })
      } else {
        this.$message.warn('This record is not bound to PPT!')
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

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
    .anticon-more{
      color: #15c39a;
      font-size: 18px;
    }
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

      .action-item {
        color: @primary-color;
        padding: 5px 0;
        text-decoration: underline;
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
    padding: 30px 0;

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

.task-type-line {
  position: relative;
  .task-type {
    position: absolute;
    right: -75px;
    top: -5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;

    .task-type-item {
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

    .active-task-type {
      background-color: fade(@outline-color, 20%);
      color: @primary-color;
      border-radius: 50%;
      font-weight: 500;
    }
  }
}

.task-audio-line {
  position: relative;
  .task-audio {
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

.task-action-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  .action-item-line {
    margin: 0 25px;
    padding: 15px;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    opacity: 1;
    border-radius: 3px;
    .action-img {
      width: 230px;
    }
    .action-label {
      margin-top: 40px;
      text-align: center;
      .action-item {
        border: 1px solid rgba(21, 195, 154, 1);
        background: rgba(21, 195, 154, 0.1);
        color: rgba(21, 195, 154, 1);
        min-width: 120px;
      }
    }
  }
}

</style>
