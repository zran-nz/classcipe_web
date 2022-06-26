<template>
  <div class='my-full-form-wrapper' id='formRoot'>
    <fixed-form-header>
      <template v-slot:header>
        <form-header
          title='Create sub-task'
          :form='form'
          :spin='saving'
          :share-status='shareStatus'
          :collaborate='collaborate'
          :last-change-saved-time='lastChangeSavedTime'
          @view-collaborate='handleViewCollaborate'
          @back='goBack'
          @save='save'
          @share='handleShareTask'
          @publish='handlePublishTask'
          @collaborate='handleStartCollaborate'>
          <template v-slot:right>
          </template>
        </form-header>
      </template>
      <template v-slot:nav>
        <my-vertical-steps
          ref='steps-nav'
          :steps='formSteps'
          :step-index='currentActiveStepIndex'
          @step-change='handleStepChange' />
      </template>
    </fixed-form-header>
    <div class='form-content'>
      <div class='step-content' v-if='!contentLoading'>
        <div class='form-body root-locate-form' id='form-body' :style="{ width: formBodyWidth }" v-show="formBodyWidth !== '0%'">
          <div
            class='form-page-item'
            v-show='currentActiveStepIndex === stepIndex'
            v-for='(step, stepIndex) in formSteps'
            :key='step.id'>
            <div class='form-field-item' v-for='fieldItem in taskCommonList' :key='fieldItem.id'>
              <template v-if='step.commonFields.indexOf(fieldItem.fieldName) !== -1'>
                <div class='form-block tag-content-block' v-if='fieldItem.visible && fieldItem.fieldName === splitTaskField.Name' :key='fieldItem.fieldName'>
                  <collaborate-tooltip :form-id="taskId" :fieldName=splitTaskField.Name />
                  <custom-form-item :required='emptyRequiredFields.indexOf(splitTaskField.Name) !== -1'>
                    <template slot='label'>
                      {{ 'Task name' | taskLabelName(splitTaskField.Name, $store.getters.formConfigData) }}
                    </template>
                    <template v-if='taskLabelHint(splitTaskField.Name, $store.getters.formConfigData)' slot='tips'>
                      <a-tooltip :title="'Task name' | taskLabelHint(splitTaskField.Name, $store.getters.formConfigData)" placement='top'>
                        <a-icon type="info-circle" />
                      </a-tooltip>
                    </template>
                    <a-input v-model='form.name' placeholder='Enter Task Name' class='cc-form-input' />
                  </custom-form-item>
                </div>

                <div
                  class='form-block over-form-block tag-content-block'
                  id='overview'
                  v-if='fieldItem.visible && fieldItem.fieldName === splitTaskField.Overview'
                  :key='fieldItem.fieldName'>
                  <collaborate-tooltip :form-id="taskId" :fieldName=splitTaskField.Overview />
                  <custom-form-item class='task-audio-line' ref='overview' :required='emptyRequiredFields.indexOf(splitTaskField.Overview) !== -1'>
                    <template slot='label'>
                      {{ 'Task details' | taskLabelName(splitTaskField.Overview, $store.getters.formConfigData) }}
                    </template>
                    <template slot='action'>
                      <comment-switch
                        :field-name='splitTaskField.Overview'
                        :is-active="currentFieldName === splitTaskField.Overview"
                        @switch='handleSwitchComment'
                        :class="{'my-comment-switch':true,'my-comment-show':currentFieldName === splitTaskField.Overview}" />
                    </template>
                    <template v-if='taskLabelHint(splitTaskField.Overview, $store.getters.formConfigData)' slot='tips'>
                      <a-tooltip :title="'Task details' | taskLabelHint(splitTaskField.Overview, $store.getters.formConfigData)" placement='top'>
                        <a-icon type="info-circle" />
                      </a-tooltip>
                    </template>
                    <a-textarea
                      :auto-size="{ minRows: 2, maxRows: 6 }"
                      v-model='form.overview'
                      placeholder='Details'
                      class='cc-form-textarea'
                      allow-clear/>
                  </custom-form-item>
                </div>

                <div class='form-block taskType tag-content-block' v-if='fieldItem.visible && fieldItem.fieldName === splitTaskField.TaskType' :key='fieldItem.fieldName'>
                  <collaborate-tooltip :form-id="taskId" :fieldName=splitTaskField.TaskType style="left:20px" />
                  <custom-form-item class='task-audio-line' ref='taskType' :colon='false' :required='emptyRequiredFields.indexOf(splitTaskField.TaskType) !== -1'>
                    <template slot='label'>
                      {{ 'Choose Task Type' | taskLabelName(splitTaskField.TaskType, $store.getters.formConfigData) }}
                    </template>
                    <template slot='action'>
                      <comment-switch
                        :field-name='splitTaskField.TaskType'
                        :is-active="currentFieldName === splitTaskField.TaskType"
                        @switch='handleSwitchComment'
                        :class="{'my-comment-switch':true,'my-comment-show':currentFieldName === splitTaskField.TaskType}" />
                    </template>
                    <template v-if='taskLabelHint(splitTaskField.TaskType, $store.getters.formConfigData)' slot='tips'>
                      <a-tooltip :title="'Choose Task Type' | taskLabelHint(splitTaskField.TaskType, $store.getters.formConfigData)" placement='top'>
                        <a-icon type="info-circle" />
                      </a-tooltip>
                    </template>
                    <div class='self-type-wrapper'>
                      <div class='self-field-label'>
                        <div
                          :class="{'task-type-item': true, 'green-active-task-type': form.taskType === 'FA'}"
                          @click="handleSelectTaskType('FA')">FA
                        </div>
                        <div
                          :class="{'task-type-item': true, 'red-active-task-type': form.taskType === 'SA'}"
                          @click="handleSelectTaskType('SA')">SA
                        </div>
                        <div
                          :class="{'task-type-item': true, 'task-type-activity': true,'blue-active-task-type': form.taskType === 'Activity'}"
                          @click="handleSelectTaskType('Activity')">
                          <a-tooltip title='Teaching/Learning Activity' placement='top'>Activity</a-tooltip>
                        </div>
                      </div>
                    </div>
                  </custom-form-item>
                </div>

                <div class='form-block form-question tag-content-block' v-if='associateQuestionList.length > 0 && fieldItem.visible && fieldItem.fieldName === splitTaskField.Question' :key='fieldItem.fieldName'>
                  <collaborate-tooltip :form-id="taskId" :fieldName=splitTaskField.Question />
                  <custom-form-item :required='emptyRequiredFields.indexOf(splitTaskField.Question) !== -1'>
                    <template slot='label'>
                      {{ 'Choose Key questions' | taskLabelName(splitTaskField.Overview, $store.getters.formConfigData) }}
                    </template>
                    <template slot='action'>
                      <comment-switch
                        :field-name='splitTaskField.Question'
                        :is-active="currentFieldName === splitTaskField.Question"
                        @switch='handleSwitchComment'
                        :class="{'my-comment-switch':true,'my-comment-show':currentFieldName === splitTaskField.Question}" />
                    </template>
                    <template v-if='taskLabelHint(splitTaskField.Overview, $store.getters.formConfigData)' slot='tips'>
                      <a-tooltip :title="'Choose Key questions' | taskLabelHint(splitTaskField.Overview, $store.getters.formConfigData)" placement='top'>
                        <a-icon type="info-circle" />
                      </a-tooltip>
                    </template>
                    <a-select
                      :getPopupContainer="trigger => trigger.parentElement"
                      size='large'
                      class='my-big-select'
                      v-model='form.questionIds'
                      mode='multiple'
                      placeholder='Choose Key questions'
                      option-label-prop='label'
                    >
                      <a-select-option
                        v-for='(item,index) in associateQuestionList'
                        :value='item.id'
                        :label='item.name'
                        :key='index'>
                        <span class='question-options'>
                          {{ item.name }}
                        </span>
                        From Unit Plan({{ item.unitName }})
                      </a-select-option>
                    </a-select>
                  </custom-form-item>
                </div>

                <div class='form-block tag-content-block' v-if='fieldItem.visible && fieldItem.fieldName === splitTaskField.LearnOuts' :key='fieldItem.fieldName'>
                  <collaborate-tooltip :form-id="taskId" :fieldName=splitTaskField.LearnOuts style="left:100px" />
                  <custom-form-item :required='emptyRequiredFields.indexOf(splitTaskField.LearnOuts) !== -1'>
                    <template slot='label'>
                      {{ 'Learning objectives' | taskLabelName(splitTaskField.LearnOuts, $store.getters.formConfigData) }}
                    </template>
                    <learning-objective-select
                      @change='handleUpdateLearningObjectives'
                      :learning-objectives='allLearningObjectiveList' />
                  </custom-form-item>
                </div>

                <div
                  class='form-block tag-content-block material-list-block'
                  style='clear: both'
                  v-if='fieldItem.visible && fieldItem.fieldName === splitTaskField.MaterialList'
                  :key='fieldItem.fieldName'>
                  <collaborate-tooltip :form-id="taskId" :fieldName=splitTaskField.MaterialList />
                  <custom-form-item :required='emptyRequiredFields.indexOf(splitTaskField.MaterialList) !== -1'>
                    <template slot='label'>
                      {{ 'Resources required for hands-on activities' | taskLabelName(splitTaskField.MaterialList, $store.getters.formConfigData) }}
                    </template>
                    <template slot='action'>
                      <comment-switch
                        :field-name='splitTaskField.MaterialList'
                        :is-active="currentFieldName === splitTaskField.MaterialList"
                        @switch='handleSwitchComment'
                        :class="{'my-comment-switch':true,'my-comment-show':currentFieldName === splitTaskField.MaterialList}" />
                    </template>
                    <template v-if='taskLabelHint(splitTaskField.MaterialList, $store.getters.formConfigData)' slot='tips'>
                      <a-tooltip :title="'Resources required for hands-on activities' | taskLabelHint(splitTaskField.MaterialList, $store.getters.formConfigData)" placement='top'>
                        <a-icon type="info-circle" />
                      </a-tooltip>
                    </template>
                    <div>
                      <a-switch size="small" v-model='materialListFlag' @change='handleMaterialListFlagChange'/>
                    </div>
                  </custom-form-item>
                  <div class='material-list'>
                    <div
                      class='material-item'
                      v-for='(materialItem, mIndex) in form.materialList'
                      :key='mIndex'>
                      <a-row :gutter='[8, 16]'>
                        <a-col span='6'>
                          <a-input
                            class='cc-form-input'
                            v-model='materialItem.name'
                            aria-placeholder='Enter material name'
                            placeholder='Enter material name' />
                        </a-col>
                        <a-col span='16'>
                          <a-tooltip placement='topLeft' :mouseEnterDelay="1">
                            <template slot='title'>
                              The link is provided to help other users or students prepare(purchase) the material
                              for this task
                            </template>
                            <a-input
                              class='cc-form-input'
                              addon-before="https://"
                              v-model='materialItem.link'
                              aria-placeholder='Enter URL'
                              placeholder='Enter URL'>
                              <a-button
                                @click="handleTestWebsiteLink(materialItem)"
                                slot='suffix'
                                shape='round'
                                type='primary'
                                size="small"
                                :disabled='!materialItem.link'>Test</a-button>
                            </a-input>
                            <span class='url-error-tips' v-show='materialItem.link && !checkUrl(materialItem.link)'>Please enter a valid URL</span>
                          </a-tooltip>
                        </a-col>
                        <a-col span='2'>
                          <div class='material-icon'>
                            <a-icon :style="{ fontSize: '14px', color: 'red' }" type='delete' @click='handleRemoveMaterialItem(materialItem, mIndex)'/>
                          </div>
                        </a-col>
                      </a-row>
                    </div>
                    <span class='add-material-item' v-show='materialListFlag'>
                      <add-green-icon class='add-input' @click='handleAddMaterial' />
                    </span>
                  </div>
                </div>

                <div class='form-block tag-content-block' v-if='fieldItem.visible && fieldItem.fieldName === splitTaskField.SelectSlides' :key='fieldItem.fieldName'>
                  <form-slide-page-select :thumbnail-list='thumbnailList' :select-page-object-ids.sync='form.selectPageObjectIds' v-if='!thumbnailListLoading'/>
                  <a-skeleton v-if='thumbnailListLoading' />
                </div>

                <div class='form-block tag-content-block' v-if='fieldItem.visible && fieldItem.fieldName === splitTaskField.Link' :key='fieldItem.fieldName'>
                  <div class='common-link-wrapper'>
                    <form-linked-content :from-id='taskId' :from-type='contentType.task' v-if='taskId' @update-unit-id-list='updateUnitIdList'/>
                  </div>
                </div>

                <div class='form-block' v-if='fieldItem.visible && fieldItem.fieldName === splitTaskField.Image' :key='fieldItem.fieldName'>
                  <!-- image-->
                  <custom-form-item class='img-wrapper' :required='emptyRequiredFields.indexOf(splitTaskField.Image) !== -1'>
                    <template slot='label'>
                      {{ 'Cover' | taskLabelName(splitTaskField.Image, $store.getters.formConfigData) }}
                    </template>
                    <template v-if='taskLabelHint(splitTaskField.Image, $store.getters.formConfigData)' slot='tips'>
                      <a-tooltip :title="'Cover' | taskLabelHint(splitTaskField.Image, $store.getters.formConfigData)" placement='top'>
                        <a-icon type="info-circle" />
                      </a-tooltip>
                    </template>
                    <custom-image-uploader
                      v-if='taskId'
                      :field='splitTaskField.Image'
                      :content-id='taskId'
                      :content-type='contentType.task'
                      :img-url='form.image'
                      @update='handleUpdateCover' />
                  </custom-form-item>
                </div>

                <div class='form-field-item assessment-tools-item' v-if="fieldItem.visible && fieldItem.fieldName === splitTaskField.AssessmentTools">
                  <div class='form-block tag-content-block'>
                    <div class='common-link-wrapper assessment-tools'>
                      <task-assessment-tools
                        :allow-create='false'
                        :task-id='taskId'
                        v-if='taskId && showSubAssessment' />
                    </div>
                  </div>
                </div>

              </template>
            </div>
            <div class='form-field-item custom-field' v-for='custFieldItem in $store.getters.formConfigData.taskCustomList' :key='custFieldItem.id'>
              <template v-if='step.customFields && step.customFields.indexOf(custFieldItem.name) !== -1'>
                <div class='form-block tag-content-block' v-if="custFieldItem.visible && form.customFieldData && form.customFieldData.hasOwnProperty(custFieldItem.id)" :key='custFieldItem.id' :data-field-name="'cust_' + custFieldItem.name" :data-field-id='custFieldItem.id'>
                  <custom-form-item>
                    <template slot='label'>
                      {{ custFieldItem.name }}
                      <template v-if='custFieldItem.hint'>
                        <a-tooltip :title="custFieldItem.hint" placement='top'>
                          <a-icon type="info-circle" />
                        </a-tooltip>
                      </template>
                    </template>
                    <a-input v-model='form.customFieldData[custFieldItem.id]' class='cc-form-input'/>
                  </custom-form-item>
                </div>
              </template>
            </div>
          </div>
        </div>
        <div class='tag-body' :style="{ width: tagBodyWidth }" v-show="tagBodyWidth !== '0%'">
          <template v-if='currentRightModule === rightModule.collaborate'>
            <a-skeleton :loading='showHistoryLoading' active>
              <div
                class='collaborate-panel'>
                <div class='icon'>
                  <comment-icon />
                </div>
                <a-tabs :default-active-key='defaultHistoryKey'>
                  <a-tab-pane key='1' tab='Comment'>
                    <collaborate-comment-view
                      :source-id='taskId'
                      :source-type='contentType.task'
                      :comment-list='collaborateCommentList'
                      :collaborate-user-list="collaborate.users"
                      @update-comment='handleUpdateCommentList'
                      v-if='taskId'/>
                  </a-tab-pane>
                  <a-tab-pane key='2' tab='History' force-render>
                    <collaborate-history :history-list='historyList' @restore='handleRestoreField' />
                  </a-tab-pane>
                </a-tabs>
              </div>
            </a-skeleton>
          </template>
          <template v-if='currentRightModule === rightModule.collaborateComment'>
            <div
              class='collaborate-panel'>
              <collaborate-comment-panel
                :source-id='taskId'
                :source-type='contentType.task'
                :field-name='currentFieldName'
                :comment-list='currentCollaborateCommentList'
                :collaborate-user-list="collaborate.users"
                @cancel-comment="handleCancelComment"
                @update-comment='handleUpdateCommentList'
                v-if='taskId'/>
            </div>
          </template>
          <template v-if='currentRightModule === rightModule.recommend'>
            <slide-select-list :source-id='taskId' :selected-template-list='form.selectedTemplateList' v-if='taskId'/>
          </template>
          <template v-if='currentRightModule === rightModule.customTag'>
            <div v-if='!this.contentLoading'>
              <custom-tag-v3
                :custom-tags.sync='form.customTags'
                :tag-category-desc.sync='form.tagCategoryDesc'/>
            </div>
          </template>
          <template v-if='currentRightModule === rightModule.associate'>
            <link-content-list :filter-types="[contentType['unit-plan'], contentType.evaluation]" />
          </template>
          <template v-if='currentRightModule === rightModule.assessmentToolsLearnOuts'>
          </template>
        </div>
      </div>
      <div class='loading-content' v-if='contentLoading'>
        <a-spin />
      </div>
    </div>
    <fixed-form-footer>
      <template v-slot:left>
        <a-button @click='handleDiscardStep' class='cc-round-button'>
          Discard
        </a-button>
      </template>
      <template v-slot:right>
        <a-button type='primary' @click='handleNextStep' class='cc-round-button'>
          <template v-if='currentActiveStepIndex < formSteps.length - 1'>
            Next
          </template>
          <template v-else>
            Complete
          </template>
        </a-button>
      </template>
    </fixed-form-footer>

    <a-modal
      v-model='showCollaborateModalVisible'
      :footer='null'
      :maskClosable='false'
      :closable='true'
      destroyOnClose
      width='640px'>
      <collaborate-user-list
        :content-id='taskId'
        :main-content='collaborateContent'
        :content-type='contentType.task'
        @confirmSelect='confirmSelectCollaborateUsers'
        v-if='showCollaborateModalVisible && taskId' />
    </a-modal>
    <a-modal
      v-model='shareVisible'
      :footer='null'
      destroyOnClose
      title='Share'
      width='500px'
      @ok='shareVisible = false'
      @cancel='shareVisible = false'>
      <share-content-setting
        :source-id='form.id'
        :source-type='form.type'
        @update-share-status='handleShareStatus'
      />
    </a-modal>
    <a-modal
      v-model='showUpdateContent'
      :footer='null'
      :title='null'
      destroyOnClose
      width='700px'
      :maskClosable="false"
      :closable='false'>
      <collaborate-update-content
        ref="collaborateUpdate"
        :source-id='taskId'
        :source-type='contentType.task'
        @update-content='handleUpdateContent'
        v-if='taskId'
      />
    </a-modal>
  </div>
