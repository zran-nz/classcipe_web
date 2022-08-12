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
            v-show="currentType === 'productTeacher'"
            v-model="queryTeacher.searchKey"
            @search="triggerSearch"
            @pressEnter="triggerSearch"
            :allowClear="true"
            size="large"
          >
          </a-input-search>
          <a-input-search
            placeholder="Search"
            v-show="currentType === 'productStudent'"
            v-model="queryStudent.searchKey"
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

    <!--  Dashboard -->
    <div v-show="currentType === 'dashboard'">
      <div class="attendance-summary">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-card class="attendance-card">
              <h4>Task earning</h4>
              <p>{{ summaryData.mySessionSize }}</p>
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card class="attendance-card">
              <h4>Consulting earning</h4>
              <p>{{ summaryData.attendanceSessionSize }}</p>
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card class="attendance-card">
              <h4>Other</h4>
              <p>{{ summaryData.absentSessionSize }}</p>
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card class="attendance-card">
              <h4>Total</h4>
              <p>$ 13</p>
            </a-card>
          </a-col>
        </a-row>
      </div>
      <div class="">

      </div>
    </div>
    <!--  Product for Teacher -->
    <div v-show="currentType === 'productTeacher'">
      <s-table
        ref="teacherTable"
        size="default"
        :rowKey="row => row.id"
        :columns="teacherColumns"
        :data="loadTeacherData"
        :scroll="scroll"
        class="content-list"
      >
      </s-table>
    </div>
    <!--  Product for student -->
    <div v-show="currentType === 'productStudent'">
      <s-table
        ref="studentTable"
        size="default"
        :rowKey="row => row.id"
        :columns="teacherColumns"
        :data="loadStudentData"
        :scroll="scroll"
        class="content-list"
      >
      </s-table>
    </div>
  </div>
</template>

<script>
import * as logger from '@/utils/logger'

import LiebiaoSvg from '@/assets/svgIcon/myContent/liebiao.svg?inline'
import PubuSvg from '@/assets/svgIcon/myContent/pubu.svg?inline'
import FilterIcon from '@/assets/libraryv2/filter.svg?inline'
import FilterActiveIcon from '@/assets/libraryv2/filter_active.svg?inline'
import CollaborateSvg from '@/assets/icons/collaborate/collaborate_group.svg?inline'

import { STable } from '@/components'

import { SchoolTaskList } from '@/api/selfStudy'

export default {
  name: 'TeacherSell',
  components: {
    FilterIcon,
    FilterActiveIcon,
    LiebiaoSvg,
    PubuSvg,
    CollaborateSvg,
    STable
  },
  data() {
    return {
      loading: true,
      studentLoading: false,
      teacherLoading: false,
      currentType: 'dashboard',

      tabsList: [{
          value: 'dashboard',
          title: 'Dashboard'
      }, {
          value: 'productTeacher',
          title: 'Product for teacher'
      }, {
          value: 'productStudent',
          title: 'Product for student'
      }],

      filterParams: {},
      showFilter: false,

      querySummary: {
        start: '',
        end: ''
      },
      queryTeacher: {
        searchKey: ''
      },
      queryStudent: {
        searchKey: ''
      },

      summaryData: {

      },
      teacherData: {
        absentSessionSize: 0,
        attendanceSessionSize: 0,
        mySessionSize: 0
      },

      loadTeacherData: (pageParams) => {
        logger.info('loadTeacherData.parameter', pageParams)
        let params = {
          ...this.queryTeacher,
          ...pageParams
        }
        if (this.filterParams) {
          params = Object.assign(this.filterParams, params)
        }
        return SchoolTaskList(params)
      },
      loadStudentData: (pageParams) => {
        logger.info('loadStudentData.parameter', pageParams)
        let params = {
          ...this.queryStudent,
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
    teacherColumns() {
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
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    loadData() {
      this.loadDashboard()
    },
    loadDashboard() {
      // const params = {
      //   ...this.querySummary
      // }
      // this.loading = true
      // loadDashboard(params)
      //   .then(res => {
      //     if (res.success) {
      //       this.summaryData = {
      //         ...this.summaryData,
      //         ...res.result
      //       }
      //     }
      //   })
      //   .finally(() => {
      //     this.loading = false
      //   })
    },
    toggleType (val) {
      this.currentType = val
    },
    triggerSearch() {
      switch (this.currentType) {
        case 'dashboard':
          this.loadDashboard()
          break
        case 'productTeacher':
          this.$refs.teacherTable.refresh(true)
          break
        case 'productStudent':
          this.$refs.studentTable.refresh(true)
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
              padding: 0 15px;
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
</style>
