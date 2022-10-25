<template>
  <div @click.stop='hiddenMenu'>
    <div class="my-class-list">
      <a-input-search
        size="large"
        class="preview-session-search"
        placeholder="Find by session name or class name"
        v-model="sessionName"
        @search="searchSession"
        enter-button/>
      <a-skeleton :loading="loading" active>
        <a-table
          class="class-list"
          :columns="columns"
          :data-source="data"
          :pagination="false"
          rowKey="id">

          <span slot="date" slot-scope="date" class="flex-center table-date">
            <div class="class-icon">
              <img src="~@/assets/icons/myClass/class_icon.png" />
            </div>
            {{ date * 1000 | dayjs1 }}
          </span>

          <span slot="startTime" slot-scope="text">{{ text | dayjs1 }} </span>

          <span slot="className" slot-scope="test,record" class="flex-center">
            <div class="class-name">
              <div class="class-name-text">{{ record.className }}</div>
            </div>
          </span>

          <span slot="sessionName" slot-scope="text, record" class="flex-center">
            <div class="class-name">
              <a-input
                ref="inputRef"
                @blur="handleConfirmName()"
                @pressEnter="handleConfirmName()"
                v-if="editItem.id === record.id"
                type="text"
                placeholder="Input new name"
                v-model="createNewName" />
              <div v-else class="class-name-text">{{ text }}</div>
            </div>
          </span>

          <span slot="status" slot-scope="status" class="flex-center">
            <div v-if="active" style="color: #15C39A;">
              {{ getStatusFormat(status) }}
            </div>
            <div v-else style="color: #15C39A;"> Archived </div>
          </span>

          <span slot="action" class="flex-right" slot-scope="text, record, index">
            <div class="class-action" v-if="active">
              <div class="icon-action" v-if="record.status === classStatus.teacherPaced || record.status === classStatus.close">
                <a-tooltip>
                  <template slot="title" >
                    teacher-projecting
                  </template>
                  <div class="icon-action-item" @click="handleTeacherProjecting(record)">
                    <img src="~@/assets/icons/myClass/Startasession@2x_color.png" class="icon-color" />
                    <img src="~@/assets/icons/myClass/Startasession@2x_gray.png" class="icon-gray"/>
                  </div>
                </a-tooltip>
              </div>
              <div class="icon-action" v-if="record.status === classStatus.studentPaced || record.status === classStatus.live">
                <a-tooltip>
                  <template slot="title" >
                    Student-paced
                  </template>
                  <div class="icon-action-item" @click="handleTeacherProjecting(record)">
                    <img src="~@/assets/icons/myClass/Startasession@2x_color.png" class="icon-color" />
                    <img src="~@/assets/icons/myClass/Startasession@2x_gray.png" class="icon-gray"/>
                  </div>
                </a-tooltip>
              </div>

              <a-popover placement="rightTop" trigger="click" :visible="menuVisible && activeMenuIndex === index">
                <template slot="content">
                  <div class="class-more-icon-panel">
                    <div class="class-more-item" @click="handleTakeAway(record)">
                      <div class="class-action-icon">
                        <take-away-icon />
                      </div>
                      <div class="class-action-name">
                        Takeaways
                      </div>
                    </div>
                    <div class="class-more-item" @click="handleReviewEditEvaluation(record)" v-if="record.taskClassId">
                      <div class="class-action-icon">
                        <evaluate-icon />
                      </div>
                      <div class="class-action-name">
                        Evaluate
                      </div>
                    </div>
                    <div class="class-more-item" @click="handleArchiveSession(record)">
                      <div class="class-action-icon">
                        <archive-session-icon />
                      </div>
                      <div class="class-action-name">
                        Archive Session
                      </div>
                    </div>
                    <div class="class-more-item" @click="handleRenameSession(record)">
                      <div class="class-action-icon">
                        <Bianji />
                      </div>
                      <div class="class-action-name">
                        Rename the session
                      </div>
                    </div>

                    <div class="class-more-item" @click="handleReopenSession(record)" v-if="record.status === 'close'">
                      <div class="class-action-icon">
                        <a-icon type="interaction" />
                      </div>
                      <div class="class-action-name">
                        Reopen
                      </div>
                    </div>
                    <div class="class-more-item" @click="handleEndSession(record)" v-if="record.status === 'live'">
                      <div class="class-action-icon">
                        <a-icon type="close-circle" />
                      </div>
                      <div class="class-action-name">
                        End the session
                      </div>
                    </div>
                  </div>
                </template>
                <div class="more-action" @click.stop='handleActivePopover(index)'>
                  <img src="~@/assets/icons/myClass/more.png"/>
                </div>
              </a-popover>
            </div>
            <div v-else>
              <a-button type="link" class="flex-center" @click="handleRestoreSession(record)">
                Restore
              </a-button>
            </div>
          </span>
        </a-table>
      </a-skeleton>

      <a-modal
        v-model="reviewEvaluationVisible"
        :footer="null"
        :title="null"
        destroyOnClose
        width="1300px"
        @ok="reviewEvaluationVisible = false"
        @cancel="reviewEvaluationVisible = false">
        <div class="review-evaluation-wrapper" v-if="currentReviewEvaluationSessionItem">
          <review-evaluation :class-id="currentReviewEvaluationSessionItem.classId" :slide-id="classData.presentationId" :evaluation-id="currentReviewEvaluationSessionItem.evaluationId" />
        </div>
      </a-modal>

      <a-modal
        v-model="PPTCommentPreviewVisible"
        :footer="null"
        destroyOnClose
        width="800px"
        title="Summary"
        @ok="PPTCommentPreviewVisible = false"
        @cancel="PPTCommentPreviewVisible = false">
        <div class="view-ppt-comment">
          <ppt-comment-preview :slide-id="slideId" :class-data="classData" v-if="slideId"/>
        </div>
      </a-modal>

      <a-modal
        v-model="takeAwayPreviewVisible"
        :footer="null"
        destroyOnClose
        :dialog-style="{ top: '30px' }"
        width="1150px"
        title="Takeaways"
        @ok="takeAwayPreviewVisible = false"
        @cancel="takeAwayPreviewVisible = false">
        <div class="view-take-away">
          <div class='class-student-list'>
            <div class="class-group">
              <div class="class-student-wrapper">
                <div class="group-list-wrapper">
                  <div class="no-group-student-list">
                    <div class="student-list">
                      <div
                        :class="{'list-item': true, 'selected-student': currentActiveStudentId === member.userId}"
                        v-for="(member, sIndex) in allNoGroupStudentUserList"
                        :key="sIndex"
                        :data-member-id="member.userId"
                        @click="handleClickMember(member)">
                        <div class="student-avatar">
                          <img :src="member.studentAvatar" alt="" v-if="member.studentAvatar" />
                          <img
                            slot="prefix"
                            src="~@/assets/icons/evaluation/default_avatar.png"
                            alt=""
                            v-if="!member.studentAvatar" />
                        </div>
                        <div class="student-name" :data-email="member.userId">
                          <a-tooltip placement="top" :mouseEnterDelay="1">
                            <template slot="title">
                              {{ member.realName }}
                            </template>
                            {{ member.realName }}
                          </a-tooltip>
                        </div>
                        <div class="select-status-icon" v-if="currentActiveStudentId === member.userId">
                          <a-icon type="check-circle" style="{color: #07AB84}" theme="filled" class="my-selected-icon" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    class="group-item"
                    v-for="(group, gIdx) in groups"
                    :key="gIdx"
                    :data-group-id="group.id">
                    <div class="group-item-info">
                      <div class="group-left">
                        <div class="group-icon">
                          <group-icon />
                        </div>
                        <div class="group-name">
                          {{ group.name }}
                        </div>
                      </div>
                      <div class="group-right" @click="handleToggleGroupExpand(group, $event)">
                        <div class="group-expand-status">
                          <template v-if="group.expand">
                            <arrow-down />
                          </template>
                          <template v-if="!group.expand">
                            <arrow-top />
                          </template>
                        </div>
                      </div>
                    </div>
                    <div class="group-student-list" v-show="group.expand">
                      <div class="student-list">
                        <div
                          :class="{'list-item': true, 'selected-student': currentActiveStudentId === member.userId}"
                          v-for="(member, sIndex) in group.members"
                          :key="sIndex"
                          :data-member-id="member.userId"
                          @click="handleClickMember( member)">
                          <div class="student-avatar">
                            <img :src="member.studentAvatar" alt="" v-if="member.studentAvatar" />
                            <img
                              slot="prefix"
                              src="~@/assets/icons/evaluation/default_avatar.png"
                              alt=""
                              v-if="!member.studentAvatar" />
                          </div>
                          <div class="student-name" :data-email="member.email">
                            <a-tooltip placement="top" :mouseEnterDelay="1">
                              <template slot="title">
                                {{ member.realName }}
                              </template>
                              {{ member.realName }}
                            </a-tooltip>
                          </div>
                          <div class="select-status-icon" v-if=" currentActiveStudentId === member.userId">
                            <a-icon
                              type="check-circle"
                              style="{color: #07AB84}"
                              theme="filled"
                              class="my-selected-icon" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="no-group-tips">
                    <no-more-resources v-if="allStudentUserList.length === 0 && !loadingStudentList" tips="No student exist" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class='ppt-slide-view'>
            <div class="slide-preview" v-if="currentActiveStudentId">
              <takeaway-ppt-slide-view
                ref='takeaway'
                :class-id="takeAwayClassId"
                :session-id='takeAwaySessionId'
                :slide-id="takeAwaySlideId"
                mode='takeaway'
                :student-name="currentActiveStudentId" />
            </div>
          </div>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script>
