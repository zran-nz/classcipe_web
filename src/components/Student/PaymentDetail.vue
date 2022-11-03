<template>
  <div class="my-content">
    <div class="modal-title">Task: {{ taskName }}</div>
    <s-table
      ref="table"
      size="default"
      :rowKey="row => row.id"
      :columns="columns"
      :data="loadData"
      :scroll="scroll"
      class="content-list"
    >
    </s-table>
  </div>
</template>

<script>
import * as logger from '@/utils/logger'

import { STable } from '@/components'

import { orderRecordListPayment } from '@/api/orderRecord'

export default {
  name: 'PaymentDetail',
  props: {
    taskId: {
      type: [String, Number],
      required: true
    },
    taskName: {
      type: String,
      required: true
    }
  },
  components: {
    STable
  },
  data() {
    return {
      loading: false,
      // 查询参数
      queryParam: {
        status: null,
        searchText: '',
        taskId: this.taskId
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        console.info('loadData.parameter', parameter)
        return orderRecordListPayment(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res.result
          })
      },
      scroll: {}
    }
  },
  computed: {
    columns() {
      const results = [
        {
          title: 'Date',
          dataIndex: 'paymentTime'
        },
        {
          title: 'Type',
          dataIndex: 'productName',
          width: '200px'
        },
        {
          title: 'Price($)',
          dataIndex: 'price',
          width: '150px',
          // sorter: true,
          customRender: (text) => this.$options.filters['percentFormat'](text)
        }
      ]
      return results
    }
  },
  created() {
  },
  methods: {
    triggerSearch() {
      this.$refs.table.refresh(true)
    },
    handleDetail(record) {

    }
  }
}
</script>

<style scoped lang="less">
.my-content {
  padding: 0 15px 25px 15px;
  .modal-title {
    font-weight: bold;
    font-size: 18px;
    margin-bottom: 20px;
  }
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
