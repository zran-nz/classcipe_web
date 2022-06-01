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

              <div class='form-block tag-content-block' :data-field-name='fieldName' v-if='fieldName === VideoField.Name' :key='fieldName'>
                <custom-form-item :required='emptyRequiredFields.indexOf(VideoField.Name) !== -1'>
                  <template slot='label'>
                    Video name
                  </template>
                  <a-input
                    v-model='form.name'
                    placeholder='Enter PD Content Name'
                    class='cc-form-input' />
                </custom-form-item>
              </div>

              <div class='form-block tag-content-block' :data-field-name='fieldName' v-if='fieldName === VideoField.Video' :key='fieldName'>
                <custom-form-item :required='emptyRequiredFields.indexOf(VideoField.Video) !== -1'>
                  <template slot='label'>
                    Select video
                  </template>
                  <video-select @update-video='handleUpdateVideo' :default-video='form.video' :default-type='form.videoType' />
                </custom-form-item>
              </div>

              <div class='form-block tag-content-block' :data-field-name='fieldName' v-if='fieldName === VideoField.CoverVideo' :key='fieldName'>
                <custom-form-item :required='emptyRequiredFields.indexOf(VideoField.CoverVideo) !== -1 || emptyRequiredFields.indexOf(VideoField.CoverImage) !== -1'>
                  <template slot='label'>
                    Edit cover Video/Image
                  </template>
                  <div class='edit-cover'>
                    <a-space>
                      <custom-cover-media
                        :url='form.coverVideo'
                        :video-item='form.coverVideo'
                        :type="'video'"
                        videoControls
                        :label-text="'Cover video'"
                        :show-delete-button='form.coverVideo && true'/>
                      <custom-cover-media
                        :url='form.image'
                        :video-item='form.image'
                        :type="'image'"
                        :label-text="'Cover image'"
                        :show-delete-button='form.image && true'/>
                    </a-space>
                  </div>
                </custom-form-item>
              </div>

              <div class='form-block form-radio-wrapper tag-content-block' :data-field-name='VideoField.ContentType' v-if='fieldName === VideoField.ContentType' :key='fieldName'>
                <custom-form-item :required='emptyRequiredFields.indexOf(VideoField.ContentType) !== -1'>
                  <template slot='label'>
                    Purpose of video
                  </template>
                  <custom-radio-button-group
                    :list="[ {name: 'Student self-learning', value: 0}, {name: 'Teacher PD', value: 1}]"
                    :value.sync='form.contentType' >
                  </custom-radio-button-group>
                </custom-form-item>
              </div>

              <div class='form-block tag-content-block' :data-field-name='fieldName' v-if='fieldName === VideoField.Goals && form.contentType === 1' :key='fieldName'>
                <custom-form-item :required='emptyRequiredFields.indexOf(VideoField.Goals) !== -1'>
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
                        <custom-tag-v2
                          ref='customTag'
                          :custom-tags='customTags'
                          :scope-tags-list='customTagList'
                          :selected-tags-list='form.customTags'
                          :current-field-name='currentFocusFieldName'
                          @reload-user-tags='loadCustomTags'
                          @change-add-keywords='handleChangeAddKeywords'
                          @change-user-tags='handleChangeCustomTags'></custom-tag-v2>
                      </a-col>
                    </a-row>
                  </div>
                </custom-form-item>
              </div>

              <div class='form-block tag-content-block' :data-field-name='fieldName' v-if='fieldName === VideoField.LearnOuts && form.contentType === 0' :key='fieldName'>
                <custom-form-item :required='emptyRequiredFields.indexOf(VideoField.LearnOuts) !== -1'>
                  <template slot='label'>
                    Learning objectives
                  </template>
                  <a-row>
                    <a-col span='12'>
                    </a-col>
                    <a-col span='10' offset='1'>
                    </a-col>
                  </a-row>
                </custom-form-item>
              </div>

              <div class='form-block tag-content-block' :data-field-name='fieldName' v-if='fieldName === VideoField.Link' :key='fieldName'>
                <custom-form-item :required='emptyRequiredFields.indexOf(VideoField.Link) !== -1'>
                  <template slot='label'>
                    Linked tasks
                  </template>
                  <a-row>
                    <a-col span='12'>
                      <form-linked-content :from-id='videoId' :from-type='contentType.video'/>
                    </a-col>
                    <a-col span='10' offset='1'>
                      <link-content-list :filter-types="[contentType.task]" />
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
import { CustomTagType, VideoField } from '@/const/common'
import CustomCoverMedia from '@/components/Common/CustomCoverMedia'
import { PublishMixin } from '@/mixins/PublishMixin'
import { VideoAddOrUpdate, VideoQueryById } from '@/api/video'
import { AutoSaveMixin } from '@/mixins/AutoSaveMixin'
import VideoSelect from '@/components/Video/VideoSelect'
import CustomRadioButtonGroup from '@/components/Common/CustomRadioButtonGroup'
import CustomTagV2 from '@/components/CustomTag/CustomTagV2'
import { FindCustomTags } from '@/api/tag'
import { typeMap } from '@/const/teacher'
import FormLinkedContent from '@/components/Common/FormLinkedContent'
import LinkContentList from '@/components/UnitPlan/LinkContentList'
import PdEvent from '@/components/PdContent/PdEvent'

