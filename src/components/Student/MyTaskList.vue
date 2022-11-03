<template>
  <div>
    <div class="content-wrapper">
      <a-skeleton :loading="loading" active>
        <div class="content-list">
          <a-list
            size="large"
            :pagination="pagination"
            :data-source="myContentList"
            :loading="loading"
            v-if="viewModeLocal === 'list'"
          >
            <a-list-item class="my-list-item" slot="renderItem" key="item.id" slot-scope="item">

              <span class="content-info-left" @click="handleViewDetail(item)">

                <span class="name-content">
                  {{ (item.task && item.task.name) ? item.task.name : 'Unnamed' }}
                </span>

                <!-- <span class="collaborate-icon-item" v-if="item.collaborates > 0">
                  <collaborate-svg />
                </span> -->

                <div
                  class="my-list-progress"
                  v-if="optOptionsObj.progress &&
                    optOptionsObj.progress[0].show.includes(currentStatus) &&
                    optOptionsObj.progress[0].userMode === userMode">
                  <a-progress
                    :stroke-color="{
                      '0%': '#108ee9',
                      '100%': '#87d068',
                    }"
                    :strokeWidth="15"
                    :percent="item.percentage"
                  />
                </div>

              </span>

              <span class="content-info-right">
                <span class="update-time" >
                  {{ item.updateTime | dayjs }}
                </span>
                <span class="status">
                  {{ formatStatus(item.status) }}
                </span>
                <div class="action">
                  <div slot="actions">
                    <div class="action-wrapper">
                      <template v-for="opt in optOptionsObj.start">
                        <div
                          class="start-session-wrapper action-item-wrapper"
                          v-if="(opt.show.includes(item.status)) && (!opt.currentStatus || opt.currentStatus.includes(currentStatus))"
                          :key="'start_' + opt.label"
                        >
                          <div v-if="!opt.confirmText" class="session-btn content-list-action-btn" @click="handleAction(opt.fn, item)">
                            <div class="session-btn-icon">
                              <component
                                :is="opt.svg"
                                v-if="opt.svg"
                              ></component>
                              <a-icon theme="filled" :type="opt.icon" v-if="opt.icon"/>
                            </div>
                            <div class="session-btn-text">{{ opt.label }}</div>
                          </div>
                          <a-popconfirm v-else :title="'Confirm ' + opt.confirmText +' ' +((item.task && item.task.name) ? item.task.name : 'Untitled')+ ' ?'" ok-text="Yes" @confirm="handleAction(opt.fn, item)" cancel-text="No">
                            <div class="session-btn content-list-action-btn" >
                              <div class="session-btn-icon">
                                <a-icon :type="opt.icon" theme="filled" />
                              </div>
                              <div class="session-btn-text">{{ opt.confirmText }}</div>
                            </div>
                          </a-popconfirm>
                        </div>
                      </template>
                      <div
                        class="more-action-wrapper action-item-wrapper"
                        v-if="(currentStatus !== TASK_STATUS.ARCHIVED)
                          && (userMode !== USER_MODE.SCHOOL ||
                          (item.task.classId && item.task.sessionId && item.task.presentationId))"
                      >
                        <a-dropdown>
                          <a-icon type="more" style="margin-right: 8px" />
                          <a-menu slot="overlay">
                            <template v-for="opt in optOptionsObj.more">
                              <a-menu-item
                                :key="'more_' + opt.label"
                                v-if="(!opt.actionType || opt.actionType === actionType) &&
                                  (!opt.userMode || opt.userMode === userMode)
                                  && !opt.dependency || item.task[opt.dependency]
                                  && (opt.show.includes(item.status)) && (!opt.currentStatus || opt.currentStatus.includes(currentStatus))"
                              >
                                <a @click="handleAction(opt.fn,item)" v-if="!opt.confirmText">
                                  <a-icon :type="opt.icon" /> {{ opt.label }}
                                </a>
                                <a-popconfirm v-else :title="'Confirm '+ opt.confirmText +' ' +((item.task && item.task.name) ? item.task.name : 'Untitled')+ ' ?'" ok-text="Yes" @confirm="handleAction(opt.fn, item)" cancel-text="No">
                                  <a>
                                    <a-icon :type="opt.icon" theme="filled" /> {{ opt.label }}
                                  </a>
                                </a-popconfirm>
                              </a-menu-item>
                            </template>
                          </a-menu>
                        </a-dropdown>
                      </div>
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
            v-if="viewModeLocal === 'img'">
            <a-list-item slot="renderItem" key="item.id" slot-scope="item">
              <a-card class="cover-card" >
                <div class="mask"></div>

                <div class="mask-actions">
                  <div
                    class="action-item action-item-top"
                    v-show="(currentStatus !== TASK_STATUS.ARCHIVED && currentStatus !== TASK_STATUS.SCHEDULED)
                      && (userMode !== USER_MODE.SCHOOL ||
                      (item.task.classId && item.task.sessionId && item.task.presentationId))
                      && optOptionsObj.top && optOptionsObj.top.length > 0"
                  >
                    <a-dropdown>
                      <a-icon type="more" style="margin-right: 8px" class="more-icon" />
                      <a-menu slot="overlay">
                        <template v-for="opt in optOptionsObj.top">
                          <a-menu-item
                            :key="'more_' + opt.label"
                            v-if="(!opt.actionType || opt.actionType === actionType) &&
                              (!opt.userMode || opt.userMode === userMode)
                              && !opt.dependency || item.task[opt.dependency]
                              && (opt.show.includes(item.status)) && (!opt.currentStatus || opt.currentStatus.includes(currentStatus))"
                          >
                            <a @click="handleAction(opt.fn,item)" v-if="!opt.confirmText">
                              <a-icon :type="opt.icon" /> {{ opt.label }}
                            </a>
                            <a-popconfirm v-else :title="'Confirm '+ opt.confirmText +' ' +((item.task && item.task.name) ? item.task.name : 'Untitled')+ ' ?'" ok-text="Yes" @confirm="handleAction(opt.fn, item)" cancel-text="No">
                              <a>
                                <a-icon :type="opt.icon" theme="filled" /> {{ opt.label }}
                              </a>
                            </a-popconfirm>
                          </a-menu-item>
                        </template>
                      </a-menu>
                    </a-dropdown>
                  </div>
                  <div class="action-item action-item-center" :style="{ visibility: currentStatus !== TASK_STATUS.ARCHIVED && currentStatus !== TASK_STATUS.SCHEDULED ? 'visible': 'hidden'}">
                    <template v-for="opt in optOptionsObj.start">
                      <div
                        class="session-btn session-btn-right"
                        :key="'center-' + opt.label"
                        v-if="(opt.show.includes(item.status)) && (!opt.currentStatus || opt.currentStatus.includes(currentStatus))"
                        @click="handleAction(opt.fn, item)"
                      >
                        <div class="session-btn-text">
                          <component
                            :is="opt.svg"
                            v-if="opt.svg"
                          ></component>
                          <a-icon theme="filled" :type="opt.icon" v-if="opt.icon"/>
                          {{ opt.label }}
                        </div>
                      </div>
                    </template>
                  </div>
                  <div class="action-item action-item-bottom" >
                    <template v-for="opt in optOptionsObj.bottom">
                      <div
                        class="session-btn"
                        :key="'bottom_'+opt.label"
                        @click.stop="handleAction(opt.fn, item)"
                        v-if="!opt.confirmText && (!opt.actionType || actionType === opt.actionType)
                          && (!opt.userMode || opt.userMode === userMode)
                          &&
                          (opt.show.includes(item.status) && (!opt.currentStatus || opt.currentStatus.includes(currentStatus)))"
                      >
                        <div class="session-btn-icon content-list-action-btn">
                          <component
                            :is="opt.svg"
                            v-if="opt.svg"
                          ></component>
                          <a-icon :type="opt.icon" v-if="opt.icon"/>
                        </div>
                        <div class="session-btn-text">{{ opt.label }}</div>
                      </div>
                      <a-popconfirm
                        v-if="opt.confirmText && (!opt.actionType || actionType === opt.actionType)
                          && (!opt.userMode || opt.userMode === userMode)
                          &&
                          (opt.show.includes(item.status) && (!opt.currentStatus || opt.currentStatus.includes(currentStatus)))"
                        :key="'bottom_'+opt.label"
                        :title="'Confirm ' + opt.confirmText + ' ' +(( item.task && item.task.name) ? item.task.name : 'Untitled')+ ' ?'"
                        ok-text="Yes"
                        @confirm="handleAction(opt.fn, item)"
                        cancel-text="No">
                        <div class="session-btn">
                          <div class="session-btn-icon content-list-action-btn">
                            <component
                              :is="opt.svg"
                              v-if="opt.svg"
                            ></component>
                            <a-icon :type="opt.icon" v-if="opt.icon"/>
                          </div>
                          <div class="session-btn-text">{{ opt.label }}</div>
                        </div>
                      </a-popconfirm>
                    </template>
                  </div>
                </div>
                <div class="cover-img" :style="{backgroundImage: `url('${(item.task && item.task.image)}')`}"></div>

                <a-card-meta class="my-card-meta-info" :title="(item.task && item.task.name) ? item.task.name : 'Untitled'" :description="(item.updateTime || item.createTime) | dayjs">
                  <content-type-icon :type="typeMap.task" slot="avatar"></content-type-icon>
                </a-card-meta>

                <div class="my-card-progress" v-if="USER_MODE.SELF === userMode" :style="{visibility: item.status === TASK_STATUS.ONGOING ? 'visible' : 'hidden'}">
                  <a-progress
                    :stroke-color="{
                      '0%': '#108ee9',
                      '100%': '#87d068',
                    }"
                    :strokeWidth="15"
                    :percent="item.percentage"
                    :show-info="false" />
                  <label>{{ item.percentage }}%</label>
                </div>

                <template v-for="opt in optOptionsObj.topRight">
                  <div
                    class="session-distance"
                    :key="'topRight_'+opt.label"
                    v-if="(!opt.actionType || actionType === opt.actionType)
                      && (!opt.userMode || opt.userMode === userMode)
                      &&
                      (opt.show.includes(item.status) && (!opt.currentStatus || opt.currentStatus.includes(currentStatus)))
                      &&
                      (item.sessionStartTime || item.sessionDeadline)"
                  >
                    <a-tag color="#108ee9" v-show="item.sessionDeadline && item.status === TASK_STATUS.ONGOING">
                      Deadline in {{ item.sessionDeadline | distanceDate }}
                    </a-tag>
                    <a-tag color="#ef4136" v-show="item.sessionStartTime && item.status === TASK_STATUS.SCHEDULED">
                      Start in {{ item.sessionStartTime | distanceDate }}
                    </a-tag>
                  </div>
                </template>

                <!-- <collaborate-svg class="card-collaborate-icon-item" v-if="item.collaborates > 0"/> -->
              </a-card>

            </a-list-item>
          </a-list>
        </div>
      </a-skeleton>
    </div>
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
        <div class="detail-wrapper" v-if="currentTaskId && previewType">
          <common-preview-v2 :id="currentTaskId" :type="previewType" :isLibrary="true"/>
        </div>
      </div>
    </a-drawer>

    <a-modal
      v-model="paymentVisible"
      :footer="null"
      destroyOnClose
      width="800px"
      :zIndex="6000"
      title="Payment details"
      @ok="paymentVisible = false"
      @cancel="paymentVisible = false">
      <payment-detail :taskId="currentTaskId" :taskName="currentTaskName"></payment-detail>
    </a-modal>

    <a-modal
      v-model="takeAwayPreviewVisible"
      :footer="null"
      destroyOnClose
      :dialog-style="{ top: '30px' }"
      width="920px"
      title="Takeaways"
      @ok="takeAwayPreviewVisible = false"
      @cancel="takeAwayPreviewVisible = false">
      <div class="view-take-away">

        <div class='ppt-slide-view'>
          <div class="slide-preview" v-if="currentActiveStudentId">
            <takeaway-ppt-slide-view
              ref='takeaway'
              :class-id="takeAwayClassId"
              :session-id='takeAwaySessionId'
              :slide-id="takeAwaySlideId"
              mode='takeaway'
              :canEdit="false"
              :student-name="currentActiveStudentId" />
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import * as logger from '@/utils/logger'
import { typeMap } from '@/const/teacher'
import { lessonHost } from '@/const/googleSlide'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { StudentStudyTaskStatus, USER_MODE, TASK_STATUS } from '@/const/common'

