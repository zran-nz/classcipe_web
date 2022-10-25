<template>
  <div class='my-full-form-wrapper' id='formRoot'>
    <fixed-form-header>
      <template v-slot:header>
        <form-header
          title='Create PD Content'
          :form='form'
          :spin='saving'
          :back-by-router='true'
          :share-status='shareStatus'
          :show-share='false'
          :needConfirm="true"
          :collaborate='collaborate'
          :last-change-saved-time='lastChangeSavedTime'
          @publish='handlePublish'
          @share='handleSharePd'
          @view-collaborate='handleViewCollaborate'
          @collaborate='handleStartCollaborate'
          @back='goBack'>
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
        <div class='step-mask' v-if='form.slideEditing && currentActiveStepIndex === slideIndex'>
          <div class='mask-action'>
            <custom-button
              label='Save changes'
              :loading='thumbnailListLoading'
              @click='saveChanges'>
              <template v-slot:icon>
                <a-icon type="save" />
              </template>
            </custom-button>
          </div>
        </div>
        <div class='form-body root-locate-form' id='form-body' :style="{ width: formBodyWidth }" v-show="formBodyWidth !== '0%'">
          <div
            class='form-page-item'
            v-show='currentActiveStepIndex === stepIndex'
            v-for='(step, stepIndex) in formSteps'
            :key='step.id'>
            <div class='form-field-item' v-for='fieldName in step.commonFields' :key='fieldName'>

              <div class='form-block tag-content-block' v-if='fieldName === PdField.Name' :key='fieldName'>
                <custom-form-item :required='emptyRequiredFields.indexOf(PdField.Name) !== -1' :required-field='requiredFields.indexOf(PdField.Name) !== -1'>
                  <template slot='label'>
                    Name
                  </template>
                  <a-input
                    v-model='form.name'
                    placeholder='Enter PD Content Name'
                    class='cc-form-input' />
                </custom-form-item>
              </div>

              <div class='form-block tag-content-block' v-if='fieldName === PdField.Image' :key='fieldName'>
                <custom-form-item :required='emptyRequiredFields.indexOf(PdField.Image) !== -1' :required-field='requiredFields.indexOf(PdField.Image) !== -1'>
                  <template slot='label'>
                    Cover image
                  </template>
                  <custom-image-uploader
                    :field='PdField.Image'
                    :content-id='pdId'
                    :content-type='typeMap.pd'
                    :img-url='form.image'
                    @update='handleUpdateCover' />
                </custom-form-item>
              </div>

              <!--              <div class='form-block tag-content-block' v-if='fieldName === PdField.CoverVideo' :key='fieldName'>-->
              <!--                <custom-form-item :required='emptyRequiredFields.indexOf(PdField.CoverVideo) !== -1' :required-field='requiredFields.indexOf(PdField.CoverVideo) !== -1'>-->
              <!--                  <template slot='label'>-->
              <!--                    Cover video-->
              <!--                  </template>-->
              <!--                  <custom-cover-media-->
              <!--                    type='video'-->
              <!--                    :field='PdField.CoverVideo'-->
              <!--                    :url='form.coverVideo'-->
              <!--                    :show-delete-button='true'-->
              <!--                    @delete='handleDeleteVideoCover'-->
              <!--                    @update='handleUpdateCover'/>-->
              <!--                </custom-form-item>-->
              <!--              </div>-->

              <div class='form-block tag-content-block' v-if='fieldName === PdField.Goals' :key='fieldName'>
                <custom-form-item :required='emptyRequiredFields.indexOf(PdField.Goals) !== -1' :required-field='requiredFields.indexOf(PdField.Goals) !== -1'>
                  <template slot='label'>
                    Goals
                  </template>
                  <a-textarea
                    :auto-size="{ minRows: 5, maxRows: 10 }"
                    v-model='form.goals'
                    placeholder='Please enter goals...'
                    class='cc-form-textarea-white-bg'
                    allow-clear/>
                </custom-form-item>
              </div>

              <div class='form-block tag-content-block' v-if='fieldName === PdField.Link' :key='fieldName'>
                <div class='common-link-wrapper'>
                  <form-linked-content :from-id='pdId' :from-type='typeMap.pd' @update-task-id-list='updateAssociatedIdList' />
                </div>
              </div>

              <div class='form-block tag-content-block' v-if='fieldName === PdField.Slides' :key='fieldName'>
                <custom-form-item :show-label='false' :required-field='requiredFields.indexOf(PdField.Slides) !== -1'>
                  <form-slide
                    :source-type='typeMap.pd'
                    :source-id='pdId'
                    :slide-id='form.presentationId'
                    :show-materials-and-tips='false'
                    :show-edit-google-slide='true'
                    :default-thumbnail-list='thumbnailList'
                    :selected-template-list='form.selectedTemplateList'
                    :edit-loading="editGoogleSlideLoading"
                    :empty-tips="'No slides created yet, click “Edit google slide” to create the first page!'"
                    :empty-height="'350px'"
                    @edit-google-slide='handleEditGoogleSlide'
                  />
                </custom-form-item>
              </div>

              <div class='form-block tag-content-block' v-if='fieldName === PdField.VideoList' :key='fieldName'>
                <case-video
                  :field='PdField.VideoList'
                  :video-list='form.videoList'
                  :content-type='typeMap.pd'
                  :content-id='pdId'
                  @update='handleAddVideo'
                  @delete-video='handleDeleteVideo' />
              </div>
            </div>
          </div>
        </div>
        <div class='tag-body' :style="{ width: tagBodyWidth }" v-show="tagBodyWidth !== '0%'">
          <template v-if='currentRightModule === rightModule.collaborate'>
            <a-skeleton :loading='showHistoryLoading' active>
              <div
                class='collaborate-panel'>
                <div class='icon' style="margin-left:10px">
                  <comment-icon />
                </div>
                <div class="panel-close">
                  <a-icon type="close" @click="handleViewCollaborate()" :style="{ color: 'red', fontSize: '18px',cursor:'pointer' }"/>
                </div>
                <a-tabs :default-active-key='defaultHistoryKey'>
                  <a-tab-pane key='1' tab='Comment'>
                    <collaborate-comment-view
                      :source-id='pdId'
                      :source-type='typeMap.pd'
                      :comment-list='collaborateCommentList'
                      :collaborate-user-list="collaborate.users"
                      @update-comment='handleUpdateCommentList' />
                  </a-tab-pane>
                  <a-tab-pane key='2' tab='History' force-render>
                    <collaborate-history :source-type='typeMap.pd' :history-list='historyList' @restore='handleRestoreField' />
                  </a-tab-pane>
                </a-tabs>
              </div>
            </a-skeleton>
          </template>
          <template v-if='currentRightModule === rightModule.collaborateComment'>
            <div
              class='collaborate-panel'>
              <collaborate-comment-panel
                :source-id='pdId'
                :source-type='typeMap.pd'
                :field-name='currentFieldName'
                :comment-list='currentCollaborateCommentList'
                :collaborate-user-list="getCollaborateUsers(collaborate)"
                @cancel-comment="handleCancelComment"
                @update-comment='handleUpdateCommentList' />
            </div>
          </template>
          <template v-if='currentRightModule === rightModule.customTag'>
            <custom-tag-pd :custom-tags.sync='form.customTags'/>
          </template>
          <template v-if='currentRightModule === rightModule.associate'>
            <link-content-list
              :filter-types="[typeMap.task]"
              :selected-id-list='associateIdList' />
          </template>
          <template v-if='currentRightModule === rightModule.recommend'>
            <slide-select-list :source-id='pdId' :selected-template-list='form.selectedTemplateList' />
          </template>
        </div>
      </div>
      <div class='loading-content' v-if='contentLoading'>
        <a-spin />
      </div>
    </div>
    <fixed-form-footer>
      <template v-slot:right>
        <a-space>
          <a-button type='primary' @click='handleNextStep' class='cc-round-button'>
            <template v-if='currentActiveStepIndex < formSteps.length - 1'>
              Next
            </template>
            <template v-else>
              Complete
            </template>
          </a-button>

          <a-button type='primary' @click='handleScheduleWorkShop' class='cc-round-button cc-dark-button' v-if='!isUnComplete && currentActiveStepIndex === formSteps.length - 1'>
            Schedule workshop
          </a-button>
          <a-tooltip :title="form.slideEditing ? 'Please save your slides' : 'Please complete your information before schedule workshop'" v-if='(isUnComplete || form.slideEditing) && currentActiveStepIndex === formSteps.length - 1'>
            <a-button type='primary' :disabled="true" class='cc-round-button cc-dark-button'>
              Schedule workshop
            </a-button>
          </a-tooltip>
        </a-space>
      </template>
    </fixed-form-footer>

    <!-- <pd-schedule ref='schedule' :content-id='pdId' /> -->

    <a-modal
      v-model='showCollaborateModalVisible'
      :footer='null'
      :maskClosable='false'
      :closable='true'
      destroyOnClose
      width='640px'>
      <collaborate-user-list
        :content-id='pdId'
        :main-content='collaborateContent'
        :content-type='typeMap.pd'
        @confirmSelect='confirmSelectCollaborateUsers'
        v-if='showCollaborateModalVisible' />
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
        :source-id='pdId'
        :source-type='typeMap.pd'
        @update-share-status='handleShareStatus'
      />
    </a-modal>

    <edit-price-dialog :content='form' ref='editPrice' @finish='showPublishTips'/>
  </div>
