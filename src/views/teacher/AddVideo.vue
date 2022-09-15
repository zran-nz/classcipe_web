<template>
  <div class='my-full-form-wrapper' id='formRoot'>
    <fixed-form-header>
      <template v-slot:header>
        <form-header
          title='Create Video'
          :form='form'
          :spin='saving'
          :show-share='false'
          :show-collaborate='false'
          :needConfirm="true"
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

              <div class='form-block tag-content-block' v-if='fieldName === VideoField.Name' :key='fieldName'>
                <custom-form-item :required='emptyRequiredFields.indexOf(VideoField.Name) !== -1' :required-field='requiredFields.indexOf(VideoField.Name) !== -1'>
                  <template slot='label'>
                    Video name
                  </template>
                  <a-input
                    v-model='form.name'
                    placeholder='Enter Video Content Name'
                    class='cc-form-input half-block' />
                </custom-form-item>
              </div>

              <div class='form-block tag-content-block' v-if='fieldName === VideoField.Video' :key='fieldName'>
                <custom-form-item :required='emptyRequiredFields.indexOf(VideoField.Video) !== -1' :required-field='requiredFields.indexOf(VideoField.Video) !== -1'>
                  <template slot='label'>
                    Select video
                  </template>
                  <video-select
                    :field='VideoField.Video'
                    :content-id='videoId'
                    :content-type='typeMap.video'
                    @update='handleUpdateVideo'
                    :default-video='form.video'
                    :default-type='form.videoType' />
                </custom-form-item>
              </div>

              <!--              <div class='form-block tag-content-block' v-if='fieldName === VideoField.CoverVideo' :key='fieldName'>-->
              <!--                <custom-form-item :required='emptyRequiredFields.indexOf(VideoField.CoverVideo) !== -1'>-->
              <!--                  <template slot='label'>-->
              <!--                    Edit cover Video-->
              <!--                  </template>-->
              <!--                  <div class='edit-cover'>-->
              <!--                    <custom-cover-media-->
              <!--                      :url='form.coverVideo'-->
              <!--                      :field='VideoField.CoverVideo'-->
              <!--                      videoControls-->
              <!--                      @update='handleUpdateCover'-->
              <!--                      @delete='form.coverVideo = null'-->
              <!--                      :show-delete-button='form.coverVideo && true'/>-->
              <!--                  </div>-->
              <!--                </custom-form-item>-->
              <!--              </div>-->

              <div class='form-block tag-content-block' v-if='fieldName === VideoField.CoverVideo' key='image'>
                <custom-form-item :required='emptyRequiredFields.indexOf(VideoField.Image) !== -1' :required-field='requiredFields.indexOf(VideoField.Image) !== -1'>
                  <template slot='label'>
                    Edit cover Image
                  </template>
                  <div class='edit-cover'>
                    <custom-image-uploader
                      :field='VideoField.Image'
                      :content-id='videoId'
                      :content-type='typeMap.video'
                      :img-url='form.image'
                      @update='handleUpdateCover' />
                  </div>
                </custom-form-item>
              </div>

              <div class='form-block form-radio-wrapper tag-content-block' v-if='fieldName === VideoField.ContentType' :key='fieldName'>
                <custom-form-item :required='emptyRequiredFields.indexOf(VideoField.ContentType) !== -1' :required-field='requiredFields.indexOf(VideoField.ContentType) !== -1'>
                  <template slot='label'>
                    Purpose of video
                  </template>
                  <custom-radio-button-group
                    v-if='!contentLoading'
                    :list="[ {name: 'Student self-learning', value: 0}, {name: 'Teacher PD', value: 1}]"
                    :value.sync='form.contentType' >
                  </custom-radio-button-group>
                </custom-form-item>
              </div>

              <div class='form-block tag-content-block' v-if='fieldName === VideoField.Goals && form.contentType === 1' :key='fieldName'>
                <custom-form-item :required='emptyRequiredFields.indexOf(VideoField.Goals) !== -1' :required-field='requiredFields.indexOf(VideoField.Goals) !== -1'>
                  <template slot='label'>
                    Goals
                  </template>
                  <div class='video-goals-wrapper'>
                    <a-row>
                      <a-col span='12'>
                        <a-textarea
                          :auto-size="{ minRows: 5, maxRows: 10 }"
                          v-model='form.goals'
                          placeholder='Please enter goals...'
                          class='cc-form-textarea-white-bg'
                          allow-clear/>
                      </a-col>
                      <a-col span='10' offset='1'>
                        <custom-tag-pd
                          :custom-tags.sync='form.customTags'
                        />
                      </a-col>
                    </a-row>
                  </div>
                </custom-form-item>
              </div>

              <div class='form-block tag-content-block' v-if='fieldName === VideoField.LearnOuts && form.contentType === 0' :key='fieldName'>
                <custom-form-item :required='emptyRequiredFields.indexOf(VideoField.LearnOuts) !== -1' :required-field='requiredFields.indexOf(VideoField.LearnOuts) !== -1'>
                  <template slot='label'>
                    Learning objectives
                  </template>
                  <learning-objective
                    @change='handleUpdateLearningObjectives'
                    :curriculumId='form.curriculumId'
                    :learning-objectives='form.learnOuts'
                    :subject-list='form.subjectList'
                    :year-list='form.yearList'
                    :language-list='form.languageList' />
                </custom-form-item>
              </div>

              <div class='form-block tag-content-block' v-if='fieldName === VideoField.Link' :key='fieldName'>
                <custom-form-item :required='emptyRequiredFields.indexOf(VideoField.Link) !== -1' :required-field='requiredFields.indexOf(VideoField.Link) !== -1'>
                  <template slot='label'>
                    Linked tasks
                  </template>
                  <a-row>
                    <a-col span='12'>
                      <form-linked-content :from-id='videoId' :from-type='contentType.video' @update-task-id-list='updateAssociatedIdList'/>
                    </a-col>
                    <a-col span='12'>
                      <link-content-list
                        :selected-id-list='associateIdList'
                        :filter-types="[contentType.task]" />
                    </a-col>
                  </a-row>
                </custom-form-item>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class='loading-content' v-if='contentLoading'>
        <a-spin />
      </div>
    </div>
    <fixed-form-footer>
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
import { VideoField } from '@/const/common'
import CustomCoverMedia from '@/components/Common/CustomCoverMedia'
import { PublishMixin } from '@/mixins/PublishMixin'
import { VideoAddOrUpdate, VideoQueryById } from '@/api/video'
import { AutoSaveMixin } from '@/mixins/AutoSaveMixin'
import VideoSelect from '@/components/Video/VideoSelect'
import CustomRadioButtonGroup from '@/components/Common/CustomRadioButtonGroup'
import { typeMap } from '@/const/teacher'
import FormLinkedContent from '@/components/Common/FormLinkedContent'
import LinkContentList from '@/components/UnitPlan/LinkContentList'
import LearningObjective from '@/components/LearningObjective/LearningObjective'
import CustomTagV3 from '@/components/CustomTag/CustomTagV3'
import { UpdateContentStatus } from '@/api/teacher'
import CustomImageUploader from '@/components/Common/CustomImageUploader'
import CustomTagPd from '@/components/CustomTag/CustomTagPd'
import EditPriceDialog from '@/components/MyContentV2/EditPriceDialog'
import { BaseEventMixin } from '@/mixins/BaseEvent'

