<template>
  <div class='schedule-session'>
    <div class='fixed-header'>
      <my-vertical-steps
        ref='steps-nav'
        :allow-switch='false'
        :steps='workshopSteps'/>
    </div>
    <div class='schedule-content-wrapper'>
      <a-skeleton v-show='loading' />
      <div class='schedule-content' v-show='!loading'>
        <schedule-pay-info
          ref='pay'
          :type="type"
          :must-zoom="true"
          v-if='userMode === USER_MODE.SELF && scheduleReq.openSession'
          @select-date='handleSelectDate'
          @select-zoom-status='handleSelectZoom'
        />
        <school-schedule
          ref='pay'
          :type="type"
          :must-zoom="true"
          v-if='userMode === USER_MODE.SCHOOL && scheduleReq.openSession'
          @select-date='handleSelectDate'
          @select-zoom-status='handleSelectZoom'
        />
      </div>
    </div>
    <fixed-form-footer>
      <template v-slot:left>
        <a-button @click='handleGoBack'><a-icon type='left' /> Discard</a-button>
      </template>
      <template v-slot:right>
        <div class='right-button'>
          <a-tooltip title="Please link your zoom account" v-if="(scheduleReq.zoom == 1 && !$store.getters.zoomChecked)">
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
          <a-button type='primary' :disabled="(!scheduleReq.startDate || !scheduleReq.endDate)" @click='handleGoNext' :loading='creating' v-else>
            <template >Assign</template>
          </a-button>
        </div>
      </template>
    </fixed-form-footer>

    <select-session-unit
      v-if='selectSessionUnitVisible'
      :list='associateUnitList'
      @back='handleBack'
      @select='handleSelectUnit' />

    <verification-tip ref="verificationTip" @continue="createSession"/>
  </div>
</template>

<script>
// 已废弃，统一到AddLiveWorkShop页面
import MyVerticalSteps from '@/components/Steps/MyVerticalSteps'
import { AssociateMixin } from '@/mixins/AssociateMixin'
import { SchoolClassGetMyClasses } from '@/api/schoolClass'
import SelectSessionUnit from '@/components/Schedule/SelectSessionUnit'
import SelectParticipant from '@/components/Schedule/SelectParticipant'
import ScheduleDate from '@/components/Schedule/ScheduleDate'
import SchedulePayInfo from '@/components/Schedule/SchedulePayInfo'
import SchoolSchedule from '@/components/Schedule/SchoolSchedule'
import { AddSessionV2 } from '@/api/v2/classes'
import { ZoomAuthMixin } from '@/mixins/ZoomAuthMixin'
import FixedFormFooter from '@/components/Common/FixedFormFooter'
import ZoomMeetingSetting from '@/components/Schedule/ZoomMeetingSetting'
import VerificationTip from '@/components/MyContentV2/VerificationTip.vue'
import { CALENDAR_QUERY_TYPE, USER_MODE } from '@/const/common'
import { TEACHER_SECURITY_NOT_SHOW } from '@/store/mutation-types'
import { getCookie } from '@/utils/util'
import { mapState } from 'vuex'

