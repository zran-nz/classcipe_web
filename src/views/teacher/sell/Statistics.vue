<template>
  <div class="my-content" ref="tableCon">
    <a-tabs type="card" class="my-tab" size="large" v-model="currentType">
      <a-tab-pane :key="1" tab="Inspiration for teachers">
        <div class="my-filter">
          <div class="my-search">
            <a-input-search
              placeholder="Search"
              v-model="teacherFilter.searchKey"
              @search="triggerSearch"
              @pressEnter="triggerSearch"
              :allowClear="true"
              size="large"
            >
            </a-input-search>
          </div>
          <div class="filter-option">
            <a-select
              v-model="teacherFilter.productType"
              class="filter-item"
              size="large"
              @change="triggerSearch"
              placeholder="Search by product type"
            >
              <a-select-option :value="item.value" v-for="(item, index) in productTypeListTeacher" :key="'producttype_'+index">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </div>
        </div>
        <s-table
          ref="teacherTable"
          size="default"
          :rowKey="row => row.id"
          :columns="columns"
          :data="loadTeacherData"
          :scroll="scroll"
          class="content-list"
        >
        </s-table>
      </a-tab-pane>
      <a-tab-pane :key="2" tab="Inspiration for students">
        <div class="my-filter">
          <div class="my-search">
            <a-input-search
              placeholder="Search"
              v-model="studentFilter.searchKey"
              @search="triggerSearch"
              @pressEnter="triggerSearch"
              :allowClear="true"
              size="large"
            >
            </a-input-search>
          </div>
          <div class="filter-option">
            <a-select
              v-model="studentFilter.productType"
              class="filter-item"
              size="large"
              @change="triggerSearch"
              placeholder="Search by product type"
            >
              <a-select-option :value="item.value" v-for="(item, index) in productTypeListStudent" :key="'producttypestudent_'+index">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </div>
        </div>
        <s-table
          ref="studentTable"
          size="default"
          :rowKey="row => row.id"
          :columns="columns"
          :data="loadStudentData"
          :scroll="scroll"
          class="content-list"
        >
        </s-table>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import * as logger from '@/utils/logger'
import { TASK_STATUS } from '@/const/common'

import MyTaskList from '@/components/Student/MyTaskList'
import { STable } from '@/components'

import LiebiaoSvg from '@/assets/svgIcon/myContent/liebiao.svg?inline'
import PubuSvg from '@/assets/svgIcon/myContent/pubu.svg?inline'
import FilterIcon from '@/assets/libraryv2/filter.svg?inline'
import FilterActiveIcon from '@/assets/libraryv2/filter_active.svg?inline'
import CollaborateSvg from '@/assets/icons/collaborate/collaborate_group.svg?inline'

import { SelfStudyTaskList } from '@/api/selfStudy'

export default {
  name: 'TeacherSellStatistics',
  components: {
    FilterIcon,
    FilterActiveIcon,
    LiebiaoSvg,
    PubuSvg,
    CollaborateSvg,
    MyTaskList,
    STable
  },
  data() {
    return {
      loading: true,
      startLoading: false,
      currentType: 1,
      TASK_STATUS: TASK_STATUS,
      productTypeListTeacher: [
        {
          value: '',
          label: 'All Product Types'
        },
        {
          value: '1',
          label: 'Unit plan'
        },
        {
          value: '2',
          label: 'Task'
        },
        {
          value: '3',
          label: 'Assessment'
        }
      ],
      productTypeListStudent: [
        {
          value: '',
          label: 'All Product Types'
        },
        {
          value: '1',
          label: 'Task'
        },
        {
          value: '2',
          label: 'Tips'
        }
      ],
      showFilter: false,
      teacherFilter: {
        productType: '',
        searchKey: ''
      },
      studentFilter: {
        productType: '',
        searchKey: ''
      },

      loadTeacherData: (pageParams) => {
        const params = {
          ...this.teacherFilter,
          ...pageParams
        }
        return SelfStudyTaskList(params).then(res => {
          return res.result
        })
      },
      loadStudentData: (pageParams) => {
        const params = {
          ...this.studentFilter,
          ...pageParams
        }
        return SelfStudyTaskList(params).then(res => {
          return res.result
        })
      },
      scroll: {}
    }
  },
  computed: {
    columns() {
      let results = [
        {
          title: 'Name',
          dataIndex: 'name',
          width: '200px'
        },
        {
          title: 'Published time',
          dataIndex: 'publishedTime',
          width: '150px'
        },
        {
          title: 'Price',
          dataIndex: 'price',
          width: '150px'
        },
        {
          title: 'Preview',
          dataIndex: 'preview',
          width: '150px'
        },
        {
          title: 'Saved',
          dataIndex: 'saved',
          width: '150px'
        },
        {
          title: 'Sold',
          dataIndex: 'sold',
          width: '150px'
        }
      ]
      if (this.currentType === 1) {
        results = results.concat([
          {
            title: 'Conversion',
            dataIndex: 'conversion',
            width: '150px'
          }
        ])
      } else {
        results = results.concat([
          {
            title: 'Linked content',
            dataIndex: 'content',
            width: '200px'
          }
        ])
      }
      results = results.concat([
        {
          title: 'Earnings',
          dataIndex: 'earning',
          width: '150px',
          // sorter: true,
          customRender: (text) => this.$options.filters['percentFormat'](text)
        },
        {
          title: 'Reviews',
          dataIndex: 'reviews',
          width: '150px'
        }
      ])
      return results
    }
  },
  created () {
    logger.info('statistics my content')
    this.init()
  },
  mounted() {
    this.resetTableWidth()
  },
  methods: {
    init() {
    },
    resetTableWidth() {
      const totalWidth = this.columns.map(item => {
        if (item.width && item.width !== 'auto') {
          return parseInt(item.width)
        } else {
          return 0
        }
      }).reduce((prev, current) => {
        console.log(current)
        return prev + current
      }, 0)
      const conWidth = this.$refs.tableCon.getBoundingClientRect().width
      if (conWidth > totalWidth) {
        this.columns[0].width = 'auto'
      } else {
        this.scroll = {
          x: totalWidth
        }
        this.columns[this.columns.length - 1].fixed = 'right'
      }
    },
    toggleType (type) {
      this.currentType = type
    },
    triggerSearch() {
      this.$refs.myTaskList && this.$refs.myTaskList.loadMyContent()
    }
  }
}
</script>

<style scoped lang="less">
@import "~@/components/index.less";
.my-content {
  position: relative;
  .my-tab {
    position: relative;
    /deep/ .ant-tabs-nav-container {
      height: 50px;
    }
    /deep/ .ant-tabs-content {
      margin-top: -16px;
      .ant-tabs-tabpane {
        background: #fff;
        padding: 0px;
      }
    }
    /deep/ .ant-tabs-bar {
      border-color: #fff;
      .ant-tabs-tab {
        height: 50px;
        line-height: 48px;
        border-color: transparent;
        background: transparent;
      }
      .ant-tabs-tab-active {
        border-color: #fff;
        background: #fff;
      }
    }
  }
}
.my-filter {
  min-height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: absolute;
  right: 0;
  top: 0;
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
</style>
