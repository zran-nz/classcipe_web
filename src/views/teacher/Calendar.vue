<template>
  <div class='my-content'>
    <a-spin :spinning="loading">
      <div id="scheduleContent" class="schedule-content" ref="scheduleContent">
        <div class="schedule-tip" v-show="attendanceVisible">
          <a-affix :target="affixTarget">
            <div class="tip-wrap">
              <div class="unit-tip" v-if="queryType !== CALENDAR_QUERY_TYPE.MY.value">
                <div
                  class="unit-tip-item"
                  :style="{backgroundColor: BG_COLORS[item.index]}"
                  v-for="(item) in showUnitOptions"
                  :key="'unit_' + item.id">
                  <a-tooltip :title="item.name">Unit: {{ item.name }}</a-tooltip>
                </div>
              </div>
              <div class="unit-tip" v-else>
                <div
                  class="unit-tip-item"
                  v-for="(item) in showSchoolOptions"
                  :key="'school_' + item.id">
                  <a-space class="tip-tiem">
                    <a-tooltip :title="item.name">
                      <img :src="item.avatar"/>
                    </a-tooltip>
                    <span :style="{backgroundColor: BG_COLORS[item.index]}"></span>
                  </a-space>
                </div>
              </div>
              <div class="calendar-type" v-show="true">
                <div class="calendar-type-item">
                  <div class="type-item-title">
                    <a-radio :checked="queryType === CALENDAR_QUERY_TYPE.WORKSHOP.value" @change="handleChangeType(CALENDAR_QUERY_TYPE.WORKSHOP)">
                      {{ CALENDAR_QUERY_TYPE.WORKSHOP.label }}
                    </a-radio>
                  </div>
                  <div class="type-item-desc">
                    <a-checkbox-group
                      :options="WorkShopOptions"
                      v-model="typeFilters"
                      @change="val => handleChangeFilters(val, CALENDAR_QUERY_TYPE.WORKSHOP.value)"
                      class="type-check algin-top"
                    >
                      <div slot="label" class="type-content" slot-scope="item">
                        <span>{{ item.name }}</span>
                        <div v-if="item.children && typeFilters.includes(1)">
                          <a-checkbox-group
                            :options="item.children"
                            v-model="subFilters"
                            @change="val => handleChangeSubFilters(val, CALENDAR_QUERY_TYPE.WORKSHOP.value)"
                            class="type-check"
                          >
                            <div slot="label" class="type-content" slot-scope="sub">
                              <span style="font-size: 12px;">{{ sub.name }}</span>
                            </div>
                          </a-checkbox-group>
                        </div>
                      </div>
                    </a-checkbox-group>
                  </div>
                </div>
                <div class="calendar-type-item">
                  <div class="type-item-title">
                    <a-radio :checked="queryType === CALENDAR_QUERY_TYPE.MY.value" @change="handleChangeType(CALENDAR_QUERY_TYPE.MY)">
                      {{ CALENDAR_QUERY_TYPE.MY.label }}
                    </a-radio>
                  </div>
                  <div class="type-item-desc">
                    <a-checkbox-group
                      :options="MyCalendarOptions"
                      v-model="typeFilters"
                      @change="val => handleChangeFilters(val, CALENDAR_QUERY_TYPE.MY.value)"
                      class="type-check"
                    >
                      <div slot="label" class="type-content" slot-scope="item">
                        <span>{{ item.name }}</span>
                      </div>
                    </a-checkbox-group>
                  </div>
                </div>
                <!-- 每个class和querytype同级  -->
                <div class="calendar-type-item" v-for="type in showClassOptions" :key="'showClass_' + type.value">
                  <div :class="{'type-item-title': true, 'active': queryType === CALENDAR_QUERY_TYPE.CLASS.value && queryClass === type.value}">
                    <a-radio :checked="queryType === CALENDAR_QUERY_TYPE.CLASS.value && queryClass === type.value" @change="handleChangeClass(type)">
                      <a-tooltip :title="type.classType === 1 ? formatViewName(type.subject) : type.name">
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
            :showNoData="false"
            :searchType="queryType"
            :searchFilters="searchFilters"
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

