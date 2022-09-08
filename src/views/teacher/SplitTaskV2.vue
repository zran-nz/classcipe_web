<template>
  <div class='my-full-form-wrapper' id='formRoot'>
    <fixed-form-header>
      <template v-slot:header>
        <form-header
          title='Create sub-task'
          @back='goBack'>
          <template v-slot:right>
          </template>
        </form-header>
      </template>
    </fixed-form-header>
    <div class='form-content'>
      <div class='step-content' v-if='!contentLoading'>
        <div class='form-body root-locate-form' id='form-body'>
          <div
            class='form-page-item'
          >
            <div class='form-field-item'>
              <div class='form-block tag-content-block' style="width: 50%">
                <custom-form-item :required='true'>
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

              <div class='form-block' style="width: 50%">
                <!-- image-->
                <custom-form-item class='img-wrapper' :required='true'>
                  <template slot='label'>
                    {{ 'Cover' | taskLabelName(splitTaskField.Image, $store.getters.formConfigData) }}
                  </template>
                  <template v-if='taskLabelHint(splitTaskField.Image, $store.getters.formConfigData)' slot='tips'>
                    <a-tooltip :title="'Cover' | taskLabelHint(splitTaskField.Image, $store.getters.formConfigData)" placement='top'>
                      <a-icon type="info-circle" />
                    </a-tooltip>
                  </template>
                  <custom-image-uploader
                    :field='splitTaskField.Image'
                    :content-type='contentType.task'
                    :img-url='form.image'
                    @update='handleUpdateCover' />
                </custom-form-item>
              </div>

              <div class='form-block tag-content-block'>
                <custom-form-item class='img-wrapper' :required='true'>
                  <template slot='label'>
                    {{ 'Slides' | taskLabelName(splitTaskField.Slides, $store.getters.formConfigData) }}
                  </template>
                  <form-slide-page-select :thumbnail-list='thumbnailList' :select-page-object-ids.sync='form.selectPageObjectIds' v-if='!thumbnailListLoading' :needPreview="false"/>
                  <a-skeleton v-if='thumbnailListLoading' />
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
      <template v-slot:left>
        <a-button @click='handleDiscardStep' class='cc-round-button'>
          Discard
        </a-button>
      </template>
      <template v-slot:right>
        <a-tooltip v-if="!canNext" title="Please complete your information.">
          <a-button :disabled="true">
            Next
          </a-button>
        </a-tooltip>
        <a-button v-else type='primary' @click='handleNextStep' class='cc-round-button' :loading='nextLoading'>
          <template>
            Next
          </template>
        </a-button>
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
import FormSlide from '@/components/PPT/FormSlide'
import SlideSelectList from '@/components/PPT/SlideSelectList'
import FormSlidePageSelect from '@/components/SplitTask/FormSlidePageSelect'
import CustomImageUploader from '@/components/Common/CustomImageUploader'

import { SplitTask, TaskQueryById } from '@/api/task'
import { TemplatesGetPresentation } from '@/api/template'

import { FormConfigMixin } from '@/mixins/FormConfigMixin'

import { SplitTaskField } from '@/const/common'
import { typeMap } from '@/const/teacher'

export default {
  name: 'SplitTaskV2',
  components: {
    FixedFormHeader,
    FormHeader,
    FixedFormFooter,
    CustomFormItem,
    CustomTextButton,
    FormSlide,
    SlideSelectList,
    FormSlidePageSelect,
    CustomImageUploader
  },
  mixins: [FormConfigMixin],
  props: {
    parentTaskId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      splitTaskField: SplitTaskField,
      contentType: typeMap,
      contentLoading: true,
      nextLoading: false,
      saving: false,
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
        status: 0
      },

      materialListFlag: false,

      thumbnailList: [],
      thumbnailListLoading: true
    }
  },
  computed: {
    isOwner() {
      return this.$store.getters.userInfo.email === this.form.createBy
    },
    taskId () {
      return this.form.id ? this.form.id : null
    },
    canNext() {
      return this.form.name && this.form.image && this.form.selectPageObjectIds && this.form.selectPageObjectIds.length > 0
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      this.$logger.info('initData doing...')

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
          this.allLearningObjectiveList = taskData.learnOuts.slice()
          this.allTags = JSON.parse(JSON.stringify(taskData.customTags))
          taskData.id = null
          taskData.presentationId = null
          this.form = taskData
          this.form.name = ''
          this.form.image = ''
          this.contentLoading = false
          this.$logger.info('restore split task', this.form)
        }
      })
      this.loadThumbnail(false)
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
    goBack() {
      this.$router.replace({ path: '/teacher/sub-task/' + this.parentTaskId })
    },
    async handleNextStep() {
      // 保存后跳转
      this.nextLoading = true
      const res = await this.save()
      if (res && res.code === 0 && this.form.id) {
        // if (!this.form.presentationId || this.form.presentationId.startsWith('fake_buy_')) {
        //   this.nextLoading = true
        //   try {
        //     const response = await TaskCreateNewTaskPPT({
        //       id: this.form.id ? this.form.id : '',
        //       type: this.contentType.task,
        //       name: this.form.name ? this.form.name : 'Unnamed Task',
        //       overview: this.form.overview
        //     })
        //
        //     if (response.success) {
        //       if (response.code === 520 || response.code === 403) {
        //         this.$logger.info('等待授权回调')
        //         this.$message.loading('Waiting for Google Slides auth...', 10)
        //         this.nextLoading = false
        //         return
        //       }
        //
        //       if (response.result && response.result?.presentationId && response.code === 0) {
        //         this.form.presentationId = response.result.presentationId
        //         this.$logger.info('update ppt id', this.form.presentationId)
        //         this.form.slideEditing = false
        //         await this.save()
        //       }
        //     } else {
        //       this.$message.error(response.message)
        //     }
        //   } finally {
        //     this.nextLoading = false
        //   }
        // }
        this.$router.replace({
          path: '/teacher/task-redirect/' + this.form.id
        })
      }
    },
    handleDiscardStep () {
      this.$router.replace({
        path: '/teacher/sub-task/' + this.parentTaskId
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
    async save() {
      const taskData = JSON.parse(JSON.stringify(this.form))
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
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";
.cc-fixed-form-header {
  height: 60px;
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
  height: calc(100vh - 90px);
  margin-top: 60px;
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
    width: 100%;
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
</style>
