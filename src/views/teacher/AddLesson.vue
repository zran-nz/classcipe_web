<template>
  <a-card :bordered="false" :bodyStyle="{ padding: '16px 24px', height: '100%', minHeight: '500px' }">
    <a-row class="lesson-header">
      <a-col span="12">
        <a-space>
          <a-button class="nav-back-btn" type="link" @click="goBack"> <a-icon type="left" /> {{ $t('teacher.add-lesson.back') }}</a-button>
          <span class="unit-last-change-time" v-if="lastChangeSavedTime">
            <span class="unit-nav-title">
              {{ form.name }}
            </span>
            <a-divider type="vertical" v-if="!!form.name" />
            {{ $t('teacher.add-lesson.last-change-saved-at-time', {time: lastChangeSavedTime}) }}
          </span>
        </a-space>
      </a-col>
      <a-col span="12" class="unit-right-action">
        <a-space>
          <a-button @click="handleSaveLesson" :loading="lessonSaving"> <a-icon type="save" /> {{ $t('teacher.add-lesson.save') }}</a-button>
          <a-button type="primary" @click="handlePublishLesson" :loading="publishing"> <a-icon type="cloud-upload" /> {{ $t('teacher.add-lesson.publish') }}</a-button>
          <a-button @click="handleStartCollaborate"><a-icon type="share-alt" ></a-icon>Collaborate</a-button>
        </a-space>
      </a-col>
    </a-row>
    <a-row class="unit-content" v-if="!contentLoading">
      <a-col span="4">
        <div class="unit-menu-list">
          <div class="menu-category-item">
            <associate-sidebar :name="form.name" :type="contentType.lesson" :id="lessonId" ref="associate"/>
          </div>
          <div class="menu-category-item">
            <action-bar @create="selectAddContentTypeVisible = true" @link="selectLinkContentVisible = true"/>
          </div>
        </div>
      </a-col>
      <a-col span="16" offset="2" class="main-content">
        <a-card :bordered="false" :body-style="{padding: '16px'}">
          <a-form-model :model="form" class="my-form-wrapper">
            <div class="form-block">
              <div class="header-action">
                <div class="header-action-item">
                  <a-button @click="handleEditGoogleSlide" :style="{'display': 'flex', 'align-items': 'center', 'justify-content': 'center', 'padding': '20px 15px', 'border-radius': '5px'}" type="primary" >
                    <img src="~@/assets/icons/lesson/path.png" class="btn-icon"/>
                    <div class="btn-text">
                      Edit my lesson in google slide
                    </div>
                  </a-button>
                </div>
                <div class="header-action-item">
                  <a-button @click="handleStartSession" :style="{'display': 'flex', 'align-items': 'center', 'justify-content': 'center', 'padding': '20px 15px', 'border-radius': '5px'}" type="primary" >
                    <img src="~@/assets/icons/lesson/startLesson.png" class="btn-icon"/>
                    <div class="btn-text">
                      Start a session
                    </div>
                  </a-button>
                </div>
              </div>
            </div>
            <template v-if="mode === 'edit'">
              <div class="form-block">
                <a-input v-model="form.name" class="my-form-input" placeholder="Name"/>
              </div>

              <div class="form-block">
                <div class="self-type-wrapper">
                  <div class="self-field-label">
                    <div :class="{'lesson-type-item': true, 'green-active-task-type': form.lessonType === 'FA'}" @click="handleSelectLessonType('FA')">FA</div>
                    <div :class="{'lesson-type-item': true, 'red-active-task-type': form.lessonType === 'SA'}" @click="handleSelectLessonType('SA')">SA</div>
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

              <a-form-model-item class="task-audio-line">
                <a-textarea v-model="form.overview" allow-clear placeholder="Overview"/>
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

              <div class="form-block">
                <div class="content-blocks question-item" v-for="(questionItem, questionIndex) in questionDataObj" :key="questionIndex" v-if="questionItem !== null">
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
              </div>

              <div class="form-block">
                <custom-tag ref="customTag" :selected-tags-list="form.customTags" @change-user-tags="handleChangeUserTags"></custom-tag>
              </div>

              <div class="form-block" v-show="form.presentationId">
                <a-divider />
                <div class="label-line">
                  Pick slides to create a brilliant task and use it in your future lessons or share with global educators
                </div>
                <div class="preview-list" v-if="!thumbnailListLoading">
                  <div class="preview-item-cover" :style="{backgroundImage: 'url(' + item.contentUrl + ')'}" v-for="(item,index) in thumbnailList" :key="index" @click="handleToggleThumbnail(item)">
                    <div class="template-select-icon" v-if=" selectedPageIdList.indexOf(item.id) !== -1">
                      <a-icon type="check" />
                    </div>
                  </div>
                </div>
                <div class="thumbnail-loading" v-if="thumbnailListLoading">
                  <a-spin size="large" />
                </div>
                <div class="thumbnail-task-list">
                  <div class="thumbnail-task-item" v-if="selectedPageIdList.length > 0">
                    <task-form :task-prefix="'task_' + taskIndex + '_'" @finish-task="handleFinishTask" />
                  </div>
                  <a-divider />
                  <div class="task-preview-list">
                    <div class="task-preview" v-for="(task, index) in form.tasks" :key="index">
                      <task-preview :task-data="task" />
                      <div class="task-delete" @click="handleTaskDelete(task)">
                        <a-icon type="delete" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <template class="form-block" v-if="mode === 'create'">
              <div class="lesson-action-wrapper">
                <div class="action-item-line">
                  <img src="~@/assets/icons/lesson/Presentation-Collaboration@2x.png" alt="" class="action-img">
                  <div class="action-label">
                    <a-button shape="round" @click="handleShowSelectTemplate" class="action-item">
                      {{ $t('teacher.add-lesson.choose-my-content') }}
                    </a-button>
                  </div>
                </div>
                <div class="action-item-line">
                  <img src="~@/assets/icons/lesson/Teamwork-Video-Production@2x.png" alt="" class="action-img">
                  <div class="action-label">
                    <a-button shape="round" @click="handleShowSelectMyContent" :loading="creating" class="action-item">
                      Create
                    </a-button>
                  </div>
                </div>
              </div>
            </template>
          </a-form-model>
        </a-card>
      </a-col>
    </a-row>
    <collaborate-content ref="collaborate"/>
    <a-modal
      v-model="selectLinkContentVisible"
      :footer="null"
      destroyOnClose
      width="80%"
      title="Link in my content"
      @ok="selectLinkContentVisible = false"
      @cancel="selectLinkContentVisible = false">
      <div class="link-content-wrapper">
        <my-content-selector :filter-type-list="['unit-plan']" />
      </div>
    </a-modal>

    <a-modal
      v-model="viewInGoogleSlideVisible"
      :footer="null"
      destroyOnClose
      title="Create Success"
      @ok="viewInGoogleSlideVisible = false"
      @cancel="viewInGoogleSlideVisible = false">
      <div class="view-in-google-slider">
        <div class="view-line">
          <div class="link-url">
            <a :href="presentationLink" target="_blank">{{ presentationLink }}</a>
          </div>
          <div class="view-action">
            <a-button type="primary" @click="handleOpenGoogleSlide(presentationLink)">Edit In Google Slide</a-button>
          </div>
        </div>
      </div>
    </a-modal>

    <a-modal
      v-model="selectTemplateVisible"
      :footer="null"
      :title="null"
      :closable="false"
      destroyOnClose
      width="80%"
      @ok="selectTemplateVisible = false">
      <modal-header @close="selectTemplateVisible = false"/>

      <div class="select-template-wrapper">
        <div class="template-select-header">
          <div class="header-title">
            <div class="header-title-text">
              Teaching Templates
            </div>
          </div>
          <div class="filter-wrapper">
            <div class="first-filter-line">
              <div class="task-type">
                <div :class="{'task-type-item': true, 'green-active-task-type': currentFasa === 'FA'}" @click="handleToggleTemplateType('currentFasa','FA')">FA</div>
                <div :class="{'task-type-item': true, 'red-active-task-type': currentFasa === 'SA'}" @click="handleToggleTemplateType('currentFasa','SA')">SA</div>
              </div>
              <div class="template-type-list">
                <div v-for="(item, index) in initTemplates" :key="index" :class="{'template-type-item': true, 'active-template-type' : currentTemplateType === item.value}" @click="handleToggleTemplateType('currentTemplateType',item.value)">
                  {{ item.title }}
                  <img src="~@/assets/icons/lesson/active_green.png" v-if=" currentTemplateType === item.value"/>
                </div>
              </div>
            </div>
            <div class="second-filter-line">
              <div class="template-type-list">
                <div v-for="(item, index) in initBlooms" :key="index" :class="{'template-type-item': true, 'sub-active-template-type' : currentBloomCategory === item.value}" @click="handleToggleTemplateType('currentBloomCategory',item.value)">
                  {{ item.title }}
                  <img src="~@/assets/icons/lesson/active_red.png" v-if=" currentBloomCategory === item.value"/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="template-list-wrapper">
          <div class="template-list" v-if="!templateLoading">
            <div :class="{'template-item': true, 'template-item-active': template.id && selectedTemplateIdList.indexOf(template.id) !== -1 }" v-for="(template,index) in templateList" :key="index" @click="handleSelectTemplate(template)">
              <div class="template-cover" :style="{backgroundImage: 'url(' + template.cover + ')'}">
              </div>
              <div class="template-info">
                <div class="template-name">{{ template.name }}</div>
                <div class="template-intro">{{ template.introduce }}</div>
              </div>
              <div class="template-select-icon" v-if="template.id && selectedTemplateIdList.indexOf(template.id) !== -1">
                <img src="~@/assets/icons/lesson/selected.png" v-if="template.id && selectedTemplateIdList.indexOf(template.id) !== -1 "/>
              </div>
            </div>
          </div>
          <div class="no-template" v-if="!templateLoading && templateList.length === 0">
            <a-empty />
          </div>
          <div class="template-loading" v-if="templateLoading">
            <a-spin />
          </div>
        </div>
        <div class="template-action">
          <div class="create-loading" v-if="creating">
            <a-spin />
          </div>
          <a-button @click="handleAddTemplate" :style="{'display': 'flex', 'align-items': 'center', 'justify-content': 'center', 'padding': '10px'}" shape="round" type="primary" :loading="creating">
            <img src="~@/assets/icons/lesson/path.png" class="btn-icon"/>
            <div class="btn-text">
              Create the task in google slide
            </div>
          </a-button>
        </div>
      </div>
    </a-modal>

    <a-modal
      v-model="selectedMyContentVisible"
      :footer="null"
      :title="null"
      destroyOnClose
      width="80%"
      :closable="false"
      @ok="selectedMyContentVisible = false">
      <modal-header @close="selectedMyContentVisible = false"/>
      <div class="select-type-wrapper">
        <div class="select-type">
          <div class="select-tips">
            Choose lesson and tasks from
          </div>
          <div class="select-button">
            <a-button style="color: #fff;border-radius: 5px; padding: 15px;background: #15C39A; display: flex;flex-direction: row;align-items: center;justify-content: center" type="primary">
              <img src="~@/assets/icons/lesson/content_icon.png" />
              <div class="button-label">
                My content
              </div>
            </a-button>
          </div>
          <div class="select-tips">
            Of
          </div>
          <div class="select-button">
            <a-button @click="selectTemplateVisible = true" style="color: #fff;border-radius: 5px;background: #15C39A; display: flex;flex-direction: row;align-items: center;justify-content: center" type="primary">
              <img src="~@/assets/icons/lesson/template_icon.png" />
              <div class="button-label">
                Choose a template
              </div>
            </a-button>
          </div>
        </div>
      </div>
      <div class="link-content-wrapper">
        <my-content-selector
          :filter-type-list="['task', 'lesson']"
          :selected-list="selectedMyContentKeyList"
          mode="select"
        />
      </div>
      <div class="action-line">
        <a-button @click="handleCancelSelectedMyContent" class="button-item">Cancel</a-button>
        <a-button @click="handleConfirmSelectedMyContent" type="primary" class="button-item">Confirm</a-button>
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

    <a-modal
      v-model="showChoseSelectTemplateVisible"
      :footer="null"
      destroyOnClose
      title="Selected My Content"
      @ok="showChoseSelectTemplateVisible = false"
      @cancel="showChoseSelectTemplateVisible = false">
      <div class="selected-my-content">
        <div class="selected-item" v-for="(item,index) in selectedMyContentList" :key="index">
          <content-type-icon :type="item.type"/> {{ item.name }}
        </div>
      </div>
      <div class="more-action">
        <a-button key="back" @click="handleCreateLesson" :loading="creating" class="action-item">
          Create
        </a-button>
        <a-button key="submit" type="primary" @click="handleContinueSelectTemplate" class="action-item">
          Choose template
        </a-button>
      </div>
    </a-modal>

    <a-modal
      v-model="showCreateChoice"
      @ok="handleShowCreateChoice"
      @cancel="showCreateChoice = false"
      destroyOnClose>
      <div class="evaluation-modal">
        <div class="evaluation-header">
          <div class="my-modal-header">
            <div class="my-modal-icon">
              <img src="~@/assets/icons/evaluation/evaluation_icon.png" alt="rubric">
            </div>
            <div class="my-modal-title">
              Create Lesson
            </div>
          </div>
        </div>
        <div class="associate-evaluation">
          <div class="tips-area">
            <img src="@/assets/icons/evaluation/Collaboration-Develope-Website@2x.png" alt="">
          </div>
          <div class="tips">
            Create lesson by using my content or template ?
          </div>
        </div>
      </div>
    </a-modal>

    <a-skeleton :loading="contentLoading" active>
    </a-skeleton>
  </a-card>
