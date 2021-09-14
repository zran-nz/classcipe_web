<template>
  <div class="task-form-wrapper">
    <a-row class="unit-content">
      <a-col class="main-content">
        <a-form-model :model="form" class="my-form-wrapper">
          <div class="form-block">
            <a-form-model-item class="task-type-line">
              <a-input v-model="form.name" class="my-form-input" placeholder="name"/>
            </a-form-model-item>

            <div class="form-block">
              <div class="self-type-wrapper">
                <div class="self-field-label">
                  <div :class="{'lesson-type-item': true, 'green-active-task-type': form.lessonType === 'FA'}" @click="handleSelectTaskType('FA')">FA</div>
                  <div :class="{'lesson-type-item': true, 'red-active-task-type': form.lessonType === 'SA'}" @click="handleSelectTaskType('SA')">SA</div>
                </div>
                <div class="self-type-filter">
                  <a-select class="my-big-select" size="large" v-model="form.bloomCategories" placeholder="Choose the Bloom Taxonomy Categories" :allowClear="true" >
                    <a-select-option :value="item.value" v-for="(item, index) in initBlooms" :key="index" >
                      {{ item.title }}
                    </a-select-option>
                  </a-select>
                </div>
              </div>
            </div>

            <a-form-model-item class="task-audio-line">
              <a-textarea v-model="form.overview" allow-clear placeholder="overview"/>
              <div class="audio-wrapper" v-if="form.audioUrl">
                <audio :src="form.audioUrl" controls />
                <span @click="form.audioUrl = null"><a-icon type="delete" /></span>
              </div>
              <div class="task-audio" @click="handleAddAudioOverview">
                <img src="~@/assets/icons/lesson/microphone.png" />
              </div>
            </a-form-model-item>
            <div class="form-block">
              <div class="subject-grade-wrapper">
                <div class="select-item">
                  <a-select size="large" v-model="form.subjectIds" mode="multiple" placeholder="Subjects" class="subject-item">
                    <a-select-opt-group v-for="subjectOptGroup in subjectTree" :key="subjectOptGroup.id">
                      <span slot="label">{{ subjectOptGroup.name }}</span>
                      <a-select-option
                        :value="subjectOption.id"
                        v-for="subjectOption in subjectOptGroup.children"
                        :key="subjectOption.id">{{ subjectOption.name }}
                      </a-select-option>
                    </a-select-opt-group>
                  </a-select>
                </div>
                <div class="select-item">
                  <a-select size="large" v-model="form.gradeIds" placeholder="Grade" mode="multiple" class="grade-item">
                    <a-select-option :value="gradeOption.id" v-for="gradeOption in gradeList" :key="gradeOption.id">
                      {{ gradeOption.name }}
                    </a-select-option>
                  </a-select>
                </div>
              </div>
            </div>

            <div class="content-blocks question-item" v-for="(questionItem, questionIndex) in questionDataObj" :key="questionIndex" v-if="questionItem !== null">
              <!--knowledge tag-select -->
              <new-ui-clickable-knowledge-tag
                :question-index="questionIndex"
                :selected-knowledge-tags="questionItem.knowledgeTags"
                :selected-skill-tags="questionItem.skillTags"
                @remove-knowledge-tag="handleRemoveKnowledgeTag"
                @add-knowledge-tag="handleAddKnowledgeTag"
                @remove-skill-tag="handleRemoveSkillTag"
                @add-skill-tag="handleAddSkillTag"
              />
            </div>

            <div class="form-block">
              <custom-tag ref="customTag" :selected-tags-list="form.customTags" @change-user-tags="handleChangeUserTags"></custom-tag>
            </div>
          </div>
          <div class="save-task">
            <a-button :loading="loadSaving" :style="{'display': 'flex', 'align-items': 'center', 'background' : '#15C39A', 'color': '#fff', 'justify-content': 'center', 'padding': '20px 15px', 'border-radius': '5px'}" @click="handleSaveTask">
              <div class="btn-icon">
                <img src="~@/assets/icons/task/taskAdd.png" />
              </div>
              <div class="btn-text">
                Add another task
              </div>
            </a-button>
          </div>
        </a-form-model>
      </a-col>
    </a-row>
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
  </div>
</template>

<script>
import * as logger from '@/utils/logger'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import { typeMap } from '@/const/teacher'
import { GetMyGrades } from '@/api/teacher'
import InputSearch from '@/components/UnitPlan/InputSearch'
import SdgTagInput from '@/components/UnitPlan/SdgTagInput'
import NewUiClickableKnowledgeTag from '@/components/UnitPlan/NewUiClickableKnowledgeTag'
import SkillTag from '@/components/UnitPlan/SkillTag'
import { formatLocalUTC } from '@/utils/util'
import MyContentSelector from '@/components/MyContent/MyContentSelector'
import RelevantTagSelector from '@/components/UnitPlan/RelevantTagSelector'
import { TemplateTypeMap } from '@/const/template'
import { commonAPIUrl, GetDictItems } from '@/api/common'
import { SubjectTree } from '@/api/subject'
import { formatSubjectTree } from '@/utils/bizUtil'
import { DICT_BLOOM_CATEGORY } from '@/const/common'
import CustomTag from '@/components/UnitPlan/CustomTag'
const { SpliteTask } = require('@/api/task')

