<template>
  <div>
    <a-modal
      v-model="visible"
      :closable='false'
      destroyOnClose
      title=''
      width="1200px"
      ok-text='Confirm'
      :confirm-loading='creating'
      :okButtonProps="{ props: {disabled: !$store.getters.zoomChecked} }"
      @ok="confirmSchedule"
      @cancel="closeSchedule">
      <modal-header title='Schedule' @close='closeSchedule'/>
      <schedule-pay-info
        :type="9"
        ref='personal-schedule'
        v-show='userMode === USER_MODE.SELF'
        :must-zoom='true'
        @select-date='handleSelectDate'
        @select-zoom-status='handleSelectZoom' />
      <school-schedule
        :type="9"
        ref='school-schedule'
        :must-zoom='true'
        v-show='userMode === USER_MODE.SCHOOL'
        @select-date='handleSelectDate'
        @select-zoom-status='handleSelectZoom' />
    </a-modal>

    <!-- <zoom-meeting-setting
      :password='scheduleReq.password'
      :waiting-room='scheduleReq.waitingRoom'
      :zoom-setting-visible.sync='zoomSettingVisible'
      v-if='zoomSettingVisible'
      @confirm='handleConfirmAssign'
      @handleClose='handleCloseAssign'
    /> -->

    <verification-tip ref="verificationTip" @continue="createSession"/>

  </div>
</template>