export default {
  name: 'AddPD',
  components: {
    EditPriceDialog,
    CustomTagPd,
    CustomImageUploader,
    CustomTagV3,
    LearningObjective,
    LinkContentList,
    FormLinkedContent,
    CustomRadioButtonGroup,
    VideoSelect,
    CustomCoverMedia,
    FixedFormHeader,
    FormHeader,
    FixedFormFooter,
    CustomFormItem,
    MyVerticalSteps,
    CustomTextButton
  },
  props: {
    videoId: {
      type: String,
      required: true
    }
  },
  mixins: [ PublishMixin, AutoSaveMixin, BaseEventMixin ],
  data() {
    return {
      contentLoading: true,
      typeMap: typeMap,
      form: {
        name: null,
        video: null,
        videoType: null,
        curriculumId: null,
        image: null,
        coverVideo: null,
        contentType: 0,
        goals: null,
        overview: null,
        customTags: [],
        tagCategoryDesc: [],
        learnOuts: [],
        subjectList: [],
        languageList: [],
        yearList: [],
        createBy: null,
        type: this.$classcipe.typeMap.video
      },
      oldForm: null,

      contentType: typeMap,
      VideoField: VideoField,
      currentActiveStepIndex: this.getSessionStep(),

      thumbnailList: [],
      associateIdList: []
    }
  },
  created() {
    this.initFormSteps()
    if (this.currentActiveStepIndex < 0 || this.currentActiveStepIndex > this.formSteps.length - 1) {
      this.currentActiveStepIndex = 0
    }
    this.currentStep = this.formSteps[this.currentActiveStepIndex]
    this.requiredFields = this.$classcipe.videoRequiredFields
    this.initData()
  },
  methods: {

    initData () {
      this.saving = true
      this.restoreVideo()
    },

    restoreVideo() {
      this.$logger.info('restoreVideo ' + this.videoId)
      this.saving = true
      VideoQueryById({
        id: this.videoId
      }).then(response => {
        this.$logger.info('VideoQueryById ' + this.videoId, response.result)
        if (response.code === 0 && response.success) {
          const data = response.result
          data.type = this.$classcipe.typeMap.video
          this.form = data
          this.oldForm = Object.assign({}, this.form)
        } else {
          this.$message.error(response.message)
        }
      }).finally(() => {
        this.saving = false
        this.contentLoading = false
        this.tryAutoCheckRequiredField()
      })
    },

    save() {
      this.saving = true
      return VideoAddOrUpdate(this.form).then(res => {
        this.$logger.info('VideoAddOrUpdate', res)
      }).finally(() => {
        this.saving = false
      })
    },

    initFormSteps () {
      this.formSteps = [
        {
          id: 1,
          name: 'Editing',
          commonFields: [
            VideoField.Name,
            VideoField.Video
          ],
          showRequiredTips: false,
          showSatisfiedTips: false
        },
        {
          id: 2,
          name: 'Video setting',
          commonFields: [
            VideoField.ContentType,
            VideoField.CoverImage,
            VideoField.CoverVideo,
            VideoField.Goals,
            VideoField.LearnOuts
          ],
          showRequiredTips: false,
          showSatisfiedTips: false
        },
        {
          id: 3,
          name: 'Link Tasks',
          commonFields: [
            VideoField.Link
          ],
          showRequiredTips: false,
          showSatisfiedTips: false
        }
      ]
    },

    goBack() {
      this.$router.push({ path: '/teacher/main/created-by-me' })
    },

    getSessionStep() {
      const oldStep = sessionStorage.getItem('video-step-' + this.videoId)
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
      this.setSessionStep(data.index)
    },

    setSessionStep(step) {
      this.currentActiveStepIndex = step
      sessionStorage.setItem('video-step-' + this.videoId, step)
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

    updateAssociatedIdList (idList) {
      this.$logger.info('updateAssociatedIdList', idList)
      this.associateIdList = idList
    },

    handleUpdateVideo (video) {
      this.$logger.info('handleUpdateVideo', video)
      this.form.video = video.url
      this.form.videoType = video.type
    },

    handlePublish (status) {
      this.$logger.info('handlePublish', status, this.requiredFields, this.form)
      this.checkRequiredFields()
      if (this.emptyRequiredFields.length === 0) {
        this.form.status = 1
        this.handlePublishFormItem(1)
        this.showEditPriceDialog()
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

    handlePublishFormItem (status) {
      const data = {
        id: this.videoId,
        status: status,
        type: this.contentType.video
      }
      UpdateContentStatus(data)
    },

    handleUpdateCover (coverData) {
      this.$logger.info('handleUpdateCover', coverData)
      if (coverData.type === 'video') {
        this.form.coverVideo = coverData.url
      } else {
        this.form.image = coverData.url
      }
    },

    handleUpdateLearningObjectives (data) {
      this.$logger.info('handleUpdateLearningObjectives', data)
      this.form.learnOuts = data.learnOuts
      this.form.curriculumId = data.curriculumId
      this.form.subjectList = data.selectedSubjectList
      this.form.yearList = data.selectedYearList
      this.form.languageList = data.selectedLanguageList
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
    margin: auto;
    width: 100%;
    padding: 20px 30px;
    height: 100%;
    -moz-overflow-y: auto;
    overflow-y: overlay;
    background-color: #fff;
  }
}

.loading-content {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 400px;
}

.half-block {
  width: 50%;
}
</style>
