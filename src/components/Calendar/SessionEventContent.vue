<template>
  <a-popover
    title="Session Detail"
    trigger="click"
    v-if="info.event.extendedProps.eventType !== 'selectDate'"
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
  <div v-else style="height: 100%;">
    <div
      class="schedule-event-content"
      :style="{backgroundColor: info.event.extendedProps.backgroundColor, color: '#333'}"
    >
      <div>
        {{ info.event.start | dayjs(FORMATTER_SIM) }}-{{ info.event.end | dayjs(FORMATTER_SIM) }}
      </div>
    </div>
  </div>
</template>

<script>
import SessionImportForCalendar from '@/components/MyContentV2/SessionImportForCalendar'
import ContentItemCalendar from '@/components/MyContentV2/ContentItemCalendar'
import LiveworkshopItem from '@/components/MyContentV2/LiveWorkShopContentItem'

import { DeleteClassV2, EditSessionScheduleV2 } from '@/api/v2/classes'

import { BG_COLORS, CALENDAR_QUERY_TYPE } from '@/const/common'

export default {
  name: 'SessionEventContent',
  components: {
    SessionImportForCalendar,
    ContentItemCalendar,
    LiveworkshopItem
  },
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
      FORMATTER: 'h:mm a',
      FORMATTER_SIM: 'h:mma',
      FORMATTER_FULL: 'YYYY-MM-DD h:mm a',
      CALENDAR_QUERY_TYPE: CALENDAR_QUERY_TYPE,
      BG_COLORS: BG_COLORS,
      currentUnitList: this.unitList,
      queryType: this.type,
      loading: false,
      calendarDatas: []
    }
  },
  created() {
    this.initData()
  },
  methods: {
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
</style>
