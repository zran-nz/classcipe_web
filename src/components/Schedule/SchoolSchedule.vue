<template>
  <div class='schedule-pay-info'>
    <slot name="title" />
    <div class='pay-info'>
      <!-- <div v-if="type === typeMap.pd">
        <div class="filter-session" v-show="form.notifyType === NOTIFY_TYPE.FILTER_SUBJECTS.value">
          <a-select
            @change="changeFilter"
            v-model="filter.subjects"
            class="filter-select"
            placeholder="Select Subject"
            :showArrow="true"
            mode="multiple">
            <a-select-option :value="item.value" v-for="(item, index) in filterSubjectOptions" :key="index" >
              {{ item.label }}
            </a-select-option>
          </a-select>
          <a-popover title="Teachers" placement="right" >
            <template slot="content">
              <div class="member-list" v-if="memberList && memberList.length > 0">
                <div class="member-item" v-for="member in memberList" :key="member.id">
                  <a-avatar class="item-avatar" icon="user" v-if="!member.avatar"/>
                  <img :src="member.avatar" class="item-avatar" v-else alt="">
                  <div class="item-detail">
                    <label for="">{{ member.realname }}</label>
                    <label>{{ member.email }}</label>
                  </div>
                </div>
              </div>
              <div v-else style="color: #666; font-size: 12px;">No results</div>
            </template>
            <span class="detail-font"><icon-font type="icon-xuesheng"/></span>
          </a-popover>
        </div>
        <div class="filter-session" v-show="form.notifyType === NOTIFY_TYPE.FILTER_YEARS.value">
          <a-select
            @change="changeFilter"
            v-model="filter.ages"
            class="filter-select"
            placeholder="Select year(s)"
            :showArrow="true"
            mode="multiple">
            <a-select-option :value="item.value" v-for="(item, index) in filterAgeOptions" :key="index" >
              {{ item.label }}
            </a-select-option>
          </a-select>
          <a-popover title="Teachers" placement="right" >
            <template slot="content">
              <div class="member-list" v-if="memberList && memberList.length > 0">
                <div class="member-item" v-for="member in memberList" :key="member.id">
                  <a-avatar class="item-avatar" icon="user" v-if="!member.avatar"/>
                  <img :src="member.avatar" class="item-avatar" v-else alt="">
                  <div class="item-detail">
                    <label for="">{{ member.realname }}</label>
                    <label>{{ member.email }}</label>
                  </div>
                </div>
              </div>
              <div v-else style="color: #666; font-size: 12px;">No results</div>
            </template>
            <span class="detail-font"><icon-font type="icon-xuesheng"/></span>
          </a-popover>
        </div>
      </div>
      <div v-if="type === typeMap.task" style="text-align:center;margin-top: 50px;">
        All students at your school will receive email and notification
      </div> -->
      <div class='choose-type'>
        <zoom-auth :enable-zoom.sync='enableZoom' :disabled="mustZoom"/>
        <zoom-meeting
          v-show='enableZoom'
          ref='zoom'
          :password='password || mustZoom'
          :waiting-room='waitingRoom' />
      </div>
    </div>
    <div class="date-info">
      <div class='select-date'>
        <div class='title'>Schedule</div>
        <div class='date-picker' v-if="!showCalendar">
          <a-range-picker
            :getCalendarContainer='trigger => trigger.parentElement'
            :default-value="initDate"
            :disabled-date="disabledDate"
            @change="handleDateChange"
            format='YYYY-MM-DD HH:mm:ss'
            :show-time="{ format: 'HH:mm' }"/>
        </div>
        <div style="width: 100%;">
          <session-calendar
            v-if="showCalendar"
            ref="sessionCalendar"
            :editable="false"
            :addable="false"
            :forSelect="true"
            :defaultSelect="initDate"
            :searchFilters="searchFilters"
            :searchType="searchType"
            @date-select="handleSelectSchedule"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'
import CustomLinkText from '@/components/Common/CustomLinkText'
import DeleteIcon from '@/components/Common/DeleteIcon'
import CustomTextButton from '@/components/Common/CustomTextButton'
import { CALENDAR_QUERY_TYPE, PAID_TYPE, NOTIFY_TYPE, PdField } from '@/const/common'
import { typeMap } from '@/const/teacher'

import { getCurriculumBySchoolId } from '@/api/academicSettingCurriculum'
import { getSubjectBySchoolId } from '@/api/academicSettingSubject'
import { queryTeachers } from '@/api/common'
import ZoomMeeting from '@/components/Schedule/ZoomMeeting'
import { ZoomAuthMixin } from '@/mixins/ZoomAuthMixin'
import ZoomAuth from '@/components/Schedule/ZoomAuth'

