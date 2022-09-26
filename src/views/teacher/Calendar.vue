<template>
  <div class='my-content'>
    <a-spin :spinning="loading">
      <div id="scheduleContent" class="schedule-content" ref="scheduleContent">
        <div class="schedule-tip" v-show="attendanceVisible">
          <a-affix :target="affixTarget">
            <div class="tip-wrap" style="height: 100vh;">
              <!-- <div class="unit-tip" v-if="queryType === CALENDAR_QUERY_TYPE.CLASS.value">
                <div
                  class="unit-tip-item"
                  :style="{backgroundColor: BG_COLORS[item.index]}"
                  v-for="(item) in showUnitOptions"
                  :key="'unit_' + item.id">
                  <a-tooltip :title="item.name">Unit: {{ item.name }}</a-tooltip>
                </div>
              </div>
              <div class="unit-tip" v-else>
                <a-checkbox-group
                  :options="showSchoolOptions"
                  v-model="schoolFilters"
                  class="unit-tip-item"
                >
                  <a-space slot="label" class="tip-item" slot-scope="item">
                    <a-tooltip :title="item.name">
                      <img :src="item.avatar"/>
                    </a-tooltip>
                    <span :style="{backgroundColor: BG_COLORS[item.index]}"></span>
                  </a-space>
                </a-checkbox-group>
              </div> -->
              <a-radio-group @change="changeSessionType" v-model="sessionType" button-style="solid">
                <a-radio-button value="all">
                  All
                </a-radio-button>
                <a-radio-button value="session">
                  Session
                </a-radio-button>
                <a-radio-button value="workshop">
                  Workshop
                </a-radio-button>
              </a-radio-group>
              <div class="unit-tip" v-if="sessionType !== 'workshop'" style="margin-top: 20px;">
                <a-checkbox-group
                  :options="showSchoolOptions"
                  v-model="schoolFilters"
                  @change="changeSchoolFilters"
                  class="unit-tip-item"
                >
                  <a-space slot="label" class="tip-item" slot-scope="item">
                    <a-tooltip :title="item.name">
                      <img :src="item.avatar"/>
                    </a-tooltip>
                  </a-space>
                </a-checkbox-group>
              </div>
              <div
                class="calendar-type"
                v-show="true"
                style="height: calc(100% - 200px);
                    overflow: auto;
                }">
                <div class="type-item-title" style="margin-top: 0px;">
                  <a-checkbox :indeterminate="isIndeterminate" :checked="isAll" @change="handleChangeAll">
                    All
                  </a-checkbox>
                </div>
                <div class="calendar-type-item" style="margin-bottom: 0" v-if="sessionType !== 'session'">
                  <!-- <div class="type-item-title">
                    <a-checkbox :checked="queryType.indexOf(CALENDAR_QUERY_TYPE.WORKSHOP.value) > -1" @change="e => handleChangeType(CALENDAR_QUERY_TYPE.WORKSHOP, e)">
                      {{ CALENDAR_QUERY_TYPE.WORKSHOP.label }}
                    </a-checkbox>
                  </div> -->
                  <div class="type-item-desc" style="width: 210px;">
                    <a-checkbox-group
                      :options="WorkShopOptions"
                      v-model="workFilters"
                      @change="val => handleChangeFilters(val, CALENDAR_QUERY_TYPE.WORKSHOP.value)"
                      class="type-check algin-top"
                    >
                      <div slot="label" class="type-content" slot-scope="item">
                        <span>{{ item.name }}</span>
                        <div v-if="item.children && workFilters.includes(1)">
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
                <div class="calendar-type-item" v-if="sessionType !== 'workshop'">
                  <!-- <div class="type-item-title">
                    <a-checkbox :checked="queryType.indexOf(CALENDAR_QUERY_TYPE.MY.value) > -1" @change="e => handleChangeType(CALENDAR_QUERY_TYPE.MY, e)">
                      {{ CALENDAR_QUERY_TYPE.MY.label }}
                    </a-checkbox>
                  </div> -->
                  <div class="type-item-desc" style="width: 100px;">
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
                <template v-if="sessionType === 'session'">
                  <div class="calendar-type-item" v-for="type in filterShowClassOptions" :key="'showClass_' + type.value">
                    <div :class="{'type-item-title': true, 'active': queryType === CALENDAR_QUERY_TYPE.CLASS.value && queryClass === type.value}">
                      <a-radio :checked="queryType === CALENDAR_QUERY_TYPE.CLASS.value && queryClass === type.value" @change="handleChangeClass(type)">
                        <a-tooltip :title="type.classType === 1 ? formatViewName(type.subject) : type.name">
                          Class: {{ type.name }}
                        </a-tooltip>
                      </a-radio>
                    </div>
                    <div class="type-item-desc">
                      <a-checkbox-group
                        :options="ClassTypesOptions.filter(item => type.schoolId !== '0' || item.value === 1 )"
                        v-model="type.clsFilters"
                        @change="val => handleChangeFilters(val, CALENDAR_QUERY_TYPE.CLASS.value, type)"
                        class="type-check"
                      >
                        <div slot="label" class="type-content" slot-scope="item">
                          <span>{{ item.name }}</span>
                        </div>
                      </a-checkbox-group>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </a-affix>
        </div>
        <div style="flex:1;">
          <session-calendar
            :showNoData="false"
            :schoolFilters="schoolFilters"
            :searchType="queryType"
            :searchFilters="searchFilters"
            :classFilters="classFilters"
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

