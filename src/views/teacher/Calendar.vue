<template>
  <div class='my-content'>
    <a-spin :spinning="loading">
      <div class="schedule-content">
        <FullCalendar
          ref="fullCalendar"
          :options="calendarOptions"
          class="schedule-calendar"
        >
          <template v-slot:eventContent="info">
            <div
              class="schedule-event-content"
              :style="{backgroundColor: info.event._def.extendedProps.backgroundColor, color: '#fff'}"
            >
              <div v-show="info.view.type === 'timeGridWeek' || info.view.type === 'timeGridDay'">
                {{ info.event.start }} - {{ info.event.end }}
              </div>
              <span v-show="info.view.type === 'dayGridMonth'" style="margin-right: 5px;">
                {{ info.event.start }}
              </span>
              <span
                class="event-content-dot"
                :style="{backgroundColor: ABSENT_COLORS[getColorIndex(info.event._def.extendedProps.status)]}"
              >
              </span>
              <a-tooltip>
                <template slot="title">
                  {{ info.event.title }}
                </template>
                <label for="">{{ info.event.title }} </label>
              </a-tooltip>
            </div>
          </template>
        </FullCalendar>
      </div>
    </a-spin>
    <div class="tooltip" v-clickOutside="closeTip">
      <div class="tooltip-wrap" ref="tooltip">
        <div class="tooltip-content">
          <div class="content-item" @click="handleAddUnit"><span>Add Unit</span></div>
          <div class="content-item" @click="handleAddSession"><span>Add Session</span></div>
        </div>
      </div>
    </div>
    <a-modal
      v-model='importVisible'
      :closable='true'
      :footer='null'
      :maskClosable='true'
      destroyOnClose
      width='80%'
      @cancel='handleCloseImport'>
      <session-import-for-calendar
        :type="importType"
        :init="importModel"
        @cancel="handleCloseImport"
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

import { QueryForCalendar } from '@/api/v2/calendarSchedule'

import { ABSENT_COLORS, BG_COLORS, TASK_ATTENDANCE, CALENDAR_QUERY_TYPE } from '@/const/common'
import { typeMap } from '@/const/teacher'

import { mapState } from 'vuex'

import moment from 'moment'

