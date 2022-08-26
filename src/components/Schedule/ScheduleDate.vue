<template>
  <div class='schedule-date'>
    <div style="padding: 0 20px;" :style="{width: showCalendarLink ? '30%' : '50%'}">
      <div class='choose-type'>
        <zoom-auth :enable-zoom.sync='enableZoom' :disabled="mustZoom" />
        <zoom-meeting
          v-show='enableZoom'
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
    mustZoom: {
      handler(val) {
        if (val) {
          this.enableZoom = true
          // 直播课,pd zomm必须选择，所以
          this.$emit('select-zoom-status', this.enableZoom)
          this.checkZoomAuth()
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
      enableZoom: false,
      initDate: [moment(new Date()), null]
    }
  },
  created() {
    if (this.$route.query.startDate && this.$route.query.endDate) {
      this.initDate = [moment(this.$route.query.startDate), moment(this.$route.query.endDate)]
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
      if (this.enableZoom) {
        const status = await this.checkZoomAuth()
        if (!status) {
          this.enableZoom = false
          this.$logger.info('reset item enableZoom', this.enableZoom)
        } else {
          this.$logger.info('zoom auth success')
        }
      }
    },

    disabledDate(current) {
      return current && current < moment().subtract(1, 'days').endOf('day')
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
