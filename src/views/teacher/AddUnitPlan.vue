<template>
  <a-card :bordered="false" :bodyStyle="{ padding: '16px 24px', height: '100%', minHeight: '500px' }">
    <a-row class="unit-plan-header">
      <a-col span="12">
        <a-space>
          <a-button class="nav-back-btn" type="link" @click="goBack"> <a-icon type="left" /> {{ $t('teacher.add-unit-plan.back') }}</a-button>
          <span class="unit-last-change-time" v-if="lastChangeSavedTime">
            <span class="unit-nav-title">
              {{ form.name }}
            </span>
            <a-divider type="vertical" v-if="!!form.name" />
            {{ $t('teacher.add-unit-plan.last-change-saved-at-time', {time: lastChangeSavedTime}) }}
          </span>
        </a-space>
      </a-col>
      <a-col span="12" class="unit-right-action">
        <a-space>
          <a-button @click="handleSaveUnitPlan"> <a-icon type="save" /> {{ $t('teacher.add-unit-plan.save') }}</a-button>
          <a-button type="primary" @click="handlePublishUnitPlan"> <a-icon type="cloud-upload" /> {{ $t('teacher.add-unit-plan.publish') }}</a-button>
          <a-button @click="handleStartCollaborate"><a-icon type="share-alt" ></a-icon>Collaborate</a-button>
        </a-space>
      </a-col>
    </a-row>
    <a-row class="unit-content" v-if="!contentLoading">
      <a-col span="4">
        <div class="unit-menu-list">
          <div class="menu-category-item">
            <associate-sidebar :name="form.name" :type="contentType[&quot;unit-plan&quot;]" :id="unitPlanId" ref="associate"/>
          </div>
          <div class="menu-category-item">
            <action-bar @create="selectAddContentTypeVisible = true" @link="selectLinkContentVisible = true" :show-create="true"/>
          </div>
        </div>
      </a-col>
      <a-col span="15" class="main-content">
        <a-card :bordered="false" :body-style="{padding: '16px'}">
          <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" >
            <div class="form-block">
              <!--              unit-name-->
              <a-form-model-item :label="$t('teacher.add-unit-plan.unit-name')">
                <a-input v-model="form.name" />
              </a-form-model-item>
              <!--              image-->
              <a-form-model-item :label="$t('teacher.add-unit-plan.image')" class="img-wrapper">
                <a-upload-dragger
                  name="file"
                  accept="image/png, image/jpeg"
                  :showUploadList="false"
                  :customRequest="handleUploadImage"
                >
                  <div class="delete-img" @click="handleDeleteImage($event)" v-show="form.image">
                    <a-icon type="close-circle" />
                  </div>
                  <template v-if="uploading">
                    <div class="upload-container">
                      <p class="ant-upload-drag-icon">
                        <a-icon type="cloud-upload" />
                      </p>
                      <p class="ant-upload-text">
                        <a-spin />
                        <span class="uploading-tips">{{ $t('teacher.add-unit-plan.uploading') }}</span>
                      </p>
                    </div>
                  </template>
                  <template v-if="!uploading && form && form.image">
                    <div class="image-preview">
                      <img :src="form.image" alt="">
                    </div>
                  </template>
                  <template v-if="!uploading && form && !form.image">
                    <div class="upload-container">
                      <p class="ant-upload-drag-icon">
                        <a-icon type="picture" />
                      </p>
                      <p class="ant-upload-text">
                        {{ $t('teacher.add-unit-plan.upload-a-picture') }}
                      </p>
                    </div>
                  </template>
                </a-upload-dragger>
              </a-form-model-item>

              <!--      overview-->
              <a-form-model-item :label="$t('teacher.add-lesson.overview')" class="task-audio-line">
                <a-textarea v-model="form.overview" allow-clear />
                <div class="audio-wrapper" v-if="form.audioUrl">
                  <audio :src="form.audioUrl" controls />
                  <span @click="form.audioUrl = null"><a-icon type="delete" /></span>
                </div>
                <div class="task-audio" @click="handleAddAudioOverview">
                  <a-icon type="audio" />
                </div>
              </a-form-model-item>

            </div>
            <!--            real-life-scenario-->
            <div class="form-block">
              <a-row>
                <a-col offset="2" span="20">
                  <div class="form-block-title">
                    <a-divider orientation="left">
                      {{ $t('teacher.add-unit-plan.real-life-scenario') }}
                    </a-divider>
                  </div>
                </a-col>
              </a-row>
              <!--sdg and KeyWords-->
              <div class="content-blocks" v-for="(scenario, sdgIndex) in form.scenarios" :key="sdgIndex">
                <div class="sdg-delete-wrapper" @click="handleDeleteSdg(sdgIndex)" v-show="form.scenarios.length > 1">
                  <a-tooltip placement="top">
                    <template slot="title">
                      <span>{{ $t('teacher.add-unit-plan.delete-goal') }}</span>
                    </template>
                    <div class="sdg-delete">
                      <a-icon type="delete" :style="{ fontSize: '20px' }" />
                    </div>
                  </a-tooltip>
                </div>

                <!--sdg-->
                <a-form-model-item :label="$t('teacher.add-unit-plan.sdg-label')" class="long-label-form-item">
                  <a-select v-model="scenario.sdgId" placeholder="please select sdg" class="my-select">
                    <a-select-option v-for="(sdg,index) in sdgList" :value="sdg.id" :key="index">
                      {{ sdg.name }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>

                <!--description-->
                <a-form-model-item :label="$t('teacher.add-unit-plan.description')">
                  <input-search
                    :v-model="scenario.description"
                    :default-value="scenario.description"
                    :key-index="sdgIndex"
                    :currend-index="currentIndex"
                    :search-list="descriptionSearchList"
                    label="description"
                    @search="handleDescriptionSearch"
                    @select-item="handleSelectScenario"
                    @reset="descriptionSearchList = []" />
                </a-form-model-item>

                <!--keywords-->
                <a-form-model-item :label="$t('teacher.add-unit-plan.key-words')">
                  <sdg-tag-input :selected-keywords="scenario.sdgKeyWords" :sdg-key="sdgIndex" @add-tag="handleAddSdgTag" @remove-tag="handleRemoveSdgTag"/>
                </a-form-model-item>
              </div>
              <!--add-new-sdg-->
              <a-row>
                <a-col offset="2" span="20">
                  <div class="form-block-title form-block-action">
                    <a-button type="link" icon="plus-circle" @click="handleAddMoreSdg">
                      {{ $t('Choose another sustainable development goal') }}
                    </a-button>
                  </div>
                </a-col>
              </a-row>
            </div>
            <a-divider />
            <div class="form-block">
              <a-row>
                <a-form-model-item :label="$store.getters.currentRole === 'teacher' ? $t('teacher.add-unit-plan.teacher-direction-of-inquiry') : $t('teacher.add-unit-plan.expert-direction-of-inquiry')" class="long-label-form-item">
                  <a-input v-model="form.inquiry" allow-clear />
                </a-form-model-item>
              </a-row>
            </div>

            <div class="form-block">
              <a-row>
                <a-col span="4">
                  <div class="self-field-label">
                    Subjects
                  </div>
                </a-col>
                <a-col span="18">
                  <a-row :gutter="16">
                    <a-col span="11">
                      <a-form-model-item class="label-form-item">
                        <a-select v-model="form.subjectIds" mode="multiple" placeholder="Please select subjects">
                          <a-select-opt-group v-for="subjectOptGroup in subjectTree" :key="subjectOptGroup.id">
                            <span slot="label">{{ subjectOptGroup.name }}</span>
                            <a-select-option
                              :value="subjectOption.id"
                              v-for="subjectOption in subjectOptGroup.children"
                              :key="subjectOption.id">{{ subjectOption.name }}
                            </a-select-option>
                          </a-select-opt-group>
                        </a-select>
                      </a-form-model-item>
                    </a-col>

                    <a-col span="13" class="grade-select">
                      <a-form-model-item label="Grade" class="label-form-item">
                        <a-select v-model="form.gradeIds" placeholder="Please select grade" mode="multiple">
                          <a-select-option :value="gradeOption.id" v-for="gradeOption in gradeList" :key="gradeOption.id">
                            {{ gradeOption.name }}
                          </a-select-option>
                        </a-select>
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                </a-col>
              </a-row>
            </div>
            <div class="form-block">
              <div class="content-blocks question-item" v-for="(questionItem, questionIndex) in questionDataObj" :key="questionIndex" v-if="questionItem !== null">
                <div class="knowledge-delete-wrapper" @click="handleDeleteQuestion(questionItem, questionIndex)" v-show="questionTotal > 1">
                  <a-tooltip placement="top">
                    <template slot="title">
                      <span>{{ $t('teacher.add-unit-plan.delete-questions') }}</span>
                    </template>
                    <div class="sdg-delete">
                      <a-icon type="delete" :style="{ fontSize: '20px' }" />
                    </div>
                  </a-tooltip>
                </div>
                <a-row>
                  <a-col offset="4" span="18">
                    <div class="form-block-title">
                      <a-divider dashed>
                        {{ $t('teacher.add-unit-plan.questions') }}
                      </a-divider>
                    </div>
                  </a-col>
                </a-row>
                <a-form-model-item class="long-label-form-item" :label="$store.getters.currentRole === 'teacher' ? $t('teacher.add-unit-plan.teacher-nth-key-question') : $t('teacher.add-unit-plan.expert-nth-key-question')" >
                  <a-input v-model="questionItem.name" allow-clear/>
                </a-form-model-item>

                <!--knowledge tag-select -->
                <new-ui-clickable-knowledge-tag
                  :question-index="questionIndex"
                  :grade-ids="form.gradeIds"
                  :subject-ids="form.subjectIds"
                  :selected-knowledge-tags="questionItem.knowledgeTags"
                  :selected-skill-tags="questionItem.skillTags"
                  @remove-knowledge-tag="handleRemoveKnowledgeTag"
                  @add-knowledge-tag="handleAddKnowledgeTag"
                  @remove-skill-tag="handleRemoveSkillTag"
                  @add-skill-tag="handleAddSkillTag"
                />

              </div>

              <a-row>
                <a-col offset="2" span="20">
                  <div class="form-block-title form-block-action">
                    <a-button type="link" icon="plus-circle" @click="handleAddMoreQuestion">
                      {{ $t('teacher.add-unit-plan.add-more-question') }}
                    </a-button>
                  </div>
                </a-col>
              </a-row>
            </div>

            <a-row>
              <a-col offset="4" span="18">
                <custom-tag ref="customTag" :selected-tags-list="form.customTags" @change-user-tags="handleChangeUserTags"></custom-tag>
              </a-col>
            </a-row>

            <div class="form-block action-line">
              <a-space :size="30">
                <a-button @click="handleSaveUnitPlan"> <a-icon type="save" /> {{ $t('teacher.add-unit-plan.save') }}</a-button>
                <a-button type="primary" @click="handlePublishUnitPlan"> <a-icon type="cloud-upload" /> {{ $t('teacher.add-unit-plan.publish') }}</a-button>
              </a-space>
            </div>

          </a-form-model>
        </a-card>
      </a-col>
    </a-row>

    <collaborate-content ref="collaborate"/>
    <a-modal
      v-model="selectAddContentTypeVisible"
      :footer="null"
      destroyOnClose
      title="Select Content Type"
      @ok="selectAddContentTypeVisible = false"
      @cancel="selectAddContentTypeVisible = false">
      <div class="add-content-wrapper">
        <div class="add-content-item" @click="handleAddUnitPlanTask">
          <a>
            <content-type-icon :type="contentType.task"/>
            {{ $t('teacher.add-unit-plan.task') }}
          </a>
        </div>
        <div class="add-content-item" @click="handleAddUnitPlanLesson">
          <a >
            <content-type-icon :type="contentType.lesson"/>
            {{ $t('teacher.add-unit-plan.lesson') }}
          </a>
        </div>
        <div class="add-content-item" @click="handleAddUnitPlanEvaluation">
          <a >
            <content-type-icon :type="contentType.evaluation"/>
            {{ $t('teacher.add-unit-plan.evaluation') }}
          </a>
        </div>
        <div class="add-loading" v-if="addLoading">
          <a-spin />
        </div>
      </div>
    </a-modal>

    <a-modal
      v-model="selectLinkContentVisible"
      :footer="null"
      destroyOnClose
      width="80%"
      title="Link in my content"
      @ok="selectLinkContentVisible = false"
      @cancel="selectLinkContentVisible = false">
      <div class="link-content-wrapper">
        <my-content-selector :filter-type-list="['lesson','task','evaluation']" />
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
import { commonAPIUrl } from '@/api/common'
import { GetAllSdgs, ScenarioSearch } from '@/api/scenario'
import { debounce } from 'lodash-es'
import InputSearch from '@/components/UnitPlan/InputSearch'
import SdgTagInput from '@/components/UnitPlan/SdgTagInput'
// import { GetTreeByKey } from '@/api/tag'
import { GetMyGrades, Associate } from '@/api/teacher'
import { SubjectTree } from '@/api/subject'
import { formatSubjectTree } from '@/utils/bizUtil'
import NewUiClickableKnowledgeTag from '@/components/UnitPlan/NewUiClickableKnowledgeTag'
import NewClickableSkillTag from '@/components/UnitPlan/NewClickableSkillTag'
import SkillTag from '@/components/UnitPlan/SkillTag'
import { ChangeStatus, UnitPlanAddOrUpdate, UnitPlanQueryById } from '@/api/unitPlan'
import { formatLocalUTC } from '@/utils/util'
import MyContentSelector from '@/components/MyContent/MyContentSelector'
import AssociateSidebar from '@/components/Associate/AssociateSidebar'
import Collaborate from '@/components/UnitPlan/Collaborate'
import { TaskAddOrUpdate } from '@/api/task'
import { LessonAddOrUpdate } from '@/api/myLesson'
import { EvaluationAddOrUpdate } from '@/api/evaluation'
import CustomTag from '../../components/UnitPlan/CustomTag'
import { MyContentEvent, MyContentEventBus } from '@/components/MyContent/MyContentEventBus'
import RelevantTagSelector from '@/components/UnitPlan/RelevantTagSelector'
import AddKeywordTag from '@/components/Evaluation/AddKeywordTag'
import ActionBar from '@/components/Associate/ActionBar'
import CollaborateContent from '@/components/collaborate/CollaborateContent'

export default {
  name: 'AddUnitPlan',
  components: {
    CollaborateContent,
    ActionBar,
    ContentTypeIcon,
    InputSearch,
    SdgTagInput,
    NewUiClickableKnowledgeTag,
    NewClickableSkillTag,
    SkillTag,
    MyContentSelector,
    AssociateSidebar,
    Collaborate,
    CustomTag,
    RelevantTagSelector,
    AddKeywordTag
  },
  props: {
    unitPlanId: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      showCollaborateVisible: false,
      contentLoading: true,
      referenceLoading: false,
      contentType: typeMap,

      selectAddContentTypeVisible: false,
      selectLinkContentVisible: false,

      showAddAudioVisible: false,
      currentUploading: false,
      audioUrl: null,

      selectedMyContentInfoItem: {},
      // 待选择的unit plan中的描述标签
      relevantQuestionList: [],
      showRelevantQuestionVisible: false,
      relevantSelectedQuestionList: [],
      relevantSelectedUnitPlan: {},

      subKnowledgeId2InfoMap: new Map(),
      descriptionId2InfoMap: new Map(),

      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      form: {
        image: '',
        inquiry: '',
        name: '',
        status: 0,
        subjects: '',
        questions: [
          {
            id: '',
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
          }
        ],
        scenarios: {
          description: '',
          sdgId: '',
          sdgKeyWords: [
            {
              id: '',
              name: ''
            }
          ]
        },
        createTime: '',
        updateTime: '',
        materials: [],
        customTags: [],
        overview: '',
        subjectIds: [],
        gradeIds: []
      },

      uploading: false,
      sdgList: [],

      // Subject(s) Covered
      subjectList: [],

      // Grades
      gradeList: [],

      // SubjectTree
      subjectTree: [],

      // 根据description搜索的下拉list列表
      descriptionSearchList: [],

      // 将scenario下面的sdg及keywords转成对象
      sdgTotal: 0,
      sdgMaxIndex: 0,
      sdgPrefix: '__sdg_',

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
      addLoading: false,
      currentIndex: 0
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
    logger.info('unitPlanId ' + this.unitPlanId + ' ' + this.$route.path)
    // 初始化关联事件处理
    MyContentEventBus.$on(MyContentEvent.LinkToMyContentItem, this.handleLinkMyContent)
    MyContentEventBus.$on(MyContentEvent.ToggleSelectContentItem, this.handleToggleSelectContentItem)
    this.initData()
    this.debouncedGetSdgByDescription = debounce(this.searchScenario, 300)
  },
  beforeDestroy () {
    MyContentEventBus.$off(MyContentEvent.LinkToMyContentItem, this.handleLinkMyContent)
    MyContentEventBus.$off(MyContentEvent.ToggleSelectContentItem, this.handleToggleSelectContentItem)
  },
  methods: {
    initData () {
      logger.info('initData doing...')
      Promise.all([
        GetAllSdgs(),
        // GetTreeByKey({ key: 'Related Concepts MYP' }),
        GetMyGrades(),
        SubjectTree({ curriculumId: this.$store.getters.bindCurriculum })
      ]).then((sdgListResponse) => {
        logger.info('initData done', sdgListResponse)

        // GetAllSdgs
        logger.info('GetAllSdgs Response ', sdgListResponse[0])
        if (!sdgListResponse[0].code) {
          this.sdgList = sdgListResponse[0].result
        }

        // // GetTreeByKey
        // if (!sdgListResponse[1].code) {
        //   logger.info('GetTreeByKey subjectList', sdgListResponse[1].result.children)
        //   this.subjectList = sdgListResponse[1].result.children
        // }

        // GetMyGrades
        if (!sdgListResponse[1].code) {
          logger.info('GetMyGrades', sdgListResponse[1].result)
          this.gradeList = sdgListResponse[1].result
        }

        // SubjectTree
        if (!sdgListResponse[2].code) {
          logger.info('SubjectTree', sdgListResponse[2].result)
          let subjectTree = sdgListResponse[2].result
          subjectTree = formatSubjectTree(subjectTree)
          this.subjectTree = subjectTree
          logger.info('after format subjectTree', subjectTree)
        }
        logger.info('sdgList', this.sdgList)
      }).then(() => {
        this.restoreUnitPlan(this.unitPlanId, true)
      }).catch((e) => {
        this.$message.error(this.$t('teacher.add-unit-plan.init-data-failed'))
      }).finally(() => {
        this.referenceLoading = false
      })
    },

    restoreUnitPlan (unitPlanId, isFirstLoad) {
      if (isFirstLoad) {
        this.contentLoading = true
      }
      logger.info('restoreUnitPlan ' + unitPlanId)
      UnitPlanQueryById({
        id: unitPlanId
      }).then(response => {
        logger.info('UnitPlanQueryById ' + unitPlanId, response.result)
        const unitPlanData = response.result
        if (unitPlanData.scenarios.length === 0) {
          unitPlanData.scenarios.push({
            description: '',
            sdgId: '',
            sdgKeyWords: []
          })
        }
        const questionKeys = Object.keys(this.questionDataObj)
        questionKeys.forEach(questionKey => {
          logger.info('questionDataObj delete ' + questionKey)
          this.$delete(this.questionDataObj, questionKey)
        })
        if (unitPlanData.questions && unitPlanData.questions.length) {
          unitPlanData.questions.forEach(questionItem => {
            const question = {
              questionId: questionItem.id,
              visible: false,
              name: questionItem.name,
              knowledgeMainSubjectId: '',
              knowledgeSubSubjectId: '',
              knowledgeGradeId: '',
              knowledgeTags: questionItem.knowledgeTags,
              skillGradeId: '',
              skillTags: questionItem.skillTags
            }
            this.$set(this.questionDataObj, this.questionPrefix + this.questionMaxIndex, question)
            logger.info('restore default questionDataObj: ' + (this.questionPrefix + this.questionMaxIndex), question, ' questionDataObj ', this.questionDataObj)
            this.questionMaxIndex = this.questionMaxIndex + 1
            this.questionTotal = this.questionTotal + 1
          })
        } else {
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
          logger.info('restore default questionDataObj: ' + (this.questionPrefix + this.questionMaxIndex), question, ' questionDataObj ', this.questionDataObj)
          this.questionMaxIndex = this.questionMaxIndex + 1
          this.questionTotal = this.questionTotal + 1
        }
        this.form = unitPlanData
      }).finally(() => {
        this.contentLoading = false
      })
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

    handleDescriptionSearch (index, description) {
      logger.info('handleDescriptionSearch:', index, description)
      this.form.scenarios[index].description = description
      this.debouncedGetSdgByDescription(index, description)
    },

    searchScenario (index, description) {
      logger.info('searchScenario', description)
      this.currentIndex = index
      if (typeof description === 'string' && description.trim().length >= 3) {
        ScenarioSearch({
          searchKey: this.form.scenarios[index].description
        }).then((response) => {
          logger.info('searchByDescription', response)
          this.descriptionSearchList = response.result
        })
      } else {
        this.descriptionSearchList = []
      }
    },

    // 由于Vue无法响应式处理数据元素，此处通过将数据转为scenarioObj的属性进行处理------------------废弃
    // 直接修改form.scenarios数据
    handleSelectScenario (index, scenario) {
      console.log(scenario)
      this.form.scenarios[index].description = scenario.description
      if (scenario.sdgKeyWords.length) {
        const keyWords = scenario.sdgKeyWords
        logger.info('scenario[' + index + '].sdgKeyWords', keyWords)
        this.form.scenarios[index].sdgKeyWords = keyWords
      }
    },

    handleAddMoreSdg () {
      const sdg = {
          description: '',
          sdgId: '',
          sdgKeyWords: []
        }
      this.form.scenarios.push(sdg)
      // this.$set(this.sdgDataObj, this.sdgPrefix + this.sdgMaxIndex, sdg)
      // logger.info('after add scenarioObj: ', this.sdgDataObj, 'sdgMaxIndex ' + this.sdgMaxIndex, ' sdgTotal ' + this.sdgTotal)
    },

    handleDeleteSdg (sdgIndex) {
      if (this.form.scenarios.length > 1) {
        this.form.scenarios.splice(sdgIndex, 1)
        logger.info('scenarios ', this.form.scenarios, 'sdgTotal ' + this.form.scenarios.length)
      } else {
        this.$message.warn(this.$t('teacher.add-unit-plan.at-least-one-sdg'))
      }
    },

    handleAddSdgTag (data) {
      const tag = {
        name: data.tagName
      }
      const sdgKey = data.sdgKey
      logger.info('handleAddSdgTag ', tag.name, sdgKey)
      this.form.scenarios[sdgKey].sdgKeyWords.push(tag)
      logger.info('after handleAddSdgTag ', this.form.scenarios[sdgKey].sdgKeyWords)
    },

    handleRemoveSdgTag (data) {
      const tagName = data.tagName
      const sdgKey = data.sdgKey
      logger.info('handleRemoveSdgTag ', tagName, sdgKey)
      this.form.scenarios[sdgKey].sdgKeyWords.splice(this.form.scenarios[sdgKey].sdgKeyWords.indexOf(tagName), 1)
      logger.info('after handleRemoveSdgTag ', this.form.scenarios[sdgKey].sdgKeyWords)
    },

    handleSelectSubject (subjects) {
      logger.info('handleSelectSubject', subjects)
      this.form.subjects = subjects
    },

    handleDeleteQuestion (questionItem, questionIndex) {
      logger.info('handleDeleteQuestion ', questionItem, questionIndex)
      if (this.questionTotal > 1) {
        this.$delete(this.questionDataObj, questionIndex)
        this.questionTotal = this.questionTotal - 1
        logger.info('questionDataObj ', this.questionDataObj)
      } else {
        this.$message.warn(this.$t('teacher.add-unit-plan.at-least-one-question'))
      }
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
        id: data.id,
        name: data.name,
        gradeId: data.gradeId,
        mainSubjectId: data.mainSubjectId,
        subSubjectId: data.subSubjectId,
        mainKnowledgeId: data.mainKnowledgeId,
        subKnowledgeId: data.subKnowledgeId
      }
      this.questionDataObj[data.questionIndex].knowledgeTags.push(newTag)
    },

    handleAddMoreQuestion () {
      const question = {
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
      logger.info('handleAddMoreQuestion ', question)
      this.questionMaxIndex = this.questionMaxIndex + 1
      this.questionTotal = this.questionTotal + 1
      this.$set(this.questionDataObj, this.questionPrefix + this.questionMaxIndex, question)
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

    autoSave () {

    },

    handleSaveUnitPlan () {
      logger.info('handleSaveUnitPlan', this.form, this.sdgDataObj, this.questionDataObj)
      console.log(this.$refs.customTag.tagList)

      const unitPlanData = {
        image: this.form.image,
        inquiry: this.form.inquiry,
        name: this.form.name,
        status: this.form.status,
        subjects: this.form.subjects,
        scenarios: this.form.scenarios,
        questions: [],
        customTags: this.form.customTags,
        overview: this.form.overview,
        subjectIds: this.form.subjectIds,
        gradeIds: this.form.gradeIds
      }

      if (this.unitPlanId) {
        unitPlanData.id = this.unitPlanId
      }
      logger.info('basic unitPlanData', unitPlanData)
      logger.info('sdg unitPlanData', unitPlanData)
      for (const questionIndex in this.questionDataObj) {
        const question = this.questionDataObj[questionIndex]
        logger.info('question ' + questionIndex, question)
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
        unitPlanData.questions.push(questionItem)
      }
      logger.info('question unitPlanData', unitPlanData)
      UnitPlanAddOrUpdate(unitPlanData).then((response) => {
        logger.info('UnitPlanAddOrUpdate', response.result)
        if (response.success) {
          this.restoreUnitPlan(response.result.id, false)
          this.$message.success(this.$t('teacher.add-unit-plan.save-success'))
        } else {
          this.$message.error(response.message)
        }
      }).then(() => {
        this.$refs.associate.loadAssociateData()
      })
    },
    handlePublishUnitPlan () {
      logger.info('handlePublishUnitPlan', {
        id: this.unitPlanId,
        status: 1
      })
      ChangeStatus({
        id: this.unitPlanId,
        status: 1
      }).then(() => {
        this.$message.success(this.$t('teacher.add-unit-plan.publish-success'))
        this.form.status = 1
      })
    },

    handleAddUnitPlanMaterial () {
      logger.info('handleAddUnitPlanMaterial ' + this.unitPlanId)
      this.$router.push({
        path: '/teacher/unit-plan-material-redirect/' + this.unitPlanId + '/create'
      })
    },

    handleAddUnitPlanTask () {
      this.$logger.info('handleAddUnitPlanTask ' + this.unitPlanId)
      // 下创建一个空的task，然后关联，然后再跳转过去
      if (!this.addLoading) {
        this.addLoading = true
        TaskAddOrUpdate({ name: 'Unnamed Task' }).then((response) => {
          this.$logger.info('TaskAddOrUpdate', response.result)
          if (response.success) {
            Associate({
              fromId: this.unitPlanId,
              fromType: this.contentType['unit-plan'],
              toId: response.result.id,
              toType: this.contentType.task
            }).then(response => {
              this.$logger.info('Associate response ', response)
              // 刷新子组件的关联数据
              this.$refs.associate.loadAssociateData()
            })
            this.addLoading = false
            this.$router.push({
              path: '/teacher/task-redirect/' + response.result.id
            })
          } else {
            this.$message.error(response.message)
          }
        }).finally(() => {
          this.addLoading = false
        })
      } else {
        this.$logger.info('add loading')
      }
    },

    handleAddUnitPlanLesson () {
      logger.info('handleAddUnitPlanLesson ' + this.unitPlanId)
      // 下创建一个空的lesson，然后关联，然后再跳转过去
      if (!this.addLoading) {
        this.addLoading = true
        LessonAddOrUpdate({ name: 'Unnamed Lesson' }).then((response) => {
          this.$logger.info('LessonAddOrUpdate', response.result)
          if (response.success) {
            Associate({
              fromId: this.unitPlanId,
              fromType: this.contentType['unit-plan'],
              toId: response.result.id,
              toType: this.contentType.lesson
            }).then(response => {
              this.$logger.info('Associate response ', response)
              // 刷新子组件的关联数据
              this.$refs.associate.loadAssociateData()
            })
            this.addLoading = false
            this.$router.push({
              path: '/teacher/unit-plan-lesson-redirect/' + response.result.id
            })
          } else {
            this.$message.error(response.message)
          }
        }).finally(() => {
          this.addLoading = false
        })
      } else {
        this.$logger.info('add loading')
      }
    },

    handleAddUnitPlanEvaluation () {
      logger.info('handleAddUnitPlanEvaluation ' + this.unitPlanId)
      // 下创建一个空的evaluation，然后关联，然后再跳转过去
      if (!this.addLoading) {
        this.addLoading = true
        EvaluationAddOrUpdate({ name: null }).then((response) => {
          this.$logger.info('EvaluationAddOrUpdate', response.result)
          if (response.success) {
            Associate({
              fromId: this.unitPlanId,
              fromType: this.contentType['unit-plan'],
              toId: response.result.id,
              toType: this.contentType.evaluation
            }).then(response => {
              this.$logger.info('Associate response ', response)
              // 刷新子组件的关联数据
              this.$refs.associate.loadAssociateData()
            })
            this.addLoading = false
            this.$router.push({
              path: '/teacher/evaluation-redirect/' + response.result.id
            })
          } else {
            this.$message.error(response.message)
          }
        }).finally(() => {
          this.addLoading = false
        })
      } else {
        this.$logger.info('add loading')
      }
    },

    handleLinkMyContent (data) {
      this.$logger.info('handleLinkMyContent ', data)
      this.selectLinkContentVisible = false
      this.loadRelevantTagInfo(data.item)
    },

    handleToggleSelectContentItem (data) {
      this.$logger.info('handleToggleSelectContentItem', data)
      this.selectedMyContentInfoItem = data
    },

    loadRelevantTagInfo (item) {
      this.$logger.info('loadRelevantTagInfo', item)
      this.showRelevantQuestionVisible = false
      this.relevantSelectedUnitPlan = item
      if (this.form.questions && this.form.questions.length) {
        const questionList = this.form.questions
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
                tagList.push(item)
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
                tagList.push(item)
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
    },

    handleCancelSelectedRelevant () {
      this.showRelevantQuestionVisible = false
      this.relevantSelectedQuestionList = []
    },

    handleConfirmSelectedRelevant (data) {
      this.$logger.info('handleConfirmSelectedRelevant', this.relevantSelectedQuestionList)
      this.showRelevantQuestionVisible = false
      const questionDataObj = Object.assign({}, this.questionDataObj['__question_0'])
      this.$delete(this.questionDataObj, '__question_0')
      this.$logger.info('questionDataObj __question_0', questionDataObj)
      this.relevantSelectedQuestionList.forEach(item => {
        questionDataObj.knowledgeTags = questionDataObj.knowledgeTags.concat(item.knowledgeTags)
        questionDataObj.skillTags = questionDataObj.skillTags.concat(item.skillTags)
      })

      this.$nextTick(() => {
        this.$set(this.questionDataObj, '__question_0', questionDataObj)
      })
      this.$logger.info('after $set questionDataObj __question_0', this.questionDataObj)
      this.$logger.info('handleLinkMyContent unit question', this.relevantSelectedUnitPlan)
      Associate({
        fromId: this.form.id,
        fromType: this.contentType['unit-plan'],
        toId: this.selectedMyContentInfoItem.id,
        toType: this.selectedMyContentInfoItem.type,
        questions: this.relevantSelectedQuestionList
      }).then(response => {
        this.$logger.info('handleLinkMyContent response ', response)
        this.$refs.associate.loadAssociateData()
      })
    },

    handleUpdateSelected (data) {
      this.$logger.info('handleUpdateSelected', data)
      this.relevantSelectedQuestionList = data.questionList
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
    handleChangeUserTags (tags) {
      this.form.customTags = tags
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
      this.audioUrl = null
      this.showAddAudioVisible = false
    },

    handleConfirmAddAudio () {
      if (this.audioUrl) {
        this.form.audioUrl = this.audioUrl
        this.audioUrl = null
      }
      this.showAddAudioVisible = false
    },

    handleAddAudioOverview () {
      this.$logger.info('handleAddAudioOverview')
      this.showAddAudioVisible = true
    },
    handleStartCollaborate () {
      this.$logger.info('handleStartCollaborate')
      this.$refs.collaborate.startCollaborateModal(Object.assign({}, this.form), this.form.id, this.contentType['unit-plan'])
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.unit-plan-header {
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
    }

    .content-blocks {
      position: relative;
      padding-top: 20px;
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
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  position: relative;
  .add-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: -20px;
    margin-top: -20px;
  }
  .add-content-item {
    width: 80%;
    margin-bottom: 20px;
    text-align: center;
    padding: 20px;
    border: 1px solid #eee;
    cursor: pointer;

    &:hover {
      background-color: fade(@outline-color, 20%);
      border: 1px solid @primary-color;
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

  .action-item {
    margin-left: 20px;
  }
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
.ant-select-dropdown-menu-item {
  overflow: auto;
  white-space: normal;
}

.self-field-label {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  line-height: 32px;
  padding-right: 10px;
}

</style>
