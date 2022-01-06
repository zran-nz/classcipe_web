<template>
  <div class="my-full-form-wrapper">
    <div class="form-header">
      <common-form-header
        ref="commonFormHeader"
        :collaborate="collaborate"
        :form="form"
        :last-change-saved-time="lastChangeSavedTime"
        @back="goBack"
        @collaborate="handleStartCollaborate"
        @publish="handlePublishUnitPlan"
        @save="handleSaveUnitPlan"
        @view-collaborate="handleViewCollaborate"
      />
    </div>
    <a-card :bodyStyle="{ padding: '16px 24px', height: '100%', minHeight: '1200px' }" :bordered="false">
      <a-row v-if="!contentLoading" class="unit-content">
        <!--        <a-col span="4" v-if="showSidebar">
          <associate-sidebar
            :name="form.name"
            :type="contentType['unit-plan']"
            :id="unitPlanId"
            ref="associate"
            @create="showSelectAddContentTypeVisible"
            @link="showSelectLinkContentVisible"
            :show-create="true"/>
        </a-col>-->
        <a-col class="main-content" span="24">
          <a-card
            :body-style="{ padding: '16px', display: 'flex', 'justify-content': 'space-between'}"
            :bordered="false"
            class="card-wrapper">
            <div
              ref="form"
              :style="{'width':leftWidth + 'px'}"
              class="unit-plan-form-left root-locate-form"
              @click="focusInput($event)">
              <a-form-model :model="form" class="my-form-wrapper">
                <a-steps :current="currentActiveStepIndex" direction="vertical" @change="onChangeStep">
                  <a-step :status="currentActiveStepIndex === 0 ? 'process':'wait'" title="Edit Unit plan">
                    <template v-if="currentActiveStepIndex === 0" slot="description">
                      <!--                      <div class="form-block">
                        <div class="refer-action row-flex-right">
                          <div class="refer-text">
                            Refer from
                          </div>
                          <div class="refer-btn">
                            <a-button class="refer" type="primary" @click="handleStartRefer">
                              <img src="~@/assets/icons/unitplan/refer.png" class="btn-icon"/>
                              <div class="btn-text">
                                My Content
                              </div>
                            </a-button>
                          </div>
                        </div>
                      </div>-->

                      <div class="form-block">
                        <comment-switch
                          :is-active="currentFieldName === 'name'"
                          class="my-comment-switch"
                          field-name="name"
                          @switch="handleSwitchComment" />
                        <a-form-item label="Unit Name">
                          <a-input v-model="form.name" class="my-form-input" placeholder="Enter Unit Name" />
                        </a-form-item>
                      </div>

                      <div class="form-block form-radio-wrapper">
                        <comment-switch field-name="projectBased" :is-active="currentFieldName === 'projectBased'" @switch="handleSwitchComment" class="my-comment-switch"/>
                        <a-form-item label="Project-based Unit" style="display:flex">
                          <a-radio-group name="radioGroup" v-model="form.projectBased" style="margin-left:20px;">
                            <a-radio :value="1">
                              Yes
                            </a-radio>
                            <a-radio :value="0">
                              No
                            </a-radio>
                          </a-radio-group>
                        </a-form-item>
                      </div>

                      <div class="form-block form-radio-wrapper">
                        <comment-switch field-name="unitType" :is-active="currentFieldName === 'unitType'" @switch="handleSwitchComment" class="my-comment-switch"/>
                        <a-form-item label="Unit type" style="display:flex">
                          <a-radio-group name="unitType" v-model="form.unitType" style="margin-left:20px;">
                            <a-radio :value="0">
                              Single-subject Unit
                            </a-radio>
                            <a-radio :value="1">
                              Integrated Unit
                            </a-radio>
                          </a-radio-group>
                        </a-form-item>
                      </div>

                      <div class="form-block grade-time">
                        <comment-switch field-name="startDate" :is-active="currentFieldName === 'startDate'" @switch="handleSwitchComment" class="my-comment-switch"/>
                        <a-form-item label="Grade level" style="width:26%;margin-bottom: 0px;">
                          <a-select
                            v-model="form.gradeId"
                            class="my-big-select"
                            placeholder="Select a grade"
                            size="large">
                            <a-select-option v-for="(grade,index) in gradeList" :key="index" :value="grade.id">
                              {{ grade.name }}
                            </a-select-option>
                          </a-select>
                        </a-form-item>
                        <a-form-item
                          class="range-time"
                          label="Start Date"
                          style="width:70%;margin-bottom: 0px;position:relative">
                          <div v-if="getWeek" class="week-time">
                            <a-tag color="cyan" style="border-radius: 10px;font-size: 14px;">
                              {{ getWeek }}
                            </a-tag>
                          </div>
                          <a-range-picker
                            v-model="rangeDate"
                            :show-time="{ format: 'HH:mm' }"
                            format="LLL"
                            size="large"
                            style="width:100%">
                            <a-icon slot="suffixIcon" type="calendar" />
                          </a-range-picker>
                        </a-form-item>
                      </div>

                      <!--                      <div class="form-block over-form-block overview" id="overview">-->
                      <!--                        <comment-switch field-name="overview" :is-active="showCollaborateCommentVisible && currentFieldName === 'overview'" @switch="handleSwitchComment" class="my-comment-switch"/>-->
                      <!--                        &lt;!&ndash; 暂时隐藏Unit overview模块&ndash;&gt;-->
                      <!--                        <a-form-model-item class="task-audio-line" label="Unit Overview">-->
                      <!--                          <a-textarea class="overview" v-model="form.overview" placeholder="Overview" allow-clear />-->

                      <!--                          &lt;!&ndash;                          <a-button type="primary" ghost class="overview-toggle" @click="showTaskDetails = !showTaskDetails">&ndash;&gt;-->
                      <!--                          &lt;!&ndash;                            Assessment task details&ndash;&gt;-->
                      <!--                          &lt;!&ndash;                            <a-icon type="up" v-if="showTaskDetails"/>&ndash;&gt;-->
                      <!--                          &lt;!&ndash;                            <a-icon type="down" v-else/>&ndash;&gt;-->
                      <!--                          &lt;!&ndash;                          </a-button>&ndash;&gt;-->
                      <!--                        </a-form-model-item>-->
                      <!--                        &lt;!&ndash;                        <Collapse>&ndash;&gt;-->
                      <!--                        &lt;!&ndash;                          <div class="overview-task-details" v-if="showTaskDetails" >&ndash;&gt;-->
                      <!--                        &lt;!&ndash;                            <a-textarea class="overview-summarize" v-model="form.summarize" placeholder="Add content to summarize your assessment tasks" allow-clear />&ndash;&gt;-->
                      <!--                        &lt;!&ndash;                            <h4>This Unit is made up of <code>{{ associateTaskList.length }}</code> tasks</h4>&ndash;&gt;-->
                      <!--                        &lt;!&ndash;                            <div class="task-item" v-for="(task,index) in associateTaskList" :key="index">&ndash;&gt;-->
                      <!--                        &lt;!&ndash;                              <p><code>{{ task.name }}</code> focuses on "<code>{{ task.overview }}</code>".&ndash;&gt;-->
                      <!--                        &lt;!&ndash;                                This task applies teaching strategies of  "<span v-if="tag.parentName === 'Teaching strategies'" v-for="(tag,tIndex) in task.customTags" :key="tIndex"><a-tag :color="tagColorList[tIndex % tagColorList.length]">{{ tag.name }}</a-tag></span>"&ndash;&gt;-->
                      <!--                        &lt;!&ndash;                                and uses differentiated instructions of  "<span v-if="tag.parentName === 'Differentiated instructions'" v-for="(tag,tIndex) in task.customTags" :key="tIndex"><a-tag :color="tagColorList[tIndex % tagColorList.length]">{{ tag.name }}</a-tag></span>"&ndash;&gt;-->
                      <!--                        &lt;!&ndash;                                to achieve assessment objectives listed below:</p>&ndash;&gt;-->
                      <!--                        &lt;!&ndash;                              <a-list size="small" bordered :data-source="task.learnOuts" v-if="task.learnOuts.length > 0">&ndash;&gt;-->
                      <!--                        &lt;!&ndash;                                <a-list-item slot="renderItem" slot-scope="learn">&ndash;&gt;-->
                      <!--                        &lt;!&ndash;                                  <a-tooltip :title="learn.path" placement="top">&ndash;&gt;-->
                      <!--                        &lt;!&ndash;                                    {{ learn.name }}&ndash;&gt;-->
                      <!--                        &lt;!&ndash;                                  </a-tooltip>&ndash;&gt;-->
                      <!--                        &lt;!&ndash;                                </a-list-item>&ndash;&gt;-->
                      <!--                        &lt;!&ndash;                              </a-list>&ndash;&gt;-->
                      <!--                        &lt;!&ndash;                              <div class="task-action-edit">&ndash;&gt;-->
                      <!--                        &lt;!&ndash;                                <a-button&ndash;&gt;-->
                      <!--                        &lt;!&ndash;                                  shape="round"&ndash;&gt;-->
                      <!--                        &lt;!&ndash;                                  type="link"&ndash;&gt;-->
                      <!--                        &lt;!&ndash;                                  size="small"&ndash;&gt;-->
                      <!--                        &lt;!&ndash;                                  slot="extra"&ndash;&gt;-->
                      <!--                        &lt;!&ndash;                                  href="#"&ndash;&gt;-->
                      <!--                        &lt;!&ndash;                                  @click="handleEditTask(task)"><a-icon type="edit" /></a-button>&ndash;&gt;-->
                      <!--                        &lt;!&ndash;                              </div>&ndash;&gt;-->
                      <!--                        &lt;!&ndash;                            </div>&ndash;&gt;-->
                      <!--                        &lt;!&ndash;                          </div>&ndash;&gt;-->
                      <!--                        &lt;!&ndash;                        </Collapse>&ndash;&gt;-->

                      <!--                      </div>-->

                      <div id="inquiry" class="form-block inquiry-form-block">
                        <comment-switch
                          :is-active="currentFieldName === 'inquiry'"
                          class="my-comment-switch"
                          field-name="inquiry"
                          @switch="handleSwitchComment" />
                        <!--                <a-divider />-->
                        <a-form-item class="bigIdea" label="Big Idea/ Statement of Inquiry/ Central Idea">
                          <a-textarea
                            v-model="form.inquiry"
                            :placeholder="$store.getters.currentRole === 'teacher' ? $t('teacher.add-unit-plan.teacher-direction-of-inquiry') : $t('teacher.add-unit-plan.expert-direction-of-inquiry')"
                            auto-size
                            class="my-form-textarea inquiry"
                          />
                        </a-form-item>
                        <a-tooltip title="Browse" @click.stop="selectBigIdeaDataVisible=true">
                          <span class="browse">
                            <a-icon theme="twoTone" twoToneColor="rgba(21, 195, 154, 1)" type="appstore" />
                          </span>
                        </a-tooltip>
                      </div>

                      <!--            real-life-scenario-->
                      <div class="form-block ">
                        <comment-switch
                          :is-active="currentFieldName === 'sdg'"
                          class="my-comment-switch"
                          field-name="sdg"
                          style="top:40px"
                          @switch="handleSwitchComment" />
                        <a-divider>Teaching goals</a-divider>
                        <a-row>
                          <a-col span="24">
                            <div class="form-block-title">
                              UN Sustainable Development Goal(s)
                            </div>
                          </a-col>
                        </a-row>
                        <!--sdg and KeyWords-->
                        <div
                          v-for="(scenario, sdgIndex) in form.scenarios"
                          id="sdg"
                          :key="sdgIndex"
                          class="sdg-content-blocks sdg-form-block">

                          <!--description-->
                          <div class="scenario-description">
                            <div
                              v-show="form.scenarios.length > 1"
                              class="sdg-delete-wrapper"
                              @click="handleDeleteSdg(sdgIndex)">
                              <a-tooltip placement="top">
                                <template slot="title">
                                  <span>{{ $t('teacher.add-unit-plan.delete-goal') }}</span>
                                </template>
                                <div class="sdg-delete">
                                  <a-icon :style="{ fontSize: '20px' }" type="delete" />
                                </div>
                              </a-tooltip>
                            </div>
                            <!--sdg-->
                            <a-form-model-item>
                              <a-select
                                v-model="scenario.sdgId"
                                class="my-big-select"
                                placeholder="Select a goal from UN"
                                size="large">
                                <a-select-option
                                  v-for="(sdg,index) in sdgList"
                                  :key="index"
                                  :disabled="selectedSdg.indexOf(sdg.id) != -1"
                                  :value="sdg.id">
                                  {{ sdg.name }}
                                </a-select-option>
                              </a-select>
                            </a-form-model-item>

                            <a-form-model-item>
                              <input-search
                                ref="descriptionInputSearch"
                                :currend-index="currentIndex"
                                :default-value="scenario.description"
                                :key-index="sdgIndex"
                                :search-list="descriptionSearchList"
                                label="description"
                                @reset="descriptionSearchList = []"
                                @search="handleDescriptionSearch"
                                @select-item="handleSelectScenario" />
                            </a-form-model-item>

                          </div>

                          <!--keywords-->
                          <!--    <a-form-model-item>
                            <sdg-tag-input :selected-keywords="scenario.sdgKeyWords" :sdg-key="sdgIndex" @add-tag="handleAddSdgTag" @remove-tag="handleRemoveSdgTag"/>
                          </a-form-model-item>-->
                        </div>
                        <a-button
                          class="add-button"
                          icon="plus-circle"
                          size="large"
                          style="top:-20px"
                          type="link"
                          @click="handleAddMoreSdg"></a-button>
                      </div>

                      <div class="form-block form-block-rwc" >
                        <a-form-model-item label="Real World Connection(s)">
                          <a-select
                            size="large"
                            v-model="form.rwc"
                            placeholder="Choose real world connection">
                            <a-select-option :value="item.id" v-for="(item, index) in rwcList" :key="index" >
                              {{ item.name }}
                            </a-select-option>
                          </a-select>
                        </a-form-model-item>
                      </div>

                      <div
                        :class="{'form-block': true, 'form-block-disabled' : $store.getters.userInfo.disableQuestion}">
                        <comment-switch
                          v-if="!$store.getters.userInfo.disableQuestion"
                          :is-active="currentFieldName === 'question'"
                          class="my-comment-switch"
                          field-name="question"
                          @switch="handleSwitchComment" />
                        <a-form-item class="unit-question">
                          <span slot="label">
                            <a-tooltip title="Set key question/Line of inquiry">
                              <a-icon
                                style="color: #15c39a;cursor: pointer;font-size: 18px"
                                type="exclamation-circle"
                                @click="questionSettingVisible=true" />
                            </a-tooltip>
                            Key question(s) / Line(s) of inquiry
                          </span>
                          <div v-if="!$store.getters.userInfo.disableQuestion">
                            <div class="question-more">
                              <a-button type="link" @click="questionMoreVisible=true">more</a-button>
                            </div>
                            <div v-if="showRecommendQuestion" class="recommend-question">
                              <a-icon class="close-icon" type="close" @click.stop="hideRecommendQuestion=true" />
                              <div class="recommend-box">
                                <a-tooltip
                                  title="You can add the key questions relevant to the big idea you chose above">
                                  <span class="title"><a-icon style="width: 25px" type="question-circle" />Recommended:</span>
                                </a-tooltip>
                                <ul class="recommend-ul">
                                  <li
                                    v-for="(item,rqIndex) in recommendQuestionList"
                                    v-if="rqIndex < 3 && selectQuestion.indexOf(item.name) === -1"
                                    :key="rqIndex">
                                    {{ item.name }}
                                    <a-button class="add-question" type="link" @click.stop="handerInsertQuestion(item)">
                                      add
                                    </a-button>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div v-for="(question, index) in form.questions" :key="index" class="form-input-item">
                              <a-textarea
                                v-model="question.name"
                                :placeholder="$store.getters.currentRole === 'teacher' ? $t('teacher.add-unit-plan.teacher-nth-key-question') : $t('teacher.add-unit-plan.expert-nth-key-question')"
                                auto-size
                                class="my-form-textarea" />
                              <div
                                v-if="form.questions.length > 1"
                                class="delete-icon"
                                @click="handleRemoveQuestion(index)">
                                <a-icon :style="{ fontSize: '20px' }" type="delete" />
                              </div>
                            </div>
                          </div>
                        </a-form-item>
                        <a-button
                          v-if="!$store.getters.userInfo.disableQuestion"
                          class="add-button"
                          icon="plus-circle"
                          size="large"
                          style="top:-40px;"
                          type="link"
                          @click="handleAddMoreQuestion"></a-button>
                      </div>

                      <div class="form-block">
                        <comment-switch
                          :is-active="currentFieldName === 'assessment'"
                          class="my-comment-switch"
                          field-name="assessment"
                          @switch="handleSwitchComment" />
                        <a-form-item label="Set learning objectives">
                          <a-badge :dot="hasExtraRecommend">
                            <a-button type="primary" @click="handleSelectDescription()">
                              <div class="btn-text" style="line-height: 20px">
                                Add leaning objectives
                              </div>
                            </a-button>
                          </a-badge>

                          <a-button
                            class="assessment-task-button"
                            ghost
                            type="link"
                            @click="handleClickTaskDetail($event)">
                            Assessment task details
                            <a-icon type="right" />
                          </a-button>

                        </a-form-item>

                        <!--knowledge tag-select -->
                        <ui-learn-out :learn-outs="form.learnOuts" @remove-learn-outs="handleRemoveLearnOuts" />
                      </div>

                      <div class="form-block" style="clear:both">
                        <comment-switch
                          :is-active="currentFieldName === 'prior'"
                          class="my-comment-switch"
                          field-name="prior"
                          @switch="handleSwitchComment" />
                        <a-form-model-item label="Prior learning experience">
                          <a-textarea
                            v-model="form.prior"
                            allow-clear
                            placeholder="What are the approaches to find out what students already knew?" />
                        </a-form-model-item>
                      </div>

                    </template>
                  </a-step>
                  <a-step title="Link Plan content">
                    <template v-if="currentActiveStepIndex === 1" slot="description">
                      <div class="form-block">
                        <a-form-item class="link-plan-title" label="Add task(s)">
                          <a-space>
                            <a-button
                              :style="{'background-color': '#fff', 'color': '#000', 'border': '1px solid #D8D8D8'}"
                              type="primary"
                              @click="handleAddTasks">
                              <div class="btn-text" style="line-height: 20px">
                                + Link Task(s)
                              </div>
                            </a-button>
                            <a-button
                              :loading="addCategoryLoading"
                              :style="{'background-color': '#fff', 'color': '#000', 'border': '1px solid #D8D8D8'}"
                              class="addCategory"
                              type="primary"
                              @click="handleAddTerm">
                              <div class="btn-text" style="line-height: 20px">
                                + Add category
                              </div>
                            </a-button>
                          </a-space>
                        </a-form-item>
                        <div class="common-link-wrapper">
                          <plan-link
                            ref="planLink"
                            :from-id="this.unitPlanId"
                            :from-type="this.contentType['unit-plan']"
                            @group-name-list-update="handleUpdateGroupNameList" />
                        </div>
                      </div>
                    </template>
                  </a-step>
                </a-steps>
              </a-form-model>
            </div>

            <div :style="{'width':rightWidth + 'px'}" class="unit-plan-form-right">
              <!--              优先级 所有comment预览 > 字段comment > tag选择-->
              <template v-if="showRightModule(rightModule.collaborate)">
                <a-skeleton :loading="showHistoryLoading" active>
                  <div
                    :style="{'width':rightWidth + 'px', 'margin-top': '0px', 'z-index': 100, 'padding': '10px'}"
                    class="collaborate-panel">
                    <div class="icon">
                      <comment-icon />
                    </div>
                    <a-tabs default-active-key="1">
                      <a-tab-pane key="1" tab="Comment">
                        <collaborate-comment-view
                          :comment-list="collaborateCommentList"
                          :source-id="unitPlanId"
                          :source-type="contentType['unit-plan']"
                          @update-comment="handleUpdateCommentList" />
                      </a-tab-pane>
                      <a-tab-pane key="2" force-render tab="History">
                        <collaborate-history :history-list="historyList" @restore="handleRestoreField" />
                      </a-tab-pane>
                    </a-tabs>
                  </div>
                </a-skeleton>
              </template>
              <template v-if="showRightModule(rightModule.collaborateComment) && currentActiveStepIndex === 0">
                <div
                  :style="{'width':rightWidth + 'px', 'margin-top':collaborateTop+'px', 'z-index': 100, 'padding': '10px'}"
                  class="collaborate-panel">
                  <collaborate-comment-panel
                    :comment-list="currentCollaborateCommentList"
                    :field-name="currentFieldName"
                    :source-id="unitPlanId"
                    :source-type="contentType['unit-plan']"
                    @update-comment="handleUpdateCommentList" />
                </div>
              </template>
              <template v-if="showRightModule(rightModule.imageUpload)">
                <div :style="{'width':rightWidth + 'px'}" class="form-block-right">
                  <!-- image-->
                  <a-form-model-item class="img-wrapper">
                    <a-upload-dragger
                      :customRequest="handleUploadImage"
                      :showUploadList="false"
                      accept="image/png, image/jpeg"
                      name="file"
                    >
                      <div v-show="form.image" class="delete-img" @click="handleDeleteImage($event)">
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
                            <img class="upload-icon" src="~@/assets/icons/lesson/upload_icon.png" />
                          </p>
                          <p class="ant-upload-text">
                            {{ $t('teacher.add-unit-plan.upload-a-picture') }}
                          </p>
                        </div>
                      </template>
                    </a-upload-dragger>
                  </a-form-model-item>
                </div>
              </template>
              <template v-if="showRightModule(rightModule.customTag)">
                <div
                  v-show="!this.contentLoading"
                  :style="{'width':rightWidth+'px', 'margin-top':customTagTop+'px', 'z-index': 50}">
                  <custom-tag
                    ref="customTag"
                    :scope-tags-list="customTagList"
                    :selected-tags-list="form.customTags"
                    :show-arrow="showCustomTag"
                    :custom-tags="customTags"
                    @reload-user-tags="loadCustomTags"
                    @change-add-keywords="handleChangeAddKeywords"
                    @change-user-tags="handleChangeCustomTags"></custom-tag>
                </div>
              </template>
              <template v-if="showRightModule(rightModule.taskDetails) && currentActiveStepIndex === 0">
                <div
                  :style="{'width':rightWidth + 'px', 'margin-top':taskDetailsTop+'px', 'z-index': 200}"
                  class="task-details-panel">
                  <Assessment-Task-Details
                    :associate-task-list="associateTaskList"
                    @hide-assessment-task="resetRightModuleVisible()" />
                </div>
              </template>

            </div>
          </a-card>
        </a-col>
      </a-row>

      <a-modal
        v-model="showCollaborateModalVisible"
        :closable="true"
        :footer="null"
        :maskClosable="false"
        destroyOnClose
        width="900px">
        <collaborate-user-list
          v-if="showCollaborateModalVisible"
          :content-id="unitPlanId"
          :content-type="contentType['unit-plan']"
          :main-content="collaborateContent"
          @confirmSelect="confirmSelectCollaborateUsers" />
      </a-modal>

      <a-modal
        v-model="selectAddContentTypeVisible"
        :footer="null"
        destroyOnClose
        title="Select Content Type"
        @cancel="selectAddContentTypeVisible = false"
        @ok="selectAddContentTypeVisible = false">
        <div class="add-content-wrapper">
          <div class="add-content-item" @click="handleAddUnitPlanTask">
            <a>
              <content-type-icon :type="contentType.task" />
              {{ $t('teacher.add-unit-plan.task') }}
            </a>
          </div>
          <div class="add-content-item" @click="handleAddUnitPlanLesson">
            <a>
              <content-type-icon :type="contentType.lesson" />
              {{ $t('teacher.add-unit-plan.lesson') }}
            </a>
          </div>
          <div class="add-content-item" @click="handleAddUnitPlanEvaluation">
            <a>
              <content-type-icon :type="contentType.evaluation" />
              {{ $t('teacher.add-unit-plan.evaluation') }}
            </a>
          </div>
          <div v-if="addLoading" class="add-loading">
            <a-spin />
          </div>
        </div>
      </a-modal>

      <a-modal
        v-model="showAddAudioVisible"
        :footer="null"
        destroyOnClose
        title="Add Audio"
        @cancel="showAddAudioVisible = false"
        @ok="showAddAudioVisible = false">

        <div class="audio-material-action">
          <div v-show="currentUploading" class="uploading-mask">
            <div class="uploading">
              <a-spin large />
            </div>
          </div>
          <div class="action-item">
            <a-upload :customRequest="handleUploadAudio" :showUploadList="false" accept="audio/*" name="file">
              <a-button icon="upload" type="primary">{{ $t('teacher.add-unit-plan.upload-audio') }}</a-button>
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
          <div class="material-action">
            <a-button key="back" class="action-item" @click="handleCancelAddAudio">
              Cancel
            </a-button>
            <a-button key="submit" class="action-item" type="primary" @click="handleConfirmAddAudio">
              Ok
            </a-button>
          </div>
        </div>
      </a-modal>

      <a-modal
        v-model="selectReferMyContentVisible"
        :footer="null"
        destroyOnClose
        title="Refer MyContent"
        width="1150px"
        @cancel="selectReferMyContentVisible = false"
        @ok="selectReferMyContentVisible = false">
        <div class="link-content-wrapper">
          <my-content-selector
            :current-id="unitPlanId"
            :filter-type-list="['unit-plan', 'topic']"
            :mode="DisplayMode.Refer" />
        </div>
      </a-modal>

      <a-drawer
        :closable="false"
        :mask="false"
        :visible="referDetailVisible"
        destroyOnClose
        placement="right"
        width="700px"
        @close="handleCloseReferDetail"
      >
        <a-row class="preview-wrapper-row">
          <a-col class="view-back-col" span="2">
            <div class="view-back" @click="handleCloseReferDetail">
              <div class="back-icon">
                <img src="~@/assets/icons/common/back.png" />
              </div>
            </div>
          </a-col>
          <a-col class="preview-wrapper-col" span="24">
            <div class="detail-wrapper">
              <div class="refer-detail">
                <refer-preview
                  :id="referId"
                  :type="referType"
                  @refer="handleReferBlock"
                  @hover-refer-block="handleHoverReferBlock"
                  @refer-associate="handleReferAssociate"
                />
              </div>
            </div>
          </a-col>
        </a-row>
      </a-drawer>

      <a-modal
        v-model="selectLinkContentVisible"
        :dialog-style="{ top: '10px'}"
        :footer="null"
        destroyOnClose
        width="900px">
        <div slot="title" class="my-modal-title">
          Link my content
        </div>
        <div class="link-content-wrapper">
          <new-my-content
            :default-group-name="newTermName"
            :filter-type-list="[contentType.task]"
            :from-id="unitPlanId"
            :from-type="contentType['unit-plan']"
            :group-name-list="groupNameList"
            :group-name-mode="groupNameMode"
            :mode="'common-link'"
            :selected-list="selectedTaskList"
            @cancel="selectLinkContentVisible = false"
            @ensure="handleEnsureSelectedLink" />
        </div>
      </a-modal>

      <a-modal
        v-model="selectSyncDataVisible"
        :dialog-style="{ top: '20px' }"
        :footer="null"
        :title="null"
        destroyOnClose
        width="1200px"
        @cancel="selectSyncDataVisible = false"
        @ok="selectSyncDataVisible = false">
        <div class="link-content-wrapper">
          <!-- 此处的questionIndex用于标识区分是哪个组件调用的，返回的事件数据中会带上，方便业务数据处理，可随意写，可忽略, show-menu中列出的类型才会显示-->
          <new-browser
            ref="newBrowser"
            :default-active-menu="defaultActiveMenu"
            :recommend-data="recommendData"
            :select-mode="selectModel.syncData"
            :selected-id="selectedIdList"
            :selected-list="selectedList"
            :show-menu="showMenuList"
            :sync-data="syncData"
            :learning-outcome-grade-id="form.gradeId"
            question-index="_questionIndex_1"
            @select-assessmentType="handleSelectAssessmentType"
            @select-sync="handleSelectListData"
            @select-curriculum="handleSelectCurriculum"
            @select-subject-specific-skill="handleSelectSubjectSpecificSkillListData"
            @select-century-skill="handleSelect21CenturySkillListData"
            @select-idu="handleSelectIdu"
            @select-recommend="handleSelectRecommend"
            @cancel-select="handleCancelSelectData"
            @ensure-select="handleEnsureSelectData"
          />
        </div>
      </a-modal>

      <a-modal
        v-model="questionSettingVisible"
        :footer="null"
        destroyOnClose
        title="Set key question(s) / Line(s) of inquiry"
        width="600px">
        <div class="ensure-setting-modal">
          <div class="tips">
            <p>We understand that for some countries, "key questions/line of inquiry" is not required in Unit plan so
              you have the option to turn it off. You won't see that section once it's off.</p>
            <p>
            </p>
            <p style="color: red">You might turn it on or change in your account setting If you need the section in
              future.</p>
          </div>
          <a-switch v-model="disableQuestion" @change="onChangeSwitch" />
          <span
            style="color: red ;font-family: Inter-Bold;font-size: 15px;"> Key question(s) / Line(s) of inquiry</span>
          <div class="modal-ensure-action-line-center">
            <a-button class="action-item action-cancel" shape="round" @click="questionSettingVisible=false">Cancel
            </a-button>
            <a-button
              :loading="confirmLoading"
              class="action-ensure action-item"
              shape="round"
              type="primary"
              @click="handQuestionSetting">Confirm
            </a-button>
          </div>
        </div>
      </a-modal>

      <a-modal
        v-model="selectBigIdeaDataVisible"
        :footer="null"
        destroyOnClose
        title="Browse big idea"
        width="70%"
        @cancel="selectBigIdeaDataVisible = false"
        @ok="selectBigIdeaDataVisible = false">
        <div class="link-content-wrapper">
          <BigIdeaBrowse @handle-select="handleSelectBigIdeaData">

          </BigIdeaBrowse>

          <div class="modal-ensure-action-line-right">
            <a-button class="action-item action-cancel" shape="round" @click="selectBigIdeaDataVisible=false">Cancel
            </a-button>
            <a-button
              class="action-ensure action-item"
              shape="round"
              type="primary"
              @click="handleEnsureSelectBigIdeaData">Ok
            </a-button>
          </div>
        </div>
      </a-modal>

      <a-modal
        v-model="questionMoreVisible"
        :footer="null"
        destroyOnClose
        title="Browse Key Questions"
        width="900px"
        @cancel="questionMoreVisible = false"
        @ok="questionMoreVisible = false">
        <div class="link-content-wrapper">
          <QuestionBrowse
            :big-idea="form.inquiry"
            :question-list="form.questions"
            @select-question="handleSelectQuestion"></QuestionBrowse>

          <div class="modal-ensure-action-line-right" style="justify-content: center">
            <a-button class="action-item action-cancel" shape="round" @click="questionMoreVisible=false">Cancel
            </a-button>
            <a-button
              class="action-ensure action-item"
              shape="round"
              type="primary"
              @click="handleEnsureSelectQuestionData">Ok
            </a-button>
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
import { CustomTagType } from '@/const/common'
import { commonAPIUrl } from '@/api/common'
import { GetAllSdgs, ScenarioSearch } from '@/api/scenario'
import { debounce } from 'lodash-es'
import InputSearch from '@/components/UnitPlan/InputSearch'
import SdgTagInput from '@/components/UnitPlan/SdgTagInput'
import {
  AddOrSaveGroupName,
  Associate,
  FindBigIdeaSourceOutcomes,
  FindSourceOutcomes,
  GetAssociate,
  GetMyGrades,
  GetReferOutcomes
} from '@/api/teacher'
import { SubjectTree } from '@/api/subject'
import { formatSubjectTree } from '@/utils/bizUtil'
import NewUiClickableKnowledgeTag from '@/components/UnitPlan/NewUiClickableKnowledgeTag'
import NewClickableSkillTag from '@/components/UnitPlan/NewClickableSkillTag'
import SkillTag from '@/components/UnitPlan/SkillTag'
import { UnitPlanAddOrUpdate, UnitPlanQueryById } from '@/api/unitPlan'
import { formatLocalUTC } from '@/utils/util'
import MyContentSelector from '@/components/MyContent/MyContentSelector'
import AssociateSidebar from '@/components/Associate/AssociateSidebar'
import { TaskAddOrUpdate } from '@/api/task'
import { LessonAddOrUpdate } from '@/api/myLesson'
import { EvaluationAddOrUpdate } from '@/api/evaluation'
import CustomTag from '../../components/UnitPlan/CustomTag'
import { MyContentEvent, MyContentEventBus } from '@/components/MyContent/MyContentEventBus'
import RelevantTagSelector from '@/components/UnitPlan/RelevantTagSelector'
import AddKeywordTag from '@/components/Evaluation/AddKeywordTag'
import CollaborateUserList from '@/components/Collaborate/CollaborateUserList'
import CommonFormHeader from '@/components/Common/CommonFormHeader'
import NewBrowser from '@/components/NewLibrary/NewBrowser'
import { SelectModel } from '@/components/NewLibrary/SelectModel'
import DisplayMode from '@/components/MyContent/DisplayMode'
import { LibraryEvent, LibraryEventBus } from '@/components/NewLibrary/LibraryEventBus'
import ReferPreview from '@/components/UnitPlanRefer/ReferPreview'
import UiLearnOut from '@/components/UnitPlan/UiLearnOut'
import PlanLink from '@/components/Common/PlanLink'
import NewMyContent from '@/components/MyContent/NewMyContent'
import { FindCustomTags, GetTreeByKey } from '@/api/tag'
import { GetCollaborateComment, GetCollaborateModifiedHistory } from '@/api/collaborate'
import { NavigationType } from '@/components/NewLibrary/NavigationType'
import CollaborateCommentPanel from '@/components/Collaborate/CollaborateCommentPanel'
import CommentSwitch from '@/components/Collaborate/CommentSwitch'
import CollaborateCommentView from '@/components/Collaborate/CollaborateCommentView'
import commentIcon from '@/assets/icons/collaborate/comment.svg?inline'
import CollaborateHistory from '@/components/Collaborate/CollaborateHistory'
import { UserSetting } from '@/api/user'
import BigIdeaBrowse from '@/components/UnitPlan/BigIdeaBrowse'
import { FindQuestionsByBigIdea } from '@/api/question'
import QuestionBrowse from '@/components/UnitPlan/QuestionBrowse'
import Collapse from '@/utils/collapse.js'
import { UtilMixin } from '@/mixins/UtilMixin'
import moment from 'moment'
import AssessmentTaskDetails from '@/components/UnitPlan/AssessmentTaskDetails'
import { BaseEventMixin } from '@/mixins/BaseEvent'

