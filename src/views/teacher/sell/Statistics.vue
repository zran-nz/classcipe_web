<template>
  <div class="my-content" ref="tableCon">
    <a-tabs type="card" class="my-tab" size="large" v-model="currentType">
      <a-tab-pane key="teacher" tab="Inspiration for teachers">
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
              v-model="teacherFilter.types"
              mode="multiple"
              allowClear
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
          <div slot="reviews" slot-scope="text, record">
            <review-score placement="left" :id="record.id"/>
          </div>
        </s-table>
      </a-tab-pane>
      <a-tab-pane key="student" tab="Inspiration for students">
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
              v-model="studentFilter.types"
              class="filter-item"
              mode="multiple"
              allowClear
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
          <div slot="reviews" slot-scope="text, record">
            <review-score placement="left" :id="record.id"/>
          </div>
        </s-table>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import * as logger from '@/utils/logger'

import { typeMap } from '@/const/teacher'

import { STable } from '@/components'
import ReviewScore from '@/components/Reviews/ReviewScore'

import FilterIcon from '@/assets/libraryv2/filter.svg?inline'
import FilterActiveIcon from '@/assets/libraryv2/filter_active.svg?inline'

import { myStatisticsStudent, myStatisticsTeacher } from '@/api/statistics'

export default {
  name: 'TeacherSellStatistics',
  components: {
    FilterIcon,
    FilterActiveIcon,
    STable,
    ReviewScore
  },
  data() {
    return {
      loading: true,
      startLoading: false,
      currentType: 'teacher',
      productTypeListTeacher: [
        {
          value: typeMap['unit-plan'],
          label: 'Unit plan'
        },
        {
          value: typeMap.task,
          label: 'Task'
        },
        {
          value: typeMap.evaluation,
          label: 'Assessment'
        }
      ],
      productTypeListStudent: [
        {
          value: typeMap.task,
          label: 'Task'
        },
        {
          value: 8,
          label: 'Tips'
        }
      ],
      showFilter: false,
      teacherFilter: {
        types: [],
        searchKey: ''
      },
      studentFilter: {
        types: [],
        searchKey: ''
      },

      sortFields: {
        name: 3,
        publishedTime: 4,
        price: 5,
        preview: 6,
        saved: 7,
        sold: 8,
        conversion: 9,
        earnings: 10,
        reviews: 11
      },
      sortOrders: {
        ascend: 1,
        descend: 2
      },

      loadTeacherData: (pageParams) => {
        const params = {
          ...this.teacherFilter,
          ...pageParams,
          sortField: this.sortFields[pageParams.sortField],
          sortType: this.sortOrders[pageParams.sortOrder]
        }
        console.log(params)
        return myStatisticsTeacher(params).then(res => {
          return res.result
        })
      },
      loadStudentData: (pageParams) => {
        const params = {
          ...this.studentFilter,
          ...pageParams,
          sortField: this.sortFields[pageParams.sortField],
          sortType: this.sortOrders[pageParams.sortOrder]
        }
        console.log(params)
        return myStatisticsStudent(params).then(res => {
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
          dataIndex: 'purchasesName',
          width: '200px',
          sorter: true
        },
        {
          title: 'Published time',
          dataIndex: 'publishTime',
          width: '150px',
          sorter: true
        },
        {
          title: 'Price',
          dataIndex: 'price',
          width: '120px',
          sorter: true
        },
        {
          title: 'Previews',
          dataIndex: 'previews',
          width: '120px',
          sorter: true
        },
        {
          title: 'Saved',
          dataIndex: 'saved',
          width: '120px',
          sorter: true
        },
        {
          title: 'Sold',
          dataIndex: 'sold',
          width: '120px',
          sorter: true
        }
      ]
      if (this.currentType === 1) {
        results = results.concat([
          {
            title: 'Conversion',
            dataIndex: 'conversion',
            width: '120px',
            sorter: true
          }
        ])
      } else {
        results = results.concat([
          {
            title: 'Linked content',
            dataIndex: 'linkedContent',
            width: '150px'
          }
        ])
      }
      results = results.concat([
        {
          title: 'Earnings',
          dataIndex: 'earnings',
          width: '150px',
          sorter: true,
          customRender: (text) => this.$options.filters['percentFormat'](text)
        },
        {
          title: 'Reviews',
          dataIndex: 'reviews',
          sorter: true,
          width: '200px',
          scopedSlots: { customRender: 'reviews' }
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
      this.$refs[this.currentType + 'Table'] && this.$refs[this.currentType + 'Table'].refresh()
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
  width: 350px;
  .filter-item {
    width: 100%;
    line-height: 40px;
    font-size: 14px;
  }
}
</style>
