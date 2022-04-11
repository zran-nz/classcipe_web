<template>
  <div class="my-content">
    <div class="filter-line">
      <div class="status-tab">
        <div class="toggle-mode-type-wrapper">
          <div class="toggle-mode-type">
            <div class="toggle-mode">
              <div
                v-for="(item,index) in tabsList"
                :key="'types'+index"
                :class="{'mode-item': true, 'active-mode' : currentType === item.value}"
                @click="toggleType(item.value)">
                {{ item.title }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="type-owner">
        <div class="my-search">
          <a-input-search
            placeholder="Search"
            v-show="currentType === 'task'"
            v-model="searchText"
            @search="triggerSearch"
            @pressEnter="triggerSearch"
            :allowClear="true"
            size="large"
          >
          </a-input-search>
          <a-input-search
            placeholder="Search"
            v-show="currentType === 'attendance'"
            v-model="queryAttendance.searchKey"
            @search="triggerSearch"
            @pressEnter="triggerSearch"
            :allowClear="true"
            size="large"
          >
          </a-input-search>
        </div>
        <!-- <div class="filter-icon" @click="showFilter = !showFilter">
          <div class="filter-item">
            <filter-icon class="filter-icon" />
            <filter-active-icon class="filter-active-icon"/>
            <div class="filter-label">
              Filter
            </div>
          </div>
        </div> -->
        <div class="filter-option" v-show="currentType === 'task'">
          <a-select
            v-model="filterParams.subject"
            mode="multiple"
            class="filter-item"
            allowClear
            size="large"
            @change="handleChangeSubject"
            placeholder="Search by subject"
          >
            <a-select-option :value="item.value" v-for="(item, index) in filterSubjectOptions" :key="'subject_'+index">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </div>
        <div class="view-mode-toggle" v-show="currentType === 'task'">
          <div class="view-mode">
            <div :class="{'view-mode-item': true, 'active-view': viewMode === 'img'}" @click="toggleViewMode('img')">
              <pubu-svg />
            </div>
            <div :class="{'view-mode-item': true, 'active-view': viewMode === 'list'}" @click="toggleViewMode('list')">
              <liebiao-svg />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div v-if="showFilter">
      <div class="filter-params">
        <filter-content
          @filter-config-update="handleUpdateFilterConfig"
          :filter-config="filterConfig"
          :age-options="filterAgeOptions"
          :period-options="filterPeriodOptions"
          :subject-options="filterSubjectOptions"
          :filter-fa-options="filterFaOptions"
          :filter-sa-options="filterSaOptions"
          :filter-activity-options="filterActivityOptions"
        />
      </div>
      <div class="expand-icon" v-if="showFilter" @click="showFilter = !showFilter">
        <a-icon type="up-circle" theme="filled" title="Collapse filter" /> Close
      </div>
    </div> -->
    <!--  myTask & Unit -->
    <div v-show="currentType === 'task'">
      <div class="status-filter">
        <a-radio-group v-model="currentStatus" button-style="solid">
          <a-radio-button value="">
            All Status
          </a-radio-button>
          <a-radio-button
            v-for="(item,index) in statusList"
            :value="item.value"
            :key="'status'+index">
            {{ item.title }}
          </a-radio-button>
        </a-radio-group>
        <label>Class: {{ currentClassName }}</label>
      </div>
      <my-task-list
        :loadData="loadData"
        :viewMode="viewMode"
        :status="currentStatus"
        :optArray="['Enter session', 'Preview', 'Distance']"
        actionType="myClass"
        ref="myTaskList"
      >
      </my-task-list>
    </div>
    <!--  Evalutions -->
    <div v-show="currentType === 'evaluations'">
      <a-empty />
    </div>
    <!--  Attendance -->
    <div v-show="currentType === 'attendance'">
      <div class="attendance-summary">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-card class="attendance-card" :class="{active: queryAttendance.sessionType === 'mySessionList'}" @click="toggleSessionType('mySessionList')">
              <h4>Total Sessions</h4>
              <p>{{ attendanceData.mySessionSize }}</p>
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card class="attendance-card" :class="{active: queryAttendance.sessionType === 'attendanceSessionList'}" @click="toggleSessionType('attendanceSessionList')">
              <h4>Attandence Sessions</h4>
              <p>{{ attendanceData.attendanceSessionSize }}</p>
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card class="attendance-card" :class="{active: queryAttendance.sessionType === 'absentSessionList'}" @click="toggleSessionType('absentSessionList')">
              <h4>Absent Sessions</h4>
              <p>{{ attendanceData.absentSessionSize }}</p>
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card class="attendance-card">
              <h4>Attandence Rate</h4>
              <p>{{ attendanceRate }} %</p>
            </a-card>
          </a-col>
        </a-row>
      </div>
      <div class="">
        <a-table
          :columns="columns"
          :data-source="attendanceList"
          :pagination="true"
          class="content-list"
          :rowKey="row => row.id">
        </a-table>
        <!-- <s-table
          ref="attendance"
          size="default"
          :rowKey="row => row.id"
          :columns="columns"
          :data="loadAttendance"
          :scroll="scroll"
          class="content-list"
        >
        </s-table> -->
      </div>
    </div>
    <!--  Activites -->
    <div v-show="currentType === 'activities'">
      <div class="status-filter">
        <a-radio-group v-model="currentActivity" button-style="solid">
          <a-radio-button
            v-for="(item,index) in activityList"
            :value="item.value"
            :key="'activity'+index">
            {{ item.title }}
          </a-radio-button>
        </a-radio-group>
        <label>Class: {{ currentClassName }}</label>
      </div>
      <chat-list ref='chatList' v-show="currentActivity === 'messages'" :classId="classId"/>
      <to-do-list
        v-show="currentActivity === 'todos'"
        :list="classStudentTodos.listByClassId"
        :save="classStudentTodos.save"
        :todo="classStudentTodos.todo"
        :done="classStudentTodos.done"
        :todoDelete="classStudentTodos.todoDelete"
        :classId="classId"/>
    </div>
  </div>
</template>

<script>
import * as logger from '@/utils/logger'
import { CustomTagType, StudentStudyTaskStatus, CurriculumType, SESSION_VIEW_MODE, USER_MODE, TASK_STATUS } from '@/const/common'

import MyTaskList from '@/components/Student/MyTaskList'
import ToDoList from '@/components/ToDoList'
import ChatList from '@/components/ChatList'
import { STable } from '@/components'

import LiebiaoSvg from '@/assets/svgIcon/myContent/liebiao.svg?inline'
import PubuSvg from '@/assets/svgIcon/myContent/pubu.svg?inline'
import FilterIcon from '@/assets/libraryv2/filter.svg?inline'
import FilterActiveIcon from '@/assets/libraryv2/filter_active.svg?inline'
import CollaborateSvg from '@/assets/icons/collaborate/collaborate_group.svg?inline'

import { SchoolTaskList, queryMySessions } from '@/api/selfStudy'
import { FindCustomTags } from '@/api/tag'
import { SubjectTree } from '@/api/subject'
import { GetGradesByCurriculumId } from '@/api/preference'
import * as classStudentTodos from '@/api/classStudentTodos'

import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'

import storage from 'store'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'MyClasses',
  mixins: [UserModeMixin, CurrentSchoolMixin],
  components: {
    FilterIcon,
    FilterActiveIcon,
    LiebiaoSvg,
    PubuSvg,
    CollaborateSvg,
    MyTaskList,
    STable,
    ToDoList,
    ChatList
  },
  props: {
    classId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: true,
      startLoading: false,
      attendanceLoading: false,
      classStudentTodos: classStudentTodos,
      currentStatus: '',
      currentType: 'task',
      currentActivity: 'messages',
      USER_MODE: USER_MODE,
      TASK_STATUS: TASK_STATUS,
      tabsList: [{
          value: 'task',
          title: 'Tasks&Units'
      },
      // {
      //     value: 'evaluations',
      //     title: 'Evaluations'
      // },
      {
          value: 'attendance',
          title: 'Attendance'
      }, {
          value: 'activities',
          title: 'Activities'
      }],
      activityList: [{
          value: 'messages',
          title: 'Messages'
      }, {
          value: 'todos',
          title: 'To dos'
      }],
      // 当前选中的配置项
      filterConfig: {
        age: [],
        subject: [],
        period: '',
        faSaActivityType: '',
        unitType: '',
        projectBased: '',
        faTags: [],
        saTags: [],
        activityTags: []
      },
      filterSubjectOptions: [],
      filterAgeOptions: [],
      filterPeriodOptions: [],
      filterSaOptions: [],
      filterFaOptions: [],
      filterActivityOptions: [],
      showFilter: false,
      filterParams: {
        subject: []
      },
      queryAttendance: {
        searchKey: '',
        sessionType: 'mySessionList'
      },
      lastedRevisionId: '',
      searchText: '',
      viewMode: storage.get(SESSION_VIEW_MODE) ? storage.get(SESSION_VIEW_MODE) : 'img',
      attendanceData: {
        absentSessionSize: 0,
        attendanceSessionSize: 0,
        mySessionSize: 0,
        absentSessionList: [],
        attendanceSessionList: [],
        mySessionList: []
      },

      loadData: (pageParams) => {
        let params = {
          status: this.currentStatus,
          classId: this.classId,
          schoolId: this.currentSchool.id,
          searchKey: this.searchText ? this.searchText : '',
          ...pageParams
        }
        if (this.filterParams) {
          params = Object.assign(this.filterParams, params)
        }
        return SchoolTaskList(params)
      },
      scroll: {}
    }
  },
  computed: {
    ...mapState({
      userMode: state => state.app.userMode,
      classList: state => state.user.classList,
      currentSchool: state => state.user.currentSchool

    }),
    ...mapGetters(['currentClassList']),
    statusList() {
      return StudentStudyTaskStatus.filter(item => {
        // archived 只有自学模式有
        if (this.userMode === USER_MODE.SCHOOL && item.value === TASK_STATUS.ARCHIVED) return false
        // scheduled 只有学校模式有
        if (this.userMode === USER_MODE.SELF && item.value === TASK_STATUS.SCHEDULED) return false
        return true
      })
    },
    columns() {
      const results = [
         {
          title: 'Starting time',
          dataIndex: 'date',
          width: '200px',
          // sorter: true,
          customRender: (text) => this.$options.filters['dayjs1'](text * 1000)
        },
        {
          title: 'Status',
          dataIndex: 'status',
          width: '200px'
        },
        {
          title: 'Session name',
          dataIndex: 'sessionName'
          // width: '300px'
        }
      ]
      return results
    },
    currentClassName() {
      return (this.currentClassList.find(item => item.id === this.classId) || { name: '' }).name
    },
    attendanceRate() {
      if (this.attendanceData.mySessionSize > 0) {
        return (this.attendanceData.attendanceSessionSize / this.attendanceData.mySessionSize * 100).toFixed(2)
      } else {
        return '0.00'
      }
    },
    attendanceList() {
      const list = this.attendanceData[this.queryAttendance.sessionType] || []
      return list.filter(item => item.sessionName.toLowerCase().indexOf(this.queryAttendance.searchKey.toLowerCase()) > -1)
    }
  },
  created () {
    logger.info('student my content')
    const currentClass = this.currentClassList.find(item => item.id === this.classId)
    if (!currentClass) {
      this.$router.push({ path: '/student/main/my-task' })
    }
    this.initFilterOption()
    this.loadAttendance()
  },
  watch: {
    classId: {
      handler(newVal) {
        const currentClass = this.currentClassList.find(item => item.id === newVal)
        if (!currentClass) {
          this.$router.push({ path: '/student/main/my-task' })
        } else {
          this.$refs.myTaskList.loadMyContent()
          this.loadAttendance()
        }
      }
    }
  },
  methods: {
    handleSchoolChange(school) {
      if (this.classList && this.classList.length > 0) {
        const currentClass = this.classList.filter(item => item.schoolId === school.id)
        if (currentClass.length === 0) {
          this.$router.push({ path: '/student/main/my-task' })
        }
        if (!currentClass.find(item => item.id === this.classId)) {
          const classId = this.currentClassList[0].id
          this.$router.push(`/student/main/my-classes/${classId}`)
        }
      }
    },
    loadAttendance() {
      const params = {
        ...this.queryAttendance,
        classId: this.classId
      }
      this.attendanceLoading = true
      queryMySessions(params)
        .then(res => {
          if (res.success) {
            this.attendanceData = {
              ...this.attendanceData,
              ...res.result
            }
          }
        })
        .finally(() => {
          this.attendanceLoading = false
        })
    },
    initFilterOption() {
      SubjectTree({ curriculumId: CurriculumType.Cambridge }).then(response => {
        this.$logger.info('getSubjectTree response', response.result)
        this.filterSubjectOptions = []
        response.result.forEach(subject => {
          this.filterSubjectOptions.push({ label: subject.name, value: subject.id })
        })
      })
      GetGradesByCurriculumId({ curriculumId: CurriculumType.Cambridge }).then(response => {
        this.$logger.info('GetGradesByCurriculumId', response.result)
        this.filterAgeOptions = []
        response.result.forEach(grade => {
          this.filterAgeOptions.push({ label: grade.name, value: grade.id })
        })
      })
      this.loadUserTags()
      this.filterPeriodOptions = [
        { label: 'This month', value: 'month' },
        { label: 'Last 7 days', value: '7' }
      ]
    },
    loadUserTags () {
      // this.$refs.customTag.tagLoading = true
      FindCustomTags({}).then((response) => {
        this.$logger.info('FindCustomTags response', response.result)
        if (response.success) {
          this.filterSaOptions = []
          this.filterFaOptions = []
          this.filterActivityOptions = []
          const recommends = response.result.recommends
          // 默认展示的tag分类
          CustomTagType.task.sa.forEach(name => {
            recommends.forEach(parent => {
              if (parent.name === name) {
                this.filterSaOptions.push(parent)
              }
            })
          })
          CustomTagType.task.fa.forEach(name => {
            recommends.forEach(parent => {
              if (parent.name === name) {
                this.filterFaOptions.push(parent)
              }
            })
          })
          CustomTagType.task.activity.forEach(name => {
            recommends.forEach(parent => {
              if (parent.name === name) {
                this.filterActivityOptions.push(parent)
              }
            })
          })
        }
      })
    },
    toggleStatus (status) {
      this.currentStatus = status
    },
    toggleType (val) {
      this.currentType = val
      if (val === 'activities') {
        this.$refs.chatList.goBottom()
      }
    },
    toggleViewMode (viewMode) {
      storage.set(SESSION_VIEW_MODE, viewMode)
      this.viewMode = viewMode
    },
    toggleSessionType(sessionType) {
      this.queryAttendance.sessionType = sessionType
      // this.$refs.attendance.refresh()
    },
    handleChangeSubject (subjects) {
      console.log(this.filterParams)
      this.$refs.myTaskList.loadMyContent()
    },
    handleUpdateFilterConfig (filter) {
      // TODO 根据配置更新请求参数
      this.$logger.info('handleUpdateFilterConfig', filter)
      this.filterParams = filter
      this.$refs.myTaskList.loadMyContent()
    },
    triggerSearch() {
      switch (this.currentType) {
        case 'task':
          this.$refs.myTaskList.loadMyContent()
          break
        case 'attendance':
          // this.$refs.attendance.refresh(true)
          break
        default:
          break
      }
    }
  }
}
</script>

