<template>
  <div class="my-content" ref="tableCon">
    <div class="filter-line">
      <div class="status-tab">
        <div class="toggle-mode-type-wrapper">
          <div class="toggle-mode-type">
            <div class="toggle-mode">
              <!-- <div :class="{'mode-item': true, 'active-mode' : queryParam.orderType === ''}" @click="toggleType('')">
                {{ $t('teacher.my-content.all-status') }}
              </div> -->
              <div
                v-for="(item,index) in orderTypes"
                :key="'orderTypes'+index"
                :class="{'mode-item': true, 'active-mode' : queryParam.orderType === item.value}"
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
            v-model="queryParam.searchText"
            @search="triggerSearch"
            @pressEnter="triggerSearch"
            :allowClear="true"
            size="large"
          >
          </a-input-search>
        </div>
      </div>
    </div>
    <div class="">
      <s-table
        ref="table"
        size="default"
        :rowKey="row => row.id"
        :columns="columns"
        :data="loadData"
        :scroll="scroll"
        class="content-list"
      >
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handlePaymentItem(record)">Refund</a>
            <!-- <a-divider type="vertical" /> -->
          </template>
        </span>
      </s-table>
    </div>

    <a-modal
      v-model="paymentVisible"
      :footer="null"
      destroyOnClose
      width="800px"
      :zIndex="6000"
      title="Payment details"
      @ok="paymentVisible = false"
      @cancel="paymentVisible = false">
      <payment-detail :taskId="currentTaskId" :taskName="currentTaskName"></payment-detail>
    </a-modal>
  </div>
</template>

<script>
import * as logger from '@/utils/logger'

import { DICT_ORDER_TYPE, DICT_ORDER_STATUS, OrderType } from '@/const/common'

import { STable } from '@/components'
import PaymentDetail from './components/PaymentDetail'

import { GetDictItems } from '@/api/common'
import { orderRecordList } from '@/api/orderRecord'

import { StudyModeMixin } from '@/mixins/StudyModeMixin'
export default {
  name: 'MyOrders',
  mixins: [StudyModeMixin],
  components: {
    STable,
    PaymentDetail
  },
  data() {
    return {
      loading: false,
      orderTypes: [],
      orderStatus: [],
      // 查询参数
      queryParam: {
        status: null,
        orderType: '1',
        searchText: ''
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        logger.info('loadData.parameter', parameter)
        return orderRecordList(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res.result
          })
      },
      scroll: {},
      currentTaskId: null,
      currentTaskName: null,
      paymentVisible: false
    }
  },
  computed: {
    columns() {
      let results = [
        {
          title: 'Task name',
          dataIndex: 'taskName',
          width: '200px'
        },
        {
          title: 'Teacher',
          dataIndex: 'teacherName',
          width: '150px'
        }
      ]
      if (this.queryParam.orderType === OrderType.AskTeacher) {
        results = results.concat([
          {
            title: 'Times',
            dataIndex: 'times',
            width: '100px'
          }
        ])
      } else if (this.queryParam.orderType === OrderType.Other) {
        results = [
          {
            title: 'Product name',
            dataIndex: 'productName',
            width: '200px'
          }
        ].concat(results)
      }
      results = results.concat([
        {
          title: 'Price($)',
          dataIndex: 'price',
          width: '150px',
          // sorter: true,
          customRender: (text) => this.$options.filters['percentFormat'](text)
        },
        {
          title: 'Payment',
          dataIndex: 'payment',
          width: '150px',
          // sorter: true,
          customRender: (text) => this.$options.filters['percentFormat'](text)
        },
        {
          title: 'Payment Account',
          dataIndex: 'paymentAccount',
          width: '150px'
        },
        {
          title: 'Date',
          dataIndex: 'createTime',
          width: '150px'
          // sorter: true,
          // customRender: (text) => this.$options.filters['dayjs1'](text)
        },
        {
          title: 'Actions',
          dataIndex: 'action',
          width: '100px',
          scopedSlots: { customRender: 'action' }
        }
      ])
      return results
    }
  },
  created() {
    this.initDict()
  },
  mounted() {
    this.resetTableWidth()
  },
  methods: {
    initDict() {
       Promise.all([
          GetDictItems(DICT_ORDER_STATUS),
          GetDictItems(DICT_ORDER_TYPE)
        ]).then(res => {
          if (res[0].success) {
            this.orderStatus = res[0].result
          }
          if (res[1].success) {
            this.orderTypes = res[1].result
          }
        })
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
      if (conWidth > totalWidth + 200 + 30) {
        this.columns[0].width = 'auto'
      } else {
        this.scroll = {
          x: totalWidth
        }
        this.columns[this.columns.length - 1].fixed = 'right'
      }
    },
    toggleType(type) {
      this.queryParam.orderType = type
      this.$refs.table.refresh(true)
    },
    triggerSearch() {
      this.$refs.table.refresh(true)
    },
    handlePaymentItem (item) {
      if (!item.taskId) {
        return
      }
      this.currentTaskId = item.taskId
      this.currentTaskName = item.taskName
      this.paymentVisible = true
    }
  }
}
</script>

<style scoped lang="less">
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
            .mode-item {
              padding: 0 8px;
              font-size: 12px;
              height: 40px;
              color: rgba(17, 20, 45, 1);
              border-radius: 40px;
              font-family: Inter-Bold;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 90px;
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
      height: 40px;
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
  .content-list {
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
}
</style>
