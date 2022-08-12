<template>
  <div class="my-content">
    <div class="filter-line">
      <div class="status-tab">
        <div class="toggle-mode-type-wrapper">
          <div class="toggle-mode-type">
            <div class="toggle-mode">
              <div :class="{'mode-item': true, 'knowledge-active-mode' : currentStatus === 1}" @click="toggleStatus(1)">
                Owned by others
              </div>
              <div :class="{'mode-item': true, 'skill-active-mode' : currentStatus === 0}" @click="toggleStatus(0)">
                Owned by me
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="type-owner">
        <div class="my-search">
          <a-input-search
            placeholder="Search"
            v-model="searchText"
            @search="triggerSearch"
            @pressEnter="triggerSearch"
            size="large"
          >
          </a-input-search>
        </div>
        <div class="type-filter">
          <a-dropdown>
            <a-menu slot="overlay">
              <!--              <a-menu-item disabled>-->
              <!--                <span>{{ $t('teacher.my-content.choose-types-of-content') }}</span>-->
              <!--              </a-menu-item>-->
              <a-menu-item @click="toggleType('all-type', $t('teacher.my-content.all-type'))">
                <span>{{ $t('teacher.my-content.all-type') }}</span>
              </a-menu-item>
              <a-menu-item @click="toggleType('unit-plan', $t('teacher.my-content.unit-plan-type'))">
                <span>{{ $t('teacher.my-content.unit-plan-type') }}</span>
              </a-menu-item>
              <template v-if="$store.getters.roles.indexOf('teacher') !== -1">
                <a-menu-item @click="toggleType('evaluation', $t('teacher.my-content.evaluation-type'))">
                  <span>{{ $t('teacher.my-content.evaluation-type') }}</span>
                </a-menu-item>
              </template>
              <a-menu-item @click="toggleType('task', $t('teacher.my-content.tasks-type') )">
                <span>{{ $t('teacher.my-content.tasks-type') }}</span>
              </a-menu-item>

            </a-menu>
            <a-button
              class="type-filter-button"
              style="padding: 0 20px;display:flex; align-items:center ;height: 40px;border-radius: 6px;background: #FFFFFF;font-family: Inter-Bold;color: #182552;">
              <span v-if="currentTypeLabel">{{ currentTypeLabel }}</span> <span v-else>Choose type(s)of content</span>
              <a-icon type="caret-down" /> </a-button>
          </a-dropdown>
        </div>
        <div class="view-mode-toggle">
          <div class="view-mode">
            <div :class="{'view-mode-item': true, 'active-view': viewMode === 'img'}" @click="toggleViewMode('img')">
              <pubu-svg />
            </div>
            <div :class="{'view-mode-item': true, 'active-view': viewMode === 'list'}" @click="toggleViewMode('list')">
              <liebiao-svg />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content-wrapper">
      <a-skeleton :loading="skeletonLoading" active>
        <div class="content-list">
          <a-list
            size="large"
            :pagination="pagination"
            :data-source="myContentList"
            :loading="loading"
            v-if="viewMode === 'list'"
          >
            <a-list-item class="my-list-item" slot="renderItem" key="item.key" slot-scope="item">

              <a-tooltip :title="item.message">
                <span class="content-info-left" @click="handleViewDetail(item.content)">
                  <content-type-icon :type="item.content.type" />

                  <span class="name-content">
                    {{ item.content.name ? item.content.name : 'Unnamed' }}
                  </span>

                </span>
              </a-tooltip>

              <span class="content-info-right">

                <span class="update-time" >
                  {{ item.updateTime || item.createTime | dayjs }}
                </span>

                <span class="fromer">
                  From {{ item.fromerUser }}
                </span>

                <div class="action">
                  <div slot="actions">
                    <!-- 接受并且同意协同-->
                    <div class="action-wrapper" v-if="currentStatus === 0 || (item.receiveStatus === 1 && item.agreeFlag === 1)">

                      <!-- Task: 外置teacher-pace, student-pace, Edit, 折叠Delete, Duplicate, Previous session-->
                      <!--                      <template v-if="item.content.type === typeMap.task">-->
                      <!--                        <div class="start-session-wrapper action-item-wrapper">-->
                      <!--                          <div class="session-btn content-list-action-btn" @click="handleStartSessionHistory(item.content,1)">-->
                      <!--                            <div class="session-btn-icon">-->
                      <!--                              <teacher-presenting />-->
                      <!--                            </div>-->
                      <!--                            <div class="session-btn-text"> Teacher-paced</div>-->
                      <!--                          </div>-->
                      <!--                        </div>-->
                      <!--                        <div class="start-session-wrapper action-item-wrapper">-->
                      <!--                          <div class="session-btn content-list-action-btn" @click="handleStartSessionHistory(item.content,2)">-->
                      <!--                            <div class="session-btn-icon">-->
                      <!--                              <student-pace />-->
                      <!--                            </div>-->
                      <!--                            <div class="session-btn-text"> Student-paced</div>-->
                      <!--                          </div>-->
                      <!--                        </div>-->
                      <!--                      </template>-->
                      <!-- Unit plan:外置Edit，折叠Delete, Duplicate-->

                      <div class="start-session-wrapper action-item-wrapper">
                        <div class="session-btn content-list-action-btn" @click="handleEditItem(item.content)">
                          <div class="session-btn-icon">
                            <bianji />
                          </div>
                          <div class="session-btn-text"> {{ $t('teacher.my-content.action-edit') }}</div>
                        </div>
                      </div>

                      <div class="more-action-wrapper action-item-wrapper" >
                        <a-dropdown>
                          <a-icon type="more" style="margin-right: 8px" />
                          <a-menu slot="overlay">
                            <a-menu-item>
                              <a-popconfirm title="Delete collaborate?" ok-text="Yes" @confirm="handleDeleteItem(item)" cancel-text="No">
                                <a>
                                  <a-icon type="delete" theme="filled" /> {{ $t('teacher.my-content.action-delete') }}
                                </a>
                              </a-popconfirm>
                            </a-menu-item>
                            <a-menu-item>
                              <a @click="handleDuplicateItem(item)">
                                <a-icon type="copy" /> Duplicate
                              </a>
                            </a-menu-item>
                            <!-- Task里面有teacher-pace, student-pace, previous session -->
                            <!--                            <template v-if="item.content.type === typeMap.task">-->
                            <!--                              <a-menu-item>-->
                            <!--                                <a @click="handleViewPreviewSession(item.content)">-->
                            <!--                                  <previous-sessions-svg /> Previous session-->
                            <!--                                </a>-->
                            <!--                              </a-menu-item>-->
                            <!--                            </template>-->

                          </a-menu>
                        </a-dropdown>
                      </div>
                    </div>
                    <div class="action-wrapper" v-else>
                      <!--  邀请未接受状态-->
                      <template v-if="item.receiveStatus === 0 ">
                        <!--  需要审批的情况-->
                        <template v-if="item.linkUser !== 0 && item.link.approveFlag">
                          <div class="action-item-wrapper action-item-block-wrapper" >
                            <div class="session-btn content-list-action-btn" @click="handleApply(item)">
                              <div class="session-btn-text">Apply</div>
                            </div>
                          </div>
                        </template>
                        <template v-else>
                          <div class="action-item-wrapper action-item-block-wrapper" >
                            <div class="session-btn content-list-action-btn" @click="handleAccept(item,collaborateStatus.agree)">
                              <div class="session-btn-text">Agree</div>
                            </div>
                          </div>
                          <div class="action-item-wrapper action-item-block-wrapper">
                            <div class="session-btn content-list-action-btn" @click="handleAccept(item,collaborateStatus.disAgree)">
                              <div class="session-btn-text">Disagree</div>
                            </div>
                          </div>
                        </template>
                      </template>

                      <!--  已接受拒绝状态-->
                      <template v-else>
                        <span v-if="item.agreeFlag === collaborateStatus.disAgree">
                          <a-tag color="red">
                            Not Accept
                          </a-tag>
                        </span>

                        <span v-if="item.agreeFlag === collaborateStatus.refuse">
                          <a-tag color="red">
                            Application was rejected
                          </a-tag>
                        </span>

                        <span v-if="item.agreeFlag === collaborateStatus.apply">
                          <a-tag color="red">Wait for approval</a-tag>
                        </span>

                      </template>

                    </div>
                  </div>
                </div>
              </span>
            </a-list-item>
          </a-list>
          <a-list
            :grid="{ gutter: 16, column: 4 }"
            size="large"
            :pagination="pagination"
            :data-source="myContentList"
            :loading="loading"
            v-if="viewMode === 'img'">
            <a-list-item slot="renderItem" key="item.key" slot-scope="item">
              <a-card class="cover-card" >
                <div class="mask"></div>
                <div class="mask-actions" v-if="currentStatus === 0 || (item.receiveStatus === 1 && item.agreeFlag === 1)">
                  <div class="action-item action-item-top">
                    <a-dropdown>
                      <a-icon type="more" style="margin-right: 8px" class="more-icon" />
                      <a-menu slot="overlay">
                        <a-menu-item>
                          <a-popconfirm title="Delete collaborate?" ok-text="Yes" @confirm="handleDeleteItem(item)" cancel-text="No">
                            <a>
                              <a-icon type="delete" theme="filled" /> {{ $t('teacher.my-content.action-delete') }}
                            </a>
                          </a-popconfirm>
                        </a-menu-item>
                        <a-menu-item>
                          <a @click="handleDuplicateItem(item)">
                            <a-icon type="copy" /> Duplicate
                          </a>
                        </a-menu-item>
                        <!-- Task里面有teacher-pace, student-pace, previous session -->
                        <!--                        <template v-if="item.content.type === typeMap.task">-->
                        <!--                          <a-menu-item>-->
                        <!--                            <a @click="handleViewPreviewSession(item)">-->
                        <!--                              <previous-sessions-svg /> Previous session-->
                        <!--                            </a>-->
                        <!--                          </a-menu-item>-->
                        <!--                        </template>-->
                      </a-menu>
                    </a-dropdown>
                  </div>
                  <div class="action-item action-item-center">
                    <!--                    <div class="session-btn session-btn-left" @click.stop="handleStartSessionHistory(item.content,1)" v-if="item.content.type === typeMap['task']" >-->
                    <!--                      <div class="session-btn-text">-->
                    <!--                        <teacher-presenting />-->
                    <!--                        Teacher-paced-->
                    <!--                      </div>-->
                    <!--                    </div>-->
                    <!--                    <div class="session-btn session-btn-right" @click.stop="handleStartSessionHistory(item.content,2)" v-if="item.content.type === typeMap['task']">-->
                    <!--                      <div class="session-btn-text">-->
                    <!--                        <student-pace />-->
                    <!--                        Student-paced-->
                    <!--                      </div>-->
                    <!--                    </div>-->
                  </div>
                  <div class="action-item action-item-bottom" >
                    <div class="session-btn" @click.stop="handleEditItem(item.content)">
                      <div class="session-btn-icon content-list-action-btn">
                        <bianji />
                      </div>
                      <div class="session-btn-text">Edit</div>
                    </div>
                    <div class="session-btn" @click.stop="handleViewDetail(item.content)">
                      <div class="session-btn-icon content-list-action-btn">
                        <a-icon type="eye" theme="filled" />
                      </div>
                      <div class="session-btn-text">Preview</div>
                    </div>
                  </div>
                </div>
                <div class="mask-actions" style="display: block" v-else>
                  <!--  邀请未接受状态-->
                  <template v-if="item.receiveStatus === 0 ">
                    <!--  需要审批的情况-->
                    <template v-if="item.linkUser !== 0 && item.link.approveFlag">

                      <div class="action-item action-item-center">
                        <div class="session-btn session-btn-left" @click.stop="handleApply(item)" >
                          <div class="session-btn-text">
                            Apply
                          </div>
                        </div>
                      </div>

                    </template>
                    <template v-else>
                      <div class="action-item action-item-center">
                        <div class="session-btn session-btn-left" style="margin-top: 30px;" @click.stop="handleAccept(item,collaborateStatus.agree)" >
                          <div class="session-btn-text">
                            Agree
                          </div>
                        </div>
                        <div class="session-btn session-btn-right" style="background: #ffa39e;" @click.stop="handleAccept(item,collaborateStatus.disAgree)">
                          <div class="session-btn-text">
                            Disagree
                          </div>
                        </div>
                      </div>
                    </template>
                  </template>

                  <!--  已接受拒绝状态-->
                  <template v-else>
                    <div class="action-item" v-if="item.agreeFlag === collaborateStatus.disAgree" style="margin-top: 50px;">
                      <a-tag color="red" class="tag-info">
                        Application was rejected
                      </a-tag>
                    </div>

                    <div class="action-item" v-if="item.agreeFlag === collaborateStatus.apply" style="margin-top: 50px;">
                      <div class="session-btn" >
                        <a-tag color="red" class="tag-info">
                          Wait for approval
                        </a-tag>
                      </div>
                    </div>

                  </template>

                  <!--                  <div class="action-item action-item-bottom" style="margin-top: 20px;">-->
                  <!--                    <div class="session-btn" @click.stop="handleViewDetail(item.content)">-->
                  <!--                      <div class="session-btn-icon content-list-action-btn">-->
                  <!--                        <a-icon type="eye" theme="filled" />-->
                  <!--                      </div>-->
                  <!--                      <div class="session-btn-text">Preview</div>-->
                  <!--                    </div>-->
                  <!--                  </div>-->
                </div>

                <div class="cover-img" :style="{backgroundImage: 'url(' + item.content.image + ')'}"></div>

                <a-card-meta class="my-card-meta-info" :title="item.content.name ? item.content.name : 'Untitled'" :description="item.updateTime || item.createTime | dayjs" @click="handleViewDetail(item)">
                  <content-type-icon :type="item.content.type" slot="avatar"></content-type-icon>
                </a-card-meta>

              </a-card>
            </a-list-item>
          </a-list>
        </div>
      </a-skeleton>

      <a-drawer
        destroyOnClose
        placement="right"
        :closable="false"
        width="1000px"
        :visible="previewVisible"
        @close="handlePreviewClose"
      >
        <div class="preview-wrapper-row">
          <div class="view-back">
            <a-button type='primary' class='preview-back-btn' shape='round' @click="handlePreviewClose"><a-icon type="left" :style="{'font-size': '12px'}" />Back</a-button>
          </div>
          <div class="detail-wrapper" v-if="previewCurrentId && previewType">
            <common-preview-v2 :id="previewCurrentId" :type="previewType" />
          </div>
        </div>
      </a-drawer>

      <a-modal
        v-model="viewPreviewSessionVisible"
        :footer="null"
        :title="null"
        :closable="false"
        destroyOnClose
        :dialog-style="{ top: '30px' }"
        width="1000px">
        <modal-header title="Previous session" @close="viewPreviewSessionVisible = false" :white="true"/>
        <div class="preview-session-wrapper">
          <a-tabs default-active-key="1" @change="handleTabChange">
            <a-tab-pane key="1" tab="Active">
              <class-list-table ref="classList1" :slide-id="currentPreviewLesson.presentationId" :classData="currentPreviewLesson" v-if="currentPreviewLesson && currentPreviewLesson.presentationId" :active="true"/>
              <div class="no-session" v-else>
                <no-more-resources tips="Not exist previous sessions"/>
              </div>
            </a-tab-pane>
            <a-tab-pane key="2" tab="Archived " force-render>
              <class-list-table ref="classList2" :slide-id="currentPreviewLesson.presentationId" :classData="currentPreviewLesson" v-if="currentPreviewLesson && currentPreviewLesson.presentationId" :active="false"/>
              <div class="no-session" v-else>
                <no-more-resources tips="Not exist previous sessions"/>
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-modal>

      <a-modal
        v-model="oldSelectSessionVisible"
        :footer="null"
        :title="null"
        :closable="true"
        destroyOnClose
        :dialog-style="{ top: '50px' }"
        width="750px">
        <div>
          <old-session-list :task-id='oldSelectSessionTaskId' :session-list="sessionList" @start-new-session="handleStartSession" @cancel="oldSelectSessionVisible=false" :mode="sessionMode" />
        </div>
      </a-modal>

      <a-modal
        title="Add session tags"
        v-model="lessonSelectTagVisible"
        :maskClosable="false"
        :closable="true"
        destroyOnClose
        width="800px">
        <div>
          <div>
            <custom-tag
              :user-tags="userTags"
              :custom-tags-list="['class']"
              :selected-tags-list="sessionTags"
              ref="customTag"
              @change-user-tags="handleSelectedSessionTags"></custom-tag>
          </div>
        </div>
        <template slot="footer">
          <a-button key="back" @click="lessonSelectTagVisible=false">
            Cancel
          </a-button>
          <a-button key="submit" type="primary" :loading="startLoading" @click="handleStartSession()">
            Start
          </a-button>
        </template>
      </a-modal>
    </div>
  </div>
