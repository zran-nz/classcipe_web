<template>
  <div class='schedule-session'>
    <div class='fixed-header'>
      <div class='nav-back'>
        <custom-link-text @click='handleGoBack' text='Back'>
          <template v-slot:prefix>
            <a-icon type='left' />
          </template>
        </custom-link-text>
      </div>
      <my-vertical-steps
        ref='steps-nav'
        :allow-switch='false'
        :steps='$classcipe.ScheduleSteps'
        :step-index='currentActiveStepIndex'
        @step-change='handleStepChange'/>
    </div>
    <div class='schedule-content-wrapper'>
      <a-skeleton v-show='loading' />
      <div class='schedule-content' v-show='!loading'>
        <select-participant
          ref='participant'
          :class-list='classList'
          :classId="currentClass"
          v-show='currentActiveStepIndex === 0'
          @select-class-student='handleSelectClassStudent'
          @select-workshop-type='handleSelectWorkshopType'/>
        <schedule-date
          v-if='!scheduleReq.openSession && currentActiveStepIndex === 1'
          :calendarSearchFilters="calendarSearchFilters"
          :calendarSearchType="calendarSearchType"
          :must-zoom="type === $classcipe.typeMap['pd']"
          :init-zoom="initZoom"
          :defaultDate="initDate"
          @select-date='handleSelectDate'
          @update-zoom='handleUpdateZoom'
          @select-session-type='handleSelectSessionType'
          @select-zoom-status='handleSelectZoom'
        >
          <div slot="title" class="choose-title">
            <a-space class='task-type-info' v-if='taskType'>
              <div class="title">Task type:</div>
              <div class='self-type-wrapper'>
                <div class='self-field-label'>
                  <div
                    class='task-type-item green-active-task-type'
                    v-if="taskType === 'FA'">
                    <a-tooltip placement='top' title='Formative Assessment'>FA</a-tooltip>
                  </div>
                  <div
                    class='task-type-item red-active-task-type'
                    v-if="taskType === 'SA'">
                    <a-tooltip placement='top' title='Summative Assessment'>SA</a-tooltip>
                  </div>
                  <div
                    class='task-type-item blue-active-task-type task-type-activity'
                    v-if="taskType === 'Activity'">
                    <a-tooltip title='Teaching/Learning Activity' placement='top'>Activity</a-tooltip>
                  </div>
                  <div
                    class='task-type-item blue-active-task-type task-type-examine'
                    v-if="taskType === 'IA'">
                    <a-tooltip title='Internal Assessment' placement='top'>IA</a-tooltip>
                  </div>
                </div>
              </div>
            </a-space>
            <div class="choose-title">
              <div class="title">Session title:</div>
              <a-textarea @blur="handleChangeTitle" auto-size :maxlength="500" v-model="scheduleReq.register.title"></a-textarea>
            </div>
          </div>
        </schedule-date>
        <schedule-pay-info
          ref='pay'
          :type="type"
          :must-zoom="type === $classcipe.typeMap['pd']"
          :defaultDate="initDate"
          :init-zoom="initZoom"
          v-if='userMode === USER_MODE.SELF && scheduleReq.openSession && currentActiveStepIndex === 1'
          @select-date='handleSelectDate'
          @select-zoom-status='handleSelectZoom'
        >
          <div slot="title" class="choose-title">
            <a-space class='task-type-info' v-if='taskType'>
              <div class="title">Task type:</div>
              <div class='self-type-wrapper'>
                <div class='self-field-label'>
                  <div
                    class='task-type-item green-active-task-type'
                    v-if="taskType === 'FA'">
                    <a-tooltip placement='top' title='Formative Assessment'>FA</a-tooltip>
                  </div>
                  <div
                    class='task-type-item red-active-task-type'
                    v-if="taskType === 'SA'">
                    <a-tooltip placement='top' title='Summative Assessment'>SA</a-tooltip>
                  </div>
                  <div
                    class='task-type-item blue-active-task-type task-type-activity'
                    v-if="taskType === 'Activity'">
                    <a-tooltip title='Teaching/Learning Activity' placement='top'>Activity</a-tooltip>
                  </div>
                  <div
                    class='task-type-item blue-active-task-type task-type-examine'
                    v-if="taskType === 'IA'">
                    <a-tooltip title='Internal Assessment' placement='top'>IA</a-tooltip>
                  </div>
                </div>
              </div>
            </a-space>
            <div class="choose-title">
              <div class="title">Session title:</div>
              <a-textarea auto-size :maxlength="500" v-model="scheduleReq.register.title"></a-textarea>
            </div>
          </div>
        </schedule-pay-info>
        <school-schedule
          ref='pay'
          :type="type"
          :must-zoom="type === $classcipe.typeMap['pd']"
          :defaultDate="initDate"
          :init-zoom="initZoom"
          v-if='userMode === USER_MODE.SCHOOL && scheduleReq.openSession && currentActiveStepIndex === 1'
          @select-date='handleSelectDate'
          @select-zoom-status='handleSelectZoom'
        >
          <div slot="title" class="choose-title">
            <a-space class='task-type-info' v-if='taskType'>
              <div class="title">Task type:</div>
              <div class='self-type-wrapper'>
                <div class='self-field-label'>
                  <div
                    class='task-type-item green-active-task-type'
                    v-if="taskType === 'FA'">
                    <a-tooltip placement='top' title='Formative Assessment'>FA</a-tooltip>
                  </div>
                  <div
                    class='task-type-item red-active-task-type'
                    v-if="taskType === 'SA'">
                    <a-tooltip placement='top' title='Summative Assessment'>SA</a-tooltip>
                  </div>
                  <div
                    class='task-type-item blue-active-task-type task-type-activity'
                    v-if="taskType === 'Activity'">
                    <a-tooltip title='Teaching/Learning Activity' placement='top'>Activity</a-tooltip>
                  </div>
                  <div
                    class='task-type-item blue-active-task-type task-type-examine'
                    v-if="taskType === 'IA'">
                    <a-tooltip title='Internal Assessment' placement='top'>IA</a-tooltip>
                  </div>
                </div>
              </div>
            </a-space>
            <div class="choose-title">
              <div class="title">Session title:</div>
              <a-textarea auto-size :maxlength="500" v-model="scheduleReq.register.title"></a-textarea>
            </div>
          </div>
        </school-schedule>
      </div>
    </div>
    <fixed-form-footer>
      <template v-slot:left>
        <a-button @click='handleBack'><a-icon type='left' /> Discard</a-button>
      </template>
      <template v-slot:right>
        <div class='right-button'>
          <a-space>
            <template v-if='currentActiveStepIndex !== $classcipe.ScheduleSteps.length - 1'>
              <a-button type='primary' @click='handleGoNext' :loading='creating' v-if="scheduleReq.classIds && scheduleReq.classIds.length > 0">
                <template>
                  Next <a-icon type='right' />
                </template>
              </a-button>
              <a-tooltip title="Please select a class" v-else>
                <a-button type='primary' :disabled="true" :loading='creating' >
                  <template>
                    Next <a-icon type='right' />
                  </template>
                </a-button>
              </a-tooltip>
            </template>
            <template v-else>
              <a-tooltip :title="(scheduleReq.zoom == 1 && !$store.getters.zoomChecked) ? 'Please link your zoom account' : !scheduleReq.register.title ? 'Please Input title' : 'The scheduled time above will be cleared.'">
                <a-button
                  type='primary'
                  :disabled="(scheduleReq.zoom == 1 && !$store.getters.zoomChecked )|| !scheduleReq.register.title"
                  @click="handeStartSessionNow"
                  :loading='creating'>
                  <template >Start session now</template>
                </a-button>
              </a-tooltip>
              <a-tooltip
                :title="(scheduleReq.zoom == 1 && !$store.getters.zoomChecked) ? 'Please link your zoom account' : !scheduleReq.register.title ? 'Please Input title' : 'The scheduled time above will be cleared.'"
                v-if="(scheduleReq.zoom == 1 && !$store.getters.zoomChecked) || !scheduleReq.register.title">
                <a-button type='primary' :disabled="true" :loading='creating'>
                  <template >Assign</template>
                </a-button>
              </a-tooltip>
              <a-tooltip
                title="Please Select Schedule time"
                v-else-if="(!scheduleReq.startDate || !scheduleReq.endDate)">
                <a-button type='primary' :disabled="true" :loading='creating'>
                  <template >Assign</template>
                </a-button>
              </a-tooltip>
              <a-button type='primary' @click='handleGoNext' :loading='creating' v-else>
                <template >Assign</template>
              </a-button>
            </template>
          </a-space>
        </div>
      </template>
    </fixed-form-footer>

    <select-session-unit
      v-if='selectSessionUnitVisible'
      :list='associateUnitList'
      @back='handleBack'
      @select='handleSelectUnit' />
  </div>
