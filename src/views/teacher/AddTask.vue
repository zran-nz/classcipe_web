<template>
  <div class="my-full-form-wrapper">
    <div class="form-header">
      <common-form-header
        ref="commonFormHeader"
        :form="form"
        :last-change-saved-time="lastChangeSavedTime"
        @back="goBack"
        @save="handleSaveTask"
        @publish="handlePublishTask"
        @collaborate="handleStartCollaborate"
      />
    </div>
    <a-card :bordered="false" :bodyStyle="{ padding: '16px 24px', height: '100%', minHeight: '800px' }">
      <template v-if="mode === 'edit'">
        <a-row class="unit-content" v-if="!contentLoading" >
          <a-col span="24" class="main-content">
            <a-card :bordered="false" :body-style="{padding: '16px', display: 'flex', 'justify-content': 'center'}" class="card-wrapper">
              <div class="task-form-left root-locate-form" ref="form" @click="focusInput($event)">
                <a-form-model :model="form" class="my-form-wrapper" >
                  <a-steps :current="currentActiveStepIndex" direction="vertical" @change="onChangeStep">
                    <a-step title="Edit course info" :status="currentActiveStepIndex === 0 ? 'process':'wait'">
                      <template v-if="currentActiveStepIndex === 0" slot="description">
                        <div class="form-block" >
                          <div class="header-action">
                            <div class="header-action-item">
                              <a-button @click="handleEditGoogleSlide" :style="{'display': 'flex', 'align-items': 'center', 'justify-content': 'center', 'padding': '20px 15px', 'border-radius': '5px'}" type="primary" >
                                <img src="~@/assets/icons/task/path.png" class="btn-icon"/>
                                <div class="btn-text">
                                  Edit my task in google slide
                                </div>
                              </a-button>
                            </div>
                            <div class="header-action-item">
                              <a-button @click="handleStartSessionTags" :style="{'display': 'flex', 'align-items': 'center', 'justify-content': 'center', 'padding': '20px 15px', 'border-radius': '5px'}" type="primary" >
                                <img src="~@/assets/icons/task/startTask.png" class="btn-icon"/>
                                <div class="btn-text">
                                  Start a session
                                </div>
                              </a-button>
                            </div>

                            <div class="header-action-item">
                              <a-button @click="handleStartSession('dash')" :style="{'display': 'flex', 'align-items': 'center', 'justify-content': 'center', 'padding': '20px 15px', 'border-radius': '5px'}" type="primary" >
                                <img src="~@/assets/icons/task/startTask.png" class="btn-icon"/>
                                <div class="btn-text">
                                  Start a dash
                                </div>
                              </a-button>
                            </div>
                          </div>
                        </div>

                        <div class="form-block" >
                          <a-form-item label="Task name" ref="name">
                            <a-input v-model="form.name" placeholder="Enter Course Name" class="my-form-input"/>
                          </a-form-item>
                        </div>

                        <div class="form-block over-form-block" id="overview" >
                          <a-form-model-item class="task-audio-line" label="Course Overview" ref="overview">
                            <a-textarea v-model="form.overview" placeholder="Overview" allow-clear />
                          </a-form-model-item>
                        </div>

                        <div class="form-block taskType" >
                          <a-form-model-item class="task-audio-line" label="Choose type" ref="taskType">
                            <div class="self-type-wrapper" >
                              <div class="self-field-label" >
                                <div :class="{'task-type-item': true, 'green-active-task-type': form.taskType === 'FA'}" @click.stop.prevent="handleSelectTaskType('FA')">FA</div>
                                <div :class="{'task-type-item': true, 'red-active-task-type': form.taskType === 'SA'}" @click.stop.prevent="handleSelectTaskType('SA')">SA</div>
                              </div>
                            </div>
                          </a-form-model-item>
                        </div>

                        <div class="form-block form-question" v-if="associateQuestionList.length > 0">
                          <a-form-model-item label="Choose Key questions">
                            <a-select
                              size="large"
                              class="my-big-select"
                              v-model="form.questionIds"
                              mode="multiple"
                              placeholder="Choose Key questions"
                              option-label-prop="label"
                            >
                              <a-select-option v-for="(item,index) in associateQuestionList" :value="item.id" :label="item.name" :key="index">
                                <span class="question-options">
                                  {{ item.name }}
                                </span>
                                From Unit Plan({{ item.unitName }})
                              </a-select-option>
                            </a-select>
                          </a-form-model-item>
                        </div>

                        <div class="form-block" >
                          <a-form-item label="Set assessment objectives" >
                            <a-button type="primary" @click="handleSelectDescription">
                              <div class="btn-text" style="line-height: 20px">
                                Add assessment objectives
                              </div>
                            </a-button>
                          </a-form-item>

                          <!--knowledge tag-select -->
                          <ui-learn-out ref="learnOut" :learn-outs="form.learnOuts" @remove-learn-outs="handleRemoveLearnOuts" />
                        </div>
                      </template>
                    </a-step>

                    <a-step title="Edit your course slides" :status="currentActiveStepIndex === 1 ? 'process':'wait'">
                      <template v-if="currentActiveStepIndex === 1" slot="description">
                        <a-skeleton :loading="skeletonLoading" active>
                          <div class="slide-select-wrapper" ref="slide">
                            <div class="slide-select">
                              <div class="slide-select-and-preview">
                                <!--                            <div class="reset-edit-basic-info" >Edit course info</div>-->
                                <div class="slide-select-action" v-show="!form.presentationId">
                                  <img src="~@/assets/icons/task/Teamwork-Pie-Chart@2x.png" />
                                  <div class="select-action">
                                    <div class="modal-ensure-action-line">
                                      <a-button class="action-item action-cancel" shape="round" @click="handleShowSelectMyContent">Select template</a-button>
                                      <a-button class="action-ensure action-item" type="primary" shape="round" @click="handleCreateInGoogle">Create a new ppt in Google side</a-button>
                                    </div>
                                  </div>
                                </div>
                                <div class="slide-preview" v-show="form.presentationId && thumbnailList.length">
                                  <a-carousel arrows dots-class="slick-dots slick-thumb">
                                    <a slot="customPaging" slot-scope="props">
                                      <img :src="thumbnailList[props.i].contentUrl" />
                                    </a>
                                    <div v-for="(item,index) in thumbnailList" :key="index">
                                      <img :src="item.contentUrl" />
                                    </div>
                                  </a-carousel>
                                </div>
                              </div>
                            </div>
                          </div>
                        </a-skeleton>
                      </template>
                    </a-step>

                    <a-step title="Link Task content" :status="currentActiveStepIndex === 2 ? 'process':'wait'">
                      <template v-if="currentActiveStepIndex === 2" slot="description">
                        <div class="form-block">
                          <a-form-item label="Link Task content" class="link-plan-title">
                            <a-button type="primary" :style="{'background-color': '#fff', 'color': '#000', 'border': '1px solid #D8D8D8'}" @click="handleAddLink">
                              <div class="btn-text" style="line-height: 20px">
                                + Link
                              </div>
                            </a-button>
                          </a-form-item>
                          <div class="common-link-wrapper">
                            <common-link ref="commonLink" :from-id="this.taskId" :from-type="this.contentType.task"/>
                          </div>
                        </div>
                      </template>
                    </a-step>

                  </a-steps>

                </a-form-model>
              </div>

              <div class="task-form-right">

                <div class="form-block-right" v-show="currentActiveStepIndex !== 1 && !showCustomTag" >
                  <!-- image-->
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
                </div>
                <div class="recomend-loading" v-if="recomendListLoading">
                  <a-spin size="large" />
                </div>
                <div class="form-block-right" v-show="!form.presentationId && currentActiveStepIndex === 1" v-if="!recomendListLoading">
                  <div class="right-title">Teaching Tips</div>
                  <div class="slide-preview-list">
                    <div class="slide-preview-item" v-for="(template, rIndex) in recommendTemplateList" :key="rIndex">
                      <div class="mask-cover">
                        <div class="mask-actions">
                          <div class="action-item action-item-center">
                            <!--                            <div class="session-btn session-btn-left">-->
                            <!--                              <div class="session-btn-text">Preview</div>-->
                            <!--                            </div>-->
                            <div class="session-btn session-btn-right" v-if="!addRecomendLoading">
                              <div class="session-btn-text" @click="selectRecommendTemplate(template)">Add as slide</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <a-carousel arrows>
                        <div
                          slot="prevArrow"
                          class="custom-slick-arrow"
                          style="left: 10px;zIndex: 1"
                        >
                          <a-icon type="left-circle" />
                        </div>
                        <div slot="nextArrow" class="custom-slick-arrow" style="right: 10px">
                          <a-icon type="right-circle" />
                        </div>
                        <div v-for="(item,index) in template.images" :key="index">
                          <img :src="item" />
                        </div>
                      </a-carousel>
                      <a-row v-if="template.introduce" class="slide-desc" :title="template.introduce">
                        {{ template.introduce }}
                      </a-row>
                    </div>
                  </div>
                </div>
                <div v-if="!this.contentLoading && this.currentActiveStepIndex === 0" :style="{'width':'600px','position': 'absolute', 'top':customTagTop+'px'}">
                  <custom-tag
                    :show-arrow="showCustomTag"
                    :user-tags="userTags"
                    :custom-tags-list="customTagList"
                    ref="customTag"
                    :selected-tags-list="form.customTags"
                    @reload-user-tags="loadUserTags"
                    @change-add-keywords="handleChangeAddKeywords"
                    @change-user-tags="handleChangeUserTags"></custom-tag>
                </div>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </template>
      <template v-if="mode === 'pick-task-slide'">

        <div class="pick-task-slide-wrapper">
          <div class="slide-form-block" v-show="form.presentationId">
            <div class="preview-list" v-if="!thumbnailListLoading">
              <div :class="{'preview-item-cover': true, 'preview-item-cover-active': selectedPageIdList.indexOf(item.id) !== -1}" :style="{backgroundImage: 'url(' + item.contentUrl + ')'}" v-for="(item,index) in thumbnailList" :key="index" @click="handleToggleThumbnail(item)">
                <div class="template-select-icon" v-if="selectedPageIdList.indexOf(item.id) !== -1">
                  <img src="~@/assets/icons/task/selected.png"/>
                </div>
              </div>
            </div>
            <div class="thumbnail-loading" v-if="thumbnailListLoading">
              <a-spin size="large" />
            </div>
            <div class="thumbnail-task-list">
              <div class="thumbnail-task-item" v-if="selectedPageIdList.length > 0">
                <task-form :select-ids="selectedPageIdList" :task-id="taskId" :task-prefix="'task_' + taskIndex + '_'" @finish-task="handleFinishTask" />
              </div>
              <div class="task-preview-list">
                <div class="task-preview" v-for="(task, index) in subTasks" :key="index">
                  <task-preview :task-id="task.id" />
                  <!--                  <div class="task-delete" @click="handleTaskDelete(task)">-->
                  <!--                    <a-icon type="delete" />-->
                  <!--                  </div>-->
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <collaborate-content ref="collaborate"/>
      <a-modal
        v-model="selectAddContentTypeVisible"
        :footer="null"
        destroyOnClose
        title="Select Content Type"
        @ok="selectAddContentTypeVisible = false"
        @cancel="selectAddContentTypeVisible = false">
        <div class="add-content-wrapper">
          <div class="add-content-item" @click="handleAddTaskEvaluation">
            <a >
              <content-type-icon :type="contentType.evaluation"/>
              {{ $t('teacher.add-unit-plan.evaluation') }}
            </a>
          </div>
          <div class="add-loading" v-if="addLoading">
            <a-spin />
          </div>
        </div>
      </a-modal>
      <a-modal
        v-model="selectLinkContentVisible"
        :footer="null"
        destroyOnClose
        width="800px">
        <div class="my-modal-title" slot="title">
          Link my content
        </div>
        <div class="link-content-wrapper">
          <new-my-content
            :from-type="contentType.task"
            :from-id="taskId"
            :filter-type-list="[contentType.evaluation]"
            :group-name-list="groupNameList"
            :default-group-name="'Untitled Term' + groupNameList.length + 1"
            :mode="'common-link'"
            @cancel="selectLinkContentVisible = false"
            @ensure="handleEnsureSelectedLink"/>
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
        v-model="selectedMyContentVisible"
        :footer="null"
        :title="null"
        destroyOnClose
        width="80%"
        :closable="true"
        @ok="selectedMyContentVisible = false">
        <a-tabs class="template-tabs">
          <a-tab-pane key="1" tab="Teaching Templates">
            <div class="select-template-wrapper">
              <div class="template-select-header">
                <div class="filter-row">
                  <div class="ant-form-item-label">Learning Experience:</div>
                  <div class="row-select">
                    <a-cascader
                      class="row-cascader"
                      :fieldNames="{ label: 'name', value: 'id', children: 'children' }"
                      v-model="filterLearn"
                      :options="learnExperienceList"
                      :show-search="{ filterSearch }"
                      change-on-select
                      @change="selectFilter"/>
                  </div>
                </div>
                <div class="filter-row">
                  <div class="ant-form-item-label">Assessment:</div>
                  <div class="row-select">
                    <a-cascader
                      class="row-cascader"
                      :fieldNames="{ label: 'name', value: 'id', children: 'children' }"
                      v-model="filterAssessments"
                      :options="assessmentsList"
                      :show-search="{ filterSearch }"
                      change-on-select
                      @change="selectFilter"/>
                  </div>
                </div>
                <div class="filter-row">
                  <div class="ant-form-item-label">21 century skills:</div>
                  <div class="row-select">
                    <a-cascader
                      class="row-cascader"
                      :fieldNames="{ label: 'name', value: 'id', children: 'children' }"
                      v-model="filterCentury"
                      :options="centuryList"
                      :show-search="{ filterSearch }"
                      change-on-select
                      @change="selectFilter" />
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
                      <img src="~@/assets/icons/task/selected.png" v-if="template.id && selectedTemplateIdList.indexOf(template.id) !== -1 "/>
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
                  <img src="~@/assets/icons/task/path.png" class="btn-icon"/>
                  <div class="btn-text">
                    Create the task in google slide
                  </div>
                </a-button>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="My content">
            <div class="link-content-wrapper">
              <my-content-selector
                :current-id="taskId"
                :filter-type-list="['task']"
                :selected-list="selectedMyContentKeyList"
                mode="select"
              />
            </div>
            <div class="action-line">
              <!--              <a-button @click="handleCancelSelectedMyContent" class="button-item">Cancel</a-button>-->
              <a-button @click="handleConfirmSelectedMyContent" type="primary" class="button-item" :loading="creating">Confirm</a-button>
            </div>
          </a-tab-pane>
        </a-tabs>
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
                Create Task
              </div>
            </div>
          </div>
          <div class="associate-evaluation">
            <div class="tips-area">
              <img src="@/assets/icons/evaluation/Collaboration-Develope-Website@2x.png" alt="">
            </div>
            <div class="tips">
              Create task by using my content or template ?
            </div>
          </div>
        </div>
      </a-modal>

      <a-modal
        class="my-slide-pick-modal"
        v-model="selectedSlideVisible"
        :footer="null"
        :title="null"
        destroyOnClose
        width="700px"
        :closable="false">
        <div class="select-slide-wrapper">
          <modal-header @close="selectedSlideVisible = false" :white="true"/>
          <div class="modal-title">
            Great news!
          </div>
          <div class="main-tips">
            <div class="left-img">
              <img src="~@/assets/icons/task/woniu.png" />
            </div>
            <div class="right-img-text">
              <img src="~@/assets/icons/task/quote.png" />
              <div class="img-text">
                Pick slides to create a brilliant task and use it in your future tasks or share with global educators
              </div>
            </div>
          </div>
        </div>
        <div class="slide-action row-flex-center">
          <div class="slide-btn-wrapper">
            <a-button @click="handleCancelPickTaskSlide" style="background: #D7D9D9;border: 1px solid #D7D9D9;border-radius: 25px;color: #000;" class="slide-btn-item slide-btn-item-no " type="primary">
              Not this time
            </a-button>
            <a-button @click="handleAddTaskWithSlide" style="background: #15C39A;;border: 1px solid #15C39A;border-radius: 25px;color: #fff;" class="slide-btn-item slide-btn-item-yes" type="primary">
              Pick now
            </a-button>
          </div>
        </div>
      </a-modal>

      <a-modal
        title="Add session tags"
        v-model="taskSelectTagVisible"
        :maskClosable="false"
        :closable="true"
        destroyOnClose
        width="800px">
        <div>
          <custom-tag :custom-tags-list="['ATL','Inquiry stage']" :selected-tags-list="sessionTags" @change-user-tags="handleSelectedSessionTags" />
        </div>
        <template slot="footer">
          <a-button key="back" @click="taskSelectTagVisible=false">
            Cancel
          </a-button>
          <a-button key="submit" type="primary" :loading="startLoading" @click="handleStartSession()">
            Start
          </a-button>
        </template>
      </a-modal>

      <a-modal
        v-model="selectSyncDataVisible"
        :footer="null"
        destroyOnClose
        width="80%"
        :title="null"
        @ok="selectSyncDataVisible = false"
        @cancel="selectSyncDataVisible = false">
        <div class="link-content-wrapper">
          <!-- 此处的questionIndex用于标识区分是哪个组件调用的，返回的事件数据中会带上，方便业务数据处理，可随意写，可忽略-->
          <new-browser
            :select-mode="selectModel.syncData"
            question-index="_questionIndex_1"
            :sync-data="syncData"
            @select-sync="handleSelectListData"
            @select-curriculum="handleSelectCurriculum"/>
          <div class="modal-ensure-action-line-right">
            <a-button class="action-item action-cancel" shape="round" @click="handleCancelSelectData">Cancel</a-button>
            <a-button class="action-ensure action-item" type="primary" shape="round" @click="handleEnsureSelectData">Ok</a-button>
          </div>
        </div>
      </a-modal>

      <a-skeleton :loading="contentLoading" active>
      </a-skeleton>
    </a-card>
  </div>