import { FindMyClasses, GetEvaluationMode, GetSessionEvaluationByClassId } from '@/api/evaluation'
import TvSvg from '@/assets/icons/lesson/tv.svg?inline'
import * as logger from '@/utils/logger'
import { typeMap } from '@/const/teacher'

import PptCommentPreview from '@/components/Teacher/PptCommentPreview'
import { lessonHost, lessonStatus } from '@/const/googleSlide'
import ReviewEvaluation from '@/components/Evaluation/ReviewEvaluation'
import ArchiveSessionIcon from '@/assets/svgIcon/evaluation/ArchiveSession.svg?inline'
import EvaluateIcon from '@/assets/svgIcon/evaluation/Evaluate.svg?inline'
import NoMoreResources from '@/components/Common/NoMoreResources'
import Bianji from '@/assets/icons/common/Bianji.svg?inline'
import TakeAwayIcon from '@/assets/icons/common/take_away.svg?inline'
import { AddOrUpdateClass, ChangeClassStatus } from '@/api/classroom'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import TakeawayPptSlideView from '@/components/Evaluation/TakeawayPptSlideView'
import TeacherEvaluationStatus from '@/components/Evaluation/TeacherEvaluationStatus'
import { ClassType } from '@/const/common'
import GroupIcon from '@/assets/svgIcon/evaluation/qunzu.svg?inline'
import ArrowDown from '@/assets/svgIcon/evaluation/arrow_down.svg?inline'
import ArrowTop from '@/assets/svgIcon/evaluation/arrow_top.svg?inline'

