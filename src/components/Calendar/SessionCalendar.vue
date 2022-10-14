<template>
  <div style="width: 100%">
    <!-- <a-button @click="changeView">change view</a-button> -->
    <a-spin :spinning="loading">
      <div class="schedule-header">
        <div v-if="viewType !== 'timeGridFourDay'" class="schedule-title">{{ viewDate }}</div>
        <div v-else class="schedule-title">
          <a-select
            @change="handleChangeYear"
            optionFilterProp="children"
            :getPopupContainer="trigger => trigger.parentElement"
            v-model='currentYear'
            placeholder='Please select year'>
            <a-select-option v-for='item in yearOptions' :key='item.id'>
              {{ item.name }}
            </a-select-option >
          </a-select>
        </div>
        <a-radio-group class="schedule-view" @change="changeView" v-model="viewType" button-style="solid">
          <a-radio-button value="timeGridWeek">
            Week
          </a-radio-button>
          <a-radio-button value="timeGridFourDay" v-if="showTerm && userMode === USER_MODE.SCHOOL">
            Term
          </a-radio-button>
          <a-radio-button value="dayGridMonth">
            Month
          </a-radio-button>
          <a-radio-button value="timeGridDay">
            Day
          </a-radio-button>
        </a-radio-group>
        <a-space class="schedule-date-change">
          <a-icon @click="handleScheduleChange('prev')" type="caret-left" />
          <span @click="handleScheduleChange('today')">Today</span>
          <a-icon @click="handleScheduleChange('next')" type="caret-right" />
        </a-space>
      </div>
      <div class="year-lines" ref="yearLines" v-show="viewType === 'timeGridFourDay'">
        <div
          class="year-lines-item"
          v-for="term in yearLines"
          :style="{background: term.background, width: term.width + '%'}"
          :key="term.id">
          {{ term.name }}
        </div>
      </div>
      <div id="scheduleContent" v-show="!showNoData || totalEvents.length > 0" class="schedule-content" ref="scheduleContent">
        <cc-calendar
          ref="fullCalendar"
          :eventsApi="loadEvents"
          :selfViews="selfViews"
          :headerToolbar="headerToolbar"
          :scrollTime="scrollTime"
          :editable="editable"
          :selectAllow="selectAllow"
          @select="handleDateSelect"
          @eventClick="handleEventClick"
          @eventsSet="handleEvents"
          @datesSet="handleDatesSet"
          @eventMouseEnter="handleMouseEnter"
          @eventMouseLeave="handleMouseLeave"
          @eventDrop="handleEventDrop"
          @eventResize="handleEventResize"
          class="schedule-calendar"
        >
          <template v-slot:eventContent="{ info }">
            <session-event-content
              :info="info"
              :unitList="currentUnitList"
              :type="queryType"
              :allDatas="calendarDatas"
              @reFetch="reFetch"
              @save="handleSaveContentEvent"
              @changeDateSelect="changeDateSelect"
            />
          </template>
        </cc-calendar>
      </div>
      <a-empty style="margin-top: 100px;" v-if="showNoData && totalEvents.length === 0"></a-empty>
    </a-spin>
    <div class="tooltip" v-clickOutside="closeTip">
      <div class="tooltip-wrap" ref="tooltip">
        <div class="tooltip-content">
          <div class="content-item" @click="handleAddUnit"><span>Import from Unit</span></div>
          <div class="content-item" @click="handleAddSession()"><span>Import from Task</span></div>
          <div class="content-item" @click="handleAddSession(typeMap.pd)"><span>Import from PD</span></div>
        </div>
      </div>
    </div>
    <a-modal
      v-model='importVisible'
      :closable='false'
      :maskClosable='false'
      :keyboard='false'
      :footer='null'
      destroyOnClose
      width='80%'
      @cancel='handleCancelImport'>
      <session-import-for-calendar
        :type="importType"
        :startDate="importModel.startDate"
        :endDate="importModel.endDate"
        :classId="currentClass"
        :need-close="true"
        @cancel="handleCancelImport"
        @ok="handleChoose"
      />
    </a-modal>
  </div>
</template>

<script>

import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'

import CcCalendar from '@/components/Calendar'
import SessionEventContent from '@/components/Calendar/SessionEventContent'

import SessionImportForCalendar from '@/components/MyContentV2/SessionImportForCalendar'
import LiveworkshopItem from '@/components/MyContentV2/LiveWorkShopContentItem'

import { QueryForCalendar } from '@/api/v2/calendarSchedule'
import { EditSessionScheduleV2 } from '@/api/v2/classes'
import { termList } from '@/api/academicTermInfo'
import { classDetail } from '@/api/v2/schoolClass'

import { ABSENT_COLORS, BG_COLORS, CALENDAR_QUERY_TYPE, USER_MODE } from '@/const/common'
import { typeMap } from '@/const/teacher'
import { formatLocalUTC } from '@/utils/util'

import { mapState } from 'vuex'

import moment from 'moment'
import { uniqBy, debounce } from 'lodash-es'

