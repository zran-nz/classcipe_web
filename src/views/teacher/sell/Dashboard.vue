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
                  v-model="filterParams.type"
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
                    v-model="filterParams.duringType"
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
                    v-show="filterParams.duringType === 6"
                    v-model="filterParams.during"
                    @change="onChangeDate"
                  />
                </div>
              </div>
            </div>
            <div class="filter-summary">
              <div class="summary-title">{{ title }}</div>
              <div class="summary-total">$0.00</div>
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

import { DATERANGE_FOR_CHARTS } from '@/const/dateRange'
import { getDaysBetweenDates } from '@/utils/util'

import ELine from '@/components/ECharts/Line'

export default {
  name: 'TeacherSellDashboard',
  components: {
    ELine
  },
  data() {
    return {
      DATERANGE_FOR_CHARTS: DATERANGE_FOR_CHARTS,
      typeOptions: [
        {
          value: 1,
          label: 'Earnings'
        },
        {
          value: 2,
          label: 'Conversions'
        },
        {
          value: 3,
          label: 'Previews'
        },
        {
          value: 4,
          label: 'Unis sold'
        },
        {
          value: 5,
          label: 'Tasks sold'
        },
        {
          value: 6,
          label: 'Assessement sold'
        }
      ],
      duringOptions: [{
        value: 1,
        label: 'Today'
      }, {
        value: 2,
        label: 'This week'
      }, {
        value: 3,
        label: 'This month'
      }, {
        value: 4,
        label: 'This quarter'
      }, {
        value: 5,
        label: 'This year'
      }, {
        value: 6,
        label: 'Custom Range'
      }],
      filterParams: {
        type: 1,
        duringType: 1,
        during: [moment().startOf('month').startOf('day'), moment().endOf('day')]
      },
      dataSource: [{
        name: 'line',
        type: 'line',
        symbol: 'none',
        smooth: true,
        data: []
      }]
    }
  },
  created() {
    this.init()
  },
  computed: {
    title() {
      const typeObj = this.typeOptions.find(item => item.value === this.filterParams.type)
      if (this.filterParams.duringType !== 6) {
        const key = this.duringOptions.find(item => item.value === this.filterParams.duringType).label
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

    },
    initChart() {
      const dateRange = getDaysBetweenDates(...this.filterParams.during)
      this.dataSource[0].data = []
      dateRange.forEach(date => {
        this.dataSource[0].data.push({
          date: date,
          value: Math.random() * 1000
        })
      })
    },
    changeTab(key) {

    },
    onChangeDate(dates, dateStrings) {
      this.triggerSearch()
    },
    triggerSearch() {
      this.initChart()
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
