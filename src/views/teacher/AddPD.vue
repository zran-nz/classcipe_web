<template>
  <div class='my-full-form-wrapper' id='formRoot'>
    <fixed-form-header>
      <template v-slot:header>
        <form-header
          title='Create PD Content'
          :form='form'
          :show-share='false'
          :show-collaborate='false'
          :last-change-saved-time='lastChangeSavedTime'
          @back='goBack'>
        </form-header>
      </template>
      <template v-slot:nav>
        <my-vertical-steps
          ref='steps-nav'
          :steps='pdSteps'
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
            v-for='(step, stepIndex) in pdSteps'
            :key='step.id'>
            <div class='form-field-item' v-for='fieldName in step.commonFields' :key='fieldName'>

              <div class='form-block tag-content-block' :data-field-name='fieldName' v-if='fieldName === PdField.Name' :key='fieldName'>
                <custom-form-item>
                  <template slot='label'>
                    Name
                  </template>
                  <a-input
                    v-model='form.name'
                    placeholder='Enter PD Content Name'
                    class='cc-form-input' />
                </custom-form-item>
              </div>

              <div class='form-block tag-content-block' :data-field-name='fieldName' v-if='fieldName === PdField.CoverImage' :key='fieldName'>
                <custom-form-item>
                  <template slot='label'>
                    Cover image / Video
                  </template>
                  <custom-cover-media :type='form.coverType' :url='form.coverUrl' @update='handleUpdateCover'/>
                </custom-form-item>
              </div>

              <div class='form-block tag-content-block' :data-field-name='fieldName' v-if='fieldName === PdField.Goals' :key='fieldName'>
                <custom-form-item>
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
                  <task-linked-content :from-id='pdId' />
                </div>
              </div>

              <div class='form-block tag-content-block' :data-field-name='fieldName' v-if='fieldName === PdField.Slides' :key='fieldName'>
                <custom-form-item :show-label='false'>
                  <form-slide :source-type='contentType.pd' :source-id='pdId' :need-refresh='true'/>
                </custom-form-item>
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
            <link-content-list :filter-types="[contentType.task]" />
          </template>
          <template v-if='currentRightModule === rightModule.recommend'>
            <slide-select-list />
          </template>
        </div>
      </div>
      <div class='loading-content' v-if='contentLoading'>
        <a-spin />
      </div>
    </div>
    <fixed-form-footer>
      <template v-slot:left>
        <a-button class='cc-round-button'>Discard</a-button>
      </template>
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
import { PdField } from '@/const/common'
import { RightModule } from '@/mixins/BaseEvent'
import CustomCoverMedia from '@/components/Common/CustomCoverMedia'
import CustomTagV2 from '@/components/CustomTag/CustomTagV2'
import { FindCustomTags } from '@/api/tag'
import LinkContentList from '@/components/UnitPlan/LinkContentList'
import { typeMap } from '@/const/teacher'
import FormSlide from '@/components/PPT/FormSlide'
import SlideSelectList from '@/components/PPT/SlideSelectList'
import TaskLinkedContent from '@/components/Task/TaskLinkedContent'

export default {
  name: 'AddPD',
  components: {
    TaskLinkedContent,
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
  data() {
    return {
      contentLoading: true,
      form: {
        name: null,
        coverType: null,
        coverUrl: null,
        goals: null,
        customTags: [],
        presentationId: null,
        createBy: null
      },
      contentType: typeMap,
      currentFocusFieldName: null,
      customTagList: [],
      customTags: {},
      PdField: PdField,
      pdSteps: [
        {
          id: 1,
          name: 'PD goals',
          commonFields: [
            PdField.Name,
            PdField.CoverImage,
            PdField.Goals
          ]
        },
        {
          id: 2,
          name: 'Edit Slides',
          commonFields: [
            PdField.Slides
          ]
        },
        {
          id: 3,
          name: 'Link Tasks',
          commonFields: [
            PdField.Link
          ]
        },
        {
          id: 4,
          name: 'Case Video',
          commonFields: [
            PdField.Video
          ]
        }
      ],
      pdFieldTagMap: {
        [PdField.Goals]: []
      },
      currentActiveStepIndex: this.getSessionStep(),
      currentRightModule: null,
      rightModule: RightModule
    }
  },
  created() {
    if (this.currentActiveStepIndex < 0 || this.currentActiveStepIndex > this.pdSteps.length - 1) {
      this.currentActiveStepIndex = 0
    }
    this.currentStep = this.pdSteps[this.currentActiveStepIndex]
    this.currentFocusFieldName = this.currentStep.commonFields[0]
    this.loadCustomTags()
    this.handleDisplayRightModule()
    this.contentLoading = false
  },
  methods: {
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
      this.form.coverType = coverData.type
      this.form.coverUrl = coverData.url
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