export default {
  name: 'SessionCalendar',
  mixins: [UserModeMixin, CurrentSchoolMixin],
  props: {
    searchType: {
      type: [String],
      default: [CALENDAR_QUERY_TYPE.MY.value, CALENDAR_QUERY_TYPE.WORKSHOP.value].join(',')
    },
    searchFilters: {
      type: Array,
      default: () => ['FA', 'SA', 'IA', 'Activity'] // 根据类型的筛选条件
    },
    classFilters: {
      type: Array,
      default: () => [1, 2] // 根据类型的筛选条件
    },
    schoolFilters: {
      type: Array,
      default: () => []
    },
    editable: {
      type: Boolean,
      default: true
    },
    addable: {
      type: Boolean,
      default: true
    },
    forSelect: {
      type: Boolean,
      default: false
    },
    defaultSelect: {
      type: Array,
      default: () => []
    },
    showTerm: {
      type: Boolean,
      default: false
    },
    needDisableBefore: {
      type: Boolean,
      default: true
    },
    showNoData: {
      type: Boolean,
      default: false
    },
    onlyMe: {
      type: Boolean,
      default: false
    },
    allClassList: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    searchType(val) {
      this.queryType = val
      this.debounceRefetch()
    },
    searchFilters(val) {
      this.typeFilters = [...val]
      this.debounceRefetch()
    },
    classFilters(val) {
      this.clsFilters = [...val]
      this.debounceRefetch()
    },
    schoolFilters(val) {
      this.schoolIds = [...val]
      this.debounceRefetch()
    },
    currentUnitList: {
      handler(val) {
        this.$emit('change-units', val)
      },
      immediate: true,
      deep: true
    },
    allClassList: {
      handler(val) {
        this.classListAll = [...val]
      },
      immediate: true,
      deep: true
    }
  },
  components: {
    CcCalendar,
    SessionEventContent,
    SessionImportForCalendar,
    LiveworkshopItem
  },
  data() {
    return {
      ABSENT_COLORS: ABSENT_COLORS,
      BG_COLORS: BG_COLORS,
      CALENDAR_QUERY_TYPE: CALENDAR_QUERY_TYPE,
      USER_MODE: USER_MODE,
      typeMap: typeMap,
      classListAll: this.allClassList,
      queryType: this.searchType,
      typeFilters: this.searchFilters, // 根据类型的筛选条件
      clsFilters: this.classFilters,
      schoolIds: this.schoolFilters,
      currentUnitList: [],
      timeLabelForYear: [],
      dayLabelForYear: [],
      attendanceVisible: true,
      loading: false,
      startDate: '',
      endDate: '',
      viewType: 'timeGridWeek',
      viewDate: '',
      calendarDatas: [],
      allEvents: [],
      currentEvents: [],
      currentClass: '',
      event: {
        title: 'My Event',
        start: '',
        end: ''
      },
      headerToolbar: false, // {
      //   left: 'prev,next,today',
      //   center: 'title',
      //   right: 'dayGridMonth,timeGridWeek,timeGridDay' // ,timeGridFourDay'
      // },
      scrollTime: '08:00:00',
      selfViews: {
        timeGridFourDay: {
          type: 'timeGrid',
          duration: { days: 12 },
          buttonText: 'year',
          allDaySlot: false,
          slotMaxTime: '8:00:00',
          slotDuration: '00:15:00',
          slotLabelInterval: '00:15',
          titleFormat: (date) => {
            return date.start.year
          },
          dayPopoverFormat: date => {
            const time = moment(date.date).format('HH:mm')
            const day = moment(date.date).format('YYYY-MM-DD')
            const dayObj = this.timeLabelForYear.find(item => item.value === time)
            const monthObj = this.dayLabelForYear.find(item => item.value === day)
            return monthObj.label + ', ' + dayObj.label
          },
          eventMaxStack: 2,
          // eventMinHeight: 60,
          // eventShortHeight: 60,
          selectable: false,
          nowIndicator: false,
          slotEventOverlap: false,
          eventTimeFormat: {
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false,
            hour12: false
          },
          slotLabelClassNames: 'calendar-year-label',
          dayHeaderContent: (info) => {
            const dayLabelForYear = this.convertDayForYear()
            const find = dayLabelForYear.find(item => item.value === moment(info.date).format('YYYY-MM-DD'))
            return find ? find.label : info.text
          },
          slotLabelContent: (info) => {
            if (info.view.type === 'timeGridFourDay') {
              const find = this.timeLabelForYear.find(item => item.value === moment(info.date).format('HH:mm'))
              return find ? find.label : info.text
            }
            return info.text
          }
        }
      },
      selectAllow: (info) => {
        return moment(info.start).isAfter(moment()) || (this.viewType === 'dayGridMonth' && moment(info.start).isSame(moment(), 'day'))
      },

      showUnit: [],
      currentUnit: null,
      totalEvents: [],

      importVisible: false,
      importType: typeMap.task,
      importModel: {
        startDate: null,
        endDate: null
      },
      selectDateEvent: {
        id: null
      },

      currentSession: null,
      termsInited: false,
      blockOptions: {},
      termsOptions: [],
      yearOptions: [],
      currentYear: '',
      yearLines: [],
      termBackground: ['#CDE7FF', '#F7E3FF', '#BAEAD0', '#FCF2BD', '#FDD7DE', '#BCDCF7'],

      clsInited: false,
      clsObj: {},
      clsBlockOptions: []
    }
  },
  computed: {
    ...mapState({
      currentSchool: state => state.user.currentSchool,
      classList: state => state.user.classList,
      userMode: state => state.app.userMode,
      info: state => state.user.info
    }),
    showSchoolOptions() {
      return [
        {
          id: '0',
          name: 'Personal',
          index: 0
        }
      ].concat(this.info.schoolList.map((item, index) => {
        return {
          id: item.id,
          name: item.schoolName,
          index: index + 1
        }
      }))
    }
  },
  created() {
    this.debounceLoad = debounce(this.loadData, 300)
    this.debounceRefetch = debounce(this.reFetch, 300)
    this.initData()
  },
  mounted() {
    setTimeout(() => {
      this.reRender()
    }, 10)
  },
  methods: {
    async initData() {
      this.currentUnit = this.currentUnitList.length > 0 ? this.currentUnitList[0].id : ''
      this.showUnit = this.currentUnitList.map(item => item.id)
      this.convertTimeForYear()
    },
    // 加载日期数据
    async loadData(params) {
      const res = await QueryForCalendar(params)
      return res
    },
    async loadBlock() {
      if (this.queryType !== this.CALENDAR_QUERY_TYPE.CLASS.value) {
        if (this.schoolIds.length > 1) {
          return []
        }
      }
      await this.loadTerm()
      if (this.searchType === CALENDAR_QUERY_TYPE.CLASS.value && this.searchFilters.length > 0) {
        const blocks = await this.loadClass()
        return blocks
      } else {
        let termEvents = []
        if (this.termsOptions.length > 0) {
          termEvents = this.transferTermBlock()
        }
        return termEvents
      }
    },
    async loadTerm() {
      if (!this.termsInited) {
        let schoolId = this.currentSchool.id
        if (this.queryType !== this.CALENDAR_QUERY_TYPE.CLASS.value && this.schoolIds.length === 1) {
          schoolId = this.schoolIds
        }
        console.log(schoolId)
        const termRes = await termList({
          schoolId: schoolId
        })
        if (termRes.success) {
          this.termsInited = true
          let termsOptions = []
          this.yearOptions = termRes.result
          termRes.result.forEach(year => {
            // 当前时间所在学年
            if (!this.currentYear && moment(year.startTime).isBefore(new Date()) && moment(year.endTime).isAfter(new Date())) {
              this.currentYear = year.id
            }
            const terms = year.terms.map(term => {
              this.blockOptions[term.id] = term.block.blockSettings || []
              return {
                ...term,
                blockSettings: term.block.blockSettings || [],
                yearName: year.name
              }
            })
            termsOptions = termsOptions.concat(terms)
          })
          this.termsOptions = termsOptions
        }
      }
    },
    async loadClass() {
      // class 单选
      if (this.searchType === CALENDAR_QUERY_TYPE.CLASS.value && this.searchFilters.length > 0) {
        this.currentClass = this.searchFilters[0]
        const clsRes = await classDetail({
          classId: this.searchFilters[0]
        })
        if (clsRes.success) {
          this.clsInited = true
          this.clsObj = clsRes.result
          if (this.clsObj && this.clsObj.term && this.clsObj.blockSetting) {
            const termObj = this.termsOptions.find(term => term.id === this.clsObj.term)
            if (termObj) {
              return this.transferSubjectClsBlock(this.clsObj.blockSetting, termObj.startTime, termObj.endTime)
            }
          }
        }
      }
      return []
    },
    transferSubjectClsBlock(block, start, end) {
      // 回显block, 周循环
      const termEvents = []
      const termStart = moment.utc(start).local()
      const termEnd = moment.utc(end).local()
      const calendarStart = moment(this.startDate)
      const calendarEnd = moment(this.endDate)
      // 过时不候
      if (calendarStart.isAfter(termEnd) || calendarEnd.isBefore(termStart)) {
        return []
      }
      let startTime = termStart
      const endTime = termEnd
      // block = '2022-08-02 20:00:00~2022-08-02 20:03:00,2022-08-04 01:00:00~2022-08-04 01:03:00'
      let blockWeeks = []
      block.split(',').forEach(time => {
        const timeArr = time.split('~')
        if (timeArr.length === 2) {
          const start = moment(timeArr[0])
          const end = moment(timeArr[1])
          const startTime = start.format('HH:mm:ss')
          const startDay = start.format('dddd')
          const endDay = end.format('dddd')
          const endTime = end.format('HH:mm:ss')

          blockWeeks = blockWeeks.concat([{
            week: startDay,
            start: startTime,
            end: startDay !== endDay ? '23:59:59' : endTime
          }, {
            week: endDay,
            start: startDay !== endDay ? '00:00:00' : startTime,
            end: endTime
          }])
        }
      })
      while (startTime.isBefore(endTime)) {
        const week = moment(startTime).format('dddd')
        const isFind = blockWeeks.find(item => item.week === week)
        if (isFind) {
          const convertStart = startTime.format('YYYY-MM-DD') + ' ' + isFind.start
          const convertEnd = startTime.format('YYYY-MM-DD') + ' ' + isFind.end
          termEvents.push({
            start: (convertStart),
            end: (convertEnd),
            display: 'background',
            extendedProps: {
              termId: new Date().getTime()
            }
          })
        }
        startTime = startTime.add(1, 'd')
      }
      return termEvents
    },
    transferTermBlock() {
      const termEvents = []
      let start = moment(this.startDate)
      const end = moment(this.endDate)
      // TODO 不同year的term可能重叠，用color来区分
      // let index = 0
      while (start.isBefore(end)) {
        const isFind = this.termsOptions.find(term => {
          if (term.startTime && term.endTime) {
            const startTime = moment(term.startTime)
            const endTime = moment(term.endTime)
            if (moment(start).isAfter(startTime) && moment(start).isBefore(endTime)) {
              return true
            }
          }
          return false
        })
        if (isFind && isFind.blockSettings) {
          isFind.blockSettings.forEach(block => {
            const convertStart = start.format('YYYY-MM-DD') + ' ' + block.start + ':00'
            const convertEnd = start.format('YYYY-MM-DD') + ' ' + block.end + ':59'
            termEvents.push({
              start: (convertStart),
              end: (convertEnd),
              display: 'background',
              extendedProps: {
                termId: isFind.id,
                yearName: isFind.yearName,
                termName: isFind.name
              }
            })
          })
        }
        start = start.add(1, 'd')
      }
      return termEvents
    },
    convertTimeForYear() {
      // 将24小时映射成31day， 方便year视图
      let start = moment().startOf('day')
      const end = moment().endOf('day')
      const timeLabelForYear = []
      let index = 1
      while (start.isBefore(end)) {
        timeLabelForYear.push({
          value: start.format('HH:mm'),
          label: index,
          end: moment(start).add(15, 'm').format('HH:mm')
        })
        start = start.add(15, 'm')
        index++
      }
      this.timeLabelForYear = timeLabelForYear
    },
    convertDayForYear() {
      // 将12列映射成12个月，方便year视图
      // 根据学年的起止时间来(学年多少月，视图就显示多少列)
      const yearObj = this.yearOptions.find(item => item.id === this.currentYear)
      let yearStart = moment.utc(yearObj.startTime).local()
      const dayLabelForYear = []
      let start = moment(this.startDate)
      const end = moment(this.endDate)
      while (start.isBefore(end)) {
        dayLabelForYear.push({
          value: start.format('YYYY-MM-DD'),
          label: yearStart.format('MMM YY')
        })
        start = start.add(1, 'd')
        yearStart = yearStart.add(1, 'M')
      }
      this.dayLabelForYear = dayLabelForYear
      return dayLabelForYear
    },
    convertYearToTime(time, isEnd = false) {
      // 如果是年视图，将时间转换成对应的12日视图
      // 2月 -> 2号  2号 -> 00:15~00:30 3号 -> 00:30~00:45
      // startTime是00:30 endTime的话是00:45
      const month = moment(time).get('month')
      const day = moment(time).get('date')
      // const second = moment(time).seconds()
      // const extra = isEnd ? 1 : 0
      const newDate = this.dayLabelForYear[month].value
      const newTime = this.timeLabelForYear[day - 1][isEnd ? 'end' : 'value']
      //
      return newDate + ' ' + newTime + ':00'// + (second > 9 ? second : ('0' + second))
    },
    // 加载事件
    loadEvents(date, successCb, failCb) {
      let start = moment(date.start).format('YYYY-MM-DD')
      let end = moment(date.end).format('YYYY-MM-DD')
      this.startDate = start
      this.endDate = end
      if (this.$refs.fullCalendar) {
        const calendarApi = this.$refs.fullCalendar.getApi()
        if (calendarApi) {
          calendarApi.removeAllEvents()
          // 把daterange加上
          if (this.selectDateEvent.id) {
            calendarApi.addEvent(this.selectDateEvent)
          }
        }
      }

      const params = {}
      this.totalEvents = []
      let noNeedQuery = false
      if (this.queryType === this.CALENDAR_QUERY_TYPE.CLASS.value) {
        params.classIds = this.typeFilters
        params.classTypes = this.clsFilters
        noNeedQuery = this.typeFilters.length === 0
      } else if (this.queryType.indexOf(this.CALENDAR_QUERY_TYPE.WORKSHOP.value) > -1) {
        params.workshopStatus = this.typeFilters.filter(type => !['FA', 'SA', 'IA', 'Activity'].includes(type)).join(',')
        params.workshopType = '1,2'
        noNeedQuery = this.typeFilters.length === 0
      }
      if (this.classListAll && this.classListAll.length > 0 && this.schoolIds) {
        params.classIds = this.classListAll.filter(item => this.schoolIds.includes(item.schoolId)).map(item => item.id).join(',')
      }
      if (this.queryType !== this.CALENDAR_QUERY_TYPE.CLASS.value) {
        this.termsInited = false
        // noNeedQuery = params.schoolIds.length === 0
      }
      if (this.schoolIds) {
        params.schoolIds = this.schoolIds.join(',')
      }
      // 把term block加上
      this.loadBlock().then(termEvents => {
        console.log(this.termsOptions)

        // 过去时间disabled
        if (this.needDisableBefore && this.viewType !== 'timeGridFourDay') {
          let startDis = start
          let endDis = moment().format('YYYY-MM-DD')
          if (this.viewType !== 'dayGridMonth') {
            startDis = start + ' 00:00:00'
            endDis = moment().format('YYYY-MM-DD HH:mm:ss')
          }
          if (moment(startDis).isSameOrBefore(endDis)) {
            termEvents.push({
              start: startDis,
              end: endDis,
              backgroundColor: '#918585',
              display: 'background',
              selectable: false,
              extendedProps: {
              }
            })
          }
        }

        if (noNeedQuery) {
          successCb(termEvents)
          this.handleViewDidMount(date)
        } else {
          this.loading = true
          if (this.viewType === 'timeGridFourDay') {
            const yearData = this.yearOptions.find(item => item.id === this.currentYear)
            if (yearData) {
              start = formatLocalUTC(yearData.startTime, 'YYYY-MM-DD')
              end = formatLocalUTC(yearData.endTime, 'YYYY-MM-DD')
            } else {
              start = moment().startOf('year').format('YYYY-MM-DD')
              end = moment().endOf('year').format('YYYY-MM-DD')
            }
          }
          this.loadData({
            ...params,
            startDate: moment(start + ' 00:00:00').utc().format('YYYY-MM-DD'),
            endDate: moment(end + ' 23:59:59').utc().format('YYYY-MM-DD'),
            queryTypes: this.queryType // .split(',')
          }).then(res => {
            if (res && res.success && res.result) {
              let totalEvents = []
              const filterRes = res.result// .filter(item => item.unitPlanInfo)
              this.calendarDatas = res.result
              if (filterRes.length > 0) {
                this.currentUnitList = uniqBy(filterRes.filter(item => item.unitPlanInfo).map(item => item.unitPlanInfo), 'id')
                const events = filterRes.map(item => {
                  // 根据classId获取颜色
                  let index = -1
                  if (this.queryType !== CALENDAR_QUERY_TYPE.CLASS.value) {
                    index = this.showSchoolOptions.findIndex(school => school.id === (item.sessionInfo ? item.sessionInfo.schoolId : '0'))
                  } else {
                    index = this.currentUnitList.findIndex(unit => unit.id === (item.unitPlanInfo ? item.unitPlanInfo.id : -1))
                  }
                  const color = (index === -1) ? '#f6f3f3' : BG_COLORS[index]

                  let startTime = item.startTime
                  let endTime = item.endTime
                  let editable = true
                  if (this.viewType === 'timeGridFourDay') {
                    this.convertDayForYear()
                    startTime = this.convertYearToTime(item.startTime)
                    endTime = this.convertYearToTime(item.endTime, true)
                    // if (startTime === endTime) {
                    //   endTime = this.convertYearToTime(item.endTime, true)
                    // }
                    editable = false
                  } else {
                    startTime = this.$options.filters['dayjs'](startTime)
                    endTime = this.$options.filters['dayjs'](endTime)
                  }
                  // 开始时间超过当前时间不能拖动TODO
                  if (moment(startTime).isBefore(moment())) {
                    editable = false
                  }
                  if (item.workshopsDetailInfo) {
                    editable = false
                  }
                  if (item.sessionInfo.author !== this.info.email) {
                    editable = false
                  }
                  return {
                    id: item.sessionInfo.id,
                    title: (item.workshopsDetailInfo && item.workshopsDetailInfo.title) ? item.workshopsDetailInfo.title : item.sessionInfo.sessionName,
                    start: startTime,
                    end: endTime,
                    backgroundColor: 'transparent',
                    borderColor: 'transparent',
                    editable: this.editable && editable,
                    extendedProps: {
                      classId: item.sessionInfo.classId,
                      planId: item.sessionInfo.planId,
                      contentId: item.sessionInfo.contentId,
                      sessionType: item.sessionInfo.sessionType,
                      author: item.sessionInfo.author,
                      taskType: item.content ? item.content.taskType : '',
                      sessionId: item.sessionId,
                      status: item.attendance || 'absent',
                      id: item.sessionInfo.id,
                      backgroundColor: color,
                      start: item.startTime,
                      end: item.endTime,
                      userAvatar: item.userAvatar,
                      userRealName: item.userRealName,
                      schoolId: item.schoolId,
                      schoolName: item.schoolName,
                      isWorkShop: !!item.workshopsDetailInfo
                    }
                  }
                })
                this.calendarDatas = res.result
                this.allEvents = events
                const filterEvents = events.filter(event => {
                  if (this.queryType.indexOf(this.CALENDAR_QUERY_TYPE.MY.value) > -1) {
                    if (!event.extendedProps.isWorkShop && !this.typeFilters.includes(event.extendedProps.taskType)) {
                      return false
                    }
                  }
                  if (this.$route.query && this.$route.query.sessionId) {
                    return event.extendedProps.sessionId !== this.$route.query.sessionId
                  }
                  if (this.queryType !== this.CALENDAR_QUERY_TYPE.CLASS.value && this.onlyMe && event.extendedProps.author !== this.info.email) {
                    return false
                  }
                  return true
                })
                totalEvents = filterEvents
              } else {
                totalEvents = []
                this.currentUnitList = []
              }
              this.totalEvents = totalEvents

              console.log(termEvents)

              successCb(totalEvents.concat(termEvents))
              this.handleViewDidMount(date)
              this.handleScrollTime()
              this.handleInitSelect()
            } else {
              failCb({ message: 'Error' })
            }
          }).catch((e) => {
            const err = (e && (e.message || e)) || 'Remote Api Error'
            failCb({ message: err })
            this.$message.error(err)
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    getOptions(typeVal) {
      let typeLabel = ''
      for (const i in this.CALENDAR_QUERY_TYPE) {
        if (this.CALENDAR_QUERY_TYPE[i].value === typeVal) {
          typeLabel = this.CALENDAR_QUERY_TYPE[i].label
        }
      }
      return this[typeLabel] ? this[typeLabel] : []
    },
    setViewDate(date) {
      const startFul = moment(date.start).format('MMM D, YYYY')
      const start = moment(date.start).format('MMM D')
      const end = moment(date.end).subtract(1, 'days').format('MMM D, YYYY')
      this.viewDate = this.viewType === 'timeGridDay' ? startFul : [start, end].join(' - ')
    },
    handleChangeYear(yearId) {
      this.currentYear = yearId
      this.changeView({
        target: {
          value: 'timeGridFourDay'
        }
      })
    },
    changeView(e) {
      const viewType = e.target.value
      const calendarApi = this.$refs.fullCalendar.getApi()
      const selfViews = this.selfViews
      if (this.viewType === 'timeGridFourDay') {
        const yearObj = this.yearOptions.find(item => item.id === this.currentYear)
        if (yearObj) {
          const diff = moment.utc(yearObj.endTime).local().diff(moment.utc(yearObj.startTime).local(), 'month', true)
          console.log(diff)
          selfViews.timeGridFourDay.duration.days = Math.ceil(diff)
          this.computeYearLines()
        }
      }
      calendarApi.setOption('views', selfViews)
      calendarApi.changeView(viewType)
      this.$nextTick(() => {
        if (this.viewType === 'timeGridFourDay') {
          const leftWidth = document.querySelector('.calendar-year-label').offsetWidth
          this.$refs.yearLines.style.paddingLeft = `${leftWidth}px`
        }
      })
    },
    // 根据term将年分段
    computeYearLines() {
      const yearObj = this.yearOptions.find(item => item.id === this.currentYear)
      if (yearObj.terms && yearObj.terms.length > 0) {
        const totalDays = moment(yearObj.endTime).diff(moment(yearObj.startTime), 'days')
        const yearLines = []
        let begin = moment(yearObj.startTime)
        const end = moment(yearObj.endTime)
        yearObj.terms.forEach((term, index) => {
          const termBegin = moment(term.startTime)
          const termEnd = moment(term.endTime)
          const rangeTerm = termEnd.diff(termBegin, 'days')
          let rangeRest = 0
          if (begin.isBefore(termBegin)) {
            rangeRest = termBegin.diff(begin, 'days')
            // push rest
            yearLines.push({
              width: totalDays ? (rangeRest / totalDays) * 100 : 0,
              background: '#fff',
              name: 'rest',
              startTime: begin.format('YYYY-MM-DD'),
              endTime: termBegin.format('YYYY-MM-DD'),
              id: new Date().getTime() + Math.random() * 1000
            })
          }
          // push term
          yearLines.push({
            ...term,
            width: totalDays ? (rangeTerm / totalDays) * 100 : 0,
            background: this.termBackground[index]
          })
          // last term
          if (index === yearObj.terms.length - 1 && end.isAfter(termEnd)) {
            rangeRest = end.diff(termEnd, 'days')
            // push rest
            yearLines.push({
              width: totalDays ? (rangeRest / totalDays) * 100 : 0,
              background: '#fff',
              name: 'rest',
              startTime: begin.format('YYYY-MM-DD'),
              endTime: termBegin.format('YYYY-MM-DD'),
              id: new Date().getTime() + Math.random() * 1000
            })
          }
          begin = termEnd
        })
        this.yearLines = yearLines
        console.log(this.yearLines)
      }
    },
    handleScheduleChange(opt) {
      const calendarApi = this.$refs.fullCalendar.getApi()
      calendarApi[opt]()
    },
    handleSchoolChange(school) {
      this.initData()
      setTimeout(() => {
        this.reFetch()
      }, 100)
    },
    handleWeekendsToggle() {
      this.calendarOptions.weekends = !this.calendarOptions.weekends // update a property
    },
    // 将当前时间线延长成整个table而不是某天的格子里
    handleViewDidMount(date) {
      this.$nextTick(() => {
        if (this.$refs.fullCalendar) {
          const calendarApi = this.$refs.fullCalendar.getApi()
          if (calendarApi) {
            this.setViewDate(date)
            calendarApi.render()
          }
        }
        const nowLine = document.getElementsByClassName('fc-timegrid-now-indicator-line')
        if (nowLine && nowLine.length > 0) {
          // const cloneLine = nowLine[0].cloneNode(true)
          const fcBody = document.getElementsByClassName('fc-timegrid-body')[0]
          fcBody.insertBefore(nowLine[0], fcBody.firstChild)
        }
      })
    },
    handleScrollTime() {
      if (this.viewType === 'timeGridWeek' || this.viewType === 'timeGridDay') {
        this.$nextTick(() => {
          if (this.$refs.fullCalendar) {
            const calendarApi = this.$refs.fullCalendar.getApi()
            let current = moment().subtract(15, 'm').format('HH:mm:ss')
            if (this.forSelect && this.defaultSelect && this.defaultSelect[1]) {
              current = this.defaultSelect[0].format('HH:mm:ss')
            }
            calendarApi && calendarApi.scrollToTime(current)
          }
        })
      }
    },
    handleInitSelect() {
      if (this.forSelect && this.defaultSelect && this.defaultSelect[1]) {
        const calendarApi = this.$refs.fullCalendar.getApi()
        const selectEvent = calendarApi.getEventById('DateSelect')
        if (!selectEvent) {
          this.selectDateEvent = {
            id: 'DateSelect',
            title: 'DateSelect',
            start: this.defaultSelect[0].format('YYYY-MM-DD HH:mm:ss'),
            end: this.defaultSelect[1].format('YYYY-MM-DD HH:mm:ss'),
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            editable: true,
            extendedProps: {
              eventType: 'selectDate',
              backgroundColor: '#3688d8',
              start: this.defaultSelect[0].format('YYYY-MM-DD HH:mm:ss'),
              end: this.defaultSelect[1].format('YYYY-MM-DD HH:mm:ss')
            }
          }
          calendarApi.addEvent(this.selectDateEvent)
          calendarApi.unselect()
          if (moment(this.startDate).isAfter(this.defaultSelect[1], 'd') || moment(this.endDate).isBefore(this.defaultSelect[0], ' d')) {
            calendarApi.gotoDate(this.defaultSelect[0].toDate())
          }
        }
      }
    },
    handleDateSelect(selectInfo) {
      if (this.addable) {
        this.$refs.tooltip.style.visibility = 'visible'
        this.$refs.tooltip.style.top = selectInfo.jsEvent.clientY + 'px'
        this.$refs.tooltip.style.left = selectInfo.jsEvent.clientX + 'px'
      }
      this.event = selectInfo
      this.importModel.startDate = moment(this.event.start).format('YYYY-MM-DD HH:mm:ss')
      this.importModel.endDate = moment(this.event.end).format('YYYY-MM-DD HH:mm:ss')
      if (this.viewType === 'dayGridMonth') {
        this.importModel.endDate = moment(this.event.end).subtract(1, 'day').endOf('day').format('YYYY-MM-DD HH:mm:ss')
      }
      if (this.forSelect) {
        // 添加时间选择事件
        const calendarApi = this.$refs.fullCalendar.getApi()
        const selectEvent = calendarApi.getEventById('DateSelect')
        if (selectEvent) {
          selectEvent.remove()
        }
        this.selectDateEvent = {
          id: 'DateSelect',
          title: 'DateSelect',
          start: this.importModel.startDate,
          end: this.importModel.endDate,
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          editable: true,
          extendedProps: {
            eventType: 'selectDate',
            backgroundColor: '#3688d8',
            start: this.importModel.startDate,
            end: this.importModel.endDate
          }
        }
        calendarApi.addEvent(this.selectDateEvent)
        calendarApi.unselect()
      }
      this.$emit('date-select', this.importModel)
    },
    changeDateSelect(dateSelect) {
      const calendarApi = this.$refs.fullCalendar.getApi()
      const selectEvent = calendarApi.getEventById('DateSelect')
      if (selectEvent) {
        selectEvent.remove()
      }
      if (!dateSelect) {
        this.$emit('date-select', null)
        return
      }
      const startTime = moment(dateSelect.start).format('YYYY-MM-DD HH:mm:ss')
      const endTime = moment(dateSelect.end).format('YYYY-MM-DD HH:mm:ss')
      calendarApi.addEvent({
        id: 'DateSelect',
        title: 'DateSelect',
        start: startTime,
        end: endTime,
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        editable: true,
        extendedProps: {
          eventType: 'selectDate',
          backgroundColor: '#3688d8',
          start: startTime,
          end: endTime
        }
      })
      this.$emit('date-select', {
        startDate: startTime,
        endDate: endTime
      })
    },
    closeTip() {
      this.$refs.tooltip.style.visibility = 'hidden'
    },
    handleStepChange(data) {
      this.currentActiveStepIndex = data.index
    },
    handleAddUnit() {
      this.closeTip()
      this.importType = typeMap['unit-plan']
      const path = `/teacher/session-import/${this.importType}/${this.currentClass}?startDate=${this.importModel.startDate}&endDate=${this.importModel.endDate}&searchType=${this.searchType}&source=calendar`
      this.$router.push(path)
      // this.importVisible = true
    },
    handleAddSession(type) {
      this.closeTip()
      this.importType = type || typeMap.task
      const path = `/teacher/session-import/${this.importType}/${this.currentClass}?startDate=${this.importModel.startDate}&endDate=${this.importModel.endDate}&searchType=${this.searchType}&source=calendar`
      this.$router.push(path)
      // this.importVisible = true
    },
    handleChoose() {
      this.reFetch()
      this.handleCloseImport()
    },
    handleCancelImport() {
      this.$confirm({
        title: 'Confirm cancel import',
        content: `Please complete the setting before leaving the page, otherwise the session can not be created`,
        centered: true,
        okText: 'Leave without saving',
        cancelText: 'Continue',
        onOk: () => {
          this.handleCloseImport()
        }
      })
    },
    handleCloseImport() {
      this.importVisible = false
    },
    handleEventClick(clickInfo) {
    },
    handleEvents(events) {
      this.currentEvents = events
    },
    handleDatesSet(event) {
      // const originType = this.viewType
      this.startDate = moment(event.start).format('YYYY-MM-DD')
      this.endDate = moment(event.end).format('YYYY-MM-DD')
      this.viewType = event.view.type
      // if (event.view.type === 'timeGridFourDay') {
      //   this.reFetch()
      // }
    },
    handleMouseEnter(info) {
    },
    handleChangeEvents() {
      const calendarApi = this.$refs.fullCalendar.getApi()
      calendarApi.removeAllEvents()
      this.allEvents.forEach(item => {
        const props = item.extendedProps
        if (this.showUnit.includes(props.planId)) {
          calendarApi.addEvent(item)
        }
      })
      // this.reRender()
    },
    handleMouseLeave(event) {

    },
    handleEventDrop(event) {
      const current = event.event
      const extendedProps = current.extendedProps
      const start = moment(current.start)
      // 错误日期则回退
      if (moment().isAfter(start)) {
        current.setDates(event.oldEvent.start, event.oldEvent.end)
        return
      }
      if (event.event.id === 'DateSelect') {
        this.$emit('date-select', {
          startDate: moment(current.start).format('YYYY-MM-DD HH:mm:ss'),
          endDate: moment(current.end).format('YYYY-MM-DD HH:mm:ss')
        })
      } else {
        const params = {
          sessionStartTime: moment(current.start).utc().format('YYYY-MM-DD HH:mm:ss'),
          deadline: moment(current.end).utc().format('YYYY-MM-DD HH:mm:ss'),
          startDate: moment(current.start).utc().format('YYYY-MM-DD HH:mm:ss'),
          endDate: moment(current.end).utc().format('YYYY-MM-DD HH:mm:ss'),
          id: extendedProps.id
        }
        this.handleSave(params, event)
      }
    },
    handleEventResize(event) {
      const current = event.event
      const extendedProps = current.extendedProps
      if (event.event.id === 'DateSelect') {
        this.$emit('date-select', {
          startDate: moment(current.start).format('YYYY-MM-DD HH:mm:ss'),
          endDate: moment(current.end).format('YYYY-MM-DD HH:mm:ss')
        })
      } else {
        const params = {
          sessionStartTime: moment(current.start).utc().format('YYYY-MM-DD HH:mm:ss'),
          deadline: moment(current.end).utc().format('YYYY-MM-DD HH:mm:ss'),
          startDate: moment(current.start).utc().format('YYYY-MM-DD HH:mm:ss'),
          endDate: moment(current.end).utc().format('YYYY-MM-DD HH:mm:ss'),
          id: extendedProps.id
        }
        this.handleSave(params, event)
      }
    },
    handleSave(params, info) {
      console.log(params)
      this.loading = true
      EditSessionScheduleV2(params).then(res => {
        if (res.success) {
          this.$message.success('Opt Successfully')
          this.handleSaveContentEvent({
            params: params,
            info: info
          })
        }
      }).finally(res => {
        this.loading = false
      })
    },
    handleSaveContentEvent(data) {
      const params = data.params
      const info = data.info
      const find = this.calendarDatas.find(item => item.sessionInfo.id === params.id)
      let modifyUnitPlanInfo = {}
      if (params.planId) {
        modifyUnitPlanInfo = this.currentUnitList.find(unit => unit.id === params.planId) || {}
      }
      // this.calendarDatas 也得变
      if (find) {
        find.sessionInfo = {
          ...find.sessionInfo,
          ...params
        }
        find.unitPlanInfo = {
          ...find.unitPlanInfo,
          ...modifyUnitPlanInfo
        }
      }
      // unit变了，颜色得变
      if (params.planId && info) {
        const index = this.currentUnitList.findIndex(unit => unit.id === params.planId)
        const color = BG_COLORS[index]
        info.event.setExtendedProp('backgroundColor', color)
        info.event.setExtendedProp('planId', params.planId)
      } else {
        // 为了popover跟着变。
        const color = info.event.extendedProps.backgroundColor
        info.event.setExtendedProp('backgroundColor', color)
      }
    },
    closeAllModal() {
      // this.$refs.scheduleContent.dispatchEvent(new MouseEvent('click'))
      document.getElementsByClassName('ant-popover').forEach(item => (item.style.display = 'none'))
    },
    reRender() {
      this.$nextTick(() => {
        if (this.$refs.fullCalendar) {
          const calendarApi = this.$refs.fullCalendar.getApi()
          calendarApi && calendarApi.render()
        }
      })
    },
    reFetch() {
      this.$nextTick(() => {
        if (this.$refs.fullCalendar) {
          const calendarApi = this.$refs.fullCalendar.getApi()
          calendarApi && calendarApi.refetchEvents()
        }
      })
    }
  }
}
</script>
<style lang='less'>

.fc-daygrid-event {
  & > div {
    width: 100%;
  }
}
.fc-timegrid-event {
  .schedule-event-content {
    min-height: 50px;
  }
}
.schedule-event-content {
  padding: 2px;
  border-radius: 5px;
  width:100%;
  overflow: hidden;
  text-overflow: ellipsis;
  overflow-y: auto;
  height: 100%;
  .event-content-dot {
    width: 8px;
    height: 8px;
    border-radius: 8px;
    display: inline-block;
    margin-right: 5px;
  }
}
</style>

<style lang='less' scoped>
@import "~@/components/index.less";
.opt {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.tooltip {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  .tooltip-wrap {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    background: #fff;
    color: rgba(0,0,0,.65);
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5;
    list-style: none;
    font-feature-settings: "tnum";
    position: fixed;
    z-index: 1060;
    max-width: 250px;
    visibility: hidden;
    transition: left .5s, top .5s;
    border: 1px solid #dfdf;
    .tooltip-content {
      padding: 4px 0;
      .content-item {
        padding: 5px 12px;
        color: rgba(0, 0, 0, 0.65);
        font-weight: normal;
        font-size: 14px;
        line-height: 22px;
        white-space: nowrap;
        cursor: pointer;
        // transition: all 0.3s;
        clear: both;
        margin: 0;
        span {
          font-family: Arial;
          font-weight: 400;
          color: #525252;
        }
        &:hover {
          color: #15c39a;
          background: #EDF1F5;
        }
      }
    }
  }
}
.schedule-content {
  position: relative;
  display: flex;
  width: 100%;
  .schedule-calendar {
    flex: 1;
    /deep/ .fc-view-harness {
      background: #fff;
      .fc-day-today {
        background-color: unset;
      }
      .fc-timeGridFourDay-view {
        .fc-timegrid-slot {
          height: 60px;
        }
      }
    }
    /deep/ .fc-event-main {
      & > div {
        height: 100%;
      }
    }
  }
  .schedule-tip {
    width: 190px;
    display: flex;
    flex-direction: column;
    margin-top: 60px;
    margin-right: 10px;
    .unit-tip {
      display: flex;
      flex-direction: column;
      margin-bottom: 20px;
      max-height: 200px;
      overflow: auto;
      line-height: 1;
      .tip-check {
        width: 100%;
      }
      .tip-content {
        height: 30px;
        line-height: 30px;
        display: inline-block;
        align-items: center;
        .tip-dot {
          display: inline-block;
          margin-right: 5px;
          width: 20px;
          height: 10px;
          // border-radius: 10px;
          &.dot-status {
            width: 10px;
            border-radius: 10px;
          }
        }
      }
      .unit-tip-item {
        padding: 0 5px;
        span {
          display: inline-block;
          height: 30px;
          line-height: 30px;
          width:100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
.import-content {
  margin-top: 20px;
}
.calendar-type {
  .calendar-type-item {
    margin-bottom: 15px;
    .type-item-title {
      &.active {
       /deep/ .ant-radio-wrapper span {
          color: @primary-color;
          font-weight: bold;
        }
      }
    }
    .type-check {
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      /deep/ .ant-checkbox-group-item {
        display: flex;
        align-items: center;
        margin-bottom: 5px;
      }
    }
  }
  .type-item-desc {
    padding-left: 25px;
  }
}
.schedule-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
  .schedule-title {
    font-weight: bold;
    font-size: 20px;
    width: 250px;
  }
  .schedule-view {
    flex: 1;
    text-align: center;
  }
  .schedule-date-change {
    justify-content: flex-end;
    width: 88px;
    i {
      cursor: pointer;
    }
    span {
      cursor: pointer;
    }
  }
}
.year-lines {
  width: 100%;
  display: flex;
  height: 20px;
  line-height: 20px;
  margin-top: 20px;
  .year-lines-item {
    height: 100%;
    color: #333;
    text-align: center;
    font-size: 12px;
  }
}
</style>