</template>

<script>

import MyVerticalSteps from '@/components/Steps/MyVerticalSteps'
import { AssociateMixin } from '@/mixins/AssociateMixin'
import { SchoolClassGetMyClasses } from '@/api/schoolClass'
import SelectSessionUnit from '@/components/Schedule/SelectSessionUnit'
import SelectParticipant from '@/components/Schedule/SelectParticipant'
import ScheduleDate from '@/components/Schedule/ScheduleDate'
import SchedulePayInfo from '@/components/Schedule/SchedulePayInfo'
import SchoolSchedule from '@/components/Schedule/SchoolSchedule'
import { AddSessionV2, EditSessionScheduleV2, UpdateSessionV2 } from '@/api/v2/classes'
import { DetailBySessionId } from '@/api/v2/live'
import { ZoomAuthMixin } from '@/mixins/ZoomAuthMixin'
import FixedFormFooter from '@/components/Common/FixedFormFooter'
import ZoomMeetingSetting from '@/components/Schedule/ZoomMeetingSetting'
import { CALENDAR_QUERY_TYPE, USER_MODE } from '@/const/common'
import { lessonHost } from '@/const/googleSlide'
import { typeMap } from '@/const/teacher'
import { TaskQueryById } from '@/api/task'
import { PDContentQueryById } from '@/api/pdContent'

