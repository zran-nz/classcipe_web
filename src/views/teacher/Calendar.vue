<template>
  <div class='my-content'>
    <a-spin :spinning="loading">
      <div id="scheduleContent" class="schedule-content" ref="scheduleContent">
        <div class="schedule-tip" v-show="attendanceVisible">
          <a-affix :target="affixTarget">
            <div class="tip-wrap">
              <div class="unit-tip">
                <div
                  class="unit-tip-item"
                  :style="{backgroundColor: BG_COLORS[item.index]}"
                  v-for="(item) in showUnitOptions"
                  :key="item.id">
                  <a-tooltip :title="item.name">Unit: {{ item.name }}</a-tooltip>
                </div>
              </div>
              <div class="calendar-type" v-show="true">
                <div class="calendar-type-item" v-for="type in CALENDAR_QUERY_TYPE" :key="type.value">
                  <template v-if="type.value !== CALENDAR_QUERY_TYPE.CLASS.value">
                    <div class="type-item-title">
                      <a-radio :checked="queryType === type.value" @change="handleChangeType(type)">
                        {{ type.label }}
                      </a-radio>
                    </div>
                    <div class="type-item-desc" v-if="getOptions(type.value).length > 0">
                      <a-checkbox-group
                        :options="getOptions(type.value)"
                        v-model="typeFilters"
                        @change="val => handleChangeFilters(val, type.value)"
                        class="type-check"
                      >
                        <div slot="label" class="type-content" slot-scope="item">
                          <span>{{ item.name }}</span>
                        </div>
                      </a-checkbox-group>
                    </div>
                  </template>
                </div>
                <!-- 每个class和querytype同级  -->
                <div class="calendar-type-item" v-for="type in showClassOptions" :key="type.value">
                  <div :class="{'type-item-title': true, 'active': queryType === CALENDAR_QUERY_TYPE.CLASS.value && queryClass === type.value}">
                    <a-radio :checked="queryType === CALENDAR_QUERY_TYPE.CLASS.value && queryClass === type.value" @change="handleChangeClass(type)">
                      <a-tooltip :title="type.name">
                        Class: {{ type.name }}
                      </a-tooltip>
                    </a-radio>
                  </div>
                </div>
              </div>
            </div>
          </a-affix>
        </div>
        <div style="flex:1;">
          <session-calendar
            :searchType="queryType"
            :searchFilters="typeFilters"
            :showTerm="true"
            @change-units="initData"
          />
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>

import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'

import SessionCalendar from '@/components/Calendar/SessionCalendar'

import { BG_COLORS, CALENDAR_QUERY_TYPE } from '@/const/common'
import { typeMap } from '@/const/teacher'

import { mapState } from 'vuex'
import cloneDeep from 'lodash.clonedeep'

export default {
  name: 'Calendar',
  mixins: [UserModeMixin, CurrentSchoolMixin],
  components: {
    SessionCalendar
  },
  data() {
    return {
      BG_COLORS: BG_COLORS,
      CALENDAR_QUERY_TYPE: CALENDAR_QUERY_TYPE,
      typeMap: typeMap,
      queryType: CALENDAR_QUERY_TYPE.MY.value,
      queryClass: '',
      [CALENDAR_QUERY_TYPE.WORKSHOP.label]: [
      {
        value: 1,
        name: 'PD workshop',
        index: 1
      }, {
        value: 2,
        name: 'Student workshop',
        index: 2
      }, {
        value: 3,
        name: 'Launched by me',
        index: 3
      }, {
        value: 4,
        name: 'Workshop to attend',
        index: 4
      }],
      [CALENDAR_QUERY_TYPE.MY.label]: [
        {
          id: 1,
          index: 1,
          name: 'Assignment',
          value: 'sessionType' + 1,
          allowZoom: false,
          enableZoom: false,
          color: '#333333',
          type: this.$classcipe.ScheduleSessionType.assignment
        },
        {
          id: 2,
          index: 2,
          name: 'Lesson',
          value: 'sessionType' + 2,
          allowZoom: true,
          enableZoom: false,
          color: '#15c39a',
          type: this.$classcipe.ScheduleSessionType.lesson
        },
        {
          id: 3,
          index: 3,
          name: 'Test',
          value: 'sessionType' + 3,
          allowZoom: true,
          enableZoom: false,
          color: '#c92a2a',
          type: this.$classcipe.ScheduleSessionType.test
        }
      ],
      typeFilters: ['sessionType1', 'sessionType2', 'sessionType3'], // 根据类型的筛选条件
      currentUnitList: [],
      attendanceVisible: true,
      loading: false
    }
  },
  computed: {
    ...mapState({
      currentSchool: state => state.user.currentSchool,
      classList: state => state.user.classList
    }),
    [CALENDAR_QUERY_TYPE.CLASS.label]() {
      return this.classList.map((item, index) => (
        {
          value: item.id,
          name: item.name,
          index: index
        }
      ))
    },
    showWorkshopOptions() {
      return this[CALENDAR_QUERY_TYPE.WORKSHOP.label].slice(0, 2)
    },
    showUnitOptions() {
      return this.currentUnitList.map((item, index) => {
        return {
          value: item.id,
          name: item.name,
          index: index
        }
      })
    },
    showClassOptions() {
      return this.classList.map((item, index) => (
        {
          value: item.id,
          name: item.name,
          index: index
        }
      ))
    }
  },
  created() {

  },
  methods: {
    initData(currentUnitList) {
      this.currentUnitList = cloneDeep(currentUnitList)
      this.currentUnit = this.currentUnitList.length > 0 ? this.currentUnitList[0].id : ''
      this.showUnit = this.currentUnitList.map(item => item.id)
    },
    affixTarget() {
      return document.getElementById('app')
    },
    getOptions(typeVal) {
      let typeLabel = ''
      for (const i in this.CALENDAR_QUERY_TYPE) {
        if (this.CALENDAR_QUERY_TYPE[i].value === typeVal) {
          typeLabel = this.CALENDAR_QUERY_TYPE[i].label
        }
      }
      return this[typeLabel] ? this[typeLabel] : []
    },
    handleChangeType(type) {
      this.queryType = type.value
      console.log(this[type.label])
      this.typeFilters = this[type.label] ? this[type.label].map(item => item.value) : []
    },
    handleChangeFilters(filter, val) {
      if (this.queryType !== val) {
        this.queryType = val
      }
    },
    handleChangeClass(type) {
      this.queryType = this.CALENDAR_QUERY_TYPE.CLASS.value
      this.queryClass = type.value
      this.typeFilters = [type.value]
    }
  }
}
</script>
<style lang='less'>

.my-content {
  padding: 15px;
  background: #fff;
  height: 100%;
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

.schedule-content {
  position: relative;
  display: flex;
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
</style>
