<template>
  <div class='my-content'>
    <!-- <div class="opt">
      <a-button type="primary" @click="showAttendance">{{ attendanceVisible ? 'Close' : 'Show' }} Attendance</a-button>
    </div> -->
    <a-spin :spinning="loading">
      <div id="scheduleContent" class="schedule-content" ref="scheduleContent">
        <div class="schedule-tip" v-show="attendanceVisible">
          <a-affix :target="affixTarget">
            <div class="tip-wrap">
              <div class="unit-tip">

                <template v-if="queryType === CALENDAR_QUERY_TYPE.MY.value">
                  <div
                    class="unit-tip-item"
                    :style="{backgroundColor: BG_COLORS[item.index]}"
                    v-for="(item) in showUnitOptions"
                    :key="item.id">
                    <a-tooltip :title="item.name">Unit: {{ item.name }}</a-tooltip>
                  </div>
                </template>

                <template v-if="queryType === CALENDAR_QUERY_TYPE.CLASS.value">
                  <div
                    class="unit-tip-item"
                    :style="{backgroundColor: BG_COLORS[item.index]}"
                    v-for="(item) in showClassOptions"
                    :key="item.id">
                    <a-tooltip :title="item.name">Class: {{ item.name }}</a-tooltip>
                  </div>
                </template>

              </div>
              <div class="calendar-type" v-show="true">
                <div class="calendar-type-item" v-for="type in CALENDAR_QUERY_TYPE" :key="type.value">
                  <div class="type-item-title">
                    <a-radio :checked="queryType === type.value" @change="handleChangeType(type)">
                      {{ type.label }}
                    </a-radio>
                  </div>
                  <div class="type-item-desc" v-if="getOptions(type.label).length > 0">
                    <a-checkbox-group
                      :options="getOptions(type.label)"
                      v-model="typeFilters"
                      @change="val => handleChangeFilters(val, type.value)"
                      class="type-check"
                    >
                      <div slot="label" class="type-content" slot-scope="item">
                        <span>{{ item.name }}</span>
                      </div>
                    </a-checkbox-group>
                  </div>
                </div>
              </div>
            </div>
          </a-affix>
        </div>
        <FullCalendar
          ref="fullCalendar"
          :options="calendarOptions"
          class="schedule-calendar"
        >
          <template v-slot:eventContent="info">
            <a-popover
              title="Session Detail"
              trigger="click"
              :destroyTooltipOnHide="true"
              :getPopupContainer="trigger => getPopupContainer(trigger, info)"
              @visibleChange="visible => showPopover(visible, info)"
            >
              <a slot="content" >
                <content-item-calendar
                  v-if="queryType !== CALENDAR_QUERY_TYPE.WORKSHOP.value"
                  ref="contentItemCalendar"
                  :content='getSession(info)'
                  :units='currentUnitList'
                  @close="closeAllModal"
                  @delete='(data) => handleDelete(info, data)'
                  @change-unit="(params) => handleSave(params, info)"
                  @save-response-limit="params => handleSave(params, info)"
                >
                </content-item-calendar>
                <div v-else style="font-size: 60px">
                  <liveworkshop-item :content="getWorkshopItem(info)"/>
                </div>
              </a>
              <div
                class="schedule-event-content"
                :style="{backgroundColor: info.event.extendedProps.backgroundColor, color: '#333'}"
              >
                <div v-show="info.view.type === 'timeGridWeek' || info.view.type === 'timeGridDay'">
                  {{ info.event.start | dayjs(FORMATTER_SIM) }}-{{ info.event.end | dayjs(FORMATTER_SIM) }}
                </div>
                <span v-show="info.view.type === 'dayGridMonth'" style="margin-right: 5px;">
                  {{ info.event.start | dayjs(FORMATTER_SIM) }}
                </span>
                <!-- <a-tooltip>
                <template slot="title">
                  {{ info.event.title }}
                </template> -->
                <label for="">{{ info.event.title }} </label>
              <!-- </a-tooltip> -->
              </div>
            </a-popover>
          </template>
        </FullCalendar>
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

import '@fullcalendar/core/vdom' // solves problem with Vite
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import SessionImportForCalendar from '@/components/MyContentV2/SessionImportForCalendar'
import ContentItemCalendar from '@/components/MyContentV2/ContentItemCalendar'
import LiveworkshopItem from '@/components/MyContentV2/LiveWorkShopContentItem'

import { QueryForCalendar } from '@/api/v2/calendarSchedule'
import { DeleteClassV2, EditSessionScheduleV2 } from '@/api/v2/classes'

import { ABSENT_COLORS, BG_COLORS, CALENDAR_QUERY_TYPE } from '@/const/common'
import { typeMap } from '@/const/teacher'

import { mapState } from 'vuex'

