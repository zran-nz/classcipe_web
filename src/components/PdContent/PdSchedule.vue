<template>
  <div>
    <a-modal
      v-model="visible"
      :closable='false'
      destroyOnClose
      title=''
      width="850px"
      ok-text='Confirm'
      :confirm-loading='creating'
      @ok="confirmSchedule"
      @cancel="closeSchedule">
      <modal-header title='Schedule' @close='closeSchedule'/>
      <schedule-pay-info ref='personal-schedule' v-show='userMode === USER_MODE.SELF' />
      <school-schedule ref='school-schedule' v-show='userMode === USER_MODE.SCHOOL' />
    </a-modal>

    <zoom-meeting-setting
      :password='scheduleReq.password'
      :waiting-room='scheduleReq.waitingRoom'
      :zoom-setting-visible.sync='zoomSettingVisible'
      v-if='zoomSettingVisible'
      @confirm='handleConfirmAssign'
      @handleClose='handleCloseAssign'
    />

  </div>
</template>

<script>
import SchedulePayInfo from '@/components/Schedule/SchedulePayInfo'
import ModalHeader from '@/components/Common/ModalHeader'
import SchoolSchedule from '@/components/Schedule/SchoolSchedule'
import { mapState } from 'vuex'
import { USER_MODE } from '@/const/common'
import { ZoomAuthMixin } from '@/mixins/ZoomAuthMixin'
import { AddSessionV2 } from '@/api/v2/classes'
import ZoomMeetingSetting from '@/components/Schedule/ZoomMeetingSetting'

export default {
  name: 'PdSchedule',
  components: { ZoomMeetingSetting, SchoolSchedule, ModalHeader, SchedulePayInfo },
  props: {
    contentId: {
      type: String,
      required: true
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
        zoom: 1
      },
      zoomSettingVisible: false
    }
  },
  computed: {
    ...mapState({
      userMode: state => state.app.userMode
    })
  },
  mixins: [ ZoomAuthMixin ],
  methods: {
    async confirmSchedule() {
      const status = await this.checkZoomAuth()
      if (!status) {
        this.$logger.info('waiting for zoom auth')
      } else {
        let scheduleConfig = null

        if (this.userMode === USER_MODE.SELF) {
          scheduleConfig = this.$refs['personal-schedule'].getPaidInfo()
          this.scheduleReq.register.discountInfo = scheduleConfig.discountInfo
          this.scheduleReq.register.maxParticipants = scheduleConfig.maxParticipants
          this.scheduleReq.register.price = scheduleConfig.price
          this.scheduleReq.register.registerBefore = scheduleConfig.registerBefore
          this.scheduleReq.startDate = scheduleConfig.startDate
          this.scheduleReq.endDate = scheduleConfig.endDate
          this.$logger.info('confirmSchedule', scheduleConfig)
        } else if (this.userMode === USER_MODE.SCHOOL) {
          scheduleConfig = this.$refs['school-schedule'].getScheduleInfo()
          this.scheduleReq.selectTeachers = scheduleConfig.selectTeachers
          this.scheduleReq.yearList = scheduleConfig.yearList
          this.scheduleReq.subjectList = scheduleConfig.subjectList
          this.scheduleReq.languageList = scheduleConfig.languageList
          this.scheduleReq.startDate = scheduleConfig.startDate
          this.scheduleReq.endDate = scheduleConfig.endDate
          this.$logger.info('schoolScheduleInfo', scheduleConfig)
        }
        if (!this.scheduleReq.startDate || !this.scheduleReq.endDate) {
          this.$message.warn('Please select Schedule time!')
          return
        }
        this.zoomSettingVisible = true
        this.$logger.info('scheduleReq', this.scheduleReq)
      }
    },

    async handleConfirmAssign (data) {
      this.$logger.info('ScheduleSession handleConfirmAssign ', data)
      this.zoomSettingVisible = false
      this.scheduleReq.password = data.password
      this.scheduleReq.waitingRoom = data.waitingRoom

      await this.createSession(this.scheduleReq)
      this.closeSchedule()
      this.$logger.info('zoom auth success')
    },

    handleCloseAssign () {
      this.zoomSettingVisible = false
    },

    async createSession(scheduleReq) {
      this.$logger.info('try createSession scheduleReq', scheduleReq)
      this.creating = true
      try {
        const res = await AddSessionV2(scheduleReq)
        this.$logger.info('save scheduleReq', res)
        if (res.result && res.success && res.code === 0) {
          this.$message.success('Schedule session successfully')
          if (res.result.length && res.result[0].taskClassId) {
            this.$router.replace({
              path: `/teacher/class-session/${res.result[0].taskClassId}`
            })
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
    },

    closeSchedule () {
      this.visible = false
      this.$emit('close')
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

</style>