// import { listClass } from '@/api/v2/schoolClass'
import { getSubjectBySchoolId } from '@/api/academicSettingSubject'

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
      WorkShopOptions: [
      {
        value: 1,
        name: 'PD workshop',
        index: 1,
        children: [
          {
            value: 3,
            name: 'Launched by me',
            index: 3
          }, {
            value: 4,
            name: 'Workshop to attend',
            index: 4
          }
        ]
      }, {
        value: 2,
        name: 'Student workshop',
        index: 2
      }],
      MyCalendarOptions: [
        {
          id: 1,
          index: 1,
          name: 'FA',
          value: 'FA'
        },
        {
          id: 2,
          index: 2,
          name: 'SA',
          value: 'SA'
        },
        {
          id: 3,
          index: 3,
          name: 'Activity',
          value: 'Activity'
        },
        {
          id: 4,
          index: 4,
          name: 'IA',
          value: 'IA'
        }
      ],
      subFilters: [],
      typeFilters: ['FA', 'SA', 'Activity', 'IA'], // 根据类型的筛选条件
      currentUnitList: [],
      attendanceVisible: true,
      loading: false,
      // classList: [],
      subjectOptions: []
    }
  },
  // watch: {
  //   'currentSchool.id' (newVal) {
  //     this.listClass()
  //   }
  // },
  computed: {
    ...mapState({
      currentSchool: state => state.user.currentSchool,
      classList: state => state.user.classList,
      info: state => state.user.info
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
          ...item,
          value: item.id,
          name: item.name,
          index: index
        }
      ))
    },
    showSchoolOptions() {
      return [
        {
          value: '0',
          name: 'Personal',
          avatar: this.info.avatar,
          id: '0',
          index: 0
        }
      ].concat(this.info.schoolList.map((item, index) => {
        return {
          value: item.id,
          name: item.schoolName,
          avatar: (item.schoolUser && item.schoolUser.avatar) ? item.schoolUser.avatar : this.info.avatar,
          id: item.id,
          index: index + 1
        }
      }))
    },
    searchFilters() {
      return this.typeFilters.concat(this.subFilters)
    }
  },
  created() {
    // this.listClass()
    this.initDict()
  },
  methods: {
    // listClass () {
    //   listClass({
    //     schoolId: this.currentSchool.id,
    //     myClass: true,
    //     pageNo: 1,
    //     pageSize: 10000
    //   }).then(res => {
    //     this.classList = res.result?.records.filter(cls => cls.status !== 2)
    //   })
    // },
    initDict() {
      // 获取所有班级用于筛选
      Promise.all([
        getSubjectBySchoolId({
          schoolId: this.currentSchool.id
        })
      ]).then(([subjectRes]) => {
        if (subjectRes.success) {
          let subjects = []
          subjectRes.result.forEach(item => {
            if (item.subjectList && item.subjectList.length > 0) {
              subjects = subjects.concat(item.subjectList)
            }
          })
          const options = []
          subjects.forEach(item => {
            options.push({
              subjectId: item.subjectId,
              subjectName: item.subjectName
            })
            options.push({
              subjectId: item.parentSubjectId,
              subjectName: item.parentSubjectName
            })
          })
          this.subjectOptions = options
        }
      })
    },
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
      if (type.value === CALENDAR_QUERY_TYPE.WORKSHOP.value) {
        this.typeFilters = [1, 2]
        this.subFilters = [3, 4]
      } else if (type.value === CALENDAR_QUERY_TYPE.MY.value) {
        this.typeFilters = ['FA', 'SA', 'IA', 'Activity']
        this.subFilters = []
      }
    },
    handleChangeFilters(filter, val) {
      if (!filter.includes(1)) {
        this.subFilters = []
      } else {
        this.subFilters = [3, 4]
      }
      if (this.queryType !== val) {
        this.queryType = val
      }
    },
    handleChangeSubFilters(filter, val) {
      if (filter.length > 0 && !this.typeFilters.includes(1)) {
        this.typeFilters = this.typeFilters.concat([1])
      }
      if (filter.length === 0 && this.typeFilters.includes(1)) {
        this.typeFilters = this.typeFilters.filter(item => item !== 1)
      }
      if (this.queryType !== val) {
        this.queryType = val
      }
    },
    handleChangeClass(type) {
      this.queryType = this.CALENDAR_QUERY_TYPE.CLASS.value
      this.queryClass = type.value
      this.typeFilters = [type.value]
    },
    formatViewName(id) {
      const findSubject = this.subjectOptions.find(subject => subject.subjectId === id)
      if (findSubject) return findSubject.subjectName
      // const findGrade = this.gradeOptions.find(grade => grade.gradeId === id)
      // if (findGrade) return findGrade.gradeName
      return 'Untitle'
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
.fc-daygrid-event {
  & > div {
    width: 100%;
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
        .tip-tiem {
          margin-bottom: 5px;
        }
        span {
          display: inline-block;
          height: 15px;
          line-height: 15px;
          width:100px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        img {
          width: 30px;
          height: 30px;
          border-radius: 30px;
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
    .algin-top {
      /deep/ & > .ant-checkbox-group-item {
        & > .ant-checkbox {
          align-self: flex-start;
          top: 0;
        }
      }
    }
  }
  .type-item-desc {
    padding-left: 25px;
  }
}
</style>