export default {
  name: 'AddPD',
  components: {
    LinkContentList,
    FormLinkedContent,
    CustomTagV2,
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
  mixins: [ PublishMixin, AutoSaveMixin ],
  data() {
    return {
      contentLoading: true,
      form: {
        name: null,
        video: null,
        videoType: null,
        image: null,
        coverVideo: null,
        contentType: 0,
        goals: null,
        customTags: [],
        createBy: null
      },

      contentType: typeMap,
      VideoField: VideoField,
      customTagList: [],
      customTags: {},
      currentFocusFieldName: VideoField.Goals,
      currentActiveStepIndex: this.getSessionStep(),

      thumbnailList: []
    }
  },
  created() {
    this.initFormSteps()
    if (this.currentActiveStepIndex < 0 || this.currentActiveStepIndex > this.formSteps.length - 1) {
      this.currentActiveStepIndex = 0
    }
    this.currentStep = this.formSteps[this.currentActiveStepIndex]
    this.requiredFields = [
      VideoField.Name,
      VideoField.Video,
      VideoField.CoverVideo,
      VideoField.CoverImage
    ]
    this.initData()
    this.loadCustomTags()
    this.contentLoading = false

    this.$EventBus.$on(PdEvent.PD_VIDEO_DELETE, this.handleDeleteCover)
  },
  beforeDestroy() {
    this.$EventBus.$off(PdEvent.PD_VIDEO_DELETE, this.handleDeleteCover)
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
          this.form = response.result
        } else {
          this.$message.error(response.message)
        }
      }).finally(() => {
        this.saving = false
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
      this.$refs['steps-nav'].nextStep()
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

    loadCustomTags() {
      // this.$refs.customTag.tagLoading = true
      FindCustomTags({}).then((response) => {
        this.$logger.info('FindCustomTags response', response.result)
        if (response.success) {
          this.customTags = response.result
          // 默认展示的tag分类
          CustomTagType.task.default.forEach(name => {
            this.customTagList.push(name)
          })
          // // 再拼接自己添加的
          this.customTags.userTags.forEach(tag => {
            if (this.customTagList.indexOf(tag.name) === -1) {
              this.customTagList.push(tag.name)
            }
          })
        } else {
          this.$message.error(response.message)
        }
        // this.$refs.customTag.tagLoading = false
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

    handleDeleteCover (item) {
      this.$logger.info('handleDeleteCover', item)
      if (item.indexOf('mp4')) {
        this.form.coverVideo = null
      } else if (item.indexOf('png') !== -1 || item.indexOf('jpg') !== -1 || item.indexOf('jpeg') !== -1) {
        this.form.image = null
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
    margin: auto;
    width: 100%;
    padding: 20px 30px;
    height: 100%;
    overflow-y: auto;
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

</style>
