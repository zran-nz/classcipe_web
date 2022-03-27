<template>
  <div class="my-content">
    <a-tabs type="card" @change="changeTab" class="my-tab">
      <a-tab-pane key="1">
        <span slot="tab">
          <a-icon type="area-chart" />
          Dashboard
        </span>
        <div class="dashboard-content">
          <div class="dashboard-filter">
            <div class="filter-base">
              <div class="filter-options">
                <label>
                  SHOW ME
                  <a-tooltip placement="right">
                    <template slot="title">
                      <span>prompt text</span>
                    </template>
                    <a-icon type="question-circle" />
                  </a-tooltip>
                </label>
                <a-select
                  v-model="filterParams.statisticsType"
                  class="filter-item"
                  size="large"
                  @change="triggerSearch"
                  placeholder="Search by type"
                >
                  <a-select-option :value="item.value" v-for="(item, index) in typeOptions" :key="'type_'+index">
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </div>
              <div class="filter-options">
                <label>DURING</label>
                <div>
                  <a-select
                    v-model="filterParams.duringsType"
                    class="filter-item"
                    size="large"
                    @change="triggerSearch"
                    placeholder="Select a during"
                  >
                    <a-select-option :value="item.value" v-for="(item, index) in duringOptions" :key="'type_'+index">
                      {{ item.label }}
                    </a-select-option>
                  </a-select>
                  <a-range-picker
                    size="large"
                    style="margin-left: 10px;"
                    v-show="filterParams.duringsType === 7"
                    v-model="filterParams.during"
                    @change="onChangeDate"
                  />
                </div>
              </div>
            </div>
            <div class="filter-summary">
              <div class="summary-title">{{ title }}</div>
              <div class="summary-total">${{ sum | percentFormat }}</div>
            </div>
          </div>
          <div class="dashboard-chart">
            <e-line
              :datas="dataSource"
              height="350px"
            />
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import moment from 'moment'

import { DATERANGE_FOR_CHARTS, DURING_TYPE } from '@/const/dateRange'
import { STATISTICS_TYPE } from '@/const/common'
// import { getDaysBetweenDates } from '@/utils/util'

import { dashboard } from '@/api/statistics'

import ELine from '@/components/ECharts/Line'

export default {
  name: 'TeacherSellDashboard',
  components: {
    ELine
  },
  data() {
    return {
      loading: false,
      DATERANGE_FOR_CHARTS: DATERANGE_FOR_CHARTS,
      typeOptions: Object.values(STATISTICS_TYPE),
      duringOptions: DURING_TYPE,
      filterParams: {
        statisticsType: 1,
        duringsType: 1,
        during: [moment().startOf('month').startOf('day'), moment().endOf('day')]
      },
      dataSource: [{
        name: 'line',
        type: 'line',
        symbol: 'none',
        smooth: true,
        data: []
      }],
      sum: 0
    }
  },
  created() {
    this.init()
  },
  computed: {
    title() {
      const typeObj = this.typeOptions.find(item => item.value === this.filterParams.statisticsType)
      if (this.filterParams.duringsType !== 7) {
        const key = this.duringOptions.find(item => item.value === this.filterParams.duringsType).label
        // during = DATERANGE_FOR_CHARTS[key]
        return key.toUpperCase() + ' ' + (typeObj ? typeObj.label.toUpperCase() : '')
      } else {
        const during = this.filterParams.during
        if (during.length === 2) {
          const [start, end] = during
          return start.format('MM/DD/YY') + ' - ' + end.format('MM/DD/YY') + ' ' + (typeObj ? typeObj.label.toUpperCase() : '')
        }
      }
      return ' - '
    }
  },
  methods: {
    init() {
      this.initChart()
    },
    initChart() {
      // const dateRange = getDaysBetweenDates(...this.filterParams.during)
      // this.dataSource[0].data = []
      // dateRange.forEach(date => {
      //   this.dataSource[0].data.push({
      //     date: date,
      //     value: Math.random() * 1000
      //   })
      // })
      const params = {
        duringsType: this.filterParams.duringsType,
        statisticsType: this.filterParams.statisticsType,
        startTime: this.filterParams.during[0].startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        endTime: this.filterParams.during[1].endOf('day').format('YYYY-MM-DD HH:mm:ss')
      }
      console.log(params)
      this.loading = true
      dashboard(params).then(res => {
        console.log(res)
        if (res && res.success) {
          console.log(res.result)
          this.sum = res.result.sum

          this.dataSource[0].data = this.convertAxis(res.result.data)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    convertAxis(data) {
      const WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      // const MONTH = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      let datasource = [ ...data ]
      if (this.filterParams.duringsType === 1) {
        datasource = datasource.map(item => {
          return {
            date: moment(item.date).format('HH:mm'),
            value: item.value
          }
        })
      } else if (this.filterParams.duringsType === 2) {
        datasource = datasource.map(item => {
          return {
            date: WEEK[moment(item.date).day()],
            value: item.value
          }
        })
      // } else if (this.filterParams.duringsType === 5) {
      //   const _data = datasource.map(item => {
      //     return {
      //       date: MONTH[moment(item.date).month()],
      //       value: item.value
      //     }
      //   })
      //   datasource = []
      //   _data.forEach(item => {
      //     const findItem = datasource.find(_ => _.date === item.date)
      //     if (findItem) {
      //       findItem.value += item.value
      //     } else {
      //       datasource.push({
      //         ...item
      //       })
      //     }
      //   })
      } else {
        datasource = datasource.map(item => {
          return {
            date: item.date.split(' ')[0],
            value: item.value
          }
        })
      }
      return datasource
    },
    changeTab(key) {

    },
    onChangeDate(dates, dateStrings) {
      this.triggerSearch()
    },
    triggerSearch() {
      this.init()
    }
  }
}
</script>

<style scoped lang="less">
.my-content {
  position: relative;
  .my-tab {
    position: relative;
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
        border-color: transparent;
        background: transparent;
      }
      .ant-tabs-tab-active {
        border-color: #fff;
        background: #fff;
      }
    }
  }
  .dashboard-content {
    display: flex;
    flex-direction: column;
    .dashboard-filter {
      display: flex;
      align-items: center;
      border-bottom: 1px solid #dfdfdf;
      .filter-base {
        display: flex;
        flex: 1;
        border-right: 1px solid #dfdfdf;
        padding: 20px;
        .filter-options {
          margin-right: 20px;
          display: flex;
          flex-direction: column;
          label {
            font-size: 14px;
            margin-bottom: 5px;
          }
          .filter-item {
            width: 180px;
            line-height: 40px;
            font-size: 14px;
          }
        }
      }
      .filter-summary {
        display: flex;
        flex-direction: column;
        width: 300px;
        padding: 20px;
        .summary-title {
          font-size: 12px;
          line-height: 20px;
        }
        .summary-total {
          font-size: 30px;
        }
      }
    }
    .dashboard-chart {
      padding: 20px;
    }
  }
}
</style>
