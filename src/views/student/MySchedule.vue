<template>
  <div>
    <div class="opt">
      <a-button type="primary" @click="showAttendance">{{ attendanceVisible ? 'Close' : 'Show' }} Attendance</a-button>
    </div>
    <div class="schedule-content">
      <FullCalendar
        ref="fullCalendar"
        :options="calendarOptions"
        class="schedule-calendar"
      />
      <div class="schedule-tip" v-show="attendanceVisible">
        <div class="attendance"><!-- :style="{visibility: attendanceVisible ? 'visible' : 'hidden'}"> -->
          <a-select class="attendance-choose" v-model="currentClass" @change="handleChangeClass">
            <a-select-option :value="item.id" v-for="(item, index) in currentStudentClass" :key="'class'+index">
              {{ item.name }}
            </a-select-option>
          </a-select>
          <pie
            :color="ABSENT_COLORS"
            :height="198"
            :dataSource="dataSource"
            :labelConfig="labelConfig"
            :radius="radius"
            :guideData="guideData"/>
        </div>
        <div class="class-tip">
          <div class="tip-title">My Class Legend</div>
          <a-checkbox-group
            :options="showClassOptions"
            v-model="showClass"
            @change="handleChangeEvents"
            class="tip-check"
          >
            <div slot="label" class="tip-content" slot-scope="item">
              <span class="tip-dot" :style="{backgroundColor: BG_COLORS[item.index]}"></span>
              <span>{{ item.name }}</span>
            </div>
          </a-checkbox-group>
          <!-- <div class="tip-content" v-for="(item, index) in currentStudentClass" :key="'classtip'+item.id">
              <span class="tip-dot" :style="{backgroundColor: BG_COLORS[index]}"></span>
              <label>{{ item.name }}</label>
          </div> -->
        </div>
        <div class="class-tip">
          <div class="tip-title">Attendance Status Legend</div>
          <a-checkbox-group
            :options="showStatusOptions"
            v-model="showStatus"
            @change="handleChangeEvents"
            class="tip-check"
          >
            <div slot="label" class="tip-content" slot-scope="item">
              <span class="tip-dot dot-status" :style="{backgroundColor: ABSENT_COLORS[item.index]}"></span>
              <span>{{ item.name }}</span>
            </div>
          </a-checkbox-group>
          <!-- <div class="tip-content" v-for="(item, index) in statusList" :key="'statusTip'+item.id">
            <span class="tip-dot dot-status" :style="{backgroundColor: ABSENT_COLORS[index]}"></span>
            <label>{{ item.name }}</label>
          </div> -->
        </div>
      </div>
    </div>
    <div class="tooltip">
      <div class="tooltip-wrap" ref="tooltip">
        <div class="tooltip-content">
          <h4>{{ event.title }}</h4>
          <div>Class: {{ event.classId }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { tippy } from 'vue-tippy'

import { StudyModeMixin } from '@/mixins/StudyModeMixin'
import { StudentSchoolMixin } from '@/mixins/StudentSchoolMixin'

import '@fullcalendar/core/vdom' // solves problem with Vite
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { createEventId } from './components/event-utils'
import Pie from '@/components/Charts/Pie'

import { getClassSchedule } from '@/api/selfStudy'

import { ABSENT_COLORS, BG_COLORS, TASK_ATTENDANCE } from '@/const/common'

import { mapState, mapGetters } from 'vuex'

import moment from 'moment'

export default {
  name: 'MySchedule',
  mixins: [StudyModeMixin, StudentSchoolMixin],
  components: {
    FullCalendar,
    Pie
  },
  data() {
    return {
      ABSENT_COLORS: ABSENT_COLORS,
      BG_COLORS: BG_COLORS,
      attendanceVisible: true,
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
          getClassSchedule({
            dateStart: start,
            dateEnd: end
          }).then(res => {
            if (res.success && res.result) {
              const events = res.result.map(item => {
                // 根据classId获取颜色
                const index = this.currentStudentClass.findIndex(clasz => clasz.id === item.classId)
                const color = BG_COLORS[index]

                return {
                  id: item.id,
                  title: item.name,
                  start: item.startDate,
                  end: item.endDate,
                  backgroundColor: color,
                  extendedProps: {
                    classId: item.classId,
                    status: item.attendance || 'absent'
                  }
                }
              })
              this.classSchedules = res.result
              this.allEvents = events
              successCb(events)
            } else {
              failCb()
            }
          }).catch(() => {
            failCb()
          })
        },
        editable: false,
        selectable: false,
        selectMirror: false,
        dayMaxEvents: true,
        weekends: true,
        select: this.handleDateSelect,
        // eventClick: this.handleEventClick,
        eventsSet: this.handleEvents,
        datesSet: this.handleDatesSet,
        eventMouseEnter: this.handleMouseEnter,
        eventMouseLeave: this.handleMouseLeave,
        eventTimeFormat: {
          hour: 'numeric',
          minute: '2-digit',
          meridiem: 'short'
        },
        eventContent: (info, h) => {
          const props = info.event._def.extendedProps
          let hTime = null

          if (info.view.type === 'timeGridWeek' || info.view.type === 'timeGridDay') {
            hTime = h('div', {}, [moment(info.event.start).format(this.FORMATTER_SIM), ' - ', moment(info.event.end).format(this.FORMATTER_SIM)])
          } else if (info.view.type === 'dayGridMonth') {
            hTime = h('span', { style: {
              marginRight: 5
            } }, [moment(info.event.start).format(this.FORMATTER_SIM)])
          }

          // 过滤
          // if (!this.showClass.includes(props.classId) || !this.showStatus.includes(props.status)) {
          //   return null
          // }
          const colorIndex = Object.values(TASK_ATTENDANCE).findIndex(item => item === props.status)

          return h('div', {
              class: 'schedule-event-content',
              style: {
                backgroundColor: info.event.backgroundColor,
                color: '#fff'
              }
            }, [
              hTime,
              h('span', {
                class: 'event-content-dot',
                style: {
                  backgroundColor: ABSENT_COLORS[colorIndex]
                }
              }),
              h('label', {}, [info.event.title])
          ])
        }
      },
      currentEvents: [],
      // pie chart
      labelConfig: [],
      radius: {
        radius: 0.85,
        innerRadius: 0.8
      },
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
      showStatusOptions: []
    }
  },
  computed: {
    ...mapState({
      studentCurrentSchool: state => state.user.studentCurrentSchool
    }),
    ...mapGetters(['currentStudentClass']),
    dataSource() {
      const dateStart = this.startDate
      let dateEnd = this.endDate
      if (this.viewType === 'timeGridDay') {
        dateEnd = dateStart
      }
      const currentEvents = this.classSchedules.filter(item => {
        return item.classId === this.currentClass && moment(dateEnd).diff(moment(item.startDate), 'days') >= 0
      })

      console.log(currentEvents)
      const presentCount = currentEvents.filter(item => item.attendance === 'present').length
      return [
        { item: 'Absent', count: currentEvents.length - presentCount, color: ABSENT_COLORS[0] },
        { item: 'Present', count: presentCount, color: ABSENT_COLORS[1] }
      ]
    },
    guideData() {
      const dateStart = this.startDate
      let dateEnd = this.endDate
      if (this.viewType === 'timeGridDay') {
        dateEnd = dateStart
      }
      const currentEvents = this.classSchedules.filter(item => {
        return item.classId === this.currentClass && moment(dateEnd).diff(moment(item.startDate), 'days') >= 0
      })

      console.log(currentEvents)
      const presentCount = currentEvents.filter(item => item.attendance === 'present').length
      return [{
        content: currentEvents.length - presentCount + '/' + currentEvents.length,
        style: {
          fontSize: 16,
          textAlign: 'center'
        },
        position: ['50%', '45%']
      }, {
        content: 'Absent',
         style: {
          fontSize: 14,
          textAlign: 'center'
        },
        position: ['50%', '60%']
      }]
    },
    showClassOptions() {
      return this.currentStudentClass.map((item, index) => {
        return {
          value: item.id,
          name: item.name,
          index: index
        }
      })
    }
  },
  created() {
    this.currentClass = this.currentStudentClass.length > 0 ? this.currentStudentClass[0].id : ''
    this.showClass = this.currentStudentClass.map(item => item.id)
    this.showStatus = Object.values(TASK_ATTENDANCE)
    this.showStatusOptions = Object.keys(TASK_ATTENDANCE).map((key, index) => {
      return {
        value: TASK_ATTENDANCE[key],
        name: key.slice(0, 1).toUpperCase() + key.slice(1).toLowerCase(),
        index: index
      }
    })
  },
  mounted() {
    setTimeout(() => {
      this.reRender()
    }, 100)
  },
  methods: {
    handleSchoolChange(school) {
      // this.triggerSearch()
    },
    handleWeekendsToggle() {
      this.calendarOptions.weekends = !this.calendarOptions.weekends // update a property
    },
    handleDateSelect(selectInfo) {
      const title = prompt('Please enter a new title for your event')
      const calendarApi = selectInfo.view.calendar
      calendarApi.unselect() // clear date selection
      if (title) {
        calendarApi.addEvent({
          id: createEventId(),
          title,
          start: selectInfo.startStr,
          end: selectInfo.endStr,
          allDay: selectInfo.allDay
        })
      }
    },
    handleEventClick(clickInfo) {
      if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
        clickInfo.event.remove()
      }
    },
    handleEvents(events) {
      this.currentEvents = events
      console.log(events)
    },
    handleDatesSet(event) {
      console.log(event)
      this.startDate = moment(event.start).format('YYYY-MM-DD')
      this.endDate = moment(event.end).format('YYYY-MM-DD')
      this.viewType = event.view.type
    },
    handleChangeClass() {
      // this.handleChangeEvents()
    },
    handleChangeEvents() {
      if (this.showClass.length === this.showClassOptions.length && this.showStatus === this.showStatusOptions.length) return
      const calendarApi = this.$refs.fullCalendar.getApi()
      const events = calendarApi.getEvents()
      console.log(this.showStatus)
      if (events.length > 0) {
        events.forEach(event => {
          event.remove()
        })
      }
      this.allEvents.forEach(item => {
        const props = item.extendedProps
        if (this.showClass.includes(props.classId) && this.showStatus.includes(props.status)) {
          calendarApi.addEvent(item)
        }
      })
      // this.reRender()
    },
    handleMouseEnter(info) {
      const props = info.event._def.extendedProps
      this.event = {
        ...props,
        title: info.event.title,
        backgroundColor: info.event.backgroundColor
      }
      const curClass = this.currentStudentClass.find(item => item.id === this.event.classId)
      // const $tooltip = this.$refs.tooltip.getBoundingClientRect()
      // const $el = info.el.getBoundingClientRect()
      // this.$refs.tooltip.style.top = $el.top + 'px'
      // this.$refs.tooltip.style.left = $el.left - $tooltip.width - 10 + 'px'
      // this.$refs.tooltip.style.visibility = 'visible'
      // if (this.timer) clearTimeout(this.timer)
      const _html = `<div sytle="width: 200px;">
                      <div style="border-bottom: 1px solid #ccc;line-height: 30px;">
                        ${this.event.title}
                      </div>
                      <div class="tippy-self-content">
                        <p>Class: ${curClass.name}</p>
                        <p>Start: ${moment(info.event.start).format(this.FORMATTER_FULL)}</p>
                        <p>End: ${moment(info.event.end).format(this.FORMATTER_FULL)}</p>
                      </div>
                    </div>`
      tippy(info.el, {
        content: _html,
        animation: 'scale',
        theme: 'light',
        interactive: true,
        arrow: true,
        allowHTML: true
      })
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
        const calendarApi = this.$refs.fullCalendar.getApi()
        calendarApi.render()
      })
    }
  }
}
</script>
<style lang='less'>
.tippy-self-content {
  margin-top: 10px;
  text-align: left;
  p {
    margin-bottom: 5px;
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
    transition: all .5s;
    border: 1px solid #dfdf;
    .tooltip-content {
      padding: 10px;
    }
  }
}
.schedule-content {
  position: relative;
  display: flex;
  .schedule-calendar {
    flex: 1;
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
</style>
