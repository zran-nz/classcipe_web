<template>
  <div class="my-full-form-wrapper">
    <div class="form-header">
      <common-form-header
        ref="commonFormHeader"
        :form="form"
        :last-change-saved-time="lastChangeSavedTime"
        @back="goBack"
        @save="handleSaveUnitPlan"
        @publish="handlePublishUnitPlan"
        @collaborate="handleStartCollaborate"
      />
    </div>
    <a-card :bordered="false" :bodyStyle="{ padding: '16px 24px', height: '100%', minHeight: '500px' }">
      <a-row class="unit-content" v-if="!contentLoading">
        <a-col span="4" v-if="showSidebar">
          <associate-sidebar
            :name="form.name"
            :type="contentType['unit-plan']"
            :id="unitPlanId"
            ref="associate"
            @create="showSelectAddContentTypeVisible"
            @link="showSelectLinkContentVisible"
            :show-create="true"/>
        </a-col>
        <a-col span="20" class="main-content">
          <a-card :bordered="false" :body-style="{padding: '16px'}">
            <div class="unit-plan-form-left" ref="form">
              <a-form-model :model="form" class="my-form-wrapper">
                <a-steps :current="0" direction="vertical">
                  <a-step >
                    <template slot="description">
                      <div class="form-block">
                        <div class="refer-action row-flex-right">
                          <div class="refer-text">
                            Refer from
                          </div>
                          <div class="refer-btn">
                            <a-button class="refer" type="primary" @click="handleStartRefer">
                              <img src="~@/assets/icons/unitplan/refer.png" class="btn-icon"/>
                              <div class="btn-text">
                                My Content
                              </div>
                            </a-button>
                          </div>
                        </div>
                      </div>

                      <div class="form-block">
                        <a-form-item label="Course Name">
                          <a-input v-model="form.name" placeholder="Enter Course Name" class="my-form-input" />
                        </a-form-item>
                      </div>

                      <div class="form-block">
                        <!-- image-->
                        <a-form-model-item class="img-wrapper">
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
                                  <img src="~@/assets/icons/lesson/upload_icon.png" class="upload-icon" />
                                </p>
                                <p class="ant-upload-text">
                                  {{ $t('teacher.add-unit-plan.upload-a-picture') }}
                                </p>
                              </div>
                            </template>
                          </a-upload-dragger>
                        </a-form-model-item>
                      </div>

                      <div class="form-block over-form-block" id="overview">
                        <a-form-model-item class="task-audio-line" label="Course Overview">
                          <a-textarea v-model="form.overview" placeholder="Overview" allow-clear />
                          <!--        <div class="audio-wrapper" v-if="form.audioUrl">
                            <audio :src="form.audioUrl" controls />
                            <span @click="form.audioUrl = null"><a-icon type="delete" /></span>
                          </div>
                          <a-tooltip>
                            <template slot="title">
                              Voice input
                            </template>
                            <div class="task-audio" @click="handleAddAudioOverview">
                              <img src="~@/assets/icons/lesson/microphone.png" />
                            </div>
                          </a-tooltip>-->
                        </a-form-model-item>
                      </div>

                      <div class="form-block inquiry-form-block" id="inquiry">
                        <!--                <a-divider />-->
                        <a-input v-model="form.inquiry" :placeholder="$store.getters.currentRole === 'teacher' ? $t('teacher.add-unit-plan.teacher-direction-of-inquiry') : $t('teacher.add-unit-plan.expert-direction-of-inquiry')" class="my-form-input" />
                      </div>

                      <!--            real-life-scenario-->
                      <div class="form-block ">
                        <a-divider>Teach Goal</a-divider>
                        <a-row>
                          <a-col span="24">
                            <div class="form-block-title">
                              Choose the relevant UN sustainable development goal
                            </div>
                          </a-col>
                        </a-row>
                      </div>
                      <!--sdg and KeyWords-->
                      <div
                        class="sdg-content-blocks sdg-form-block"
                        id="sdg"
                        v-for="(scenario, sdgIndex) in form.scenarios"
                        :key="sdgIndex">

                        <!--description-->
                        <div class="scenario-description">
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
                          <a-form-model-item >
                            <a-select size="large" v-model="scenario.sdgId" class="my-big-select">
                              <a-select-option v-for="(sdg,index) in sdgList" :value="sdg.id" :key="index" :disabled="selectedSdg.indexOf(sdg.id) != -1">
                                {{ sdg.name }}
                              </a-select-option>
                            </a-select>
                          </a-form-model-item>

                          <a-form-model-item>
                            <input-search
                              ref="descriptionInputSearch"
                              :default-value="scenario.description"
                              :key-index="sdgIndex"
                              :currend-index="currentIndex"
                              :search-list="descriptionSearchList"
                              label="description"
                              @search="handleDescriptionSearch"
                              @select-item="handleSelectScenario"
                              @reset="descriptionSearchList = []" />
                          </a-form-model-item>

                          <!--      <a-button class="browse" type="primary" @click="handleSelectDescription(sdgIndex)">
                            <img src="~@/assets/icons/unitplan/browse.png" class="btn-icon"/>
                            <div class="btn-text">
                              Browse
                            </div>
                          </a-button>-->
                        </div>

                        <!--keywords-->
                        <!--    <a-form-model-item>
                          <sdg-tag-input :selected-keywords="scenario.sdgKeyWords" :sdg-key="sdgIndex" @add-tag="handleAddSdgTag" @remove-tag="handleRemoveSdgTag"/>
                        </a-form-model-item>-->

                        <a-button type="link" icon="plus-circle" size="large" @click="handleAddMoreSdg"></a-button>
                      </div>

                      <div class="form-block">
                        <div class="form-input-item" v-for="(question, index) in form.questions" :key="index">
                          <a-input
                            v-model="question.name"
                            class="my-form-input"
                            :placeholder="$store.getters.currentRole === 'teacher' ? $t('teacher.add-unit-plan.teacher-nth-key-question') : $t('teacher.add-unit-plan.expert-nth-key-question')"/>
                          <div class="delete-icon" @click="handleRemoveQuestion(index)" v-show="form.questions.length > 1">
                            <a-icon type="delete" :style="{ fontSize: '20px' }" />
                          </div>
                        </div>
                        <a-button type="link" icon="plus-circle" size="large" @click="handleAddMoreQuestion"></a-button>
                      </div>

                    </template>
                  </a-step>
                  <a-step>
                    <template slot="description">
                      <a-form-item label="Set Learning outcomes" >
                        <a-button type="primary" @click="showBroswer">
                          <div class="btn-text" style="line-height: 20px">
                            Add Learning outcomes
                          </div>
                        </a-button>
                      </a-form-item>

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
                      <!--
                      <div
                        class="sdg-content-blocks question-item question-form-blocks"
                        id="question"
                        v-for="(learn, index) in form.learnOuts"
                        :key="index">

                        <div class="knowledge-delete-wrapper" @click="handleDeleteQuestion(questionItem, questionIndex)" v-show="form.learnOuts > 1">
                          <a-tooltip placement="top">
                            <template slot="title">
                              <span>{{ $t('teacher.add-unit-plan.delete-questions') }}</span>
                            </template>
                            <div class="sdg-delete">
                              <a-icon type="delete" :style="{ fontSize: '20px' }" />
                            </div>
                          </a-tooltip>
                        </div>

                      </div>-->
                      <div class="form-block">
                        <custom-tag ref="customTag" :selected-tags-list="form.customTags" @change-user-tags="handleChangeUserTags"></custom-tag>
                      </div>
                    </template>
                  </a-step>
                </a-steps>
              </a-form-model>
            </div>
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
        width="1200px"
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

      <a-modal v-model="showLibraryVisible" @ok="handleConfirmAssociate" destroyOnClose width="80%" :dialog-style="{ top: '20px' }">
        <div class="associate-library">
          <new-browser :select-mode="selectModel.knowledgeDescription" :question-index="selectDescriptionIndex"/>
        </div>
      </a-modal>

      <a-modal
        v-model="selectReferMyContentVisible"
        :footer="null"
        destroyOnClose
        width="1150px"
        title="Refer MyContent"
        @ok="selectReferMyContentVisible = false"
        @cancel="selectReferMyContentVisible = false">
        <div class="link-content-wrapper">
          <my-content-selector :current-id="unitPlanId" :filter-type-list="['unit-plan', 'topic']" :mode="DisplayMode.Refer" />
        </div>
      </a-modal>

      <a-drawer
        destroyOnClose
        placement="right"
        :closable="false"
        :mask="false"
        width="700px"
        :visible="referDetailVisible"
        @close="handleCloseReferDetail"
      >
        <a-row class="preview-wrapper-row">
          <a-col span="2" class="view-back-col">
            <div class="view-back" @click="handleCloseReferDetail">
              <div class="back-icon">
                <img src="~@/assets/icons/common/back.png" />
              </div>
            </div>
          </a-col>
          <a-col span="24" class="preview-wrapper-col">
            <div class="detail-wrapper">
              <div class="refer-detail">
                <refer-preview
                  :id="referId"
                  :type="referType"
                  @refer="handleReferBlock"
                  @hover-refer-block="handleHoverReferBlock"
                  @refer-associate="handleReferAssociate"
                />
              </div>
            </div>
          </a-col>
        </a-row>
      </a-drawer>

      <a-skeleton :loading="contentLoading" active>
      </a-skeleton>
    </a-card>
  </div>
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
import CollaborateContent from '@/components/Collaborate/CollaborateContent'
import CommonFormHeader from '@/components/Common/CommonFormHeader'
import NewBrowser from '@/components/NewLibrary/NewBrowser'
import { SelectModel } from '@/components/NewLibrary/SelectModel'
import DisplayMode from '@/components/MyContent/DisplayMode'
import { LibraryEvent, LibraryEventBus } from '@/components/NewLibrary/LibraryEventBus'
import ReferPreview from '@/components/UnitPlanRefer/ReferPreview'
const TagOriginType = {
  Origin: 'Origin',
  Search: 'Search',
  Description: 'Description',
  Create: 'Create',
  Extension: 'Extension'
}
export default {
  name: 'AddUnitPlan',
  components: {
    ReferPreview,
    CollaborateContent,
    CommonFormHeader,
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
    AddKeywordTag,
    NewBrowser
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
      DisplayMode: DisplayMode,

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
        name: 'Untitled UnitPlan',
        status: 0,
        subjects: '',
        learnOuts: [],
        questions: [
          {
            id: '',
            name: ''
          }
        ],
        scenarios: {
          description: '',
          sdgId: '1',
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
      currentIndex: 0,
      saving: false,
      publishing: false,
      showLibraryVisible: false,
      selectModel: SelectModel,
      selectDescriptionIndex: '',

      selectReferMyContentVisible: false,
      referDetailVisible: false,
      referId: null,
      referType: null,
      activeReferBlock: '',
      showSidebar: true
    }
  },
  watch: {
    referDetailVisible (value) {
      this.$logger.info('watch referDetailVisible ' + value)
      this.$logger.info('screen width: ', document.body.clientWidth)
       if (value && document.body.clientWidth < 1700) {
         this.showSidebar = false
       } else {
         this.showSidebar = true
       }
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
    selectedSdg () {
      const sdgList = []
      this.form.scenarios.forEach(item => sdgList.push(item.sdgId))
      console.log(sdgList)
      return sdgList
    }
  },
  created () {
    logger.info('unitPlanId ' + this.unitPlanId + ' ' + this.$route.path)
    // 初始化关联事件处理
    MyContentEventBus.$on(MyContentEvent.LinkToMyContentItem, this.handleLinkMyContent)
    MyContentEventBus.$on(MyContentEvent.ToggleSelectContentItem, this.handleToggleSelectContentItem)
    MyContentEventBus.$on(MyContentEvent.ReferContentItem, this.handleReferItem)
    LibraryEventBus.$on(LibraryEvent.ContentListSelectClick, this.handleSdgDescriptionSelectClick)
    this.initData()
    this.debouncedGetSdgByDescription = debounce(this.searchScenario, 300)
  },
  beforeDestroy () {
    MyContentEventBus.$off(MyContentEvent.LinkToMyContentItem, this.handleLinkMyContent)
    MyContentEventBus.$off(MyContentEvent.ToggleSelectContentItem, this.handleToggleSelectContentItem)
    MyContentEventBus.$off(MyContentEvent.ReferContentItem, this.handleReferItem)
    LibraryEventBus.$off(LibraryEvent.ContentListSelectClick, this.handleSdgDescriptionSelectClick)
    // logger.debug('beforeDestroy, try save!')
    // this.handleSaveUnitPlan()
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
            sdgId: '1',
            sdgKeyWords: []
          })
        } else {
          unitPlanData.scenarios.forEach(item => {
            if (!item.sdgId) {
              item.sdgId = undefined
            }
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
        // this.$refs.descriptionInputSearch.fetching = true
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
          sdgId: undefined,
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
        id: null,
        name: ''
      }
      logger.info('handleAddMoreQuestion ', question)
      this.form.questions.push(question)
    },
    handleRemoveQuestion (index) {
      logger.info('handleRemoveQuestion ', index)
      this.form.questions.splice(index, 1)
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
        this.$refs.commonFormHeader.saving = false
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
        this.$refs.commonFormHeader.publishing = false
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
        TaskAddOrUpdate({
            name: 'Unnamed Task',
            associateId: this.form.id,
            associateType: this.form.type
          }).then((response) => {
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
        LessonAddOrUpdate({
          name: 'Unnamed Lesson',
          associateId: this.form.id,
          associateType: this.form.type }).then((response) => {
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
        EvaluationAddOrUpdate({
          name: null,
          associateId: this.form.id,
          associateType: this.form.type
        }).then((response) => {
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
    },
    handleSelectDescription (sdgIndex) {
      this.$logger.info('handleSelectDescription', sdgIndex)
      this.selectDescriptionIndex = '' + sdgIndex
      this.showLibraryVisible = true
    },
    handleConfirmAssociate () {
      this.$logger.info('handleConfirmAssociate')
      this.associateLibraryVisible = false
    },

    handleStartRefer () {
      this.$logger.info('handleStartRefer')
      this.selectReferMyContentVisible = true
      this.referDetailVisible = false
    },

    handleSdgDescriptionSelectClick (data) {
      this.$logger.info('unit plan handleSdgDescriptionSelectClick', data)
      const sdgIndex = parseInt(data.questionIndex)
      this.$logger.info('sdgIndex ' + sdgIndex)
      const scenarioItem = this.form.scenarios[sdgIndex]
      this.$logger.info('scenarioItem ', scenarioItem)
      scenarioItem.description = data.description
      this.form.scenarios.splice(sdgIndex, 1, scenarioItem)
      this.$logger.info('after update scenarios', this.form.scenarios)
      this.showLibraryVisible = false
    },

    handleReferItem (data) {
      this.$logger.info('handleReferItem', data)
      this.referId = data.item.id
      this.referType = data.item.type
      this.selectReferMyContentVisible = false
      this.referDetailVisible = true
      this.$logger.info('referId ' + this.referId + ' referType ' + this.referType)
    },

    handleCloseReferDetail () {
      this.$logger.info('handleCloseReferDetail')
      this.referDetailVisible = false
      this.referId = null
      this.referType = null
      this.$refs['form'].className = 'unit-plan-form-left'
    },

    handleHoverReferBlock (data) {
      this.$logger.info('handleHoverReferBlock', data)
      this.$refs['form'].className = 'unit-plan-form-left ' + data.blockType
      document.getElementById(data.blockType).scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    },

    handleReferBlock (data) {
      this.$logger.info('handleReferBlock', data)
      if (data.blockType === 'overview') {
        this.form.overview = data.data
      }

      if (data.blockType === 'inquiry') {
        this.form.inquiry = data.data
      }

      if (data.blockType === 'sdg') {
        this.form.scenarios.push(data.data)
      }

      if (data.blockType === 'question') {
        this.form.scenarios.push(data.data)

        const question = Object.assign({
          questionId: null,
          visible: false
        }, data.data)
        logger.info('handleReferBlock AddQuestion ', question)
        this.questionMaxIndex = this.questionMaxIndex + 1
        this.questionTotal = this.questionTotal + 1
        this.$set(this.questionDataObj, this.questionPrefix + this.questionMaxIndex, question)
      }
    },

    handleReferAssociate (data) {
      this.$logger.info('handleReferAssociate', data)
      Associate({
        fromId: this.unitPlanId,
        fromType: this.contentType['unit-plan'],
        toId: data.item.id,
        toType: data.item.type
      }).then(response => {
        this.$logger.info('Associate response ', response)
        // 刷新子组件的关联数据
        this.$refs.associate.loadAssociateData()
        this.$message.success('success!')
      })
    },
    showSelectLinkContentVisible () {
      if (!this.form.questions || this.form.questions.length === 0) {
        this.$logger.info('no relevantQuestionList')
        var that = this
        this.$confirm({
          title: 'Alert',
          content: 'Please add questions and tags before linking',
          onOk: function () {
            that.handleHoverReferBlock({ blockType: 'question' })
          }
        })
      } else {
        this.selectLinkContentVisible = true
      }
    },
    showSelectAddContentTypeVisible () {
      if (!this.form.questions || this.form.questions.length === 0) {
        this.$logger.info('no relevantQuestionList')
        var that = this
        this.$confirm({
          title: 'Alert',
          content: 'Please add questions and tags before linking',
          onOk: function () {
            that.handleHoverReferBlock({ blockType: 'question' })
          }
        })
      } else {
        this.selectAddContentTypeVisible = true
      }
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
    .image-preview {
      img {
        /*max-width: 100%;*/
        max-height: 250px;
      }
    }

    p.ant-upload-text {
      color: #000;
      font-family: Inter-Bold;
    }

    .upload-container {
      padding: 16px 0;
    }

    .uploading-tips {
      padding-left: 10px;
    }

    .upload-icon {
      height: 70px;
    }
    .select-template {
      text-align: center;

      .lesson-select-template {
        margin-left: 10px;
        margin-right: 10px;
      }
    }

    .form-block-title {
      font-family: PingFang SC;
      font-weight: bold;
      line-height: 24px;
      color: #000000;
      margin-bottom: 10px;
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

    .sdg-content-blocks {
      /*width: 800px;*/
      position: relative;
      border: 1px solid #fff;
      box-sizing: border-box;
      padding: 20px 150px 20px 50px;
      border-radius: 3px;
      margin-bottom: 5px;

      .scenario-description{
        margin-top: 10px;
        position: relative;

        .sdg-delete-wrapper {
          transition: all 0.2s ease-in;
          display: block;
          position: absolute;
          text-align: center;
          right:-60px;
          top: 0;
          line-height: 40px;
          width: 40px;
          height: 40px;
          cursor: pointer;
          color: @link-hover-color;
          z-index: 100;
        }
        .browse{
          padding: 10px 5px;
          position: absolute;
          right: -100px;
          top: 70px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
          border-radius: 6px;
        }
        .btn-icon {
          height: 18px;
          width: 18px;
        }
        .btn-text {
          padding: 0 5px;
        }
      }

      &:hover {
        border: 1px solid #15C39A;
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
        top: 80px;
        line-height: 50px;
        width: 50px;
        height: 50px;
        cursor: pointer;
        color: @link-hover-color;
        z-index: 1000;
        display: block;
      }

      &:hover {
        //border: 1px dotted @link-hover-color;
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
    .content-blocks {
      width: 600px;
      position: relative;
      border: 1px dotted #fff;
      .scenario-description{
        margin-top: 10px;
        position: relative;
        .browse{
          padding: 10px 5px;
          position: absolute;
          right: -100px;
          top: 70px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
          border-radius: 6px;
        }
        .btn-icon {
          height: 18px;
          width: 18px;
        }
        .btn-text {
          padding: 0 5px;
        }
      }

      .sdg-delete-wrapper {
        transition: all 0.2s ease-in;
        display: block;
        position: absolute;
        text-align: center;
        right:-60px;
        top: 5px;
        line-height: 50px;
        width: 50px;
        height: 50px;
        cursor: pointer;
        color: @link-hover-color;
        z-index: 1000;
      }

      &:hover {
        //border: 1px dotted @link-hover-color;
        //box-sizing: border-box;
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
        display: block;
      }

      &:hover {
        //border: 1px dotted @link-hover-color;
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
      width: 600px;
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
  width: 600px;
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
  &.ant-form-item{
    margin-bottom: 0px;
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

.form-block {
  box-sizing: border-box;
  margin-bottom: 10px;
  border: 1px solid #fff;
  padding: 20px 150px 20px 50px;
  border-radius: 3px;
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
  width: 800px;
  .refer-action {
    .refer-text {
      font-family: Inter-Bold;
      line-height: 24px;
      color: #000000;
      margin-right: 10px;
    }

    .refer-btn {
      .refer{
        padding: 10px 15px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        border-radius: 6px;
      }
      .btn-icon {
        height: 12px;
        width: 12px;
      }
      .btn-text {
        padding-left: 8px;
      }
    }
  }
}

.add-sdg-btn {
  padding: 15px 15px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  border-radius: 5px;
  height: 45px;

  .btn-icon {
    height: 25px;
    width: 25px;
  }

  .btn-text {
    padding-left: 10px;
  }
}

.unit-plan-form-left {
  width: 800px;
}

.form-input-item {
  margin-bottom: 20px;
}

.preview-wrapper-row{
  .preview-wrapper-col{
    margin: 15px;
  }
  .view-back-col {
    position: absolute;
    left: -20px;
    top: -20px;
    .view-back{
      .back-icon {
        text-align: left;

        img {
          width: 90%;
          cursor: pointer;
        }
      }
    }
  }
}

.detail-wrapper {
  background: #FFFFFF;
  border: 1px solid #D8D8D8;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  opacity: 1;
  border-radius: 10px;
}

.overview {
  .over-form-block {
    border: 1px solid #15C39A !important;
  }
}

.sdg {
  .sdg-form-block {
    border: 1px solid #15C39A !important;
  }
}

.inquiry {
  .inquiry-form-block {
    border: 1px solid #15C39A !important;
  }
}

.question {
  .question-form-blocks {
    border: 1px solid #15C39A !important;
  }
}
#inquiry{
  margin-top: -10px;
}

.delete-icon {
  -webkit-transition: all 0.2s ease-in;
  transition: all 0.2s ease-in;
  position: absolute;
  right: 10px;
  margin-right: 30px;
  margin-top: -40px;
  line-height: 40px;
  width: 40px;
  height: 40px;
  cursor: pointer;
  color: @link-hover-color;
  z-index: 100;
}
</style>