import { listClass } from '@/api/v2/schoolClass'
import { getSubjectBySchoolId } from '@/api/academicSettingSubject'

import { BG_COLORS, CALENDAR_QUERY_TYPE } from '@/const/common'
import { typeMap } from '@/const/teacher'

import { mapState } from 'vuex'
import cloneDeep from 'lodash.clonedeep'
import { isEqual } from 'lodash-es'

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
      queryType: [CALENDAR_QUERY_TYPE.MY.value, CALENDAR_QUERY_TYPE.WORKSHOP.value].join(','),
      queryClass: '',
      sessionType: 'all',
      WorkShopOptions: [
      {
        value: 1,
        name: 'PD workshop',
        index: 1,
        indeterminate: false,
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
        indeterminate: false,
        name: 'Student workshop',
        index: 2
      }],
      MyCalendarOptions: [
        {
          id: 5,
          index: 5,
          name: 'FA',
          value: 'FA'
        },
        {
          id: 6,
          index: 6,
          name: 'SA',
          value: 'SA'
        },
        {
          id: 7,
          index: 7,
          name: 'Activity',
          value: 'Activity'
        },
        {
          id: 8,
          index: 8,
          name: 'IA',
          value: 'IA'
        }
      ],
      ClassTypesOptions: [
        {
          id: 1,
          index: 1,
          name: 'My Session',
          value: 1
        },
         {
          id: 2,
          index: 2,
          name: 'Others',
          value: 2
        }
      ],
      subFilters: [3, 4],
      workFilters: [1, 2],
      typeFilters: ['FA', 'SA', 'Activity', 'IA'], // 根据类型的筛选条件
      classFilters: [1, 2],
      currentUnitList: [],
      attendanceVisible: true,
      loading: false,
      classList: [],
      subjectOptions: [],
      showClassOptions: [],
      schoolFilters: []
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
      // classList: state => state.user.classList,
      info: state => state.user.info
    }),
    showUnitOptions() {
      return this.currentUnitList.map((item, index) => {
        return {
          value: item.id,
          name: item.name,
          index: index
        }
      })
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
      return this.typeFilters.concat(this.subFilters).concat(this.workFilters)
    },
    isAll() {
      const subFiltersEqual = isEqual(this.subFilters, [3, 4])
      const workFiltersEqual = isEqual(this.workFilters, [1, 2])
      const typeFiltersEqual = isEqual(this.typeFilters, ['FA', 'SA', 'Activity', 'IA'])
      if (this.sessionType === 'all') {
        return subFiltersEqual && workFiltersEqual && typeFiltersEqual
      }
      if (this.sessionType === 'session') {
        return typeFiltersEqual
      }
      if (this.sessionType === 'workshop') {
        return subFiltersEqual && workFiltersEqual
      }
      return false
    },
    isIndeterminate() {
      const subFiltersLen = this.subFilters.length
      const workFiltersLen = this.workFilters.length
      const typeFiltersLen = this.typeFilters.length
      if (this.sessionType === 'all') {
        return (subFiltersLen + workFiltersLen + typeFiltersLen) > 0 && (subFiltersLen + workFiltersLen + typeFiltersLen) < 8
      }
      if (this.sessionType === 'session') {
        return typeFiltersLen > 0 && typeFiltersLen < 4
      }
      if (this.sessionType === 'workshop') {
        return (subFiltersLen + workFiltersLen) > 0 && (subFiltersLen + workFiltersLen) < 4
      }
      return false
    },
    filterShowClassOptions() {
      return this.showClassOptions.filter(item => {
        return this.schoolFilters.includes(item.schoolId)
      })
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
      const schoolIds = ['0'].concat(this.info.schoolList.map(item => item.id))
      const subjectPormises = schoolIds.map(id => getSubjectBySchoolId({
        schoolId: id
      }))
      const classPormises = schoolIds.map(id => listClass({
          schoolId: id,
          myClass: true,
          pageNo: 1,
          pageSize: 10000
      }))
      this.subjectOptions = []
      this.classList = []
      Promise.all(subjectPormises).then((allRes) => {
        allRes.forEach((subjectRes, index) => {
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
                subjectName: item.subjectName,
                schoolId: schoolIds[index]
              })
              options.push({
                subjectId: item.parentSubjectId,
                subjectName: item.parentSubjectName,
                schoolId: schoolIds[index]
              })
            })
            this.subjectOptions = this.subjectOptions.concat(options)
          }
        })
        console.log(this.subjectOptions)
      })
      Promise.all(classPormises).then((allRes) => {
        allRes.forEach((clsRes, index) => {
          if (clsRes.success) {
            const result = (clsRes.result.records || clsRes.result).filter(item => item.status !== 2)
            this.classList = this.classList.concat(result)
          }
        })
        console.log(this.classList)
        this.showClassOptions = this.classList.map((cls, index) => {
          const item = { ...cls }
          return {
            ...item,
            value: item.id,
            name: item.name,
            index: index,
            clsFilters: []
          }
        })
      })
      this.schoolFilters = this.showSchoolOptions.map(item => item.value)
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
    changeSessionType(e) {
      const sessionType = e.target.value
      // if (this.queryType !== CALENDAR_QUERY_TYPE.CLASS.value) {
        if (sessionType === 'all') {
          this.subFilters = [3, 4]
          this.workFilters = [1, 2]
          this.typeFilters = ['FA', 'SA', 'Activity', 'IA']
          this.queryType = [CALENDAR_QUERY_TYPE.WORKSHOP.value, CALENDAR_QUERY_TYPE.MY.value].join(',')
        } else if (sessionType === 'session') {
          this.subFilters = []
          this.workFilters = []
          this.typeFilters = ['FA', 'SA', 'Activity', 'IA']
          this.queryType = CALENDAR_QUERY_TYPE.MY.value
        } else if (sessionType === 'workshop') {
          this.subFilters = [3, 4]
          this.workFilters = [1, 2]
          this.typeFilters = []
          this.queryType = CALENDAR_QUERY_TYPE.WORKSHOP.value
        }
        this.schoolFilters = this.showSchoolOptions.map(item => item.value)
        this.resetClsOptions()
      // }
    },
    handleChangeAll(e) {
      if (e.target.checked) {
        this.subFilters = [3, 4]
        this.workFilters = [1, 2]
        this.typeFilters = ['FA', 'SA', 'Activity', 'IA']
        this.queryType = [CALENDAR_QUERY_TYPE.WORKSHOP.value, CALENDAR_QUERY_TYPE.MY.value].join(',')
      } else {
        this.subFilters = []
        this.workFilters = []
        this.typeFilters = []
        this.queryType = ''
      }
      this.WorkShopOptions[0].indeterminate = false
      this.resetClsOptions()
    },
    changeSchoolFilters(schoolIds) {
      if (this.queryType === CALENDAR_QUERY_TYPE.CLASS.value) {
        const cls = this.typeFilters[0]
        if (cls) {
          const clsObj = this.classList.find(item => item.id === cls)
          const isIn = schoolIds.includes(clsObj.schoolId)
          if (!isIn) {
            const isInCls = this.classList.filter(c => schoolIds.includes(c.schoolId))
            if (isInCls.length > 0) {
              this.typeFilters = [isInCls[0].id]
              this.queryClass = isInCls[0].id
              this.classFilters = [1, 2]
            } else {
              this.typeFilters = []
              this.queryType = ''
              this.queryClass = ''
              this.classFilters = []
            }
            this.resetClsOptions()
          }
        }
      }
    },
    handleChangeType(type, e) {
      const checked = e.target.checked
      const actualQuery = [CALENDAR_QUERY_TYPE.WORKSHOP.value, CALENDAR_QUERY_TYPE.MY.value].filter(item => {
        return (type.value === item) ? checked : this.queryType.indexOf(item) > -1
      })
      this.queryType = actualQuery.join(',')

      if (this.queryType.indexOf(CALENDAR_QUERY_TYPE.WORKSHOP.value) > -1) {
        this.workFilters = [1, 2]
        this.subFilters = [3, 4]
      } else {
        this.subFilters = []
        this.workFilters = []
      }
      if (this.queryType.indexOf(CALENDAR_QUERY_TYPE.MY.value) > -1) {
        this.typeFilters = ['FA', 'SA', 'IA', 'Activity']
      } else {
        this.typeFilters = []
      }
    },
    handleChangeFilters(filter, val, cls) {
      if (val === CALENDAR_QUERY_TYPE.CLASS.value) {
        this.classFilters = filter
        this.queryClass = cls.value
        this.typeFilters = [cls.value]
        this.subFilters = []
        this.workFilters = []
        cls.clsFilters = filter
      }
      if (val === CALENDAR_QUERY_TYPE.WORKSHOP.value) {
        console.log(filter)
        if (!filter.includes(1)) {
          this.subFilters = []
        } else {
          if (this.subFilters.length === 0) {
            this.subFilters = [3, 4]
          }
        }
        this.WorkShopOptions[0].indeterminate = this.subFilters.length === 1
      }
      if (val === CALENDAR_QUERY_TYPE.CLASS.value) {
        this.queryType = val
      } else {
        const actualQuery = [CALENDAR_QUERY_TYPE.WORKSHOP.value, CALENDAR_QUERY_TYPE.MY.value].filter(item => {
          return (val === item) ? true : this.queryType.indexOf(item) > -1
        })
        this.queryType = actualQuery.join(',')
      }

      this.resetClsOptions()
    },
    handleChangeSubFilters(filter, val) {
      if (filter.length > 0 && !this.workFilters.includes(1)) {
        this.workFilters = this.workFilters.concat([1])
      }
      if (filter.length === 0 && this.workFilters.includes(1)) {
        this.workFilters = this.workFilters.filter(item => item !== 1)
      }
      if (val === CALENDAR_QUERY_TYPE.CLASS.value) {
        this.queryType = val
      } else {
        const actualQuery = [CALENDAR_QUERY_TYPE.WORKSHOP.value, CALENDAR_QUERY_TYPE.MY.value].filter(item => {
          return (val === item) ? true : this.queryType.indexOf(item) > -1
        })
        this.queryType = actualQuery.join(',')
      }
      this.WorkShopOptions[0].indeterminate = filter.length === 1
    },
    handleChangeClass(type) {
      this.queryType = this.CALENDAR_QUERY_TYPE.CLASS.value
      this.queryClass = type.value
      this.typeFilters = [type.value]
      this.classFilters = [ ...type.clsFilters ]
      this.workFilters = []
      this.subFilters = []
      this.resetClsOptions()
    },
    resetClsOptions() {
      this.showClassOptions.forEach(item => {
        if (item.value !== this.queryClass || this.queryType !== CALENDAR_QUERY_TYPE.CLASS.value) {
          item.clsFilters = []
        } else if (!item.clsFilters || item.clsFilters.length === 0) {
          item.clsFilters = [1, 2]
        }
      })
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
    width: 230px;
    display: flex;
    flex-direction: column;
    margin-top: 50px;
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
        /deep/ .ant-checkbox-wrapper {
          margin: 3px 0;
        }
        /deep/ .tip-tiem {
          margin-bottom: 5px;
          span {
            height: 15px;
            line-height: 15px;
          }
        }
        span {
          display: inline-block;
          height: 25px;
          line-height: 25px;
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