</template>

<script>
import { typeMap } from '@/const/teacher'
import { FindSourceOutcomes, GetAssociate, GetMyGrades, GetReferOutcomes } from '@/api/teacher'
import { TemplatesGetPresentation } from '@/api/template'
import { SplitTask, TaskQueryById } from '@/api/task'
import Collaborate from '@/components/UnitPlan/Collaborate'
import CustomTagV3 from '@/components/CustomTag/CustomTagV3'
import CollaborateUserList from '@/components/Collaborate/CollaborateUserList'
import { SplitTaskField } from '@/const/common'
import UiLearnOut from '@/components/UnitPlan/UiLearnOut'
import CollaborateCommentPanel from '@/components/Collaborate/CollaborateCommentPanel'
import CommentSwitch from '@/components/Collaborate/CommentSwitch'
import CollaborateCommentView from '@/components/Collaborate/CollaborateCommentView'
import CollaborateHistory from '@/components/Collaborate/CollaborateHistory'
import TemplatePreview from '@/components/Task/TemplatePreview'
import { UtilMixin } from '@/mixins/UtilMixin'
import moment from 'moment'
import { BaseEventMixin, RightModule } from '@/mixins/BaseEvent'
import { FormConfigMixin } from '@/mixins/FormConfigMixin'
import ShareContentSetting from '@/components/Share/ShareContentSetting'
import { QueryContentShare } from '@/api/share'
import CollaborateTooltip from '@/components/Collaborate/CollaborateTooltip'
import CollaborateUpdateContent from '@/components/Collaborate/CollaborateUpdateContent'
import LocalStore from '@/websocket/localstore'
import { chooseAnother } from '@/api/quickTask'
import AddGreenIcon from '@/assets/svgIcon/evaluation/form/tianjia_green.svg?inline'
import { GoogleAuthCallBackMixin } from '@/mixins/GoogleAuthCallBackMixin'
import MyVerticalSteps from '@/components/Steps/MyVerticalSteps'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import FormLinkedContent from '@/components/Common/FormLinkedContent'
import LinkContentList from '@/components/UnitPlan/LinkContentList'
import FixedFormHeader from '@/components/Common/FixedFormHeader'
import FormHeader from '@/components/FormHeader/FormHeader'
import FixedFormFooter from '@/components/Common/FixedFormFooter'
import CustomFormItem from '@/components/Common/CustomFormItem'
import CustomTextButton from '@/components/Common/CustomTextButton'
import TaskAssessmentTools from '@/components/AssessmentTool/TaskAssessmentTools'
import FormSlide from '@/components/PPT/FormSlide'
import SlideSelectList from '@/components/PPT/SlideSelectList'
import CustomCoverMedia from '@/components/Common/CustomCoverMedia'
import { PublishMixin } from '@/mixins/PublishMixin'
import LearningObjective from '@/components/LearningObjective/LearningObjective'
import { AutoSaveMixin } from '@/mixins/AutoSaveMixin'
import CustomImageUploader from '@/components/Common/CustomImageUploader'
import ModalHeader from '@/components/Common/ModalHeader'
import FormSlidePageSelect from '@/components/SplitTask/FormSlidePageSelect'
import LearningObjectiveSelect from '@/components/LearningObjective/LearningObjectiveSelect'
import { AssessmentToolInfoList, AssessmentToolInfoSaveBatch } from '@/api/v2/assessment'