import { mapState } from 'vuex'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import CustomLinkText from '@/components/Common/CustomLinkText'
import moment from 'moment'

export default {
  name: 'ScheduleSession',
  components: { CustomLinkText, ZoomMeetingSetting, FixedFormFooter, SchedulePayInfo, SchoolSchedule, ScheduleDate, SelectParticipant, SelectSessionUnit, MyVerticalSteps },
  mixins: [ AssociateMixin, ZoomAuthMixin ],
  props: {
    id: {
      type: String,
      required: true
    },
    type: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      CALENDAR_QUERY_TYPE: CALENDAR_QUERY_TYPE,
      USER_MODE: USER_MODE,
      typeMap: typeMap,
      loading: true,
      currentActiveStepIndex: 0,
      selectSessionUnitVisible: false,
      associateUnitList: [],

      classList: [],
      currentClass: '',

      scheduleReq: {
        classIds: [],
        contentId: this.id,
        endDate: null,
        openSession: false,
        planId: null,
        register: {
          title: null,
          discountInfo: [],
          maxParticipants: 0,
          price: 0,
          registerBefore: null
        },
        selectStudents: [],
        sessionType: 0,
        startDate: null,
        teachSessionNow: 1,
        password: true,
        waitingRoom: true,
        workshopType: 0, // 1-private workshop 2-public workshop
        zoom: 0
      },
      creating: false,

      calendarSearchFilters: [],
      calendarSearchType: CALENDAR_QUERY_TYPE.CLASS.value,
      sessionId: '',
      origin: null,
      initDate: null,
      initZoom: null,
      taskType: ''
    }
  },
  computed: {
    ...mapState({
      userMode: state => state.app.userMode
    })
  },
  created() {
    this.$logger.info(`ScheduleSession created with id: ${this.id} type ${this.type}`)
    this.scheduleReq.planId = this.$route.query.planId
    if (!this.scheduleReq.planId && !this.$route.query.hasOwnProperty('planId')) {
      this.handleAssociate()
    }
    if (this.$route.query.classId) {
      this.currentClass = this.$route.query.classId
      this.scheduleReq.classIds = [this.$route.query.classId]
    }
    this.loading = false
    this.sessionId = this.$route.query.sessionId
    this.getDetail()
    this.initData()

    this.$EventBus.$on('ZoomMeetingUpdatePassword', this.handleSelectPassword)
    this.$EventBus.$on('ZoomMeetingUpdateWaitingRoom', this.handleSelectWaitingRoom)
  },
  beforeDestroy() {
    this.$EventBus.$off('ZoomMeetingUpdatePassword', this.handleSelectPassword)
    this.$EventBus.$off('ZoomMeetingUpdateWaitingRoom', this.handleSelectWaitingRoom)
  },
  methods: {
    handleStepChange(data) {
      this.$logger.info('ScheduleSession handleStepChange ', data)
      this.currentActiveStepIndex = data.index
    },

    initData() {
      console.log(this.sessionId)
      if (!this.sessionId) {
        let promise = null
        if (this.type === typeMap.task) {
          promise = TaskQueryById
        } else if (this.type === typeMap.pd) {
          promise = PDContentQueryById
        }
        if (promise) {
          this.loading = true
          promise({
            id: this.id
          }).then(response => {
            this.scheduleReq.register.title = response.result.name
            this.taskType = response.result.taskType
          }).finally(() => {
            this.loading = false
          })
        }
      }
    },

    getDetail() {
      if (this.sessionId) {
        this.loading = true
          DetailBySessionId({
          sessionId: this.sessionId
        }).then(res => {
          if (res.success) {
            this.origin = res.result
            const session = res.result.session
            this.currentClass = session.taskClassId
            this.scheduleReq.classIds = [session.taskClassId]
            this.scheduleReq.planId = session.planId
            this.scheduleReq.register = session.register
            this.scheduleReq.selectStudents = session.selectStudents
            this.scheduleReq.zoom = session.hasZoom
            this.scheduleReq.register.title = res.result.title || res.result.session.sessionName
            this.initZoom = {
              enableZoom: Boolean(session.hasZoom)
            }
            this.initDate = [moment.utc(res.result.sessionStartTime).local(), moment.utc(res.result.sessionEndTime).local()]
            this.calendarSearchFilters = this.scheduleReq.classIds
            this.calendarSearchType = CALENDAR_QUERY_TYPE.CLASS.value
            if (this.currentActiveStepIndex === 0) {
              this.$refs['steps-nav'].nextStep()
            }
          }
        }).finally(() => {
          this.loading = false
        })
      }
    },

    async handleAssociate() {
      this.$logger.info('ScheduleSession associateUnitList start', this.associateUnitList)
      const associateData = await this.getAssociate(this.id, this.type)
      associateData.ownerLinkList.forEach(groupItem => {
        groupItem.contents.forEach(item => {
          if (item.type === this.$classcipe.typeMap['unit-plan'] && item.owner.email === this.$store.getters.email) {
            this.associateUnitList.push(item)
          }
        })
      })
      this.$logger.info('ScheduleSession associateUnitList', this.associateUnitList)
      if (this.associateUnitList.length === 1) {
        this.scheduleReq.planId = this.associateUnitList[0].id
      }
      if (this.associateUnitList.length > 0) {
        this.selectSessionUnitVisible = true
      }

      this.getClassList()
    },

    getClassList() {
      SchoolClassGetMyClasses().then(res => {
        this.$logger.info('ScheduleSession getClassList ', res)
        if (res.result) {
          this.classList = res.result
        }
      }).finally(() => {
        this.loading = false
      })
    },

    handleBack() {
      if (window.history.length <= 1) {
        this.$router.push({
          path: '/teacher/main/created-by-me'
        })
        return false
      } else {
        this.$router.go(-1)
      }
    },

    handleSelectUnit(data) {
      this.$logger.info('ScheduleSession handleSelectUnit ', data)
      this.scheduleReq.planId = data.id
      this.selectSessionUnitVisible = false
    },

    handleGoBack () {
      if (this.currentActiveStepIndex === 0) {
        this.handleBack()
      } else {
        this.$refs['steps-nav'].prevStep()
      }
    },
    handleGoNext () {
      const participantData = this.$refs.participant.getSelectedData()
      this.scheduleReq.classIds = participantData.classIds
      if (!this.scheduleReq.classIds.length) {
        return
      }
      if (this.currentActiveStepIndex === 0) {
        this.$refs['steps-nav'].nextStep()
        if (this.scheduleReq.openSession) {
          this.scheduleReq.selectStudents = []
          this.scheduleReq.classIds = []
          this.calendarSearchFilters = [1, 2, 3, 4]
          this.calendarSearchType = CALENDAR_QUERY_TYPE.WORKSHOP.value
        } else {
          const participantData = this.$refs.participant.getSelectedData()
          this.scheduleReq.selectStudents = participantData.selectStudents
          this.scheduleReq.classIds = participantData.classIds

          this.calendarSearchFilters = this.scheduleReq.classIds
          this.calendarSearchType = CALENDAR_QUERY_TYPE.CLASS.value
        }
      } else {
        this.handleConfirmAssign()
      }
    },

    async handeStartSessionNow() {
      const participantData = this.$refs.participant.getSelectedData()
      this.scheduleReq.classIds = participantData.classIds
      if (!this.scheduleReq.classIds.length) {
        return
      }
      this.scheduleReq.startDate = moment().utc().format('YYYY-MM-DD HH:mm:ss')
      this.scheduleReq.endDate = moment().add(40, 'm').utc().format('YYYY-MM-DD HH:mm:ss')
      const res = await this.createSession(true)
      this.$message.success('The scheduled tiem above will be cleard by starting the session now.')
      const url = lessonHost + 't/' + res[0].classId + '?token=' + storage.get(ACCESS_TOKEN)
      window.location.href = url
    },

    async handleConfirmAssign () {
      this.$logger.info('ScheduleSession handleConfirmAssign ')
      await this.createSession()
    },

    handleSelectClassStudent (cls) {
      this.$logger.info('handleSelectClassStudent cls', cls)
      this.scheduleReq.openSession = false
      this.scheduleReq.workshopType = 0
      this.scheduleReq.classIds = cls.map(item => item.id)
      this.$logger.info('handleSelectClassStudent scheduleReq', this.scheduleReq)
    },

    handleSelectWorkshopType (data) {
      this.scheduleReq.workshopType = data.workshopType
      this.scheduleReq.openSession = data.workshopType === 2
      this.scheduleReq.classIds = []
      this.scheduleReq.selectStudents = []
      this.scheduleReq.zoom = 1
      // workshop4种类型
      this.calendarSearchFilters = [1, 2, 3, 4]
      this.calendarSearchType = CALENDAR_QUERY_TYPE.WORKSHOP.value
      this.$refs['steps-nav'].nextStep()
      this.$logger.info('handleSelectWorkshopType', this.scheduleReq)
    },

    handleSelectDate (data) {
      if (!data) {
        this.scheduleReq.startDate = null
        this.scheduleReq.endDate = null
        return
      }
      this.$logger.info('ScheduleSession handleSelectDate ', data)
      this.scheduleReq.startDate = data.startDate
      this.scheduleReq.endDate = data.endDate
      this.$logger.info('ScheduleSession handleSelectDate ', this.scheduleReq)
    },

    handleUpdateZoom (data) {
      this.scheduleReq.password = data.password
      this.scheduleReq.waitingRoom = data.waitingRoom
    },

    handleSelectPassword (val) {
      this.scheduleReq.password = val
    },
    handleSelectWaitingRoom (val) {
      this.scheduleReq.waitingRoom = val
    },
    handleSelectSessionType (type) {
      this.scheduleReq.sessionType = type
    },

    async handleSelectZoom (zoom) {
      let status
      if (zoom) {
        status = await this.checkZoomAuth()
        if (!status) {
          // zoom = 0
          this.$logger.info('reset item enableZoom', zoom)
        } else {
          this.$logger.info('zoom auth success')
        }
      }
      console.log(zoom, status)
      this.scheduleReq.zoom = zoom && !status ? 1 : 0
    },

    /**
     * 如果retValue为false，则表示需要跳转返回。
     * @param retValue
     * @returns {Promise<*>}
     */
    async createSession(retValue) {
      if (this.scheduleReq.openSession) {
        const openSessionData = this.$refs.pay.getPaidInfo()
        if (this.userMode === USER_MODE.SELF) {
          this.scheduleReq.register.discountInfo = openSessionData.discountInfo
          this.scheduleReq.register.maxParticipants = openSessionData.maxParticipants
          this.scheduleReq.register.price = openSessionData.price
          this.scheduleReq.register.registerBefore = openSessionData.registerBefore
        } else if (this.userMode === USER_MODE.SCHOOL) {
          this.scheduleReq.selectTeachers = openSessionData.selectTeachers
          this.scheduleReq.yearList = openSessionData.yearList
          this.scheduleReq.subjectList = openSessionData.subjectList
          this.scheduleReq.languageList = openSessionData.languageList
          this.scheduleReq.register.paidType = openSessionData.paidType
          this.scheduleReq.register.notifyType = openSessionData.notifyType
          this.scheduleReq.register.notifyStudents = openSessionData.notifyStudents
        }
        this.scheduleReq.password = openSessionData.password
        this.scheduleReq.waitingRoom = openSessionData.waitingRoom
        this.scheduleReq.zoom = openSessionData.zoom
      }

      if (!this.scheduleReq.startDate || !this.scheduleReq.endDate) {
        this.$message.warn('Please select Schedule time!')
        return
      }
      this.creating = true
      try {
        let res
        if (this.sessionId && this.origin) {
          this.scheduleReq.sessionId = this.origin.id
          this.$logger.info('try updateSession scheduleReq', this.scheduleReq)
          res = await UpdateSessionV2(this.scheduleReq)
        } else {
          this.$logger.info('try createSession scheduleReq', this.scheduleReq)
          res = await AddSessionV2(this.scheduleReq)
        }
        this.$logger.info('save scheduleReq', res, 'retValue', retValue)
        if (res.result && res.success && res.code === 0) {
          if (retValue) {
            return res.result
          } else {
            this.$message.success('Schedule session successfully')
            if (this.$route.query.source && this.$route.query.source === 'calendar') {
              this.$router.replace('/teacher/main/calendar')
            } else {
              if (res.result.length && res.result[0].taskClassId) {
                this.finishAndGoBack(res.result[0].taskClassId)
              } else {
                this.$router.replace({
                  path: `/teacher/main/live-workshops?workshopsType=2&workshopsStatus=2`
                })
              }
            }
          }
        } else {
          this.$confirm({
            title: 'Warn',
            content: 'Schedule session failed.' + res.message + '. Please try again.',
            centered: true
          })
        }
      } catch (e) {
        console.error(e)
        this.$confirm({
          title: 'Error',
          content: 'Schedule session error.' + e.message + '. Please try again.',
          centered: true
        })
      } finally {
        this.creating = false
      }
      return null
    },

    finishAndGoBack(taskClassId) {
      if (this.scheduleReq.workshopType) {
        this.$router.replace({
          path: `/teacher/main/live-workshops?workshopsType=2&workshopsStatus=2`
        })
      } else {
        this.$router.replace({
          path: `/teacher/class-session/${taskClassId}?workshopsStatus=2`
        })
      }
    },

    handleChangeTitle() {
      if (this.sessionId) {
        this.scheduleReq.sessionId = this.sessionId
        this.$logger.info('try handleChangeTitle', this.scheduleReq)
        EditSessionScheduleV2(this.scheduleReq).then(res => {
          if (res.success) {

          }
        }).finally(res => {
        })
      }
    }
  }
}

