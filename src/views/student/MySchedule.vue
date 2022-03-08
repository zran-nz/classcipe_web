<template>
  <div>
    <div class="opt">
      <a-button type="primary" @click="showAttendance">{{ attendanceVisible ? 'Close' : 'Show' }} Attendance</a-button>
    </div>
    <FullCalendar
      :options="calendarOptions"
    />
    <div class="attendance" :style="{visibility: attendanceVisible ? 'visible' : 'hidden'}">
      <a-select class="attendance-choose" :value="currentClass" @change="handleChangeClass">
        <a-select-option :value="1">
          Class1
        </a-select-option>
      </a-select>
      <pie :height="198" :dataSource="dataSource" :labelConfig="labelConfig" :radius="radius" :guideData="guideData"/>
    </div>
    <div class="tooltip">
      <div class="tooltip-wrap" ref="tooltip">
        <div class="tooltip-content">
          <h4>{{ event.title }}</h4>
          <div>test</div>
          <div>test</div>
          <div>tset</div>
          <div>atsgfsdafsdf</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { StudyModeMixin } from '@/mixins/StudyModeMixin'

import '@fullcalendar/core/vdom' // solves problem with Vite
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { INITIAL_EVENTS, createEventId } from './components/event-utils'
import Pie from '@/components/Charts/Pie'

export default {
  name: 'MySchedule',
  mixins: [StudyModeMixin],
  components: {
    FullCalendar,
    Pie
  },
  data() {
    return {
      attendanceVisible: true,
      calendarOptions: {
        plugins: [ dayGridPlugin, interactionPlugin, timeGridPlugin ],
        initialView: 'timeGridWeek',
        headerToolbar: {
          left: 'prev,next,today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
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
        eventMouseLeave: this.handleMouseLeave
      },
      currentEvents: [],
      labelConfig: [],
      guideData: [{
        content: '40/61',
        style: {
          fontSize: 16,
          textAlign: 'center'
        },
        position: ['50%', '45%']
      }, {
        content: 'Present',
         style: {
          fontSize: 14,
          textAlign: 'center'
        },
        position: ['50%', '60%']
      }],
      radius: {
        radius: 0.85,
        innerRadius: 0.8
      },
      currentClass: 1,
      event: {
        title: 'teset'
      },
      timer: null
    }
  },
  computed: {
    dataSource() {
      return [
          { item: 'Present', count: 40 },
          { item: 'Absent', count: 21 }
        ]
    }
  },
  methods: {
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
    },
    handleChangeClass() {

    },
    handleMouseEnter(event) {
      console.log(event.view.getCurrentData())
      const $tooltip = this.$refs.tooltip.getBoundingClientRect()
      const $el = event.el.getBoundingClientRect()
      this.$refs.tooltip.style.top = $el.top + 'px'
      this.$refs.tooltip.style.left = $el.left - $tooltip.width - 10 + 'px'
      this.$refs.tooltip.style.visibility = 'visible'
      if (this.timer) clearTimeout(this.timer)
    },
    handleMouseLeave(event) {
      if (this.timer) clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.$refs.tooltip.style.visibility = 'hidden'
      }, 200)
    },
    showAttendance() {
      this.attendanceVisible = !this.attendanceVisible
    }
  }
}
</script>

<style lang='less' scoped>
.opt {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.attendance {
  position: fixed;
  left: 58px;
  bottom: 20px;
  z-index: 101;
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
</style>