</template>

<script>

import FixedFormHeader from '@/components/Common/FixedFormHeader'
import FormHeader from '@/components/FormHeader/FormHeader'
import FixedFormFooter from '@/components/Common/FixedFormFooter'
import CustomFormItem from '@/components/Common/CustomFormItem'
import CustomTextButton from '@/components/Common/CustomTextButton'
import MyVerticalSteps from '@/components/Steps/MyVerticalSteps'
import { PdField } from '@/const/common'
import { BaseEventMixin, RightModule } from '@/mixins/BaseEvent'
import CustomCoverMedia from '@/components/Common/CustomCoverMedia'
import CustomTagV3 from '@/components/CustomTag/CustomTagV3'
import LinkContentList from '@/components/UnitPlan/LinkContentList'
import { typeMap } from '@/const/teacher'
import FormSlide from '@/components/PPT/FormSlide'
import SlideSelectList from '@/components/PPT/SlideSelectList'
import FormLinkedContent from '@/components/Common/FormLinkedContent'
import { TemplatesGetPresentation } from '@/api/template'
import { GoogleAuthCallBackMixin } from '@/mixins/GoogleAuthCallBackMixin'
import CaseVideo from '@/components/PdContent/CaseVideo'
import { PublishMixin } from '@/mixins/PublishMixin'
import { PDContentAddOrUpdate, PDContentQueryById } from '@/api/pdContent'
import { AutoSaveMixin } from '@/mixins/AutoSaveMixin'
import SlideEvent from '@/components/PPT/SlideEvent'
import CustomImageUploader from '@/components/Common/CustomImageUploader'
import { TaskCreateNewTaskPPT, UpdateSlideEditing } from '@/api/task'
import PdSchedule from '@/components/PdContent/PdSchedule'
import Collaborate from '@/components/UnitPlan/Collaborate'
import CollaborateUserList from '@/components/Collaborate/CollaborateUserList'
import ShareContentSetting from '@/components/Share/ShareContentSetting'
import { ClasscipeEvent, ClasscipeEventBus } from '@/classcipeEventBus'
import CustomTagPd from '@/components/CustomTag/CustomTagPd'
import { UpdateContentStatus } from '@/api/teacher'
import { SET_GLOBAL_LOADING } from '@/store/mutation-types'
import CustomButton from '@/components/Common/CustomButton'
import EditPriceDialog from '@/components/MyContentV2/EditPriceDialog'
import { addFileUploadRecord, FileRecord } from '@/api/material'
import * as logger from '@/utils/logger'
import CollaborateHistory from '@/components/Collaborate/CollaborateHistory'
import CollaborateCommentView from '@/components/Collaborate/CollaborateCommentView'
import CollaborateCommentPanel from '@/components/Collaborate/CollaborateCommentPanel'
import CollaborateTooltip from '@/components/Collaborate/CollaborateTooltip'
import CollaborateUpdateContent from '@/components/Collaborate/CollaborateUpdateContent'
import commentIcon from '@/assets/icons/collaborate/comment.svg?inline'

