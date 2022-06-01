<template>
  <div class='my-full-form-wrapper' id='formRoot'>
    <fixed-form-header>
      <template v-slot:header>
        <form-header
          title='Create PD Content'
          :form='form'
          :spin='saving'
          :show-share='false'
          :show-collaborate='false'
          :last-change-saved-time='lastChangeSavedTime'
          @publish='handlePublish'
          @back='goBack'>
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
        <div class='form-body root-locate-form' id='form-body'>
          <div
            class='form-page-item'
            v-show='currentActiveStepIndex === stepIndex'
            v-for='(step, stepIndex) in formSteps'
            :key='step.id'>
            <div class='form-field-item' v-for='fieldName in step.commonFields' :key='fieldName'>

              <div class='form-block tag-content-block' :data-field-name='fieldName' v-if='fieldName === PdField.Name' :key='fieldName'>
                <custom-form-item :required='emptyRequiredFields.indexOf(PdField.Name) !== -1'>
                  <template slot='label'>
                    Name
                  </template>
                  <a-input
                    v-model='form.name'
                    placeholder='Enter PD Content Name'
                    class='cc-form-input' />
                </custom-form-item>
              </div>

              <div class='form-block tag-content-block' :data-field-name='fieldName' v-if='fieldName === PdField.Image' :key='fieldName'>
                <custom-form-item :required='emptyRequiredFields.indexOf(PdField.Image) !== -1'>
                  <template slot='label'>
                    Cover image
                  </template>
                  <custom-image-uploader :img-url='form.image' @update='handleUpdateCover' />
                </custom-form-item>
              </div>

              <div class='form-block tag-content-block' :data-field-name='fieldName' v-if='fieldName === PdField.CoverVideo' :key='fieldName'>
                <custom-form-item :required='emptyRequiredFields.indexOf(PdField.CoverVideo) !== -1'>
                  <template slot='label'>
                    Cover video
                  </template>
                  <custom-cover-media type='video' :url='form.coverVideo' @update='handleUpdateCover'/>
                </custom-form-item>
              </div>

              <div class='form-block tag-content-block' :data-field-name='fieldName' v-if='fieldName === PdField.Goals' :key='fieldName'>
                <custom-form-item :required='emptyRequiredFields.indexOf(PdField.Goals) !== -1'>
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

              <div class='form-block tag-content-block' :data-field-name='PdField.Link' v-if='fieldName === PdField.Link' :key='fieldName'>
                <div class='common-link-wrapper'>
                  <form-linked-content :from-id='pdId' :from-type='typeMap.pd' />
                </div>
              </div>

              <div class='form-block tag-content-block' :data-field-name='fieldName' v-if='fieldName === PdField.Slides' :key='fieldName'>
                <custom-form-item :show-label='false'>
                  <form-slide
                    :source-type='typeMap.pd'
                    :source-id='pdId'
                    :slide-id='form.presentationId'
                    :show-materials-and-tips='true'
                    :show-edit-google-slide='true'
                    :default-thumbnail-list='thumbnailList'
                    :selected-template-list='form.selectedTemplateList'
                    @edit-google-slide='handleEditGoogleSlide'
                  />
                </custom-form-item>
              </div>

              <div class='form-block tag-content-block' :data-field-name='fieldName' v-if='fieldName === PdField.Video' :key='fieldName'>
                <case-video :video-list='form.videoList'/>
              </div>
            </div>
          </div>
        </div>
        <div class='tag-body'>
          <template v-if='currentRightModule === rightModule.customTag'>
            <custom-tag-v2
              ref='customTag'
              :custom-tags='customTags'
              :scope-tags-list='customTagList'
              :selected-tags-list='form.customTags'
              :current-field-name='currentFocusFieldName'
              @reload-user-tags='loadCustomTags'
              @change-add-keywords='handleChangeAddKeywords'
              @change-user-tags='handleChangeCustomTags'></custom-tag-v2>
          </template>
          <template v-if='currentRightModule === rightModule.associate'>
            <link-content-list :filter-types="[typeMap.task]" />
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
        <a-button type='primary' @click='handleNextStep' class='cc-round-button'>Next</a-button>
      </template>
    </fixed-form-footer>
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
import { RightModule } from '@/mixins/BaseEvent'
import CustomCoverMedia from '@/components/Common/CustomCoverMedia'
import CustomTagV2 from '@/components/CustomTag/CustomTagV2'
import { FindCustomTags } from '@/api/tag'
import LinkContentList from '@/components/UnitPlan/LinkContentList'
import { typeMap } from '@/const/teacher'
import FormSlide from '@/components/PPT/FormSlide'
import SlideSelectList from '@/components/PPT/SlideSelectList'
import FormLinkedContent from '@/components/Common/FormLinkedContent'
import { TemplatesGetPresentation } from '@/api/template'
import { GoogleAuthCallBackMixin } from '@/mixins/GoogleAuthCallBackMixin'
import CaseVideo from '@/components/PdContent/CaseVideo'
import PdEvent from '@/components/PdContent/PdEvent'
import { PublishMixin } from '@/mixins/PublishMixin'
import { PDContentAddOrUpdate, PDContentQueryById } from '@/api/pdContent'
import { AutoSaveMixin } from '@/mixins/AutoSaveMixin'
import SlideEvent from '@/components/PPT/SlideEvent'
import CustomImageUploader from '@/components/Common/CustomImageUploader'
import { TaskCreateNewTaskPPT } from '@/api/task'