<style scoped lang="less">
@import "~@/components/index.less";
.ant-list-item {
  padding: 8px 0;
  position: relative;
}

.active-item {
  background-color: fade(@outline-color, 20%);
  color: @primary-color;
}

.my-list-item {
  min-width: 800px;
  opacity: 1;
  width: 100%;
  border-radius: 4px;
  background: #FFFFFF;
  padding: 15px 10px;
  margin-bottom: 15px;
  cursor: pointer;
  .collaborate-icon-item{
    width:30px;
    height: 30px;
    margin-left: 10px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.my-content {
  padding: 0 15px 25px 15px;
  .filter-line {
    padding: 15px 0;
    display: flex;
    justify-content: space-between;
    .status-tab {
      cursor: pointer;
      display: flex;
      flex-direction: row;
      align-items: center;
      .toggle-mode-type-wrapper {
        width: 280px;
        box-sizing: border-box;
        .toggle-mode-type {
          height: 40px;
          display: inline-block;
          border-radius: 40px;
          background: rgba(228, 228, 228, 0.3);

          .toggle-mode {
            border-radius: 40px;
            height: 40px;
            display: flex;
            flex-direction: row;
            font-size: 14px;

            //.mode-item:first-child {
            //  border-bottom-left-radius: 35px;
            //  border-top-left-radius: 35px;
            //}
            //
            //.mode-item:last-child {
            //  border-bottom-right-radius: 35px;
            //  border-top-right-radius: 35px;
            //}

            .mode-item {
              padding: 0 10px;
              font-size: 14px;
              height: 40px;
              color: rgba(17, 20, 45, 1);
              border-radius: 40px;
              font-family: Inter-Bold;
              display: flex;
              align-items: center;
              justify-content: center;
              white-space: nowrap;
            }

            .active-mode {
              color: #fff;
              background: rgba(21, 195, 154, 1);
            }
          }
        }
      }
    }

    .type-owner {
      min-height: 40px;
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .my-search{
      margin-right: 10px;
      border-radius:6px;
      width: 200px;
      /deep/ .ant-input{
        border-radius:6px;
        height: 40px;
        font-size: 14px;
      }
    }

    .filter-icon {
      .filter-item {
        color: #333;
        cursor: pointer;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        background: #FFFFFF;
        border: 1px solid #D3D3D3;
        opacity: 1;
        border-radius: 6px;
        padding: 9px 15px;
        white-space:nowrap;
        margin-right: 20px;

        svg {
          height: 20px;
        }
        .filter-active-icon {
          display: none;
        }
        .filter-icon {
          display: inline;
        }

        &:hover {
          color: #38cfa6;
          border: 1px solid #38cfa6;
          .filter-active-icon {
            display: inline;
          }

          .filter-icon {
            display: none;
          }
        }

        .filter-label {
          font-family: Inter-Bold;
          line-height: 20px;
          padding-left: 8px;
        }
      }
    }

    .filter-option {
      width: 220px;
      .filter-item {
        width: 100%;
        line-height: 40px;
        font-size: 14px;
      }
    }

  }
  .filter-params{
    margin-bottom: 5px;
    border: 1px solid #E4E4E4;
    padding: 5px 15px;
    border-radius: 5px;
    max-height: 290px;
    overflow: auto;
    background: rgba(228, 228, 228, 0.2);

    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
    }
    &::-webkit-scrollbar-track {
      border-radius: 3px;
      background: rgba(0,0,0,0.00);
      box-shadow: inset 0 0 5px rgba(0,0,0,0.01);
    }
    /* 滚动条滑块 */
    &::-webkit-scrollbar-thumb {
      border-radius: 5px;
      background: rgba(0,0,0,0.12);
      box-shadow: inset 0 0 10px rgba(0,0,0,0.01);
    }
  }
  .expand-icon {
    margin-bottom: 10px;
    cursor: pointer;
    line-height: 30px;
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;

    i {
      padding: 0 5px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      svg {
        font-size: 23px;
      }
    }
  }

}
a.delete-action {
  color: @red-4;
}

.view-mode-toggle {
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin-right: 10px;
  background: #FFFFFF;
  border: 1px solid #D8D8D8;
  opacity: 1;
  border-radius: 6px;
  height: 40px;
  padding: 0px 15px;
  margin-left: 20px;

  &:hover {
    border: 1px solid #15c39a;
  }
  .view-mode {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    color: @text-color-secondary;

    .view-mode-item {
      font-size: 20px;
      padding-left: 5px;
      margin: 0 3px;
      display: flex;
      flex-direction: row;
      align-items: center;

      svg {
        height: 22px;
      }
    }

    .active-view {
      svg {
        fill: @primary-color;
      }
    }
  }
}
.status-filter {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  /deep/ span {
    font-size: 13px;
  }
}
.attendance-summary {
  margin-bottom: 20px;
  .attendance-card {
    text-align: center;
    background: #ececec;
    border: 1px solid transparent;
    cursor: pointer;
    &.active {
        border: 1px solid blueviolet;
        background: #E7F9F5;
    }
  }
}
</style>
