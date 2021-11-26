<template>
  <div class="my-full-form-wrapper" id="formRoot">
    <div class="form-header">
      <common-form-header
        ref="commonFormHeader"
        :form="form"
        :last-change-saved-time="lastChangeSavedTime"
        @view-collaborate="handleViewCollaborate"
        @back="goBack"
        @save="handleSaveTask"
        @publish="handlePublishTask"
        @collaborate="handleStartCollaborate"
      />
    </div>
    <a-card :bordered="false" :bodyStyle="{ padding: '16px 24px 40px 24px', height: '100%', minHeight: '1000px',minWidth:'1200px' }">
      <template v-if="mode === 'edit'">
        <a-row class="unit-content" v-if="!contentLoading" >
          <a-col span="24" class="main-content">
            <a-card :bordered="false" :body-style="{padding: '16px', display: 'flex', 'justify-content': 'space-between'}" class="card-wrapper">
              <div class="task-form-left root-locate-form" ref="form" @click="focusInput($event)" :style="{'width':leftWidth}">
                <a-form-model :model="form" class="my-form-wrapper" >
                  <a-steps :current="currentActiveStepIndex" direction="vertical" @change="onChangeStep">
                    <a-step class="step-1" title="Edit Task Info" :status="currentActiveStepIndex === 0 ? 'process':'wait'">
                      <template v-if="currentActiveStepIndex === 0" slot="description">

                        <div class="form-block" >
                          <comment-switch field-name="name" :is-active="showCollaborateCommentVisible && currentFieldName === 'name'" @switch="handleSwitchComment" class="my-comment-switch"/>
                          <a-form-item label="Task name" >
                            <a-input v-model="form.name" placeholder="Enter Task Name" class="my-form-input"/>
                          </a-form-item>
                        </div>

                        <div class="form-block over-form-block" id="overview" >
                          <comment-switch field-name="overview" :is-active="showCollaborateCommentVisible && currentFieldName === 'overview'" @switch="handleSwitchComment" class="my-comment-switch"/>
                          <a-form-model-item class="task-audio-line" label="Task Overview" ref="overview">
                            <a-textarea v-model="form.overview" placeholder="Overview" allow-clear />
                          </a-form-model-item>
                        </div>

                        <div class="form-block taskType" >
                          <comment-switch field-name="taskType" :is-active="showCollaborateCommentVisible && currentFieldName === 'taskType'" @switch="handleSwitchComment" class="my-comment-switch"/>
                          <a-form-model-item class="task-audio-line" label="Choose Task Type(Formative Assessment/ Summative Assessment)" ref="taskType">
                            <div class="self-type-wrapper" >
                              <div class="self-field-label" >
                                <div :class="{'task-type-item': true, 'green-active-task-type': form.taskType === 'FA'}" @click.stop.prevent="handleSelectTaskType('FA')">FA</div>
                                <div :class="{'task-type-item': true, 'red-active-task-type': form.taskType === 'SA'}" @click.stop.prevent="handleSelectTaskType('SA')">SA</div>
                              </div>
                            </div>
                          </a-form-model-item>
                        </div>

                        <div class="form-block form-question" v-if="associateQuestionList.length > 0 && form.taskType === 'FA'">
                          <comment-switch field-name="questions" :is-active="showCollaborateCommentVisible && currentFieldName === 'questions'" @switch="handleSwitchComment" class="my-comment-switch"/>
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
                          <comment-switch field-name="assessment" :is-active="showCollaborateCommentVisible && currentFieldName === 'assessment'" @switch="handleSwitchComment" class="my-comment-switch"/>
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

                    <a-step title=" Edit task slides" :status="currentActiveStepIndex === 1 ? 'process':'wait'" id="templateSelected">
                      <template v-if="currentActiveStepIndex === 1" slot="description">
                        <div class="edit-in-slide" v-show="form.presentationId">
                          <a-button
                            v-if="form.pluginInit"
                            class="action-ensure action-item edit-slide"
                            type="primary"
                            shape="round"
                            @click="taskPptPreviewVisible=true"
                            style="margin-right: 200px">
                            <img style="font-size: 20px" src="~@/assets/icons/task/material.png" class="btn-icon"/>
                            My Material
                          </a-button>
                          <a-button class="action-ensure action-item edit-slide" type="primary" shape="round" @click="handleShowSelectMyContent" style="margin-right: 10px">
                            Select template
                          </a-button>
                          <a-button class="action-ensure action-item edit-slide" type="primary" shape="round" @click="handleOpenGoogleSlide(presentationLink)">
                            Edit in Google Slides
                          </a-button>
                        </div>
                        <div class="template-selected" v-if="showTemplateSelected">
                          <div class="template-list" v-if="!templateLoading">
                            <div :class="{'template-item': true }" v-for="(template,index) in selectedTemplateList" :key="index">
                              <div class="template-hover-action-mask">
                                <div class="template-hover-action">
                                  <div class="modal-ensure-action-line">
                                    <a-button class="action-ensure action-item" shape="round" @click="handlePreviewTemplate(template)">
                                      <a-icon type="eye" theme="filled"/>
                                      <div class="btn-text">
                                        Preview
                                      </div>
                                    </a-button>
                                    <a-button class="action-ensure action-item" shape="round" @click="removeSelectTemplate(template)">
                                      <a-icon type="minus-circle" theme="filled"/>
                                      <div class="btn-text">
                                        Remove
                                      </div>
                                    </a-button>
                                  </div>
                                </div>
                              </div>
                              <div class="template-cover" :style="{backgroundImage: 'url(' + template.cover + ')'}">
                              </div>
                              <div class="template-info">
                                <div class="template-name">{{ template.name }}</div>
                                <div class="template-intro" v-show="template.introduce">{{ template.introduce }}</div>
                              </div>
                              <div class="template-select-icon" >
                                <img src="~@/assets/icons/task/selected.png"/>
                              </div>
                            </div>
                          </div>

                        </div>
                        <a-skeleton :loading="skeletonLoading" active >
                          <div class="slide-select-wrapper" ref="slide">
                            <div class="slide-select">
                              <div class="slide-select-and-preview">
                                <!--                            <div class="reset-edit-basic-info" >Edit Task Info</div>-->
                                <div class="slide-select-action" v-show="!form.presentationId">
                                  <img src="~@/assets/icons/task/Teamwork-Pie-Chart@2x.png" />
                                  <div class="select-action">
                                    <div class="modal-ensure-action-line">
                                      <a-button class="action-item action-cancel" shape="round" @click="handleShowSelectMyContent">Select template</a-button>
                                      <a-button class="action-ensure action-item" type="primary" shape="round" :loading="creating" @click="handleCreateInGoogle">Create a new ppt in Google Slide</a-button>
                                    </div>
                                  </div>
                                </div>
                                <div class="slide-preview" v-show="!showTemplateSelected && form.presentationId && thumbnailList.length">
                                  <a-carousel ref="carousel" arrows >
                                    <div slot="prevArrow" class="custom-slick-arrow" style="left: 10px;zIndex: 1" >
                                      <a-icon type="left-circle"/>
                                    </div>
                                    <div slot="nextArrow" class="custom-slick-arrow" style="right: 10px" >
                                      <a-icon type="right-circle" />
                                    </div>
                                    <div v-for="(item,index) in thumbnailList" :key="index">
                                      <img :src="item.contentUrl" />
                                    </div>
                                  </a-carousel>
                                  <div class="page-info" v-if="thumbnailList && thumbnailList.length">
                                    {{ currentImgIndex + 1 }} / {{ thumbnailList.length }}
                                  </div>
                                  <div class="carousel-page">
                                    <div class="img-list-wrapper">
                                      <div class="img-list">
                                        <div class="img-item" v-for="(item,index) in thumbnailList" :key="'index' + index" @click="handleGotoImgIndex(index)">
                                          <img :src="item.contentUrl" />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </a-skeleton>
                      </template>
                    </a-step>

                    <a-step title="Link Evaluation Form(s)" :status="currentActiveStepIndex === 2 ? 'process':'wait'">
                      <template v-if="currentActiveStepIndex === 2" slot="description">
                        <div class="form-block">
                          <a-form-item class="link-plan-title">
                            <a-button type="primary" :style="{'background-color': '#fff', 'color': '#000', 'border': '1px solid #D8D8D8'}" @click="handleAddTerm">
                              <div class="btn-text" style="line-height: 20px">
                                + Add
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

              <div class="task-form-right" :style="{'width':rightWidth}">

                <!--购物车效果截图 -->
                <div class="slide-animate-cover" id="slide-animate" v-show="currentSlideCoverImgSrc">
                  <img
                    id="slide-animate-img"
                    :src="currentSlideCoverImgSrc"
                    class="slide-animate-item" />
                </div>
                <template v-if="showAllCollaborateCommentVisible">
                  <a-skeleton :loading="showHistoryLoading" active>
                    <div class="collaborate-panel" :style="{'width':rightWidth, 'margin-top': '0px', 'z-index': 100, 'padding': '10px'}">
                      <div class="icon">
                        <comment-icon />
                      </div>
                      <a-tabs default-active-key="1">
                        <a-tab-pane key="1" tab="Comment">
                          <collaborate-comment-view :source-id="taskId" :source-type="contentType.task" :comment-list="collaborateCommentList" @update-comment="handleUpdateCommentList"/>
                        </a-tab-pane>
                        <a-tab-pane key="2" tab="History" force-render>
                          <collaborate-history :history-list="historyList" @restore="handleRestoreField"/>
                        </a-tab-pane>
                      </a-tabs>
                    </div>
                  </a-skeleton>
                </template>
                <template v-else>
                  <template v-if="showCollaborateCommentVisible">
                    <div class="collaborate-panel" :style="{'width':rightWidth, 'margin-top':collaborateTop+'px', 'z-index': 100, 'padding': '10px'}">
                      <collaborate-comment-panel :source-id="taskId" :source-type="contentType.task" :field-name="currentFieldName" :comment-list="currentCollaborateCommentList" @update-comment="handleUpdateCommentList"/>
                    </div>
                  </template>
                  <template v-else>
                    <div class="form-block-right" v-show="currentActiveStepIndex !== 1" >
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
                              <!--                              <p class="ant-upload-text">-->
                              <!--                                {{ $t('teacher.add-unit-plan.upload-a-picture') }}-->
                              <!--                              </p>-->
                            </div>
                          </template>
                        </a-upload-dragger>
                      </a-form-model-item>
                    </div>
                    <div class="recomend-loading" v-if="recomendListLoading">
                      <a-spin size="large" />
                    </div>
                    <div class="form-block-right" v-show="currentActiveStepIndex === 1" v-if="!recomendListLoading">
                      <div class="right-title">Recommended</div>
                      <div class="slide-preview-list">
                        <div class="slide-preview-item" v-for="(template, rIndex) in filterRecommendTemplateList" :key="rIndex">
                          <div class="mask-cover">
                            <div class="mask-actions">
                              <div class="action-item action-item-center">
                                <!--                            <div class="session-btn session-btn-left">-->
                                <!--                              <div class="session-btn-text">Preview</div>-->
                                <!--                            </div>-->
                                <div class="session-btn session-btn-right" v-if="!addRecomendLoading" @click="selectRecommendTemplate(template, rIndex, $event)">
                                  <div class="session-btn-text">Add as slide</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <a-carousel arrows>
                            <div slot="prevArrow" class="custom-slick-arrow" style="left: 10px;zIndex: 1" >
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
                          <div class="recommend-slide-name">
                            {{ template.name }}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-if="!this.contentLoading && this.currentActiveStepIndex !== 1" :style="{'width':rightWidth, 'margin-top':customTagTop+'px'}">
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
                  </template>
                </template>
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
              <div class="thumbnail-task-item" v-if="currentTaskFormData">
                <task-form :parent-form-data="currentTaskFormData" :select-ids="selectedPageIdList" :task-id="taskId" :task-prefix="'task_' + taskIndex + '_'" @finish-task="handleFinishTask" />
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
          <div class="no-data-slide-form-block" v-show="!form.presentationId">
            <no-more-resources tips="The slide has not been created" />
            <div class="go-to-create">
              <a-button type="primary" @click="handleGotoEditMode">Back</a-button>
            </div>
          </div>
        </div>
      </template>
      <a-modal
        v-model="showCollaborateModalVisible"
        :footer="null"
        :maskClosable="false"
        :closable="true"
        destroyOnClose
        width="800px">
        <collaborate-content
          :content-id="taskId"
          :main-content="collaborateContent"
          :content-type="contentType.task"
          @finished="showCollaborateModalVisible = false"
          v-if="showCollaborateModalVisible"/>
      </a-modal>
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
          Link Evaluation Form(s)
        </div>
        <div class="link-content-wrapper">
          <new-my-content
            :from-type="contentType.task"
            :from-id="taskId"
            :filter-type-list="[contentType.evaluation, ]"
            :group-name-list="groupNameList"
            :default-group-name="newTermName"
            :mode="'common-link'"
            :group-name-mode="groupNameMode"
            @cancel="selectLinkContentVisible = false"
            @ensure="handleEnsureSelectedLink"/>
        </div>
      </a-modal>

      <a-modal
        v-model="viewInGoogleSlideVisible"
        :footer="null"
        destroyOnClose
        title="Created Successfully"
        @ok="viewInGoogleSlideVisible = false"
        @cancel="viewInGoogleSlideVisible = false">
        <div class="view-in-google-slider">
          <div class="view-line">
            <div class="link-url">
              <a :href="presentationLink" target="_blank">{{ presentationLink }}</a>
            </div>
            <div class="view-action">
              <a-button type="primary" @click="handleOpenGoogleSlide(presentationLink)">Edit in Google Slides</a-button>
            </div>
          </div>
        </div>
      </a-modal>

      <a-modal
        v-model="selectedMyContentVisible"
        :footer="null"
        :title="null"
        destroyOnClose
        :dialog-style="{ top: '10px' }"
        width="90%"
        :closable="true"
        @ok="selectedMyContentVisible = false">
        <a-tabs class="template-tabs" >
          <a-tab-pane key="1" tab="Teaching Templates">
            <div class="select-template-wrapper">
              <div class="template-show-filter">
                <div class="icon" style="height:20px">
                  <a-tooltip title="Expand filter" placement="right">
                    <img
                      v-if="!showTemplateFilter"
                      src="~@/assets/icons/tag/add.png"
                      @click="showTemplateFilter = !showTemplateFilter">
                  </a-tooltip>
                  <a-tooltip title="Collapse filter" placement="right">
                    <img
                      v-if="showTemplateFilter"
                      src="~@/assets/icons/task/toggle.png"
                      @click="showTemplateFilter = !showTemplateFilter">
                  </a-tooltip>
                </div>
              </div>
              <div class="template-select-header">
                <a-row>
                  <a-col :span="5">
                    <div class="filter-row">
                      <div class="ant-form-item-label">Learning Experience:</div>
                      <a-button type="link" class="clear-all" @click="clearFilter(templateType.Learning)">
                        Clear all
                      </a-button>
                      <div class="row-select" v-if="showTemplateFilter">
                        <div class="sub-select" v-for="(item ,index) in templateFilterCondition(templateType.Learning,'')" :key="index">
                          <a-row>
                            <h4>{{ item.name }}</h4>
                          </a-row>
                          <a-row v-for="(child,cIndex) in item.children" :key="cIndex">
                            <a-col :span="24">
                              <a-checkbox :value="child.id" @change="onChangeCheckBox($event,templateType.Learning)" :checked="filterLearn.indexOf(child.id) > -1 ? true: false">
                                {{ child.name }}
                              </a-checkbox>
                            </a-col>
                          </a-row>
                        </div>
                      </div>
                    </div>
                  </a-col>
                  <a-col :span="8">
                    <div class="filter-row">
                      <div class="ant-form-item-label">Assessment:</div>
                      <a-button type="link" class="clear-all" @click="clearFilter(templateType.Assessments)">
                        Clear all
                      </a-button>
                      <a-row v-if="showTemplateFilter">
                        <a-col :span="12">
                          <div class="row-select">
                            <span class="sub-category">Knowledge focus </span>
                            <div class="sub-select" v-for="(item ,index) in templateFilterCondition(templateType.Assessments,'Knowledge focus')" :key="index">
                              <a-row>
                                <h4>{{ item.name }}</h4>
                              </a-row>
                              <a-row v-for="(child,cIndex) in item.children" :key="cIndex">
                                <a-col :span="24">
                                  <a-checkbox :value="child.id" @change="onChangeCheckBox($event,templateType.Assessments)" :checked="filterAssessments.indexOf(child.id) > -1 ? true: false">
                                    {{ child.name }}
                                  </a-checkbox>
                                </a-col>
                              </a-row>
                            </div>
                          </div>
                        </a-col>
                        <a-col :span="12">
                          <div class="row-select">
                            <span class="sub-category">Skill focus</span>
                            <div class="sub-select" v-for="(item ,index) in templateFilterCondition(templateType.Assessments,'Skill focus')" :key="index">
                              <a-row>
                                <h4>{{ item.name }}</h4>
                              </a-row>
                              <a-row v-for="(child,cIndex) in item.children" :key="cIndex">
                                <a-col :span="24">
                                  <a-checkbox :value="child.id" @change="onChangeCheckBox($event,templateType.Assessments)" :checked="filterAssessments.indexOf(child.id) > -1 ? true: false">
                                    {{ child.name }}
                                  </a-checkbox>
                                </a-col>
                              </a-row>
                            </div>
                          </div>
                        </a-col>
                      </a-row>
                    </div>
                  </a-col>
                  <a-col :span="11">
                    <div class="filter-row" style="overflow: auto">
                      <div class="ant-form-item-label">21 century skills:</div>
                      <a-button type="link" class="clear-all" @click="clearFilter(templateType.Century)">
                        Clear all
                      </a-button>
                      <a-row v-if="showTemplateFilter" class="row-select" style="min-width: 700px" >
                        <a-row>
                          <a-tabs :activeKey="selectYearTab" @change="handleTabYearChange" tab-position="top" size="small" :tabBarGutter="1" >
                            <a-tab-pane v-for="(tag) in centuryTagMap" :key="tag[0]" :tab="tag[0]" />
                          </a-tabs>
                        </a-row>
                        <a-col :span="12">
                          <a-col class="sub-select" v-if="index < 2" :span="24" v-for="(item ,index) in templateFilterCondition(templateType.Century,'')" :key="index">
                            <a-row>
                              <h4>{{ item.name }}</h4>
                            </a-row>
                            <a-row v-for="(child,cIndex) in item.children" :key="cIndex">
                              <a-col :span="24">
                                <a-checkbox :value="child.id" @change="onChangeCheckBox($event,templateType.Century)" :checked="filterCentury.indexOf(child.id) > -1 ? true: false">
                                  {{ child.name }}
                                </a-checkbox>
                                <div class="sub-child" >
                                  <a-row v-if="child.children.length > 0" v-for="(subChild,subIndex) in child.children" :key="subIndex">
                                    <a-col :span="24">
                                      <a-checkbox :value="subChild.id" @change="onChangeCheckBox($event,templateType.Century,child.id)" :checked="filterCentury.indexOf(subChild.id) > -1 ? true: false">
                                        <a-tooltip placement="top" :title="filterGradeTips(subChild)"> {{ subChild.name }}  </a-tooltip>
                                      </a-checkbox>
                                    </a-col>
                                  </a-row>
                                </div>
                              </a-col>
                            </a-row>
                          </a-col>
                        </a-col>
                        <a-col :span="12">
                          <a-col class="sub-select" v-if="index >= 2" :span="24" v-for="(item ,index) in templateFilterCondition(templateType.Century,'')" :key="index">
                            <a-row>
                              <h4>{{ item.name }}</h4>
                            </a-row>
                            <a-row v-for="(child,cIndex) in item.children" :key="cIndex">
                              <a-col :span="24">
                                <a-checkbox :value="child.id" @change="onChangeCheckBox($event,templateType.Century)" :checked="filterCentury.indexOf(child.id) > -1 ? true: false">
                                  {{ child.name }}
                                </a-checkbox>
                                <div class="sub-child" >
                                  <a-row v-if="child.children.length > 0" v-for="(subChild,subIndex) in child.children" :key="subIndex">
                                    <a-col :span="24">
                                      <a-checkbox :value="subChild.id" @change="onChangeCheckBox($event,templateType.Century,child.id)" :checked="filterCentury.indexOf(subChild.id) > -1 ? true: false">
                                        <a-tooltip placement="top" :title="filterGradeTips(subChild)"> {{ subChild.name }}  </a-tooltip>
                                      </a-checkbox>
                                    </a-col>
                                  </a-row>
                                </div>
                              </a-col>
                            </a-row>
                          </a-col>
                        </a-col>
                      </a-row>
                    </div>
                  </a-col>
                </a-row>
              </div>
              <div class="template-list-wrapper">
                <div class="template-list" v-if="!templateLoading">
                  <div :class="{'template-item': true, 'template-item-active': template.id && selectedTemplateIdList.indexOf(template.id) !== -1 }" v-for="(template,index) in (onlyShowSelected ? selectedTemplateList : templateList)" :key="index">
                    <div class="template-hover-action-mask">
                      <div class="template-hover-action">
                        <div class="modal-ensure-action-line">
                          <a-button
                            class="action-ensure action-item"
                            shape="round"
                            @click="handlePreviewTemplate(template)"
                          >
                            <a-icon type="eye" theme="filled"/>
                            <div class="btn-text">
                              Preview
                            </div>
                          </a-button>
                          <a-button
                            v-if="selectedTemplateIdList.indexOf(template.id) === -1"
                            class="action-ensure action-item"
                            shape="round"
                            @click="handleSelectTemplate(template)">
                            <a-icon type="plus-circle" theme="filled"/>
                            <div class="btn-text">
                              Add
                            </div>
                          </a-button>
                          <a-button
                            v-else
                            class="action-ensure action-item"
                            shape="round"
                            @click="handleSelectTemplate(template)"
                          >
                            <a-icon type="minus-circle" theme="filled"/>
                            <div class="btn-text">
                              Remove
                            </div>
                          </a-button>
                        </div>
                      </div>
                    </div>
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
                <div style="position: absolute;left:20px"><a-radio :checked="onlyShowSelected" @click="onChangeShowSelected">Only selected template</a-radio></div>
                <a-button
                  v-if="!form.presentationId"
                  @click="handleAddTemplate"
                  :style="{'display': 'flex', 'align-items': 'center', 'justify-content': 'center', 'padding': '10px'}"
                  shape="round"
                  type="primary"
                  :loading="creating">
                  <img src="~@/assets/icons/task/path.png" class="btn-icon"/>
                  <div class="btn-text">
                    Create the task in Google Slides
                  </div>
                </a-button>
                <a-button
                  v-if="form.presentationId"
                  @click="handleSelectedTemplate"
                  :style="{'display': 'flex', 'align-items': 'center', 'justify-content': 'center', 'padding': '10px'}"
                  shape="round"
                  type="primary"
                  :loading="creating">
                  <img src="~@/assets/icons/task/path.png" class="btn-icon"/>
                  <div class="btn-text">
                    Save selected templates
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
            <!--            <vue-record-audio mode="press" @result="handleAudioResult" />-->
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
            Congratulations! You have published your content successfully!
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
          <custom-tag
            :user-tags="userTags"
            :custom-tags-list="['class']"
            @reload-user-tags="loadUserTags"
            @change-add-keywords="handleChangeAddKeywords"
            :selected-tags-list="sessionTags"
            ref="customTag"
            @change-user-tags="handleSelectedSessionTags"></custom-tag>
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
        width="1200px"
        :dialog-style="{ top: '20px' }"
        :title="null"
        @ok="selectSyncDataVisible = false"
        @cancel="selectSyncDataVisible = false">
        <div class="link-content-wrapper">
          <!-- 此处的questionIndex用于标识区分是哪个组件调用的，返回的事件数据中会带上，方便业务数据处理，可随意写，可忽略-->
          <new-browser
            :select-mode="selectModel.syncData"
            question-index="_questionIndex_1"
            :sync-data="syncData"
            :show-menu="[ NavigationType.specificSkills, NavigationType.centurySkills, NavigationType.learningOutcomes, NavigationType.assessmentType ]"
            :default-active-menu="NavigationType.learningOutcomes"
            @select-assessmentType="handleSelectAssessmentType"
            @select-sync="handleSelectListData"
            @select-curriculum="handleSelectCurriculum"
            @select-subject-specific-skill="handleSelectSubjectSpecificSkillListData"
            @select-century-skill="handleSelect21CenturySkillListData"
          />
          <div class="modal-ensure-action-line-right">
            <a-button class="action-item action-cancel" shape="round" @click="handleCancelSelectData">Cancel</a-button>
            <a-button class="action-ensure action-item" type="primary" shape="round" @click="handleEnsureSelectData">Ok</a-button>
          </div>
        </div>
      </a-modal>

      <a-modal
        v-model="previewTemplateVisible"
        :footer="null"
        destroyOnClose
        width="1000px"
        :zIndex="2000"
        :title="null"
        @ok="previewTemplateVisible = false"
        @cancel="previewTemplateVisible = false">
        <div class="link-content-wrapper">
          <template-preview :template="previewTemplate" :selected-template-id-list="selectedTemplateIdList" @handle-select="handleSelectPreviewTemplate"></template-preview>
        </div>
      </a-modal>

      <a-modal
        v-model="taskPptPreviewVisible"
        :footer="null"
        destroyOnClose
        width="1000px"
        :zIndex="2000"
        :title="null"
        @ok="taskPptPreviewVisible = false"
        @cancel="taskPptPreviewVisible = false">
        <div class="link-content-wrapper">
          <task-ppt-preview :thumbnail-list="thumbnailList" :task-form="form" @handle-select="handleSelectPreviewTemplate"></task-ppt-preview>
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
  import { GetMyGrades, Associate, SaveSessonTags, GetAssociate, GetReferOutcomes } from '@/api/teacher'
  import InputSearch from '@/components/UnitPlan/InputSearch'
  import SdgTagInput from '@/components/UnitPlan/SdgTagInput'
  import SkillTag from '@/components/UnitPlan/SkillTag'
  import { FilterTemplates, TemplatesGetPresentation, recommendTemplates } from '@/api/template'
  import { MyContentEventBus, MyContentEvent } from '@/components/MyContent/MyContentEventBus'
  import { TaskCreateNewTaskPPT, TaskQueryById, TaskAddOrUpdate } from '@/api/task'
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
  import { CustomTagType, DICT_BLOOM_CATEGORY, DICT_TEMPLATE, TemplateType } from '@/const/common'
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
  import { FindCustomTags, GetTagYearTips, GetTreeByKey } from '@/api/tag'
  import { NavigationType } from '@/components/NewLibrary/NavigationType'
  import { GetCollaborateComment, GetCollaborateModifiedHistory } from '@/api/collaborate'
  import CollaborateCommentPanel from '@/components/Collaborate/CollaborateCommentPanel'
  import CommentSwitch from '@/components/Collaborate/CommentSwitch'
  import CollaborateCommentView from '@/components/Collaborate/CollaborateCommentView'
  import commentIcon from '@/assets/icons/collaborate/comment.svg?inline'
  import CollaborateHistory from '@/components/Collaborate/CollaborateHistory'
  import NoMoreResources from '@/components/Common/NoMoreResources'
  import TemplatePreview from '@/components/Task/TemplatePreview'
  import TaskMaterialPreview from '@/components/Task/TaskMaterialPreview'
  import TaskPptPreview from '@/components/Task/TaskPptPreview'

  export default {
    name: 'AddTask',
    components: {
      TaskPptPreview,
      TemplatePreview,
      NoMoreResources,
      CollaborateHistory,
      CollaborateCommentView,
      CommentSwitch,
      CollaborateCommentPanel,
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
      CustomTag,
      commentIcon,
      TaskMaterialPreview
    },
    props: {
      taskId: {
        type: String,
        default: null
      },
      mode: {
        type: String,
        default: 'edit'
      }
    },
    data () {
      return {
        contentLoading: true,
        referenceLoading: false,
        contentType: typeMap,
        templateTypeMap: TemplateTypeMap,
        templateType: TemplateType,
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
        selectedAssessmentList: [],
        selectModel: SelectModel,

        editPPTMode: false,

        recommendTemplateList: [],
        learnExperienceList: [],
        filterLearn: [],
        assessmentsList: [],
        filterAssessments: [],
        centuryList: [],
        filterCentury: [],
        filterParentMap: new Map(),
        recomendListLoading: false,
        addRecomendLoading: false,
        skeletonLoading: false,
        associateQuestionList: [],
        showCustomTag: false,
        customTagTop: 20,
        customTagList: [],
        userTags: {},
        NavigationType: NavigationType,
        showCollaborateCommentVisible: false,

        showCollaborateModalVisible: false,
        collaborateContent: null,
        currentFieldName: {},
        // TODO mock数据待更新为接口请求（loadCollaborateData方法中的GetCollaborateComment)
        collaborateCommentList: [],
        currentCollaborateCommentList: [],
        collaborateTop: 0,
        showAllCollaborateCommentVisible: false,
        // TODO mock数据待更新为接口请求（loadCollaborateData方法中的GetCollaborateModifiedHistory)
        historyList: [],
        centuryTagMap: new Map(),
        selectYearTab: '',
        showHistoryLoading: false,

        // 复制当前表单数据，给选择slide创建task用‘pick-task-slide’
        currentTaskFormData: null,
        rightWidth: '600px',
        leftWidth: '700px',
        groupNameMode: 'input', // input、select,
        newTermName: 'Untitled Term',
        previewTemplate: {},
        previewTemplateVisible: false,
        currentImgIndex: 0,
        showTaskSelected: false,
        onlyShowSelected: false,
        taskPptPreviewVisible: false,
        showTemplateFilter: false,
        currentSlideCoverImgSrc: null
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
      },
      filterRecommendTemplateList () {
        const list = []
        const selectedIds = this.selectedTemplateList.map(template => {
          return template.id
        })
        this.recommendTemplateList.forEach(item => {
          if (selectedIds.indexOf(item.id) === -1) {
            list.push(item)
          }
        })
        return list
      },
      filterGradeTips () {
        return function (item) {
          if (!this.selectYearTab) {
            return item.name
          }
          const filerList = this.centuryTagMap.get(this.selectYearTab).filter(tag => tag.tagId === item.id)
          return filerList.length > 0 ? filerList[0].tooltip : ''
        }
      },
      showTemplateSelected () {
        if (this.showTaskSelected) {
          return this.showTaskSelected
        }
        if (this.selectedTemplateList.length === 0) {
          return false
        }
        return !this.form.pluginInit && this.form.presentationId
      }
    },
    mounted () {
      this.resetWidth()
      window.onresize = () => {
        this.resetWidth()
      }
    },
    created () {
      logger.info('add task created ' + this.taskId + ' ' + this.$route.path + ' mode: ' + this.mode)
      // 初始化关联事件处理
      MyContentEventBus.$on(MyContentEvent.LinkToMyContentItem, this.handleLinkMyContent)
      MyContentEventBus.$on(MyContentEvent.ToggleSelectContentItem, this.handleToggleSelectContentItem)
      LibraryEventBus.$on(LibraryEvent.ContentListSelectClick, this.handleDescriptionSelectClick)
      this.initData()
      this.getAssociate()
      this.loadUserTags()
      this.initTemplateFilter()
      this.GetTagYearTips()

      // 恢复step
      this.currentActiveStepIndex = this.getSessionStep()
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
              if (item.name === TemplateType.Learning) {
                this.learnExperienceList = item.children
              }
              if (item.name === TemplateType.Assessments) {
                this.assessmentsList = item.children
              }
              if (item.name === TemplateType.Century) {
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
          this.selectedTemplateList = this.form.selectedTemplateList
          if (this.form.presentationId) {
            // 绑定google slide 的编辑链接
            this.presentationLink = 'https://docs.google.com/presentation/d/' + this.form.presentationId + '/edit?taskId=' + this.taskId
            this.$logger.info('presentationLink ' + this.presentationLink)
          }
        }).finally(() => {
          this.contentLoading = false
          this.loadCollaborateData()
          if (this.form.presentationId) {
            this.loadThumbnail()
          }
          if (!this.form.pluginInit) {
            if (this.recommendTemplateList.length === 0) {
              this.loadRecommendThumbnail()
            }
          }
          if (this.mode === 'pick-task-slide') {
            this.currentTaskFormData = Object.assign({}, this.form)
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
        taskData.selectedTemplateList = this.selectedTemplateList
        // if (this.form.presentationId) {
        //   this.loadThumbnail()
        // }
        logger.info('basic taskData', taskData)
        logger.info('question taskData', taskData)
        TaskAddOrUpdate(taskData).then((response) => {
          logger.info('TaskAddOrUpdate', response.result)
          if (response.success) {
            this.restoreTask(response.result.id, false)
            this.$message.success(this.$t('teacher.add-task.save-success'))
            this.goBack()
          } else {
            this.$message.error(response.message)
          }
        }).finally(() => {
          // this.selectedSlideVisible = true
          this.$refs.commonFormHeader.saving = false
        })
      },
      handlePublishTask (status) {
        logger.info('handlePublishTask', {
          id: this.taskId,
          status: status
        })
        const taskData = Object.assign({}, this.form)
        taskData.status = status
        this.publishing = true
        TaskAddOrUpdate(taskData).then(response => {
          this.$logger.info('UpdateContentStatus response', response)
          // this.$message.success('Publish success')
          this.form.status = status
        }).then(() => {
          if (status === 1) {
            this.selectedSlideVisible = true
            this.$message.success(this.$t('teacher.add-task.publish-success'))
          } else {
            this.$message.success('Unpublish successfully')
          }
          this.form.status = status
          this.$refs.commonFormHeader.publishing = false
        })
      },

      handleSelectTaskType (type) {
        this.$logger.info('handleSelectTaskType ' + type)
        this.form.taskType = type
        this.customTagList = []
        CustomTagType.task.safa.forEach(name => {
          this.customTagList.push(name)
        })
        this.showAllCollaborateCommentVisible = false
        this.showCollaborateCommentVisible = false
        this.customTagTop = 60
        this.showCustomTag = true
      },

      goBack () {
        if (this.$store.getters.currentRole === 'teacher') {
          this.$router.push({ path: '/teacher/main/created-by-me' })
        } else {
          this.$router.push({ path: '/expert/main/created-by-me' })
        }

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
        if (!this.creating) {
          if (this.selectedTemplateList.length) {
            const hideLoading = this.$message.loading('Creating ppt in Google side...', 0)
            this.creating = true
            TaskCreateNewTaskPPT({
              taskId: this.taskId ? this.taskId : '',
              name: this.form.name ? this.form.name : 'Unnamed Task',
              overview: this.form.overview,
              templatePresentationIds: this.selectedTemplateList.map(item => {
                return item.presentationId
              })
            }).then(response => {
              if (!response.success) {
                this.$message.error(response.message)
                return
              }
              this.$logger.info('handleAddTemplate response', response.result)
              this.form.id = response.result.id
              this.form.presentationId = response.result.presentationId
              this.presentationLink = response.result.presentationLink
              this.selectTemplateVisible = false
              this.restoreTask(this.form.id, false)
              this.$router.replace({
                path: '/teacher/add-task/' + response.result.id
              })
              this.$message.success('Created Successfully in Google Slides')
            }).finally(() => {
              this.templateLoading = false
              this.creating = false
              this.selectedMyContentVisible = false
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
        window.open(slideUrl, '_blank')
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
        if (this.form.presentationId) {
          // 已经存在ppt
          if (this.form.presentationId) {
            this.selectedMyContentList.forEach(item => {
              if (this.selectedTemplateIdList.indexOf(item.id) === -1) {
                // task和template图片字段不一致
                item.cover = item.image
                this.selectedTemplateList.push(item)
              }
            })
            this.showTaskSelected = true
            this.selectedMyContentVisible = false
          }
        } else {
          this.handleCreateTask()
        }
      },

      handleCreateTask () {
        this.$logger.info('handleCreateTask')
        const hideLoading = this.$message.loading('Creating ppt in Google side...', 0)
        if (!this.creating) {
          this.creating = true
          TaskCreateNewTaskPPT({
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
            // this.viewInGoogleSlideVisible = true
            this.$router.replace({
              path: '/teacher/task-redirect/' + response.result.id
            })
            this.$message.success('Created Successfully in Google Slides')
          }).finally(() => {
            this.creating = false
            this.selectedMyContentVisible = false
            this.loadThumbnail()
            hideLoading()
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
        recommendTemplates({ taskId: this.taskId }).then(response => {
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
        // 处理sub task封面
        if (this.currentTaskFormData && this.selectedPageIdList.length > 0) {
          const pageId = this.thumbnailList.filter(item => this.selectedPageIdList.indexOf(item.id) > -1)[0].id
          const selectPage = this.thumbnailList.filter(item => item.id === pageId)
          if (selectPage.length > 0) {
            this.currentTaskFormData = {}
            this.currentTaskFormData = Object.assign({}, this.form)
            this.currentTaskFormData.image = selectPage[0].contentUrl
          }
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
                  const targetUrl = lessonHost + 'd/' + res.data.class_id
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
        this.collaborateContent = Object.assign({}, this.form)
        this.showCollaborateModalVisible = true
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
        this.selectedSlideVisible = false
        this.currentTaskFormData = Object.assign({}, this.form)
        this.$router.push({
          path: '/teacher/add-task/' + this.taskId + '/pick-task-slide'
        })
        this.$logger.info('currentTaskFormData', this.currentTaskFormData)
      },

      handleGotoEditMode () {
        this.$logger.info('handleGotoEditMode')
        this.$router.push({
          path: '/teacher/add-task/' + this.taskId + '/edit'
        })
      },

      handleCancelPickTaskSlide () {
        this.$logger.info('handleCancelPickTaskSlide')
        this.selectedSlideVisible = false
        this.$router.push({
          path: '/teacher/add-task/' + this.taskId + '/edit'
        })
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
      handleAddTerm () {
        this.$logger.info('handleAddTerm', this.groupNameList)

        // 如果第一部分有内容，点击link激活step 到第二部分，否则提示先输入第一部分表单内容
        if (this.form.name ||
          this.form.overview ||
          this.form.questions.length) {
          this.groupNameMode = 'input'
          this.selectLinkContentVisible = true
          this.setSessionStep(1)
        } else {
          this.$message.warn('Task Info is empty, please fill the form first!')
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
          this.newTermName = 'Untitled Term_' + (this.groupNameList.length)
          this.$logger.info('AddTask GetAssociate formatted groupNameList', this.groupNameList, this.groupNameListOther)
        }).finally(() => {
          this.linkGroupLoading = false
        })
      },

      // TODO 选择的assessment数据
      handleSelectAssessmentType (data) {
        this.$logger.info('handleSelectAssessmentType', data)
        this.selectedAssessmentList = data
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

      handleSelectSubjectSpecificSkillListData (data) {
        this.selectedSpecificSkillList = data
        this.$logger.info('handleSelectSubjectSpecificSkillListData', data)
      },

      handleSelect21CenturySkillListData (data) {
        this.$logger.info('handleSelect21CenturySkillListData', data)
        this.selectedCenturySkillList = data
      },

      // TODO 自动更新选择的sync 的数据knowledgeId和name列表
      handleCancelSelectData () {
        this.selectedSyncList = []
        this.selectedCurriculumList = []
        this.selectedSpecificSkillList = []
        this.selectedCenturySkillList = []
        this.selectedAssessmentList = []
        this.selectSyncDataVisible = false
      },

      // TODO 自动更新选择的sync 的数据knowledgeId和name列表
      handleEnsureSelectData () {
        this.$logger.info('handleEnsureSelectData',
          this.selectedCurriculumList,
          this.selectedSpecificSkillList,
          this.selectedCenturySkillList,
          this.selectedBigIdeaList,
          this.selectedAssessmentList,
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
            tagType: data.tagType,
            path: data.path
          })
        })
        const selectList = this.selectedCurriculumList.concat(this.selectedSpecificSkillList).concat(this.selectedCenturySkillList)
          .concat(this.selectedAssessmentList)
        selectList.forEach(data => {
          const filterLearnOuts = this.form.learnOuts.filter(item => item.knowledgeId === data.knowledgeId)
          if (filterLearnOuts.length > 0) {
            return
          }
          this.form.learnOuts.push({
            knowledgeId: data.knowledgeData.id,
            name: data.knowledgeData.name,
            tagType: data.knowledgeData.tagType,
            path: data.knowledgeData.path
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
      // 加载协作的评论和历史记录数据
      loadCollaborateData () {
        return Promise.all([
          GetCollaborateModifiedHistory({ sourceType: this.contentType.task, sourceId: this.form.id }),
          GetCollaborateComment({ sourceType: this.contentType.task, sourceId: this.form.id })
        ]).then(response => {
          // TODO 将历史记录数据‘格式’后填充到historyList数组中，大部分数据可以直接赋值，复杂字段要处理一下,这样handleRestoreField()方法就可以直接赋值了。
          this.historyList = []
          this.$logger.info('GetCollaborateModifiedHistory', response[0])
          if (!response[0].code) {
            this.historyList = response[0].result
          }
          // TODO 将写作点评数据‘格式’后填充到collaborateCommentList数组中
          this.collaborateCommentList = []
          this.$logger.info('GetCollaborateComment', response[1])
          if (!response[1].code) {
            this.collaborateCommentList = response[1].result
          }
        })
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
        console.log('onChange: setSessionStep', current)
        if (typeof current === 'number') {
          this.setSessionStep(current)
          if (this.recommendTemplateList.length === 0) {
            this.loadRecommendThumbnail()
          }
          setTimeout(function () {
              const returnEle = document.querySelector('.ant-layout-content')
              if (returnEle) {
                returnEle.scrollIntoView(true) // true 是默认的
              }
          }, 100)
        }
      },

      handleCreateInGoogle () {
        this.$logger.info('handleCreateInGoogle')
        this.handleCreateTask()
        // window.open('https://docs.google.com/presentation', '_blank')
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
            filterCentury: this.getFilterParams(this.filterCentury)
        }).then(response => {
          this.$logger.info('handleToggleTemplateType ', response)
          this.templateList = response.result
        }).finally(() => {
          this.templateLoading = false
        })
      },
      selectRecommendTemplate (template, rIndex, event) {
        this.$logger.info('selectRecommendTemplate', template)

        // 计算元素位置，然后添加动画
        this.currentSlideCoverImgSrc = template.images[0]
        this.$nextTick(() => {
          const slideAnimateDom = document.getElementById('slide-animate')
          const slideAnimateImgDom = document.getElementById('slide-animate-img')
          const imgDomPos = slideAnimateDom.getBoundingClientRect()
          const containerDomPos = document.getElementById('templateSelected').getBoundingClientRect()
          const buttonPos = event.target.getBoundingClientRect()

          console.log(containerDomPos)
          console.log('buttonPos y ' + buttonPos.y + ' containerDomPos y ' + containerDomPos.y + ' containerDomPos h ' + containerDomPos.height + ' img y ' + imgDomPos.y + ' distY ' + (buttonPos.y - containerDomPos.y - containerDomPos.height / 2))
          const offsetX = -(buttonPos.left + buttonPos.width / 2 - (containerDomPos.left + containerDomPos.width / 2))
          const offsetY = -(event.clientY - (containerDomPos.y + containerDomPos.height / 2))
          console.log('offsetX: ' + offsetX + ' offsetY: ' + offsetY)

          // slide截图出现与初始定位
          slideAnimateDom.style.left = buttonPos.left + buttonPos.width / 2 - 200 + 'px'
          slideAnimateDom.style.top = buttonPos.top + buttonPos.height / 2 - 100 + 'px'
          slideAnimateDom.style.display = 'block'

          // 开始动画
          slideAnimateDom.style.transform = 'translateX(' + offsetX + 'px)'
          slideAnimateImgDom.style.transform = 'translateY(' + offsetY + 'px) scale(0.1)'
          setTimeout(() => {
            this.currentSlideCoverImgSrc = null
            slideAnimateDom.style.transform = 'translateX(0px)'
            slideAnimateImgDom.style.transform = 'translateY(0px) scale(1)'

            if (!this.form.presentationId) {
              this.selectedTemplateList = []
              this.selectedTemplateList.push(template)
              this.addRecomendLoading = true
              this.handleAddTemplate()
            } else {
              if (this.selectedTemplateIdList.indexOf(template.id) === -1) {
                this.selectedTemplateList.push(template)
              }
              this.showTaskSelected = true
            }
          }, 600)
        })
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
        // let isEditBase = false
        // if (typeof event.target.className === 'string' && event.target.className.indexOf('ant-input') > -1) {
        //   isEditBase= true
        // }

        // 设置一个父级定位专用的dom，设置class名称【root-locate-form】，
        // 然后通过事件获取到当前元素，依次往上层查询父元素，累加偏离值，直到定位元素。
        const eventDom = event.target
        let formTop = eventDom.offsetTop ? eventDom.offsetTop : 0
        let currentDom = eventDom.offsetParent
        const currentFocus = ''
        this.customTagList = []
        console.log(currentDom)
        while (currentDom !== null) {
          formTop += (currentDom ? currentDom.offsetTop : 0)
          currentDom = currentDom ? currentDom.offsetParent : undefined
          if (!currentDom) {
            break
          }
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
          // if(isEditBase){
          //   CustomTagType.task.base.forEach(name => {
          //     this.customTagList.push(name)
          //   })
          // }
          CustomTagType.task.default.forEach(name => {
            this.customTagList.push(name)
          })
          // // 再拼接自己添加的
          this.userTags.userTags.forEach(tag => {
            if (this.customTagList.indexOf(tag.name === -1)) {
              this.customTagList.push(tag.name)
            }
          })
          this.customTagTop = 20
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
      },

      // 切换当前的字段的点评数据，从总的collaborateCommentList筛选初当前字段相关的点评数据
      handleSwitchComment (data) {
        this.$logger.info('handleSwitchComment', data)
        if (!data.activeStatus) {
          // 关闭
          this.showCollaborateCommentVisible = false
          this.showCustomTag = true
          return
        }
        this.currentFieldName = data.fieldName
        this.showAllCollaborateCommentVisible = false
        this.showCustomTag = false
        this.currentCollaborateCommentList = []
        const list = []
        this.collaborateCommentList.forEach(item => {
          if (item.fieldName === data.fieldName) {
            list.push(item)
          }
        })
        this.currentCollaborateCommentList = list
        this.collaborateTop = data.top
        this.showCollaborateCommentVisible = true
        this.$logger.info('currentCollaborateCommentList', list)
      },

      // 每次点击都重新加载一下最新数据
      handleViewCollaborate () {
        this.showHistoryLoading = true
        this.$logger.info('handleViewCollaborate')
        this.showCollaborateCommentVisible = false
        this.currentCollaborateCommentList = []
        this.showAllCollaborateCommentVisible = !this.showAllCollaborateCommentVisible
        this.loadCollaborateData().then(() => {
          this.$logger.info('loadCollaborateData loaded')
        }).finally(() => {
          this.showHistoryLoading = false
        })
      },

      // TODO 发布评论后需要更新最新的评论列表,刷新数据
      handleUpdateCommentList () {
        this.$logger.info('handleUpdateCommentList')
        this.currentCollaborateCommentList = []
        this.loadCollaborateData().then(() => {
          this.$logger.info('loadCollaborateData loaded')
        }).finally(() => {
          const list = []
          this.collaborateCommentList.forEach(item => {
            if (item.fieldName === this.currentFieldName) {
              list.push(item)
            }
          })
          this.currentCollaborateCommentList = list
          this.$logger.info('currentCollaborateCommentList', list)
        })
      },

      // historyData以及在接口请求的相应逻辑中正对数据进行‘格式’，
      // 这样在这里就可以直接this.$set设置字段的数据
      handleRestoreField (data) {
        this.$logger.info('handleRestoreField', data, this.form)
        if (data.historyData) {
          data.historyData.forEach(dataItem => {
            this.$logger.info('set ' + dataItem.fieldName, dataItem.data[0])
            if (Array.isArray(dataItem.data[0])) {
              dataItem.data[0].forEach((item, index) => {
                this.$set(this.form[dataItem.fieldName], index, dataItem.data[0][index])
              })
            } else {
              this.$set(this.form, dataItem.fieldName, dataItem.data[0])
            }
          })
          this.$message.success('restore successfully!')
        }
        this.$logger.info('after handleRestoreField', this.form)
      },
      templateFilterCondition (category1, category2) {
        let list = []
        if (category1 === TemplateType.Learning) {
          list = this.learnExperienceList
        } else if (category1 === TemplateType.Assessments) {
          list = this.assessmentsList
        } else if (category1 === TemplateType.Century) {
          list = this.centuryList
        }
        if (!category2) {
          return list
        }
        const resultList = list.filter(item => item.name === category2)
        logger.info('templateFilterCondition ', resultList)
        return resultList.length > 0 ? resultList[0].children : []
      },
      onChangeCheckBox (e, category, parentId) {
        logger.info('onChangeCheckBox ', e, category, parentId)
        logger.info('filterLearn ', this.filterLearn)
        const id = e.target.value
        if (category === TemplateType.Learning) {
          if (this.filterLearn.indexOf(id) === -1) {
            this.filterLearn.push(id)
          } else {
            this.filterLearn.splice(this.filterLearn.indexOf(id), 1)
          }
        } else if (category === TemplateType.Assessments) {
          if (this.filterAssessments.indexOf(id) === -1) {
            this.filterAssessments.push(id)
          } else {
            this.filterAssessments.splice(this.filterAssessments.indexOf(id), 1)
          }
        } else if (category === TemplateType.Century) {
          if (this.filterCentury.indexOf(id) === -1) {
            this.filterCentury.push(id)
            // if (parentId && this.filterCentury.indexOf(parentId) === -1) {
            //   this.filterCentury.push(parentId)
            // }
          } else {
            this.filterCentury.splice(this.filterCentury.indexOf(id), 1)
          }
        }
        // 如果选中的是子类 父id要从筛选条件中去除，记录关系
        if (parentId) {
          this.filterParentMap.set(id, parentId)
        }
        this.selectFilter()
      },
      clearFilter (category) {
        if (category === TemplateType.Learning) {
          this.filterLearn = []
        } else if (category === TemplateType.Assessments) {
          this.filterAssessments = []
        } else if (category === TemplateType.Century) {
          this.filterCentury = []
        }
        this.selectFilter()
      },
      getFilterParams (list) {
        if (list.length === 0) {
          return []
        }
        var resList = [...list]
        list.forEach(id => {
          if (this.filterParentMap.has(id)) {
             const pId = this.filterParentMap.get(id)
             if (resList.indexOf(pId) > -1) {
               resList.splice(resList.indexOf(pId), 1)
             }
          }
        })
        return resList
      },
      GetTagYearTips () {
        GetTagYearTips().then((response) => {
          this.$logger.info('GetTagYearTips response', response.result)
          if (response.success) {
            const tagYears = response.result
            tagYears.forEach(tag => {
              if (!this.centuryTagMap.has(tag.yearName)) {
                this.centuryTagMap.set(tag.yearName, [])
              }
              this.centuryTagMap.get(tag.yearName).push(tag)
            })
            if (tagYears.length > 0) {
              this.selectYearTab = tagYears[0].yearName
            }
          } else {
            this.$message.error(response.message)
          }
          this.$logger.info('centuryTagMap ', this.centuryTagMap)
        })
      },
      handleTabYearChange (activeKey) {
        this.selectYearTab = activeKey
      },
      resetWidth () {
        if (document.body.clientWidth < 1400) {
          this.rightWidth = '500px'
          this.leftWidth = '550px'
        } else {
          this.rightWidth = '600px'
          this.leftWidth = '700px'
        }
      },

      setSessionStep (step) {
        this.currentActiveStepIndex = step
        sessionStorage.setItem('task-step-' + this.taskId, step)
      },
      getSessionStep () {
        const oldStep = sessionStorage.getItem('task-step-' + this.taskId)
        if (oldStep !== null) {
          return parseInt(oldStep)
        } else {
          return 0
        }
      },
      handlePreviewTemplate (template) {
        this.$logger.info('handlePreviewTemplate ', template)
        this.previewTemplateVisible = true
        this.previewTemplate = template
      },
      handleSelectPreviewTemplate (template) {
        this.$logger.info('handleSelectPreviewTemplate ', template)
        this.handleSelectTemplate(template)
        this.previewTemplateVisible = false
      },
      handleGotoImgIndex (index) {
        this.$logger.info('handleGotoImgIndex ' + index)
        this.currentImgIndex = index
        this.$refs.carousel.goTo(index)
      },
      removeSelectTemplate (template) {
        this.$logger.info('removeSelectTemplate ', template)
        var index = this.selectedTemplateList.findIndex(item => item.id === template.id)
        if (index > -1) {
          this.selectedTemplateList.splice(index, 1)
        }
      },
      onChangeShowSelected (e) {
        this.onlyShowSelected = !this.onlyShowSelected
      },
      handleSelectedTemplate () {
        this.$logger.info('handleSelectedTemplate ', this.handleSelectedTemplate)
        this.showTaskSelected = true
        this.selectedMyContentVisible = false
      },
      alterGoto (page) {
        this.$logger.info('alterGoto ' + page)
        if (this.currentImgIndex === 0 && page === -1) {
          this.currentImgIndex = this.thumbnailList.length - 1
        } else if (this.currentImgIndex === this.thumbnailList.length - 1 && page === 1) {
          this.currentImgIndex = 0
        } else {
          this.currentImgIndex = this.currentImgIndex + page
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

        .task-form-right {
          overflow: visible;
          .form-block-right{
            .img-wrapper {
              position: relative;
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
          /*width: 100%;*/
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
    .template-show-filter{
      position:relative;
      img{
        height: 25px;
        width: 25px;
        position: absolute;
        top: -10px;
        left: 5px;
        cursor: pointer;
      }
    }

    .template-select-header {
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid #ddd;
      opacity: 1;
      border-radius: 4px;
      padding: 10px ;
      .filter-row{
        position: relative;
        margin-left: 10px;
        width: 100%;
        .ant-form-item-label{
          font-weight: bold;
          line-height: 24px;
          color: #11142D;
        }
        .clear-all{
          position: absolute;
          right: 3px;
          top: -3px;
        }
        .row-select{
          .sub-category{
            line-height: 24px;
            color: #D3D3D3;
          }
          .sub-select{
            margin-bottom: 10px;
          }
          .sub-child{
            padding-left: 20px;
          }
          margin: 5px;
          border: 1px solid #E4E4E4;
          padding: 5px 15px;
          max-height: 250px;
          overflow: auto;
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
          .template-hover-action-mask {
            display: none;
            z-index: 100;
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.3);
            .template-hover-action{
              width: 100%;
              top:30%
            }

            .action-item {
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 6px 13px;
              background: rgba(0, 0, 0, 0.45);
              opacity: 1;
              border: 1px solid rgba(188, 188, 188, 1);
            }
            .template-hover-action {
              position: absolute;
            }
          }
           &:hover {
            .template-hover-action-mask {
              display: block;
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
    height: 10px;
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
    overflow-y: scroll;
    width: 100%;
    max-height: 360px;
    overflow-y: scroll;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
    background: rgba(228, 228, 228, 0.2);
    border: 1px solid #D8D8D8;
    opacity: 1;
    border-radius: 4px;
    .preview-item-cover {
      background-position: center center;
      background-size: cover;
      background-repeat: no-repeat;
      position: relative;
      width: 225px;
      height: 160px;
      border-radius: 5px;
      margin: 10px 5px 10px 10px;
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
    //width: 600px;
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
    padding: 15px;
    box-sizing: border-box;
    margin: auto;
    display: flex;
    flex-direction: column;
    .task-preview-list {
      position: relative;

      .task-preview {
        padding: 5px;
      }
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
    height: 18px;
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
    position: relative;
    margin-bottom: 35px;
    &:hover {
      .my-comment-switch {
        display: block;
      }
    }
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
    width: 1400px;
    margin: auto;

    .slide-form-block {
    }
  }
  .template-tabs{
    /deep/ .ant-tabs-nav-scroll{
      margin: 0 auto;
      text-align: center;
    }
    .filter-row /deep/ .ant-tabs-nav-scroll{
      margin: 0 auto;
      text-align: left;
    }
  }

  .edit-in-slide {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    margin-bottom: 20px;
    margin-top: 20px;
  }
  .slide-select-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    position: relative;
    /deep/ .ant-carousel .slick-slide img{
      width:650px;
    }
    /deep/ .ant-carousel{
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
        color: fade(@black, 45%);
        font-size: 30px;
      }
    }
    .slide-select {
      background: #fff;
      position: relative;
      .slide-select-and-preview {
        width: 650px;
        //min-height: 400px;

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
          position: relative;
          .slide-hover-action-mask {
            display: none;
            z-index: 100;
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.3);

            .slide-hover-action {
              position: absolute;
              top: 50%;
              left: 50%;
              width: 500px;
              margin-top: -30px;
              margin-left: -250px;

              .update-select-slide {

              }
            }
          }

          &:hover {
            .slide-hover-action-mask {
              display: block;
            }
          }
        }
      }
    }
    .slide-recommend {
      width: 600px;
      padding: 0 20px;
      box-sizing: border-box;
    }
  }

  .slide-preview-list {
    max-height: 1000px;
    overflow-y: scroll;
    overflow-x: hidden;
    width: 400px;
    margin:0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    /deep/ .ant-carousel{
      .slick-slide {
        text-align: center;
        height: 200px;
        line-height: 200px;
        background: #364d79;
        overflow: hidden;
      }
      .slick-slide img{
        width:100%;
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
        color: fade(@black, 45%);
        font-size: 20px;
      }
    }
    .slide-preview-item {
      position: relative;
      margin: 15px;
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
          z-index: 10;
          display: none;
          .action-item{
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-around;
          }
          .action-item-center{
            //min-height: 150px;
            margin-top: 80px;
            z-index:0;
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
  .my-comment-switch {
    display: none;
    position: absolute;
    right: -10px;
    top: -5px;
    z-index: 200;
  }

  .collaborate-panel {
    background-color: #fff;
    //box-shadow: 0px 6px 10px rgba(159, 159, 159, 0.16);
    .icon {
      padding: 10px 5px 0 15px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;

      svg {
        width: 30px;
      }
    }
  }

  .edit-slide {
    display: flex;
    align-items: center;
    img {
      margin-right: 5px;
    }
  }

  .no-data-slide-form-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .go-to-create {
      margin-top: 10px;
    }
  }
  /deep/ .ant-breadcrumb > span:last-child {
    color: rgba(0, 0, 0, 0.45);
  }

  .page-info {
    position: absolute;
    right: 10px;
    bottom: 10px;
    background: #E4E4E4;
    padding: 1px 10px;
    border-radius: 20px;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    align-items: center;
    .page-num-tag {
      display: inline;
      background: rgba(228, 228, 228, 0.5);
      padding: 1px 10px;
      border-radius: 16px;
      font-size: 8px;
      font-family: Segoe UI;
      font-weight: 400;
      color: #808191;
    }
  }

  .carousel-page {
    display: flex;
    height: 110px;
    width: 100%;
    overflow-x: scroll;
    overflow-y: hidden;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

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
    .img-list-wrapper {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;
      .img-list {
        cursor: pointer;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: flex-start;
        .img-item {
          height: 80px;
          border: 1px solid #ddd;
          box-shadow: 0 4px 8px 0 rgba(31, 33, 44, 10%);
          margin: 0 10px;
          img {
            height: 100%;
          }
        }
      }
    }
  }
  .template-selected {
    overflow-y: auto;
    background: rgba(228, 228, 228, 0.2);
    border: 1px solid #D8D8D8;
    opacity: 1;
    border-radius: 4px;
    padding: 20px;
    max-height: 500px;

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
        width: 45%;
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
        .template-hover-action-mask {
          display: none;
          z-index: 100;
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.3);
          .template-hover-action{
            width: 100%;
            top:30%
          }

          .action-item {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 6px 13px;
            background: rgba(0, 0, 0, 0.45);
            opacity: 1;
            border: 1px solid rgba(188, 188, 188, 1);
          }
          .template-hover-action {
            position: absolute;
          }
        }
        &:hover {
          .template-hover-action-mask {
            display: block;
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

  .recommend-slide-name {
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: 40px;
    font-family: Inter-Bold;
    font-weight: 500;
    color: #333;
  }

  .slide-animate-cover {
    width: 400px;
    height: 200px;
    position: fixed;
    transition: transform .6s;
    transform: translateX(0px);
  }
  .slide-animate-cover > img {
    transform: translateY(0px);
    transform: scale(1);
    width: 400px;
    height: 200px;
    transition: transform .6s;
  }
  .slide-animate-cover {
    transition-timing-function: linear;
    opacity: 0.8;
  }
  .slide-animate-cover > img {
    transition-timing-function: cubic-bezier(.55,0,.85,.36);
    outline: 1px solid #D8D8D8;
  }

</style>