export default {
  name: 'AddPD',
  components: {
    CustomImageUploader,
    CaseVideo,
    FormLinkedContent,
    SlideSelectList,
    FormSlide,
    LinkContentList,
    CustomTagV2,
    CustomCoverMedia,
    FixedFormHeader,
    FormHeader,
    FixedFormFooter,
    CustomFormItem,
    MyVerticalSteps,
    CustomTextButton
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
  mixins: [ GoogleAuthCallBackMixin, PublishMixin, AutoSaveMixin ],
  data() {
    return {
      contentLoading: true,
      form: {
        name: null,
        contentType: 1,
        coverType: null,
        image: null,
        coverVideo: null,
        goals: null,
        customTags: [],
        videoList: [],
        selectedTemplateList: [],
        presentationId: null,
        createBy: null
      },
      typeMap: typeMap,
      currentFocusFieldName: null,
      customTagList: [],
      customTags: {},
      PdField: PdField,
      creating: false,

      pdFieldTagMap: {
        [PdField.Goals]: []
      },
      currentActiveStepIndex: this.getSessionStep(),
      currentRightModule: null,
      rightModule: RightModule,

      thumbnailList: []
    }
  },
  created() {
    this.initFormSteps()
    if (this.currentActiveStepIndex < 0 || this.currentActiveStepIndex > this.formSteps.length - 1) {
      this.currentActiveStepIndex = 0
    }
    this.currentStep = this.formSteps[this.currentActiveStepIndex]
    this.currentFocusFieldName = this.currentStep.commonFields[0]
    this.requiredFields = [
      PdField.Name,
      PdField.Image,
      PdField.CoverVideo,
      PdField.Goals
    ]
    this.initData()
    this.loadCustomTags()
    this.handleDisplayRightModule()
    this.loadThumbnail(false)
    this.contentLoading = false

    this.$EventBus.$on(PdEvent.PD_VIDEO_ADD, this.handleAddVideo)
    this.$EventBus.$on(PdEvent.PD_VIDEO_DELETE, this.handleDeleteVideo)

    this.$EventBus.$on(SlideEvent.SELECT_TEMPLATE, this.handleSelectTemplate)
    this.$EventBus.$on(SlideEvent.CANCEL_SELECT_TEMPLATE, this.handleRemoveTemplate)
  },
  beforeDestroy() {
    this.$EventBus.$off(PdEvent.PD_VIDEO_ADD, this.handleAddVideo)
    this.$EventBus.$off(PdEvent.PD_VIDEO_DELETE, this.handleDeleteVideo)

    this.$EventBus.$off(SlideEvent.SELECT_TEMPLATE, this.handleSelectTemplate)
    this.$EventBus.$off(SlideEvent.CANCEL_SELECT_TEMPLATE, this.handleRemoveTemplate)
  },
  methods: {

    initData () {
      this.saving = true
      this.restorePdContent()
    },

    restorePdContent() {
      this.$logger.info('restorePdContent ' + this.pdId)
      this.saving = true
      PDContentQueryById({
        id: this.pdId
      }).then(response => {
        this.$logger.info('PDContentQueryById ' + this.pdId, response)
        if (response.code === 0 && response.success) {
          this.form = response.result
        } else {
          this.$message.error(response.message)
        }
      }).finally(() => {
        if (this.form.presentationId) {
          this.loadThumbnail(false)
        }
        this.saving = false
      })
    },

    save() {
      this.saving = true
      return PDContentAddOrUpdate(this.form).then(res => {
        this.$logger.info('PDContentAddOrUpdate', res)
      }).finally(() => {
        this.saving = false
      })
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
        },
        {
          id: 4,
          name: 'Case Video',
          commonFields: [
            PdField.Video
          ],
          tips: 'You can publish case study video to library for other teachers to purchase and develop their professional skills',
          skip: true,
          needSchedule: true,
          showRequiredTips: false,
          showSatisfiedTips: false
        }
      ]
    },

    goBack() {
      this.$router.push({ path: '/teacher/main/created-by-me' })
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
      this.setSessionStep(data.index)
    },

    handleAuthCallback() {
      this.$logger.info('handleAuthCallback')
      this.loadThumbnail(false)
    },

    loadThumbnail(needRefresh) {
      this.$logger.info('loadThumbnail ' + this.form.presentationId)
      TemplatesGetPresentation({
        taskId: this.pdId,
        needRefresh: needRefresh
      }).then(response => {
        this.$logger.info('loadThumbnail response', response.result)
        if (response.code === 0) {
          const pageObjects = response.result.pageObjects
          this.thumbnailList = []
          pageObjects.forEach(page => {
            this.thumbnailList.push({ contentUrl: page.contentUrl, id: page.pageObjectId })
          })
        } else if (response.code === this.ErrorCode.ppt_google_token_expires || response.code === this.ErrorCode.ppt_forbidden) {
          this.$logger.info('等待授权事件通知')
        }
      })
    },

    setSessionStep(step) {
      this.currentActiveStepIndex = step
      sessionStorage.setItem('pd-step-' + this.pdId, step)
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
      this.$refs['steps-nav'].nextStep()
    },

    handleUpdateCover (coverData) {
      this.$logger.info('handleUpdateCover', coverData)
      if (coverData.type === 'video') {
        this.form.coverVideo = coverData.url
      } else {
        this.form.image = coverData.url
      }
    },

    async handleEditGoogleSlide() {
      this.editGoogleSlideLoading = true
      this.$logger.info('handleEditGoogleSlide', this.form.presentationId)
      let res
      if (this.form.presentationId) {
        res = await this.save()
      } else {
        res = await this.handleCreatePPT()
      }
      if (res.code === 0) {
        window.open('https://docs.google.com/presentation/d/' + this.form.presentationId + '/edit', '_blank')
      }
      this.editGoogleSlideLoading = false
    },

    async handleCreatePPT() {
      this.$logger.info('handleCreatePPT')
      const hideLoading = this.$message.loading('Creating ppt in Google side...', 0)
      if (!this.creating) {
        this.creating = true
        const response = await TaskCreateNewTaskPPT({
          id: this.pdId,
          type: this.typeMap.pd,
          name: this.form.name ? this.form.name : 'Unnamed Pd Content'
        })

        this.$logger.info('handleCreateTask', response.result)
        try {
          this.saving = true
          this.form.id = response.result.id
          this.form.presentationId = response.result.presentationId
          this.$message.success('Created Successfully in Google Slides')
          window.open('https://docs.google.com/presentation/d/' + this.form.presentationId, '_blank')
          this.loadThumbnail(true)
        } finally {
          hideLoading()
          this.creating = false
          this.saving = false
        }
        return response
      }
    },

    focusInput(event) {
      this.$logger.info('focusInput ', event.target)
      const eventDom = event.target
      let currentDom = eventDom.offsetParent
      this.currentFocusFieldName = null
      this.customTagList = []
      while (currentDom !== null) {
        currentDom = currentDom ? currentDom.offsetParent : undefined
        if (!currentDom) {
          break
        }

        if (currentDom.classList.contains('tag-content-block') && currentDom.hasAttribute('data-field-name')) {
          const fieldName = currentDom.getAttribute('data-field-name')
          this.$logger.info('current block fieldName', fieldName)
          this.currentFocusFieldName = fieldName
          if (this.pdFieldTagMap.hasOwnProperty(fieldName)) {
            this.customTagList = this.pdFieldTagMap[fieldName].map(item => item.tagName)
            this.$logger.info(fieldName + ' customTagList', this.customTagList)
          }
        }
        if (currentDom.classList && currentDom.classList.contains('root-locate-form')) {
          break
        }
      }
      this.setRightModuleVisible()
    },

    loadCustomTags() {
      FindCustomTags({}).then((response) => {
        this.$logger.info('FindCustomTags response', response.result)
        if (response.success) {
          if (response.result.pdTags) {
            response.result.pdTags.forEach(pdTag => {
              pdTag.keywords = pdTag.children.map(item => item.name)
              this.customTagList.push(pdTag.name)
            })
          }
          this.customTags = response.result
        } else {
          this.$message.error(response.message)
        }
      })
    },

    handleChangeAddKeywords(tag) {
      if (tag.isGlobal) {
        this.customTags.userGlobalTags.push(tag)
      } else {
        const index = this.customTags.userTags.findIndex(item => item.name === tag.parentName)
        if (index > -1) {
          this.customTags.userTags[index].keywords.push(tag.name)
        }
      }
    },

    handleChangeCustomTags(tags) {
      this.form.customTags = tags
    },

    handleAddVideo (url) {
      this.form.videoList.push({
        url
      })
    },

    handleDeleteVideo(videoItem) {
      const index = this.form.videoList.findIndex(item => item.url === videoItem.url)
      if (index > -1) {
        this.form.videoList.splice(index, 1)
      }
    },

    handlePublish (status) {
      this.$logger.info('handlePublish', status, this.requiredFields, this.form)
      this.checkRequiredFields()
      if (this.emptyRequiredFields.length === 0) {

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
  flex-direction: row;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .form-body {
    width: 55%;
    padding: 20px 30px;
    height: 100%;
    overflow-y: auto;
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

</style>
