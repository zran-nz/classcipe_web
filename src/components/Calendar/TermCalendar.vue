<template>
  <div style="width: 100%">
    <a-spin :spinning="loading">
      <div id="scheduleContent" class="schedule-content" ref="scheduleContent">
        <cc-calendar
          ref="fullCalendar"
          :eventsApi="loadEvents"
          :headerToolbar="headerToolbar"
          :selfViews="selfViews"
          :initView="initView"
          :editable="true"
          :selectable="true"
          :dayHeaderContent="dayHeaderContent"
          @select="handleDateSelect"
          @eventClick="handleEventClick"
          @eventsSet="handleEvents"
          @datesSet="handleDatesSet"
          @eventMouseEnter="handleMouseEnter"
          @eventMouseLeave="handleMouseLeave"
          class="schedule-calendar"
        >
          <template v-slot:eventContent="{ info }">
            <div
              class="schedule-event-content"
              :data-id="info.event.extendedProps.val"
              :style="{backgroundColor: info.event.extendedProps.backgroundColor, color: '#333', minHeight: '20px', lineHeight: 1}"
            >
              <div>
                {{ moment(info.event.start).format(FORMATTER_SIM) }}-{{ moment(info.event.end).format(FORMATTER_SIM) }}
              </div>
            </div>
          </template>
        </cc-calendar>
      </div>
    </a-spin>
  </div>
</template>

<script>

import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'

import CcCalendar from '@/components/Calendar'

import { termList } from '@/api/academicTermInfo'

import { BG_COLORS } from '@/const/common'

import { mapState } from 'vuex'

import moment from 'moment'
import { debounce } from 'lodash-es'

