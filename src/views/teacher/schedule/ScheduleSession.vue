<template>
  <div class='schedule-session'>
    <div class='fixed-header'>
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
          v-show='currentActiveStepIndex === 0'
          @select-class-student='handleSelectClassStudent'
          @select-workshop-type='handleSelectWorkshopType'/>
        <schedule-date
          v-if='!scheduleReq.openSession && currentActiveStepIndex === 1'
          :calendarSearchFilters="calendarSearchFilters"
          :calendarSearchType="calendarSearchType"
          @select-date='handleSelectDate'
          @update-zoom='handleUpdateZoom'
          @select-session-type='handleSelectSessionType'
          @select-zoom-status='handleSelectZoom'
        />
        <schedule-pay-info
          ref='pay'
          :type="type"
          v-if='userMode === USER_MODE.SELF && scheduleReq.openSession && currentActiveStepIndex === 1'
          @select-date='handleSelectDate'
        />
        <school-schedule
          ref='pay'
          :type="type"
          v-if='userMode === USER_MODE.SCHOOL && scheduleReq.openSession && currentActiveStepIndex === 1'
          @select-date='handleSelectDate'
        />
      </div>
    </div>
    <fixed-form-footer>
      <template v-slot:left>
        <a-button @click='handleGoBack'><a-icon type='left' /> Back</a-button>
      </template>
      <template v-slot:right>
        <div class='right-button'>
          <a-space>
            <a-button type='primary' @click='handleGoNext' :loading='creating' v-if='currentActiveStepIndex !== $classcipe.ScheduleSteps.length - 1'>
              <template>
                Next <a-icon type='right' />
              </template>
            </a-button>
            <a-button type='primary' :disabled="!scheduleReq.startDate || !scheduleReq.endDate" @click='handleGoNext' :loading='creating' v-else>
              <template >Assign</template>
            </a-button>
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
import { AddSessionV2, UpdateSessionV2 } from '@/api/v2/classes'
import { ZoomAuthMixin } from '@/mixins/ZoomAuthMixin'
import FixedFormFooter from '@/components/Common/FixedFormFooter'
import ZoomMeetingSetting from '@/components/Schedule/ZoomMeetingSetting'
import { CALENDAR_QUERY_TYPE, USER_MODE } from '@/const/common'

import { mapState } from 'vuex'

export default {
  name: 'ScheduleSession',
  components: { ZoomMeetingSetting, FixedFormFooter, SchedulePayInfo, SchoolSchedule, ScheduleDate, SelectParticipant, SelectSessionUnit, MyVerticalSteps },
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
      loading: true,
      currentActiveStepIndex: 0,
      selectSessionUnitVisible: false,
      associateUnitList: [],

      classList: [],

      scheduleReq: {
        classIds: [],
        contentId: this.id,
        endDate: null,
        openSession: false,
        planId: null,
        register: {
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
      sessionId: ''
    }
  },
  computed: {
    ...mapState({
      userMode: state => state.app.userMode
    })
  },
  created() {
    this.$logger.info(`ScheduleSession created with id: ${this.id} type ${this.type}`)
    this.handleAssociate()
    this.loading = false
    this.sessionId = this.$route.query.sessionId

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

    async handleAssociate() {
      this.$logger.info('ScheduleSession associateUnitList start', this.associateUnitList)
      const associateData = await this.getAssociate(this.id, this.type)
      associateData.ownerLinkList.forEach(groupItem => {
        groupItem.contents.forEach(item => {
          if (item.type === this.$classcipe.typeMap['unit-plan']) {
            this.associateUnitList.push(item)
          }
        })
      })
      this.$logger.info('ScheduleSession associateUnitList', this.associateUnitList)
      if (this.associateUnitList.length === 1) {
        this.scheduleReq.planId = this.associateUnitList[0].id
      } else if (this.associateUnitList.length > 1) {
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

    handleBack () {
      this.$router.go(-1)
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

    async handleConfirmAssign () {
      this.$logger.info('ScheduleSession handleConfirmAssign ')
      await this.createSession()
    },

    handleSelectClassStudent (cls) {
      this.$logger.info('handleSelectClassStudent cls', cls)
      this.scheduleReq.openSession = false
      this.scheduleReq.workshopType = 0
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

    handleSelectZoom (zoom) {
      this.scheduleReq.zoom = zoom ? 1 : 0
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
      }

      if (!this.scheduleReq.startDate || !this.scheduleReq.endDate) {
        this.$message.warn('Please select Schedule time!')
        return
      }
      this.creating = true
      try {
        let res
        if (this.sessionId) {
          this.scheduleReq.sessionId = this.sessionId
          this.$logger.info('try updateSession scheduleReq', this.scheduleReq)
          res = await UpdateSessionV2(this.scheduleReq)
        } else {
          this.$logger.info('try createSession scheduleReq', this.scheduleReq)
          res = await AddSessionV2(this.scheduleReq)
        }
        this.$logger.info('save scheduleReq', res, 'retValue', retValue)
        if (res.result && res.success && res.code === 0) {
          this.$message.success('Schedule session successfully')
          if (retValue) {
            return res.result
          } else {
            if (res.result.length && res.result[0].taskClassId) {
              this.finishAndGoBack(res.result[0].taskClassId)
            } else {
              this.$router.replace({
                path: `/teacher/main/live-workshops?workshopsType=2`
              })
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
          path: `/teacher/main/live-workshops?workshopsType=2`
        })
      } else {
        this.$router.replace({
          path: `/teacher/class-session/${taskClassId}`
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
</style>
