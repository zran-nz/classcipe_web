<template>
  <div>
    <div v-if="info.event.display === 'background'">
      <template v-if="info.event.extendedProps.termId">
        {{ info.event.start | dayjs(FORMATTER_SIM2) }}-{{ info.event.end | dayjs(FORMATTER_SIM2) }}
      </template>
    </div>
    <a-popover
      title=""
      trigger="click"
      v-else-if="info.event.extendedProps.eventType !== 'selectDate'"
      :destroyTooltipOnHide="true"
      :getPopupContainer="trigger => getPopupContainer(trigger, info)"
      @visibleChange="visible => showPopover(visible, info)"
    >
      <a slot="content" >
        <a-spin :spinning="loading">
          <!-- v-if="queryType !== CALENDAR_QUERY_TYPE.WORKSHOP.value"  -->
          <div style="max-width: 650px;">
            <content-item-calendar
              ref="contentItemCalendar"
              :content='getSession(info)'
              :units='currentUnitList'
              @close="closeAllModal"
              @delete='(data) => handleDelete(info, data)'
              @change-unit="(params) => handleSave(params, info)"
              @save-response-limit="params => handleSave(params, info)"
            >
            </content-item-calendar>
          </div>
          <!-- <div v-else style="font-size: 70px;max-width: 650px;min-width: 500px;">
            <liveworkshop-item
              @close="closeAllModal"
              :is-simple="true"
              :content="getWorkshopItem(info)"/>
          </div> -->
        </a-spin>
      </a>
      <div
        class="schedule-event-content"
        :style="{backgroundColor: info.event.extendedProps.backgroundColor, color: '#333', lineHeight: 1}"
      >
        <div v-show="info.view.type === 'timeGridWeek' || info.view.type === 'timeGridDay'">
          {{ info.event.start | dayjs(FORMATTER_SIM2) }}-{{ info.event.end | dayjs(FORMATTER_SIM2) }}
        </div>
        <span v-show="info.view.type === 'dayGridMonth'" style="margin-right: 5px;">
          {{ info.event.start | dayjs(FORMATTER_SIM2) }}
        </span>
        <label
          v-if="info.view.type === 'timeGridWeek'"
          style=" display: block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;"
          for="">{{ info.event.title }} </label>
        <label v-if="info.view.type !== 'timeGridWeek'"> {{ info.event.title }} </label>
        <a-space v-if="info.event.extendedProps.userRealName && info.view.type === 'timeGridWeek'" class="user-avatar">
          <a-tooltip :title="info.event.extendedProps.schoolId === '0' ? 'Personal' : info.event.extendedProps.schoolName ">
            <img v-if="info.event.extendedProps.userAvatar" :src="info.event.extendedProps.userAvatar" alt="">
            <img v-else src="~@/assets/icons/library/default-avatar.png"/>
          </a-tooltip>
          <label for="" >{{ info.event.extendedProps.userRealName }}</label>
        </a-space>
      </div>
    </a-popover>
    <a-popover
      v-else
      title="Set Date"
      trigger="click"
      :defaultVisible="false"
      :destroyTooltipOnHide="true"
      @visibleChange="visible => showDateSelectPopover(visible, info.event)"
    >
      <a slot="content">
        <div class="date-select">
          <a-space class="date-select-item">
            <label for="">StartTime: {{ moment(info.event.start).format('YYYY-MM-DD') }}</label>
            <a-time-picker
              :allowClear="false"
              :disabledHours="disabledHoursStart"
              :disabledMinutes="disabledMinutesStart"
              v-model="dateSelect.start"
              format="HH:mm" />
          </a-space>
          <a-space class="date-select-item">
            <label for="">EndTime: {{ moment(info.event.end).format('YYYY-MM-DD') }}</label>
            <a-time-picker
              :allowClear="false"
              :disabledHours="disabledHoursEnd"
              :disabledMinutes="disabledMinutesEnd"
              v-model="dateSelect.end"
              format="HH:mm" />
          </a-space>
          <a-button type='primary' size="small" @click="handleChangeDateSelect">Save</a-button>
        </div>
      </a>
      <div
        class="schedule-event-content"
        :style="{backgroundColor: info.event.extendedProps.backgroundColor, color: '#333', minHeight: 'auto'}"
      >
        <div>
          {{ info.event.start | dayjs(FORMATTER_SIM2) }}-{{ info.event.end | dayjs(FORMATTER_SIM2) }}
        </div>
        <div class="remove" @click="handleRemoveSelect">
          <a-icon type="close-circle"></a-icon>
        </div>
      </div>
    </a-popover>
  </div>