export default {
  name: 'ClassTableList',
  components: {
    TakeawayPptSlideView,
    NoMoreResources,
    ReviewEvaluation,
    TvSvg,
    PptCommentPreview,
    ArchiveSessionIcon,
    EvaluateIcon,
    Bianji,
    ArrowTop,
    ArrowDown,
    TakeAwayIcon,
    GroupIcon
  },
  props: {
    slideId: {
      type: String,
      default: null
    },
    active: {
      type: Boolean,
      default: true
    },
    classData: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      editItem: {},
      createNewName: '',
      sessionName: '',
      data: [],
      loading: true,
      typeMap: typeMap,

      PPTCommentPreviewVisible: false,
      currentClassId: null,
      loadFailed: false,
      cursor: 0,
      currentPage: 0,
      pageSize: 100,
      total: 0,

      reviewEvaluationVisible: false,
      currentReviewEvaluationSessionItem: null,

      // TODO 新增tag接口
      tagList: ['Content tag', 'Content tag', 'Content tag'],
      colorList: [ 'pink', 'red', 'orange', 'green', 'purple', 'cyan', 'blue' ],
      columns: [
        {
          title: 'Starting time',
          dataIndex: 'date',
          key: 'dateTime',
          scopedSlots: { customRender: 'date' },
          width: 200
        },
        {
          title: 'Scheduled',
          dataIndex: 'sessionStartTime',
          key: 'sessionStartTime',
          scopedSlots: { customRender: 'startTime' },
          width: 150
        },
        {
          title: 'Class',
          dataIndex: 'className',
          width: 200,
          scopedSlots: { customRender: 'className' }
        },
        {
          title: 'Status',
          dataIndex: 'status',
          width: 100,
          scopedSlots: { customRender: 'status' }
        },
        {
          title: 'Session name',
          dataIndex: 'sessionName',
          width: 250,
          scopedSlots: { customRender: 'sessionName' }
        },
        {
          title: '',
          dataIndex: 'action',
          width: 100,
          scopedSlots: { customRender: 'action' }
        }
      ],

      menuVisible: false,
      activeMenuIndex: -1,

      loadingStudentList: false,
      takeAwayPreviewVisible: false,

      groups: [],
      allStudentUserList: [],
      allNoGroupStudentUserList: [], // 所有未分组的学生列表
      currentActiveStudentId: null,
      takeAwaySlideId: null,
      takeAwayClassId: null,
      takeAwaySessionId: null,
      classStatus: lessonStatus,
      classType: ClassType
    }
  },
  mounted () {
    this.loadTeacherClasses()
  },
  methods: {
    loadTeacherClasses () {
      logger.info('loadTeacherClasses ' + ' limit:' + this.pageSize + ' slideId:' + this.slideId + ' searchKey:' + this.sessionName)
      this.loading = true
      this.data = []
      FindMyClasses({ limit: this.pageSize, slideId: this.slideId, delFlag: this.active ? 0 : 1, searchKey: this.sessionName }).then(response => {
        logger.info('FindMyClasses', response.result.data)
        if (response.success) {
          if (this.pageSize) {
            this.data = response.result.classList.filter(item => item.date !== 0)
          }
        }
        this.total = response.result.classList.length
        logger.info(' data', this.data)
        this.loading = false
      })
    },

    handleTeacherProjecting (item) {
      this.$logger.info('handleStartSession', item)
      const targetUrl = lessonHost + 'd/' + item.classId + '?token=' + storage.get('feathers-jwt')
      this.$logger.info('try open ' + targetUrl)
      // window.open(targetUrl, '_blank')
      // 课堂那边需要点击返回回到表单，改成location.href跳转
      const url = lessonHost + 't/' + item.classId + '?token=' + storage.get('feathers-jwt')
      var height = document.documentElement.clientHeight * 0.7
      var width = document.documentElement.clientWidth * 0.7
      var strWindowFeatures = 'width=' + width + ',height=' + height + ',menubar=yes,location=yes,resizable=yes,scrollbars=true,status=true,top=100,left=200'
      var windowObjectReference
      if (item.status === this.classStatus.teacherPaced) {
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
    },

    handleDashboard (item) {
      this.$logger.info('handleDashboard', item)
      window.open(lessonHost + 'd/' + item.classId, '_blank')
    },

    handleReviewEditEvaluation (item) {
      this.$logger.info('handleReviewEditEvaluation', item, this.classData)
      // 先判断evaluation当前在状态，默认教师评估状态。然后进入不同的状态路由
      GetEvaluationMode({
        sessionId: item.classId
      }).then(response => {
          if (response.success) {
            if (response.result.mode === TeacherEvaluationStatus.Editing) {
              this.$router.push({
                path: `/teacher/class-evaluation/${this.classData.id}/${item.taskClassId}/${item.classId}/edit`
              })
            } else {
              this.$router.push({
                path: `/teacher/class-evaluation/${this.classData.id}/${item.taskClassId}/${item.classId}`
              })
            }
          } else {
            this.$message.warn(response.message)
          }
      })
    },
    searchSession () {
      this.$logger.info('searchSession', this.sessionName)
      this.loadTeacherClasses()
    },
    handleArchiveSession (item) {
      this.$logger.info('handleArchiveSession', item)
      this.$confirm({
        title: 'Confirm archive session',
        content: 'Are you confirm archive this session ?',
        centered: true,
        onOk: () => {
          ChangeClassStatus({ classId: item.classId, status: 1 }).then(response => {
            this.$logger.info('ChangeClassStatus', response)
          }).finally(() => {
            this.loadTeacherClasses()
          })
        }
      })
    },
    handleRenameSession (item) {
      this.createNewName = ''
      this.editItem = item
    },
    handleConfirmName () {
      if (!this.createNewName) {
        this.editItem = {}
        this.createNewName = ''
        return
      }
      this.editItem.sessionName = this.createNewName
      AddOrUpdateClass(this.editItem).then(response => {
        this.editItem = {}
        this.createNewName = ''
        this.loadTeacherClasses()
      })
    },
    handleRestoreSession (item) {
      this.$logger.info('handleRestoreSession', item)
      this.$confirm({
        title: 'Confirm restore session',
        content: 'Are you confirm restore this session ?',
        centered: true,
        onOk: () => {
          ChangeClassStatus({ classId: item.classId, status: 0 }).then(response => {
            this.$logger.info('ChangeClassStatus', response)
          }).finally(() => {
            this.loadTeacherClasses()
          })
        }
      })
    },

    getStatusFormat (status) {
      if (status === this.classStatus.close) {
        return 'Ended'
      } else if (status === this.classStatus.live || status === this.classStatus.studentPaced) {
        return this.classStatus.studentPaced
      } else if (status === this.classStatus.teacherPaced) {
        return this.classStatus.teacherPaced
      } else {
        return status
      }
    },

    handleReopenSession (item) {
      this.$logger.info('handleRestoreSession', item)
      this.$confirm({
        title: 'Confirm reopen session',
        content: 'Are you confirm reopen this session ?',
        centered: true,
        onOk: () => {
          item.status = 'live'
          AddOrUpdateClass(item).then(response => {
            location.href = lessonHost + 'd/' + item.classId + '?reopen=1&token=' + storage.get(ACCESS_TOKEN)
            this.loadTeacherClasses()
          })
        }
      })
    },

    handleEndSession (item) {
      this.$logger.info('handleEndSession', item)
      this.$confirm({
        title: 'Confirm end session',
        content: 'Are you confirm end this session ?',
        centered: true,
        onOk: () => {
          item.status = 'close'
          AddOrUpdateClass(item).then(response => {
            this.loadTeacherClasses()
          })
        }
      })
    },

    handleTakeAway (item) {
      this.$logger.info('handleTakeAway', item)
      this.takeAwayClassId = item.taskClassId
      this.takeAwaySessionId = item.classId
      this.takeAwaySlideId = item.slideId
      this.currentActiveStudentId = null
      this.loadingStudentList = true
      this.takeAwayPreviewVisible = true
      this.loadTakeAwayClassStudentData(item.classId)
      this.menuVisible = false
    },

    handleClickMember (member) {
      this.$logger.info('handleClickMember', member)
      if (this.$refs.takeaway) {
        this.$refs.takeaway.handleEnsureTakeaway()
      }
      this.currentActiveStudentId = member.userId
    },
    handleToggleGroupExpand (group, event) {
      event.stopPropagation()
      event.preventDefault()
      this.$logger.info('handleToggleGroupExpand', group)
      group.expand = !group.expand
    },

    loadTakeAwayClassStudentData (classId) {
      this.$logger.info('loadTakeAwayClassStudentData classId ' + classId)
      this.loadingTakeAwayData = true
      GetSessionEvaluationByClassId({ classId }).then(response => {
        this.$logger.info('init data response', response)
        // 加载班级信息数据
        this.$logger.info('GetSessionEvaluationByClassId response', response.result)
        // 所有的学生id用于遍历构造学生评价数据 "对象"
        const allGroupStudentUserIdList = []

        const data = response.result
        data.groups.forEach(group => {
          group.expand = true // 默认分组展开显示
          group.members.forEach(member => {
            allGroupStudentUserIdList.push(member.userId)
          })
        })
        this.groups = data.groups

        // 遍历所有学生，找出不存在分组中的
        this.allNoGroupStudentUserList = []
        if (data.classMembersVos && data.classMembersVos.length) {
          data.classMembersVos.forEach(item => {
            item.userId = item.email
          })
          this.$logger.info('formatted classMembersVos', data.classMembersVos)
          data.classMembersVos.forEach(studentItem => {
            if (allGroupStudentUserIdList.indexOf(studentItem.userId) === -1) {
              this.allNoGroupStudentUserList.push(studentItem)
            }
          })
          this.allStudentUserList = data.classMembersVos
        }
      }).finally(() => {
        if (this.allStudentUserList.length) {
          this.handleClickMember(this.allStudentUserList[0])
        }
        this.loadingStudentList = false
      })
    },

    handleActivePopover (index) {
      this.activeMenuIndex = index
      this.menuVisible = true
    },

    hiddenMenu () {
      this.menuVisible = false
    }
  }
}
</script>