export default {
  name: 'AddPD',
  components: {
    EditPriceDialog,
    CustomButton,
    CustomTagPd,
    PdSchedule,
    CustomImageUploader,
    CaseVideo,
    FormLinkedContent,
    SlideSelectList,
    FormSlide,
    LinkContentList,
    CustomTagV3,
    CustomCoverMedia,
    FixedFormHeader,
    FormHeader,
    FixedFormFooter,
    CustomFormItem,
    MyVerticalSteps,
    CustomTextButton,
    Collaborate,
    CollaborateUserList,
    ShareContentSetting,
    CollaborateHistory,
    CollaborateCommentView,
    CollaborateCommentPanel,
    CollaborateTooltip,
    CollaborateUpdateContent,
    commentIcon
  },
  props: {
    pdId: {
      type: String,
      required: true
    },
    mode: {
      type: String,
      default: 'edit'
    }
  },
  mixins: [ GoogleAuthCallBackMixin, PublishMixin, AutoSaveMixin, BaseEventMixin ],
  data() {
    return {
      contentLoading: true,
      form: {
        name: null,
        contentType: 9,
        coverType: null,
        image: null,
        coverVideo: null,
        goals: null,
        customTags: [],
        videoList: [],
        selectedTemplateList: [],
        presentationId: null,
        slideEditing: false,
        createBy: null
      },
      oldForm: null,
      typeMap: typeMap,
      PdField: PdField,
      creating: false,

      pdFieldTagMap: {
        [PdField.Goals]: []
      },
      currentActiveStepIndex: this.getSessionStep(),
      currentRightModule: null,
      rightModule: RightModule,
      thumbnailListLoading: false,
      thumbnailList: [],

      formBodyWidth: '50%',
      tagBodyWidth: '50%',
      fullBodyFields: [PdField.VideoList],

      scheduleVisible: false,
      editGoogleSlideLoading: false,
      associateIdList: []
    }
  },
  computed: {
    slideIndex () {
      const index = this.formSteps.findIndex(item => item.commonFields.indexOf(this.PdField.Slides) !== -1)
      return index === -1 ? 1 : index
    },
    isUnComplete() {
      const find = this.formSteps.find(item => item.showRequiredTips)
      return !!find
    }
  },
  mounted() {
    this.initFormSteps()
    if (this.currentActiveStepIndex < 0 || this.currentActiveStepIndex > this.formSteps.length - 1) {
      this.currentActiveStepIndex = 0
    }
    this.currentStep = this.formSteps[this.currentActiveStepIndex]
    this.requiredFields = this.$classcipe.pdRequiredFields
    this.initData()
    this.contentLoading = false

    if (this.currentActiveStepIndex < 0 || this.currentActiveStepIndex > this.formSteps.length - 1) {
      this.currentActiveStepIndex = 0
    }
    this.currentStep = this.formSteps[this.currentActiveStepIndex]
    this.handleDisplayRightModule()
    this.checkIsFullBodyStep()
    this.queryContentCollaborates(this.pdId, this.typeMap.pd)

    this.$EventBus.$on(SlideEvent.SELECT_TEMPLATE, this.handleSelectTemplate)
    this.$EventBus.$on(SlideEvent.CANCEL_SELECT_TEMPLATE, this.handleRemoveTemplate)
    ClasscipeEventBus.$on(ClasscipeEvent.GOOGLE_AUTH_REFRESH, this.handleEditGoogleSlide)
  },
  beforeDestroy() {
    this.$EventBus.$off(SlideEvent.SELECT_TEMPLATE, this.handleSelectTemplate)
    this.$EventBus.$off(SlideEvent.CANCEL_SELECT_TEMPLATE, this.handleRemoveTemplate)
    ClasscipeEventBus.$off(ClasscipeEvent.GOOGLE_AUTH_REFRESH, this.handleEditGoogleSlide)
  },
  methods: {

    initData () {
      this.saving = true
      this.restorePdContent()
    },

    restorePdContent(needLoadThumbnail = true) {
      this.$logger.info('restorePdContent ' + this.pdId)
      this.saving = true
      PDContentQueryById({
        id: this.pdId
      }).then(response => {
        this.$logger.info('PDContentQueryById ' + this.pdId, response)
        if (response.code === 0 && response.success) {
          const data = response.result
          this.form = data
          this.oldForm = Object.assign({}, this.form)
        } else {
          this.$message.error(response.message)
        }
      }).finally(() => {
        if (this.form.presentationId && needLoadThumbnail) {
          this.loadThumbnail(false)
        }
        this.saving = false
        this.tryAutoCheckRequiredField()
      })
    },

    async save() {
      this.saving = true
      this.$logger.info('add PDContentAddOrUpdate', this.form)
      if (this.pdId) {
        this.form.id = this.pdId
      }
      const response = await PDContentAddOrUpdate(this.form)
      this.saving = false
      this.$logger.info('PDContentAddOrUpdate', response.result)
      return response
    },

    initFormSteps () {
      this.formSteps = [
        {
          id: 1,
          name: 'PD goals',
          commonFields: [
            PdField.Name,
            PdField.Image,
            PdField.CoverVideo,
            PdField.Goals
          ],
          showRequiredTips: false,
          showSatisfiedTips: false
        },
        {
          id: 2,
          name: 'Edit Slides',
          commonFields: [
            PdField.Slides
          ],
          showRequiredTips: false,
          showSatisfiedTips: false
        },
        {
          id: 3,
          name: 'Link Tasks',
          commonFields: [
            PdField.Link
          ],
          showRequiredTips: false,
          showSatisfiedTips: false
        }
      ]
    },

    goBack() {
      if (window.history.length <= 1) {
        this.$router.push({ path: '/teacher/main/created-by-me' })
        return false
      } else {
        this.$router.go(-1)
      }
    },

    getSessionStep() {
      const oldStep = sessionStorage.getItem('pd-step-' + this.pdId)
      if (oldStep !== null) {
        return parseInt(oldStep)
      } else {
        return 0
      }
    },

    handleStepChange(data) {
      this.$logger.info('pd handleStepChange ', data)
      this.currentStep = data.step
      this.currentActiveStepIndex = data.index
      this.handleDisplayRightModule()
      sessionStorage.setItem('pd-step-' + this.pdId, data.index)
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
        this.formBodyWidth = '50%'
        this.tagBodyWidth = '50%'
      }
    },

    handleAuthCallback() {
      this.$logger.info('handleAuthCallback')
      this.loadThumbnail(false)
    },

    loadThumbnail(needRefresh, hiddenMask = false) {
      this.$logger.info('loadThumbnail ' + this.form.presentationId)
      if (!this.thumbnailListLoading) {
        this.thumbnailListLoading = true
        TemplatesGetPresentation({
          taskId: this.pdId,
          needRefresh: needRefresh
        }).then(response => {
          this.$logger.info('loadThumbnail response', response.result)
          if (response.code === 0) {
            // this.restorePdContent(this.form.id, false)
            this.restorePdContent(false)
            // 不加这段 thumbnailList无法设置，slides draft 就无法显示
            const pageObjects = response.result.pageObjects
            this.form.pageObjects = pageObjects
            this.form.pageObjectIds = response.result.pageObjectIds.join(',')
            this.$logger.info(`form.pageObjectIds ${this.form.pageObjectIds} form.pageObjects ${this.form.pageObjects}`)
            this.thumbnailList = []
            pageObjects.forEach(page => {
              this.thumbnailList.push({ contentUrl: page.contentUrl, id: page.pageObjectId })
            })
            if (!this.form.fileDeleted && response.result.fileDeleted) {
              this.form.fileDeleted = true
            }

            if (hiddenMask) {
              this.form.slideEditing = false
            }
          } else if (response.code === 403) {
            this.$router.push({ path: '/teacher/main/created-by-me' })
          } else if (response.code === this.ErrorCode.ppt_google_token_expires || response.code === this.ErrorCode.ppt_forbidden) {
            this.$logger.info('等待授权事件通知')
          }
        }).finally(() => {
          this.thumbnailListLoading = false
        })
      }
    },

    handleDisplayRightModule () {
      if (this.currentStep.commonFields.indexOf(PdField.Slides) !== -1) {
        this.currentRightModule = RightModule.recommend
      } else if (this.currentStep.commonFields.indexOf(PdField.Link) !== -1) {
        this.currentRightModule = RightModule.associate
      } else {
        this.currentRightModule = RightModule.customTag
      }
      this.$logger.info('handleDisplayRightModule', this.currentRightModule)
    },

    handleNextStep () {
      if (this.currentActiveStepIndex === this.formSteps.length - 1) {
        this.$router.replace({
          path: '/'
        })
      } else {
        this.$refs['steps-nav'].nextStep()
      }
    },

    handleUpdateCover (coverData) {
      this.$logger.info('handleUpdateCover', coverData)
      if (coverData.type === 'video') {
        this.form.coverVideo = coverData.url
      } else {
        this.form.image = coverData.url
      }
    },

    handleDeleteVideoCover () {
      this.form.coverVideo = null
    },

    async handleEditGoogleSlide() {
      this.$logger.info('handleEditGoogleSlide pd star')
      this.$store.commit(SET_GLOBAL_LOADING, true)
      this.form.slideEditing = true
      this.$nextTick(async () => {
        try {
          this.editGoogleSlideLoading = true
          this.$logger.info('handleEditGoogleSlide', this.form.presentationId)
          if (this.form.presentationId && !this.form.presentationId.startsWith('fake_buy_')) {
            await this.save()
            const res = await this.updateSlideEditing()
            if (res.code === 0) {
              top.location.href = 'https://docs.google.com/presentation/d/' + this.form.presentationId + '/edit'
            } else if (res.code === 520 || res.code === 403) {
              this.$logger.info('等待授权回调')
              this.$message.loading('Waiting for Google Slides auth...', 10)
              this.creating = false
              this.saving = false
              return
            } else {
              this.$store.commit(SET_GLOBAL_LOADING, false)
              this.$message.error('Save PDContent failed, Please retry!')
            }
          } else {
            await this.handleCreatePPT()
          }
        } catch (e) {
          console.error('handleEditGoogleSlide error', e)
        } finally {
          this.editGoogleSlideLoading = false
        }
      })
    },

    updateAssociatedIdList (idList) {
      this.$logger.info('updateAssociatedIdList', idList)
      this.associateIdList = idList
    },

    async handleCreatePPT() {
      this.$logger.info('handleCreatePPT')
      const hideLoading = this.$message.loading('Creating ppt in Google Slides...', 0)
      if (!this.creating) {
        this.creating = true
        const response = await TaskCreateNewTaskPPT({
          id: this.pdId,
          type: this.typeMap.pd,
          name: this.form.name ? this.form.name : 'Unnamed Pd Content'
        })

        if (response.success) {
          if (response.code === 520 || response.code === 403) {
            this.$logger.info('等待授权回调')
            hideLoading()
            this.$message.loading('Waiting for Google Slides auth...', 10)
            this.creating = false
            this.saving = false
            return
          }
        } else {
          hideLoading()
          this.$message.error(response.message)
        }

        this.$logger.info('handleCreateTask', response.result)
        try {
          this.saving = true
          this.form.id = response.result.id
          this.form.slideEditing = true
          this.form.presentationId = response.result.presentationId
          await this.save()
          await this.updateSlideEditing()
          window.location.href = 'https://docs.google.com/presentation/d/' + this.form.presentationId
        } finally {
          hideLoading()
          this.creating = false
          this.saving = false
        }
        return response
      }
    },

    handleAddVideo (videoItem) {
      this.$logger.info('handleAddVideo', videoItem)
      if (videoItem.classcipeRecordFiles && videoItem.classcipeRecordFiles.length > 0) {
        videoItem.classcipeRecordFiles.forEach(v => {
          this.form.videoList.push(v)
          this.addVideoRecord(v)
        })
      } else {
        this.form.videoList.push(videoItem)
        this.addVideoRecord(videoItem)
      }
      this.$logger.info('videoList', this.form.videoList)
    },

    addVideoRecord (video) {
      this.$logger.info('addVideoRecord', video)
      const data = {
        fileLength: '',
        fileName: '',
        filePath: ''
      }
      if (video.filePath) {
        data.fileLength = video.fileLength
        data.fileName = video.fileName
        data.filePath = video.filePath
        this.tryAddVideoRecord(data)
      } else if (video.classcipeRecordFiles.length) {
        data.fileLength = video.classcipeRecordFiles[0].fileLength
        data.fileName = video.classcipeRecordFiles[0].fileName
        data.filePath = video.classcipeRecordFiles[0].filePath
        this.tryAddVideoRecord(data)
      } else {
        this.$logger.info('addVideoRecord no data found in ', video)
      }
    },

    tryAddVideoRecord(data) {
      this.$logger.info('addVideoRecord tryAddVideoRecord data', data)
      FileRecord({
        contentId: this.pdId,
        contentType: this.$classcipe.typeMap.pd
      }).then(res => {
        if (res.result?.records) {
          const list = res.result.records
          if (!list.some(item => item.filePath === data.filePath)) {
            addFileUploadRecord({
              fileLength: data.fileLength,
              fileName: data.fileName,
              filePath: data.filePath,
              contentType: this.$classcipe.typeMap.pd,
              contentId: this.pdId
            }).then(res => {
              logger.info('addFileUploadRecord in pd res', res)
            })
          } else {
            this.$logger.info('addVideoRecord exist record')
          }
        }
      })
    },

    handleDeleteVideo(videoItem) {
      this.$logger.info('pd handleDeleteVideo', videoItem.data)
      const index = this.form.videoList.findIndex(item => item.filePath === videoItem.data.filePath)
      this.$logger.info('pd handleDeleteVideo index =', index, this.form.videoList)
      if (index > -1) {
        this.form.videoList.splice(index, 1)
      }
    },

    handlePublish (status) {
      this.$logger.info('handlePublish', status, this.requiredFields, this.form)
      this.checkRequiredFields()

      if (this.form.slideEditing) {
        this.$confirm({
          title: 'Save changes',
          content: 'Check the changes in Google slides then save.',
          centered: true,
          onOk: () => {
            window.location.href = 'https://docs.google.com/presentation/d/' + this.form.presentationId + '/edit'
          }
        })

        this.formSteps.forEach(step => {
          if (step.commonFields.indexOf(PdField.Slides) > -1) {
            step.showRequiredTips = true
            step.showSatisfiedTips = false
          }
        })
      } else {
        if (this.emptyRequiredFields.length === 0) {
          if (this.form.presentationId && !this.form.presentationId.startsWith('fake_buy_')) {
            this.form.status = 1
            this.handlePublishFormItem(1)
            this.showEditPriceDialog()
          } else {
            this.$message.warn('There is no PPT slides linked with this task, please create slides before publishing.')
          }
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
      }
    },

    handlePublishFormItem (status) {
      const data = {
        id: this.pdId,
        status: status,
        type: this.typeMap.pd
      }
      UpdateContentStatus(data)
    },

    handleSelectTemplate (template) {
      this.$logger.info('handleSelectTemplate', template)
      const index = this.form.selectedTemplateList.findIndex(item => item.presentationId === template.presentationId)
      if (index === -1) {
        this.form.selectedTemplateList.push(template)
      }
    },

    handleRemoveTemplate(template) {
      this.$logger.info('handleRemoveTemplate ', template)
      const index = this.form.selectedTemplateList.findIndex(item => item.presentationId === template.presentationId)
      if (index !== -1) {
        this.form.selectedTemplateList.splice(index, 1)
      }
    },

    handleScheduleWorkShop () {
      this.$logger.info('handleScheduleWorkShop')
      // if (this.form.presentationId) {
      //   this.$refs.schedule.visible = true
      // } else {
      //   this.$message.warn('Please create Google Slides first')
      // }
      this.$router.push(`/teacher/schedule-workshop/${this.pdId}/9`)
    },

    handleSharePd() {
      this.$logger.info('handleSharePd')
      this.shareVisible = true
    },
    async saveChanges () {
      if (!this.thumbnailListLoading) {
        this.loadThumbnail(true, true)
      }
    },
    async updateSlideEditing() {
      const updateData = {
        id: this.pdId,
        slideEditing: true,
        type: this.$classcipe.typeMap.pd
      }
      this.$logger.info('updateSlideEditing', updateData)
      this.saving = true
      const response = await UpdateSlideEditing(updateData)
      this.saving = false
      this.$logger.info('updateSlideEditing', response.result)
      return response
    },
    // 每次点击都重新加载一下最新数据
    handleViewCollaborate() {
      this.showHistoryLoading = true
      this.$logger.info('handleViewCollaborate')
      if (this.currentRightModule === this.rightModule.collaborate) {
        this.handleDisplayRightModule()
      } else {
        this.currentRightModule = this.rightModule.collaborate
      }
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
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.form-content {
  height: calc(100vh - 155px);
  margin-top: 110px;
  overflow: hidden;
  transition: all 0.2s ease-in-out;
}

.step-content {
  display: flex;
  position: relative;
  flex-direction: row;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .step-mask {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 800;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
  }

  .form-body {
    width: 55%;
    padding: 20px 30px;
    height: 100%;
    -moz-overflow-y: auto;
    overflow-y: overlay;
    background-color: #fff;
  }

  .tag-body {
    width: 45%;
    padding: 20px 30px;
    height: 100%;
    overflow-y: scroll;
  }
}

.loading-content {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 400px;
}

.collaborate-panel {
  background-color: #fff;
  position: relative;
  .panel-close{
    position: absolute;
    top:10px;
    right:10px;
  }
  .icon {
    margin-left:10px;
    svg {
      width: 30px;
    }
  }
}

</style>