</template>

<script>
import SessionImportForCalendar from '@/components/MyContentV2/SessionImportForCalendar'
import ContentItemCalendar from '@/components/MyContentV2/ContentItemCalendar'
import LiveworkshopItem from '@/components/MyContentV2/LiveWorkShopContentItem'

import { DeleteClassV2, EditSessionScheduleV2 } from '@/api/v2/classes'

import { BG_COLORS, CALENDAR_QUERY_TYPE } from '@/const/common'
import { typeMap } from '@/const/teacher'
import { ContentItemMixin } from '@/mixins/ContentItemMixin'
import moment from 'moment'
import { mapState } from 'vuex'

export default {
  name: 'SessionEventContent',
  components: {
    SessionImportForCalendar,
    ContentItemCalendar,
    LiveworkshopItem
  },
  mixins: [ContentItemMixin],
  props: {
    info: {
      type: Object,
      default: () => {},
      required: true
    },
    unitList: {
      type: Array,
      default: () => []
    },
    type: {
      type: [Number, String],
      default: CALENDAR_QUERY_TYPE.MY.value
    },
    allDatas: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    unitList: {
      handler(val) {
        this.currentUnitList = val
      },
      immediate: true
    },
    type: {
      handler(val) {
        this.queryType = val
      },
      immediate: true
    },
    allDatas: {
      handler(val) {
        this.calendarDatas = val
      },
      immediate: true
    }
  },
  data() {
    return {
      vis: false,
      FORMATTER: 'h:mm a',
      FORMATTER_SIM: 'h:mma',
      FORMATTER_SIM2: 'HH:mm',
      FORMATTER_FULL: 'YYYY-MM-DD h:mm a',
      CALENDAR_QUERY_TYPE: CALENDAR_QUERY_TYPE,
      BG_COLORS: BG_COLORS,
      typeMap: typeMap,
      currentUnitList: this.unitList,
      queryType: this.type,
      loading: false,
      calendarDatas: [],
      dateSelect: {
        start: null,
        end: null,
        id: 'DateSelect'
      }
    }
  },
  created() {
    this.initData()
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.info,
      currentSchool: state => state.user.currentSchool
    }),
    isLibrary() {
      if (this.info.event.extendedProps && this.info.event.extendedProps.author === this.userInfo.email) {
        return false
      }
      return true
    }
  },
  methods: {
    moment,
    initData() {
      if (this.info.event.extendedProps.eventType === 'selectDate') {
        this.showDateSelectPopover(true, this.info.event)
      }
    },
    getPopupContainer(trigger, info) {
      const parentelClassList = trigger.parentElement.parentElement.parentElement.classList
      if (parentelClassList.contains('fc-timegrid-event-harness') || parentelClassList.contains('fc-daygrid-day-events')) {
        return document.body
      }
      return document.body// trigger.parentElement
    },
    showPopover(visible, clickInfo) {
    },
    showDateSelectPopover(visible, event) {
      this.dateSelect = {
        ...event,
        start: moment(event.start, 'HH:mm'),
        end: moment(event.end, 'HH:mm')
      }
    },
    getSession(clickInfo) {
      const currentSession = this.calendarDatas.find(item => item.sessionInfo.id === clickInfo.event.extendedProps.id)
      return currentSession ? { ...currentSession } : null
    },
    getWorkshopItem(clickInfo) {
      const currentSession = this.calendarDatas.find(item => item.sessionInfo.id === clickInfo.event.extendedProps.id)
      if (!currentSession) return {}
      return {
        content: { ...currentSession.content },
        sessionInfo: { ...currentSession.sessionInfo },
        ...currentSession.workshopsDetailInfo,
        unitPlanInfo: { ...currentSession.unitPlanInfo }
      }
    },
    handleChangeDateSelect() {
      this.$emit('changeDateSelect', this.dateSelect)
    },
    handleRemoveSelect() {
      this.$emit('changeDateSelect', null)
    },
    disabledHoursStart() {
      const days = moment(this.info.event.end).isSame(moment(this.info.event.start), 'day')
      if (!days) return []
      const hours = moment(this.dateSelect.end).hours()
      return Array.from({
        length: 23 - hours
      }, (v, i) => 23 - i)
    },
    disabledHoursEnd() {
      const days = moment(this.info.event.end).isSame(moment(this.info.event.start), 'day')
      if (!days) return []
      const hours = moment(this.dateSelect.start).hours()
      return Array.from({
        length: hours
      }, (v, i) => i)
    },
    disabledMinutesStart(selectedHour) {
      const days = moment(this.info.event.end).isSame(moment(this.info.event.start), 'day')
      if (!days) return []
      const startHours = moment(this.dateSelect.start).hours()
      const endHours = moment(this.dateSelect.end).hours()
      const minutes = moment(this.dateSelect.end).minutes()
      let res = []
      if (startHours === endHours) {
        res = Array.from({
          length: 59 - minutes
        }, (v, i) => 59 - i)
      }
      return res
    },
    disabledMinutesEnd(selectedHour) {
      const days = moment(this.info.event.end).isSame(moment(this.info.event.start), 'day')
      if (!days) return []
      const startHours = moment(this.dateSelect.start).hours()
      const endHours = moment(this.dateSelect.end).hours()
      const minutes = moment(this.dateSelect.start).minutes()
      let res = []
      if (startHours === endHours) {
        res = Array.from({
          length: minutes
        }, (v, i) => i)
      }
      return res
    },
    handleDelete(clickInfo) {
        this.loading = true
        DeleteClassV2({
          sessionId: clickInfo.event.extendedProps.sessionId
        }).then(res => {
          if (res.code === 0) {
            this.$message.success('Remove successfully')
            this.$emit('reFetch')
          }
        }).finally(() => {
          this.loading = false
        })
    },
    handleSave(params, info) {
      console.log(params)
      this.loading = true
      EditSessionScheduleV2(params).then(res => {
        if (res.success) {
          this.$message.success('Opt Successfully')
          this.$emit('save', {
            params,
            info
          })
        }
      }).finally(res => {
        this.loading = false
      })
    },
    closeAllModal() {
      // this.$refs.scheduleContent.dispatchEvent(new MouseEvent('click'))
      document.getElementsByClassName('ant-popover').forEach(item => (item.style.display = 'none'))
    }
  }
}
</script>

<style scoped lang="less">
/deep/ .price-con {
  margin-left: 10px;
}
.date-select {
  display: flex;
  flex-direction: column;
  & > .date-select-item {
    margin: 5px;
    label {
      width: 120px;
    }
  }
  button {
    width: 60px;
  }
}
.user-avatar {
  img {
    width: 20px;
    height: 20px;
    border-radius: 20px;
  }
}
.schedule-event-content {
  .remove {
    position: absolute;
    top: -8px;
    right: -5px;
    font-size: 14px;
    cursor: pointer;
    background: #fff;
    border-radius: 14px;
    width: 14px;
    height: 14px;
    display: none;
  }
  &:hover {
    .remove {
      display: block;
    }
  }
}
</style>