export default {
  name: 'SplitTask',
  components: {
    LearningObjectiveSelect,
    FormSlidePageSelect,
    ModalHeader,
    CustomImageUploader,
    LearningObjective,
    CustomCoverMedia,
    SlideSelectList,
    FormSlide,
    TaskAssessmentTools,
    CustomTextButton,
    CustomFormItem,
    FixedFormFooter,
    FormHeader,
    FixedFormHeader,
    LinkContentList,
    FormLinkedContent,
    MyVerticalSteps,
    AddGreenIcon,
    ShareContentSetting,
    TemplatePreview,
    CollaborateHistory,
    CollaborateCommentView,
    CommentSwitch,
    CollaborateCommentPanel,
    UiLearnOut,
    Collaborate,
    CollaborateUserList,
    CustomTagV3,
    CollaborateTooltip,
    CollaborateUpdateContent
  },
  mixins: [ UtilMixin, BaseEventMixin, FormConfigMixin, GoogleAuthCallBackMixin, PublishMixin, AutoSaveMixin ],
  props: {
    parentTaskId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      contentLoading: true,
      contentType: typeMap,
      creating: false,
      allLearningObjectiveList: [],
      form: {
        id: null,
        coverVideo: '',
        image: '',
        copyFromSlide: null,
        presentationId: '',
        pageObjectIds: '',
        name: 'Untitled sub task',
        overview: '',
        tasks: [],
        status: 0,
        taskType: '',
        createTime: '',
        createBy: '',
        updateTime: '',
        customTags: [],
        tagCategoryDesc: [],
        subjectIds: [],
        gradeIds: [],
        selectPageObjectIds: [],
        bloomCategories: '',
        curriculumId: null,
        learnOuts: [],
        yearList: [],
        languageList: [],
        subjectList: [],
        selfOuts: [],
        showSelect: false,
        startDate: '',
        endDate: '',
        gradeId: undefined,
        materialList: [],
        customFieldData: null,
        price: 0,
        isSelfLearning: false
      },
      gradeList: [],

      thumbnailList: [],
      thumbnailListLoading: true,

      associateQuestionList: [],

      showHistoryLoading: false,

      recommendData: [],

      associateUnitPlanIdList: [],
      associateTaskIdList: [],
      associateId2Name: new Map(),

      materialListFlag: false,

      shareVisible: false,
      shareStatus: 0,
      splitTaskField: SplitTaskField,

      currentActiveStepIndex: this.getSessionStep(),
      currentStep: {
        id: null,
        commonFields: [],
        customFields: []
      },

      formBodyWidth: '55%',
      tagBodyWidth: '45%',
      fullBodyFields: [SplitTaskField.LearnOuts, SplitTaskField.SelectSlides],

      taskCommonList: [],
      showSubAssessment: false
    }
  },
  computed: {
    isOwner() {
      return this.$store.getters.userInfo.email === this.form.createBy
    },
    taskId () {
      return this.form.id ? this.form.id : null
    }
  },
  watch: {
    currentStep: {
      handler(val) {
        this.$logger.info('currentStep change', val)
        this.handleDisplayRightModule()
      },
      deep: true,
      immediate: false
    }
  },
  async created() {
    this.$logger.info('split task created ' + this.parentTaskId + ' ' + this.$route.path)

    let token = this.$route.query.token
    if (!token) {
      token = storage.get(ACCESS_TOKEN)
    }
    this.$store.dispatch('loadFormConfigData', token).then(() => {
      // 添加选择PPT页字段
      const taskCommonList = JSON.parse(JSON.stringify(this.$store.getters.formConfigData.taskCommonList))
      taskCommonList.push({
        fieldLabel: 'Select slides',
        showName: 'Select slides',
        id: SplitTaskField.SelectSlides,
        sortNo: 0,
        visible: true,
        fieldName: SplitTaskField.SelectSlides
      })
      this.taskCommonList = taskCommonList
      this.$logger.info('taskCommonList', this.taskCommonList.map(item => item.showName + ' ' + item.fieldName))

      // 从task的step中拷贝一份，去掉最后一步slide，添加第一步选择slide图片形成split task的步骤配置
      const taskFormSteps = JSON.parse(JSON.stringify(this.$store.getters.formConfigData.taskSteps || []))
      // 拆分task是自选父Task的PPT图片,故去掉最后一步slide
      const slideStepIndex = taskFormSteps.findIndex(step => step.commonFields.indexOf(SplitTaskField.Slides) > -1)
      if (slideStepIndex > -1) {
        taskFormSteps.splice(slideStepIndex, 1)
      } else {
        this.$logger.warn('split task no slide step')
      }
      taskFormSteps.unshift({
        id: 0,
        stepNo: 0,
        visible: true,
        name: 'Select slides',
        commonFields: [
          SplitTaskField.SelectSlides
        ],
        showRequiredTips: false,
        showSatisfiedTips: false
      })
      this.$logger.info('taskFormSteps', taskFormSteps)
      this.formSteps = taskFormSteps
      this.$logger.info('formSteps', this.formSteps)
      this.requiredFields = [
        SplitTaskField.Name,
        SplitTaskField.Image,
        SplitTaskField.Overview,
        SplitTaskField.Question,
        SplitTaskField.GradeIds,
        SplitTaskField.SubjectIds,
        SplitTaskField.LearnOuts,
        SplitTaskField.SelectSlides
      ]
      if (this.currentActiveStepIndex < 0 || this.currentActiveStepIndex > this.formSteps.length - 1) {
        this.currentActiveStepIndex = 0
      }
      this.currentStep = this.formSteps[this.currentActiveStepIndex]
      this.handleDisplayRightModule()
      this.checkIsFullBodyStep()
    })
    this.$logger.info('恢复step', this.currentActiveStepIndex, this.currentStep)
    this.initData()

    this.$EventBus.$on('assessment-saved', this.autoSaveMixinUpdateSaveTime)
  },
  beforeDestroy() {
    this.$EventBus.$off('assessment-saved', this.autoSaveMixinUpdateSaveTime)
  },
  methods: {
    initData() {
      this.$logger.info('initData doing...')
      GetMyGrades().then((response) => {
        this.$logger.info('add task initData done', response)
        this.gradeList = response.result
      }).then(() => {
        this.contentLoading = false
      }).catch((e) => {
        this.$logger.error(e)
        this.$message.error(this.$t('teacher.add-task.init-data-failed'))
      })

      TaskQueryById({
        id: this.parentTaskId
      }).then(async response => {
        if (response.code === 0) {
          const taskData = response.result
          if (!taskData.materialList) {
            taskData.materialList = []
          }

          this.materialListFlag = taskData.materialList.length > 0
          // 填充自定义字段
          const customFieldData = taskData.customFieldData ? JSON.parse(taskData.customFieldData) : null
          const displayCustomFieldData = {}
          if (customFieldData) {
            // 只显示配置中存在的字段,用id做key，改名后依旧可以使用老数据
            this.$store.getters.formConfigData.taskCustomList.forEach(customField => {
              if (customFieldData.hasOwnProperty(customField.id)) {
                displayCustomFieldData[customField.id] = customFieldData[customField.id]
              } else {
                displayCustomFieldData[customField.id] = ''
              }
            })
          } else {
            this.$store.getters.formConfigData.taskCustomList.forEach(customField => {
              displayCustomFieldData[customField.id] = ''
            })
          }
          this.$logger.info('displayCustomFieldData', displayCustomFieldData)
          taskData.customFieldData = displayCustomFieldData
          this.allLearningObjectiveList = taskData.learnOuts
          taskData.id = null
          this.saving = true
          this.form = taskData
          await this.save()
          this.saving = false
          this.loadAssessment()
          this.$logger.info('restore split task', this.form)
        }
      })
      this.loadThumbnail(false)
    },

    loadAssessment () {
      this.$logger.info('loadAssessment', this.taskId, this.form.id)
      AssessmentToolInfoList({
        taskId: this.parentTaskId,
        pageNo: 1,
        pageSize: 100
      }).then(res => {
        this.$logger.info('parentTaskId getAssessmentList res', res)
        if (res.code === 0) {
          const assessmentList = []
          const assessmentKeySet = new Set()
          res.result.records.forEach(item => {
            if (!assessmentKeySet.has(item.key)) {
              const assessment = {
                ...item
              }
              assessment.headerList = item.headerListJson ? JSON.parse(item.headerListJson) : []
              assessment.bodyList = item.bodyListJson ? JSON.parse(item.bodyListJson) : []
              assessment.extraCriteriaBodyList = item.extraCriteriaBodyListJson ? JSON.parse(item.extraCriteriaBodyListJson) : []
              delete assessment.id
              delete assessment.createUserId
              delete assessment.extraCriteriaBodyListJson
              assessment.key = Date.now().toString(36) + '_' + Math.random().toString(36).substr(2)
              assessment.taskId = this.taskId || this.form.id
              assessmentList.push(assessment)
              assessmentKeySet.add(item.key)
            }
          })

          this.$logger.info('copy assessmentList', assessmentList)
          // 批量转存task 评估表
          AssessmentToolInfoSaveBatch(assessmentList).then(res => {
            this.$logger.info('AssessmentToolInfoSaveBatch res', res)
            if (res.code === 0) {
              this.showSubAssessment = true
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          this.$message.error('getAssessmentList error. ' + res.message)
        }
      })
    },

    handleUpdateCover (coverData) {
      this.$logger.info('handleUpdateCover', coverData)
      if (coverData.type === 'video') {
        this.form.coverVideo = coverData.url
      } else {
        this.form.image = coverData.url
      }
    },

    updateUnitIdList (idList) {
      this.associateUnitPlanIdList = idList
    },

    handleDisplayRightModule () {
      if (this.currentStep.commonFields.indexOf(SplitTaskField.Link) !== -1) {
        this.currentRightModule = RightModule.associate
      } else if (this.currentStep.commonFields.indexOf(SplitTaskField.AssessmentTools) !== -1) {
        this.currentRightModule = RightModule.assessmentToolsLearnOuts
      } else {
        this.currentRightModule = RightModule.customTag
      }
      this.$logger.info('handleDisplayRightModule', this.currentRightModule)
    },

    handleAuthCallback() {
      this.$logger.info('handleAuthCallback')
      this.loadThumbnail(false)
    },

    handleNextStep () {
      if (this.currentActiveStepIndex === this.formSteps.length - 1) {
        this.$router.replace({
          path: '/teacher/sub-task/' + this.parentTaskId
        })
      } else {
        this.$refs['steps-nav'].nextStep()
      }
    },

    handleDiscardStep () {
      this.$router.replace({
        path: '/teacher/sub-task/' + this.parentTaskId
      })
    },

    restoreSplitTaskByResponse(response) {
      this.saving = true
      if (response.code === 0 && response.success) {
        const taskData = response.result
        if (!taskData.materialList) {
          taskData.materialList = []
        }

        this.materialListFlag = taskData.materialList.length > 0
        // 填充自定义字段
        const customFieldData = taskData.customFieldData ? JSON.parse(taskData.customFieldData) : null
        const displayCustomFieldData = {}
        if (customFieldData) {
          // 只显示配置中存在的字段,用id做key，改名后依旧可以使用老数据
          this.$store.getters.formConfigData.taskCustomList.forEach(customField => {
            if (customFieldData.hasOwnProperty(customField.id)) {
              displayCustomFieldData[customField.id] = customFieldData[customField.id]
            } else {
              displayCustomFieldData[customField.id] = ''
            }
          })
        } else {
          this.$store.getters.formConfigData.taskCustomList.forEach(customField => {
            displayCustomFieldData[customField.id] = ''
          })
        }
        this.$logger.info('displayCustomFieldData', displayCustomFieldData)
        taskData.customFieldData = displayCustomFieldData
        this.form = taskData
      } else {
        this.$message.error(response.message)
      }
      this.saving = false
    },
    handlePublishTask(status) {
      this.checkRequiredFields()
      if (this.emptyRequiredFields.length === 0) {
        this.$logger.info('handlePublishSplitTask', {
          id: this.taskId,
          status: status
        })
        this.form.status = status
      } else {
        let requiredStepIndex = -1
        for (let i = 0; i < this.formSteps.length; i++) {
          if (this.formSteps[i].showRequiredTips) {
            requiredStepIndex = i
            break
          }
        }

        if (requiredStepIndex !== -1) {
          this.currentActiveStepIndex = requiredStepIndex
        }
      }
    },

    handleSelectTaskType(type) {
      this.$logger.info('handleSelectTaskType ' + type)
      this.form.taskType = type
    },

    goBack() {
      this.$router.push({ path: '/teacher/main/created-by-me' })
    },

    handleChooseAntherPrompt () {
      this.$logger.info('handleChooseAntherPrompt')
      this.chooseAnotherVisible = true
    },

    handleCloseQuickSession () {
      this.$logger.info('handleCloseQuickSession')
      this.chooseAnotherVisible = false
    },

    handleEnsureChooseAnother (data) {
      this.$logger.info('handleEnsureChooseAnother', data)
      chooseAnother({
        presentationId: data.presentationId,
        selectPageObjectIds: data.selectPageObjectIds,
        taskId: this.taskId
      }).then(response => {
        if (response.success) {
          this.form.pageObjectIds = response.result.pageObjectIds
          this.form.presentationId = response.result.presentationId
          this.form.fileDeleted = response.result.fileDeleted
          this.form.copyFromSlide = response.result.copyFromSlide
          this.form.image = response.result.image
          this.$message.success('Choose another successfully')
          this.chooseAnotherVisible = false
          if (data.classItem && this.form.taskMode === 2) {
            this.form.taskClassList = []
            this.$nextTick(() => {
              this.form.taskClassList.push({
                classId: data.classItem.id,
                className: data.classItem.name,
                classType: data.classItem.classType,
                startDate: null,
                endDate: null
              })
              this.$logger.info('handleEnsureChooseAnother update form.taskClassList', this.form.taskClassList)
            })
          }
          this.loadThumbnail(false)
        } else {
          this.$message.warn(response.message)
        }
      })
    },

    handleViewDetail(item) {
      this.$logger.info('handleViewDetail ', item)
      if (item.type === this.contentType['unit-plan']) {
        this.$router.push({
          path: '/teacher/unit-plan-redirect/' + item.id
        })
      }
    },

    handleUpdateSelected(data) {
      this.$logger.info('handleUpdateSelected', data)
      this.relevantSelectedQuestionList = data.questionList
    },

    loadThumbnail(needRefresh) {
      this.thumbnailListLoading = true
      this.$logger.info('loadThumbnail ' + this.form.presentationId)
      TemplatesGetPresentation({
        taskId: this.parentTaskId,
        needRefresh: needRefresh
      }).then(response => {
        this.$logger.info('loadThumbnail response', response.result)
        if (response.code === 0) {
          this.form.presentationId = response.result.presentationId
          this.form.revisionId = response.result.revisionId
          this.form.pageObjectIds = response.result.pageObjectIds.join(',')
          const pageObjects = response.result.pageObjects
          this.thumbnailList = []
          pageObjects.forEach(page => {
            this.thumbnailList.push({ contentUrl: page.contentUrl, id: page.pageObjectId })
          })
        } else if (response.code === 403) {
          this.$router.push({ path: '/teacher/main/created-by-me' })
        } else if (response.code === this.ErrorCode.ppt_google_token_expires || response.code === this.ErrorCode.ppt_forbidden) {
          this.$logger.info('等待授权事件通知')
        }
      }).finally(() => {
        this.thumbnailListLoading = false
      })
    },

    getAssociate() {
      this.$logger.info('AddTask GetAssociate id[' + this.taskId + '] fromType[' + this.contentType.task + ']')
      this.associateUnitPlanIdList = []
      this.associateTaskIdList = []
      if (this.taskId) {
        GetAssociate({
          id: this.taskId,
          type: this.contentType.task
        }).then(response => {
          this.$logger.info('AddTask GetAssociate response', response)
          this.groupNameList = []
          this.groupNameListOther = []
          response.result.owner.forEach(item => {
            if (this.groupNameList.indexOf(item.group) === -1) {
              this.groupNameList.push(item.group)
            }

            item.contents.forEach(content => {
              console.log(content)
              if (content.type === this.contentType['unit-plan']) {
                this.associateUnitPlanIdList.push(content.id)
                this.associateId2Name.set(content.id, content.name)
                content.questions.forEach(question => {
                  this.associateQuestionList.push({
                    ...question,
                    unitName: content.name
                  })
                })
              }

              if (content.type === this.contentType.task) {
                this.associateTaskIdList.push(content.id)
                this.associateId2Name.set(content.id, content.name)
              }
            })
          })
          response.result.others.forEach(item => {
            if (this.groupNameListOther.indexOf(item.group) === -1) {
              this.groupNameListOther.push(item.group)
            }
            item.contents.forEach(content => {
              console.log(content)
              if (content.type === this.contentType['unit-plan']) {
                this.associateUnitPlanIdList.push(content.id)
                this.associateId2Name.set(content.id, content.name)
                content.questions.forEach(question => {
                  this.associateQuestionList.push({
                    ...question,
                    unitName: content.name
                  })
                })
              }

              if (content.type === this.contentType.task) {
                this.associateTaskIdList.push(content.id)
                this.associateId2Name.set(content.id, content.name)
              }
            })
          })
          this.$logger.info('AddTask GetAssociate formatted groupNameList', this.groupNameList, this.groupNameListOther)
          this.$logger.info('*******************associateUnitPlanIdList', this.associateUnitPlanIdList)
          this.$logger.info('associateTaskIdList', this.associateTaskIdList)
        }).finally(() => {
          this.linkGroupLoading = false

          this.$logger.info('AddTask GetAssociate associateUnitPlanIdList', this.associateUnitPlanIdList)
          if (this.associateUnitPlanIdList.length > 0) {
            this.loadRefLearnOuts()
            this.handleSelfOutsData()
          }
        })
      }
    },

    async loadRefLearnOuts() {
      this.recommendData = []
      const unitPlanIdSet = new Set(this.associateUnitPlanIdList)
      this.associateUnitPlanIdList = [...unitPlanIdSet]
      const response = await FindSourceOutcomes({
        type: this.contentType['unit-plan'],
        ids: this.associateUnitPlanIdList
      })
      this.$logger.info('FindSourceOutcomes response', response)
      if (response.success) {
        const recommendMap = new Map()
        response.result.forEach(item => {
          if (recommendMap.has(item.fromId)) {
            recommendMap.get(item.fromId).push(item)
          } else {
            recommendMap.set(item.fromId, [item])
          }
        })
        this.recommendData = []
        for (const value of recommendMap.values()) {
          this.recommendData.push({
            fromId: value[0].fromId,
            fromName: value[0].fromName,
            fromTypeName: this.type2Name[value[0].fromType],
            list: value
          })
        }
        this.$logger.info('loadRefLearnOuts update RecommendData ', this.recommendData)
      }
    },

    async handleSelfOutsData() {
      this.$logger.info(' handleSelfOutsData')
      const response = await GetReferOutcomes({
        id: this.taskId,
        type: this.contentType.task
      })
      this.$logger.info('getReferOutcomes response', response)
      if (response.success && response.result.length) {
        const list = response.result
        list.forEach(item => {
          if (item.hasOwnProperty('isSelfCustom') && item.isSelfCustom) {
            item.fromId = item.fromList[0].fromId
            item.fromName = item.fromList[0].fromName
            item.fromTypeName = this.type2Name[item.fromList[0].fromType]

            const targetItem = this.recommendData.find(rItem => rItem.fromId === item.fromId)
            if (targetItem) {
              this.$logger.info('targetItem ' + targetItem.fromName + ' add SelfCustom SelfOut ' + item.name, item)
              targetItem.list.push(item)
            }
          }
        })
        this.$logger.info('handleSelfOutsData update RecommendData ', this.recommendData)
      }
    },
    handleStepChange(data) {
      this.$logger.info('task handleStepChange ', data)
      this.currentStep = data.step
      this.currentActiveStepIndex = data.index
      this.resetRightModuleVisible()
      sessionStorage.setItem('split-task-step-' + this.taskId, data.index)
      this.checkIsFullBodyStep()
    },

    checkIsFullBodyStep() {
      let isFullBody = false
      this.fullBodyFields.forEach(field => {
        if (this.currentStep.commonFields.some(item => item === field)) {
          isFullBody = true
        }
      })

      if (isFullBody) {
        this.formBodyWidth = '100%'
        this.tagBodyWidth = '0%'
      } else {
        this.formBodyWidth = '55%'
        this.tagBodyWidth = '45%'
      }
    },
    // 切换当前的字段的点评数据，从总的collaborateCommentList筛选初当前字段相关的点评数据
    handleSwitchComment(data) {
      this.$logger.info('handleSwitchComment', data)
      if (!data.activeStatus) {
        this.currentFieldName = ''
        this.handleDisplayRightModule()
        return
      }
      this.currentRightModule = RightModule.collaborateComment
      this.currentFieldName = data.fieldName
      this.currentCollaborateCommentList = []
      const list = []
      this.collaborateCommentList.forEach(item => {
        if (item.fieldName === data.fieldName) {
          list.push(item)
        }
      })
      this.currentCollaborateCommentList = list
      this.$logger.info('currentCollaborateCommentList', list)
    },

    // 每次点击都重新加载一下最新数据
    handleViewCollaborate() {
      this.showHistoryLoading = true
      this.$logger.info('handleViewCollaborate')
      if (this.showModuleList.indexOf(this.rightModule.collaborate) !== -1) {
        this.resetRightModuleVisible()
      } else {
        this.setRightModuleVisible(this.rightModule.collaborate)
      }
      this.handleDisplayRightModule()
      this.showHistoryLoading = true
      this.loadCollaborateData(this.form.type, this.form.id)
    },

    handleUpdateCommentList() {
      this.$logger.info('handleUpdateCommentList')
      this.GetCollaborateComment(this.form.type, this.form.id)
    },

    handleRestoreField(data) {
      this.$logger.info('handleRestoreField', data, this.form)
      if (data) {
        this.form = data
        this.$message.success('restore successfully!')
      }
      this.$logger.info('after handleRestoreField', this.form)
    },

    getSessionStep() {
      const oldStep = sessionStorage.getItem('task-step-' + this.taskId)
      if (oldStep !== null) {
        return parseInt(oldStep)
      } else {
        return 0
      }
    },
    async save() {
      const taskData = JSON.parse(JSON.stringify(this.form))
      // 更新selfOuts数据
      if (this.$refs.learnOut && this.$refs.learnOut.length > 0) {
        taskData.selfOuts = this.$refs.learnOut[0].getSelfOuts()
      }
      if (taskData.customFieldData) {
        taskData.customFieldData = JSON.stringify(taskData.customFieldData)
      }
      this.$logger.info('basic sub split taskData', taskData)
      this.saving = true
      const response = await SplitTask({
        subTasks: [taskData],
        taskId: this.parentTaskId
      })

      if (response.code === 0 && !this.form.id) {
        this.form.id = response.result.ids[0]
        this.$logger.info('update sub task id')
      }
      this.saving = false
      this.$logger.info('Split task response', response.result)
      return response
    },

    handleAddMaterial() {
      this.form.materialList.push({
        name: null,
        link: null,
        error: null
      })
      this.$logger.info('handleAddMaterial', this.form.materialList)
    },

    handleRemoveMaterialItem(item, index) {
      this.form.materialList = this.form.materialList.filter((it, idx) => idx !== index)
      this.$logger.info('handleRemoveMaterialItem ', this.form.materialList)
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

    handleShareTask() {
      this.$logger.info('handleShareTask')
      this.shareVisible = true
    },

    loadingShareContent() {
      QueryContentShare({
        sourceId: this.form.id,
        sourceType: this.form.type
      }).then(response => {
        this.$logger.info('form QueryContentShare response', response)
        if (response.result) {
          this.shareStatus = response.result.status
        } else {
          this.shareStatus = 0
        }
      })
    },
    handleUpdateContent() {
      // 缓存时间少于最新的内容
      this.form.updateTime = moment.utc(new Date()).format('YYYY-MM-DD HH:mm:ss')
      LocalStore.setFormContentLocal(this.form.id, this.form.type, JSON.stringify(this.form))
      this.defaultHistoryKey = '2'
      this.handleViewCollaborate()
      setTimeout(() => {
        this.restoreTask(this.form.id)
      }, 100)
    },

    handleChangeClassSessionTime (classItem) {
      this.$logger.info('handleChangeClassSessionTime', classItem)
      if (!classItem.checked) {
        classItem.momentRangeDate = []
        classItem.startDate = null
        classItem.endDate = null
      }
    },

    handleAddLinkClass () {
      this.form.taskClassList.push({
        classId: null,
        startDate: null,
        endDate: null,
        checked: false,
        momentRangeDate: [],
        weeks: null
      })
    },
    checkUrl(url) {
      if (url && url.trim()) {
        const list = url.split('.')
        if (list.length <= 1) {
          return false
        }
        for (let i = 0; i < list.length; i++) {
          if (list[i].length < 2) {
            return false
          }
        }
      }
      return true
    },

    handleTestWebsiteLink (materialItem) {
      if (materialItem.link && this.checkUrl(materialItem.link)) {
        window.open('https://' + materialItem.link, '_blank')
      } else {
        this.$message.warn('Please enter a valid URL')
      }
    },

    handleUpdateLearningObjectives (learnOuts) {
      this.$logger.info('handleUpdateLearningObjectives', learnOuts)
      this.form.learnOuts = learnOuts
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.my-full-form-wrapper {
  position: relative;

  .waiting-redirect {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;

    .mask {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 8000;
      background-color: rgba(0, 0, 0, 0.5);
    }
    .waiting-block {
      padding: 15px 25px;
      z-index: 9000;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: row;
      background-color: rgba(255, 255, 255);
      border-radius: 4px;
      box-shadow: 0 0 3px 3px rgba(0, 0, 0, 0.1);
    }
  }
}

.step-content {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .form-body {
    padding: 20px 30px;
    height: 100%;
    -moz-overflow-y: auto;
    overflow-y: overlay;
    background-color: #fff;
  }

  .tag-body {
    padding: 20px 30px;
    height: 100%;
    overflow-y: scroll;
  }
}

.slide-preview-list {
  max-height: 1000px;
  overflow-y: scroll;
  overflow-x: hidden;
  width: 400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  /deep/ .ant-carousel {
    .slick-slide {
      text-align: center;
      height: 200px;
      line-height: 200px;
      background: #364d79;
      overflow: hidden;
    }

    .slick-slide img {
      width: 400px;
    }

    custom-slick-arrow {
      width: 25px;
      height: 25px;
      font-size: 25px;
      color: #fff;
      background-color: rgba(31, 45, 61, 0.11);
      opacity: 0.3;
    }

    .custom-slick-arrow:before {
      display: none;
    }

    .custom-slick-arrow:hover {
      opacity: 0.5;
    }

    .slick-slide h3 {
      color: #fff;
    }

    .anticon {
      color: fade(@black, 45%);
      font-size: 25px;
    }
  }

  .slide-preview-item {
    position: relative;
    margin: 15px;
    width: 400px;

    .template-hover-action-mask {
      display: none;
      z-index: 100;
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);

      .template-hover-action {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 50%;
        margin-top: -16px;
      }

      .action-item {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 6px 13px;
        opacity: 1;
        border: 1px solid rgba(188, 188, 188, 1);
      }

      .template-hover-action {
        position: absolute;
      }
    }

    &:hover {
      .template-hover-action-mask {
        display: block;
      }
    }

  }

  .slide-desc {
    width: 70%;
    max-height: 50px;
    margin: 0 auto 10px;
    overflow: hidden;
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

.select-template-wrapper {
  display: flex;
  cursor: pointer;
  user-select: none;
  flex-direction: column;
  margin-bottom: 40px;

  .template-show-filter {
    position: relative;

    img {
      height: 25px;
      width: 25px;
      position: absolute;
      top: -10px;
      left: 5px;
      cursor: pointer;
    }
  }

  .template-select-header {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid #ddd;
    opacity: 1;
    border-radius: 4px;
    padding: 10px;
    position: relative;

    .expand-icon {
      line-height: 30px;
      font-size: 20px;
      display: flex;
      justify-content: center;
      align-items: center;

      i {
        svg {
          font-size: 23px;
        }
      }
    }

    .group-filter {
      margin-left: 15px;
      margin-bottom: 3px;
    }

    .filter-row {
      position: relative;
      margin-left: 10px;
      width: 100%;

      .ant-form-item-label {
        font-weight: bold;
        line-height: 24px;
        color: #11142D;
      }

      .clear-all {
        position: absolute;
        right: 3px;
        top: -3px;
      }

      .row-select {
        .sub-category {
          line-height: 24px;
          color: #D3D3D3;
        }

        .sub-select {
          margin-bottom: 10px;

          .sub-items {
            display: flex;
            flex-wrap: wrap;

            .sub-item {
              margin: 3px 10px;
              width: 250px;
              word-break: break-word;
              overflow: hidden;
              text-overflow: ellipsis;
              word-break: break-all;
              white-space: nowrap;
            }
          }
        }

        .first-child {
          margin: 5px;
        }

        .sub-child {
          padding-left: 20px;

          .sub-child-child {
            margin: 3px;
          }
        }

        margin: 5px 5px 10px 10px;
        border: 1px solid #E4E4E4;
        padding: 5px 15px;
        max-height: 250px;
        overflow: auto;
      }

      .row-select-assessments .sub-select {
        width: 100%;

        .sub-items .sub-item {
          width: 180px;
        }
      }
    }

    .header-title {
      padding: 5px 15px 5px 15px;

      .header-title-text {
        font-size: 20px;
        font-family: Inter-Bold;
        line-height: 24px;
        color: #182552;
        opacity: 1;
      }
    }

    .template-type-list {
      display: inline-block;
      flex-direction: row;
      justify-content: flex-start;

      .template-type-item {
        margin-right: 10px;
        margin-bottom: 10px;
        padding: 5px 15px;
        max-height: 50px;
        display: inline-block;
        justify-content: center;
        align-items: center;
        text-align: center;
        font-size: 14px;
        min-width: 70px;
        background: rgba(245, 245, 245, 0.5);
        border: 1px solid #ddd;
        color: #11142D;
        opacity: 1;
        border-radius: 25px;
      }

      .active-template-type {
        background: #15C39A;
        opacity: 1;
        color: #fff;
        position: relative;
        border-radius: 40px;

        img {
          height: 18px;
          position: absolute;
          right: -3px;
          top: -7px;
        }
      }

      .sub-active-template-type {
        background: #FF3355;
        opacity: 1;
        color: #fff;
        position: relative;
        border-radius: 40px;

        img {
          height: 18px;
          position: absolute;
          right: -3px;
          top: -7px;
        }
      }
    }
  }

  .template-list-wrapper {
    margin-top: 20px;
    min-height: 250px;
    max-height: 600px;
    overflow-y: auto;
    background: rgba(228, 228, 228, 0.2);
    border: 1px solid #D8D8D8;
    opacity: 1;
    border-radius: 4px;
    padding: 20px;

    .template-list {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: flex-start;
      flex-wrap: wrap;

      .template-item {
        background-size: cover;
        margin-right: 1%;
        margin-left: 1%;
        margin-bottom: 20px;
        box-sizing: border-box;
        width: 23%;
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        background: #FFFFFF;
        border: 1px solid #E8E8E8;
        border-radius: 4px;
        position: relative;

        .template-select-icon {
          z-index: 50;
          position: absolute;
          user-select: none;
          right: 5px;
          top: 5px;

          img {
            user-select: none;
            height: 18px;
          }
        }

        .template-cover {
          background-size: 100% 100%;
          height: 150px;
          border-radius: 4px;
          width: 100%;
          background-color: #ddd;
          box-sizing: border-box;
          padding: 0;
        }

        .template-info {
          padding: 10px;
          display: flex;
          position: relative;
          flex-direction: column;
          justify-content: flex-start;

          .template-name {
            font-weight: 500;
            font-size: 14px;
            z-index: 10;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            word-break: break-all;
            padding: 10px 0;
            min-height: 40px;
          }

          .template-intro {
            min-height: 30px;
            z-index: 10;
            padding: 5px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            word-break: break-all;
            color: rgba(0, 0, 0, .45);
            font-size: 12px;
            background: rgba(244, 244, 244, 0.5);
            border-radius: 4px;
            font-family: Inter-Bold;
            color: #000000;
          }
        }

        .template-hover-action-mask {
          display: none;
          z-index: 100;
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.3);

          .template-hover-action {
            width: 100%;
            top: 30%
          }

          .action-item {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 6px 13px;
            opacity: 1;
            border: 1px solid rgba(188, 188, 188, 1);
          }

          .template-hover-action {
            position: absolute;
          }
        }

        &:hover {
          .template-hover-action-mask {
            display: block;
          }
        }
      }

      .template-item-active {
        border: 1px solid #15C39A;
        box-shadow: 0px 3px 6px rgba(21, 195, 154, 0.16);
        opacity: 1;
      }
    }
  }

  .template-action {
    padding: 20px 0 0;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    justify-content: right;

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
  margin-bottom: 20px;

  .task-type {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 5px 20%;

    .task-type-item {
      margin-right: 15px;
      cursor: pointer;
      padding: 5px;
      line-height: 15px;
      width: 25px;
      height: 25px;
      font-size: 14px;
      background-color: fade(@outline-color, 20%);
      color: @primary-color;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
    }

    .active-task-type {
      background-color: fade(#FF3355, 10%);
      color: #FF3355;
      border-radius: 50%;
      font-weight: 500;
      border-color: #FF3355
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
  //margin-top: 20px;
  .button-item {
    margin-left: 10px;
  }
}

*::-webkit-scrollbar {
  width: 5px;
  height: 10px;
}

*::-webkit-scrollbar-track {
  border-radius: 1px;
  background: transparent;
}

/* 滚动条滑块 */
*::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: rgba(0, 0, 0, 0.04);
  -webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.04);
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

.selected-my-content {
  .selected-item {
    padding: 5px 0;
    font-size: 14px;
    margin-bottom: 5px;
  }
}

.more-action {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;

  .action-item {
    margin: 0 10px;
  }
}

.preview-list {
  margin-bottom: 5px;
  overflow-y: scroll;
  overflow-x: hidden;
  width: 100%;
  min-height: 120px;
  max-height: 374px;
  background: rgba(228, 228, 228, 0.2);
  //border: 1px solid #D8D8D8;
  opacity: 1;
  border-radius: 2px;
  //padding: 5px;
  padding-right: 3px;

  .preview-item-cover {
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
    position: relative;
    width: 100%;
    height: 160px;
    border-radius: 4px;
    border: 3px solid #fff;

    .mask {
      display: none;
    }

    .template-select-icon {
      z-index: 50;
      position: absolute;
      user-select: none;
      right: 5px;
      top: 2px;

      img {
        user-select: none;
        height: 18px;
      }
    }
  }

  .preview-item-cover-active {
    border: 3px solid #15C39A;
    border-radius: 4px;

    .mask {
      display: block !important;
      z-index: 30;
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      background: #000;
      opacity: 0.4;
    }
  }
}

.thumbnail-loading {
  min-height: 200px;
  margin-top: 20px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.task-audio-line {
  position: relative;
  //width: 600px;
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

.thumbnail-task-list {
  box-sizing: border-box;
  margin: 5px auto;
  display: flex;
  flex-direction: column;

  .task-preview-list {
    margin-top: 20px;
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    flex-wrap: nowrap;
    overflow-x: scroll;
    background: #38cfa611;
    padding: 10px 10px 5px 10px;

    &:hover {
      &::-webkit-scrollbar {
        opacity: 1;
      }
    }

    &::-webkit-scrollbar {
      opacity: 0;
      transition: opacity 0.2s ease-in-out;
      width: 5px;
      height: 5px;
    }
    &::-webkit-scrollbar-track {
      border-radius: 3px;
      background: rgba(0,0,0,0.00);
      -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.08);
    }
    /* 滚动条滑块 */
    &::-webkit-scrollbar-thumb {
      border-radius: 5px;
      background: rgba(0,0,0,0.12);
      -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.04);
    }

    .task-preview-wrapper {
      padding: 5px;
    }
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

.self-field-label {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  line-height: 32px;
  padding-right: 10px;
}

.select-type-wrapper {
  margin-bottom: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  .select-type {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .select-tips {
    font-family: Inter-Bold;
    line-height: 24px;
    color: #000000;
    padding: 0 10px;
  }
}

.select-button {
  padding: 0 5px;

  img {
    height: 12px;
  }

  .button-label {
    padding: 0 5px;
  }
}

.btn-icon {
  height: 18px;
}

.btn-text {
  padding: 0 5px;
}

.header-action {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  .header-action-item {
    padding-right: 20px;
  }
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
    justify-content: center;

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

.subject-grade-wrapper {
  width: 600px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  .select-item {
    width: 280px;
  }
}

.my-slide-pick-modal {
  padding: 0;
  box-sizing: border-box;

  .ant-modal-body {
    background: rgba(15, 53, 56, 0.5);
    padding: 0;
    box-sizing: border-box;
  }
}

.select-slide-wrapper {
  padding: 15px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(15, 53, 56, 1);

  .modal-title {
    font-size: 20px;
    font-family: FZCuYuan-M03S;
    font-weight: 400;
    line-height: 24px;
    color: #FFFFFF;
    margin-bottom: 10px;
    margin-top: 10px;
  }

  .main-tips {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 500px;
    height: 250px;

    .left-img {
      height: 250px;
      display: flex;
      flex-direction: row;
      align-items: flex-end;
      width: 250px;

      img {
        width: 250px;
      }
    }

    .right-img-text {
      height: 250px;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      width: 250px;
      position: relative;

      img {
        width: 250px;
      }

      .img-text {
        position: absolute;
        font-size: 18px;
        width: 190px;
        height: 150px;
        margin: auto;
        left: 50px;
        top: 40px;
        font-family: FZCuYuan-M03S;
        font-weight: 400;
        line-height: 20px;
        color: #0F3538;
      }
    }
  }
}

.slide-action {
  padding: 25px 0 30px 0;
  background: rgba(15, 53, 56, 1);

  .slide-btn-wrapper {
    display: flex;
    justify-content: center;

    .slide-btn-item {
      margin: 0 10px;
    }

    .slide-btn-item-no {

    }

    .slide-btn-item-yes {

    }
  }
}

.pick-task-slide-wrapper {
  margin: auto;

  .slide-form-block {
  }
}

.template-tabs {
  /deep/ .ant-tabs-nav-scroll {
    margin: 0 auto;
    text-align: center;
  }

  .filter-row /deep/ .ant-tabs-nav-scroll {
    margin: 0 auto;
    text-align: left;
  }
}

.edit-in-slide {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-right: 60px;

  .slide-switch {
    margin-left: 10px;
    height: 30px;
    font-size: 14px;
  }

  /deep/ .ant-switch-loading-icon, .ant-switch::after {
    position: absolute;
    top: 5px;
    left: 4px;
  }

  /deep/ .ant-switch-inner {
    font-size: 14px;
  }

  /deep/ .ant-switch-checked::after {
    margin-left: 40px;
  }

  /deep/ .ant-btn-round {
    height: 30px;
    padding: 0px 10px;
    font-size: 14px;
    border-radius: 32px;
  }
}

.top-icon-groups {
  position: relative;
  color: rgba(0, 0, 0, 0.65);
  background: #fff;
  height: 70px;
  padding-left: 30px;
  margin-top: 5px;

  .icon-group {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    flex-basis: auto;
    justify-content: flex-start;
    align-items: center;

    /deep/ .ant-badge-count {
      top: 10px;
      right: 12px;
    }

    .icon {
      width: 50px;
      height: 50px;
      margin: 10px;
      border: 1px solid #ddd;
      border-radius: 6px;
      background: #fafafa;
      display: flex;
      flex-direction: column;
      font-weight: bold;
      padding: 2px;
      cursor: pointer;
      align-items: center;

      .icon-text {
        display: flex;
        font-size: 12px;
      }

      svg {
        display: flex;
        width: 32px;
        height: 32px;
      }
    }
  }

  .title-line {
    padding: 5px 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .name {
      width: 70%;
      overflow-x: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      word-break: break-all;
      font-family: Inter-Bold;
      font-size: 15px;
      font-weight: bold;
      color: #182552;
      padding-right: 10px;
      box-sizing: border-box;
    }

    .action-item {
      display: flex;
      width: 30%;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;

      .star {
        img {
          width: 22px;
        }
      }

      .edit {
        margin-left: 15px;

        .button-content {
          display: flex;
          align-items: center;
          justify-content: center;

          .edit-icon {
            padding-left: 5px;
            width: 18px;
          }
        }
      }
    }
  }
}

.slide-select-wrapper {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  width: 100%;

  .slide-recommend {
    width: 600px;
    padding: 0 20px;
    box-sizing: border-box;
  }

  /deep/ .ant-carousel .slick-slide img {
    width: 100%;
    border: 2px solid #15C39A;
  }

  /deep/ .ant-carousel {
    .custom-slick-arrow:before {
      display: none;
    }

    .custom-slick-arrow:hover {
      opacity: 0.5;
    }

    .slick-slide h3 {
      color: #fff;
    }

    .anticon {
      color: fade(@black, 45%);
      svg {
        font-size: 25px;
      }
    }
  }
}

.slide-preview-list {
  max-height: 1000px;
  overflow-y: scroll;
  overflow-x: hidden;
  width: 400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  /deep/ .ant-carousel {
    .slick-slide {
      text-align: center;
      height: 200px;
      line-height: 200px;
      background: #364d79;
      overflow: hidden;
    }

    .slick-slide img {
      width: 400px;
    }

    custom-slick-arrow {
      width: 25px;
      height: 25px;
      font-size: 25px;
      color: #fff;
      background-color: rgba(31, 45, 61, 0.11);
      opacity: 0.3;
    }

    .custom-slick-arrow:before {
      display: none;
    }

    .custom-slick-arrow:hover {
      opacity: 0.5;
    }

    .slick-slide h3 {
      color: #fff;
    }

    .anticon {
      color: fade(@black, 45%);
      font-size: 25px;
    }
  }

  .slide-preview-item {
    position: relative;
    margin: 15px;
    width: 400px;

    .template-hover-action-mask {
      display: none;
      z-index: 100;
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);

      .template-hover-action {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 50%;
        margin-top: -16px;
      }

      .action-item {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 6px 13px;
        opacity: 1;
        border: 1px solid rgba(188, 188, 188, 1);
      }

      .template-hover-action {
        position: absolute;
      }
    }

    &:hover {
      .template-hover-action-mask {
        display: block;
      }
    }

  }

  .slide-desc {
    width: 70%;
    max-height: 50px;
    margin: 0 auto 10px;
    overflow: hidden;
  }
}

.recommend-loading {
  min-height: 200px;
  margin-top: 200px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.question-options {
  width: 100%;
  display: block;
  font-size: 18px;
  font-family: Inter-Bold;
  line-height: 24px;
  color: #11142D;
}

/deep/ .ant-steps-item-title {
  font-size: 18px
}

.root-locate-form {
  position: relative;
}

.my-comment-show {
  display: block;
}

.collaborate-panel {
  background-color: #fff;
  .icon {
    padding: 10px 5px 0 15px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;

    svg {
      width: 30px;
    }
  }
}

.edit-slide {
  display: flex;
  align-items: center;

  img {
    margin-right: 5px;
  }
}

.no-data-slide-form-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .go-to-create {
    margin-top: 10px;
  }
}

/deep/ .ant-breadcrumb > span:last-child {
  color: rgba(0, 0, 0, 0.45);
}

.page-info {
  position: absolute;
  right: 10px;
  bottom: 10px;
  background: #E4E4E4;
  padding: 1px 10px;
  border-radius: 20px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  align-items: center;

  .page-num-tag {
    display: inline;
    background: rgba(228, 228, 228, 0.5);
    padding: 1px 10px;
    border-radius: 16px;
    font-size: 8px;
    font-family: Segoe UI;
    font-weight: 400;
    color: #808191;
  }
}

.carousel-page {
  display: flex;
  height: 110px;
  width: 100%;
  overflow-x: scroll;
  overflow-y: hidden;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 3px;
    background: rgba(0, 0, 0, 0.00);
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.03);
  }

  /* 滚动条滑块 */

  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: rgba(0, 0, 0, 0.06);
    -webkit-box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.04);
  }

  .img-list-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;

    .img-list {
      margin-right: -10px;
      cursor: pointer;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: flex-start;

      .img-item {
        height: 80px;
        border: 2px solid #fff;
        box-shadow: 0 4px 8px 0 rgba(31, 33, 44, 10%);
        margin-right: 10px;

        img {
          height: 100%;
        }
      }

      .img-item:nth-last-child(1) {
        margin-right: 0;
      }

      .active-img-item {
        border: 2px solid #15C39A;
        box-shadow: 0 0 3px 3px #15C39A1A;
      }
    }
  }
}

.template-selected {
  overflow-y: auto;
  background: rgba(228, 228, 228, 0.2);
  border: 1px solid #D8D8D8;
  opacity: 1;
  border-radius: 4px;
  padding: 20px;
  max-height: 500px;

  .template-list {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;

    .template-item {
      background-size: cover;
      margin-right: 1%;
      margin-left: 1%;
      margin-bottom: 20px;
      box-sizing: border-box;
      width: 45%;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      background: #FFFFFF;
      border: 1px solid #E8E8E8;
      border-radius: 4px;
      position: relative;

      .template-select-icon {
        z-index: 50;
        position: absolute;
        user-select: none;
        right: 5px;
        top: 5px;

        img {
          height: 18px;
          user-select: none;
        }
      }

      .template-cover {
        background-size: 100% 100%;
        height: 150px;
        border-radius: 4px;
        width: 100%;
        background-color: #ddd;
        box-sizing: border-box;
        padding: 0;
      }

      .template-info {
        padding: 10px;
        display: flex;
        position: relative;
        flex-direction: column;
        justify-content: flex-start;

        .template-name {
          font-weight: 500;
          font-size: 14px;
          z-index: 10;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          word-break: break-all;
          padding: 10px 0;
          min-height: 40px;
        }

        .template-intro {
          min-height: 30px;
          z-index: 10;
          padding: 5px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          word-break: break-all;
          color: rgba(0, 0, 0, .45);
          font-size: 12px;
          background: rgba(244, 244, 244, 0.5);
          border-radius: 4px;
          font-family: Inter-Bold;
          color: #000000;
        }
      }

      .template-hover-action-mask {
        display: none;
        z-index: 100;
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.3);

        .template-hover-action {
          width: 100%;
          top: 30%
        }

        .action-item {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6px 13px;
          opacity: 1;
          border: 1px solid rgba(188, 188, 188, 1);
        }

        .template-hover-action {
          position: absolute;
        }
      }

      &:hover {
        .template-hover-action-mask {
          display: block;
        }
      }
    }

    .template-item-active {
      border: 1px solid #15C39A;
      box-shadow: 0px 3px 6px rgba(21, 195, 154, 0.16);
      opacity: 1;
    }
  }
}

.recommend-slide-name {
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 40px;
  font-family: Inter-Bold;
  font-weight: 500;
  color: #333;
}

.slide-animate-cover {
  width: 400px;
  height: 200px;
  position: fixed;
  transition: transform .6s;
  transform: translateX(0px);
  z-index: 10000;
}

.slide-animate-cover > img {
  transform: translateY(0px);
  transform: scale(1);
  width: 400px;
  height: 200px;
  transition: transform .6s;
  z-index: 10000;
}

.slide-animate-cover {
  transition-timing-function: linear;
  opacity: 0.8;
  z-index: 10000;
}

.slide-animate-cover > img {
  transition-timing-function: cubic-bezier(.55, 0, .85, .36);
  outline: 1px solid #D8D8D8;
  z-index: 10000;
}

.plugin-tags {
  height: 100px;
  overflow-y: auto;
  background-color: #F7F7F7;
  font-size: 12px;
  padding-left: 15px;
  font-family: Segoe UI;

  .tag-row {
    margin: 5px;

    .tag-item {
      margin-right: 15px;
    }
  }

  .tag-title {
    font-weight: 400;
    line-height: 0px;
    color: #808191;
    opacity: 1;
  }

  .tag-value {
    margin-left: 10px;
    //max-width: 200px;
  }
}

.drawer-wrapper-row {

  .drawer-template-selected {
    overflow-y: auto;
    //background: rgba(228, 228, 228, 0.2);
    border: 1px solid #D8D8D8;
    opacity: 1;
    border-radius: 4px;
    padding: 10px;
    height: auto;

    .drawer-template-list {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: flex-start;
      flex-wrap: wrap;

      .template-item {
        background-size: cover;
        margin: 0px 5px;
        margin-bottom: 20px;
        box-sizing: border-box;
        width: 100%;
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        background: #FFFFFF;
        border: 1px solid #E8E8E8;
        border-radius: 4px;
        position: relative;

        .template-select-icon {
          z-index: 50;
          position: absolute;
          user-select: none;
          right: 5px;
          bottom: 5px;

          img {
            user-select: none;
            height: 18px;
          }
        }

        .template-cover {
          background-size: 100% 100%;
          height: 150px;
          border-radius: 4px;
          width: 100%;
          background-color: #ddd;
          box-sizing: border-box;
          padding: 0;
        }

        .template-info {
          padding: 10px;
          display: flex;
          position: relative;
          flex-direction: column;
          justify-content: flex-start;

          .template-name {
            font-weight: 500;
            font-size: 14px;
            z-index: 10;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            word-break: break-all;
            padding: 10px 0;
            min-height: 40px;
          }

          .template-intro {
            min-height: 30px;
            z-index: 10;
            padding: 5px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            word-break: break-all;
            color: rgba(0, 0, 0, .45);
            font-size: 12px;
            background: rgba(244, 244, 244, 0.5);
            border-radius: 4px;
            font-family: Inter-Bold;
            color: #000000;
          }
        }

        .template-hover-action-mask {
          display: none;
          z-index: 100;
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.3);

          .template-hover-action {
            width: 100%;
            top: 30%
          }

          .action-item {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 6px 13px;
            opacity: 1;
            border: 1px solid rgba(188, 188, 188, 1);
          }

          .template-hover-action {
            position: absolute;
          }
        }

        &:hover {
          .template-hover-action-mask {
            display: block;
          }
        }
      }

      .template-item-active {
        border: 1px solid #15C39A;
        box-shadow: 0px 3px 6px rgba(21, 195, 154, 0.16);
        opacity: 1;
      }
    }
  }

}

.drawer-action {
  position: absolute;
  z-index: 9999;
  bottom: 0px;
  width: 100%;
  border-top: 1px solid rgb(232, 232, 232);
  padding: 10px 16px;
  text-align: left;
  left: 0px;
  background: rgb(255, 255, 255);
  border-radius: 0px 0px 4px 4px;
}

.sub-task-save {
  padding-top: 15px;
  padding-right: 15px;
  text-align: right;
  background: #38cfa611;

  .sub-task-save-action {
    height: 50px;
  }
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

.assessments-tabs {
  /deep/ .ant-tabs-nav-scroll {
    text-align: left;
  }
}

.form-block-label {
  font-family: Inter-Bold;
  line-height: 24px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  .label-text {
    padding: 0 5px;
  }
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

.my-steps-item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-right: 8px;
  font-size: 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  line-height: 32px;
  text-align: center;
  border: 1px solid rgba(0, 0, 0, 0.25);
  border-radius: 32px;
  transition: background-color 0.3s, border-color 0.3s;
  color: rgba(0, 0, 0, 0.25);
  cursor: pointer;
}

.my-active-steps-item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-right: 8px;
  font-size: 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  line-height: 32px;
  text-align: center;
  border: 1px solid #15c39a;
  border-radius: 32px;
  transition: background-color 0.3s, border-color 0.3s;
  color: #fff;
  background: #15c39a;
  cursor: pointer;
}

.ant-steps-item-wait {
  &:hover {
    .my-steps-item-icon {
      border-color: #15c39a;
      color: #15c39a;
    }
  }
}

.sub-task-tag-wrapper {
  padding-top: 550px;
}

.thumbnail-task-item {
  padding: 5px 10px;
  background: #38cfa611;
}

.linked-class-list {
  padding: 10px 10px 0 10px;
  cursor: pointer;
  border: 1px dashed #15c39a;
  margin-bottom: 15px;
  position: relative;

  .mask {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 100;
    background: rgba(0,0,0, 0.07);
  }

  .remove-class-icon {
    position: absolute;
    right: -25px;
    top: 0;
    width: 25px;
    height: 100%;
    display: none;
    text-align: center;
    img {
      width: 30px;
    }
  }

  .class-type-tag {
    position: absolute;
    right: 10px;
    top: 44px;
    text-align: center;
    z-index: 150;
  }

  &:hover {
    .remove-class-icon {
      display: block;
    }
  }
}

.class-schedule-detail {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  line-height: 40px;
  height: 40px;
}

.my-switch {
  line-height: 32px;
}

.range-time {
  margin-left: 10px;
  min-width: 450px;
  position: relative;

  .week-time {
    position: absolute;
    top: -35px;
    right: 90px;
  }
}

.form-item {
  padding-left: 10px;
}

.add-class {
  margin-bottom: 15px;
}

.link-class-tips {
  color: #999;
  font-size: 12px;
  line-height: 30px;
}

.add-material {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  position: relative;
}

.my-add-material {
  height: 44px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.step-1 {
  position: relative;

  .mask {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 999;
    background: rgba(0, 0, 0, 0.07);
  }
}

.common-link-wrapper {
}

.url-error-tips {
  color: #ff4d4f;
  font-size: 13px;
}

.add-material-item {
  height: 30px;
  line-height: 30px;
  svg {
    cursor: pointer;
    width: 20px;
  }
}

.dont-remind-me {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  color: #fff;
  line-height: 30px;
}

/deep/ .ant-steps-item-content {
  overflow: visible;
  margin-left: 50px;
}

.material-list-block {
  margin-top: 20px;
}

.image-preview {
  position: relative;

  img {
    width: 100%;
    height: auto;
  }

  .upload-text-mask {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.2);

    .upload-text {
      width: 200px;
      text-align: center;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -100px;
      margin-top: -20px;
    }
  }

  &:hover {
    .upload-text-mask {
      display: block;
    }
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

  .task-select-template {
    margin-left: 10px;
    margin-right: 10px;
  }
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

.slide-select-and-preview {
  display: flex;
  width: 100%;

  .slide-select-action {
    height: 400px;
    width: 600px;

    img {
      width: 100%
    }
  }

  .slide-preview {
    position: relative;
    padding: 0 35px;

    .slide-hover-action-mask {
      display: none;
      z-index: 100;
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);

      .slide-hover-action {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 500px;
        margin-top: -30px;
        margin-left: -250px;

        .update-select-slide {

        }
      }
    }

    &:hover {
      .slide-hover-action-mask {
        display: block;
      }
    }
  }
}

.step-nav {
  background: #fff;
  position: fixed;
  right: 0;
  width: 100%;
  top: 74px;
  z-index: 999;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
}

.form-content {
  height: calc(100vh - 155px);
  margin-top: 110px;
  overflow: hidden;
  transition: all 0.2s ease-in-out;
}

.bottom-action-bar {
  padding: 0 30px;
  position: fixed;
  box-shadow: 3px 0 6px rgba(0, 0, 0, 0.16);
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background: #fff;
  align-items: center;
  display: flex;
  justify-content: flex-end;
  z-index: 999;
}

.loading-content {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 400px;
}
</style>
