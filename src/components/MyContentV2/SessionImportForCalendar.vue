<template>
  <div style="position:relative;">
    <div class='nav-back'>
      <custom-link-text @click='handleBack' text='Back'>
        <template v-slot:prefix>
          <a-icon type='left' />
        </template>
      </custom-link-text>
    </div>
    <my-vertical-steps
      ref='steps-nav'
      :allow-switch='false'
      :steps='ScheduleStepsFilter'
      :step-index='currentActiveStepIndex'
      @step-change='handleStepChange'
    />
    <div class="close" v-if="needClose">
      <a-icon type="close" @click="handleBack"/>
    </div>
    <div class="import-content">
      <!-- unit为第一步的时候，task为选中unit中的task -->
      <content-select
        v-show="'unit' === ScheduleStepsFilter[currentActiveStepIndex].type"
        :type="typeMap['unit-plan']"
        @choose="(item) => handleChoose(item, 'unit')"
        @cancel="handleBack"

      />
      <!-- 直接选task的时候，即task为第一步，则需要从全部课件里面过滤 -->
      <content-select
        v-show="'task' === ScheduleStepsFilter[currentActiveStepIndex].type"
        :type="typeMap.task"
        :datas="importDatas"
        :need-filter="importType === typeMap['task'] "
        :back-txt="currentActiveStepIndex === 0 ? 'Discard': 'Discard'"
        @choose="item => handleChoose(item ,'task')"
        @cancel="handleCloseImport"
      />
      <!-- 直接选pd的时候，即pd为第一步，则需要从全部课件里面过滤 -->
      <content-select
        v-show="'pd' === ScheduleStepsFilter[currentActiveStepIndex].type"
        :type="typeMap.pd"
        :datas="importDatas"
        :need-filter="importType === typeMap['pd'] "
        :back-txt="currentActiveStepIndex === 0 ? 'Discard': 'Discard'"
        @choose="item => handleChoose(item ,'pd')"
        @cancel="handleCloseImport"
      />
      <!-- 直接页面跳转 -->
      <!-- <div class="content-select" v-show="['participants', 'schedule'].includes(ScheduleStepsFilter[currentActiveStepIndex].type)">
        <div class="content-select-wrap">
          <select-participant
            ref='participant'
            :class-list='classList'
            :classId="currentClass"
            v-show="'participants' === ScheduleStepsFilter[currentActiveStepIndex].type"
            @update-class-list='getClassList'
            @select-class-student='handleSelectClassStudent'
            @select-workshop-type='handleSelectWorkshopType'/>
          <schedule-date
            v-show='!scheduleReq.openSession && "schedule" === ScheduleStepsFilter[currentActiveStepIndex].type'
            :showCalendarLink="true"
            :calendarSearchFilters="calendarSearchFilters"
            :calendarSearchType="calendarSearchType"
            :default-date="defaultDate"
            :must-zoom="true"
            @select-date='handleSelectDate'
            @update-zoom='handleUpdateZoom'
            @select-session-type='handleSelectSessionType'
            @select-zoom-status='handleSelectZoom'
          />
          <schedule-pay-info
            ref='pay'
            :type="type"
            :showCalendar="true"
            :must-zoom="true"
            v-if="userMode === USER_MODE.SELF"
            v-show='scheduleReq.openSession && "schedule" === ScheduleStepsFilter[currentActiveStepIndex].type'
            @select-date='handleSelectDate'
          />
          <school-schedule
            ref='pay'
            :type="type"
            :showCalendar="true"
            :must-zoom="true"
            v-if="userMode === USER_MODE.SCHOOL"
            v-show='scheduleReq.openSession && "schedule" === ScheduleStepsFilter[currentActiveStepIndex].type'
            @select-date='handleSelectDate'
          />
        </div>
        <div class="content-select-action">
          <a-button type="" @click="handleBack">Back</a-button>
          <a-button :loading="importLoading" type="primary" @click="handleChoose()">
            {{ currentActiveStepIndex === ScheduleStepsFilter.length - 1 ? 'Save' : 'Next' }}
          </a-button>
        </div>
      </div> -->
    </div>
    <select-session-unit
      v-if='selectSessionUnitVisible'
      :list='associateUnitList'
      @back='handleCancelUnit'
      @select='handleSelectUnit' />
  </div>
