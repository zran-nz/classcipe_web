<template>
  <FullCalendar
    ref="fullCalendar"
    :options="calendarOptions"
    class="schedule-calendar"
  >
    <template v-slot:eventContent="info">
      <slot name="eventContent" :info="info">{{ info.event.title }}</slot>
    </template>
  </FullCalendar>
</template>

<script>
import '@fullcalendar/core/vdom' // solves problem with Vite
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import moment from 'moment'

export default {
  name: 'CcCalendar',
  props: {
    eventsApi: {
      type: Function,
      default: (date, successCb, failCb) => successCb([]),
      required: true
    },
    slotDuration: {
      type: String,
      default: '00:15:00'
    },
    slotMinTime: {
      type: String,
      default: '00:00:00'
    },
    slotMaxTime: {
      type: String,
      default: '24:00:00'
    },
    scrollTime: {
      type: String,
      default: '06:00:00'
    },
    slotLabelInterval: {
      type: String,
      default: '01:00'
    },
    editable: {
      type: Boolean,
      default: true
    },
    selectable: {
      type: Boolean,
      default: true
    },
    headerToolbar: {
      type: [Object, Boolean],
      default: () => ({
        left: 'prev,next,today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay' // ,timeGridFourDay'
      })
    },
    selfViews: {
      type: Object,
      default: () => {}
    },
    initView: {
      type: String,
      default: 'timeGridWeek'
    },
    selectAllow: {
      type: Function,
      default: () => true
    },
    dayHeaderContent: {
      type: Function,
      default: (info) => info.text
    },
    validRange: {
      type: Function,
      default: () => {}
    }

  },
  components: {
    FullCalendar
  },
  data() {
    return {
      loading: false,
      // fullcalendar
      calendarOptions: {
        plugins: [ dayGridPlugin, interactionPlugin, timeGridPlugin ],
        initialView: this.initView,
        headerToolbar: this.headerToolbar,
        views: this.selfViews,
        events: this.eventsApi,
        slotEventOverlap: true,
        editable: this.editable,
        selectable: this.selectable,
        allDaySlot: false,
        selectMirror: true,
        dayMaxEvents: true,
        nowIndicator: true,
        weekends: true,
        lazyFetching: false,
        slotMinTime: this.slotMinTime,
        slotMaxTime: this.slotMaxTime,
        scrollTime: this.scrollTime,
        slotDuration: this.slotDuration,
        slotLabelInterval: this.slotLabelInterval,
        select: this.handleDateSelect,
        eventClick: this.handleEventClick,
        eventsSet: this.handleEvents,
        datesSet: this.handleDatesSet,
        eventMouseEnter: this.handleMouseEnter,
        eventMouseLeave: this.handleMouseLeave,
        eventDrop: this.handleEventDrop,
        eventResize: this.handleEventResize,
        dayHeaderContent: this.dayHeaderContent,
        eventTimeFormat: {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          meridiem: false
        },
        slotLabelFormat: function(date) {
          return moment(date.date).format('HH:mm')
        },
        viewDidMount: this.handleViewDidMount,
        selectAllow: this.selectAllow,
        validRange: this.validRange
      }
    }
  },
  mounted() {
    setTimeout(() => {
      this.reRender()
    }, 100)
  },
  methods: {
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
    getApi() {
      return this.$refs.fullCalendar ? this.$refs.fullCalendar.getApi() : null
    },
    handleDateSelect(selectInfo) {
      this.$emit('select', selectInfo)
    },
    handleEventClick(clickInfo) {
      this.$emit('eventClick', clickInfo)
    },
    handleEvents(events) {
      this.$emit('eventsSet', events)
    },
    handleDatesSet(event) {
      this.$emit('datesSet', event)
    },
    handleMouseEnter(info) {
      this.$emit('eventMouseEnter', info)
    },
    handleMouseLeave(event) {
      this.$emit('eventMouseLeave', event)
    },
    handleEventDrop(event) {
      this.$emit('eventDrop', event)
    },
    handleEventResize(event) {
      this.$emit('eventResize', event)
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

<style scoped lang="less">
.schedule-calendar {
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
  /deep/ .fc-highlight {
    background: #3788d8;
  }
}
</style>