import CommonPreviewV2 from '@/components/Common/CommonPreviewV2'
import NoMoreResources from '@/components/Common/NoMoreResources'
import FilterContent from '@/components/UnitPlan/FilterContent'
import PaymentDetail from '@/components/Student/PaymentDetail'
import TakeawayPptSlideView from '@/components/Evaluation/TakeawayPptSlideView'

import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import PreviousSessionsSvg from '@/assets/icons/common/PreviousSessions.svg?inline'
import EditSvg from '@/assets/icons/common/Edit.svg?inline'
import Bianji from '@/assets/icons/common/Bianji.svg?inline'
import StartSessionSvg from '@/assets/icons/common/StartSession.svg?inline'
import StudentPace from '@/assets/icons/common/StudentPace.svg?inline'
import CollaborateSvg from '@/assets/icons/collaborate/collaborate_group.svg?inline'
import TakeAwayIcon from '@/assets/icons/common/take_away.svg?inline'

import { SelfStudyTaskStart, SelfStudyAchive, SelfStudyRestore, SelfStudyDelete } from '@/api/selfStudy'

import storage from 'store'
import { mapState } from 'vuex'

export default {
  name: 'MyTaskList',
  components: {
    ContentTypeIcon,
    PreviousSessionsSvg,
    EditSvg,
    Bianji,
    StartSessionSvg,
    CollaborateSvg,
    TakeAwayIcon,
    StudentPace,
    CommonPreviewV2,
    NoMoreResources,
    FilterContent,
    PaymentDetail,
    TakeawayPptSlideView
  },
  props: {
    loadData: {
      type: Function,
      required: true
    },
    viewMode: {
      type: String,
      default: 'img'
    },
    status: {
      type: [String, Number],
      default: ''
    },
    actionType: {
      type: String,
      default: 'myTask'
    },
    optArray: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    viewMode(val) {
      this.viewModeLocal = val
    },
    status(val) {
      this.currentStatus = val
      this.pageNo = 1
      this.loadMyContent()
    },
    optArray(val) {
      this.optChoose = val.concat()
    }
  },
  data() {
    return {
      loading: true,
      startLoading: false,
      typeMap: typeMap,
      currentStatus: this.status,
      TASK_STATUS: TASK_STATUS,
      USER_MODE: USER_MODE,
      myContentList: [],
      pagination: {
        onChange: page => {
          console.info('pagination onChange', page)
          this.pageNo = page
          this.loadMyContent()
        },
        showTotal: total => `Total ${total} items`,
        total: 0,
        pageSize: 16,
        current: 1
      },
      pageNo: 1,
      viewModeLocal: this.viewMode,

      previewVisible: false,
      currentTaskId: '',
      currentTaskName: '',
      previewType: typeMap.task,
      currentPreviewLesson: null,
      paymentVisible: false,

      takeAwayPreviewVisible: false,
      currentActiveStudentId: null,
      takeAwaySlideId: null,
      takeAwayClassId: null,
      takeAwaySessionId: null,

      optChoose: this.optArray.concat(),
      optOptions: [
        {
          type: ['progress'],
          label: 'progress',
          show: [TASK_STATUS.ONGOING],
          userMode: USER_MODE.SELF
        },
        {
          type: ['start', 'center'],
          show: [TASK_STATUS.ONGOING, TASK_STATUS.COMPLETED],
          currentStatus: [TASK_STATUS.ONGOING, TASK_STATUS.COMPLETED, ''],
          label: 'Enter session',
          svg: 'student-pace',
          fn: 'handleStartSession'
        },
        {
          type: ['more', 'bottom'],
          show: [TASK_STATUS.ONGOING, TASK_STATUS.COMPLETED],
          userMode: USER_MODE.SELF,
          currentStatus: [TASK_STATUS.ONGOING, TASK_STATUS.COMPLETED, ''],
          actionType: 'myTask',
          label: 'Report',
          icon: 'bar-chart',
          fn: 'handleReportItem'
        },
        {
          type: ['more', 'top'],
          show: [TASK_STATUS.ONGOING, TASK_STATUS.COMPLETED],
          userMode: USER_MODE.SELF,
          currentStatus: [TASK_STATUS.ONGOING, TASK_STATUS.COMPLETED],
          actionType: 'myTask',
          label: 'Archive',
          icon: 'delete',
          fn: 'handleDeleteItem',
          confirmText: 'archive'
        },
        {
          type: ['more', 'top'],
          show: [TASK_STATUS.ONGOING, TASK_STATUS.COMPLETED],
          userMode: USER_MODE.SELF,
          currentStatus: [TASK_STATUS.ONGOING, TASK_STATUS.COMPLETED],
          actionType: 'myTask',
          label: 'Payment Details',
          icon: 'ordered-list',
          fn: 'handlePaymentItem'
        },
        {
          type: ['more', 'top'],
          show: [TASK_STATUS.ONGOING, TASK_STATUS.COMPLETED],
          userMode: USER_MODE.SCHOOL,
          dependency: 'selfReview',
          actionType: 'myClass',
          label: 'Self-review',
          icon: 'rollback',
          fn: 'handleReviewItem'
        },
        {
          type: ['more', 'top'],
          show: [TASK_STATUS.ONGOING, TASK_STATUS.COMPLETED],
          userMode: USER_MODE.SCHOOL,
          actionType: 'myClass',
          label: 'Takeaway',
          icon: 'file',
          fn: 'handleTakeAwayItem'
        },
        {
          type: ['start', 'bottom'],
          // archive里面也有其他状态？
          show: [TASK_STATUS.ONGOING, TASK_STATUS.COMPLETED, TASK_STATUS.ARCHIVED],
          userMode: USER_MODE.SELF,
          currentStatus: [TASK_STATUS.ARCHIVED],
          actionType: 'myTask',
          label: 'Restore',
          icon: 'undo',
          fn: 'handleRestoreItem',
          confirmText: 'restore'
        },
        {
          type: ['bottom'],
          show: [TASK_STATUS.ONGOING, TASK_STATUS.COMPLETED, TASK_STATUS.SCHEDULED],
          label: 'Preview',
          icon: 'eye',
          fn: 'handleViewDetail'
        },
        {
          type: ['topRight'],
          show: [TASK_STATUS.ONGOING, TASK_STATUS.SCHEDULED],
          actionType: 'myClass',
          label: 'Distance',
          icon: '',
          fn: ''
        }
      ]
    }
  },
  created () {
    console.info('student my content')
    this.loadMyContent()
  },
  computed: {
    ...mapState({
      userMode: state => state.app.userMode,
      user: state => state.user
    }),
    statusList() {
      return StudentStudyTaskStatus.filter(item => {
        // scheduled 只有学校模式有
        if (this.userMode === USER_MODE.SELF && item.value === TASK_STATUS.SCHEDULED) return false
        return true
      })
    },
    optOptionsObj() {
      const optObj = {}
      let optOptionsSel = [...this.optOptions]
      if (this.optChoose && this.optChoose.length > 0) {
        optOptionsSel = this.optOptions.filter(item => {
          return this.optChoose.includes(item.label)
        })
      }
      if (optOptionsSel.length > 0) {
        optOptionsSel.forEach(item => {
          item.type.forEach(type => {
            if (optObj[type]) {
              optObj[type].push({ ...item })
            } else {
              optObj[type] = [{ ...item }]
            }
          })
        })
      }
      return optObj
    }
  },
  methods: {
    loadMyContent() {
      this.loading = true
      const params = {
        pageNo: this.pageNo,
        pageSize: this.pagination.pageSize
      }

      this.loadData(params).then(res => {
        console.info('SelfStudyTaskList', res)
        if (res.success) {
          this.myContentList = res.result.records.map(item => {
            // 学校模式和自学习模式数据结构不一样统一下
            if (!item.task) {
              return {
                ...item,
                task: {
                  ...item
                }
              }
            } else {
              return item
            }
          })
          this.pagination.total = res.result.total
          this.pagination.current = res.result.current
        } else {
          this.myContentList = []
          this.pagination.total = 0
          this.pagination.current = 1
        }
        console.info('myContentList', this.myContentList)
      }).finally(() => {
        this.loading = false
      })
    },
    formatStatus (status) {
      const item = this.statusList.find(item => item.value === status)
      return item ? item.title : 'Undefined'
    },
    handleViewDetail (item) {
      console.info('handleViewDetail', item)
      if (!item.task || this.currentStatus === 2) {
        return
      }
      this.currentTaskId = item.task.id
      this.currentTaskName = item.task.name
      this.previewType = typeMap.task
      this.previewVisible = true
    },
    handlePreviewClose () {
      console.info('handlePreviewClose')
      this.previewVisible = false
      this.$nextTick(() => {
        this.currentTaskId = null
        this.currentTaskName = null
        this.previewType = -1
      })
    },
    handleStartSession (item) {
      this.startLoading = true
      this.$logger.info('handleStartSession', item)
      if (item && item.task) {
        const requestData = {
          taskId: item.task.id
        }
        this.$logger.info('handleStartSession', requestData)
        SelfStudyTaskStart(requestData).then(res => {
          this.$logger.info('StartOpenSession res', res)
          if (res.success) {
            this.startLoading = false
            const targetUrl = lessonHost + 's/' + res.result.classId + '?token=' + storage.get(ACCESS_TOKEN)
            this.$logger.info('try open ' + targetUrl)
            // window.open(targetUrl, '_blank')
            window.location.href = targetUrl
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
    handleDeleteItem (item) {
      console.info('handleDeleteItem', item)
      SelfStudyAchive({ id: item.id }).then(res => {
        console.info('SelfStudyAchive', res)
      }).then(() => {
        this.loadMyContent()
      })
    },
    handleRestoreItem (item) {
      console.info('handleRestoreItem', item)
      SelfStudyRestore({ id: item.id }).then(response => {
        this.$logger.info('handleRestoreItem response', response)
      }).finally(() => {
        this.loadMyContent()
      })
    },
    handlePermanentDeleteItem (item) {
      SelfStudyDelete({ id: item.id }).then(response => {
        this.$logger.info('handleRestoreItem response', response)
      }).finally(() => {
        this.loadMyContent()
      })
    },
    handlePaymentItem (item) {
      if (!item.task || this.currentStatus === 2) {
        return
      }
      this.currentTaskId = item.task.id
      this.currentTaskName = item.task.name
      this.paymentVisible = true
    },
    handleReportItem (item) {

    },
    handleReviewItem(item) {
      if (item.task.sessionId) {
        this.$router.push(`/student/evaluation/${item.task.sessionId}`)
      }
    },
    handleTakeAwayItem(item) {
      if (!item.task.classId || !item.task.sessionId || !item.task.presentationId) {
        this.$message.error('The task hasnt started yet')
        return
      }
      this.takeAwayClassId = item.task.classId
      this.takeAwaySessionId = item.task.sessionId
      this.takeAwaySlideId = item.task.presentationId
      this.currentActiveStudentId = this.user.name
      this.takeAwayPreviewVisible = true
    },
    triggerSearch() {
      this.loadMyContent()
    },
    handleAction(actionName, item) {
      this[actionName](item)
    }
  }
}
</script>

<style scoped lang="less">
@import "~@/components/index.less";
.ant-list-item {
  padding: 8px 0;
  position: relative;
}

.active-item {
  background-color: fade(@outline-color, 20%);
  color: @primary-color;
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
        width: calc(100% - 400px);

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
          width: 170px;
          color: #11142D;
          font-size: 13px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .status {
          font-family: Inter-Bold;
          line-height: 24px;
          color: #11142D;
          width: 70px;
        }
      }
      .action {
        width: 200px;
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
      }

      .name-content {
        padding-left: 5px;
        text-align: left;
        font-family: Inter-Bold;
        line-height: 24px;
        color: #11142D;
        display: inline-block;
        max-width: 300px;
        width: 300px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      &:hover {
        box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.10);
        .action-wrapper {
          .action-item-wrapper {
            display: flex;
          }
        }
      }
    }
  }
}
a.delete-action {
  color: @red-4;
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
  position:relative;
  .card-collaborate-icon-item{
    width: 30px;
    padding-top: 17px;
    padding-right: 5px;
    position: absolute;
    right: 0;
    bottom: 5px;
  }

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
        width: 25px;
        font-size: 20px;
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

.my-card-progress {
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  & > label {
    width: 100%;
    position: absolute;
    top: 0;
    left: 10px;
    color: #fff;
    font-size: 12px;
    height: 22px;
    line-height: 22px;
  }
}

.my-list-progress {
  width: 150px;
  margin-left: 10px;
}

.preview-session-wrapper {
  min-height: 300px;

  .no-session {
    padding: 100px;
  }
  .preview-session-search{
    margin: 10px;
    width: 400px;
  }
}
.session-distance {
  position: absolute;
  top: 10px;
  left: 10px;
}
</style>
