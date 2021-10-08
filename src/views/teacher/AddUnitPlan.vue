<template>
  <div class="my-full-form-wrapper">
    <div class="form-header">
      <common-form-header
        ref="commonFormHeader"
        :form="form"
        :last-change-saved-time="lastChangeSavedTime"
        @view-collaborate="handleViewCollaborate"
        @back="goBack"
        @save="handleSaveUnitPlan"
        @publish="handlePublishUnitPlan"
        @collaborate="handleStartCollaborate"
      />
    </div>
    <a-card :bordered="false" :bodyStyle="{ padding: '16px 24px', height: '100%', minHeight: '1200px' }">
      <a-row class="unit-content" v-if="!contentLoading">
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
        <a-col span="24" class="main-content">
          <a-card :bordered="false" :body-style="{padding: '16px', display: 'flex', 'justify-content': 'center'}" class="card-wrapper">
            <div class="unit-plan-form-left root-locate-form" ref="form" @click="focusInput($event)">
              <a-form-model :model="form" class="my-form-wrapper">
                <a-steps :current="currentActiveStepIndex" direction="vertical" @change="onChangeStep">
                  <a-step title="Edit course info" :status="currentActiveStepIndex === 0 ? 'process':'wait'">
                    <template slot="description" v-if="currentActiveStepIndex === 0">
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
                        <comment-switch field-name="name" :is-active="showCollaborateCommentVisible && currentFieldName === 'name'" @switch="handleSwitchComment" class="my-comment-switch"/>
                        <a-form-item label="Course Name">
                          <a-input v-model="form.name" placeholder="Enter Course Name" class="my-form-input"/>
                        </a-form-item>
                      </div>

                      <div class="form-block over-form-block" id="overview">
                        <comment-switch field-name="overview" :is-active="showCollaborateCommentVisible && currentFieldName === 'overview'" @switch="handleSwitchComment" class="my-comment-switch"/>
                        <a-form-model-item class="task-audio-line" label="Course Overview">
                          <a-textarea class="overview" v-model="form.overview" placeholder="Overview" allow-clear />
                          <!--        <div class="audio-wrapper" v-if="form.audioUrl">
                            <audio :src="form.audioUrl" controls />
                            <span @click="form.audioUrl = null"><a-icon type="delete" /></span>
                          </div>
                          <a-tooltip>
                            <template slot="title">
                              Voice input
                            </template>
                            <div class="task-audio" @click="handleAddAudioOverview">
                              <img src="~@/assets/icons/lesson/microphone.png" />
                            </div>
                          </a-tooltip>-->
                        </a-form-model-item>
                      </div>

                      <div class="form-block inquiry-form-block" id="inquiry">
                        <comment-switch field-name="inquiry" :is-active="showCollaborateCommentVisible && currentFieldName === 'inquiry'" @switch="handleSwitchComment" class="my-comment-switch"/>
                        <!--                <a-divider />-->
                        <a-form-item label="Big idea* (Or statement of inquiry / Enduring understanding)" class="bigIdea" >
                          <a-input
                            v-model="form.inquiry"
                            :placeholder="$store.getters.currentRole === 'teacher' ? $t('teacher.add-unit-plan.teacher-direction-of-inquiry') : $t('teacher.add-unit-plan.expert-direction-of-inquiry')"
                            class="my-form-input inquiry"/>
                        </a-form-item>
                        <a-tooltip title="Browse" @click.stop="handleSelectDescription(true)">
                          <span class="browse">
                            <a-icon type="appstore" theme="twoTone" twoToneColor="rgba(21, 195, 154, 1)" />
                          </span>
                        </a-tooltip>
                      </div>

                      <!--            real-life-scenario-->
                      <div class="form-block ">
                        <comment-switch field-name="sdg" :is-active="showCollaborateCommentVisible && currentFieldName === 'sdg'" @switch="handleSwitchComment" class="my-comment-switch" style="top:40px"/>
                        <a-divider>Teach Goal</a-divider>
                        <a-row>
                          <a-col span="24">
                            <div class="form-block-title">
                              Choose the relevant UN sustainable development goal
                            </div>
                          </a-col>
                        </a-row>
                        <!--sdg and KeyWords-->
                        <div
                          class="sdg-content-blocks sdg-form-block"
                          id="sdg"
                          v-for="(scenario, sdgIndex) in form.scenarios"
                          :key="sdgIndex">

                          <!--description-->
                          <div class="scenario-description">
                            <div class="sdg-delete-wrapper" @click="handleDeleteSdg(sdgIndex)" v-show="form.scenarios.length > 1">
                              <a-tooltip placement="top">
                                <template slot="title">
                                  <span>{{ $t('teacher.add-unit-plan.delete-goal') }}</span>
                                </template>
                                <div class="sdg-delete">
                                  <a-icon type="delete" :style="{ fontSize: '20px' }" />
                                </div>
                              </a-tooltip>
                            </div>
                            <!--sdg-->
                            <a-form-model-item >
                              <a-select size="large" v-model="scenario.sdgId" class="my-big-select" placeholder="Select a goal from UN">
                                <a-select-option v-for="(sdg,index) in sdgList" :value="sdg.id" :key="index" :disabled="selectedSdg.indexOf(sdg.id) != -1">
                                  {{ sdg.name }}
                                </a-select-option>
                              </a-select>
                            </a-form-model-item>

                            <a-form-model-item >
                              <input-search
                                ref="descriptionInputSearch"
                                :default-value="scenario.description"
                                :key-index="sdgIndex"
                                :currend-index="currentIndex"
                                :search-list="descriptionSearchList"
                                label="description"
                                @search="handleDescriptionSearch"
                                @select-item="handleSelectScenario"
                                @reset="descriptionSearchList = []" />
                            </a-form-model-item>

                          </div>

                          <!--keywords-->
                          <!--    <a-form-model-item>
                            <sdg-tag-input :selected-keywords="scenario.sdgKeyWords" :sdg-key="sdgIndex" @add-tag="handleAddSdgTag" @remove-tag="handleRemoveSdgTag"/>
                          </a-form-model-item>-->
                        </div>
                        <a-button
                          class="add-button"
                          style="top:-20px"
                          type="link"
                          icon="plus-circle"
                          size="large"
                          @click="handleAddMoreSdg"></a-button>
                      </div>

                      <div class="form-block" v-if="!$store.getters.userInfo.disableQuestion">
                        <comment-switch field-name="question" :is-active="showCollaborateCommentVisible && currentFieldName === 'question'" @switch="handleSwitchComment" class="my-comment-switch"/>
                        <a-form-item>
                          <span slot="label">
                            Key question/line of inquiry
                            <a-tooltip title="Set key question/line of inquiry">
                              <a-icon type="exclamation-circle" style="color: #15c39a;cursor: pointer;font-size: 18px" @click="questionSettingVisible=true" />
                            </a-tooltip>
                          </span>
                          <div class="form-input-item" v-for="(question, index) in form.questions" :key="index">
                            <a-input
                              v-model="question.name"
                              class="my-form-input"
                              :placeholder="$store.getters.currentRole === 'teacher' ? $t('teacher.add-unit-plan.teacher-nth-key-question') : $t('teacher.add-unit-plan.expert-nth-key-question')"/>
                            <div class="delete-icon" @click="handleRemoveQuestion(index)" v-show="form.questions.length > 1">
                              <a-icon type="delete" :style="{ fontSize: '20px' }" />
                            </div>
                          </div>
                        </a-form-item>
                        <a-button
                          class="add-button"
                          style="top:-40px;"
                          type="link"
                          icon="plus-circle"
                          size="large"
                          @click="handleAddMoreQuestion"></a-button>
                      </div>

                      <div class="form-block">
                        <comment-switch field-name="assessment" :is-active="showCollaborateCommentVisible && currentFieldName === 'assessment'" @switch="handleSwitchComment" class="my-comment-switch"/>
                        <a-form-item label="Set assessment objectives" >
                          <a-button type="primary" @click="handleSelectDescription(false)">
                            <div class="btn-text" style="line-height: 20px">
                              Add assessment objectives
                            </div>
                          </a-button>
                        </a-form-item>

                        <!--knowledge tag-select -->
                        <ui-learn-out :learn-outs="form.learnOuts" @remove-learn-outs="handleRemoveLearnOuts" />
                      </div>

                    </template>
                  </a-step>
                  <a-step title="Link Plan content">
                    <template slot="description" v-if="currentActiveStepIndex === 1">
                      <div class="form-block">
                        <a-form-item label="Link Plan content" class="link-plan-title">
                          <a-button type="primary" :style="{'background-color': '#fff', 'color': '#000', 'border': '1px solid #D8D8D8'}" @click="handleAddLink">
                            <div class="btn-text" style="line-height: 20px">
                              + Link
                            </div>
                          </a-button>
                        </a-form-item>
                        <div class="common-link-wrapper">
                          <common-link ref="commonLink" :from-id="this.unitPlanId" :from-type="this.contentType['unit-plan']" @group-name-list-update="handleUpdateGroupNameList"/>
                        </div>
                      </div>
                    </template>
                  </a-step>
                </a-steps>
              </a-form-model>
            </div>
            <div class="unit-plan-form-right">
              <!--              优先级 所有comment预览 > 字段comment > tag选择-->
              <template v-if="showAllCollaborateCommentVisible">
                <div class="collaborate-panel" :style="{'width':'600px', 'margin-top': '0px', 'z-index': 100}">
                  <div class="icon">
                    <comment-icon />
                  </div>
                  <a-tabs default-active-key="1">
                    <a-tab-pane key="1" tab="Comment">
                      <collaborate-comment-view :source-id="unitPlanId" :source-type="contentType['unit-plan']" :comment-list="collaborateCommentList" @update-comment="handleUpdateCommentList"/>
                    </a-tab-pane>
                    <a-tab-pane key="2" tab="History" force-render>
                      <collaborate-history :history-list="historyList" @restore="handleRestoreField"/>
                    </a-tab-pane>
                  </a-tabs>
                </div>
              </template>
              <template v-else>
                <template v-if="showCollaborateCommentVisible">
                  <div class="collaborate-panel" :style="{'width':'600px', 'margin-top':collaborateTop+'px', 'z-index': 100}">
                    <collaborate-comment-panel :source-id="unitPlanId" :source-type="contentType['unit-plan']" :field-name="currentFieldName" :comment-list="currentCollaborateCommentList" @update-comment="handleUpdateCommentList"/>
                  </div>
                </template>
                <template v-else>
                  <div class="form-block-right" >
                    <!-- image-->
                    <a-form-model-item class="img-wrapper" >
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
                  <div v-show="!this.contentLoading" :style="{'width':'600px','position': 'absolute', 'top':customTagTop+'px', 'z-index': 50}">
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

      <a-modal
        v-model="showCollaborateModalVisible"
        :footer="null"
        :maskClosable="false"
        :closable="true"
        destroyOnClose
        width="800px">
        <collaborate-content
          :content-id="unitPlanId"
          :main-content="collaborateContent"
          :content-type="contentType['unit-plan']"
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
          <div class="add-content-item" @click="handleAddUnitPlanTask">
            <a>
              <content-type-icon :type="contentType.task"/>
              {{ $t('teacher.add-unit-plan.task') }}
            </a>
          </div>
          <div class="add-content-item" @click="handleAddUnitPlanLesson">
            <a >
              <content-type-icon :type="contentType.lesson"/>
              {{ $t('teacher.add-unit-plan.lesson') }}
            </a>
          </div>
          <div class="add-content-item" @click="handleAddUnitPlanEvaluation">
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
        v-model="selectReferMyContentVisible"
        :footer="null"
        destroyOnClose
        width="1150px"
        title="Refer MyContent"
        @ok="selectReferMyContentVisible = false"
        @cancel="selectReferMyContentVisible = false">
        <div class="link-content-wrapper">
          <my-content-selector :current-id="unitPlanId" :filter-type-list="['unit-plan', 'topic']" :mode="DisplayMode.Refer" />
        </div>
      </a-modal>

      <a-drawer
        destroyOnClose
        placement="right"
        :closable="false"
        :mask="false"
        width="700px"
        :visible="referDetailVisible"
        @close="handleCloseReferDetail"
      >
        <a-row class="preview-wrapper-row">
          <a-col span="2" class="view-back-col">
            <div class="view-back" @click="handleCloseReferDetail">
              <div class="back-icon">
                <img src="~@/assets/icons/common/back.png" />
              </div>
            </div>
          </a-col>
          <a-col span="24" class="preview-wrapper-col">
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
        :footer="null"
        destroyOnClose
        width="800px">
        <div class="my-modal-title" slot="title">
          Link my content
        </div>
        <div class="link-content-wrapper">
          <new-my-content
            :from-type="contentType['unit-plan']"
            :from-id="unitPlanId"
            :filter-type-list="[contentType.task,contentType.evaluation]"
            :group-name-list="groupNameList"
            :default-group-name="'Untitled Term' + groupNameList.length + 1"
            :mode="'common-link'"
            @cancel="selectLinkContentVisible = false"
            @ensure="handleEnsureSelectedLink"/>
        </div>
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
          <!-- 此处的questionIndex用于标识区分是哪个组件调用的，返回的事件数据中会带上，方便业务数据处理，可随意写，可忽略, show-menu中列出的类型才会显示-->
          <new-browser
            :select-mode="selectModel.syncData"
            question-index="_questionIndex_1"
            :sync-data="syncData"
            :show-menu="showMenuList"
            :default-active-menu="defaultActiveMenu"
            @select-big-idea="handleSelectBigIdeaData"
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
        v-model="questionSettingVisible"
        :footer="null"
        destroyOnClose
        width="600px"
        title="Set key question/line of inquiry">
        <div class="ensure-setting-modal">
          <div class="tips">
            <p>We understand that for some countries, "key questions/line of inquiry" is not required in Unit plan so you have the option to turn it off. You won't see that section once it's off.</p><p>
            </p><p style="color: red">You might turn it on or change in your account setting If you need the section in future.</p>
          </div>
          <a-switch default-checked @change="onChangeSwitch"/> <span style="color: red ;font-family: Inter-Bold;font-size: 15px;">Key question/line of inquiry</span>
          <div class="modal-ensure-action-line-center">
            <a-button class="action-item action-cancel" shape="round" @click="questionSettingVisible=false">Cancel</a-button>
            <a-button class="action-ensure action-item" type="primary" shape="round" @click="handQuestionSetting">Confirm</a-button>
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
import { GetMyGrades, Associate, GetAssociate, GetReferOutcomes } from '@/api/teacher'
import { SubjectTree } from '@/api/subject'
import { formatSubjectTree } from '@/utils/bizUtil'
import NewUiClickableKnowledgeTag from '@/components/UnitPlan/NewUiClickableKnowledgeTag'
import NewClickableSkillTag from '@/components/UnitPlan/NewClickableSkillTag'
import SkillTag from '@/components/UnitPlan/SkillTag'
import { ChangeStatus, UnitPlanAddOrUpdate, UnitPlanQueryById } from '@/api/unitPlan'
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
import CollaborateContent from '@/components/Collaborate/CollaborateContent'
import CommonFormHeader from '@/components/Common/CommonFormHeader'
import NewBrowser from '@/components/NewLibrary/NewBrowser'
import { SelectModel } from '@/components/NewLibrary/SelectModel'
import DisplayMode from '@/components/MyContent/DisplayMode'
import { LibraryEvent, LibraryEventBus } from '@/components/NewLibrary/LibraryEventBus'
import ReferPreview from '@/components/UnitPlanRefer/ReferPreview'
import UiLearnOut from '@/components/UnitPlan/UiLearnOut'
import CommonLink from '@/components/Common/CommonLink'
import NewMyContent from '@/components/MyContent/NewMyContent'
import { FindCustomTags } from '@/api/tag'
import { GetCollaborateComment, GetCollaborateModifiedHistory } from '@/api/collaborate'
import { NavigationType } from '@/components/NewLibrary/NavigationType'
import CollaborateCommentPanel from '@/components/Collaborate/CollaborateCommentPanel'
import CommentSwitch from '@/components/Collaborate/CommentSwitch'
import CollaborateCommentView from '@/components/Collaborate/CollaborateCommentView'
import commentIcon from '@/assets/icons/collaborate/comment.svg?inline'
import CollaborateHistory from '@/components/Collaborate/CollaborateHistory'
import { UserSetting } from '@/api/user'