</template>

<script>
import * as logger from '@/utils/logger'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import { typeMap } from '@/const/teacher'
import { UpdateContentStatus, GetMyGrades, Associate } from '@/api/teacher'
import InputSearch from '@/components/UnitPlan/InputSearch'
import SdgTagInput from '@/components/UnitPlan/SdgTagInput'
import SkillTag from '@/components/UnitPlan/SkillTag'
import { TemplatesGetTemplates, TemplatesGetPresentation, TemplatesGetPageThumbnail } from '@/api/template'
import { MyContentEventBus, MyContentEvent } from '@/components/MyContent/MyContentEventBus'
import { LessonCreateLessonPPT, LessonQueryById, LessonAddOrUpdate } from '@/api/myLesson'
import { UnitPlanQueryById } from '@/api/unitPlan'
import { formatLocalUTC } from '@/utils/util'
import { commonAPIUrl, GetDictItems } from '@/api/common'
import MyContentSelector from '@/components/MyContent/MyContentSelector'
import RelevantTagSelector from '@/components/UnitPlan/RelevantTagSelector'
import { TemplateTypeMap } from '@/const/template'
import TaskForm from '@/components/Task/TaskForm'
import TaskPreview from '@/components/Task/TaskPreview'
import Collaborate from '@/components/UnitPlan/Collaborate'
import AssociateSidebar from '@/components/Associate/AssociateSidebar'
import CustomTag from '@/components/UnitPlan/CustomTag'
import NewUiClickableKnowledgeTag from '@/components/UnitPlan/NewUiClickableKnowledgeTag'
import { lessonHost, lessonStatus } from '@/const/googleSlide'
import { StartLesson } from '@/api/lesson'
import ActionBar from '@/components/Associate/ActionBar'
import CollaborateContent from '@/components/Collaborate/CollaborateContent'
import { DICT_BLOOM_CATEGORY, DICT_TEMPLATE } from '@/const/common'
import { SubjectTree } from '@/api/subject'
import { formatSubjectTree } from '@/utils/bizUtil'
import ModalHeader from '@/components/Common/ModalHeader'