</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.schedule-session {
  background-color: #fff;
  padding: 15px;
  min-height: calc(100vh - 50px);
}

.schedule-content-wrapper {
  height: calc(100vh - 150px);
  .schedule-content {
    height: 100%;
  }
}

.bottom-action {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.fixed-header {
  position: relative;
}

.nav-back {
  z-index: 1000;
  position: absolute;
  left: 10px;
  top: 15px;
}
.choose-title {
  margin-bottom: 10px;
  .title {
    font-weight: bold;
    font-size: 16px;
    color: #333;
    line-height: 30px;
  }
}
.self-type-wrapper {
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  .self-field-label {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-size: 0.6rem;

    .task-type-item {
      margin-right: 10px;
      width: 25px;
      height: 25px;
      border-radius: 25px;
      border: 2px solid #ddd;
      font-weight: bold;
      display: flex;
      color: #bbb;
      align-items: center;
      justify-content: center;
    }

    .task-type-activity {
      width: 70px;
      border-radius: 50px;
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

    .blue-active-task-type {
      background: rgb(230, 247, 255);
      border: 2px solid rgb(145, 213, 255);
      border-radius: 50px;
      opacity: 1;
      font-weight: bold;
      color: rgb(24, 144, 255);
    }
  }

  .self-type-filter {
    width: 500px;
  }
}
</style>