export default {
  name: 'SchoolSchedule',
  components: {
    ZoomAuth,
    ZoomMeeting,
    CustomTextButton,
    DeleteIcon,
    CustomLinkText,
    SessionCalendar: () => import('@/components/Calendar/SessionCalendar')
  },
  props: {
    defaultDate: {
      type: Array,
      default: null
    },
    showCalendar: {
      type: Boolean,
      default: true
    },
    calendarSearchType: {
      type: [String, Number],
      default: CALENDAR_QUERY_TYPE.WORKSHOP.value
    },
    calendarSearchFilters: {
      type: Array,
      default: () => [1, 2, 3, 4]
    },
    type: {
      type: Number,
      required: true
    },
    password: {
      type: Boolean,
      default: true
    },
    waitingRoom: {
      type: Boolean,
      default: false
    },
    mustZoom: {
      type: Boolean,
      default: false
    },
    initZoom: {
      type: Object,
      default: null
    }
  },
  mixins: [ZoomAuthMixin],
  watch: {
    defaultDate: {
      handler(val) {
        if (val) {
          this.initDate = [...val]
          this.handleDateChange(this.initDate)
        }
      },
      immediate: true
    },
    calendarSearchType: {
      handler(val) {
        if (val) {
          this.searchType = val
        }
      },
      immediate: true
    },
    calendarSearchFilters: {
      handler(val) {
        if (val) {
          this.searchFilters = val
        }
      },
      immediate: true
    },
    initZoom: {
      handler(val) {
        if (val) {
          this.enableZoom = val.enableZoom
        }
      },
      immediate: true
    },
    enableZoom() {
      this.handleZoomStatusChange()
    }
  },
  data() {
    return {
      CALENDAR_QUERY_TYPE: CALENDAR_QUERY_TYPE,
      PAID_TYPE: PAID_TYPE,
      NOTIFY_TYPE: NOTIFY_TYPE,
      typeMap: typeMap,
      PdField: PdField,
      filterSubjectOptions: [],
      filterAgeOptions: [],
      searchType: this.calendarSearchType,
      searchFilters: this.calendarSearchFilters,
      initDate: this.defaultDate,
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px'
      },

      form: {
        notifyStudents: [],
        paidType: Boolean(PAID_TYPE.FREE.value),
        notifyType: NOTIFY_TYPE.ALL.value
      },

      filter: {
        subjects: [],
        ages: []
      },
      memberList: [],

      endData: null,
      startDate: null,
      scheduleDataArray: [],
      enableZoom: this.mustZoom
    }
  },
  created() {
    if (this.$route.query.startDate && this.$route.query.endDate) {
      this.initDate = [moment(this.$route.query.startDate), moment(this.$route.query.endDate)]
      this.handleDateChange(this.initDate)
    }
    this.initFilterOption()
  },
  computed: {
    ...mapState({
      userMode: state => state.app.userMode,
      currentSchool: state => state.user.currentSchool
    })
  },
  methods: {
    initFilterOption() {
      getSubjectBySchoolId({ schoolId: this.currentSchool.id }).then(response => {
        this.$logger.info('getSubjectBySchoolId response', response.result)
        this.filterSubjectOptions = []
        response.result.forEach(curiculum => {
          if (curiculum.subjectList) {
            curiculum.subjectList.forEach(subject => {
              this.filterSubjectOptions.push({ label: subject.subjectName, value: subject.subjectId })
            })
          }
        })
      })
      getCurriculumBySchoolId({ schoolId: this.currentSchool.id }).then(response => {
        this.$logger.info('getCurriculumBySchoolId', response.result)
        this.filterAgeOptions = []
        response.result.forEach(curiculum => {
          if (curiculum.gradeSettingInfo) {
            curiculum.gradeSettingInfo.forEach(grade => {
              this.filterAgeOptions.push({ label: grade.gradeName, value: grade.gradeId })
            })
          }
        })
      })
    },
    changeNotifyType() {
      this.changeFilter()
    },

    changeFilter() {
      if (this.form.notifyType !== NOTIFY_TYPE.ALL.value) {
        // PD 过滤老师， Task过滤学生
        queryTeachers({
          gradeIds: this.form.notifyType === NOTIFY_TYPE.FILTER_YEARS.value ? this.filter.ages : [],
          subjectIds: this.form.notifyType === NOTIFY_TYPE.FILTER_SUBJECTS.value ? this.filter.subjects : [],
          schoolId: this.currentSchool.id
        }).then(res => {
          if (res.success) {
            this.memberList = res.result
          }
        })
      }
    },
    handleDateChange (date, dateString) {
      this.$logger.info('handleDateChange', date, dateString)
      this.startDate = moment(date[0].toDate()).utc().format('YYYY-MM-DD HH:mm:ss')
      this.endData = moment(date[1].toDate()).utc().format('YYYY-MM-DD HH:mm:ss')
      this.$logger.info('handleDateChange', this.startDate, this.endData)
      this.$emit('select-date', {
        startDate: this.startDate,
        endDate: this.endData
      })
    },
    async handleZoomStatusChange () {
      this.$logger.info('handleZoomStatusChange', this.enableZoom)
      this.$emit('select-zoom-status', this.enableZoom)
    },
     handleSelectSchedule(date) {
      if (!date) {
        this.startDate = null
        this.endDate = null
        this.$emit('select-date', null)
        return
      }
      this.$logger.info('handleSelectSchedule', date)
      this.startDate = moment(date.startDate).utc().format('YYYY-MM-DD HH:mm:ss')
      this.endDate = moment(date.endDate).utc().format('YYYY-MM-DD HH:mm:ss')
      this.$emit('select-date', {
        startDate: this.startDate,
        endDate: this.endDate
      })
    },

    getPaidInfo() {
      let notifyType = this.form.notifyType
      let yearList = []
      let subjectList = []
      // server只有1、2，所以前端 3和2 传递的都是2
      if (notifyType === NOTIFY_TYPE.FILTER_YEARS.value) {
        notifyType = NOTIFY_TYPE.FILTER_SUBJECTS.value
      }
      if (this.type === typeMap.pd) {
        yearList = this.form.notifyType === NOTIFY_TYPE.FILTER_YEARS.value ? this.filter.ages : []
        subjectList = this.form.notifyType === NOTIFY_TYPE.FILTER_SUBJECTS.value ? this.filter.subjects : []
      }
      return {
        selectTeachers: this.memberList.map(item => item.id),
        yearList: yearList,
        subjectList: subjectList,
        languageList: [],
        notifyType: notifyType,
        paidType: Number(this.form.paidType),
        notifyStudents: this.memberList.map(item => item.id),
        startDate: this.startDate,
        endDate: this.endData,
        zoom: Number(this.enableZoom),
        password: this.$refs.zoom.isPassword,
        waitingRoom: this.$refs.zoom.isWaitingRoom
      }
    },

    disabledDate(current) {
      return current && current < moment().subtract(1, 'days').endOf('day')
    },

    viewFilterTeacherList () {
      this.$logger.info('viewFilterTeacherList')
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.schedule-pay-info {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-around;
  padding: 15px 0;

  .pay-info {
    padding: 0 20px;
    min-height: 400px;
    max-height: calc(100vh - 160px);
    overflow-y: auto;
    width: 30%;
  }

  .date-info {
    width: 70%;
    padding: 0 20px;
    margin: 0 auto;
    min-height: 400px;
    max-height: calc(100vh - 160px);
    overflow-y: scroll;
    .select-date {
      width: 100%;
      .date-picker {
        width: 380px;
      }
      .title {
        color: #333;
        line-height: 30px;
        padding-left: 5px;
      }
    }
  }
}

.go-calender {
  margin-top: 10px;
}

.notify-session {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  label {
    margin-bottom: 10px;
    margin-left: 30px;
  }
  /deep/ .ant-radio-wrapper-checked {
    font-weight: bold;
  }
}
.filter-session {
  margin-top: 20px;
  display: flex;
  align-items: center;
  .filter-select {
    margin-right: 20px;
    flex: 1;
  }
}
.detail-font {
  width: 25px;
  height: 25px;
  background: #849B4D;
  border-radius: 50%;
  display: inline-block;
  text-align: center;
  color: #fff;
  i {
    color: #fff;
  }
}
.member-list {
  display: flex;
  flex-direction: column;
  max-height: 200px;
  overflow: auto;
  .member-item {
    display: flex;
    margin-bottom: 10px;
    .item-avatar {
      width: 40px;
      height: 40px;
      margin-right: 10px;
      border-radius: 50%;
      object-fit: contain;
    }
    .item-detail {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      label {
        font-size: 14px;
      }
      label:last-child {
        font-size: 12px;
        color: #666;
      }
    }
  }
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