<script>
import SchedulePayInfo from '@/components/Schedule/SchedulePayInfo'
import ModalHeader from '@/components/Common/ModalHeader'
import SchoolSchedule from '@/components/Schedule/SchoolSchedule'
import { mapState } from 'vuex'
import { USER_MODE } from '@/const/common'
import { AddSessionV2 } from '@/api/v2/classes'
import ZoomMeetingSetting from '@/components/Schedule/ZoomMeetingSetting'
import VerificationTip from '@/components/MyContentV2/VerificationTip.vue'
import { TEACHER_SECURITY_NOT_SHOW } from '@/store/mutation-types'
import { getCookie } from '@/utils/util'
import { ZoomAuthMixin } from '@/mixins/ZoomAuthMixin'
// 已废弃
export default {
  name: 'PdSchedule',
  components: { ZoomMeetingSetting, SchoolSchedule, ModalHeader, SchedulePayInfo, VerificationTip },
  mixins: [ ZoomAuthMixin ],
  props: {
    contentId: {
      type: String,
      required: true
    }
  },
  created() {
    this.$EventBus.$on('ZoomMeetingUpdatePassword', this.handleSelectPassword)
    this.$EventBus.$on('ZoomMeetingUpdateWaitingRoom', this.handleSelectWaitingRoom)
  },
  beforeDestroy() {
    this.$EventBus.$off('ZoomMeetingUpdatePassword', this.handleSelectPassword)
    this.$EventBus.$off('ZoomMeetingUpdateWaitingRoom', this.handleSelectWaitingRoom)
  },
  watch: {
    visible(val) {
      if (val) {
        this.checkZoomAuth()
      }
    }
  },
  data() {
    return {
      visible: false,
      creating: false,
      USER_MODE: USER_MODE,

      scheduleReq: {
        classIds: [],
        contentId: this.contentId,
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
        selectTeachers: [],
        sessionType: 0,
        startDate: null,
        password: true,
        waitingRoom: true,
        subjectList: [],
        yearList: [],
        languageList: [],
        teachSessionNow: 0,
        workshopType: 1,
        zoom: 1
      },
      zoomSettingVisible: false,
      enableZoom: true
    }
  },
  computed: {
    ...mapState({
      userMode: state => state.app.userMode
    })
  },
  methods: {
    async handleSelectZoom (zoom) {
      if (zoom) {
        const status = await this.checkZoomAuth()
        if (!status) {
          this.enableZoom = zoom
          console.info('reset item enableZoom', this.enableZoom)
        } else {
          console.info('zoom auth success')
        }
      }
      this.scheduleReq.zoom = zoom ? 1 : 0
    },
    handleSelectPassword (val) {
      this.scheduleReq.password = val
    },
    handleSelectWaitingRoom (val) {
      this.scheduleReq.waitingRoom = val
    },
    async confirmSchedule() {
      let scheduleConfig = null

      if (this.userMode === USER_MODE.SELF) {
        scheduleConfig = this.$refs['personal-schedule'].getPaidInfo()
        this.scheduleReq.register.discountInfo = scheduleConfig.discountInfo
        this.scheduleReq.register.maxParticipants = scheduleConfig.maxParticipants
        this.scheduleReq.register.price = scheduleConfig.price
        this.scheduleReq.register.registerBefore = scheduleConfig.registerBefore
        this.scheduleReq.password = scheduleConfig.password
        this.scheduleReq.waitingRoom = scheduleConfig.waitingRoom
        console.info('confirmSchedule', scheduleConfig)
      } else if (this.userMode === USER_MODE.SCHOOL) {
        scheduleConfig = this.$refs['school-schedule'].getPaidInfo()
        this.scheduleReq.selectTeachers = scheduleConfig.selectTeachers
        this.scheduleReq.yearList = scheduleConfig.yearList
        this.scheduleReq.subjectList = scheduleConfig.subjectList
        this.scheduleReq.languageList = scheduleConfig.languageList
        this.scheduleReq.register.paidType = scheduleConfig.paidType
        this.scheduleReq.register.notifyType = scheduleConfig.notifyType
        this.scheduleReq.register.notifyStudents = scheduleConfig.notifyStudents
        this.scheduleReq.password = scheduleConfig.password
        this.scheduleReq.waitingRoom = scheduleConfig.waitingRoom
        console.info('schoolScheduleInfo', scheduleConfig)
      }
      if (!this.scheduleReq.startDate || !this.scheduleReq.endDate) {
        this.$message.warn('Please select Schedule time!')
        return
      }
      // this.zoomSettingVisible = true
      console.info('scheduleReq', this.scheduleReq)
      const isNotShowSecurity = getCookie(TEACHER_SECURITY_NOT_SHOW)
      if (!isNotShowSecurity) {
        // TODO 查询是否已经进行老师认证
        const isExists = false
        if (!isExists) {
          this.$refs.verificationTip.doCreate()
          return
        }
      }
      await this.createSession(this.scheduleReq)
    },

    async handleConfirmAssign (data) {
      console.info('ScheduleSession handleConfirmAssign ', data)
      this.zoomSettingVisible = false
      this.scheduleReq.password = data.password
      this.scheduleReq.waitingRoom = data.waitingRoom

      await this.createSession(this.scheduleReq)
      console.info('zoom auth success')
    },

    handleCloseAssign () {
      this.zoomSettingVisible = false
    },

    async createSession() {
      const scheduleReq = this.scheduleReq
      console.info('try createSession scheduleReq', scheduleReq)
      this.creating = true
      try {
        const res = await AddSessionV2(scheduleReq)
        console.info('save scheduleReq', res)
        if (res.result && res.success && res.code === 0) {
          this.$message.success('Schedule session successfully')
          if (res.result.length && res.result[0].taskClassId) {
            this.finishAndGoBack(res.result[0].taskClassId)
          } else {
            location.href = '/v2/my/workshop'
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
        this.closeSchedule()
        this.creating = false
      }
      return null
    },
    finishAndGoBack(taskClassId) {
      if (this.scheduleReq.workshopType) {
        location.href = '/v2/my/workshop'
      } else {
        this.$router.replace({
          path: `/teacher/class-session/${taskClassId}`
        })
      }
    },

    closeSchedule () {
      this.visible = false
      this.$emit('close')
    },
    handleSelectDate (data) {
      if (!data) {
        this.scheduleReq.startDate = null
        this.scheduleReq.endDate = null
      }
      this.scheduleReq.startDate = data.startDate
      this.scheduleReq.endDate = data.endDate
      if (this.enableZoom && !this.$store.getters.zoomChecked) {
        this.checkZoomAuth()
      }
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

</style>