export default {
  name: 'ScheduleWorkshop',
  components: {
    ZoomMeetingSetting,
    FixedFormFooter,
    SchedulePayInfo,
    SchoolSchedule,
    ScheduleDate,
    SelectParticipant,
    SelectSessionUnit,
    MyVerticalSteps,
    VerificationTip
  },
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
      teacherSessionNowLoading: false,
      currentActiveStepIndex: 0,
      selectSessionUnitVisible: false,
      associateUnitList: [],

      classList: [],

      scheduleReq: {
        classIds: [],
        contentId: this.id,
        endDate: null,
        openSession: true,
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
        workshopType: 1, // 1-private workshop 2-public workshop
        zoom: 1
      },
      creating: false,

      workshopSteps: [
        {
          id: '1',
          name: 'Schedule Workshop',
          description: null
        }
      ],
      calendarSearchFilters: [],
      calendarSearchType: CALENDAR_QUERY_TYPE.CLASS.value
    }
  },
  computed: {
    ...mapState({
      userMode: state => state.app.userMode
    })
  },
  created() {
    console.info(`ScheduleSession created with id: ${this.id} type ${this.type}`)
    this.scheduleReq.planId = this.$route.query.planId
    if (!this.scheduleReq.planId) {
      this.handleAssociate()
    }
    this.loading = false
    this.checkZoomAuth()

    this.$EventBus.$on('ZoomMeetingUpdatePassword', this.handleSelectPassword)
    this.$EventBus.$on('ZoomMeetingUpdateWaitingRoom', this.handleSelectWaitingRoom)
  },
  beforeDestroy() {
    this.$EventBus.$off('ZoomMeetingUpdatePassword', this.handleSelectPassword)
    this.$EventBus.$off('ZoomMeetingUpdateWaitingRoom', this.handleSelectWaitingRoom)
  },
  methods: {

    async handleAssociate() {
      console.info('ScheduleSession associateUnitList start', this.associateUnitList)
      const associateData = await this.getAssociate(this.id, this.type)
      associateData.ownerLinkList.forEach(groupItem => {
        groupItem.contents.forEach(item => {
          if (item.type === this.$classcipe.typeMap['unit-plan']) {
            this.associateUnitList.push(item)
          }
        })
      })
      console.info('ScheduleSession associateUnitList', this.associateUnitList)
      if (this.associateUnitList.length === 1) {
        this.scheduleReq.planId = this.associateUnitList[0].id
      } else if (this.associateUnitList.length > 1) {
        this.selectSessionUnitVisible = true
      }

      this.getClassList()
    },

    getClassList() {
      SchoolClassGetMyClasses().then(res => {
        console.info('ScheduleSession getClassList ', res)
        if (res.result) {
          this.classList = res.result
        }
      }).finally(() => {
        this.loading = false
      })
    },

    handleBack () {
      if (window.history.length <= 1) {
        this.$router.push({ path: '/teacher/main/live-workshops' })
        return false
      } else {
        this.$router.go(-1)
      }
    },

    handleSelectUnit(data) {
      console.info('ScheduleSession handleSelectUnit ', data)
      this.scheduleReq.planId = data.id
      this.selectSessionUnitVisible = false
    },

    handleGoBack () {
      this.handleBack()
    },
    handleGoNext () {
      const isNotShowSecurity = getCookie(TEACHER_SECURITY_NOT_SHOW)
      if (!isNotShowSecurity) {
        // TODO 查询是否已经进行老师认证
        const isExists = false
        if (!isExists) {
          this.$refs.verificationTip.doCreate()
          return
        }
      }
      this.createSession()
    },

    handleCloseAssign () {
      this.teacherSessionNowLoading = false
      this.zoomSettingVisible = false
    },

    handleSelectClassStudent (cls) {
      console.info('handleSelectClassStudent cls', cls)
      this.scheduleReq.openSession = false
      this.scheduleReq.workshopType = 0
      console.info('handleSelectClassStudent scheduleReq', this.scheduleReq)
    },

    handleSelectWorkshopType (data) {
      this.scheduleReq.workshopType = data.workshopType
      this.scheduleReq.openSession = true
      this.scheduleReq.classIds = []
      this.scheduleReq.selectStudents = []
      this.scheduleReq.zoom = 1
      // workshop4种类型
      this.calendarSearchFilters = [1, 2, 3, 4]
      this.calendarSearchType = CALENDAR_QUERY_TYPE.WORKSHOP.value
      this.$refs['steps-nav'].nextStep()
      console.info('handleSelectWorkshopType', this.scheduleReq)
    },

    handleSelectDate (data) {
      if (!data) {
        this.scheduleReq.startDate = null
        this.scheduleReq.endDate = null
        return
      }
      console.info('ScheduleSession handleSelectDate ', data)
      this.scheduleReq.startDate = data.startDate
      this.scheduleReq.endDate = data.endDate
      console.info('ScheduleSession handleSelectDate ', this.scheduleReq)
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
      console.log(zoom)
      if (zoom) {
        const status = await this.checkZoomAuth()
        if (!status) {
          zoom = false
          console.info('reset item enableZoom', this.enableZoom)
        } else {
          console.info('zoom auth success')
        }
      }
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
          this.scheduleReq.password = openSessionData.password
          this.scheduleReq.waitingRoom = openSessionData.waitingRoom
        } else if (this.userMode === USER_MODE.SCHOOL) {
          this.scheduleReq.selectTeachers = openSessionData.selectTeachers
          this.scheduleReq.yearList = openSessionData.yearList
          this.scheduleReq.subjectList = openSessionData.subjectList
          this.scheduleReq.languageList = openSessionData.languageList
          this.scheduleReq.register.paidType = openSessionData.paidType
          this.scheduleReq.register.notifyType = openSessionData.notifyType
          this.scheduleReq.register.notifyStudents = openSessionData.notifyStudents
          this.scheduleReq.password = openSessionData.password
          this.scheduleReq.waitingRoom = openSessionData.waitingRoom
        }
      }

      if (!this.scheduleReq.startDate || !this.scheduleReq.endDate) {
        this.$message.warn('Please select Schedule time!')
        return
      }
      console.info('try createSession scheduleReq', this.scheduleReq)
      this.creating = true
      try {
        const res = await AddSessionV2(this.scheduleReq)
        console.info('save scheduleReq', res, 'retValue', retValue)
        if (res.result && res.success && res.code === 0) {
          this.$message.success('Schedule session successfully')
          if (retValue) {
            return res.result
          } else {
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

.title {
  font-weight: 500;
  color: #333;
  line-height: 30px;
  padding-left: 5px;
  font-size: 16px;
}

.type-list {
  padding: 10px 10px 10px 0;
  .zoom-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 5px;
    img {
      height: 30px;
    }
  }
}
</style>
