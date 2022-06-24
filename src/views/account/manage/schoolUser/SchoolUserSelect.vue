<template>
  <div>
    <a-modal
      centered
      :title="title"
      :width="800"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      cancelText="Close">

      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline" @keyup.enter.native="searchQuery">
          <a-row :gutter="24">

            <a-col :span="10">
              <a-form-item label="User Name">
                <a-input placeholder="Search here" v-model="queryParam.searchKey"></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                <a-button type="primary" @click="searchQuery" icon="search">Search</a-button>
                <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">Reset</a-button>
              </span>
            </a-col>

          </a-row>
        </a-form>
      </div>
      <!-- table区域-begin -->
      <div>
        <a-table
          bordered
          size="small"
          rowKey="id"
          :columns="columns1"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
          :scroll="{ y: 240 }"
          :rowSelection="{selectedRowKeys: selectedRowKeys,onSelectAll:onSelectAll,onSelect:onSelect,onChange: onSelectChange}"
          @change="handleTableChange">

        </a-table>
      </div>
      <!-- table区域-end -->

    </a-modal>
  </div>
</template>

<script>
  import { filterObj } from '@/utils/util'
  import { getSchoolUsers } from '@/api/v2/schoolUser'

  export default {
    name: 'SchoolUserSelect',
    props: {
      school: {
        type: Object,
        default: () => {}
      },
      roles: {
        type: String,
        default: 'teacher'
      }
    },
    watch: {
      school: {
        handler(val) {
          this.currentSchool = { ...val }
          this.loadData()
        },
        deep: true,
        immediate: true
      }
    },
    data() {
      return {
        title: 'Add School User',
        currentSchool: this.school,
        names: [],
        visible: false,
        placement: 'right',
        description: '',
        // 查询条件
        queryParam: {},
        // 表头
        columns1: [
           {
            title: 'Name',
            align: 'center',
            dataIndex: 'nickname',
            width: 150,
            customRender: (text, record) => {
              return text || (record.firstname + record.lastname) || record.email
            }
          },
          {
            title: 'Email',
            align: 'center',
            width: 100,
            dataIndex: 'email'
          },
          {
            title: 'Gender',
            align: 'center',
            width: 100,
            dataIndex: 'gender'
          },
          {
            title: 'Create Time',
            align: 'center',
            dataIndex: 'createTime',
            width: 120
          }
        ],
        // 数据集
        dataSource: [],
        dataSource2: [],
        // 分页参数
        ipagination: {
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '30'],
          showTotal: (total, range) => {
            return range[0] + '-' + range[1] + ' of ' + total + ''
          },
          total: 0
        },
        isorter: {
          column: 'createTime',
          order: 'desc'
        },
        loading: false,
        selectedRowKeys: [],
        selectedRows: []
      }
    },
    created() {
      this.loadData()
    },
    methods: {
      searchQuery() {
        this.loadData(1)
      },
      searchReset() {
        this.queryParam = {}
        this.loadData(1)
      },
      handleCancel() {
        this.visible = false
      },
      handleOk() {
        this.dataSource2 = this.selectedRowKeys
        console.log('data:' + this.dataSource2)
        this.$emit('selectFinished', this.dataSource2)
        this.visible = false
      },
      add() {
        this.visible = true
      },
      loadData(arg) {
        // 加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          this.ipagination.current = 1
        }
        var params = this.getQueryParams()// 查询条件
        getSchoolUsers(params).then((res) => {
          if (res.success) {
            this.dataSource = res.result.records
            this.ipagination.total = res.result.total
          }
        })
      },
      getQueryParams() {
        var param = Object.assign({}, this.queryParam, this.isorter)
        param.field = this.getQueryField()
        param.pageNo = this.ipagination.current
        param.pageSize = this.ipagination.pageSize
        param.schoolId = this.currentSchool.id
        param.roles = this.roles
        return filterObj(param)
      },
      getQueryField() {
        // TODO 字段权限控制
      },
      onSelectAll(selected, selectedRows, changeRows) {
        if (selected === true) {
          for (var a = 0; a < changeRows.length; a++) {
            this.dataSource2.push(changeRows[a])
          }
        } else {
          for (var b = 0; b < changeRows.length; b++) {
            this.dataSource2.splice(this.dataSource2.indexOf(changeRows[b]), 1)
          }
        }
        // console.log(selected, selectedRows, changeRows);
      },
      onSelect(record, selected) {
        if (selected === true) {
          this.dataSource2.push(record)
        } else {
          var index = this.dataSource2.indexOf(record)
          // console.log();
          if (index >= 0) {
            this.dataSource2.splice(this.dataSource2.indexOf(record), 1)
          }
        }
      },
      onSelectChange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectionRows = selectedRows
      },
      onClearSelected() {
        this.selectedRowKeys = []
        this.selectionRows = []
      },
      handleDelete: function (record) {
        this.dataSource2.splice(this.dataSource2.indexOf(record), 1)
      },
      handleTableChange(pagination, filters, sorter) {
        // 分页、排序、筛选变化时触发
        console.log(sorter)
        // TODO 筛选
        if (Object.keys(sorter).length > 0) {
          this.isorter.column = sorter.field
          this.isorter.order = sorter.order === 'ascend' ? 'asc' : 'desc'
        }
        this.ipagination = pagination
        this.loadData()
      }
    }
  }
</script>
<style lang="less" scoped>
  .ant-card-body .table-operator {
    margin-bottom: 18px;
  }

  .ant-table-tbody .ant-table-row td {
    padding-top: 15px;
    padding-bottom: 15px;
  }

  .anty-row-operator button {
    margin: 0 5px
  }

  .ant-btn-danger {
    background-color: #ffffff
  }

  .ant-modal-cust-warp {
    height: 100%
  }

  .ant-modal-cust-warp .ant-modal-body {
    height: calc(100% - 110px) !important;
    overflow-y: auto
  }

  .ant-modal-cust-warp .ant-modal-content {
    height: 90% !important;
    overflow-y: hidden
  }
</style>