<style lang="less" scoped>

.my-class-list {
  //box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.08);
  opacity: 1;
  //border: 1px solid #D8D8D8;
  border-radius: 6px;
  height: 620px;
  margin-top: 10px;
  margin-bottom: 15px;
  overflow-y: scroll;
  background: #FFFFFF;

  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }
  &::-webkit-scrollbar-track {
    border-radius: 3px;
    background: rgba(0,0,0,0.00);
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.01);
  }
  /* 滚动条滑块 */
  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: rgba(0,0,0,0.12);
    -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.01);
  }
  .preview-session-search{
    margin: 0px 5px 20px 5px;
    width: 400px;
  }

 /deep/ .ant-table-row-cell-break-word{
   height:60px;
 }
  /deep/ .ant-table-thead > tr > th{
    font-weight: bold;
  }
  .class-list {
    font-family: Inter-Bold;
    .flex-center{
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
    }
    .flex-right{
      display: flex;
      align-items: center;
      justify-content: flex-end;
      font-size: 13px;
    }
    .table-date{
      font-size: 13px;
    }

    .class-icon {
      width: 40px;
      display: flex;
      flex-direction: row;
      align-items: center;

      img {
        height: 30px;
      }
    }

    .class-name {
      display: flex;
      align-items: center;
      overflow: hidden;

      .class-name-text {
        display: flex;
        font-size:13px;
        flex-wrap: nowrap;
        align-items: center;
        padding-right: 5px;
      }
    }

    .class-date {
      width: 150px;
      //font-size: 12px;
      font-family: Inter-Bold;
      line-height: 24px;
      color: #aaa;
      text-align: right;
      padding-right: 20px;
    }

    .class-action {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;

      .icon-action {
        display: flex;
        flex-direction: row;
        align-items: center;
        .icon-action-item {
          cursor: pointer;
          padding: 5px 8px;
          box-sizing: border-box;
          img {
            height: 20px;
          }
          .icon-gray {
            display: inline-block;
          }

          .icon-color {
            display: none;
          }
        }

        .icon-action-item:hover {
          .icon-gray {
            display: none;
          }

          .icon-color {
            display: inline-block;
          }
        }
      }

      .more-action {
        cursor: pointer;
        padding: 0 5px;
        margin-left: 8px;
        img {
          height: 15px;
        }
      }
    }

    /deep/ .ant-table-row-cell-break-word{
      text-align: center;
    }
  }
}
.class-more-icon-panel {
  display: flex;
  flex-direction: column;
  width: 200px;

  .class-more-item {
    cursor: pointer;
    padding: 5px;
    margin-bottom: 5px;
    margin-top: 5px;
    display: flex;
    flex-direction: row;
    align-items: center;

    .class-action-icon {
      width: 40px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      svg {
        width: 30px;
        max-height: 25px;
      }
    }
  }

  .class-more-item:hover {
    background: #eee;
  }
}