</template>

<script>
  import * as logger from '@/utils/logger'
  import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
  import { typeMap } from '@/const/teacher'
  import { UpdateContentStatus, GetMyGrades, Associate, SaveSessonTags, GetAssociate, GetReferOutcomes } from '@/api/teacher'
  import InputSearch from '@/components/UnitPlan/InputSearch'
  import SdgTagInput from '@/components/UnitPlan/SdgTagInput'
  import SkillTag from '@/components/UnitPlan/SkillTag'
  import { FilterTemplates, TemplatesGetPresentation, recommendTemplates } from '@/api/template'
  import { MyContentEventBus, MyContentEvent } from '@/components/MyContent/MyContentEventBus'
  import { TaskCreateTaskPPT, TaskQueryById, TaskAddOrUpdate } from '@/api/task'
  import { SelectModel } from '@/components/NewLibrary/SelectModel'
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
  import CollaborateContent from '@/components/Collaborate/CollaborateContent'
  import { CustomTagType, DICT_BLOOM_CATEGORY, DICT_TEMPLATE } from '@/const/common'
  import { SubjectTree } from '@/api/subject'
  import { formatSubjectTree } from '@/utils/bizUtil'
  import ModalHeader from '@/components/Common/ModalHeader'
  import CommonFormHeader from '@/components/Common/CommonFormHeader'
  import { EvaluationAddOrUpdate } from '@/api/evaluation'
  import CommonLink from '@/components/Common/CommonLink'
  import UiLearnOut from '@/components/UnitPlan/UiLearnOut'
  import { LibraryEvent, LibraryEventBus } from '@/components/NewLibrary/LibraryEventBus'
  import NewBrowser from '@/components/NewLibrary/NewBrowser'
  import NewMyContent from '@/components/MyContent/NewMyContent'
  import { FindCustomTags, GetTreeByKey } from '@/api/tag'

  export default {
    name: 'AddTask',
    components: {
      CommonFormHeader,
      NewBrowser,
      NewMyContent,
      UiLearnOut,
      CommonLink,
      ModalHeader,
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
      taskId: {
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
          name: 'Untitled Task',
          overview: '',
          tasks: [],
          status: 0,
          taskType: '',
          createTime: '',
          updateTime: '',
          customTags: [],
          subjectIds: [],
          gradeIds: [],
          bloomCategories: '',
          learnOuts: []
        },
        // Grades
        gradeList: [],
        // SubjectTree
        subjectTree: [],

        currentTemplateType: TemplateTypeMap['visible-thinking-tool'],
        currentBloomCategory: '',
        currentFasa: '',
        templateList: [],
        templateLoading: false,
        selectedTemplateList: [],
        currentUploading: false,
        audioUrl: null,

        selectedTaskIdList: [],
        selectedMyContentVisible: false,
        selectedMyContentKeyList: [],
        selectedMyContentList: [],
        selectedMyContentInfoMap: new Map(),
        showChoseSelectTemplateVisible: false,

        showCreateChoice: false,

        pageObjectIds: [],
        thumbnailList: [],
        selectedPageIdList: [],
        subTasks: [],

        thumbnailListLoading: false,

        taskIndex: 0,
        taskSaving: false,
        publishing: false,
        initTemplates: [],
        initBlooms: [],
        uploading: false,
        selectedSlideVisible: false,
        taskSelectTagVisible: false,
        sessionTags: [],
        startLoading: false,
        addLoading: false,
        selectAddContentTypeVisible: false,
        // 当前激活的step
        currentActiveStepIndex: 0,

        groupNameList: [],
        groupNameListOther: [],
        syncData: [],
        selectSyncDataVisible: false,
        selectedSyncList: [],
        // 已选择的大纲知识点描述数据
        selectedCurriculumList: [],
        // specific skill
        selectedSpecificSkillList: [],
        // century skill
        selectedCenturySkillList: [],
        selectModel: SelectModel,

        editPPTMode: false,

        recommendTemplateList: [],
        learnExperienceList: [],
        filterLearn: [],
        assessmentsList: [],
        filterAssessments: [],
        centuryList: [],
        filterCentury: [],
        recomendListLoading: false,
        addRecomendLoading: false,
        skeletonLoading: false,
        associateQuestionList: [],
        showCustomTag: false,
        customTagTop: 300,
        customTagList: [],
        userTags: {}
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
      logger.info('add task created ' + this.taskId + ' ' + this.$route.path)

      // 初始化关联事件处理
      MyContentEventBus.$on(MyContentEvent.LinkToMyContentItem, this.handleLinkMyContent)
      MyContentEventBus.$on(MyContentEvent.ToggleSelectContentItem, this.handleToggleSelectContentItem)
      LibraryEventBus.$on(LibraryEvent.ContentListSelectClick, this.handleDescriptionSelectClick)
      this.initData()
      this.getAssociate()
      this.loadUserTags()
      this.initTemplateFilter()
    },
    beforeDestroy () {
      MyContentEventBus.$off(MyContentEvent.LinkToMyContentItem, this.handleLinkMyContent)
      MyContentEventBus.$off(MyContentEvent.ToggleSelectContentItem, this.handleToggleSelectContentItem)
      LibraryEventBus.$off(LibraryEvent.ContentListSelectClick, this.handleDescriptionSelectClick)
      // logger.debug('beforeDestroy, try save!')
      // this.handleSaveTask()
    },
    methods: {
      initData () {
        logger.info('initData doing...')
        Promise.all([
          GetMyGrades(),
          FilterTemplates({}),
          SubjectTree({ curriculumId: this.$store.getters.bindCurriculum })
        ]).then((response) => {
          this.$logger.info('add task initData done', response)

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
          if (this.taskId) {
            this.$logger.info('restore task data ' + this.taskId)
            this.restoreTask(this.taskId, true)
          } else {
            this.contentLoading = false
          }
        }).catch((e) => {
          this.$logger.error(e)
          this.$message.error(this.$t('teacher.add-task.init-data-failed'))
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

      initTemplateFilter () {
        GetTreeByKey({ key: 'template' }).then((response) => {
          this.$logger.info('initTemplateFilter response', response.result)
          if (response.success) {
            this.treeItemData = response.result.children
            this.treeItemData.forEach(item => {
              if (item.name === 'Learning experience') {
                this.learnExperienceList = item.children
              }
              if (item.name === 'Assessments') {
                this.assessmentsList = item.children
              }
              if (item.name === '21 century skills') {
                this.centuryList = item.children
              }
            })
          } else {
            this.$message.error(response.message)
          }
        })
      },

      restoreTask (taskId, isFirstLoad) {
        if (isFirstLoad) {
          this.contentLoading = true
        }
        logger.info('restoreTask ' + taskId)
        TaskQueryById({
          id: taskId
        }).then(response => {
          logger.info('TaskQueryById ' + taskId, response.result)
          const taskData = response.result
          this.form = taskData
          this.form.bloomCategories = this.form.bloomCategories ? this.form.bloomCategories : undefined // 为了展示placeholder
          // if (!this.form.presentationId) {
          //   // 未成功绑定ppt
          //   this.handleShowSelectMyContent()
          // }
        }).finally(() => {
          this.contentLoading = false

          if (this.form.presentationId) {
            this.loadThumbnail()
          }
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

      handleSaveTask () {
        logger.info('handleSaveTask', this.form, this.questionDataObj)

        const taskData = Object.assign({}, this.form)

        if (this.taskId) {
          taskData.id = this.taskId
        }
        if (this.form.presentationId) {
          this.loadThumbnail()
        }
        logger.info('basic taskData', taskData)
        logger.info('question taskData', taskData)
        TaskAddOrUpdate(taskData).then((response) => {
          logger.info('TaskAddOrUpdate', response.result)
          if (response.success) {
            this.restoreTask(response.result.id, false)
            this.$message.success(this.$t('teacher.add-task.save-success'))
          } else {
            this.$message.error(response.message)
          }
        }).finally(() => {
          // this.selectedSlideVisible = true
          this.$refs.commonFormHeader.saving = false
        })
      },
      handlePublishTask () {
        logger.info('handlePublishTask', {
          id: this.taskId,
          status: 1
        })

        this.publishing = true
        UpdateContentStatus({
          id: this.taskId,
          status: 1,
          type: this.contentType.task
        }).then(response => {
          this.$logger.info('UpdateContentStatus response', response)
          // this.$message.success('Publish success')
          this.form.status = 1
          this.selectedSlideVisible = true
        }).then(() => {
          this.$message.success(this.$t('teacher.add-task.publish-success'))
          this.form.status = 1
          this.$refs.commonFormHeader.publishing = false
        })
      },

      handleSelectTaskType (type) {
        this.$logger.info('handleSelectTaskType ' + type)
        this.form.taskType = type
        this.customTagList = []
        if (type === 'FA') {
          CustomTagType.task.fa.forEach(name => {
            this.customTagList.push(name)
          })
        } else {
          CustomTagType.task.sa.forEach(name => {
            this.customTagList.push(name)
          })
        }
        this.customTagTop = 390
        this.showCustomTag = true
      },

      goBack () {
        this.$router.push({ path: '/teacher/main/created-by-me' })
        // if (window.history.length <= 1) {
        //   this.$router.push({ path: '/teacher/main/created-by-me' })
        //   return false
        // } else {
        //   this.$router.go(-1)
        // }
        //
        // setTimeout(() => {
        //   this.$router.push({ path: '/teacher/main/created-by-me' })
        // }, 500)
      },

      handleShowSelectMyContent () {
        this.$logger.info('handleShowSelectMyContent')
        this.selectedTaskIdList = []
        this.selectedMyContentList = []
        this.selectedMyContentVisible = true
        this.selectedTemplateList = []
        this.templateLoading = false
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
        const hideLoading = this.$message.loading('Creating ppt in Google side...', 0)
        if (!this.creating) {
          if (this.selectedTemplateList.length) {
            this.creating = true
            TaskCreateTaskPPT({
              taskId: this.taskId ? this.taskId : '',
              name: this.form.name ? this.form.name : 'Unnamed Task',
              overview: this.form.overview,
              templatePresentationIds: this.selectedTemplateList.map(item => {
                return item.presentationId
              })
            }).then(response => {
              this.$logger.info('handleAddTemplate response', response.result)
              this.form.id = response.result.id
              this.form.presentationId = response.result.presentationId
              this.presentationLink = response.result.presentationLink
              this.selectTemplateVisible = false
              this.restoreTask(this.form.id, false)
              this.$router.replace({
                path: '/teacher/add-task/' + response.result.id
              })
            }).finally(() => {
              this.templateLoading = false
              this.creating = false
              this.selectedMyContentVisible = false
              this.viewInGoogleSlideVisible = true
              this.addRecomendLoading = false
              hideLoading()
              // this.loadThumbnail()
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

      handleCancelSelectedMyContent () {
        this.selectedMyContentVisible = false
        this.selectedTaskIdList = []
        this.selectedMyContentList = []
      },

      handleConfirmSelectedMyContent () {
        this.$logger.info('handleConfirmSelectedMyContent', this.selectedMyContentKeyList)
        if (this.selectedMyContentKeyList.length === 0) {
          this.$message.warn('Please select a content!')
          return
        }
        this.selectedTaskIdList = []
        this.selectedMyContentList = []
        this.selectedMyContentKeyList.forEach(key => {
          if (this.selectedMyContentInfoMap.has(key)) {
            this.selectedMyContentList.push(this.selectedMyContentInfoMap.get(key))
          }

          const keyArr = key.split('-')
          if (parseInt(keyArr[0]) === this.contentType.task) {
            this.selectedTaskIdList.push(keyArr[1])
          }
        })
        this.handleCreateTask()
      },

      handleCreateTask () {
        this.$logger.info('handleCreateTask')
        if (!this.creating) {
          this.creating = true
          TaskCreateTaskPPT({
            taskId: this.taskId ? this.taskId : '',
            taskIds: this.selectedTaskIdList,
            name: this.form.name ? this.form.name : 'Unnamed Task',
            overview: this.form.overview
          }).then(response => {
            this.$logger.info('handleCreateTask', response.result)
            this.showChoseSelectTemplateVisible = false
            this.selectedMyContentVisible = false
            this.form.id = response.result.id
            this.form.presentationId = response.result.presentationId
            this.presentationLink = response.result.presentationLink
            this.selectTemplateVisible = false
            this.mode = 'edit'
            this.viewInGoogleSlideVisible = true
            this.$router.replace({
              path: '/teacher/task-redirect/' + response.result.id
            })
          }).finally(() => {
            this.creating = false
            this.selectedMyContentVisible = false
            this.loadThumbnail()
          })
        }
      },

      loadThumbnail () {
        this.thumbnailListLoading = true
        this.skeletonLoading = true
        this.$logger.info('loadThumbnail ' + this.form.presentationId)
        TemplatesGetPresentation({
          presentationId: this.form.presentationId
        }).then(response => {
          this.$logger.info('loadThumbnail response', response.result)
          const pageObjects = response.result.pageObjects
          this.thumbnailList = []
          pageObjects.forEach(page => {
            this.thumbnailList.push({ contentUrl: page.contentUrl, id: page.pageObjectId })
          })
          this.thumbnailListLoading = false
          this.skeletonLoading = false
        })
      },

      // TODO 修改为加载推荐模板
      loadRecommendThumbnail () {
        this.$logger.info('loadRecommendThumbnail')
        this.recomendListLoading = true
        recommendTemplates({}).then(response => {
          logger.info('loadRecommendThumbnail res:', response.result)
          if (response.success) {
            this.recommendTemplateList = response.result
            this.recomendListLoading = false
          }
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
          taskId: this.form.id
        }, data)
        this.$logger.info('new task', task)
        this.subTasks.push(task)
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
      handleStartSession (type) {
        this.$logger.info('handleStartSession', this.form)
        if (this.form.presentationId) {
          this.$logger.info('selected sessionTags', this.sessionTags)
          if (this.sessionTags.length === 0 && !type) {
            this.$message.warn('Please add session tags')
            return
          }
          this.startLoading = true
          const requestData = {
            author: this.$store.getters.email,
            slide_id: this.form.presentationId,
            file_name: this.form.name ? this.form.name : 'Unnamed',
            status: lessonStatus.studentPaced,
            redirect_url: null
          }

          this.$logger.info('handleStartSession', requestData)
          StartLesson(requestData).then(res => {
            this.$logger.info('StartLesson res', res)
            if (res.code === 'ok') {
              const dataTags = []
              if (type && type === 'dash') {
                this.startLoading = false
                this.taskSelectTagVisible = false
                const targetUrl = lessonHost + 'd/' + res.data.class_id
                this.$logger.info('try open ' + targetUrl)
                window.open(targetUrl, '_blank')
              } else {
                this.sessionTags.forEach(tag => {
                  dataTags.push({
                    'name': tag.name,
                    'parentId': tag.parentId,
                    'isGlobal': tag.isGlobal ? 1 : 0,
                    'classId': res.data.class_id,
                    'presentationId': this.form.presentationId,
                    'sourceId': this.form.id,
                    'sourceType': this.form.type
                  })
                })
                SaveSessonTags(dataTags).then(() => {
                  this.startLoading = false
                  this.taskSelectTagVisible = false
                  // const targetUrl = lessonHost + 'slide_id=' + this.form.presentationId + '&class_id=' + res.data.class_id + '&type=classroom'
                  const targetUrl = lessonHost + 't/' + res.data.class_id
                  this.$logger.info('try open ' + targetUrl)
                  window.open(targetUrl, '_blank')
                })
              }
            } else {
              this.$message.warn('StartLesson Failed! ' + res.message)
              this.startLoading = false
            }
          })
        } else {
          this.$message.warn('This record is not bound to PPT!')
          this.startLoading = false
        }
      },
      handleStartCollaborate () {
        this.$logger.info('handleStartCollaborate')
        this.$refs.collaborate.startCollaborateModal(Object.assign({}, this.form), this.form.id, this.contentType.task)
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
      },

      handleAddTaskWithSlide () {
        this.$logger.info('handleAddTaskWithSlide')
        this.mode = 'pick-task-slide'
        this.selectedSlideVisible = false
      },

      handleCancelPickTaskSlide () {
        this.$logger.info('handleCancelPickTaskSlide')
        this.selectedSlideVisible = false
        this.mode = 'edit'
      },
      handleSelectedSessionTags (tags) {
        this.sessionTags = tags
        this.$logger.info('handleSelectedSessionTags', tags)
      },
      handleStartSessionTags () {
        this.taskSelectTagVisible = true
        this.sessionTags = []
      },
      handleAddTaskEvaluation () {
        logger.info('handleAddTaskEvaluation ' + this.taskId)
        // 下创建一个空的evaluation，然后关联，然后再跳转过去
        if (!this.addLoading) {
          this.addLoading = true
          EvaluationAddOrUpdate({ name: null }).then((response) => {
            this.$logger.info('EvaluationAddOrUpdate', response.result)
            if (response.success) {
              Associate({
                fromId: this.taskId,
                fromType: this.contentType.task,
                toId: response.result.id,
                toType: this.contentType.evaluation
              }).then(response => {
                this.$logger.info('Associate response ', response)
                // 刷新子组件的关联数据
                this.$refs.associate.loadAssociateData()
              })
              this.addLoading = false
              this.$router.push({
                path: '/teacher/evaluation-redirect/' + response.result.id
              })
            } else {
              this.$message.error(response.message)
            }
          }).finally(() => {
            this.addLoading = false
          })
        } else {
          this.$logger.info('add loading')
        }
      },
      handleAddLink () {
        this.$logger.info('handleAddLink', this.groupNameList)

        // 如果第一部分有内容，点击link激活step 到第二部分，否则提示先输入第一部分表单内容
        if (this.form.name ||
          this.form.overview ||
          this.form.questions.length) {
          this.currentActiveStepIndex = 1
          this.selectLinkContentVisible = true
          // 添加link
        } else {
          this.$message.warn('Course info is empty, please fill the form first!')
        }
      },
      handleEnsureSelectedLink (data) {
        this.$logger.info('handleEnsureSelectedLink', data)
        this.selectLinkContentVisible = false
        this.getAssociate()
        // 刷新组件内的列表
        this.$refs.commonLink.getAssociate()
      },

      getAssociate () {
        this.$logger.info('AddTask GetAssociate id[' + this.taskId + '] fromType[' + this.contentType.task + ']')
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
          })
          response.result.others.forEach(item => {
            if (this.groupNameListOther.indexOf(item.group) === -1) {
              this.groupNameListOther.push(item.group)
            }
            item.contents.forEach(content => {
              console.log(content)
              if (content.type === typeMap['unit-plan']) {
                content.questions.forEach(question => {
                  this.associateQuestionList.push({
                    ...question,
                    unitName: content.name
                  })
                })
              }
            })
          })
          if (this.groupNameList.length > 0 || this.groupNameListOther.length > 0) {
            this.handleSyncData()
          }
          this.$logger.info('AddTask GetAssociate formatted groupNameList', this.groupNameList, this.groupNameListOther)
        }).finally(() => {
          this.linkGroupLoading = false
        })
      },

      // TODO 自动更新选择的sync 的数据knowledgeId和name列表
      handleSelectListData (data) {
        this.$logger.info('handleSelectListData', data)
        this.selectedSyncList = data
      },

      handleSelectCurriculum (data) {
        this.$logger.info('handleSelectCurriculum', data)
        this.selectedCurriculumList = data
      },

      // TODO 自动更新选择的sync 的数据knowledgeId和name列表
      handleCancelSelectData () {
        this.selectedSyncList = []
        this.selectSyncDataVisible = false
      },

      // TODO 自动更新选择的sync 的数据knowledgeId和name列表
      handleEnsureSelectData () {
        this.$logger.info('handleEnsureSelectData',
          this.selectedCurriculumList,
          this.selectedSpecificSkillList,
          this.selectedCenturySkillList,
          this.selectedSyncList)
        this.selectedSyncList.forEach(data => {
          const filterLearnOuts = this.form.learnOuts.filter(item => item.knowledgeId === data.knowledgeId)
          if (filterLearnOuts.length > 0) {
            return
          }
          this.form.learnOuts.push({
            knowledgeId: data.knowledgeId,
            name: data.name,
            tags: data.tags,
            tagType: data.tagType
          })
        })
        const selectList = this.selectedCurriculumList.concat(this.selectedSpecificSkillList).concat(this.selectedCenturySkillList)
        console.log(selectList)
        if (this.selectIdea) {
          if (selectList.length > 0) {
            this.form.inquiry = selectList[0].knowledgeData.name
          }
          this.selectSyncDataVisible = false
          return
        }
        selectList.forEach(data => {
          const filterLearnOuts = this.form.learnOuts.filter(item => item.knowledgeId === data.knowledgeId)
          if (filterLearnOuts.length > 0) {
            return
          }
          this.form.learnOuts.push({
            knowledgeId: data.knowledgeData.id,
            name: data.knowledgeData.name,
            tagType: data.tagType
          })
        })
        this.$logger.info('this.form.learnOuts', this.form.learnOuts)
        this.selectSyncDataVisible = false
      },
      handleRemoveLearnOuts (data) {
        this.$logger.info('handleRemoveLearnOuts', data)
        var index = this.form.learnOuts.findIndex(item => (item.knowledgeId === data.knowledgeId))
        if (index > -1) {
          this.form.learnOuts.splice(index, 1)
        }
      },
      handleSelectDescription () {
        this.selectSyncDataVisible = true
      },
      handleSyncData () {
        this.$logger.info(' handleSyncData')
        GetReferOutcomes({
          id: this.unitPlanId,
          type: this.contentType.task
        }).then(response => {
          this.$logger.info('getReferOutcomes response', response)
          if (response.result.length) {
            this.syncData = response.result
          }
        })
      },

      onChangeStep (current) {
        console.log('onChange:', current)
        if (typeof current === 'number') {
          this.currentActiveStepIndex = current
          if (current === 1 && !this.form.presentationId) {
            this.loadRecommendThumbnail()
          }
        }
      },

      handleToggleSlideMode () {
        this.$logger.info('handleToggleSlideMode')
        this.currentActiveStepIndex = 1
        if (!this.editPPTMode) {
          this.editPPTMode = true
          this.$refs.slide.scrollIntoView({
            block: 'start',
            behavior: 'smooth'
          })
        }
      },

      handleCreateInGoogle () {
        this.$logger.info('handleCreateInGoogle')
        window.open('https://docs.google.com/presentation', '_blank')
      },
      filterSearch (inputValue, path) {
        return path.some(option => option.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
      },
      selectFilter (data) {
        this.$logger.info('selectFilter', data)
        this.$logger.info('filterLearn', this.filterLearn)
        this.templateLoading = true
        this.selectedTemplateList = []
        FilterTemplates({
            filterLearn: this.filterLearn,
            filterAssessments: this.filterAssessments,
            filterCentury: this.filterCentury
        }).then(response => {
          this.$logger.info('handleToggleTemplateType ', response)
          this.templateList = response.result
        }).finally(() => {
          this.templateLoading = false
        })
      },
      selectRecommendTemplate (template) {
        this.selectedTemplateList = []
        this.selectedTemplateList.push(template)
        this.addRecomendLoading = true
        this.handleAddTemplate()
      },
      loadUserTags () {
        // this.$refs.customTag.tagLoading = true
        FindCustomTags({}).then((response) => {
          this.$logger.info('FindCustomTags response', response.result)
          if (response.success) {
            this.userTags = response.result
            // 默认展示的tag分类
            CustomTagType.task.default.forEach(name => {
              this.customTagList.push(name)
            })
            // 再拼接自己添加的
            this.userTags.userTags.forEach(tag => {
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
      focusInput (event) {
        this.$logger.info('focusInput ', event.target)

        // 设置一个父级定位专用的dom，设置class名称【root-locate-form】，
        // 然后通过事件获取到当前元素，依次往上层查询父元素，累加偏离值，直到定位元素。
        const eventDom = event.target
        let formTop = eventDom.offsetTop
        let currentDom = eventDom.offsetParent
        const currentFocus = ''
        this.customTagList = []
        while (currentDom !== null) {
          formTop += currentDom.offsetTop
          currentDom = currentDom.offsetParent
          // if(currentDom.classList.contains('div.task-type-item.green-active-task-type')) {
          //   currentFocus = 'fa'
          //   CustomTagType.task.fa.forEach(name => {
          //     this.customTagList.push(name)
          //   })
          // }
          if (currentDom.classList && currentDom.classList.contains('root-locate-form')) {
            logger.info('classlist: ', currentDom.classList.toString())
            break
          }
        }
        // custom tag 自带了margin-top: 20px,这里减掉不然不对齐。
        if (currentFocus) {
          this.customTagTop = formTop - 20
          this.showCustomTag = true
        } else {
          CustomTagType.task.default.forEach(name => {
            this.customTagList.push(name)
          })
          // // 再拼接自己添加的
          this.userTags.userTags.forEach(tag => {
            if (this.customTagList.indexOf(tag.name === -1)) {
              this.customTagList.push(tag.name)
            }
          })
          this.customTagTop = 300
          this.showCustomTag = false
        }
      },
      handleChangeUserTags (tags) {
        this.form.customTags = tags
      },
      handleChangeAddKeywords (tag) {
        var index = this.userTags.userTags.findIndex(item => item.name === tag.parentName)
        if (index > -1) {
          this.userTags.userTags[index].keywords.push(tag.name)
        }
      }
    }
  }
</script>

<style>
  .ant-cascader-menu{
    min-width: 200px;
    min-height: 270px;
  }
</style>
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

      .card-wrapper{
        .task-form-left {
          width: 700px;
        }

        .task-form-right {
          width: 600px;
          .form-block-right{
            .img-wrapper {
              position: relative;
              width: 600px;
            }
            .right-title{
              font-size: 16px;
              font-family: Inter-Bold;
              line-height: 24px;
              color: #151515;
              opacity: 1;
              height: 40px;
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
        }
      }

      .image-preview {
        img {
          width: 100%;
          max-height: 250px;
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
      .filter-row{
        align-items: center;
        justify-content: center;
        padding: 5px;
        display: flex;
        width: 100%;
        .ant-form-item-label{
          width: 20%;
          font-weight: bold;
          line-height: 24px;
          color: #11142D;
        }
        .row-select{
          width: 60%;
          margin-left: 10px;
        }
        .row-cascader{
          width: 90%;
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
            min-width: 100px;
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
          padding-left: 100px;
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
            right: 5px;
            top: 5px;
            img {
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
    height: 520px;
    overflow-y: scroll;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
    background: rgba(228, 228, 228, 0.2);
    border: 1px solid #D8D8D8;
    opacity: 1;
    border-radius: 4px;
    padding: 15px 15px 0 15px;
    .preview-item-cover {
      background-position: center center;
      background-size: cover;
      background-repeat: no-repeat;
      position: relative;
      width: 225px;
      height: 160px;
      border-radius: 5px;
      margin: 0 5px 5px 10px;
      border: 1px solid #eee;
      box-shadow: 0 4px 4px 4px #eee;

      .template-select-icon {
        z-index: 50;
        position: absolute;
        right: 5px;
        top: 5px;
        img {
          height: 18px;
        }
      }
    }

    .preview-item-cover-active {
      border: 1px solid #15C39A;
      box-shadow: 0px 3px 6px rgba(21, 195, 154, 0.16);
      border-radius: 5px;
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
    width: 600px;
    margin: auto;
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
    /deep/ .ant-form-item label{
      font-size: 16px;
      font-weight: 500;
      font-family: Inter-Bold;
      line-height: 24px;
    }
  }

  .self-type-wrapper {
    cursor: pointer;
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

  .form-header {
    z-index: 1000;
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
  }

  .my-full-form-wrapper {
    margin-top: 70px;
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
          left: 35px;
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
    width: 1000px;
    margin: auto;

    .slide-form-block {
    }
  }
  .template-tabs /deep/ .ant-tabs-nav-scroll{
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: center;
    font-weight: bold;
    line-height: 24px;
  }

  .slide-select-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    position: relative;
    .slide-select {
      width: 600px;
      background: #fff;
      position: relative;
      .slide-select-and-preview {
        width: 600px;
        min-height: 400px;

        .reset-edit-basic-info {
          z-index: 100;
          position: absolute;
          top: 10px;
          left: 3px;
          background: rgba(0,0,0, 0.8);
          opacity: 0.7;
          padding: 5px 10px;
          font-size: 12px;
          border-radius: 20px;
          cursor: pointer;
          color: #fff;
        }

        .slide-select-action {
          height: 400px;
          width: 600px;
          align-items: center;
          display: flex;
          flex-direction: column;
          justify-content: center;

          img {
            height: 150px;
          }
        }

        .slide-preview {
          border: 1px solid rgba(0, 0, 0, 0.1);
        }
      }
    }

    .slide-recommend {
      width: 600px;
      padding: 0 20px;
      box-sizing: border-box;
    }
  }

  .ant-carousel {

    z-index: 50;
    /deep/ .slick-dots {
      height: auto;
    }

    /deep/ .slick-slide img {
      border: 5px solid #fff;
      display: block;
      margin: auto;
      max-width: 80%;
    }

    /deep/ .slick-thumb {
      padding-bottom: 10px;
      overflow-x: scroll;
      flex-direction: row;
      align-items: center;
      bottom: -70px;
      white-space:nowrap;

      &::-webkit-scrollbar {
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
        -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.2);
      }
    }

    /deep/ .slick-thumb li {
      width: 60px;
      height: 45px;
    }

    /deep/ .slick-thumb li img {
      width: 100%;
      height: 100%;
      filter: grayscale(100%);
      border: 1px solid #fff;
    }

    /deep/ .slick-thumb li.slick-active img {
      filter: grayscale(0%);
      border: 1px solid #15c39a;
    }
  }

  .slide-preview-list {
    max-height: 700px;
    overflow-y: scroll;
    width: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;

    .slide-preview-item {
      position: relative;
      margin-bottom: 10px;
      width: 400px;
      &:hover {
        .mask-cover .mask-actions{
          display: block;
        }
      }

      .mask-cover{
        .mask-actions{
          height: 100%;
          width: 80%;
          left: 10%;
          position: absolute;
          flex-direction: column;
          z-index: 9999;
          display: none;
          .action-item{
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-around;
          }
          .action-item-center{
            min-height: 150px;
            .session-btn{
              margin:15px
            }
            .session-btn-left {
              width: 160px;
              height: 40px;
              background: #15C39A;
              opacity: 1;
              border-radius: 20px;
              justify-content: center;
              display: flex;
              padding: 6px 13px;
              .session-btn-text {
                font-size: 12px;
                font-family: Inter-Bold;
                line-height: 24px;
                color: #FFFFFF;
                opacity: 1;
              }
            }
            .session-btn-right {
              width: 160px;
              height: 40px;
              background: #182552;
              opacity: 1;
              border-radius: 20px;
              display: flex;
              justify-content: center;
              padding: 6px 13px;
              .session-btn-text {
                font-size: 12px;
                font-family: Inter-Bold;
                line-height: 24px;
                color: #FFFFFF;
                opacity: 1;
              }
            }
          }
        }

      }

    }
    .slide-desc{
      width: 70%;
      max-height: 50px;
      margin: 0 auto;
      margin-bottom: 10px;
      overflow: hidden;
    }
  }
  .ant-carousel{
    .slick-slide {
      text-align: center;
      height: 200px;
      line-height: 200px;
      background: #364d79;
      overflow: hidden;
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
    .anticon{
      color: #15c39a;
      font-size: 20px;
    }
  }
  .recomend-loading {
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

  /deep/ .ant-steps-item-title{
    font-size:18px
  }
  .root-locate-form {
    position: relative;
  }
</style>