</template>

<script>

import * as logger from '@/utils/logger'
import { Duplicate } from '@/api/teacher'
import { CollaborateStatus, typeMap } from '@/const/teacher'
import ContentStatusIcon from '@/components/Teacher/ContentStatusIcon'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import {
  CollaboratesAgree,
  CollaboratesQueryShared,
  CollaboratesQuerySharedOwner, DeleteByMeCollaborate,
  DeleteCollaborate,
  ReceiveCollaborate
} from '@/api/collaborate'
import { lessonHost, lessonStatus } from '@/const/googleSlide'
import { StartLesson } from '@/api/lesson'
import storage from 'store'
import TvSvg from '@/assets/icons/lesson/tv.svg?inline'
import EvaluationSvg from '@/assets/icons/common/evaluation.svg?inline'
import PreviousSessionsSvg from '@/assets/icons/common/PreviousSessions.svg?inline'
import EditSvg from '@/assets/icons/common/Edit.svg?inline'
import CopySvg from '@/assets/icons/common/copy.svg?inline'
import Bianji from '@/assets/icons/common/Bianji.svg?inline'
import StartEvaluation from '@/assets/icons/common/StartEvaluation.svg?inline'
import StartSessionSvg from '@/assets/icons/common/StartSession.svg?inline'
import TeacherPresenting from '@/assets/icons/common/TeacherPresenting.svg?inline'
import StudentPace from '@/assets/icons/common/StudentPace.svg?inline'
import CustomTag from '@/components/UnitPlan/CustomTag'
import LiebiaoSvg from '@/assets/svgIcon/myContent/liebiao.svg?inline'
import PubuSvg from '@/assets/svgIcon/myContent/pubu.svg?inline'
import { CustomTagType } from '@/const/common'
import CommonPreviewV2 from '@/components/Common/CommonPreviewV2'
import NoMoreResources from '@/components/Common/NoMoreResources'
import ModalHeader from '@/components/Common/ModalHeader'
import { FindCustomTags } from '@/api/tag'
import OldSessionList from '@/components/Teacher/OldSessionList'
import ClassListTable from '@/components/Teacher/ClassListTable'
import PSSvg from '@/assets/svgIcon/myContent/previous_session.svg'
import CollaborateSvg from '@/assets/icons/collaborate/collaborate_group.svg'
import { FindMyClasses } from '@/api/evaluation'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { mapActions, mapState } from 'vuex'
import { GoogleAuthCallBackMixin } from '@/mixins/GoogleAuthCallBackMixin'