const TagOriginType = {
  Origin: 'Origin',
  Search: 'Search',
  Description: 'Description',
  Create: 'Create',
  Extension: 'Extension'
}

export default {
  name: 'AddLesson',
  components: {
    ModalHeader,
    ActionBar,
    TaskPreview,
    TaskForm,
    ContentTypeIcon,
    InputSearch,
    SdgTagInput,
    NewUiClickableKnowledgeTag,
    SkillTag,
    MyContentSelector,
    RelevantTagSelector,
    Collaborate,
    AssociateSidebar,
    CollaborateContent,
    CustomTag
  },
  props: {
    lessonId: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      mode: 'edit',
      contentLoading: true,
      referenceLoading: false,
      contentType: typeMap,
      templateTypeMap: TemplateTypeMap,

      creating: false,

      leftAddExpandStatus: false,
      selectLinkContentVisible: false,
      viewInGoogleSlideVisible: false,
      selectTemplateVisible: false,
      showAddAudioVisible: false,

      presentationLink: null,
      form: {
        id: null,
        image: '',
        presentationId: '',
        name: 'Untitled lesson',
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
        tasks: [],
        status: 0,
        lessonType: '',
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

      currentTemplateType: TemplateTypeMap['visible-thinking-tool'],
      currentBloomCategory: '',
      currentFasa: '',
      templateList: [],
      templateLoading: false,
      selectedTemplateList: [],

      // 待选择的unit plan中的描述标签
      relevantQuestionList: [],
      showRelevantQuestionVisible: false,
      relevantSelectedQuestionList: [],
      relevantSelectedUnitPlan: {},

      extKnowledgeTagList: [],
      extSkillTagList: [],

      subKnowledgeId2InfoMap: new Map(),
      descriptionId2InfoMap: new Map(),

      currentUploading: false,
      audioUrl: null,

      selectedTaskIdList: [],
      selectedLessonIdList: [],
      selectedMyContentVisible: false,
      selectedMyContentKeyList: [],
      selectedMyContentList: [],
      selectedMyContentInfoMap: new Map(),
      showChoseSelectTemplateVisible: false,

      showCreateChoice: false,

      pageObjectIds: [],
      thumbnailList: [],
      selectedPageIdList: [],

      thumbnailListLoading: false,

      taskIndex: 0,
      lessonSaving: false,
      publishing: false,
      initTemplates: [],
      initBlooms: [],
      uploading: false
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
  created () {
    logger.info('add lesson created ' + this.lessonId + ' ' + this.$route.path)
    this.mode = this.lessonId ? 'edit' : 'create'

    // 初始化关联事件处理
    MyContentEventBus.$on(MyContentEvent.LinkToMyContentItem, this.handleLinkMyContent)
    MyContentEventBus.$on(MyContentEvent.ToggleSelectContentItem, this.handleToggleSelectContentItem)
    this.initData()
  },
  mounted () {
    if (this.mode === 'create') {
      this.showCreateChoice = true
    }
  },
  beforeDestroy () {
    MyContentEventBus.$off(MyContentEvent.LinkToMyContentItem, this.handleLinkMyContent)
    MyContentEventBus.$off(MyContentEvent.ToggleSelectContentItem, this.handleToggleSelectContentItem)
  },
  methods: {
    initData () {
      logger.info('initData doing...')
      Promise.all([
        GetMyGrades(),
        TemplatesGetTemplates({ category: this.currentTemplateType }),
        SubjectTree({ curriculumId: this.$store.getters.bindCurriculum })
      ]).then((response) => {
        this.$logger.info('add lesson initData done', response)

        // GetMyGrades
        if (!response[0].code) {
          this.$logger.info('GetMyGrades', response[0].result)
          this.gradeList = response[0].result
        }

        if (!response[1].code) {
          this.$logger.info('template list', response[1].result)
          this.templateList = response[1].result
        }

        // SubjectTree
        if (!response[2].code) {
          logger.info('SubjectTree', response[2].result)
          let subjectTree = response[2].result
          subjectTree = formatSubjectTree(subjectTree)
          this.subjectTree = subjectTree
          logger.info('after format subjectTree', subjectTree)
        }
      }).then(() => {
        if (this.lessonId) {
          this.$logger.info('restore lesson data ' + this.lessonId)
          this.restoreLesson(this.lessonId, true)
        } else {
          this.contentLoading = false
        }
      }).catch((e) => {
        this.$logger.error(e)
        this.$message.error(this.$t('teacher.add-lesson.init-data-failed'))
      }).finally(() => {
        this.referenceLoading = false
      })

      GetDictItems(DICT_TEMPLATE).then(response => {
        if (response.success) {
          logger.info('DICT_TEMPLATE', response.result)
          this.initTemplates = response.result
        }
      })
      GetDictItems(DICT_BLOOM_CATEGORY).then(response => {
        if (response.success) {
          logger.info('DICT_BLOOM_CATEGORY', response.result)
          this.initBlooms = response.result
        }
      })
    },

    restoreLesson (lessonId, isFirstLoad) {
      if (isFirstLoad) {
        this.contentLoading = true
      }
      logger.info('restoreLesson ' + lessonId)
      LessonQueryById({
        id: lessonId
      }).then(response => {
        logger.info('LessonQueryById ' + lessonId, response.result)
        const lessonData = response.result

        const questionKeys = Object.keys(this.questionDataObj)
        questionKeys.forEach(questionKey => {
          logger.info('questionDataObj delete ' + questionKey)
          this.$delete(this.questionDataObj, questionKey)
        })
        if (lessonData.questions && lessonData.questions.length) {
          lessonData.questions.forEach(questionItem => {
            const question = {
              questionId: questionItem.id,
              visible: false,
              name: questionItem.name,
              knowledgeMainSubjectId: '',
              knowledgeSubSubjectId: '',
              knowledgeGradeId: '',
              knowledgeTags: questionItem.knowledgeTags,
              skillGradeId: '',
              skillTags: questionItem.skillTags,
              origin: 'question'
            }
            this.$set(this.questionDataObj, this.questionPrefix + this.questionMaxIndex, question)
            logger.info('restore default questionDataObj: ' + (this.questionPrefix + this.questionMaxIndex), question, ' questionDataObj ', this.questionDataObj)
            this.questionMaxIndex = this.questionMaxIndex + 1
            this.questionTotal = this.questionTotal + 1
          })
        }

        if (lessonData.suggestingTag && (lessonData.suggestingTag.knowledgeTags.length || lessonData.suggestingTag.skillTags.length)) {
          const question = {
            questionId: null,
            visible: false,
            name: null,
            knowledgeMainSubjectId: '',
            knowledgeSubSubjectId: '',
            knowledgeGradeId: '',
            knowledgeTags: lessonData.suggestingTag.knowledgeTags,
            skillGradeId: '',
            skillTags: lessonData.suggestingTag.skillTags,
            origin: 'suggesting'
          }
          this.$set(this.questionDataObj, this.questionPrefix + this.questionMaxIndex, question)
          logger.info('suggestingTag restore questionDataObj: ' + (this.questionPrefix + this.questionMaxIndex), question, ' questionDataObj ', this.questionDataObj)
          this.questionMaxIndex = this.questionMaxIndex + 1
          this.questionTotal = this.questionTotal + 1
        }

        if (this.questionMaxIndex === 0) {
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
          this.questionMaxIndex = this.questionMaxIndex + 1
          this.questionTotal = this.questionTotal + 1
        }

        this.form = lessonData
        this.form.bloomCategories = this.form.bloomCategories ? this.form.bloomCategories : undefined // 为了展示placeholder
        if (this.form.presentationId) {
          this.loadThumbnail()
        } else {
          // 未成功绑定ppt
          this.handleShowSelectMyContent()
        }
        logger.info('after restoreLesson', this.form, this.questionDataObj)
      }).finally(() => {
        this.contentLoading = false
      })
    },

    handleLinkMyContent (data) {
      this.$logger.info('handleLinkMyContent ', data)
      this.selectLinkContentVisible = false
      // link到unit plan必须全question
      this.loadRelevantTagInfo(data.item)
    },

    handleToggleSelectContentItem (data) {
      this.$logger.info('handleToggleSelectContentItem', data)
      const key = data.type + '-' + data.id
      const index = this.selectedMyContentKeyList.indexOf(key)
      if (index !== -1) {
        this.selectedMyContentKeyList.splice(index, 1)
      } else {
        this.selectedMyContentKeyList.push(key)
      }
      this.selectedMyContentInfoMap.set(key, data)
    },

    loadRelevantTagInfo (item) {
      this.$logger.info('loadRelevantTagInfo', item)
      this.showRelevantQuestionVisible = false
      this.relevantSelectedUnitPlan = item
      if (item.type === this.contentType['unit-plan']) {
        UnitPlanQueryById({ id: item.id }).then(response => {
          this.$logger.info('loadRelevantTagInfo UnitPlanQueryById ' + item.id, response)
          const unitPlanData = response.result
          const that = this.$router
          if (unitPlanData.questions.length === 0) {
            this.$confirm({
              title: item.name,
              content: 'Please add plan questions and tags before linking',
              onOk: function () {
                that.push({
                  path: '/teacher/unit-plan-redirect/' + item.id
                })
              }
            })
            return
          }
          if (unitPlanData.questions && unitPlanData.questions.length) {
            const questionList = unitPlanData.questions
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
        })
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

    handleSaveLesson () {
      logger.info('handleSaveLesson', this.form, this.questionDataObj)

      const lessonData = Object.assign({}, this.form)

      if (this.lessonId) {
        lessonData.id = this.lessonId
      }
      logger.info('basic lessonData', lessonData)

      const question = this.questionDataObj['__question_0']
      logger.info('question __question_0', question)
      if (question) {
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
        lessonData.suggestingTag = questionItem
      }
      logger.info('question lessonData', lessonData)
      this.lessonSaving = true
      LessonAddOrUpdate(lessonData).then((response) => {
        logger.info('LessonAddOrUpdate', response.result)
        if (response.success) {
          this.restoreLesson(response.result.id, false)
          // this.$message.success(this.$t('teacher.add-lesson.save-success'))
        } else {
          this.$message.error(response.message)
        }
      }).finally(() => {
        this.lessonSaving = false
      })
    },
    handlePublishLesson () {
      logger.info('handlePublishLesson', {
        id: this.lessonId,
        status: 1
      })

      this.publishing = true
      UpdateContentStatus({
        id: this.lessonId,
        status: 1,
        type: this.contentType.lesson
      }).then(response => {
        this.$logger.info('UpdateContentStatus response', response)
        // this.$message.success('Publish success')
        this.form.status = 1
      }).then(() => {
        this.$message.success(this.$t('teacher.add-lesson.publish-success'))
        this.form.status = 1
        this.publishing = false
      })
    },

    handleSelectLessonType (type) {
      this.$logger.info('handleSelectLessonType ' + type)
      this.form.lessonType = type
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

    handleToggleTemplateType (key, value) {
      this.$logger.info('handleToggleTemplateType ' + key + ' ' + value)
      this.templateLoading = true
      if (key === 'currentTemplateType') {
        if (this.currentTemplateType === value) {
          this.currentTemplateType = null
        } else {
          this.currentTemplateType = value
        }
      }
      if (key === 'currentBloomCategory') {
        if (this.currentBloomCategory === value) {
          this.currentBloomCategory = null
        } else {
          this.currentBloomCategory = value
        }
      }
      if (key === 'currentFasa') {
        if (this.currentFasa === value) {
          this.currentFasa = null
        } else {
          this.currentFasa = value
        }
      }
      this.selectedTemplateList = []
      TemplatesGetTemplates({ category: this.currentTemplateType, bloomCategories: this.currentBloomCategory, fasa: this.currentFasa }).then(response => {
        this.$logger.info('handleToggleTemplateType ', response)
        this.templateList = response.result
      }).finally(() => {
        this.templateLoading = false
      })
    },

    handleShowSelectTemplate () {
      this.selectedTemplateList = []
      this.templateLoading = false
      this.presentationLink = null
      this.selectTemplateVisible = true
    },

    handleShowSelectMyContent () {
      this.$logger.info('handleShowSelectMyContent')
      this.selectedTaskIdList = []
      this.selectedLessonIdList = []
      this.selectedMyContentVisible = true
    },

    handleSelectTemplate (template) {
      this.$logger.info('handleSelectTemplate ', template)
      const index = this.selectedTemplateList.findIndex(item => item.id === template.id)
      if (index !== -1) {
        this.selectedTemplateList.splice(index, 1)
      } else {
        this.selectedTemplateList.push(template)
      }
    },

    handleAddTemplate () {
      this.$logger.info('handleAddTemplate ', this.selectedTemplateList)
      if (!this.creating) {
        if (this.selectedTemplateList.length) {
          this.creating = true
          LessonCreateLessonPPT({
            lessonId: this.lessonId ? this.lessonId : '',
            name: this.form.name,
            overview: this.form.overview,
            templatePresentationIds: this.selectedTemplateList.map(item => {
              return item.presentationId
            }),
            lessonIds: this.selectedLessonIdList,
            taskIds: this.selectedTaskIdList
          }).then(response => {
            this.$logger.info('handleAddTemplate response', response.result)
            this.form.id = response.result.id
            this.form.presentationId = response.result.presentationId
            this.presentationLink = response.result.presentationLink
            this.selectTemplateVisible = false
            this.mode = 'edit'
            this.viewInGoogleSlideVisible = true
            this.$router.replace({
              path: '/teacher/add-lesson/' + response.result.id
            })
          }).finally(() => {
            this.templateLoading = false
            this.creating = false
            this.loadThumbnail()
          })
        } else {
          this.$message.warn('Please select template!')
        }
      } else {
        this.$logger.info('creating wait...')
      }
    },

    handleOpenGoogleSlide (slideUrl) {
      this.$logger.info('handleOpenGoogleSlide ' + slideUrl)
      // window.open(slideUrl, '_blank')
      window.location.href = slideUrl
    },

    handleViewDetail (item) {
      this.$logger.info('handleViewDetail ', item)
      if (item.type === this.contentType['unit-plan']) {
        this.$router.push({
          path: '/teacher/unit-plan-redirect/' + item.id
        })
      }
    },

    handleUpdateSelected (data) {
      this.$logger.info('handleUpdateSelected', data)
      this.relevantSelectedQuestionList = data.questionList
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
        fromType: this.contentType.lesson,
        toId: this.relevantSelectedUnitPlan.id,
        toType: this.relevantSelectedUnitPlan.type,
        questions: this.relevantSelectedQuestionList
      }).then(response => {
        this.$logger.info('handleLinkMyContent response ', response)
        this.$refs.associate.loadAssociateData()
      })
    },

    handleCancelSelectedMyContent () {
      this.selectedMyContentVisible = false
      this.selectedTaskIdList = []
      this.selectedLessonIdList = []
      this.selectedMyContentList = []
    },

    handleConfirmSelectedMyContent () {
      this.$logger.info('handleConfirmSelectedMyContent', this.selectedMyContentKeyList)
      this.selectedMyContentVisible = false
      this.selectedTaskIdList = []
      this.selectedLessonIdList = []
      this.selectedMyContentList = []
      this.selectedMyContentKeyList.forEach(key => {
        if (this.selectedMyContentInfoMap.has(key)) {
          this.selectedMyContentList.push(this.selectedMyContentInfoMap.get(key))
        }

        const keyArr = key.split('-')
        if (parseInt(keyArr[0]) === this.contentType.task) {
          this.selectedTaskIdList.push(keyArr[1])
        }
        if (parseInt(keyArr[0]) === this.contentType.lesson) {
          this.selectedLessonIdList.push(keyArr[1])
        }
      })
      this.showChoseSelectTemplateVisible = true
    },

    handleCreateLesson () {
      this.$logger.info('handleCreateLesson')
      if (!this.creating) {
        this.creating = true
        LessonCreateLessonPPT({
          lessonId: this.lessonId ? this.lessonId : '',
          lessonIds: this.selectedLessonIdList,
          taskIds: this.selectedTaskIdList,
          name: this.form.name,
          overview: this.form.overview
        }).then(response => {
          this.$logger.info('handleCreateLesson', response.result)
          this.showChoseSelectTemplateVisible = false
          this.selectedMyContentVisible = false
          this.form.id = response.result.id
          this.form.presentationId = response.result.presentationId
          this.presentationLink = response.result.presentationLink
          this.selectTemplateVisible = false
          this.mode = 'edit'
          this.viewInGoogleSlideVisible = true
          this.$router.replace({
            path: '/teacher/lesson-redirect/' + response.result.id
          })
        }).finally(() => {
          this.creating = false
          this.loadThumbnail()
        })
      }
    },

    loadThumbnail () {
      this.thumbnailListLoading = true
      this.$logger.info('loadThumbnail ' + this.form.presentationId)
      TemplatesGetPresentation({
        presentationId: this.form.presentationId
      }).then(response => {
        this.$logger.info('loadThumbnail response', response.result)
        this.pageObjectIds = response.result.pageObjectIds
        this.thumbnailList = []
        this.pageObjectIds.forEach(id => {
          TemplatesGetPageThumbnail({
            pageObjectId: id,
            presentationId: this.form.presentationId,
            mimeType: 'SMALL'
          }).then(response => {
            this.$logger.info('contentUrl ' + response.result.contentUrl)
            this.thumbnailList.push({ contentUrl: response.result.contentUrl, id: id })
          }).finally(() => {
            this.$logger.info('current thumbnailList ', this.thumbnailList)
            if (this.thumbnailList.length === this.pageObjectIds.length) {
              this.thumbnailListLoading = false
            }
          })
        })
      })
    },

    handleToggleThumbnail (thumbnail) {
      this.$logger.info('handleToggleThumbnail', thumbnail)
      const index = this.selectedPageIdList.indexOf(thumbnail.id)
      if (index !== -1) {
        this.selectedPageIdList.splice(index, 1)
      } else {
        this.selectedPageIdList.push(thumbnail.id)
      }
    },

    handleContinueSelectTemplate () {
      this.showChoseSelectTemplateVisible = false
      this.selectTemplateVisible = true
    },

    handleShowCreateChoice () {
      this.showCreateChoice = false
      this.selectedMyContentVisible = true
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

    handleAddAnotherTask () {
      this.$logger.info('handleAddAnotherTask')
    },

    handleFinishTask (data) {
      this.$logger.info('handleFinishTask', data)
      const task = Object.assign({
        presentationId: this.form.presentationId,
        selectPageObjectIds: this.selectedPageIdList,
        lessonId: this.form.id
      }, data)
      this.$logger.info('new task', task)
      this.form.tasks.push(task)
      this.selectedPageIdList = []
      this.taskIndex++
      this.$logger.info('after add tasks ', this.form.tasks)
    },

    handleTaskDelete (task) {
      this.$logger.info('handleTaskDelete', task)
      const index = this.form.tasks.findIndex(item => item.__taskId === task.__taskId)
      if (index !== -1) {
        this.form.tasks.splice(index, 1)
      }
    },
    handleChangeUserTags (tags) {
      this.form.customTags = tags
    },
    handleStartSession () {
      this.$logger.info('handleStartSession', this.form)
      if (this.form.presentationId) {
        const requestData = {
          author: this.$store.getters.email,
          slide_id: this.form.presentationId,
          file_name: this.form.name,
          status: lessonStatus.studentPaced,
          redirect_url: null
        }

        this.$logger.info('handleStartSession', requestData)
        StartLesson(requestData).then(res => {
          this.$logger.info('StartLesson res', res)
          if (res.code === 'ok') {
            // const targetUrl = lessonHost + 'slide_id=' + this.form.presentationId + '&class_id=' + res.data.class_id + '&type=classroom'
            const targetUrl = lessonHost + 't/' + res.data.class_id
            this.$logger.info('try open ' + targetUrl)
            window.open(targetUrl, '_blank')
          } else {
            this.$message.warn('StartLesson Failed! ' + res.message)
          }
        })
      } else {
        this.$message.warn('This record is not bound to PPT!')
      }
    },
    handleStartCollaborate () {
      this.$logger.info('handleStartCollaborate')
      this.$refs.collaborate.startCollaborateModal(Object.assign({}, this.form), this.form.id, this.contentType.lesson)
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

    handleEditGoogleSlide () {
      this.$logger.info('handleEditGoogleSlide', this.form.presentationId)
      if (this.form.presentationId) {
        window.open('https://docs.google.com/presentation/d/' + this.form.presentationId)
      } else {
        this.$message.warn('please create slide first!')
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.lesson-header {
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
    .anticon-more{
      color: #15c39a;
      font-size: 18px;
    }
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

      .action-item {
        color: @primary-color;
        padding: 5px 0;
        text-decoration: underline;
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

    .content-blocks {
      width: 600px;
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

  .template-select-header {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid #ddd;
    opacity: 1;
    border-radius: 4px;
    padding: 10px ;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .header-title {
      padding: 15px 0 25px;
      .header-title-text {
        font-size: 30px;
        font-family: Inter-Bold;
        line-height: 24px;
        color: #182552;
        opacity: 1;
      }
    }

    .filter-wrapper {
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      .first-filter-line {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: flex-start;
        position: relative;
        margin-bottom: 10px;
        .task-type {
          width: 100px;
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

      .second-filter-line {
        padding-left: 93px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        position: relative;
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
          right: 5px;
          top: 5px;
          img {
            height: 18px;
          }
        }

        .template-cover {
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
            color: rgba(0,0,0,.45);
            font-size: 12px;
            background: rgba(244, 244, 244, 0.5);
            border-radius: 4px;
            font-family: Inter-Bold;
            color: #000000;
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
    flex-direction: row;
    align-items: center;
    justify-content: center;

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

.lesson-type-line {
  margin-bottom: 20px;
  .lesson-type {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 5px 20%;
    .lesson-type-item {
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

    .active-lesson-type {
      background-color: fade(#FF3355, 10%);
      color: #FF3355;
      border-radius: 50%;
      font-weight: 500;
      border-color:#FF3355
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
  margin-top: 20px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
  .preview-item-cover {
    background-position: center center;
    background-size: contain;
    background-repeat: no-repeat;
    position: relative;
    width: 180px;
    height: 150px;
    margin: 0 15px 15px 0 ;
    border: 1px solid #eee;
    box-shadow: 0 4px 4px 4px #eee;
    &:hover {
      box-shadow: 0 4px 4px 2px #bbb;
      border: 1px solid fade(@outline-color, 40%);
    }

    .template-select-icon {
      z-index: 50;
      position: absolute;
      right: 5px;
      bottom: 5px;
      font-size: 10px;
      background-color: fade(@outline-color, 100%);
      padding: 2px 5px;
      color: #fff;
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
  display: flex;
  flex-direction: column;
  .task-preview-list {
    position: relative;
    .task-delete {
      position: absolute;
      right: -30px;
      top: 30%;
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

.lesson-action-wrapper {
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
  height: 20px;
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
</style>
