<template>
  <div>
    <div v-if="info.event.display === 'background'">
      <template v-if="info.event.extendedProps.termId">
        {{ info.event.start | dayjs(FORMATTER_SIM) }}-{{ info.event.end | dayjs(FORMATTER_SIM) }}
      </template>
    </div>
    <a-popover
      title="Session Detail"
      trigger="click"
      v-else-if="info.event.extendedProps.eventType !== 'selectDate'"
      :destroyTooltipOnHide="true"
      :getPopupContainer="trigger => getPopupContainer(trigger, info)"
      @visibleChange="visible => showPopover(visible, info)"
    >
      <a slot="content" >
        <a-spin :spinning="loading">
          <div v-if="queryType !== CALENDAR_QUERY_TYPE.WORKSHOP.value" style="max-width: 1100px;">
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
          <div v-else style="font-size: 70px;max-width: 1100px;">
            <liveworkshop-item
              @close="closeAllModal"
              :content="getWorkshopItem(info)"/>
          </div>
        </a-spin>
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
        <label v-if="info.view.type !== 'timeGridFourDay'" for="">{{ info.event.title }} </label>
        <label v-else for=""> {{ info.event.title }} </label>
      </div>
    </a-popover>
    <a-popover
      v-else
      title="Set Date"
      trigger="click"
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
        :style="{backgroundColor: info.event.extendedProps.backgroundColor, color: '#333'}"
      >
        <div>
          {{ info.event.start | dayjs(FORMATTER_SIM) }}-{{ info.event.end | dayjs(FORMATTER_SIM) }}
        </div>
      </div>
    </a-popover>

    <content-preview
      :content-id='previewCurrentId'
      :content-type='previewType'
      :showEditButton="false"
      v-if='previewVisible'
      @close='handlePreviewClose' />
  </div>
</template>

<script>
import SessionImportForCalendar from '@/components/MyContentV2/SessionImportForCalendar'
import ContentItemCalendar from '@/components/MyContentV2/ContentItemCalendar'
import LiveworkshopItem from '@/components/MyContentV2/LiveWorkShopContentItem'
import ContentPreview from '@/components/Preview/ContentPreview'

import { DeleteClassV2, EditSessionScheduleV2 } from '@/api/v2/classes'

import { BG_COLORS, CALENDAR_QUERY_TYPE } from '@/const/common'
import { typeMap } from '@/const/teacher'
import { ContentItemMixin } from '@/mixins/ContentItemMixin'
import moment from 'moment'

export default {
  name: 'SessionEventContent',
  components: {
    SessionImportForCalendar,
    ContentItemCalendar,
    LiveworkshopItem,
    ContentPreview
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
      type: Number,
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
  methods: {
    moment,
    initData() {
    },
    getPopupContainer(trigger, info) {
      const parentelClassList = trigger.parentElement.parentElement.parentElement.classList
      if (parentelClassList.contains('fc-timegrid-event-harness') || parentelClassList.contains('fc-daygrid-day-events')) {
        return document.body
      }
      return trigger.parentElement
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
        ...currentSession.workshopsDetailInfo
      }
    },
    handleChangeDateSelect() {
      this.$emit('changeDateSelect', this.dateSelect)
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
    closeAllModal(data) {
      // this.$refs.scheduleContent.dispatchEvent(new MouseEvent('click'))
      document.getElementsByClassName('ant-popover').forEach(item => (item.style.display = 'none'))
      console.log(data)
      this.handlePreviewDetail(data)
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
</style>