import moment from 'moment'
import { uniqBy } from 'lodash-es'

export default {
  name: 'Calendar',
  mixins: [UserModeMixin, CurrentSchoolMixin],
  components: {
    FullCalendar,
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
      queryType: CALENDAR_QUERY_TYPE.MY.value,
      [CALENDAR_QUERY_TYPE.WORKSHOP.label]: [],
      typeFilters: [], // 根据类型的筛选条件
      queryClassId: null,
      currentUnitList: [],
      attendanceVisible: true,
      loading: false,
      startDate: '',
      endDate: '',
      viewType: 'timeGridWeek',
      calendarDatas: [],
      allEvents: [],
      // fullcalendar
      calendarOptions: {
        plugins: [ dayGridPlugin, interactionPlugin, timeGridPlugin ],
        initialView: 'timeGridWeek',
        headerToolbar: {
          left: 'prev,next,today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay' // ,timeGridFourDay'
        },
        // views: {
        //   timeGridFourDay: {
        //     type: 'timeGrid',
        //     duration: { days: 12 },
        //     buttonText: 'year'
        //   }
        // },
        // initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
        events: (date, successCb, failCb) => {
          const start = moment(date.start).format('YYYY-MM-DD')
          const end = moment(date.end).format('YYYY-MM-DD')
          this.loading = true
          if (this.$refs.fullCalendar) {
            const calendarApi = this.$refs.fullCalendar.getApi()
            calendarApi && calendarApi.removeAllEvents()
          }
          QueryForCalendar({
            startDate: start,
            endDate: end,
            queryType: this.queryType,
            classId: this.queryClassId
          }).then(res => {
            if (res.success && res.result) {
              const filterRes = res.result// .filter(item => item.unitPlanInfo)
              this.calendarDatas = res.result
              if (filterRes.length > 0) {
                this.currentUnitList = uniqBy(filterRes.filter(item => item.unitPlanInfo).map(item => item.unitPlanInfo), 'id')
                const events = filterRes.map(item => {
                  // 根据classId获取颜色
                  const index = this.currentUnitList.findIndex(unit => unit.id === (item.unitPlanInfo ? item.unitPlanInfo.id : -1))
                  const color = (index === -1) ? '#fff' : BG_COLORS[index]

                  return {
                    id: item.sessionInfo.id,
                    title: item.sessionInfo.sessionName,
                    start: this.$options.filters['dayjs'](item.startTime),
                    end: this.$options.filters['dayjs'](item.endTime),
                    backgroundColor: 'transparent',
                    borderColor: 'transparent',
                    extendedProps: {
                      classId: item.sessionInfo.classId,
                      planId: item.sessionInfo.planId,
                      contentId: item.sessionInfo.contentId,
                      status: item.attendance || 'absent',
                      id: item.sessionInfo.id,
                      backgroundColor: color
                    }
                  }
                })
                this.calendarDatas = res.result
                this.allEvents = events
                const filterEvents = events.filter(event => {
                  // const props = event.extendedProps
                  return true
                })
                successCb(filterEvents)
              } else {
                successCb([])
              }
            } else {
              failCb()
            }
          }).catch(() => {
            failCb()
          }).finally(() => {
            this.loading = false
          })
        },
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        nowIndicator: true,
        weekends: true,
        slotDuration: '00:15:00',
        slotLabelInterval: '01:00',
        select: this.handleDateSelect,
        eventClick: this.handleEventClick,
        eventsSet: this.handleEvents,
        datesSet: this.handleDatesSet,
        eventMouseEnter: this.handleMouseEnter,
        eventMouseLeave: this.handleMouseLeave,
        eventDrop: this.handleEventDrop,
        eventResize: this.handleEventResize,
        eventTimeFormat: {
          hour: 'numeric',
          minute: '2-digit',
          meridiem: 'short'
        },
        viewDidMount: this.handleViewDieMount
      },
      currentEvents: [],
      currentClass: 1,
      event: {
        title: 'My Event'
      },
      timer: null,
      FORMATTER: 'h:mm a',
      FORMATTER_SIM: 'h:mma',
      FORMATTER_FULL: 'YYYY-MM-DD h:mm a',

      showUnit: [],
      currentUnit: null,

      importVisible: false,
      importType: typeMap.task,
      importModel: {
        startDate: null,
        endDate: null
      },

      currentSession: null,
      popoverVisible: false
    }
  },
  computed: {
    ...mapState({
      currentSchool: state => state.user.currentSchool,
      classList: state => state.user.classList
    }),
    [CALENDAR_QUERY_TYPE.CLASS.label]() {
      return this.classList.map((item, index) => (
        {
          value: item.id,
          name: item.name,
          index: index
        }
      ))
    },
    showUnitOptions() {
      return this.currentUnitList.map((item, index) => {
        return {
          value: item.id,
          name: item.name,
          index: index
        }
      })
    },
    showClassOptions() {
      return this.classList.map((item, index) => (
        {
          value: item.id,
          name: item.name,
          index: index
        }
      ))
    }
  },
  created() {
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
    },
    getOptions(typeLabel) {
      return this[typeLabel] ? this[typeLabel] : []
    },
    affixTarget() {
      return document.getElementById('app')
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
    handleViewDieMount() {
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
      this.$refs.tooltip.style.visibility = 'visible'
      this.$refs.tooltip.style.top = selectInfo.jsEvent.clientY + 'px'
      this.$refs.tooltip.style.left = selectInfo.jsEvent.clientX + 'px'
      this.event = selectInfo
      this.importModel.startDate = moment(this.event.start).format('YYYY-MM-DD HH:mm:ss')
      this.importModel.endDate = moment(this.event.end).format('YYYY-MM-DD HH:mm:ss')
      // const title = prompt('Please enter a new title for your event')
      // const calendarApi = selectInfo.view.calendar
      // calendarApi.unselect() // clear date selection
      // if (title) {
      //   calendarApi.addEvent({
      //     id: new Date().getTime(),
      //     title,
      //     start: selectInfo.startStr,
      //     end: selectInfo.endStr,
      //     allDay: selectInfo.allDay
      //   })
      // }
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
      this.startDate = moment(event.start).format('YYYY-MM-DD')
      this.endDate = moment(event.end).format('YYYY-MM-DD')
      this.viewType = event.view.type
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
    // handleMouseLeave(event) {
    //   if (this.timer) clearTimeout(this.timer)
    //   this.timer = setTimeout(() => {
    //     this.$refs.tooltip.style.visibility = 'hidden'
    //   }, 200)
    // },
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
    showAttendance() {
      this.attendanceVisible = !this.attendanceVisible
      this.reRender()
    },
    getPopupContainer(trigger, info) {
      // return trigger => trigger.parentElement
      return document.body
    },
    showPopover(visible, clickInfo) {
      // if (visible) {
      //   const currentSession = this.calendarDatas.find(item => item.sessionInfo.id === clickInfo.event.extendedProps.id)
      //   // 拼接详情
      //   if (currentSession) {
      //     this.currentSession = { ...currentSession.sessionInfo }
      //   } else {
      //     this.currentSession = null
      //   }
      //   console.log(this.currentSession)
      // }
    },
    handleChangeType(type) {
      this.queryType = type.value
      console.log(this[type.label])
      this.typeFilters = this[type.label] ? this[type.label].map(item => item.value) : []
      this.reFetch()
    },
    handleChangeFilters(filter, val) {
      if (this.queryType !== val) {
        this.queryType = val
        this.reFetch()
      }
    },
    getSession(clickInfo) {
      const currentSession = this.calendarDatas.find(item => item.sessionInfo.id === clickInfo.event.extendedProps.id)
      return currentSession ? { ...currentSession } : null
    },
    getWorkshopItem(clickInfo) {
      const currentSession = this.calendarDatas.find(item => item.sessionInfo.id === clickInfo.event.extendedProps.id)
      return {
        content: { ...currentSession.content },
        sessionInfo: { ...currentSession.sessionInfo },
        ...currentSession.workshopsDetailInfo
      }
    },
    handleDelete(clickInfo) {
      // this.$confirm({
      //   title: 'Confirm remove session',
      //   content: `Are you sure you want to delete the session '${clickInfo.event.title}'`,
      //   centered: true,
      //   onOk: () => {
          this.loading = true
          DeleteClassV2({
            sessionId: clickInfo.event.extendedProps.id
          }).then(res => {
            if (res.code === 0) {
              this.$message.success('Remove successfully')
              this.reFetch() // 需要重新生成units，还是重新fetch的好
              // clickInfo.event.remove()
            }
          }).finally(() => {
            this.loading = false
          })
      //   }
      // })
    },
    handleSave(params, info) {
      console.log(params)
      this.loading = true
      EditSessionScheduleV2(params).then(res => {
        if (res.success) {
          this.$message.success('Opt Successfully')
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
          // this.reFetch()
        }
      }).finally(res => {
        this.loading = false
      })
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
@import "~@/components/index.less";

.my-content {
  padding: 15px;
  background: #fff;
  height: 100%;
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
  .schedule-calendar {
    flex: 1;
    /deep/ .fc-view-harness {
      background: #fff;
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
      margin-bottom: 50px;
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
        height: 30px;
        line-height: 30px;
        padding: 0 5px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
.import-content {
  margin-top: 20px;
}
.calendar-type {
  .calendar-type-item {
    margin-bottom: 20px;
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