export default {
  name: 'AddUnitPlan',
  components: {
    CollaborateHistory,
    CollaborateCommentView,
    CommentSwitch,
    CollaborateCommentPanel,
    NewMyContent,
    CommonLink,
    ReferPreview,
    CollaborateContent,
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
    UiLearnOut
  },
  props: {
    unitPlanId: {
      type: String,
      default: null
    }
  },
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

      selectedMyContentInfoItem: {},
      // 待选择的unit plan中的描述标签
      relevantQuestionList: [],
      showRelevantQuestionVisible: false,
      relevantSelectedQuestionList: [],
      relevantSelectedUnitPlan: {},

      subKnowledgeId2InfoMap: new Map(),
      descriptionId2InfoMap: new Map(),

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
        gradeIds: []
      },

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

      // BigIdeaList
      selectedBigIdeaList: [],
      selectIdea: false,
      showCustomTag: false,
      customTagTop: 300,
      customTagList: [],
      userTags: {},
      NavigationType: NavigationType,
      defaultActiveMenu: NavigationType.learningOutcomes,
      showMenuList: [ NavigationType.sdg, NavigationType.specificSkills, NavigationType.centurySkills, NavigationType.learningOutcomes ],

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
      questionSettingVisible: false,
      disableQuestion: true
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
    }
  },
  created () {
    logger.info('unitPlanId ' + this.unitPlanId + ' ' + this.$route.path)
    // 初始化关联事件处理
    MyContentEventBus.$on(MyContentEvent.ToggleSelectContentItem, this.handleToggleSelectContentItem)
    MyContentEventBus.$on(MyContentEvent.ReferContentItem, this.handleReferItem)
    LibraryEventBus.$on(LibraryEvent.ContentListSelectClick, this.handleDescriptionSelectClick)
    this.initData()
    this.getAssociate()
    this.loadUserTags()
    this.debouncedGetSdgByDescription = debounce(this.searchScenario, 300)
  },
  beforeDestroy () {
    MyContentEventBus.$off(MyContentEvent.ToggleSelectContentItem, this.handleToggleSelectContentItem)
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
        SubjectTree({ curriculumId: this.$store.getters.bindCurriculum })
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
        this.form = unitPlanData
        if (unitPlanData.questions.length === 0) {
          this.form.questions.push({ 'name': '' })
        }
      }).finally(() => {
        this.contentLoading = false
        this.loadCollaborateData()
      })
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
      this.form.questions.splice(index, 1)
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

    autoSave () {

    },

    handleSaveUnitPlan () {
      logger.info('handleSaveUnitPlan', this.form, this.sdgDataObj, this.questionDataObj)
      const unitPlanData = {
        image: this.form.image,
        inquiry: this.form.inquiry,
        name: this.form.name,
        status: this.form.status,
        subjects: this.form.subjects,
        scenarios: this.form.scenarios,
        questions: this.form.questions,
        customTags: this.form.customTags,
        overview: this.form.overview,
        subjectIds: this.form.subjectIds,
        gradeIds: this.form.gradeIds,
        learnOuts: this.form.learnOuts
      }

      if (this.unitPlanId) {
        unitPlanData.id = this.unitPlanId
      }
      logger.info('basic unitPlanData', unitPlanData)
      logger.info('question unitPlanData', unitPlanData)
      UnitPlanAddOrUpdate(unitPlanData).then((response) => {
        logger.info('UnitPlanAddOrUpdate', response.result)
        if (response.success) {
          this.restoreUnitPlan(response.result.id, false)
          this.$message.success(this.$t('teacher.add-unit-plan.save-success'))
        } else {
          this.$message.error(response.message)
        }
      }).then(() => {
        this.$refs.commonFormHeader.saving = false
      })
    },
    handlePublishUnitPlan () {
      logger.info('handlePublishUnitPlan', {
        id: this.unitPlanId,
        status: 1
      })
      ChangeStatus({
        id: this.unitPlanId,
        status: 1
      }).then(() => {
        this.$message.success(this.$t('teacher.add-unit-plan.publish-success'))
        this.form.status = 1
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
          associateType: this.form.type }).then((response) => {
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

    handleToggleSelectContentItem (data) {
      this.$logger.info('handleToggleSelectContentItem', data)
      this.selectedMyContentInfoItem = data
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
    handleChangeUserTags (tags) {
      this.form.customTags = tags
    },
    handleChangeAddKeywords (tag) {
      var index = this.userTags.userTags.findIndex(item => item.name === tag.parentName)
      if (index > -1) {
        this.userTags.userTags[index].keywords.push(tag.name)
      }
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
    handleStartCollaborate () {
      this.$logger.info('handleStartCollaborate')
      this.collaborateContent = Object.assign({}, this.form)
      this.showCollaborateModalVisible = true
    },
    handleSelectDescription (selectIdea) {
      this.selectSyncDataVisible = true
      this.selectIdea = selectIdea
      if (selectIdea) {
        this.showMenuList = [NavigationType.sdg]
        this.defaultActiveMenu = NavigationType.sdg
      } else {
        this.showMenuList = [ NavigationType.specificSkills, NavigationType.centurySkills, NavigationType.learningOutcomes ]
        this.defaultActiveMenu = NavigationType.learningOutcomes
      }
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
        this.$message.success('success!')
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

    handleAddLink () {
      this.$logger.info('handleAddLink', this.groupNameList)

      // 如果第一部分有内容，点击link激活step 到第二部分，否则提示先输入第一部分表单内容
      if (this.form.name ||
        this.form.overview ||
        this.form.inquiry ||
        this.form.scenarios.length ||
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
      this.$logger.info('AddUnitPlan GetAssociate id[' + this.unitPlanId + '] fromType[' + this.contentType['unit-plan'] + ']')
      GetAssociate({
        id: this.unitPlanId,
        type: this.contentType['unit-plan']
      }).then(response => {
        this.$logger.info('AddUnitPlan GetAssociate response', response)
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
        })
        if (this.groupNameList.length > 0 || this.groupNameListOther.length > 0) {
          this.handleSyncData()
        }
        this.$logger.info('AddUnitPlan GetAssociate formatted groupNameList', this.groupNameList, this.groupNameListOther)
      }).finally(() => {
        this.linkGroupLoading = false
      })
    },

    handleUpdateGroupNameList () {
      this.$logger.info('handleUpdateGroupNameList')
      this.getAssociate()
    },

    handleSelectBigIdeaData (data) {
      this.$logger.info('handleSelectBigIdeaData', data)
      this.selectedBigIdeaList = data
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
      this.selectSyncDataVisible = false
    },

    // TODO 自动更新选择的sync 的数据knowledgeId和name列表
    handleEnsureSelectData () {
      this.$logger.info('handleEnsureSelectData',
        this.selectedCurriculumList,
        this.selectedSpecificSkillList,
        this.selectedCenturySkillList,
        this.selectedBigIdeaList,
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
          tagType: data.knowledgeData.tagType
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
    onChangeStep (current) {
      console.log('onChange:', current)
      if (typeof current === 'number') {
        this.currentActiveStepIndex = current
        setTimeout(function () {
            const returnEle = document.querySelector('.ant-layout-content')
            if (returnEle) {
              returnEle.scrollIntoView(true) // true 是默认的
            }
        }, 100)
      }
    },
    loadUserTags () {
      // this.$refs.customTag.tagLoading = true
      FindCustomTags({}).then((response) => {
        this.$logger.info('FindCustomTags response', response.result)
        if (response.success) {
          this.userTags = response.result
          // 默认展示的tag分类
          CustomTagType.plan.default.forEach(name => {
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
        try {
          const eventDom = event.target
          let formTop = eventDom.offsetTop
          let currentDom = eventDom.offsetParent
          let currentFocus = ''
          this.customTagList = []
          // console.log(currentDom.classList)
          while (currentDom !== null) {
            formTop += currentDom.offsetTop
            currentDom = currentDom.offsetParent
            if (currentDom.classList.contains('sdg-content-blocks')) {
              currentFocus = 'sdg'
              CustomTagType.plan.sdg.forEach(name => {
                this.customTagList.push(name)
              })
            } else if (currentDom.classList.contains('bigIdea')) {
              currentFocus = 'inquiry'
              CustomTagType.plan.bigIdea.forEach(name => {
                this.customTagList.push(name)
              })
            }
            if (currentDom.classList && currentDom.classList.contains('root-locate-form')) {
              console.log(currentDom.classList)
              break
            }
          }
          console.log(currentFocus)
          // custom tag 自带了margin-top: 20px,这里减掉不然不对齐。
          if (currentFocus) {
            this.customTagTop = formTop - 20
            this.showCustomTag = true
            this.showCollaborateCommentVisible = false
            this.showAllCollaborateCommentVisible = false
          } else {
            CustomTagType.plan.default.forEach(name => {
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
        } catch (e) {
        console.log(e)
      }
    },

    // 切换当前的字段的点评数据，从总的collaborateCommentList筛选初当前字段相关的点评数据
    handleSwitchComment (data) {
      this.$logger.info('handleSwitchComment', data)
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
      this.$logger.info('handleViewCollaborate')
      this.showCollaborateCommentVisible = false
      this.currentCollaborateCommentList = []
      this.loadCollaborateData().then(() => {
        this.$logger.info('loadCollaborateData loaded')
      }).finally(() => {
        this.showAllCollaborateCommentVisible = !this.showAllCollaborateCommentVisible
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
          this.$message.success('restore ' + dataItem.fieldDisplayName + ' success!')
        })
      }
      this.$logger.info('after handleRestoreField', this.form)
    },
    handQuestionSetting () {
      UserSetting({
        disableQuestion: this.disableQuestion
      }).then((response) => {
        this.$logger.info('UserSetting', response.result)
        if (response.success) {
          this.$store.dispatch('GetInfo')
        } else {
          this.$message.error(response.message)
        }
      }).finally(() => {
        this.questionSettingVisible = false
      })
    },
    onChangeSwitch (checked) {
      this.disableQuestion = !checked
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.unit-plan-header {
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
    .image-preview {
      img {
        /*max-width: 100%;*/
        max-height: 250px;
        width: 100%;
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
      /*font-weight: bold;*/
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

      .scenario-description{
        margin-top: 10px;
        position: relative;

        .sdg-delete-wrapper {
          transition: all 0.2s ease-in;
          display: block;
          position: absolute;
          text-align: center;
          right:-40px;
          top: 0;
          line-height: 40px;
          width: 40px;
          height: 40px;
          cursor: pointer;
          color: @link-hover-color;
          z-index: 100;
        }
        .browse{
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
        .my-big-select{
          width: 600px;
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
      width: 600px;
      position: relative;
      border: 1px dotted #fff;
      .scenario-description{
        margin-top: 10px;
        position: relative;
        .browse{
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
        right:-60px;
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
  &.ant-form-item{
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
  width: 600px;
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
      .refer{
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
  /deep/ .ant-form-item label{
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

.card-wrapper{
  .unit-plan-form-left {
    position: relative;
    width: 700px;
  }

  .unit-plan-form-right {
    position: relative;
    width: 600px;
    .form-block-right{
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
  }
}

.form-input-item {
  margin-bottom: 20px;
  position: relative;
}

.preview-wrapper-row{
  .preview-wrapper-col{
    margin: 15px;
  }
  .view-back-col {
    position: absolute;
    left: -20px;
    top: -20px;
    .view-back{
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
}

.sdg {
  .sdg-form-block {
    border: 1px solid #15C39A !important;
    .my-big-select{
      width: 600px;
    }
  }

}

.inquiry {
  .inquiry-form-block {
    border: 1px solid #15C39A !important;
  }
}

.question {
  .question-form-blocks {
    border: 1px solid #15C39A !important;
  }
}
#inquiry{
  margin-top: -10px;
  position: relative;
}

.delete-icon {
  transition: all 0.2s ease-in;
  position: absolute;
  right: -50px;
  top: 0px;
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
.browse{
  font-size: 20px;
  padding: 0px 5px;
  position: absolute;
  right: 0px;
  top: 50px;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  border-radius: 6px;
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
</style>
