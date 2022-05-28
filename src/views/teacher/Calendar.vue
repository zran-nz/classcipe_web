<template>
  <div class='my-content'>
    <!-- <div class="opt">
      <a-button type="primary" @click="showAttendance">{{ attendanceVisible ? 'Close' : 'Show' }} Attendance</a-button>
    </div> -->
    <a-spin :spinning="loading">
      <div class="schedule-content">
        <div class="schedule-tip" v-show="attendanceVisible">
          <a-affix :target="affixTarget">
            <div class="tip-wrap">
              <div class="unit-tip">
                <!-- <div class="tip-title">My Unit Legend</div>
                <a-checkbox-group
                  :options="showUnitOptions"
                  v-model="showUnit"
                  @change="handleChangeEvents"
                  class="tip-check"
                >
                  <div slot="label" class="tip-content" slot-scope="item">
                    <span class="tip-dot" :style="{backgroundColor: BG_COLORS[item.index]}"></span>
                    <span>Unit: {{ item.name }}</span>
                  </div>
                </a-checkbox-group> -->

                <div
                  class="unit-tip-item"
                  :style="{backgroundColor: BG_COLORS[item.index]}"
                  v-for="(item) in showUnitOptions"
                  :key="item.id">
                  <a-tooltip :title="item.name">Unit: {{ item.name }}</a-tooltip>
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
            <div
              class="schedule-event-content"
              :style="{backgroundColor: info.event._def.extendedProps.backgroundColor, color: '#333'}"
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
              const filterRes = res.result.filter(item => item.unitPlanInfo)
              this.calendarDatas = res.result
              if (filterRes.length > 0) {
                this.currentUnitList = uniqBy(filterRes.map(item => item.unitPlanInfo), 'id')
                const events = filterRes.map(item => {
                  // 根据classId获取颜色
                  const index = this.currentUnitList.findIndex(unit => unit.id === item.unitPlanInfo.id)
                  const color = BG_COLORS[index]

                  return {
                    id: item.sessionInfo.id,
                    title: item.sessionInfo.sessionName,
                    start: this.$options.filters['dayjs'](item.startTime),
                    end: this.$options.filters['dayjs'](item.endTime),
                    backgroundColor: 'transparent',
                    borderColor: 'transparent',
                    extendedProps: {
                      classId: item.sessionInfo.classId,
                      unitId: item.unitPlanInfo.id,
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
        }
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
      }
    }
  },
  computed: {
    ...mapState({
      currentSchool: state => state.user.currentSchool
    }),
    showUnitOptions() {
      return this.currentUnitList.map((item, index) => {
        return {
          value: item.id,
          name: item.name,
          index: index
        }
      })
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
      this.$confirm({
        title: 'Confirm remove session',
        content: `Are you sure you want to delete the session '${clickInfo.event.title}'`,
        centered: true,
        onOk: () => {
          this.loading = true
          DeleteClassV2({
            sessionId: clickInfo.event.extendedProps.id
          }).then(res => {
            if (res.code === 0) {
              this.$message.success('Remove successfully')
              clickInfo.event.remove()
            }
          }).finally(() => {
            this.loading = false
          })
        }
      })
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
      const calendarApi = this.$refs.fullCalendar.getApi()
      calendarApi.removeAllEvents()
      this.allEvents.forEach(item => {
        const props = item.extendedProps
        if (this.showUnit.includes(props.unitId)) {
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
      this.handleSave(params)
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
      this.handleSave(params)
    },
    showAttendance() {
      this.attendanceVisible = !this.attendanceVisible
      this.reRender()
    },
    handleSave(params) {
      console.log(params)
      this.loading = true
      EditSessionScheduleV2(params).then(res => {
        if (res.success) {
          this.$message.success('Opt Successfully')
        }
      }).finally(res => {
        this.loading = false
      })
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
</style>