export default {
  name: 'Calendar',
  mixins: [UserModeMixin, CurrentSchoolMixin],
  components: {
    FullCalendar,
    SessionImportForCalendar
  },
  data() {
    return {
      ABSENT_COLORS: ABSENT_COLORS,
      BG_COLORS: BG_COLORS,
      CALENDAR_QUERY_TYPE: CALENDAR_QUERY_TYPE,
      typeMap: typeMap,
      queryType: CALENDAR_QUERY_TYPE.MY.value,
      queryClassId: null,
      currentClassList: [{
        id: '1'
      }],
      attendanceVisible: false,
      loading: false,
      startDate: '',
      endDate: '',
      viewType: 'dayGridMonth',
      classSchedules: [],
      allEvents: [],
      // fullcalendar
      calendarOptions: {
        plugins: [ dayGridPlugin, interactionPlugin, timeGridPlugin ],
        initialView: 'dayGridMonth',
        headerToolbar: {
          left: 'prev,next,today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
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
              const events = res.result.map(item => {
                // 根据classId获取颜色
                const index = Math.floor(Math.random() * 10) // this.currentClassList.findIndex(clasz => clasz.id === item.classId)
                const color = BG_COLORS[index]

                return {
                  id: item.sessionInfo.id,
                  title: item.sessionInfo.sessionName,
                  start: this.$options.filters['dayjs'](item.startTime, this.FORMATTER_SIM),
                  end: this.$options.filters['dayjs'](item.endTime, this.FORMATTER_SIM),
                  // backgroundColor: 'transparent',
                  // borderColor: 'transparent',
                  extendedProps: {
                    classId: item.sessionInfo.classId,
                    status: item.attendance || 'absent',
                    backgroundColor: color
                  }
                }
              })
              this.classSchedules = res.result
              this.allEvents = events
              const filterEvents = events.filter(event => {
                // const props = event.extendedProps
                return true
              })
              successCb(filterEvents)
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
        weekends: true,
        slotDuration: '00:15:00',
        slotLabelInterval: '01:00',
        select: this.handleDateSelect,
        eventClick: this.handleEventClick,
        eventsSet: this.handleEvents,
        datesSet: this.handleDatesSet,
        eventMouseEnter: this.handleMouseEnter,
        eventMouseLeave: this.handleMouseLeave,
        eventTimeFormat: {
          hour: 'numeric',
          minute: '2-digit',
          meridiem: 'short'
        }
      },
      currentEvents: [],
      // pie chart
      labelConfig: [],
      // radius: {
      //   radius: 0.85,
      //   innerRadius: 0.8
      // },
      radius: ['60%', '80%'],
      currentClass: 1,
      event: {
        title: 'My Event'
      },
      timer: null,
      FORMATTER: 'h:mm a',
      FORMATTER_SIM: 'h:mma',
      FORMATTER_FULL: 'YYYY-MM-DD h:mm a',

      showClass: [],
      showStatus: [],
      showStatusOptions: [],

      importVisible: false,
      importType: typeMap.task,
      importModel: {
        startDate: null,
        endDate: null
      }
    }
  },
  computed: {
    ...mapState({
      currentSchool: state => state.user.currentSchool
    }),
    showClassOptions() {
      return this.currentClassList.map((item, index) => {
        return {
          value: item.id,
          name: item.name,
          index: index
        }
      })
    },
    importTitle() {
      let title = 'Select Task content'
      switch (this.importType) {
        case typeMap.task:
          title = 'Select Task content'
          break
        case typeMap['unit-plan']:
          title = 'Select Unit content'
          break
        default:
          break
      }
      return title
    },
    ScheduleStepsFilter() {
      return this.ScheduleSteps.filter(item => !item.filter || item.filter === this.importType)
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
      this.currentClass = this.currentClassList.length > 0 ? this.currentClassList[0].id : ''
      this.showClass = this.currentClassList.map(item => item.id)
      this.showStatus = Object.values(TASK_ATTENDANCE)
      this.showStatusOptions = Object.keys(TASK_ATTENDANCE).map((key, index) => {
        return {
          value: TASK_ATTENDANCE[key],
          name: key.slice(0, 1).toUpperCase() + key.slice(1).toLowerCase(),
          index: index
        }
      })
    },
    handleSchoolChange(school) {
      // this.triggerSearch()
      this.initData()
      setTimeout(() => {
        this.reFetch()
      }, 100)
    },
    handleWeekendsToggle() {
      this.calendarOptions.weekends = !this.calendarOptions.weekends // update a property
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
    handleCloseImport() {
      this.importVisible = false
    },
    handleEventClick(clickInfo) {
      console.log(clickInfo)
      if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
        clickInfo.event.remove()
      }
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
    // handleMouseLeave(event) {
    //   if (this.timer) clearTimeout(this.timer)
    //   this.timer = setTimeout(() => {
    //     this.$refs.tooltip.style.visibility = 'hidden'
    //   }, 200)
    // },
    showAttendance() {
      this.attendanceVisible = !this.attendanceVisible
      this.reRender()
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
    },
    getCurrentEvents() {
      const dateStart = this.startDate
      let dateEnd = this.endDate
      if (this.viewType === 'timeGridDay') {
        dateEnd = dateStart
      }
      const currentEvents = this.classSchedules.filter(item => {
        return item.classId === this.currentClass && moment(dateEnd).diff(moment(item.startDate), 'days') >= 0
      })

      return currentEvents
    },
    getColorIndex(status) {
      return Object.values(TASK_ATTENDANCE).findIndex(item => item === status)
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
.attendance {
  // position: fixed;
  // left: 58px;
  // bottom: 20px;
  // z-index: 101;
  width: 200px;
  border: 1px solid #dfdfdf;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  flex-direction: column;
  align-items: center;
  background: #fff;
  .attendance-choose {
    width: 150px;
    margin: 10px 25px;
  }
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
    width: 200px;
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    .class-tip {
      margin-top: 20px;
      display: flex;
      flex-direction: column;
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
    }
  }
}
.import-content {
  margin-top: 20px;
}
</style>
