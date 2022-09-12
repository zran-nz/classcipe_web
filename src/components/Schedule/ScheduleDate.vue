<template>
  <div class='schedule-date'>
    <div style="padding: 0;" :style="{width: showCalendarLink ? '30%' : '50%'}">
      <slot name="title" />
      <div class='choose-type'>
        <zoom-auth :enable-zoom.sync='enableZoom' :disabled="mustZoom" />
        <zoom-meeting
          v-show='enableZoom'
          :password='true'
          :waiting-room='false'
          ref='zoom'
          @update='updateZoom' />
      </div>
    </div>
    <div class='select-date'>
      <div class='title'>Schedule</div>
      <div class='date-picker' v-if="!showCalendarLink">
        <a-range-picker :default-value="initDate" :disabled-date="disabledDate" @change="handleDateChange" format='YYYY-MM-DD HH:mm:ss' :show-time="{ format: 'HH:mm' }"/>
      </div>
      <div style="width: 100%;">
        <session-calendar
          v-if="showCalendarLink"
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
</template>

<script>

import { ZoomAuthMixin } from '@/mixins/ZoomAuthMixin'
import { CALENDAR_QUERY_TYPE } from '@/const/common'
import moment from 'moment'
import ZoomMeeting from '@/components/Schedule/ZoomMeeting'
import ZoomAuth from '@/components/Schedule/ZoomAuth'

export default {
  name: 'ScheduleDate',
  components: {
    ZoomAuth,
    ZoomMeeting,
    SessionCalendar: () => import('@/components/Calendar/SessionCalendar')
  },
  mixins: [ ZoomAuthMixin ],
  props: {
    defaultDate: {
      type: Array,
      default: null
    },
    showCalendarLink: {
      type: Boolean,
      default: true
    },
    calendarSearchType: {
      type: [String, Number],
      default: CALENDAR_QUERY_TYPE.CLASS.value
    },
    calendarSearchFilters: {
      type: Array,
      default: () => []
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
      // 1-assignment 2-lession(PD session只能是公开课，类型是lesson) 3-Test
      CALENDAR_QUERY_TYPE: CALENDAR_QUERY_TYPE,
      searchType: this.calendarSearchType,
      searchFilters: this.calendarSearchFilters,

      selectedSessionType: null,
      startDate: null,
      endDate: null,
      enableZoom: this.mustZoom,
      initDate: [moment(new Date()), null]
    }
  },
  created() {
    if (this.$route.query.startDate && this.$route.query.endDate) {
      this.initDate = [moment(this.$route.query.startDate), moment(this.$route.query.endDate)]
      this.handleDateChange(this.initDate)
    }
  },
  methods: {
    handleDateChange (date, dateString) {
      this.$logger.info('handleDateChange', date, dateString)
      this.startDate = moment(date[0].toDate()).utc().format('YYYY-MM-DD HH:mm:ss')
      this.endDate = moment(date[1].toDate()).utc().format('YYYY-MM-DD HH:mm:ss')
      this.$logger.info('handleDateChange', this.startDate, this.endDate)
      this.$emit('select-date', {
        startDate: this.startDate,
        endDate: this.endDate
      })
    },

    handleSelectSchedule(date) {
      if (!date) {
        this.startDate = null
        this.endDate = null
        this.$emit('select-date', null)
        return
      }
      if (this.enableZoom && !this.$store.getters.zoomChecked) {
        this.checkZoomAuth()
      }
      this.startDate = moment(date.startDate).utc().format('YYYY-MM-DD HH:mm:ss')
      this.endDate = moment(date.endDate).utc().format('YYYY-MM-DD HH:mm:ss')
      this.$logger.info('handleDateChange', this.startDate, this.endDate)
      this.$emit('select-date', {
        startDate: this.startDate,
        endDate: this.endDate
      })
    },

    async handleZoomStatusChange () {
      this.$logger.info('handleZoomStatusChange', this.enableZoom)
      this.$emit('select-zoom-status', this.enableZoom)
    },

    disabledDate(current) {
      // return current && current < moment().subtract(1, 'days').endOf('day')
      // 在开课时间之前
      return current &&
        current < moment().subtract(1, 'days').endOf('day') ||
        (current && this.startDate && current > moment(this.startDate).add(1, 'days').startOf('day'))
    },

    updateZoom(data) {
      this.$emit('update-zoom', {
        password: data.password,
        waitingRoom: data.waitingRoom
      })
    }
  }
}
</script>

<style lang='less' scoped>

@import "~@/components/index.less";

.schedule-date {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-around;
  padding: 15px 0;
  height: 100%;

  .choose-type, .select-date{
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
  }

  .select-date {
    width: 70%;
    padding: 0 20px;
    height: 100%;
    overflow: auto;
  }
}

.item-checked-icon {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 25px;
  margin-right: 5px;
  .empty-circle {
    height: 18px;
    width: 18px;
    border-radius: 50%;
    border: 2px solid #ccc;
  }

  img {
    width: 18px;
    height: 18px;
  }
}

</style>