export default {
  name: 'TermCalendar',
  mixins: [UserModeMixin, CurrentSchoolMixin],
  props: {
    termId: {
      type: String,
      default: ''
    },
    choose: {
      type: String,
      default: ''
    },
    isNowLineVisible: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    termId(val) {
      this.id = val
      this.debounceRefetch()
    }
  },
  components: {
    CcCalendar
  },
  data() {
    return {
      BG_COLORS: BG_COLORS,
      moment: moment,
      FORMATTER_SIM: 'h:mma',
      id: this.termId,
      loading: false,
      startDate: '',
      endDate: '',
      minDate: '06:00:00',
      viewType: 'timeGridWeek',
      initView: 'timeGridWeek',
      calendarDatas: [],
      allEvents: [],
      currentEvents: [],
      blockEvents: [],
      event: {
        title: 'My Event'
      },
      headerToolbar: {
        left: '',
        center: '',
        right: '' // ,timeGridFourDay'
      },
      dayHeaderContent: (info) => {
        const week = moment(info.date).format('dddd')
        return week
      },
      selfViews: {
        timeGridFourDay: {
          type: 'timeGrid',
          dayCount: 4,
          duration: { days: 4 },
          buttonText: '4 Days',
          allDaySlot: false,
          selectable: false,
          editable: false,
          nowIndicator: false
        }
      }
    }
  },
  computed: {
    ...mapState({
      currentSchool: state => state.user.currentSchool
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

    },
    async loadData(params) {
      const res = await termList(params)
      return res
    },
    loadEvents(date, successCb, failCb) {
      const start = moment(date.start).format('YYYY-MM-DD')
      const end = moment(date.end).format('YYYY-MM-DD')
      this.startDate = start
      this.endDate = end
      if (this.$refs.fullCalendar) {
        const calendarApi = this.$refs.fullCalendar.getApi()
        if (calendarApi) {
          calendarApi.removeAllEvents()
        }
      }
      this.loading = true
      this.loadData({
        termId: this.id,
        schoolId: this.currentSchool.id
      }).then(res => {
        if (res && res.success && res.result) {
          let filterRes = {
            blockSettings: []
          }
          res.result.forEach(year => {
            if (year.terms && year.terms.length > 0) {
              const find = year.terms.find(term => term.id === this.id)
              if (find) {
                filterRes = find.block
              }
            }
          })
          this.calendarDatas = res.result
          if (filterRes && filterRes.blockSettings && filterRes.blockSettings.length > 0) {
            // 获取最小的时间
            let minDate = 0
            let minDateLabel = this.minDate
            filterRes.blockSettings.forEach((item, index) => {
              const current = parseInt(item.start.replace(':', ''))
              if (current < minDate || index === 0) {
                minDate = current
                minDateLabel = item.start
              }
            })
            this.minDate = moment('2000-01-01 ' + minDateLabel + ':00').format('HH:mm')
            // 给每天都设置block
            let events = []
            let current = moment(date.start).subtract(1, 'day')
            while (moment(date.end).isAfter(current)) {
              events = events.concat(filterRes.blockSettings.map((item, index) => ({
                start: moment(current).format('YYYY-MM-DD') + ' ' + item.start + ':00',
                end: moment(current).format('YYYY-MM-DD') + ' ' + item.end + ':00',
                name: item.name,
                color: BG_COLORS[index],
                // backgroundColor: 'transparent',
                // borderColor: 'transparent',
                display: 'background',
                backgroundColor: BG_COLORS[index],
                editable: false,
                extendedProps: {
                  backgroundColor: BG_COLORS[index],
                  val: item.start + ' - ' + item.end
                }
              })))
              current = current.add(1, 'days')
            }

            this.blockEvents = events.concat()

            console.log(events)

            this.calendarDatas = res.result
            this.allEvents = events
            const filterEvents = events.filter(event => {
              return true
            })
            successCb(filterEvents)
          } else {
            this.minDate = '06:00:00'
            this.calendarDatas = []
            this.allEvents = []
            this.blockEvents = []
            successCb([])
          }
          this.handleViewDidMount()
          this.handleScrollTime()
          this.initChoose()
        } else {
          failCb()
        }
      }).catch(() => {
        failCb()
      }).finally(() => {
        this.loading = false
      })
    },
    initChoose() {
      console.log(this.choose)
      if (this.$refs.fullCalendar) {
        const calendarApi = this.$refs.fullCalendar.getApi()
        // 回显block
        const findDay = week => {
          let current = moment(this.startDate)
          let isFind = ''
          while (moment(this.endDate).isAfter(current) && !isFind) {
            if (week === moment(current).format('dddd')) {
              isFind = current.format('YYYY-MM-DD')
            }
            current = current.add(1, 'days')
          }
          return isFind
        }
        console.log(this.choose)
        // this.choose = '2022-08-02 20:00:00~2022-08-02 20:03:00,2022-08-04 01:00:00~2022-08-04 01:03:00'
        if (this.choose) {
          const choosedBlock = this.choose.split(',').map(time => {
            const timeArr = time.split('~')
            if (timeArr.length === 2) {
              const start = moment(timeArr[0])
              const startTime = start.format('HH:mm:ss')
              const startDay = findDay(start.format('dddd'))

              const end = moment(timeArr[1])
              const endTime = end.format('HH:mm:ss')
              const endDay = findDay(end.format('dddd'))

              return `${startDay} ${startTime}~${endDay} ${endTime}`
            }
            return ''
          }).filter(_ => !!_)
          console.log(choosedBlock)
          const isEditable = this.blockEvents.length === 0
          choosedBlock.forEach(item => {
            const date = item.split('~')
            calendarApi.addEvent({
              title: 'DateSelect',
              start: date[0],
              end: date[1],
              backgroundColor: 'transparent',
              borderColor: 'transparent',
              editable: isEditable,
              extendedProps: {
                eventType: 'selectDate',
                backgroundColor: '#3688d8',
                // 存储星期
                val: moment(date[0]).format('YYYY-MM-DD HH:mm:ss') + '~' + moment(date[1]).format('YYYY-MM-DD HH:mm:ss')
              }
            })
          })
        }
      }
    },
    handleSchoolChange(school) {
      this.initData()
      setTimeout(() => {
        this.reFetch()
      }, 100)
    },
    // 将当前时间线延长成整个table而不是某天的格子里
    handleViewDidMount() {
      this.$nextTick(() => {
        if (!this.isNowLineVisible) {
          const $nowLine = document.querySelector('.fc-timegrid-now-indicator-line')
          const $nowIndicator = document.querySelector('.fc-timegrid-now-indicator-arrow')
          $nowLine.style.display = 'none'
          $nowIndicator.style.display = 'none'
        } else {
          const nowLine = document.getElementsByClassName('fc-timegrid-now-indicator-line')
          if (nowLine && nowLine.length > 0) {
            const fcBody = document.getElementsByClassName('fc-timegrid-body')[0]
            fcBody.insertBefore(nowLine[0], fcBody.firstChild)
          }
        }
      })
    },
    handleScrollTime() {
      this.$nextTick(() => {
        if (this.$refs.fullCalendar) {
          const calendarApi = this.$refs.fullCalendar.getApi()
          calendarApi && calendarApi.scrollToTime(this.minDate)
          // calendarApi && calendarApi.setOption('views', {
          //   slotMinTime: '18:00:00'
          // })
          // calendarApi && calendarApi.render()
        }
      })
    },
    handleDateSelect(selectInfo) {
      console.log(selectInfo)
      let start = moment(selectInfo.start).format('YYYY-MM-DD HH:mm:ss')
      let end = moment(selectInfo.end).format('YYYY-MM-DD HH:mm:ss')
      let canSelfAdd = true
      if (this.blockEvents.length === 0) {
        canSelfAdd = true
      } else {
        // 在block范围内，点亮block,不能自定义add
        const event = this.blockEvents.find(item => {
          // 同一天
          if (moment(item.start).date() === moment(selectInfo.start).date()) {
            // 范围,有交叉就行
            // const diffs = moment(selectInfo.end).diff(moment(selectInfo.start), 'minutes')
            // const blockDiff = moment(item.end).diff(moment(item.start), 'minutes')
            if (moment(item.start).isSameOrBefore(moment(selectInfo.start))) {
              if (moment(item.end).isSameOrAfter(moment(selectInfo.start))) {
                return true
              }
            } else {
              if (moment(item.start).isSameOrBefore(moment(selectInfo.end))) {
                return true
              }
            }
          }
          return false
        })
        if (event) {
          start = moment(event.start).format('YYYY-MM-DD HH:mm:ss')
          end = moment(event.end).format('YYYY-MM-DD HH:mm:ss')
          canSelfAdd = true
        } else {
          canSelfAdd = false
        }
      }
      if (this.$refs.fullCalendar) {
          const calendarApi = this.$refs.fullCalendar.getApi()
          const trueStart = moment(start)
          const trueEnd = moment(end)
          const selectDateEvent = {
            title: 'DateSelect',
            start: start,
            end: end,
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            editable: this.blockEvents.length === 0,
            extendedProps: {
              eventType: 'selectDate',
              backgroundColor: '#3688d8',
              // 存储星期
              val: trueStart.format('YYYY-MM-DD HH:mm:ss') + '~' + trueEnd.format('YYYY-MM-DD HH:mm:ss')
            }
          }
          console.log(canSelfAdd, selectDateEvent)
          // 去重
          if (canSelfAdd) {
            const isExist = this.currentEvents.filter(item => item.display !== 'background')
              .find(item => {
                return moment(item.start).isSame(moment(selectDateEvent.start)) && moment(item.end).isSame(moment(selectDateEvent.end))
              })
            !isExist && calendarApi.addEvent(selectDateEvent)
          }
          calendarApi.unselect()
      }
    },
    handleEventClick(clickInfo) {
      console.log(clickInfo)
      // const $el = clickInfo.el
      // if ($el) {
      //   if ($el.classList.contains('select-active')) {
      //     $el.classList.remove('select-active')
      //   } else {
      //     $el.classList.add('select-active')
      //   }
      //   const selects = []
      //   document.getElementsByClassName('select-active').forEach(item => {
      //     if (item.querySelector('.schedule-event-content')) {
      //       selects.push(item.querySelector('.schedule-event-content').dataset['id'])
      //     }
      //   })
      //   console.log(selects)
      //   this.$emit('date-select', selects.join(','))
      // }
      if (clickInfo.event.display !== 'background') {
        clickInfo.event.remove()
      }
    },
    handleEvents(events) {
      this.currentEvents = events
      console.log(events)
      const selectDates = events.filter(event => event.display !== 'background')
        .map(event => event.extendedProps.val).join(',')
      this.$emit('date-select', selectDates)
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
    handleMouseLeave(event) {

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
  font-size: 12px;
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
/deep/ .select-active {
  .schedule-event-content {
    background-color: #208557!important;
    color: #fff!important;
  }
}
</style>