export default {
  name: 'TaskForm',
  components: {
    ContentTypeIcon,
    InputSearch,
    SdgTagInput,
    NewUiClickableKnowledgeTag,
    SkillTag,
    MyContentSelector,
    CustomTag,
    RelevantTagSelector
  },
  props: {
    taskId: {
      type: String,
      default: ''
    },
    selectIds: {
      type: Array,
      default: () => {
        return []
      }
    },
    taskPrefix: {
      type: String,
      default: '',
      required: true
    }
  },
  data () {
    return {
      contentType: typeMap,
      templateTypeMap: TemplateTypeMap,

      creating: false,
      loadSaving: false,

      leftAddExpandStatus: false,
      selectLinkContentVisible: false,
      viewInGoogleSlideVisible: false,
      selectTemplateVisible: false,
      showAddAudioVisible: false,

      labelCol: { span: 4 },
      wrapperCol: { span: 18 },

      presentationLink: null,
      form: {
        selectPageObjectIds: [],
        __taskId: null,
        image: '',
        audioUrl: '',
        name: 'Untitled task',
        overview: '',
        questions: [{
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
        }],
        suggestingTag: [],
        status: 0,
        taskType: '',
        createTime: '',
        updateTime: '',
        customTags: [],
        subjectIds: [],
        gradeIds: [],
        bloomCategories: ''
      },
      // Grades
      gradeList: [],
      // SubjectTree
      subjectTree: [],

      // 将questions转成对象
      questionTotal: 0,
      questionMaxIndex: 0,
      questionPrefix: '__question_',
      questionDataObj: {
      },

      extKnowledgeTagList: [],
      extSkillTagList: [],

      audioUrl: null,
      currentUploading: false,

      initBlooms: []
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
    selectedTemplateIdList () {
      const list = []
      this.selectedTemplateList.forEach(item => {
        list.push(item.id)
      })

      return list
    }
  },
  watch: {
    selectIds (value) {
      this.$logger.info('selectPageObjectIds update', value)
      this.form.selectPageObjectIds = value
    }
  },
  created () {
    logger.info('add task created ' + this.taskId + ' ' + this.$route.path)
    this.questionPrefix = '' + this.taskPrefix + '__question_'
    this.$set(this.questionDataObj, this.questionPrefix + this.questionMaxIndex, {
      questionId: null,
      visible: false,
      name: '',
      knowledgeMainSubjectId: '',
      knowledgeSubSubjectId: '',
      knowledgeGradeId: '',
      knowledgeTags: [],
      skillGradeId: '',
      skillTags: []
    })
    this.form.__taskId = '__taskId_' + this.taskPrefix
    this.$logger.info('questionPrefix ' + this.questionPrefix)
    this.$logger.info('questionDataObj ', this.questionDataObj)
    this.initData()
  },
  methods: {
    initData () {
      logger.info('initData doing...')
      GetMyGrades().then((response) => {
        this.$logger.info('add task initData done', response)
        this.$logger.info('GetMyGrades', response.result)
        this.gradeList = response.result
      }).catch((e) => {
        this.$logger.error(e)
        this.$message.error(this.$t('teacher.add-task.init-data-failed'))
      })

       SubjectTree({ curriculumId: this.$store.getters.bindCurriculum }).then((response) => {
         logger.info('SubjectTree', response.result)
         let subjectTree = response.result
         subjectTree = formatSubjectTree(subjectTree)
         this.subjectTree = subjectTree
         logger.info('after format subjectTree', subjectTree)
      })

      GetDictItems(DICT_BLOOM_CATEGORY).then(response => {
        if (response.success) {
          logger.info('DICT_BLOOM_CATEGORY', response.result)
          this.initBlooms = response.result
        }
      })
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
        name: data.name,
        gradeId: data.gradeId,
        mainSubjectId: data.mainSubjectId,
        subSubjectId: data.subSubjectId,
        mainKnowledgeId: data.mainKnowledgeId,
        subKnowledgeId: data.subKnowledgeId,
        origin: 'suggesting'
      }
      this.questionDataObj[data.questionIndex].knowledgeTags.push(newTag)
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

    handleSaveTask () {
      logger.info('handleSaveTask', this.form, this.questionDataObj)

      const taskData = Object.assign({}, this.form)

      logger.info('basic taskData', taskData)

      this.$logger.info('question key ' + (this.questionPrefix + '0'))
      const question = this.questionDataObj[this.questionPrefix + '0']
      logger.info('question ' + this.questionPrefix + '0', question)
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

      taskData.suggestingTag = questionItem
      taskData.selectPageObjectIds = this.form.selectPageObjectIds
      logger.info('finish taskData', taskData)
      const SpliteTaskData = {
        'taskId': this.taskId,
        'subTask': taskData
      }
      this.loadSaving = true
      SpliteTask(SpliteTaskData).then((response) => {
        this.$logger.info('SpliteTask ', response.result)
        if (response.success) {
          this.$message.success('Add another task success')
          taskData.id = response.result.id
          this.$emit('finish-task', taskData)
        } else {
          this.$message.error(response.message)
        }
        this.loadSaving = false
      })
    },

    handleSelectTaskType (type) {
      this.$logger.info('handleSelectTaskType ' + type)
      this.form.taskType = type
    },

    handleAddAudioOverview () {
      this.$logger.info('handleAddAudioOverview')
      this.showAddAudioVisible = true
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
      this.$logger.info('handleCancelAddAudio')
      this.audioUrl = null
      this.showAddAudioVisible = false
    },

    handleConfirmAddAudio () {
      if (this.audioUrl) {
        this.form.audioUrl = this.audioUrl
        this.audioUrl = null
        this.showAddAudioVisible = false
      }
    },

    handleChangeUserTags (tags) {
      this.form.customTags = tags
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.task-header {
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

    .select-template {
      text-align: center;
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
      padding-top: 24px;
    }

    .content-blocks {
      position: relative;
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

.link-content-wrapper {

}

.select-template-wrapper {
  display: flex;
  cursor: pointer;
  user-select: none;
  flex-direction: column;

  .template-type-list {
    display: flex;
    flex-direction: row;
    justify-content: center;

    .template-type-item {
      padding: 10px 15px;
      max-height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      min-width: 70px;
    }

    .active-template-type {
      background-color: fade(@outline-color, 20%);
      color: @primary-color;
      border-radius: 40px;
    }
  }

  .template-list-wrapper {
    margin-top: 20px;
    min-height: 250px;

    .template-list {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: flex-start;
      flex-wrap: wrap;

      .template-item {
        background-size: cover;
        margin-right: 10px;
        margin-bottom: 10px;
        border: 1px solid #eee;
        padding: 0;
        box-sizing: border-box;
        width: 23%;
        box-shadow: 0 4px 4px 2px #fff;
        transition: all 0.2s ease-in;

        .template-cover {
          height: 150px;
          width: 100%;
          background-color: #ddd;
          box-sizing: border-box;
          padding: 0;
          border-bottom: 1px solid #eee;
        }

        &:hover {
          box-shadow: 0 4px 4px 2px #eee;
          border: 1px solid fade(@outline-color, 40%);
        }

        .template-info {
          padding: 10px;
          display: flex;
          position: relative;
          flex-direction: column;
          justify-content: flex-start;

          .template-name {
            font-weight: 500;
            font-size: 15px;
            z-index: 10;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            word-break: break-all;
          }
          .template-intro {
            z-index: 10;
            padding: 5px 0 0 0;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            word-break: break-all;
            color: rgba(0,0,0,.45);
            font-size: 12px;
          }

          .template-select-icon {
            z-index: 50;
            position: absolute;
            right: 5px;
            bottom: 5px;
            font-size: 10px;
            background-color: fade(@outline-color, 60%);
            padding: 2px 5px;
            color: #fff;
          }
        }
      }
    }
  }

  .template-action {
    padding: 10px 0;
    text-align: right;

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
  position: relative;
  .task-type {
    position: absolute;
    right: -100px;
    top: -5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    width: 90px;
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
  }
}

.task-audio-line {
  position: relative;
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
  margin-top: 20px;
  .button-item {
    margin-left: 10px;
  }
}

*::-webkit-scrollbar {
  width: 3px;
  height: 0;
}
*::-webkit-scrollbar-track {
  border-radius: 1px;
  background: rgba(0,0,0,0.00);
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.08);
}
/* 滚动条滑块 */
*::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: rgba(0,0,0,0.12);
  -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.2);
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
    margin-right: 10px;
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

.save-task {
  display: flex;
  margin-top: 20px;
  padding: 10px 0;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
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

.btn-text {
  font-family: Inter-Bold;
  line-height: 24px;
  padding-left: 5px;
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
  margin-bottom: 35px;
  width: 600px;
}

.self-type-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  .self-field-label {
    width: 100px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    .lesson-type-item {
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
  }

  .self-type-filter {
    width: 500px;
  }
}
</style>
