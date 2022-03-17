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
                <a-range-picker
                  size="large"
                  v-model="filterParams.during"
                  :ranges="DATERANGE_FOR_CHARTS"
                  @change="onChangeDate"
                />
              </div>
            </div>
            <div class="filter-summary">
              <div class="summary-title">{{ title }}</div>
              <div class="summary-total">$0.00</div>
            </div>
          </div>
          <div class="dashboard-chart"></div>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import moment from 'moment'

import { DATERANGE_FOR_CHARTS } from '@/const/dateRange'

export default {
  name: 'TeacherSellDashboard',
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
          label: 'Views'
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
      filterParams: {
        type: 1,
        during: [moment().startOf('month').startOf('day'), moment().endOf('day')]
      }
    }
  },
  created() {
    this.init()
  },
  computed: {
    title() {
      console.log(this.filterParams.during)
      if (this.filterParams.during.length === 2) {
        const [start, end] = this.filterParams.during
        const typeObj = this.typeOptions.find(item => item.value === this.filterParams.type)
        return start.format('MM/DD/YY') + ' - ' + end.format('MM/DD/YY') + ' ' + (typeObj ? typeObj.label.toUpperCase() : '')
      }
      return ' - '
    }
  },
  methods: {
    init() {

    },
    changeTab(key) {

    },
    onChangeDate(dates, dateStrings) {
      console.log(dateStrings)
    },
    triggerSearch() {

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
            width: 220px;
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