export default {
  name: 'AddUnitPlan',
  components: {
    AssessmentTaskDetails,
    QuestionBrowse,
    CollaborateHistory,
    CollaborateCommentView,
    CommentSwitch,
    CollaborateCommentPanel,
    NewMyContent,
    PlanLink,
    ReferPreview,
    CollaborateUserList,
    CommonFormHeader,
    ContentTypeIcon,
    InputSearch,
    SdgTagInput,
    NewUiClickableKnowledgeTag,
    NewClickableSkillTag,
    SkillTag,
    MyContentSelector,
    AssociateSidebar,
    CustomTag,
    RelevantTagSelector,
    AddKeywordTag,
    NewBrowser,
    commentIcon,
    UiLearnOut,
    BigIdeaBrowse,
    Collapse
  },
  props: {
    unitPlanId: {
      type: String,
      default: null
    }
  },
  mixins: [UtilMixin, BaseEventMixin],
  data () {
    return {
      showCollaborateVisible: false,
      contentLoading: true,
      referenceLoading: false,
      contentType: typeMap,
      DisplayMode: DisplayMode,

      selectAddContentTypeVisible: false,
      selectLinkContentVisible: false,

      showAddAudioVisible: false,
      currentUploading: false,
      audioUrl: null,

      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      form: {
        id: null,
        image: '',
        inquiry: '',
        name: 'Untitled UnitPlan',
        status: 0,
        subjects: '',
        learnOuts: [],
        questions: [
          {
            id: '',
            name: ''
          }
        ],
        scenarios: {
          description: '',
          sdgId: '1',
          sdgKeyWords: [
            {
              id: '',
              name: ''
            }
          ]
        },
        createTime: '',
        updateTime: '',
        materials: [],
        customTags: [],
        overview: '',
        subjectIds: [],
        gradeIds: [],
        summarize: '',
        startDate: '',
        endDate: '',
        gradeId: undefined,
        prior: ''
      },
      rangeDate: [],
      uploading: false,
      sdgList: [],

      // Subject(s) Covered
      subjectList: [],

      // Grades
      gradeList: [],

      // SubjectTree
      subjectTree: [],

      // 根据description搜索的下拉list列表
      descriptionSearchList: [],
      addLoading: false,
      currentIndex: 0,
      saving: false,
      publishing: false,
      selectModel: SelectModel,
      selectDescriptionIndex: '',

      selectReferMyContentVisible: false,
      referDetailVisible: false,
      referId: null,
      referType: null,
      activeReferBlock: '',
      showSidebar: true,

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
      // idu
      selectedIduList: [],
      selectedRecommendList: [],

      // BigIdeaList
      selectedBigIdeaList: [],

      selectedAssessmentList: [],

      selectIdea: false,
      showCustomTag: false,
      customTagTop: 0,
      customTagList: [],
      customTags: {},
      NavigationType: NavigationType,
      defaultActiveMenu: NavigationType.learningOutcomes,
      showMenuList: [NavigationType.specificSkills, NavigationType.centurySkills, NavigationType.learningOutcomes, NavigationType.assessmentType, NavigationType.idu],

      showCollaborateModalVisible: false,
      collaborateContent: null,
      currentFieldName: {},

      // TODO mock数据待更新为接口请求（loadCollaborateData方法中的GetCollaborateComment)
      collaborateCommentList: [],
      currentCollaborateCommentList: [],
      collaborateTop: 0,
      // TODO mock数据待更新为接口请求（loadCollaborateData方法中的GetCollaborateModifiedHistory)
      historyList: [],
      questionSettingVisible: false,
      disableQuestion: false,
      confirmLoading: false,
      selectBigIdeaDataVisible: false,
      selectNewBigIdea: '',
      recommendQuestionList: [],
      showHistoryLoading: false,
      hideRecommendQuestion: false,
      questionMoreVisible: false,
      selectedQuestionList: [],

      groupNameMode: 'input', // input、select,
      newTermName: 'Untitled category',
      associateTaskList: [],
      tagColorList: [
        'pink',
        'orange',
        'green',
        'cyan',
        'blue',
        'red',
        'purple'
      ],

      recommendData: [],
      recommendDataIdList: [],
      selectedIdList: [],
      selectedList: [],
      selectedTaskList: [],
      taskDetailsTop: 0,
      associateUnitPlanIdList: [],
      associateTaskIdList: [],
      associateId2Name: new Map(),
      defaultGroupName: 'Untitled category',
      addCategoryLoading: false,
      rwcList: []
    }
  },
  watch: {
    referDetailVisible (value) {
      this.$logger.info('watch referDetailVisible ' + value)
      this.$logger.info('screen width: ', document.body.clientWidth)
      if (value && document.body.clientWidth < 1700) {
        this.showSidebar = false
      } else {
        this.showSidebar = true
      }
    },
    'form.inquiry': function (value, newValue) {
      this.$logger.info('watch form.inquiry change ' + value, newValue)
      if (this.hideRecommendQuestion) {
        return
      }
      this.$logger.info('get recommend question ' + value)
      this.findQuestionsByBigIdea(value)
      // 重新load recommend
      this.loadBigIdeaLearnOuts()
    }
  },
  beforeRouteLeave (to, from, next) {
    var that = this
    if (this.isOwner || this.isCollaborater) {
      if (this.initCompleted && JSON.stringify(this.form) !== JSON.stringify(this.oldForm)) {
        this.$confirm({
          title: 'Alert',
          okText: 'Save',
          cancelText: 'No',
          content: 'Do you want to save the changes?',
          onOk: function () {
            that.handleSaveUnitPlan()
            setTimeout(() => {
              next()
            }, 500)
          },
          onCancel () {
            next()
          }
        })
      } else {
        next()
      }
    } else {
      next()
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
    selectedSdg () {
      const sdgList = []
      this.form.scenarios.forEach(item => sdgList.push(item.sdgId))
      console.log(sdgList)
      return sdgList
    },
    showRecommendQuestion () {
      if (this.hideRecommendQuestion) {
        return false
      }
      if (!this.form.inquiry) {
        return false
      }
      // if (this.form.questions.length > 1) {
      //   return false
      // }
      // if (this.form.questions.length === 1 && !this.form.questions[0]) {
      //   return false
      // }
      if (this.recommendQuestionList.length === 0) {
        return false
      }
      return true
    },
    selectQuestion () {
      return this.form.questions.map(item => {
        return item.name
      })
    },
    getTaskTags () {
      return this.form.questions.map(item => {
        return item.name
      })
    },
    hasExtraRecommend () {
      this.$logger.info('-------------', this.form.learnOuts, this.recommendDataIdList)
      let ret = false
      this.form.learnOuts.forEach(item => {
        if (this.recommendDataIdList.indexOf(item.knowledgeId) === -1) {
          ret = true
          this.$logger.info('------------learnOuts', item, ' not exist in ', this.recommendDataIdList)
        }
      })

      return ret
    }
  },
  created () {
    logger.info('unitPlanId ' + this.unitPlanId + ' ' + this.$route.path)
    // 初始化关联事件处理
    MyContentEventBus.$on(MyContentEvent.ReferContentItem, this.handleReferItem)
    LibraryEventBus.$on(LibraryEvent.ContentListSelectClick, this.handleDescriptionSelectClick)
    this.initData()
    this.getAssociate()
    this.loadCustomTags()
    this.debouncedGetSdgByDescription = debounce(this.searchScenario, 300)
    this.findQuestionsByBigIdea = debounce(this.findQuestionsByBigIdea, 800)
    this.queryContentCollaborates(this.unitPlanId, this.contentType['unit-plan'])

    // 恢复step
    this.currentActiveStepIndex = this.getSessionStep()

    // library浏览learning outcome时，修改了grade，需要更新表单中的grade
    LibraryEventBus.$on(LibraryEvent.GradeUpdate, this.handleGradeUpdate)
  },
  beforeDestroy () {
    MyContentEventBus.$off(MyContentEvent.ReferContentItem, this.handleReferItem)
    LibraryEventBus.$off(LibraryEvent.ContentListSelectClick, this.handleDescriptionSelectClick)
    // logger.debug('beforeDestroy, try save!')
    // this.handleSaveUnitPlan()
  },
  methods: {
    initData () {
      logger.info('initData doing...')
      Promise.all([
        GetAllSdgs(),
        // GetTreeByKey({ key: 'Related Concepts MYP' }),
        GetMyGrades(),
        SubjectTree({ curriculumId: this.$store.getters.bindCurriculum }),
        GetTreeByKey({ key: 'Real world connections' })
      ]).then((sdgListResponse) => {
        logger.info('initData done', sdgListResponse)

        // GetAllSdgs
        logger.info('GetAllSdgs Response ', sdgListResponse[0])
        if (!sdgListResponse[0].code) {
          this.sdgList = sdgListResponse[0].result
        }

        // // GetTreeByKey
        // if (!sdgListResponse[1].code) {
        //   logger.info('GetTreeByKey subjectList', sdgListResponse[1].result.children)
        //   this.subjectList = sdgListResponse[1].result.children
        // }

        // GetMyGrades
        if (!sdgListResponse[1].code) {
          logger.info('GetMyGrades', sdgListResponse[1].result)
          this.gradeList = sdgListResponse[1].result
        }

        // SubjectTree
        if (!sdgListResponse[2].code) {
          logger.info('SubjectTree', sdgListResponse[2].result)
          let subjectTree = sdgListResponse[2].result
          subjectTree = formatSubjectTree(subjectTree)
          this.subjectTree = subjectTree
          logger.info('after format subjectTree', subjectTree)
        }
        // rwc list
        if (!sdgListResponse[3].code) {
          logger.info('rwc', sdgListResponse[3].result)
          this.rwcList = sdgListResponse[3].result.children ? sdgListResponse[3].result.children : []
        }
        logger.info('sdgList', this.sdgList)
      }).then(() => {
        this.restoreUnitPlan(this.unitPlanId, true)
      }).catch((e) => {
        this.$message.error(this.$t('teacher.add-unit-plan.init-data-failed'))
      }).finally(() => {
        this.referenceLoading = false
      })
    },

    // 加载协作的评论和历史记录数据
    loadCollaborateData () {
      return Promise.all([
        GetCollaborateModifiedHistory({ sourceType: this.contentType['unit-plan'], sourceId: this.form.id }),
        GetCollaborateComment({ sourceType: this.contentType['unit-plan'], sourceId: this.form.id })
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
        type: this.contentType['unit-plan']
      }).then(response => {
        this.$logger.info('getReferOutcomes response', response)
        if (response.result.length) {
          this.syncData = response.result
        }
      })
    },

    restoreUnitPlan (unitPlanId, isFirstLoad) {
      if (isFirstLoad) {
        this.contentLoading = true
      }
      logger.info('restoreUnitPlan ' + unitPlanId)
      UnitPlanQueryById({
        id: unitPlanId
      }).then(response => {
        logger.info('UnitPlanQueryById ' + unitPlanId, response.result)
        const unitPlanData = response.result
        if (unitPlanData.scenarios.length === 0) {
          unitPlanData.scenarios.push({
            description: '',
            sdgId: '1',
            sdgKeyWords: []
          })
        } else {
          unitPlanData.scenarios.forEach(item => {
            if (!item.sdgId) {
              item.sdgId = undefined
            }
          })
        }
        if (!unitPlanData.gradeId) {
          unitPlanData.gradeId = undefined
        } else {
          // 年级在本国大纲不存在的情况
          if (this.gradeList.filter(grade => grade.id === unitPlanData.gradeId).length === 0) {
            this.form.gradeId = undefined
          }
        }
        if (!unitPlanData.rwc) {
          unitPlanData.rwc = undefined
        }
        if (unitPlanData.startDate && unitPlanData.endDate) {
          this.rangeDate.push(moment.utc(unitPlanData.startDate).local())
          this.rangeDate.push(moment.utc(unitPlanData.endDate).local())
        }
        this.form = unitPlanData
        if (unitPlanData.questions.length === 0) {
          this.form.questions.push({ 'name': '' })
        }
      }).finally(() => {
        this.contentLoading = false
        this.loadCollaborateData()
        // copy副本 为了判断数据变更
        this.oldForm = JSON.parse(JSON.stringify(this.form))
        this.initCompleted = true
      })
    },

    handleUploadImage (data) {
      logger.info('handleUploadImage', data)
      const formData = new FormData()
      formData.append('file', data.file, data.file.name)
      this.uploading = true
      this.$http.post(commonAPIUrl.UploadFile, formData, {
        contentType: false,
        processData: false,
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000
      })
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

    handleDescriptionSearch (index, description) {
      logger.info('handleDescriptionSearch:', index, description)
      this.form.scenarios[index].description = description
      this.debouncedGetSdgByDescription(index, description)
    },

    searchScenario (index, description) {
      logger.info('searchScenario', description)
      this.currentIndex = index
      if (typeof description === 'string' && description.trim().length >= 3) {
        // this.$refs.descriptionInputSearch.fetching = true
        ScenarioSearch({
          searchKey: this.form.scenarios[index].description
        }).then((response) => {
          logger.info('searchByDescription', response)
          this.descriptionSearchList = response.result
        })
      } else {
        this.descriptionSearchList = []
      }
    },

    // 由于Vue无法响应式处理数据元素，此处通过将数据转为scenarioObj的属性进行处理------------------废弃
    // 直接修改form.scenarios数据
    handleSelectScenario (index, scenario) {
      console.log(scenario)
      this.form.scenarios[index].description = scenario.description
      if (scenario.sdgKeyWords.length) {
        const keyWords = scenario.sdgKeyWords
        logger.info('scenario[' + index + '].sdgKeyWords', keyWords)
        this.form.scenarios[index].sdgKeyWords = keyWords
      }
    },

    handleAddMoreSdg () {
      const sdg = {
        description: '',
        sdgId: undefined,
        sdgKeyWords: []
      }
      this.form.scenarios.push(sdg)
      // this.$set(this.sdgDataObj, this.sdgPrefix + this.sdgMaxIndex, sdg)
      // logger.info('after add scenarioObj: ', this.sdgDataObj, 'sdgMaxIndex ' + this.sdgMaxIndex, ' sdgTotal ' + this.sdgTotal)
    },

    handleDeleteSdg (sdgIndex) {
      if (this.form.scenarios.length > 1) {
        this.form.scenarios.splice(sdgIndex, 1)
        logger.info('scenarios ', this.form.scenarios, 'sdgTotal ' + this.form.scenarios.length)
      } else {
        this.$message.warn(this.$t('teacher.add-unit-plan.at-least-one-sdg'))
      }
    },

    handleAddSdgTag (data) {
      const tag = {
        name: data.tagName
      }
      const sdgKey = data.sdgKey
      logger.info('handleAddSdgTag ', tag.name, sdgKey)
      this.form.scenarios[sdgKey].sdgKeyWords.push(tag)
      logger.info('after handleAddSdgTag ', this.form.scenarios[sdgKey].sdgKeyWords)
    },

    handleRemoveSdgTag (data) {
      const tagName = data.tagName
      const sdgKey = data.sdgKey
      logger.info('handleRemoveSdgTag ', tagName, sdgKey)
      this.form.scenarios[sdgKey].sdgKeyWords.splice(this.form.scenarios[sdgKey].sdgKeyWords.indexOf(tagName), 1)
      logger.info('after handleRemoveSdgTag ', this.form.scenarios[sdgKey].sdgKeyWords)
    },

    handleSelectSubject (subjects) {
      logger.info('handleSelectSubject', subjects)
      this.form.subjects = subjects
    },

    handleAddMoreQuestion () {
      const question = {
        id: null,
        name: ''
      }
      logger.info('handleAddMoreQuestion ', question)
      this.form.questions.push(question)
    },
    handleRemoveQuestion (index) {
      logger.info('handleRemoveQuestion ', index)
      if (this.form.questions.length === 1) {
        this.form.questions[index].name = ''
      } else {
        this.form.questions.splice(index, 1)
      }
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

    handleSaveUnitPlan () {
      logger.info('handleSaveUnitPlan', this.form, this.sdgDataObj, this.questionDataObj)
      const unitPlanData = Object.assign({}, this.form)
      if (this.rangeDate.length === 2) {
        const startDate = this.rangeDate[0].clone()
        const endDate = this.rangeDate[1].clone()
        unitPlanData.startDate = startDate.utc().format('YYYY-MM-DD HH:mm:ss')
        unitPlanData.endDate = endDate.utc().format('YYYY-MM-DD HH:mm:ss')
      }
      if (this.unitPlanId) {
        unitPlanData.id = this.unitPlanId
      }
      logger.info('basic unitPlanData', unitPlanData)
      UnitPlanAddOrUpdate(unitPlanData).then((response) => {
        logger.info('UnitPlanAddOrUpdate', response.result)
        if (response.success) {
          // 为了保存提示去掉
          this.oldForm = JSON.parse(JSON.stringify(this.form))
          // this.restoreUnitPlan(response.result.id, false)
          this.$message.success(this.$t('teacher.add-unit-plan.save-success'))
          this.handleBack()
        } else {
          this.$message.error(response.message)
        }
      }).then(() => {
        // this.$refs.commonFormHeader.saving = false
      })
    },
    handlePublishUnitPlan (status) {
      logger.info('handlePublishUnitPlan', {
        id: this.unitPlanId,
        status: status
      })
      this.form.status = status
      UnitPlanAddOrUpdate(this.form).then(() => {
        if (status === 1) {
          this.$message.success(this.$t('teacher.add-unit-plan.publish-success'))
        } else {
          this.$message.success('Unpublish successfully')
        }
        this.form.status = status
        this.$refs.commonFormHeader.publishing = false
      })
    },

    handleAddUnitPlanMaterial () {
      logger.info('handleAddUnitPlanMaterial ' + this.unitPlanId)
      this.$router.push({
        path: '/teacher/unit-plan-material-redirect/' + this.unitPlanId + '/create'
      })
    },

    handleAddUnitPlanTask () {
      this.$logger.info('handleAddUnitPlanTask ' + this.unitPlanId)
      // 下创建一个空的task，然后关联，然后再跳转过去
      if (!this.addLoading) {
        this.addLoading = true
        TaskAddOrUpdate({
          name: 'Unnamed Task',
          associateId: this.form.id,
          associateType: this.form.type
        }).then((response) => {
          this.$logger.info('TaskAddOrUpdate', response.result)
          if (response.success) {
            Associate({
              fromId: this.unitPlanId,
              fromType: this.contentType['unit-plan'],
              toId: response.result.id,
              toType: this.contentType.task
            }).then(response => {
              this.$logger.info('Associate response ', response)
            })
            this.addLoading = false
            this.$router.push({
              path: '/teacher/task-redirect/' + response.result.id
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

    handleAddUnitPlanLesson () {
      logger.info('handleAddUnitPlanLesson ' + this.unitPlanId)
      // 下创建一个空的lesson，然后关联，然后再跳转过去
      if (!this.addLoading) {
        this.addLoading = true
        LessonAddOrUpdate({
          name: 'Unnamed Lesson',
          associateId: this.form.id,
          associateType: this.form.type
        }).then((response) => {
          this.$logger.info('LessonAddOrUpdate', response.result)
          if (response.success) {
            Associate({
              fromId: this.unitPlanId,
              fromType: this.contentType['unit-plan'],
              toId: response.result.id,
              toType: this.contentType.lesson
            }).then(response => {
              this.$logger.info('Associate response ', response)
            })
            this.addLoading = false
            this.$router.push({
              path: '/teacher/unit-plan-lesson-redirect/' + response.result.id
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

    handleAddUnitPlanEvaluation () {
      logger.info('handleAddUnitPlanEvaluation ' + this.unitPlanId)
      // 下创建一个空的evaluation，然后关联，然后再跳转过去
      if (!this.addLoading) {
        this.addLoading = true
        EvaluationAddOrUpdate({
          name: null,
          associateId: this.form.id,
          associateType: this.form.type
        }).then((response) => {
          this.$logger.info('EvaluationAddOrUpdate', response.result)
          if (response.success) {
            Associate({
              fromId: this.unitPlanId,
              fromType: this.contentType['unit-plan'],
              toId: response.result.id,
              toType: this.contentType.evaluation
            }).then(response => {
              this.$logger.info('Associate response ', response)
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

    goBack () {
      this.$router.push({ path: '/teacher/main/created-by-me' })
    },
    handleChangeCustomTags (tags) {
      this.form.customTags = tags
    },
    handleChangeAddKeywords (tag) {
      var index = this.customTags.userTags.findIndex(item => item.name === tag.parentName)
      if (index > -1) {
        this.customTags.userTags[index].keywords.push(tag.name)
      }
    },
    handleAudioResult (data) {
      logger.info('handleAudioResult', data)
      this.currentUploading = true
      const formData = new FormData()
      formData.append('file', data, 'audio.wav')
      this.$http.post(commonAPIUrl.UploadFile, formData, {
        contentType: false,
        processData: false,
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000
      })
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
      this.$http.post(commonAPIUrl.UploadFile, formData, {
        contentType: false,
        processData: false,
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000
      })
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
    handleStartCollaborate () {
      this.$logger.info('handleStartCollaborate')
      this.collaborateContent = Object.assign({}, this.form)
      this.showCollaborateModalVisible = true
    },
    handleSelectDescription () {
      this.showMenuList = [NavigationType.specificSkills,
        NavigationType.centurySkills,
        NavigationType.learningOutcomes,
        NavigationType.assessmentType,
        NavigationType.idu
      ]
      this.selectedList = JSON.parse(JSON.stringify(this.form.learnOuts))
      this.form.learnOuts.forEach(item => {
        if (item.knowledgeId) {
          this.selectedIdList.push(item.knowledgeId)
        } else {
          this.$logger.info('parentData selected id not exist ', item)
        }
      })
      this.$logger.info('handleSelectDescription selectedList', this.selectedList, ' recommendData ', this.recommendData)
      this.selectSyncDataVisible = true
      this.defaultActiveMenu = NavigationType.learningOutcomes
    },
    handleConfirmAssociate () {
      this.$logger.info('handleConfirmAssociate')
      this.associateLibraryVisible = false
    },

    handleStartRefer () {
      this.$logger.info('handleStartRefer')
      this.selectReferMyContentVisible = true
      this.referDetailVisible = false
    },

    handleDescriptionSelectClick (data) {
      this.$logger.info('unit plan handleDescriptionSelectClick', data)
      this.selectSyncDataVisible = false
    },

    handleReferItem (data) {
      this.$logger.info('handleReferItem', data)
      this.referId = data.item.id
      this.referType = data.item.type
      this.selectReferMyContentVisible = false
      this.referDetailVisible = true
      this.$logger.info('referId ' + this.referId + ' referType ' + this.referType)
    },

    handleCloseReferDetail () {
      this.$logger.info('handleCloseReferDetail')
      this.referDetailVisible = false
      this.referId = null
      this.referType = null
      this.$refs['form'].className = 'unit-plan-form-left'
    },

    handleHoverReferBlock (data) {
      this.$logger.info('handleHoverReferBlock', data)
      this.$refs['form'].className = 'unit-plan-form-left ' + data.blockType
      document.getElementById(data.blockType).scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    },

    handleReferBlock (data) {
      this.$logger.info('handleReferBlock', data)
      if (data.blockType === 'overview') {
        this.form.overview = data.data
      }

      if (data.blockType === 'inquiry') {
        this.form.inquiry = data.data
      }

      if (data.blockType === 'sdg') {
        this.form.scenarios.push(data.data)
      }

      if (data.blockType === 'question') {
        this.form.scenarios.push(data.data)

        const question = Object.assign({
          questionId: null,
          visible: false
        }, data.data)
        logger.info('handleReferBlock AddQuestion ', question)
        this.questionMaxIndex = this.questionMaxIndex + 1
        this.questionTotal = this.questionTotal + 1
        this.$set(this.questionDataObj, this.questionPrefix + this.questionMaxIndex, question)
      }
    },

    handleReferAssociate (data) {
      this.$logger.info('handleReferAssociate', data)
      Associate({
        fromId: this.unitPlanId,
        fromType: this.contentType['unit-plan'],
        toId: data.item.id,
        toType: data.item.type
      }).then(response => {
        this.$logger.info('Associate response ', response)
        // 刷新子组件的关联数据
        this.$message.success('associate successfully!')
      })
    },
    showSelectLinkContentVisible () {
      if (!this.form.questions || this.form.questions.length === 0) {
        this.$logger.info('no relevantQuestionList')
        var that = this
        this.$confirm({
          title: 'Alert',
          content: 'Please add questions and tags before linking',
          onOk: function () {
            that.handleHoverReferBlock({ blockType: 'question' })
          }
        })
      } else {
        this.selectLinkContentVisible = true
      }
    },
    showSelectAddContentTypeVisible () {
      if (!this.form.questions || this.form.questions.length === 0) {
        this.$logger.info('no relevantQuestionList')
        var that = this
        this.$confirm({
          title: 'Alert',
          content: 'Please add questions and tags before linking',
          onOk: function () {
            that.handleHoverReferBlock({ blockType: 'question' })
          }
        })
      } else {
        this.selectAddContentTypeVisible = true
      }
    },

    handleAddTasks () {
      this.$logger.info('handleAddTasks', this.groupNameList)
      // 如果第一部分有内容，点击link激活step 到第二部分，否则提示先输入第一部分表单内容
      if (this.form.name ||
        this.form.overview ||
        this.form.inquiry ||
        this.form.scenarios.length ||
        this.form.questions.length) {
        this.groupNameMode = 'input'
        this.newTermName = ''
        this.selectLinkContentVisible = true
        this.setSessionStep(1)
        // 添加link
      } else {
        this.$message.warn('Course info is empty, please fill the form first!')
      }
    },

    handleAddTerm () {
      this.$logger.info('handleAddTerm', this.groupNameList)
      this.addCategoryLoading = true
      AddOrSaveGroupName({
        fromId: this.unitPlanId,
        fromType: this.contentType['unit-plan'],
        groupName: this.defaultGroupName + '_' + this.groupNameList.length
      }).then(response => {
        this.$logger.info('AddOrSaveGroupName', response)
        this.$refs.planLink.getAssociate()
        this.addCategoryLoading = false
      })
    },

    handleEnsureSelectedLink (data) {
      this.$logger.info('handleEnsureSelectedLink', data)
      this.selectLinkContentVisible = false
      this.getAssociate()
      // 刷新组件内的列表
      this.$refs.planLink.getAssociate()
    },

    getAssociate () {
      this.$logger.info('AddUnitPlan GetAssociate id[' + this.unitPlanId + '] fromType[' + this.contentType['unit-plan'] + ']')
      this.associateUnitPlanIdList = []
      this.associateTaskIdList = []
      this.associateTaskList = []
      GetAssociate({
        id: this.unitPlanId,
        type: this.contentType['unit-plan']
      }).then(response => {
        this.$logger.info('AddUnitPlan GetAssociate response', response)
        this.groupNameList = response.result.groups
        this.groupNameListOther = []
        this.selectedTaskList = []
        response.result.owner.forEach(item => {
          item.contents.forEach(content => {
            this.selectedTaskList.push(content.type + '-' + content.id)
            if (content.type === this.contentType['unit-plan']) {
              this.associateUnitPlanIdList.push(content.id)
              this.associateId2Name.set(content.id, content.name)
              content.questions.forEach(question => {
                this.associateQuestionList.push({
                  ...question,
                  unitName: content.name
                })
              })
            }

            if (content.type === this.contentType.task) {
              this.associateTaskIdList.push(content.id)
              this.associateId2Name.set(content.id, content.name)
              this.associateTaskList.push(content)
            }
          })
        })
        response.result.others.forEach(item => {
          if (this.groupNameListOther.indexOf(item.group) === -1) {
            this.groupNameListOther.push(item.group)
          }
          item.contents.forEach(content => {
            console.log(content)
            if (content.type === this.contentType['unit-plan']) {
              this.associateUnitPlanIdList.push(content.id)
              this.associateId2Name.set(content.id, content.name)
              content.questions.forEach(question => {
                this.associateQuestionList.push({
                  ...question,
                  unitName: content.name
                })
              })
            }

            if (content.type === this.contentType.task) {
              this.associateTaskIdList.push(content.id)
              this.associateId2Name.set(content.id, content.name)
            }
          })
        })
        if (this.groupNameListOther.length > 0) {
          this.handleSyncData()
        }
        this.newTermName = 'Untitled category_' + (this.groupNameList.length)
        this.$logger.info('AddTask GetAssociate formatted groupNameList', this.groupNameList, this.groupNameListOther)
        this.$logger.info('*******************associateUnitPlanIdList', this.associateUnitPlanIdList)
        this.$logger.info('*******************associateTaskIdList', this.associateTaskIdList)
        this.$logger.info('associateTaskIdList', this.associateTaskIdList)
      }).finally(() => {
        this.linkGroupLoading = false

        if (this.associateUnitPlanIdList.length > 0 || this.associateTaskIdList.length > 0) {
          this.loadRefLearnOuts()
        }
      })
    },

    loadRefLearnOuts () {
      this.recommendData = []
      this.recommendDataIdList = []
      if (this.associateUnitPlanIdList.length) {
        FindSourceOutcomes({
          type: this.contentType['unit-plan'],
          ids: this.associateUnitPlanIdList
        }).then(response => {
          this.$logger.info('FindSourceOutcomes unit-plan response', response)
          const recommendMap = new Map()
          response.result.forEach(item => {
            if (recommendMap.has(item.fromId)) {
              recommendMap.get(item.fromId).push(item)
            } else {
              recommendMap.set(item.fromId, [item])
            }
            this.recommendDataIdList.push(item.knowledgeId)
          })

          for (const value of recommendMap.values()) {
            this.recommendData.push({
              fromId: value[0].fromId,
              fromName: value[0].fromName,
              fromTypeName: this.type2Name[value[0].fromType],
              list: value
            })
          }
          this.$logger.info('update unit-plan recommendData ', this.recommendData)
          this.$logger.info('************************update unit-plan recommendDataIdList ', this.recommendDataIdList)
        })
      }

      if (this.associateTaskIdList.length) {
        FindSourceOutcomes({
          type: this.contentType.task,
          ids: this.associateTaskIdList
        }).then(response => {
          this.$logger.info('FindSourceOutcomes task response', response)
          const recommendMap = new Map()
          response.result.forEach(item => {
            if (recommendMap.has(item.fromId)) {
              recommendMap.get(item.fromId).push(item)
            } else {
              recommendMap.set(item.fromId, [item])
            }
            this.recommendDataIdList.push(item.knowledgeId)
          })

          for (const value of recommendMap.values()) {
            this.recommendData.push({
              fromId: value[0].fromId,
              fromName: value[0].fromName,
              fromTypeName: this.type2Name[value[0].fromType],
              list: value
            })
          }
          this.$logger.info('update task recommendData ', this.recommendData)
          this.$logger.info('************************update unit-plan recommendDataIdList ', this.recommendDataIdList)
        }).finally(() => {
          // this.loadBigIdeaLearnOuts()
        })
      }
    },
    loadBigIdeaLearnOuts () {
      // bigidea query learnout
      if (this.form.inquiry) {
        FindBigIdeaSourceOutcomes({
          bigIdea: this.form.inquiry,
          id: this.unitPlanId
        }).then(response => {
          this.$logger.info('FindBigIdeaSourceOutcomes response', response)
          const recommendMap = new Map()
          response.result.forEach(item => {
            if (recommendMap.has(item.fromId)) {
              recommendMap.get(item.fromId).push(item)
            } else {
              recommendMap.set(item.fromId, [item])
            }
            this.recommendDataIdList.push(item.knowledgeId)
          })

          for (const value of recommendMap.values()) {
            this.recommendData.push({
              fromId: value[0].fromId,
              fromName: value[0].fromName,
              fromTypeName: this.type2Name[value[0].fromType],
              list: value
            })
          }
          this.$logger.info('update unit-plan recommendData ', this.recommendData)
          this.$logger.info('************************update unit-plan recommendDataIdList ', this.recommendDataIdList)
        })
      }
    },

    handleUpdateGroupNameList () {
      this.$logger.info('handleUpdateGroupNameList')
      this.getAssociate()
    },

    handleSelectBigIdeaData (data) {
      this.selectNewBigIdea = data
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

    handleSelectIdu (data) {
      this.$logger.info('handleSelectIdu', data)
      this.selectedIduList = data
    },

    handleSelectRecommend (data) {
      this.$logger.info('handleSelectRecommend', data)
      this.selectedRecommendList = data
    },

    // TODO 自动更新选择的sync 的数据knowledgeId和name列表
    handleCancelSelectData () {
      this.selectedSyncList = []
      this.selectedCurriculumList = []
      this.selectedSpecificSkillList = []
      this.selectedCenturySkillList = []
      this.selectedAssessmentList = []
      this.selectedIduList = []
      this.selectedRecommendList = []
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
        this.selectedIduList,
        this.selectedSyncList)
      this.$logger.info('mySelectedList', this.$refs.newBrowser.mySelectedList)
      this.$logger.info('learnOuts', this.form.learnOuts)
      this.form.learnOuts = this.$refs.newBrowser.mySelectedList
      this.$refs.newBrowser.selectedRecommendList.forEach(item => {
        const index = this.form.learnOuts.findIndex(dataItem => dataItem.knowledgeId === item.knowledgeId)
        if (index === -1) {
          this.form.learnOuts.push(item)
        }
      })
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

      this.selectedIduList.forEach(data => {
        const filterLearnOuts = this.form.learnOuts.filter(item => item.knowledgeId === data.id)
        if (filterLearnOuts.length > 0) {
          return
        }
        this.form.learnOuts.push({
          knowledgeId: data.knowledgeData.id,
          name: data.knowledgeData.name,
          tagType: data.knowledgeData.tagType,
          path: data.knowledgeData.path,
          tags: data.tags
        })
      })
      const selectList = this.selectedCurriculumList.concat(this.selectedSpecificSkillList).concat(this.selectedCenturySkillList)
        .concat(this.selectedAssessmentList)
      if (this.selectIdea) {
        if (this.selectedBigIdeaList.length > 0) {
          this.form.inquiry = this.selectedBigIdeaList[0].bigIdea
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
          tagType: data.knowledgeData.tagType,
          path: data.knowledgeData.path
        })
      })
      this.$logger.info('this.form.learnOuts', this.form.learnOuts)
      this.selectSyncDataVisible = false
      this.handleCancelSelectData()
    },
    handleRemoveLearnOuts (data) {
      this.$logger.info('handleRemoveLearnOuts', data)
      var index = this.form.learnOuts.findIndex(item => (item.knowledgeId === data.knowledgeId))
      if (index > -1) {
        this.form.learnOuts.splice(index, 1)
      }
    },
    onChangeStep (current) {
      console.log('onChange:', current)
      if (typeof current === 'number') {
        this.setSessionStep(current)
        setTimeout(function () {
          const returnEle = document.querySelector('.ant-layout-content')
          if (returnEle) {
            returnEle.scrollIntoView(true) // true 是默认的
          }
        }, 100)
      }
    },
    loadCustomTags () {
      // this.$refs.customTag.tagLoading = true
      FindCustomTags({}).then((response) => {
        this.$logger.info('FindCustomTags response', response.result)
        if (response.success) {
          this.customTags = response.result
          // // 默认展示的tag分类
          // CustomTagType.plan.default.forEach(name => {
          //   this.customTagList.push(name)
          // })
          // 再拼接自己添加的
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
    focusInput (event) {
      this.$logger.info('focusInput ', event.target)
      // 设置一个父级定位专用的dom，设置class名称【root-locate-form】，
      // 然后通过事件获取到当前元素，依次往上层查询父元素，累加偏离值，直到定位元素。
      const eventDom = event.target
      let formTop = eventDom.offsetTop ? eventDom.offsetTop : 0
      let currentDom = eventDom.offsetParent
      let currentFocus = ''
      this.customTagList = []
      console.log(currentDom)
      while (currentDom !== null) {
        formTop += (currentDom ? currentDom.offsetTop : 0)
        currentDom = currentDom ? currentDom.offsetParent : undefined
        if (!currentDom) {
          break
        }
        if (currentDom.classList.contains('sdg-content-blocks')) {
          currentFocus = 'sdg'
          CustomTagType.plan.sdg.forEach(name => {
            this.customTagList.push(name)
          })
        } else if (currentDom && currentDom.classList.contains('form-block-rwc')) {
          currentFocus = 'rwc'
          CustomTagType.plan.rwc.forEach(name => {
            this.customTagList.push(name)
          })
        } else if (currentDom && currentDom.classList.contains('bigIdea')) {
          currentFocus = 'inquiry'
          CustomTagType.plan.bigIdea.forEach(name => {
            this.customTagList.push(name)
          })
        } else if (currentDom && currentDom.classList.contains('unit-question')) {
          currentFocus = 'question'
          CustomTagType.plan.question.forEach(name => {
            this.customTagList.push(name)
          })
        }
        if (currentDom && currentDom.classList.contains('root-locate-form')) {
          console.log(currentDom.classList)
          break
        }
      }
      console.log(currentFocus)
      // custom tag 自带了margin-top: 20px,这里减掉不然不对齐。
      if (currentFocus) {
        this.customTagTop = formTop - 20
        this.showCustomTag = true
        this.setRightModuleVisible(this.rightModule.customTag)
      } else {
        // CustomTagType.plan.default.forEach(name => {
        //   this.customTagList.push(name)
        // })
        // // 再拼接自己添加的
        this.customTags.userTags.forEach(tag => {
          if (this.customTagList.indexOf(tag.name === -1)) {
            this.customTagList.push(tag.name)
          }
        })
        this.showCustomTag = false
        this.customTagTop = 0
        // this.showModuleList.push(RightModule.imageUpload)
        this.setRightModuleVisible()
      }
    },

    // 切换当前的字段的点评数据，从总的collaborateCommentList筛选初当前字段相关的点评数据
    handleSwitchComment (data) {
      this.$logger.info('handleSwitchComment', data)
      this.setRightModuleVisible(this.rightModule.collaborateComment)
      if (!data.activeStatus) {
        // 关闭
        return
      }
      this.currentFieldName = data.fieldName
      this.currentCollaborateCommentList = []
      const list = []
      this.collaborateCommentList.forEach(item => {
        if (item.fieldName === data.fieldName) {
          list.push(item)
        }
      })
      this.currentCollaborateCommentList = list
      this.collaborateTop = data.top
      // this.showCollaborateCommentVisible = true
      this.$logger.info('currentCollaborateCommentList', list)
    },

    // 每次点击都重新加载一下最新数据
    handleViewCollaborate () {
      this.$logger.info('handleViewCollaborate')
      if (this.showModuleList.indexOf(this.rightModule.collaborate) !== -1) {
        this.resetRightModuleVisible()
      } else {
        this.setRightModuleVisible(this.rightModule.collaborate)
      }
      // this.showAllCollaborateCommentVisible = !this.showAllCollaborateCommentVisible
      // this.showCollaborateCommentVisible = false
      this.currentCollaborateCommentList = []
      this.showHistoryLoading = true
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
            // 清空数组
            this.form[dataItem.fieldName].splice(0, this.form[dataItem.fieldName].length)
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
    handQuestionSetting () {
      this.confirmLoading = true
      UserSetting({
        disableQuestion: !this.disableQuestion
      }).then((response) => {
        this.$logger.info('UserSetting', response.result)
        if (response.success) {
          this.$store.dispatch('GetInfo')
        } else {
          this.$message.error(response.message)
        }
      }).finally(() => {
        this.questionSettingVisible = false
        this.confirmLoading = false
      })
    },
    onChangeSwitch (checked) {
      this.disableQuestion = checked
    },
    handleEnsureSelectBigIdeaData () {
      if (!this.selectNewBigIdea) {
        this.$message.error('Please select a big idea')
        return
      }
      this.form.inquiry = this.selectNewBigIdea
      this.selectBigIdeaDataVisible = false
    },
    findQuestionsByBigIdea (bigIdea) {
      if (!bigIdea) {
        return
      }
      FindQuestionsByBigIdea({ bigIdea: bigIdea }).then(response => {
        logger.info('FindQuestionsByBigIdea ', response)
        this.recommendQuestionList = []
        if (response.success) {
          const formQuestion = this.form.questions.map(item => {
            return item.name
          })
          response.result.forEach(item => {
            if (formQuestion.indexOf(item.name) === -1) {
              if (this.recommendQuestionList.filter(q => q.name === item.name).length === 0) {
                this.recommendQuestionList.push(item)
              }
            }
          })
        }
      }).finally({})
    },
    handerInsertQuestion (question) {
      const formQuestion = this.form.questions.map(item => {
        return item.name
      })
      if (formQuestion.indexOf(question.name) > -1) {
        this.$message.warning('Question is existed')
        return
      }
      if (this.form.questions.length === 1 && !this.form.questions[0].name) {
        this.form.questions = []
      }
      this.form.questions.push(question)
    },
    handleSelectQuestion (questions) {
      logger.info('handleSelectQuestion ', questions)
      this.selectedQuestionList = questions
    },
    handleEnsureSelectQuestionData () {
      logger.info('handleEnsureSelectQuestionData ', this.selectedQuestionList)
      const formQuestion = this.form.questions.map(item => {
        return item.name
      })
      this.selectedQuestionList.forEach(q => {
        if (formQuestion.indexOf(q) === -1) {
          this.form.questions.push({ 'name': q })
        }
      })
      this.questionMoreVisible = false
    },
    setSessionStep (step) {
      this.currentActiveStepIndex = step
      sessionStorage.setItem('unit-plan-step-' + this.unitPlanId, step)
    },
    getSessionStep () {
      const oldStep = sessionStorage.getItem('unit-plan-step-' + this.unitPlanId)
      if (oldStep !== null) {
        return parseInt(oldStep)
      } else {
        return 0
      }
    },
    handleEditTask (item) {
      window.open('/teacher/task-redirect/' + item.id
        , '_blank')
    },
    handleClickTaskDetail (e) {
      this.$logger.info('handleClickTaskDetail', this.showTaskDetails)
      this.setRightModuleVisible(this.rightModule.taskDetails)
      // this.showTaskDetails = !this.showTaskDetails
      const eventDom = e.target
      let formTop = eventDom.offsetTop
      let currentDom = eventDom.offsetParent
      while (currentDom !== null) {
        formTop += currentDom.offsetTop
        currentDom = currentDom.offsetParent
        if (currentDom.classList && currentDom.classList.contains('root-locate-form')) {
          console.log(currentDom.classList)
          break
        }
      }
      this.taskDetailsTop = formTop
      console.log(this.taskDetailsTop)
      e.preventDefault()
      e.stopPropagation()
    },

    handleGradeUpdate (grade) {
      this.$logger.info('handleGradeUpdate', grade)
      this.form.gradeId = grade.id
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.unit-plan-header {
  padding-bottom: 16px;
  border-bottom: 1px solid rgb(235, 238, 240);

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
    .image-preview {
      img {
        height: 250px;
        max-width: 100%;
        /*width: 100%;*/
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
      /*font-family: PingFang SC;*/
      font-weight: 500;
      line-height: 24px;
      color: #000000;
      margin-bottom: 10px;
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

    .sdg-content-blocks {
      //width: 700px;
      position: relative;
      border: 1px solid #fff;
      box-sizing: border-box;
      //padding: 5px 50px 5px 50px;
      border-radius: 3px;
      margin-bottom: 5px;

      .scenario-description {
        margin-top: 10px;
        position: relative;

        .sdg-delete-wrapper {
          transition: all 0.2s ease-in;
          display: block;
          position: absolute;
          text-align: center;
          right: -40px;
          top: 0;
          line-height: 40px;
          width: 40px;
          height: 40px;
          cursor: pointer;
          color: @link-hover-color;
          z-index: 100;
        }

        .browse {
          padding: 10px 5px;
          position: absolute;
          right: -100px;
          top: 70px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
          border-radius: 6px;
        }

        .btn-icon {
          height: 18px;
          width: 18px;
        }

        .btn-text {
          padding: 0 5px;
        }

        .my-big-select {
          //width: 600px;
        }
      }

      &:hover {
        //border: 1px solid #15C39A;
        .sdg-delete-wrapper {
          display: block;
        }
      }

      .knowledge-delete-wrapper {
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
        display: block;
      }

      &:hover {
        //border: 1px dotted @link-hover-color;
        cursor: pointer;
        box-sizing: border-box;

        .knowledge-delete-wrapper {
          display: block;
        }
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

    .content-blocks {
      //width: 600px;
      position: relative;
      border: 1px dotted #fff;

      .scenario-description {
        margin-top: 10px;
        position: relative;

        .browse {
          padding: 10px 5px;
          position: absolute;
          right: -100px;
          top: 70px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
          border-radius: 6px;
        }

        .btn-icon {
          height: 18px;
          width: 18px;
        }

        .btn-text {
          padding: 0 5px;
        }
      }

      .sdg-delete-wrapper {
        transition: all 0.2s ease-in;
        display: block;
        position: absolute;
        text-align: center;
        right: -60px;
        top: 5px;
        line-height: 50px;
        width: 50px;
        height: 50px;
        cursor: pointer;
        color: @link-hover-color;
        z-index: 1000;
      }

      &:hover {
        //border: 1px dotted @link-hover-color;
        //box-sizing: border-box;
        .sdg-delete-wrapper {
          display: block;
        }
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
        display: block;
      }

      &:hover {
        //border: 1px dotted @link-hover-color;
        cursor: pointer;
        box-sizing: border-box;

        .knowledge-delete-wrapper {
          display: block;
        }
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
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  position: relative;

  .add-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: -20px;
    margin-top: -20px;
  }

  .add-content-item {
    width: 80%;
    margin-bottom: 20px;
    text-align: center;
    padding: 20px;
    border: 1px solid #eee;
    cursor: pointer;

    &:hover {
      background-color: fade(@outline-color, 20%);
      border: 1px solid @primary-color;
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

  &.ant-form-item {
    margin-bottom: 0px;
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

.ant-select-dropdown-menu-item {
  overflow: auto;
  white-space: normal;
}

.self-field-label {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  line-height: 32px;
  padding-right: 10px;
}

//.form-block {
//position: relative;
//box-sizing: border-box;
//margin-bottom: 10px;
//border: 1px solid #fff;
//padding: 10px 150px 10px 10px;
//border-radius: 3px;
//}

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
  margin-bottom: 10px;
  position: relative;

  &:hover {
    .my-comment-switch {
      display: block;
    }
  }

  .refer-action {
    .refer-text {
      font-family: Inter-Bold;
      line-height: 24px;
      color: #000000;
      margin-right: 10px;
    }

    .refer-btn {
      .refer {
        padding: 10px 15px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        border-radius: 6px;
      }

      .btn-icon {
        height: 12px;
        width: 12px;
      }

      .btn-text {
        padding-left: 8px;
      }
    }
  }

  /deep/ .ant-form-item label {
    font-size: 16px;
    font-weight: 500;
    font-family: Inter-Bold;
    line-height: 24px;
  }
}

.add-sdg-btn {
  padding: 15px 15px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  border-radius: 5px;
  height: 45px;

  .btn-icon {
    height: 25px;
    width: 25px;
  }

  .btn-text {
    padding-left: 10px;
  }
}

.card-wrapper {
  .unit-plan-form-left {
    position: relative;

    /deep/ .ant-steps-item-content {
      padding-right: 30px;
    }
    .form-radio-wrapper{
      /deep/ .ant-radio-wrapper{
        width:180px;
      }
      /deep/ .ant-form-item-label{
        width:170px;
        text-align: left;
      }
    }

  }

  .unit-plan-form-right {
    position: relative;

    .form-block-right {
      .img-wrapper {
        position: relative;
        width: 100%;
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

.form-input-item {
  margin-bottom: 20px;
  position: relative;
}

.my-form-textarea {
  height: 40px;
  margin-bottom: 10px;
}

.preview-wrapper-row {
  .preview-wrapper-col {
    margin: 15px;
  }

  .view-back-col {
    position: absolute;
    left: -20px;
    top: -20px;

    .view-back {
      .back-icon {
        text-align: left;

        img {
          width: 90%;
          cursor: pointer;
        }
      }
    }
  }
}

.detail-wrapper {
  background: #FFFFFF;
  border: 1px solid #D8D8D8;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  opacity: 1;
  border-radius: 10px;
}

.overview {
  .over-form-block {
    border: 1px solid #15C39A !important;
  }

  .overview-toggle {
    color: #15c39a;
    float: right;
    margin: 5px 0px;
    line-height: 20px;
    border-radius: 5px;

    &:hover {
      background-color: fade(@outline-color, 20%);
      color: @primary-color;
    }
  }

  .overview-task-details {
    //border: 1px solid #15C39A !important;
    margin: 10px 0px;
    margin-bottom: 30px;

    .task-item {
      line-height: 25px;
      //border: 1px solid #e8e8e8;
      border: 1px solid #15c39a;
      padding: 10px;;
      margin-top: 5px;
      border-radius: 5px;

      .task-action-edit {
        height: 20px;
        margin-top: 8px;
        display: flex;
        align-items: center;
        justify-content: right;
      }

      /deep/ .ant-tag {
        border-radius: 5px;
      }
    }
  }
}

.sdg {
  .sdg-form-block {
    border: 1px solid #15C39A !important;

    .my-big-select {
      //width: 600px;
    }
  }

}

.inquiry {
  .inquiry-form-block {
    border: 1px solid #15C39A !important;
  }
}

.form-block-rwc {
  margin-top: -25px;

  /deep/ .ant-form-item-label label {
    font-weight: 500;
    font-family: inherit;
    font-size: 14px;
    line-height: 20px;
    color: #000000;
  }
}

.question {
  .question-form-blocks {
    border: 1px solid #15C39A !important;
  }
}

#inquiry {
  //margin-top: -10px;
  position: relative;
}

.delete-icon {
  transition: all 0.2s ease-in;
  position: absolute;
  right: -50px;
  top: -2px;
  line-height: 40px;
  width: 40px;
  height: 40px;
  cursor: pointer;
  color: #38cfa6;
  z-index: 100;
}

.link-plan-title {
  font-weight: bold;
  margin-bottom: 15px;
}

.browse {
  font-size: 20px;
  padding: 0px 5px;
  position: absolute;
  right: -30px;
  top: 50px;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  border-radius: 6px;
}

/deep/ .ant-steps-item-title {
  font-size: 18px
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
  box-shadow: 0px 6px 10px rgba(159, 159, 159, 0.16);

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

.ensure-setting-modal {
  padding: 20px;

  .tips {
    margin-bottom: 20px;
    font-family: Inter-Bold;
    font-size: 15px;
    color: #474747;
  }

  .modal-ensure-action-line-center {
    width: 40%;
    display: flex;
    justify-content: space-between;
    margin: 0px auto;
    margin-top: 40px;
  }
}

.recommend-question {
  background: rgba(245, 245, 245, 0.5);
  margin-bottom: 6px;
  position: relative;

  .close-icon {
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
  }

  .recommend-box {
    padding: 10px;

    .title {
      font-size: 16px;
      font-weight: bold;
    }
  }

  .recommend-ul li {
    line-height: 25px;
    cursor: pointer;
    list-style-type: circle;

    .add-question {
      //float: right;
    }

    &:hover {
      color: #15c39a;
    }
  }
}

.question-more {
  top: -40px;
  left: 500px;
  position: absolute;
  cursor: pointer;
}

/deep/ .ant-breadcrumb > span:last-child {
  color: rgba(0, 0, 0, 0.45);
}

.form-block-disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

/deep/ textarea {
  border-radius: 5px;
}

code {
  margin: 0 1px;
  background: #f2f4f5;
  padding: .2em .4em;
  border-radius: 3px;
  font-size: .9em;
  border: 1px solid #eee;
  color: rgba(0, 0, 0, 0.85);
}

.grade-time {
  display: flex;
  justify-content: space-between;

  .range-time {
    /deep/ .ant-input {
      border-radius: 4px;
      font-size: 13px;
      width: 100%;
      padding: 6px 7px;
    }

    .week-time {
      position: absolute;
      /* width: 300px; */
      top: -50px;
      right: 0px
    }
  }

}

.assessment-task-button {
  border: none;
  font-size: 18px;
  font-family: Inter-Bold;
  line-height: 24px;
  color: #15C39A;
  opacity: 1;
  float: right;
  margin-top: 5px;
}

.addCategory /deep/ .anticon {
  position: absolute;
  left: 20px;
}
</style>