export const SHARED_VIEW_MODE = 'view_mode_shared'

  export default {
    name: 'Shared',
    components: {
      OldSessionList,
      NoMoreResources,
      CommonPreviewV2,
      ClassListTable,
      ContentStatusIcon,
      ContentTypeIcon,
      TvSvg,
      EvaluationSvg,
      PreviousSessionsSvg,
      StartEvaluation,
      StartSessionSvg,
      Bianji,
      TeacherPresenting,
      StudentPace,
      CustomTag,
      ModalHeader,
      EditSvg,
      CopySvg,
      LiebiaoSvg,
      PubuSvg,
      PSSvg,
      CollaborateSvg
    },
    mixins: [ GoogleAuthCallBackMixin ],
    data () {
      return {
        skeletonLoading: true,
        loading: true,
        loadFailed: false,
        myContentList: [],
        currentStatus: 1,
        currentType: 'all-type',
        currentTypeLabel: this.$t('teacher.my-content.all-type'),
        currentOwner: 'all-owner',
        currentOwnerLabel: this.$t('teacher.my-content.all-owner'),

        previewVisible: false,
        previewCurrentId: '',
        previewType: '',
        currentPreviewLesson: null,

        pagination: {
          onChange: page => {
            logger.info('pagination onChange', page)
            this.pageNo = page
            this.loadMyContent()
          },
          showTotal: total => `Total ${total} items`,
          total: 0,
          pageSize: 15
        },
        pageNo: 1,

        typeMap: typeMap,
        collaborateStatus: CollaborateStatus,
        viewPreviewSessionVisible: false,
        PPTCommentPreviewVisible: false,
        classList: [],
        viewMode: storage.get(SHARED_VIEW_MODE) ? storage.get(SHARED_VIEW_MODE) : 'list',
        lessonSelectTagVisible: false,
        sessionTags: [],
        sessionItem: {},
        startLoading: false,
        userTags: {},

        // 之前报错了，提示没这个字段，加一下。
        customTagList: [],
        oldSelectSessionVisible: false,
        oldSelectSessionTaskId: null,
        sessionList: [],
        sessionMode: 1,
        searchText: '',
        lastedRevisionId: ''
      }
    },
    computed: {
      ...mapState({
        needRefreshCollaborate: state => state.websocket.needRefreshCollaborate,
        removedCollaborate: state => state.websocket.removedCollaborate
      })
    },
    watch: {
      needRefreshCollaborate: function (newValue) {
          this.refreshCollaborateAction(false)
          this.loadMyContent()
      },
      removedCollaborate: function (newValue) {
          this.removedCollaborateAction(false)
          this.loadMyContent()
      }
    },
    created () {
      logger.info('teacher my content')
      this.loadMyContent()
      this.loadUserTags()
    },
    methods: {
      ...mapActions(['refreshCollaborateAction', 'changeCollaborateAction', 'removedCollaborateAction']),
      toggleViewMode (viewMode) {
        this.$logger.info('viewMode', viewMode)
        storage.set(SHARED_VIEW_MODE, viewMode)
        this.viewMode = viewMode
      },
      loadMyContent () {
        this.loading = true
        if (this.currentStatus === 0) {
          // owner
          CollaboratesQuerySharedOwner({
            type: this.currentType !== 'all-type' ? typeMap[this.currentType] : '',
            pageNo: this.pageNo,
            pageSize: this.pagination.pageSize,
            searchKey: ''
          }).then(res => {
            logger.info('CollaboratesQueryShared', res)
            if (res.success) {
              res.result.records.forEach((record, index) => {
                record.key = index
              })
              this.myContentList = res.result.records
              this.pagination.total = res.result.total
              this.pagination.current = res.result.current
              if (res.result.records.length === 0 && this.pagination.total > 0) {
                this.pageNo = res.result.pages
                this.loadMyContent()
              }
            } else {
              this.myContentList = []
              this.pagination.total = 0
            }
          }).finally(() => {
            this.loading = false
            this.skeletonLoading = false
          })
        } else {
          CollaboratesQueryShared({
            type: this.currentType !== 'all-type' ? typeMap[this.currentType] : '',
            pageNo: this.pageNo,
            pageSize: this.pagination.pageSize,
            searchKey: ''
          }).then(res => {
            logger.info('CollaboratesQueryShared', res)
            if (res.success) {
              res.result.records.forEach((record, index) => {
                record.key = index
              })
              this.myContentList = res.result.records
              this.pagination.total = res.result.total
              this.pagination.current = res.result.current
              if (res.result.records.length === 0 && this.pagination.total > 0) {
                this.pageNo = res.result.pages
                this.loadMyContent()
              }
            } else {
              this.myContentList = []
              this.pagination.total = 0
            }
          }).finally(() => {
            this.loading = false
            this.skeletonLoading = false
          })
        }
      },
      toggleStatus (status) {
        logger.info('toggleStatus ' + status)
        this.currentStatus = status
        this.loadMyContent()
      },
      toggleType (type, label) {
        logger.info('toggleType ' + type + ' label ' + label)
        this.currentType = type
        this.currentTypeLabel = label
        this.loadMyContent()
      },
      toggleOwner (owner, label) {
        logger.info('toggleOwner ' + owner + ' label ' + label)
        this.currentOwner = owner
        this.currentOwnerLabel = label
        this.loadMyContent()
      },

      handleEditItem (item) {
        logger.info('handleEditItem', item)
        if (item.type === typeMap['unit-plan']) {
          this.$router.push({
            path: '/teacher/unit-plan-redirect/' + item.id
          })
        } else if (item.type === typeMap.task) {
          this.$router.push({
            path: '/teacher/task-redirect/' + item.id
          })
        } else if (item.type === typeMap.evaluation) {
          this.$router.push({
            path: '/teacher/evaluation-redirect/' + item.id
          })
        }
      },
      handleDeleteItem (item) {
        logger.info('handleDeleteItem', item)
        if (this.currentStatus === 0) {
          DeleteByMeCollaborate({ sourceId: item.sourceId, sourceType: item.sourceType }).then(res => {
            logger.info('DeleteCollaborate', res)
          }).then(() => {
            this.loadMyContent()
          })
        } else {
          DeleteCollaborate({ id: item.id }).then(res => {
            logger.info('DeleteCollaborate', res)
          }).then(() => {
            this.loadMyContent()
          })
        }
      },
      handleViewDetail (item) {
        logger.info('handleViewDetail', item)
        this.previewCurrentId = item.id
        this.previewType = item.type
        this.previewVisible = true
      },

      handlePreviewClose () {
        logger.info('handlePreviewClose')
        this.previewVisible = false
        this.$nextTick(() => {
          this.previewCurrentId = null
          this.previewType = -1
        })
      },

      handleDuplicateItem (item) {
        this.$logger.info('handleDuplicateItem', item)
        this.$confirm({
          title: 'Confirm duplicate',
          content: 'Are you sure to duplicate ' + item.name + ' ?',
          centered: true,
          onOk: () => {
            this.loading = true
            Duplicate({ id: item.sourceId, type: item.sourceType }).then((response) => {
              if (response.code !== this.ErrorCode.ppt_google_token_expires && response.code !== this.ErrorCode.ppt_forbidden) {
                this.$logger.info('Duplicate response', response)
                this.loading = false
              } else {
                this.currentMethodName = 'handleDuplicateItem'
                this.currentMethodParam = item
              }
            }).finally(() => {
              // this.$router.push({ path: '/teacher/main/created-by-me' })
            })
          }
        })
      },

      handleAuthCallback () {
        this.$logger.info('Shared handleAuthCallback')
        if (this.currentMethodName === 'handleDuplicateItem') {
          this.handleDuplicateItem(this.currentMethodParam)
        }
      },

      handlePrevious (item) {
        this.$router.push({
          path: '/teacher/my-class?slideId=' + item.presentationId
        })
      },

      handleStartSession () {
        // this.$logger.info('selected sessionTags', this.sessionTags)
        // if (this.sessionTags.length === 0) {
        //   this.$message.warn('Please add session tags')
        //   return
        // }
        this.startLoading = true
        const item = this.sessionItem
        this.$logger.info('handleStartSession', item)
        if (item.presentationId) {
          const requestData = {
            author: this.$store.getters.email,
            slide_id: item.presentationId,
            revision_id: this.lastedRevisionId ? this.lastedRevisionId : item.revisionId,
            file_name: item.name ? item.name : 'Unnamed',
            status: this.sessionMode === 1 ? lessonStatus.teacherPaced : lessonStatus.studentPaced,
            redirect_url: null
          }

          this.$logger.info('handleStartSession', requestData)
          StartLesson(requestData).then(res => {
            this.$logger.info('StartLesson res', res)
            if (res.code === 'ok') {
              this.startLoading = false
              this.lessonSelectTagVisible = false
              const targetUrl = lessonHost + 'd/' + res.data.class_id + '?token=' + storage.get(ACCESS_TOKEN)
              this.$logger.info('try open ' + targetUrl)
              // window.open(targetUrl, '_blank')
              // 课堂那边需要点击返回回到表单，改成location.href跳转
              const url = lessonHost + 't/' + res.data.class_id + '?token=' + storage.get(ACCESS_TOKEN)
              var windowObjectReference
              var height = document.documentElement.clientHeight * 0.7
              var width = document.documentElement.clientWidth * 0.7
              var strWindowFeatures = 'width=' + width + ',height=' + height + ',menubar=yes,location=yes,resizable=yes,scrollbars=true,status=true,top=100,left=200'
              if (this.sessionMode === 1) {
                windowObjectReference = window.open(
                  'about:blank',
                  '_blank',
                  strWindowFeatures
                )
                windowObjectReference.location = url
                setTimeout(function () {
                  window.location.href = targetUrl
                }, 1000)
              } else {
                window.location.href = targetUrl
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

      handleDashboard (item) {
        this.$logger.info('handleDashboard', item)
        if (item.presentationId) {
          const requestData = {
            author: this.$store.getters.email,
            slide_id: item.presentationId,
            file_name: item.name ? item.name : 'Unnamed',
            status: lessonStatus.studentPaced,
            redirect_url: null
          }

          this.$logger.info('handleDashboard', requestData)
          StartLesson(requestData).then(res => {
            this.$logger.info('StartLesson res', res)
            if (res.code === 'ok') {
              // const targetUrl = lessonHost + 'slide_id=' + item.presentationId + '&class_id=' + res.data.class_id + '&direct=true&currentPage=0&type=dashboard'
              const targetUrl = lessonHost + 'd/' + res.data.class_id
              this.$logger.info('try open ' + targetUrl)
              // window.open(targetUrl, '_blank')
              // 课堂那边需要点击返回回到表单，改成location.href跳转
              window.location.href = targetUrl
            } else {
              this.$message.warn('StartLesson Failed! ' + res.message)
            }
          })
        } else {
          this.$message.warn('This record is not bound to PPT!')
        }
      },

      handleViewPreviewSession (item) {
        this.$logger.info('handleViewPreviewSession', item)
        this.currentPreviewLesson = item
        this.viewPreviewSessionVisible = true
      },
      handleSelectedSessionTags (tags) {
        this.sessionTags = tags
        this.$logger.info('handleSelectedSessionTags', tags)
      },
      handleStartSessionTags (item) {
        this.sessionItem = item
        this.lessonSelectTagVisible = true
        this.sessionTags = []
      },

      handleEvaluateItem (item) {
        this.$logger.info('handleEvaluateItem', item)
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

      handleCollaborate (item) {
        this.$logger.info('handleCollaborate', item)
        ReceiveCollaborate({ id: item.id }).then(res => {
          logger.info('ReceiveCollaborate', res)
          this.$message.success('collaborate successfully')
        }).then(() => {
          this.loadMyContent()
        })
      },

      handleDeleteCollaborate (item) {
        this.$logger.info('handleDeleteCollaborate', item)
        DeleteCollaborate({ id: item.id }).then(res => {
          logger.info('DeleteCollaborate', res)
        }).then(() => {
          this.loadMyContent()
        })
      },
      handleTabChange (tab) {
        if (tab === '1') {
          this.$refs.classList1.loadTeacherClasses()
        } else {
          this.$refs.classList2.loadTeacherClasses()
        }
      },
      handleStartSessionHistory (item, mode) {
        console.log(item)
        this.sessionMode = mode
        this.sessionItem = item
        // this.lessonSelectTagVisible = true
        if (!item.presentationId) {
          this.$message.warn('This Task is not bound to PPT!')
        }
        logger.info('loadTeacherClasses  slideId:' + item.presentationId)
        this.loading = true
        this.sessionList = []
        FindMyClasses({ slideId: item.presentationId, lastVersion: true }).then(response => {
          logger.info('findMyClasses', response.result.data)
          if (response.success) {
            this.sessionList = response.result.classList
            this.lastedRevisionId = response.result.revisionId
          }
          this.loading = false
        }).finally(() => {
          if (this.sessionList.length > 0) {
            this.oldSelectSessionVisible = true
            this.oldSelectSessionTaskId = item.id
          } else {
            this.handleStartSession()
          }
        })
        this.sessionTags = []
      },
      handleAccept (item, flag) {
        this.$logger.info('handleAccept', item)
        CollaboratesAgree({ id: item.id, agreeFlag: flag }).then(res => {
          logger.info('handleApply', res)
          if (flag === this.collaborateStatus.agree) {
            this.$message.success('Agree successfully')
          } else {
            this.$message.success('Disagree successfully')
          }
        }).then(() => {
          this.loadMyContent()
        })
      },
      handleApply (item) {
        this.$logger.info('handleApply', item)
        CollaboratesAgree({ id: item.id, agreeFlag: this.collaborateStatus.apply }).then(res => {
          logger.info('handleApply', res)
          this.$message.success('Apply successfully')
        }).then(() => {
          this.loadMyContent()
        })
      },
      triggerSearch() {
        this.$logger.info('triggerSearch', this.searchText)
        this.loadMyContent()
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "~@/components/index.less";

  .ant-list-item {
    padding: 8px 0;
    position: relative;
  }

  .my-list-item {
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    opacity: 1;
    border-radius: 4px;
    background: #FFFFFF;
    padding: 15px;
    margin-bottom: 15px;
    width: 100%;

    .collaborate-item {
      width: 100%;

      .message-wrapper {
        min-height: 80px;
        background: rgba(245, 245, 245, 0.5);
        border: 1px solid #BCBCBC;
        opacity: 1;
        border-radius: 4px;
        padding: 10px;
        box-sizing: border-box;
        width: 100%;
      }

      .collaborate-action-wrapper {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;

        .collaborate-content-info {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-around;
          cursor: pointer;

          .name {
            padding-left: 10px;
            font-family: Inter-Bold;
            line-height: 24px;
            color: #11142D;
            padding-right: 10px;
          }

          .time {
            width: 150px;
            color: #000000;
            opacity: 0.5;
          }
        }

        .collaborate-action {
          display: flex;
          flex-direction: row;
          align-items: center;

          .collaborate-action-item {
            margin: 0 10px;

            .collaborate-icon {
              height: 17px;
            }

            .btn-text {
              padding: 0 5px;
            }
          }
        }
      }
    }
  }

  .card-my-list-item {
    margin: 0 10px 10px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    .card-collaborate-item {
      width: 350px;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      opacity: 1;
      border-radius: 4px;
      background: #FFFFFF;
      padding: 15px;

      .message-wrapper {
        min-height: 80px;
        background: rgba(245, 245, 245, 0.5);
        border: 1px solid #BCBCBC;
        opacity: 1;
        border-radius: 4px;
        padding: 10px;
        box-sizing: border-box;
        width: 100%;
      }

      .collaborate-action-wrapper {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        align-items: flex-start;
        justify-content: flex-start;
        padding: 10px 0;

        .collaborate-content-info {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: space-between;
          cursor: pointer;

          .type-icon {
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;

            .name {
              padding-left: 10px;
              font-family: Inter-Bold;
              line-height: 24px;
              color: #11142D;
              padding-right: 10px;
            }
          }

          .sub-info {
            width: 100%;
            padding-left: 45px;
            box-sizing: border-box;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;

            .time {
              width: 150px;
              color: #000000;
              opacity: 0.5;
            }
          }
        }

        .collaborate-action {
          display: flex;
          flex-direction: row;
          width: 100%;
          margin-top: 20px;
          justify-content: flex-end;

          .collaborate-action-item {
            margin: 0 10px;

            .collaborate-icon {
              height: 17px;
            }

            .btn-text {
              padding: 0 5px;
            }
          }
        }
      }
    }
  }

  .my-content {
    padding: 0 15px 25px 15px;

    .filter-line {
      padding: 15px 0;
      display: flex;
      justify-content: space-between;
      .status-tab {
        cursor: pointer;
        display: flex;
        flex-direction: row;
        align-items: center;
        .toggle-mode-type-wrapper {
          width: 280px;
          box-sizing: border-box;
          .toggle-mode-type {
            height: 40px;
            display: inline-block;
            border-radius: 40px;
            background: rgba(228, 228, 228, 0.3);

            .toggle-mode {
              border-radius: 40px;
              height: 40px;
              display: flex;
              flex-direction: row;
              font-size: 12px;

              //.mode-item:first-child {
              //  border-bottom-left-radius: 35px;
              //  border-top-left-radius: 35px;
              //}
              //
              //.mode-item:last-child {
              //  border-bottom-right-radius: 35px;
              //  border-top-right-radius: 35px;
              //}

              .mode-item {
                padding: 0 8px;
                font-size: 12px;
                height: 40px;
                color: rgba(17, 20, 45, 1);
                border-radius: 30px;
                font-family: Inter-Bold;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 150px;
              }

              .skill-active-mode {
                color: #fff;
                background: rgba(21, 195, 154, 1);
              }

              .knowledge-active-mode {
                color: #fff;
                background: rgba(21, 195, 154, 1);
              }

              .general-active-mode {
                color: #fff;
                background: rgba(21, 195, 154, 1);
              }
            }
          }
        }
      }

      .type-owner {
        height: 40px;
        display: flex;
        flex-direction: row;
        align-items: center;
      }
    }

    .content-wrapper {
      min-width: 900px;
      .content-list {
        min-width: 900px;
        .my-list-item {
          overflow: hidden;
          .content-info-left {
            cursor: pointer;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            width: calc(100% - 650px);

            .status-icon-item {
              font-size: 18px;
              width: 40px;
            }

            &:hover {
              color: @primary-color;
            }
          }
          .content-info-right {
            cursor: pointer;
            display: flex;
            justify-content: flex-end;
            align-items: center;

            .update-time {
              width: 130px;
              color: #11142D;
              font-size: 13px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            //.status {
            //  font-family: Inter-Bold;
            //  line-height: 24px;
            //  color: #11142D;
            //  width: 70px;
            //}
            .fromer {
              font-family: Inter-Bold;
              line-height: 24px;
              color: #11142D;
              font-size: 13px;
              width: 120px;
            }
          }
          .action {
            width: 400px;
          }

          .action-wrapper {
            height: 33px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-end;

            .action-item-wrapper {
              display: none;
              flex-direction: row;
              align-items: center;
              justify-content: center;
              margin-left: 5px;

              .session-btn {
                display: flex;
                border-radius: 32px;
                flex-direction: row;
                align-items: center;
                justify-content: center;
                padding: 6px 13px;
                background: rgba(245, 245, 245, 0.5);
                opacity: 1;
                border: 1px solid rgba(188, 188, 188, 1);

                .session-btn-icon {
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  justify-content: center;
                  font-size: 13px;
                  i {
                    svg {
                      height: 14px;
                      fill: #182552;
                      stroke: #182552;
                      stroke-width: 0.5px;
                    }
                  }
                }
                .session-btn-text {
                  font-size: 13px;
                  padding-left: 7px;
                  font-family: Inter-Bold;
                  color: #182552;
                  display: flex;
                  align-items: center;
                }
              }

              .session-btn:hover {
                border-color: #15c39a;
                background: rgba(21, 195, 154, 0.1);
                .session-btn-icon {
                  i {
                    svg {
                      fill: #15c39a;
                      stroke: #15c39a;
                      stroke-width: 0.5px;
                    }
                  }

                  svg {
                    fill: #15c39a;
                    stroke: #15c39a;
                    stroke-width: 0.5px;
                  }
                }

                .session-btn-text {
                  display: inline-block;
                  color: #15C39A;
                }
              }
            }
            .action-item-block-wrapper{
              display: block;
            }
          }

          .name-content {
            padding-left: 5px;
            text-align: left;
            font-family: Inter-Bold;
            line-height: 24px;
            color: #11142D;
            display: inline-block;
            max-width: 400px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }

          &:hover {
            //box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.10);
            border: 1px solid #15C39A;
            .action-wrapper {
              .action-item-wrapper {
                display: flex;
              }
            }
          }
        }
      }
    }
  }

  a.delete-action {
    color: @red-4;
  }

  .type-owner {
    height: 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .my-search{
    margin-right: 10px;
    border-radius:6px;
    width: 200px;
    /deep/ .ant-input{
      border-radius:6px;
      height: 40px;
    }
  }

  .view-mode-toggle {
    cursor: pointer;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    margin-right: 10px;
    background: #FFFFFF;
    border: 1px solid #F7F8FF;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    opacity: 1;
    border-radius: 6px;
    height: 40px;
    padding: 0px 15px;
    margin-left: 20px;

    .view-mode {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
      color: @text-color-secondary;

      .view-mode-item {
        font-size: 20px;
        padding-left: 5px;
        margin: 0 3px;
      }

      .active-view {
        i {
          color: @primary-color;
        }
      }
    }
  }

  .cover-image {
    height: 150px;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    border-bottom: 1px solid #eee;
  }

  .label-title-red {
    margin: 10px 0;
    padding: 10px 15px;
    display: flex;
    flex-direction: row;
    align-items: center;
    background: rgba(255, 51, 85, 0.1);
    opacity: 1;
    border-radius: 6px;

    .label-icon {
      img {
        height: 20px;
      }
    }

    .label-text {
      padding-left: 10px;
      font-family: Inter-Bold;
      line-height: 24px;
      color: #FF3355;
    }
  }

  .label-title-green {
    margin: 50px 0 10px 0;
    padding: 10px 15px;
    display: flex;
    flex-direction: row;
    align-items: center;
    background: rgba(21, 195, 154, 0.1);
    opacity: 1;
    border-radius: 6px;

    .label-icon {
      img {
        height: 20px;
      }
    }

    .label-text {
      padding-left: 10px;
      font-family: Inter-Bold;
      line-height: 24px;
      color: #15C39A;;
    }
  }

  .no-received-card-list {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    background: rgba(228, 228, 228, 0.2);
    border: 1px solid #D8D8D8;
    opacity: 1;
    border-radius: 4px;
    padding: 15px 10px;
  }

  .no-received-my-list-item {
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    opacity: 1;
    border-radius: 4px;
    background: #FFFFFF;
    padding: 15px;
    margin-bottom: 15px;
    width: 100%;

    .collaborate-item {
      width: 100%;

      .message-wrapper {
        min-height: 80px;
        background: rgba(245, 245, 245, 0.5);
        border: 1px solid #BCBCBC;
        opacity: 1;
        border-radius: 4px;
        padding: 10px;
        box-sizing: border-box;
        width: 100%;
      }

      .collaborate-action-wrapper {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        margin: 20px 0 0;

        .collaborate-content-info {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-around;
          cursor: pointer;

          .name {
            padding-left: 10px;
            font-family: Inter-Bold;
            line-height: 24px;
            color: #11142D;
            padding-right: 10px;
          }

          .time {
            width: 150px;
            color: #000000;
            opacity: 0.5;
          }
        }

        .collaborate-action {
          display: flex;
          flex-direction: row;
          align-items: center;

          .collaborate-action-item {
            margin: 0 10px;

            .collaborate-icon {
              height: 17px;
            }

            .btn-text {
              padding: 0 5px;
            }
          }
        }
      }
    }
  }

  .no-received-card-my-list-item {
    margin: 0 10px 10px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    .card-collaborate-item {
      width: 350px;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      opacity: 1;
      border-radius: 4px;
      background: #FFFFFF;
      padding: 15px;

      .message-wrapper {
        min-height: 150px;
        background: rgba(245, 245, 245, 0.5);
        border: 1px solid #BCBCBC;
        opacity: 1;
        border-radius: 4px;
        padding: 10px;
        box-sizing: border-box;
        width: 100%;
      }

      .collaborate-action-wrapper {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        align-items: flex-start;
        justify-content: flex-start;
        padding: 10px 0;

        .collaborate-content-info {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: space-between;
          cursor: pointer;

          .type-icon {
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;

            .name {
              padding-left: 10px;
              font-family: Inter-Bold;
              line-height: 24px;
              color: #11142D;
              padding-right: 10px;
            }
          }

          .sub-info {
            width: 100%;
            padding-left: 45px;
            box-sizing: border-box;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;

            .time {
              width: 130px;
              opacity: 0.5;
              font-size: 12px;
              color: #000000;
            }

            .author {
              font-size: 13px;
              color: #000000;
            }
          }
        }

        .collaborate-action {
          display: flex;
          flex-direction: row;
          width: 100%;
          margin-top: 20px;
          justify-content: flex-end;

          .collaborate-action-item {
            margin: 0 10px;

            .collaborate-icon {
              height: 17px;
            }

            .btn-text {
              padding: 0 5px;
            }
          }
        }
      }
    }
  }

  .collaborate-action-wrapper {
    .button-item-delete {
      padding: 0 10px;
      display: flex;
      align-items: center;
      height: 36px;
      border-radius: 6px;
      background: rgba(255, 51, 85, 1);
      border: 1px solid #eee;
      font-family: Inter-Bold;
      color: #fff;
    }
    .button-item-view {
      padding: 0 10px;display:flex; align-items:center ;height: 36px;border-radius: 6px;background: #15C39A;border: 1px solid #eee;
      font-family: Inter-Bold;color: #fff;
    }
  }

  .view-mode-toggle {
    cursor: pointer;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    margin-right: 10px;
    background: #FFFFFF;
    border: 1px solid #D8D8D8;
    opacity: 1;
    border-radius: 6px;
    height: 40px;
    padding: 0px 15px;
    margin-left: 20px;

    &:hover {
      border: 1px solid #15c39a;
    }
    .view-mode {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
      color: @text-color-secondary;

      .view-mode-item {
        font-size: 20px;
        padding-left: 5px;
        margin: 0 3px;
        display: flex;
        flex-direction: row;
        align-items: center;

        svg {
          height: 22px;
        }
      }

      .active-view {
        svg {
          fill: @primary-color;
        }
      }
    }
  }

  .mask {
    height: 100%;
    width: 100%;
    opacity: 0;
    margin:-10px;
    position: absolute;
    cursor: pointer;
    transition: opacity 0.8s;
    background: #0A1C32;
    border-radius: 6px;
  }

  .cover-card{
    background: #FFFFFF;
    opacity: 1;
    border-radius: 6px;
    border: none;

    .cover-img {
      width: 100%;
      min-height: 160px;
      background-position: center center;
      background-repeat: no-repeat;
      background-size: cover;
      margin-bottom: 10px;
    }
    &:hover {
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      .mask-actions{
        display: block;
      }
      .mask{
        opacity: 0.3;
      }
    }
    .mask-actions{
      margin:-10px;
      height: 100%;
      width: 100%;
      position: absolute;
      flex-direction: column;
      display: none;
      .action-item{
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
      }
      .action-item-top{
        height: 20px;
        flex-direction: row;
        justify-content: flex-end;
        padding-top: 15px;
        i{
          border-radius: 20px;
          padding: 8px;
          font-size: 18px;
          color: rgba(255, 255, 255, 1);
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
        }
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
            display: flex;
            align-items: center;
            display: flex;
            align-items: center;
            svg {
              margin-right: 5px;
            }
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
            display: flex;
            align-items: center;

            svg {
              margin-right: 5px;
            }
          }
        }
      }
      .action-item-bottom{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
        .session-btn {
          height: 33px;
          width: auto;
          display: flex;
          border-radius: 32px;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          padding: 6px 10px;
          transition: all 0.3s ease-in-out;
          background: rgba(245, 245, 245, 1);
          box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
          opacity: 1;
          border: 1px solid rgba(188, 188, 188, 1);
          .session-btn-icon {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            svg {
              height: 14px;
              fill: #182552;
              stroke: #182552;
              stroke-width: 0.5px;
            }
          }

          .session-btn-text {
            transition: all 0.3s ease-in-out;
            display: none;
            font-size: 13px;
            padding-left: 7px;
            font-family: Inter-Bold;
            color: #182552;
          }
        }

        .session-btn:hover {
          .session-btn-text {
            display: inline-block;
          }
        }
      }
    }

    img {
      width: 100%;
      height: 160px;
      padding: 5px 10px;
      background-size: cover;
      background-position: center center;
      background-repeat: no-repeat;
      //border-bottom: 1px solid #eee;
      -webkit-transition: all 0.3s ease-in-out;
      transition: all 0.3s ease-in-out;

    }
  }

  .my-card-meta-info {
    margin-top: 10px;

    .ant-card-meta-avatar {
      padding-right: 0;
    }
  }

  .tag-info{
    border-radius: 20px;
    padding: 8px;
    font-size: 16px;
  }

</style>