</template>

<script>
import ContentSelect from '@/components/MyContentV2/ContentSelect'
import MyVerticalSteps from '@/components/Steps/MyVerticalSteps'
import SelectParticipant from '@/components/Schedule/SelectParticipant'
import ScheduleDate from '@/components/Schedule/ScheduleDate'
import SchedulePayInfo from '@/components/Schedule/SchedulePayInfo'
import SchoolSchedule from '@/components/Schedule/SchoolSchedule'
import SelectSessionUnit from '@/components/Schedule/SelectSessionUnit'
import CustomLinkText from '@/components/Common/CustomLinkText'

import { GetAssociate } from '@/api/teacher'
// 直接页面跳转
import { AddSessionV2 } from '@/api/v2/classes'
// import { SchoolClassGetMyClasses } from '@/api/schoolClass'

import { ZoomAuthMixin } from '@/mixins/ZoomAuthMixin'

import { typeMap } from '@/const/teacher'
import { USER_MODE, CALENDAR_QUERY_TYPE } from '@/const/common'
import { lessonHost } from '@/const/googleSlide'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { mapState } from 'vuex'

import moment from 'moment'
export default {
  name: 'SessionImportForCalendar',
  mixins: [ ZoomAuthMixin ],
  components: {
    ContentSelect,
    MyVerticalSteps,
    SelectParticipant,
    ScheduleDate,
    SchedulePayInfo,
    SelectSessionUnit,
    SchoolSchedule,
    CustomLinkText
  },
  props: {
    type: {
      type: Number,
      default: typeMap.task
    },
    startDate: {
      type: String,
      default: null
    },
    endDate: {
      type: String,
      default: null
    },
    needClose: {
      type: Boolean,
      default: false
    },
    classId: {
      type: String,
      default: ''
    },
    source: {
      type: String,
      default: ''
    },
    searchType: {
      type: [Number, String],
      default: CALENDAR_QUERY_TYPE.MY.value
    }
  },
  watch: {
    type(val) {
      this.importType = val
    },
    classId(val) {
      console.log(val)
      this.currentClass = val
    },
    startDate: {
      handler(val) {
        this.importModel.startDate = val
      },
      immediate: true
    },
    endDate: {
      handler(val) {
        this.importModel.endDate = val
      },
      immediate: true
    },
    searchType: {
      handler(val) {
        this.typeMode = val
      },
      immediate: true
    }
  },
  data() {
    return {
      typeMap: typeMap,
      USER_MODE: USER_MODE,
      CALENDAR_QUERY_TYPE: CALENDAR_QUERY_TYPE,
      currentClass: this.classId,
      typeMode: this.searchType,
      ScheduleSteps: [
        {
          id: '1',
          name: 'Select Unit',
          description: null,
          filter: typeMap['unit-plan'],
          type: 'unit'
        },
        {
          id: '2',
          name: 'Select Task',
          description: null,
          type: 'task'
        }
        // 直接页面跳转
        // {
        //   id: '3',
        //   name: 'Choose Participants',
        //   description: null,
        //   type: 'participants'
        // },
        // {
        //   id: '4',
        //   name: 'Schedule Session',
        //   description: null,
        //   type: 'schedule'
        // }
      ],
      currentActiveStepIndex: 0,
      selectSessionUnitVisible: false,
      importLoading: false,
      importType: this.type,
      importDatas: [],
      associateUnitList: [],
      // 直接页面跳转
      classList: [],
      scheduleReq: {
        classIds: [],
        contentId: null,
        endDate: null,
        openSession: false,
        planId: null,
        register: {
          discountInfo: [],
          maxParticipants: 0,
          price: 0,
          registerBefore: null,
          title: ''
        },
        selectStudents: [],
        sessionType: 0,
        startDate: null,
        teachSessionNow: 0,
        password: true,
        waitingRoom: true,
        workshopType: 0, // 1-private workshop 2-public workshop
        zoom: 0
      },
      importModel: {
        startDate: null,
        endDate: null,
        task: null,
        unit: null,
        pd: null
      },
      calendarSearchFilters: [],
      calendarSearchType: CALENDAR_QUERY_TYPE.CLASS.value
    }
  },
  computed: {
    ...mapState({
      userMode: state => state.app.userMode,
      currentSchool: state => state.user.currentSchool
    }),
    ScheduleStepsFilter() {
      if (this.importType === typeMap.pd) {
        return [
          {
            id: '3',
            name: 'Select PD',
            description: null,
            filter: typeMap['pd'],
            type: 'pd'
          }
        ]
      }
      return this.ScheduleSteps.filter(item => !item.filter || item.filter === this.importType)
    },
    defaultDate() {
      if (this.importModel.startDate && this.importModel.endDate) {
        return [moment(this.importModel.startDate), moment(this.importModel.endDate)]
      } else {
        return null
      }
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      // 直接页面跳转
      // this.getClassList()
    },
    async getAssociate (id, type) {
      this.importLoading = true
      const response = await GetAssociate({
        id: id,
        type: type,
        published: 0
      })
      response.result.owner.forEach(ownerItem => {
        const groupItem = response.result.groups.find(group => group.groupName === ownerItem.group)
        if (groupItem) {
          ownerItem.groupId = groupItem.id
          groupItem.contents = JSON.parse(JSON.stringify(ownerItem.contents))
        }
      })
      const ownerLinkGroupList = response.result.owner
      const taskList = []
      // task 找 unit， unit 找task
      const findType = type === typeMap.task ? typeMap['unit-plan'] : typeMap.task
      console.log(findType)

      ownerLinkGroupList.forEach(group => {
        group.contents.forEach(content => {
          if (content.type === findType) {
            taskList.push(content)
          }
        })
      })
      this.importLoading = false
      return taskList
    },
    handleStepChange(data) {
      this.currentActiveStepIndex = data.index
    },
    handleCloseImport() {
      this.$emit('cancel')
    },
    handleBack(item) {
      if (this.currentActiveStepIndex === 0) {
        this.handleCloseImport()
      } else {
        this.$refs['steps-nav'].prevStep()
      }
    },
    handleChoose(item, type) {
      console.log(item)
      // this.importVisible = false
      // this.$router.push({
      //   path: '/teacher/schedule-session/' + item.id + '/' + item.type,
      //   query: {
      //     startDate: moment(this.event.start).format('YYYY-MM-DD HH:mm:ss'),
      //     endDate: moment(this.event.end).format('YYYY-MM-DD HH:mm:ss')
      //   }
      // })
      let associates = []
      // 直接页面跳转
      // if (this.scheduleReq.openSession) {
      //   this.scheduleReq.selectStudents = []
      //   this.scheduleReq.classIds = []
      //   this.calendarSearchFilters = [1, 2, 3, 4]
      //   this.calendarSearchType = CALENDAR_QUERY_TYPE.WORKSHOP.value
      // } else {
      //   const participantData = this.$refs.participant.getSelectedData()
      //   this.scheduleReq.selectStudents = participantData.selectStudents
      //   this.scheduleReq.classIds = participantData.classIds
      //   this.calendarSearchFilters = this.scheduleReq.classIds
      //   this.calendarSearchType = CALENDAR_QUERY_TYPE.CLASS.value
      // }
      if (item && type) {
        if (item.type === typeMap.task || item.type === typeMap.pd) {
          this.scheduleReq.contentId = item.id
          this.scheduleReq.register.title = item.name
        }
        this.importModel[type] = { ...item }
        if (type === 'pd') {
          if (this.currentActiveStepIndex === this.ScheduleStepsFilter.length - 1) {
            this.goCreateSession()
          } else {
            this.$refs['steps-nav'].nextStep()
          }
        }
        // 如果是从unit导入，则先选中unit，获取unit下的所有task供其选择
        // 如果从task导入，则获取task关联的所有unit，如果大于1则显示unit列表供其选择
        this.getAssociate(item.id, item.type).then(res => {
          if (this.importType === item.type) {
            associates = res.filter(item => item.owner.email === this.$store.getters.email)
          }
          if (this.importType === typeMap['unit-plan'] && typeMap['unit-plan'] === item.type) {
            this.importDatas = res.filter(item => item.owner.email === this.$store.getters.email)
            this.scheduleReq.planId = item.id
          }
          console.log(associates)
          if (this.importType === typeMap.task) {
            // 只要有一个就显示，不自动选中
            if (associates.length > 0) {
              this.associateUnitList = associates
              this.selectSessionUnitVisible = true
            // 如果为0，则从所有unit选择
            } else if (associates.length === 0) {
              // this.importLoading = true
              // FindMyContent({
              //   type: [typeMap['unit-plan']],
              //   searchKey: '',
              //   delFlag: 0,
              //   pageNo: 1,
              //   pageSize: 1000,
              //   types: [typeMap['unit-plan']],
              //   schoolId: this.currentSchool.id, // this.userMode === USER_MODE.SELF ? null : this.currentSchool.id,
              //   linkedTask: true // 过滤关联task的unit
              // }).then(res => {
              //   if (res.success) {
              //     this.associateUnitList = (res.result.records || res.result).filter(item => item.owner.email === this.$store.getters.email)
              //     if (this.associateUnitList.length > 1) {
              //       this.selectSessionUnitVisible = true
              //     } else {
              //       if (this.associateUnitList.length === 1) {
              //         this.scheduleReq.planId = this.associateUnitList[0].id
              //       }
              //       if (this.currentActiveStepIndex === this.ScheduleStepsFilter.length - 1) {
              //           this.goCreateSession()
              //       } else {
              //         this.$refs['steps-nav'].nextStep()
              //       }
              //     }
              //   }
              // }).finally(res => {
              //   this.importLoading = false
              // })
              if (this.currentActiveStepIndex === this.ScheduleStepsFilter.length - 1) {
                this.goCreateSession()
              } else {
                this.$refs['steps-nav'].nextStep()
              }
            } else {
              this.scheduleReq.planId = associates[0].id
              if (this.currentActiveStepIndex === this.ScheduleStepsFilter.length - 1) {
                  this.goCreateSession()
              } else {
                this.$refs['steps-nav'].nextStep()
              }
            }
          } else {
            if (this.currentActiveStepIndex === this.ScheduleStepsFilter.length - 1) {
                this.goCreateSession()
            } else {
              this.$refs['steps-nav'].nextStep()
            }
          }
        })
      } else {
        if (this.currentActiveStepIndex === this.ScheduleStepsFilter.length - 1) {
            // this.createSession()
            this.goCreateSession()
        } else {
          this.$refs['steps-nav'].nextStep()
        }
      }
    },

    async goCreateSession() {
      if (this.source === 'quick') {
        this.scheduleReq.classIds = [this.currentClass]
        this.scheduleReq.startDate = moment().utc().format('YYYY-MM-DD HH:mm:ss')
        this.scheduleReq.endDate = moment().add(40, 'm').utc().format('YYYY-MM-DD HH:mm:ss')
        const res = await this.createSession(true)
        this.$message.success('The scheduled tiem above will be cleard by starting the session now.')
        const url = lessonHost + 't/' + res[0].classId + '?token=' + storage.get(ACCESS_TOKEN)
        window.location.href = url
        return
      }
      let path = '/teacher/schedule-session/' + this.scheduleReq.contentId + '/' + typeMap.task
      console.log(this.typeMode)
      if (this.importType === typeMap.pd) {
        path = '/teacher/schedule-workshop/' + this.scheduleReq.contentId + '/' + this.importType
      }
      this.$router.push({
        path: path,
        query: {
          startDate: this.importModel.startDate,
          endDate: this.importModel.endDate,
          planId: this.scheduleReq.planId,
          classId: this.currentClass || '',
          source: this.source
        }
      })
    },

// 直接页面跳转
    // getClassList() {
    //   SchoolClassGetMyClasses().then(res => {
    //     if (res.result) {
    //       this.classList = res.result
    //     }
    //   }).finally(() => {
    //     this.loading = false
    //   })
    // },
    // handleSelectClassStudent (cls) {
    //   this.scheduleReq.openSession = false
    // },
    // handleSelectOpenSession (data) {
    //   this.scheduleReq.openSession = true
    //   this.scheduleReq.zoom = 1
    //   this.scheduleReq.openSession = data.openSession
    //   this.$refs['steps-nav'].nextStep()
    //   this.checkZoomAuth()
    // },
    // handleSelectWorkshopType (data) {
    //   this.scheduleReq.workshopType = data.workshopType
    //   this.scheduleReq.openSession = data.workshopType === 2
    //   this.scheduleReq.classIds = []
    //   this.scheduleReq.selectStudents = []
    //   this.scheduleReq.zoom = 1
    //    // workshop4种类型
    //   this.calendarSearchFilters = [1, 2, 3, 4]
    //   this.calendarSearchType = CALENDAR_QUERY_TYPE.WORKSHOP.value
    //   this.$refs['steps-nav'].nextStep()
    // },
    // handleSelectDate (data) {
    //   this.scheduleReq.startDate = data.startDate
    //   this.scheduleReq.endDate = data.endDate
    // },
    // handleUpdateZoom (data) {
    //   this.scheduleReq.password = data.password
    //   this.scheduleReq.waitingRoom = data.waitingRoom
    // },
    // handleSelectSessionType (type) {
    //   this.scheduleReq.sessionType = type
    // },
    // async handleSelectZoom (zoom) {
    //   if (zoom) {
    //     const status = await this.checkZoomAuth()
    //     if (!status) {
    //       this.$logger.info('reset item enableZoom', this.enableZoom)
    //     } else {
    //       this.$logger.info('zoom auth success')
    //     }
    //   }
    //   this.scheduleReq.zoom = zoom ? 1 : 0
    // },
    handleCancelUnit() {
      this.selectSessionUnitVisible = false
    },
    handleSelectUnit(data) {
      this.scheduleReq.planId = data.id
      this.selectSessionUnitVisible = false
      if (this.currentActiveStepIndex === this.ScheduleStepsFilter.length - 1) {
        this.goCreateSession()
      } else {
        this.$refs['steps-nav'].nextStep()
      }
    },
    async createSession(retValue) {
      if (!this.scheduleReq.startDate || !this.scheduleReq.endDate) {
        this.$message.warn('Please select Schedule time!')
        return
      }
      this.$logger.info('try createSession scheduleReq', this.scheduleReq)
      this.importLoading = true
      try {
        const res = await AddSessionV2(this.scheduleReq)
        this.$logger.info('save scheduleReq', res)
        if (res.result && res.success && res.code === 0) {
          this.$message.success('Schedule session successfully')
          if (!retValue) {
            this.$emit('ok')
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
        this.importLoading = false
      }
      return null
    }
  }
}
</script>

<style scoped lang="less">
.content-select {
  .content-select-action {
    display: flex;
    justify-content: space-between;
  }
  /deep/ .class-list {
    height: 300px;
  }
}
.close {
  position: absolute;
  right: 20px;
  top: 10px;
  font-size: 20px;
  color: #999;
}
.nav-back {
  z-index: 1000;
  position: absolute;
  left: 10px;
  top: 15px;
}
</style>
