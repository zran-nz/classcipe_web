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

              <div class='form-block tag-content-block' :data-field-name='fieldName' v-if='fieldName === VideoField.Name && form.coverVideo' :key='fieldName'>
                <custom-form-item :required='emptyRequiredFields.indexOf(VideoField.Name) !== -1'>
                  <template slot='label'>
                    Name
                  </template>
                  <a-input
                    v-model='form.name'
                    placeholder='Enter PD Content Name'
                    class='cc-form-input' />
                </custom-form-item>
              </div>

              <div class='form-block tag-content-block' :data-field-name='fieldName' v-if='fieldName === VideoField.CoverVideo' :key='fieldName'>
                <custom-form-item :required='emptyRequiredFields.indexOf(VideoField.CoverVideo) !== -1' :show-label='false'>
                  <video-select />
                </custom-form-item>
              </div>

              <div class='form-block tag-content-block' :data-field-name='fieldName' v-if='fieldName === VideoField.Goals' :key='fieldName'>
                <custom-form-item :required='emptyRequiredFields.indexOf(VideoField.Goals) !== -1'>
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
import { formatLocalUTC } from '@/utils/util'
import { VideoField } from '@/const/common'
import CustomCoverMedia from '@/components/Common/CustomCoverMedia'
import { typeMap } from '@/const/teacher'
import { PublishMixin } from '@/mixins/PublishMixin'
import { VideoAddOrUpdate, VideoQueryById } from '@/api/video'
import { AutoSaveMixin } from '@/mixins/AutoSaveMixin'
import VideoSelect from '@/components/Video/VideoSelect'

export default {
  name: 'AddPD',
  components: {
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
  computed: {
    lastChangeSavedTime() {
      const time = this.form && (this.form.updateTime || this.form.createTime)
      if (time) {
        return formatLocalUTC(time)
      } else {
        return ''
      }
    }
  },
  mixins: [ PublishMixin, AutoSaveMixin ],
  data() {
    return {
      contentLoading: true,
      form: {
        name: null,
        coverVideo: null,
        goals: null,
        customTags: [],
        videoList: [],
        createBy: null
      },
      contentType: typeMap,
      VideoField: VideoField,

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
      VideoField.CoverVideo,
      VideoField.Image
    ]
    this.initData()
    this.contentLoading = false
  },
  beforeDestroy() {
  },
  methods: {

    initData () {
      this.saving = true
      this.restoreVideo()
    },

    restoreVideo() {
      this.$logger.info('restoreVideo ' + this.videoId)
      VideoQueryById({
        id: this.videoId
      }).then(response => {
        this.$logger.info('VideoQueryById ' + this.videoId, response.result)
        this.form = response.result
      }).finally(() => {
        this.saving = false
      })
    },

    save() {
      this.saving = true
      return VideoAddOrUpdate(this.form).then(res => {
        this.$logger.info('VideoAddOrUpdate', res)
        this.restoreVideo()
      }).catch(() => {
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
            VideoField.CoverVideo,
            VideoField.CoverImage
          ],
          showRequiredTips: false,
          showSatisfiedTips: false
        },
        {
          id: 2,
          name: 'Video setting',
          commonFields: [
            VideoField.ContentType,
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

    handleUpdateCover (coverData) {
      this.$logger.info('handleUpdateCover', coverData)
      if (coverData.type === 'video') {
        this.form.coverVideo = coverData.url
      } else {
        this.form.image = coverData.url
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
