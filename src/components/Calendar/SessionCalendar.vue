<template>
  <div style="width: 100%">
    <a-spin :spinning="loading">
      <div id="scheduleContent" class="schedule-content" ref="scheduleContent">
        <cc-calendar
          ref="fullCalendar"
          :eventsApi="loadEvents"
          :selfViews="selfViews"
          :headerToolbar="headerToolbar"
          :editable="editable"
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
            />
          </template>
        </cc-calendar>
      </div>
    </a-spin>
    <div class="tooltip" v-clickOutside="closeTip">
      <div class="tooltip-wrap" ref="tooltip">
        <div class="tooltip-content">
          <div class="content-item" @click="handleAddUnit"><span>Import from Unit</span></div>
          <div class="content-item" @click="handleAddSession"><span>Import from Task</span></div>
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
        :init="importModel"
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
import ContentItemCalendar from '@/components/MyContentV2/ContentItemCalendar'
import LiveworkshopItem from '@/components/MyContentV2/LiveWorkShopContentItem'

import { QueryForCalendar } from '@/api/v2/calendarSchedule'
import { EditSessionScheduleV2 } from '@/api/v2/classes'

import { ABSENT_COLORS, BG_COLORS, CALENDAR_QUERY_TYPE } from '@/const/common'
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
      type: [String, Number],
      default: CALENDAR_QUERY_TYPE.MY.value
    },
    searchFilters: {
      type: Array,
      default: () => ['sessionType1', 'sessionType2', 'sessionType3'] // 根据类型的筛选条件
    },
    editable: {
      type: Boolean,
      default: true
    },
    addable: {
      type: Boolean,
      default: true
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
    currentUnitList: {
      handler(val) {
        this.$emit('change-units', val)
      },
      immediate: true,
      deep: true
    }
  },
  components: {
    CcCalendar,
    SessionEventContent,
    SessionImportForCalendar,
    ContentItemCalendar,
    LiveworkshopItem
  },
  data() {
    return {
      ABSENT_COLORS: ABSENT_COLORS,
      BG_COLORS: BG_COLORS,
      CALENDAR_QUERY_TYPE: CALENDAR_QUERY_TYPE,
      typeMap: typeMap,
      queryType: this.searchType,
      typeFilters: this.searchFilters, // 根据类型的筛选条件
      currentUnitList: [],
      timeLabelForYear: [],
      dayLabelForYear: [],
      attendanceVisible: true,
      loading: false,
      startDate: '',
      endDate: '',
      viewType: 'timeGridWeek',
      calendarDatas: [],
      allEvents: [],
      currentEvents: [],
      currentClass: 1,
      event: {
        title: 'My Event'
      },
      headerToolbar: {
        left: 'prev,next,today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay' // ,timeGridFourDay'
      },
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

      showUnit: [],
      currentUnit: null,

      importVisible: false,
      importType: typeMap.task,
      importModel: {
        startDate: null,
        endDate: null
      },

      currentSession: null
    }
  },
  computed: {
    ...mapState({
      currentSchool: state => state.user.currentSchool,
      classList: state => state.user.classList
    })
  },
  created() {
    this.debounceLoad = debounce(this.loadData, 300)
    this.debounceRefetch = debounce(this.reFetch, 300)
    this.initData()
  },
  mounted() {
    setTimeout(() => {
      this.reRender()
    }, 100)
  },
  methods: {
    initData() {
      this.currentUnit = this.currentUnitList.length > 0 ? this.currentUnitList[0].id : ''
      this.showUnit = this.currentUnitList.map(item => item.id)
      this.convertTimeForYear()
    },
    async loadData(params) {
      const res = await QueryForCalendar(params)
      return res
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
          label: index
        })
        start = start.add(15, 'm')
        index++
      }
      this.timeLabelForYear = timeLabelForYear
    },
    convertDayForYear() {
      // 将最近12天映射成12个月，方便year视图
      const dayLabelForYear = []
      let start = moment(this.startDate)
      const end = moment(this.endDate)
      let index = 0
      while (start.isBefore(end)) {
        dayLabelForYear.push({
          value: start.format('YYYY-MM-DD'),
          label: moment().month(index).format('MMM')
        })
        start = start.add(1, 'd')
        index++
      }
      this.dayLabelForYear = dayLabelForYear
      return dayLabelForYear
    },
    convertYearToTime(time, sameEnd = false) {
      // 如果是年视图，将时间转换成对应的12日视图
      // 2月 -> 2号  2号 -> 00:15
      const month = moment(time).get('month')
      const day = moment(time).get('date')
      // const second = moment(time).seconds()
      const extra = sameEnd ? 1 : 0
      const newDate = this.dayLabelForYear[month].value
      const newTime = this.timeLabelForYear[day - 1 + extra].value
      return newDate + ' ' + newTime + ':00'// + (second > 9 ? second : ('0' + second))
    },
    loadEvents(date, successCb, failCb) {
      let start = moment(date.start).format('YYYY-MM-DD')
      let end = moment(date.end).format('YYYY-MM-DD')
      this.startDate = start
      this.endDate = end
      if (this.$refs.fullCalendar) {
        const calendarApi = this.$refs.fullCalendar.getApi()
        if (calendarApi) {
          calendarApi.removeAllEvents()
        }
      }

      const diff = moment(date.end).diff(moment(date.start), 'days')
      console.log(diff)

      const params = {}
      let noNeedQuery = false
      if (this.queryType === this.CALENDAR_QUERY_TYPE.CLASS.value) {
        params.classIds = this.typeFilters
        noNeedQuery = this.typeFilters.length === 0
      } else if (this.queryType === this.CALENDAR_QUERY_TYPE.WORKSHOP.value) {
        params.workshopStatus = this.typeFilters
        params.workshopType = [1, 2]
        noNeedQuery = this.typeFilters.length === 0
      }
      if (noNeedQuery) {
        successCb([])
      } else {
        this.loading = true
        // 如果diff等于12，表示年视图
        if (diff === 12) {
          start = moment().startOf('year').format('YYYY-MM-DD')
          end = moment().endOf('year').format('YYYY-MM-DD')
        }
        this.loadData({
          ...params,
          startDate: formatLocalUTC(start, 'YYYY-MM-DD'),
          endDate: formatLocalUTC(end, 'YYYY-MM-DD'),
          queryType: this.queryType
        }).then(res => {
          if (res && res.success && res.result) {
            const filterRes = res.result// .filter(item => item.unitPlanInfo)
            this.calendarDatas = res.result
            if (filterRes.length > 0) {
              this.currentUnitList = uniqBy(filterRes.filter(item => item.unitPlanInfo).map(item => item.unitPlanInfo), 'id')
              const events = filterRes.map(item => {
                // 根据classId获取颜色
                let index = -1
                // if (this.queryType === this.CALENDAR_QUERY_TYPE.MY.value) {
                  index = this.currentUnitList.findIndex(unit => unit.id === (item.unitPlanInfo ? item.unitPlanInfo.id : -1))
                // } else if (this.queryType === this.CALENDAR_QUERY_TYPE.CLASS.value) {
                //   index = this.showClassOptions.findIndex(option => option.value === (item.sessionInfo ? item.sessionInfo.taskClassId : -1))
                // } else if (this.queryType === this.CALENDAR_QUERY_TYPE.WORKSHOP.value) {
                //   index = this.showWorkshopOptions.findIndex(option => option.value === (item.workshopsDetailInfo ? item.workshopsDetailInfo.registeredNum : -1))
                // }
                const color = (index === -1) ? '#fff' : BG_COLORS[index]

                let startTime = item.startTime
                let endTime = item.endTime
                let editable = true
                if (diff === 12) {
                  this.convertDayForYear()
                  startTime = this.convertYearToTime(item.startTime)
                  endTime = this.convertYearToTime(item.endTime)
                  if (startTime === endTime) {
                    endTime = this.convertYearToTime(item.endTime, true)
                  }
                  editable = false
                } else {
                  startTime = this.$options.filters['dayjs'](startTime)
                  endTime = this.$options.filters['dayjs'](endTime)
                }
                console.log(startTime, endTime)
                return {
                  id: item.sessionInfo.id,
                  title: item.sessionInfo.sessionName,
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
                    sessionId: item.sessionId,
                    status: item.attendance || 'absent',
                    id: item.sessionInfo.id,
                    backgroundColor: color,
                    start: item.startTime,
                    end: item.endTime
                  }
                }
              })
              this.calendarDatas = res.result
              this.allEvents = events
              const filterEvents = events.filter(event => {
                if (this.queryType === this.CALENDAR_QUERY_TYPE.MY.value) {
                  if (!this.typeFilters.includes('sessionType' + event.extendedProps.sessionType)) {
                    return false
                  }
                }
                return true
              })
              successCb(filterEvents)
            } else {
              successCb([])
              this.currentUnitList = []
            }
            this.handleViewDidMount()
          } else {
            failCb()
          }
        }).catch(() => {
          failCb()
        }).finally(() => {
          this.loading = false
        })
      }
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
    handleViewDidMount() {
      this.$nextTick(() => {
        const nowLine = document.getElementsByClassName('fc-timegrid-now-indicator-line')
        if (nowLine && nowLine.length > 0) {
          // const cloneLine = nowLine[0].cloneNode(true)
          const fcBody = document.getElementsByClassName('fc-timegrid-body')[0]
          fcBody.insertBefore(nowLine[0], fcBody.firstChild)
        }
      })
    },
    handleDateSelect(selectInfo) {
      console.log(selectInfo)
      if (this.addable) {
        this.$refs.tooltip.style.visibility = 'visible'
        this.$refs.tooltip.style.top = selectInfo.jsEvent.clientY + 'px'
        this.$refs.tooltip.style.left = selectInfo.jsEvent.clientX + 'px'
      }
      this.event = selectInfo
      this.importModel.startDate = moment(this.event.start).format('YYYY-MM-DD HH:mm:ss')
      this.importModel.endDate = moment(this.event.end).format('YYYY-MM-DD HH:mm:ss')
      this.$emit('date-select', this.importModel)
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
      this.importVisible = true
    },
    handleAddSession() {
      this.closeTip()
      this.importType = typeMap.task
      this.importVisible = true
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
      console.log(clickInfo)
    },
    handleEvents(events) {
      this.currentEvents = events
      console.log(events)
    },
    handleDatesSet(event) {
      console.log(event)
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
      console.log(this.typeFilters)
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
      console.log(event.event.start, event.event.end)
      const current = event.event
      const extendedProps = current.extendedProps
      const params = {
        sessionStartTime: moment(current.start).utc().format('YYYY-MM-DD HH:mm:ss'),
        deadline: moment(current.end).utc().format('YYYY-MM-DD HH:mm:ss'),
        id: extendedProps.id
      }
      this.handleSave(params, event)
    },
    handleEventResize(event) {
      console.log(event)
      const current = event.event
      const extendedProps = current.extendedProps
      const params = {
        sessionStartTime: moment(current.start).utc().format('YYYY-MM-DD HH:mm:ss'),
        deadline: moment(current.end).utc().format('YYYY-MM-DD HH:mm:ss'),
        id: extendedProps.id
      }
      this.handleSave(params, event)
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
</style>