.loading {
  padding: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  .ant-spin {
    text-align: center;
  }
}

.no-data {
  padding: 100px;
}

.class-group {
  width: 200px;
  height: 100%;

  .class-student-wrapper {
    height: 500px;
    background: #FFFFFF;
    border: 1px solid #dadada;
    opacity: 1;
    border-radius: 0px 0px 4px 4px;

    .group-list-wrapper {
      height: 100%;
      display: flex;
      flex-direction: column;
      max-height: 500px;
      overflow-y: scroll;

      &::-webkit-scrollbar {
        width: 5px;
        height: 5px;
      }

      &::-webkit-scrollbar-track {
        border-radius: 3px;
        background: rgba(0, 0, 0, 0.01);
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.01);
      }

      /* 滚动条滑块 */

      &::-webkit-scrollbar-thumb {
        border-radius: 5px;
        background: rgba(0, 0, 0, 0.06);
        -webkit-box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.01);
      }

      .group-item {
        display: flex;
        flex-direction: column;

        .group-item-info {
          line-height: 30px;
          display: flex;
          user-select: none;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          padding: 10px;
          cursor: pointer;

          &:hover {
            background-color: #F7F8FF;
          }

          .group-left {
            display: flex;
            flex-direction: row;
            align-items: center;
            position: relative;

            .group-icon {
              display: flex;
              flex-direction: row;
              align-items: center;

              svg {
                height: 20px;
              }
            }

            .group-name {
              padding: 0 5px;
            }

            .group-select-status {
              margin-left: 5px;
              width: 30px;
              user-select: none;

              svg {
                fill: #07AB84;
                color: #07AB84;
              }
            }
          }

          .group-right {
          }
        }

        .group-student-list {
          .student-list {
            display: flex;
            flex-direction: column;

            .list-item {
              cursor: pointer;
              padding: 10px;
              user-select: none;
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: flex-start;
              position: relative;

              &:hover {
                background-color: #F7F8FF;
              }

              .student-avatar {
                img {
                  width: 30px;
                }
              }

              .student-name {
                padding: 0 5px;
                font-family: Inter-Bold;
                line-height: 24px;
                color: #11142D;
                width: 180px;
                overflow: hidden;
                text-overflow: ellipsis;
                word-break: break-all;
                white-space: nowrap;
              }

              .select-status-icon {
                position: absolute;
                color: #15c39a;
                right: 5px;
                top: 50%;
                margin-top: -7.5px;

                img {
                  height: 15px;
                }
              }
            }
          }
        }
      }
    }
  }
}

.no-group-tips {
  margin-top: 100px;
}

.no-group-student-list {
  .student-list {
    display: flex;
    flex-direction: column;

    .list-item {
      cursor: pointer;
      padding: 10px;
      user-select: none;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      position: relative;

      &:hover {
        background-color: #F7F8FF;
      }

      .student-avatar {
        img {
          width: 30px;
        }
      }

      .student-name {
        padding: 0 5px;
        font-family: Inter-Bold;
        line-height: 24px;
        color: #11142D;
        width: 180px;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
        white-space: nowrap;
      }

      .select-status-icon {
        position: absolute;
        color: #15c39a;
        right: 5px;
        top: 50%;
        margin-top: -7.5px;

        img {
          height: 15px;
        }
      }
    }
  }
}

.view-take-away {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
}

.ppt-slide-view {
  padding-left: 10px;
  min-width: 900px;
}

.class-group {
  margin-bottom: 40px;
}
</style>
