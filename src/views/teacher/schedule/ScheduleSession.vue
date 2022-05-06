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
          @select-open-session='handleSelectOpenSession'/>
        <schedule-date
          v-show='!scheduleReq.openSession && currentActiveStepIndex === 1'
          @select-date='handleSelectDate'
          @select-session-type='handleSelectSessionType'
          @select-zoom-status='handleSelectZoom'
        />
        <schedule-pay-info
          ref='pay'
          v-show='scheduleReq.openSession && currentActiveStepIndex === 1'
          @select-date='handleSelectDate'
        />
      </div>
    </div>
    <div class='bottom-action'>
      <a-button @click='handleGoBack'><a-icon type='left' /> Back</a-button>
      <div class='right-button'>
        <a-space>
          <a-button type='primary' :loading='teacherSessionNowLoading' v-if='currentActiveStepIndex === $classcipe.ScheduleSteps.length - 1' @click='handleTeacherSessionNow'>Teach the session now</a-button>
          <a-button type='primary' @click='handleGoNext' :loading='creating'>
            <template v-if='currentActiveStepIndex !== $classcipe.ScheduleSteps.length - 1'>
              Next <a-icon type='right' />
            </template>
            <template v-else>Assign</template>
          </a-button>
        </a-space>
      </div>
    </div>

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
import { AddSessionV2 } from '@/api/v2/classes'
import { ZoomAuthMixin } from '@/mixins/ZoomAuthMixin'

export default {
  name: 'ScheduleSession',
  components: { SchedulePayInfo, ScheduleDate, SelectParticipant, SelectSessionUnit, MyVerticalSteps },
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
        teachSessionNow: 0,
        zoom: 0
      },
      creating: false
    }
  },
  created() {
    this.$logger.info(`ScheduleSession created with id: ${this.id} type ${this.type}`)
    this.handleAssociate()
    this.loading = false
  },
  methods: {
    handleStepChange(data) {
      this.$logger.info('ScheduleSession handleStepChange ', data)
      this.currentActiveStepIndex = data.index
    },

    async handleAssociate() {
      this.$logger.info('ScheduleSession associateUnitList start', this.associateUnitList)
      const associateData = await this.getAssociate(this.id, this.type, 1)
      associateData.ownerLinkList.forEach(groupItem => {
        groupItem.contents.forEach(item => {
          if (item.type === this.$classcipe.typeMap['unit-plan']) {
            this.associateUnitList.push(item)
          }
        })
      })
      this.$logger.info('ScheduleSession associateUnitList', this.associateUnitList)
      if (this.associateUnitList.length === 0) {
        this.$confirm({
          title: 'Warn',
          content: 'The current task is not yet associated with any unit plan. Please associate the task with a unit plan first.',
          centered: true,
          onOk: () => {
            this.$router.go(-1)
          },
          onCancel: () => {
            this.$router.go(-1)
          }
        })
      } else if (this.associateUnitList.length === 1) {
        this.scheduleReq.planId = this.associateUnitList[0].id
      } else {
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
      this.getClassList()
    },

    handleGoBack () {
      if (this.currentActiveStepIndex === 0) {
        this.handleBack()
      } else {
        this.$refs['steps-nav'].prevStep()
      }
    },
    handleGoNext () {
      if (this.currentActiveStepIndex === 0) {
        this.$refs['steps-nav'].nextStep()
        if (this.scheduleReq.openSession) {
          this.scheduleReq.selectStudents = []
          this.scheduleReq.classIds = []
        } else {
          const participantData = this.$refs.participant.getSelectedData()
          this.scheduleReq.selectStudents = participantData.selectStudents
          this.scheduleReq.classIds = participantData.classIds
        }
      } else if (this.currentActiveStepIndex === 1) {
        this.createSession()
      }
    },

    handleSelectClassStudent () {
      this.scheduleReq.openSession = false
    },

    handleSelectOpenSession (data) {
      this.$logger.info('ScheduleSession handleSelectOpenSession ', data)
      this.scheduleReq.openSession = true
      this.scheduleReq.zoom = 1
      this.$refs['steps-nav'].nextStep()
      if (!this.zoomAccessToken) {
        this.goToZoomAuth()
      }
    },

    handleSelectDate (data) {
      this.$logger.info('ScheduleSession handleSelectDate ', data)
      this.scheduleReq.startDate = data.startDate
      this.scheduleReq.endDate = data.endDate
      this.$logger.info('ScheduleSession handleSelectDate ', this.scheduleReq)
    },

    handleSelectSessionType (type) {
      this.scheduleReq.sessionType = type
    },

    handleSelectZoom (zoom) {
      this.scheduleReq.zoom = zoom ? 1 : 0
    },

    async handleTeacherSessionNow () {
      this.scheduleReq.teachSessionNow = this.scheduleReq.teachSessionNow ? 0 : 1
      this.teacherSessionNowLoading = true
      try {
        const zoomRes = await this.createSession(true)
        this.$logger.info('zoom res ', zoomRes)
        if (zoomRes && zoomRes.length > 0) {
          const zoomMeetingItem = zoomRes[0]
          if (zoomMeetingItem.zoomMeeting) {
            const zoomMeetingConfig = JSON.parse(zoomMeetingItem.zoomMeeting)
            window.open(zoomMeetingConfig.start_url, '_blank')
          }
        } else {
          this.$message.error('create zoom meeting failed')
        }
      } catch (e) {
        this.$logger.error('handleTeacherSessionNow ', e)
        console.log(e)
      } finally {
        this.teacherSessionNowLoading = false
      }
    },

    /**
     * 如果retValue为false，则表示需要跳转返回。
     * @param retValue
     * @returns {Promise<*>}
     */
    async createSession(retValue) {
      if (this.scheduleReq.openSession) {
        const openSessionData = this.$refs.pay.getPaidInfo()
        this.scheduleReq.register.discountInfo = openSessionData.discountInfo
        this.scheduleReq.register.maxParticipants = openSessionData.maxParticipants
        this.scheduleReq.register.price = openSessionData.price
        this.scheduleReq.register.registerBefore = openSessionData.registerBefore
      }
      this.$logger.info('try createSession scheduleReq', this.scheduleReq)
      this.creating = true
      try {
        const res = await AddSessionV2(this.scheduleReq)
        this.$logger.info('save scheduleReq', res)
        if (res.result && res.success && res.code === 0) {
          this.$message.success('Schedule session successfully')
          if (!retValue) {
            this.$router.replace('/teacher/main/created-by-me')
          } else {
            return res.result
          }
        } else {
          this.$confirm({
            title: 'Warn',
            content: 'Schedule session failed.' + res.message + '. Please try again.',
            centered: true
          })
        }
      } catch (e) {
        this.$confirm({
          title: 'Error',
          content: 'Schedule session error.' + e.message + '. Please try again.',
          centered: true
        })
      } finally {
        this.creating = false
      }
      return null
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
