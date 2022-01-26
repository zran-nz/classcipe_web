<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper" style="margin: 20px 0px;">
      <a-form layout="inline">
        <a-row type="flex" justify="start">
          <a-col :span="8">
            <a-input-search placeholder="Search for ID、Name、Email..." v-model="searchKey" enter-button @search="searchQuery"/>
          </a-col>
          <a-col :span="8">
          </a-col>
          <a-col :span="4">
            <a-button @click="handleAdd" type="primary" icon="plus">Add Student</a-button>
          </a-col>
          <a-col :span="4">
            <a-upload
              name="file"
              :showUploadList="false"
              :multiple="false"
              :headers="tokenHeader"
              :action="importExcelUrl"
              @change="handleImportExcel">
              <a-button type="primary" icon="import"> Bulk import</a-button>
            </a-upload>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->

    <!-- table区域-begin -->
    <div>
      <!--      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">-->
      <!--        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项-->
      <!--        <a style="margin-left: 24px" @click="onClearSelected">清空</a>-->
      <!--      </div>-->

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        class="j-table-force-nowrap"
        @change="handleTableChange">

        <span slot="action" slot-scope="text, record">
          <template v-if="record.status === 0">
            <a-popconfirm title="Aprove this student ?" ok-text="Yes" @confirm="handleStatus(record,1)" cancel-text="No">
              <a href="#">Aprove</a>
            </a-popconfirm>
            <a-divider type="vertical" />
            <a-popconfirm title="Reject this student ?" ok-text="Yes" @confirm="handleStatus(record,2)" cancel-text="No">
              <a href="#">Reject</a>
            </a-popconfirm>
          </template>
          <template v-else>
            <a-popconfirm title="Remove this student ?" ok-text="Yes" @confirm="handleDeleteRecord(record)" cancel-text="No">
              <a href="#">Remove</a>
            </a-popconfirm>
          </template>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <schoolClassStudent-modal :class-id="classId" ref="modalForm" @ok="modalFormOk"></schoolClassStudent-modal>
  </a-card>
</template>

<script>
import SchoolClassStudentModal from './modules/SchoolClassStudentModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction } from '@/api/manage'
import {
  SchoolClassStudentAddOrUpdate,
  schoolClassStudentAPIUrl,
  SchoolClassStudentDelete
} from '@/api/schoolClassStudent'
import moment from 'moment'

export default {
  name: 'ClassStudentList',
  mixins: [JeecgListMixin],
  components: {
    SchoolClassStudentModal
  },
  props: {
    classId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      description: 'School Class Student',
      // 表头
      columns: [
        {
          title: 'No',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function (t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: 'studentName',
          align: 'center',
          dataIndex: 'studentName'
        },
        {
          title: 'email',
          align: 'center',
          dataIndex: 'email'
        },
        {
          title: 'Join at',
          align: 'center',
          dataIndex: 'joinTime',
          customRender: function (t, r, index) {
            return moment.utc(t).local().format('yyyy-MM-DD HH:mm')
          }
        },
        {
          title: 'Action',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: schoolClassStudentAPIUrl.SchoolClassStudentList,
        delete: schoolClassStudentAPIUrl.SchoolClassDelete,
        importExcelUrl: schoolClassStudentAPIUrl.SchoolClassStudentImportExcel
      },
      searchKey: ''
    }
  },
  computed: {
    importExcelUrl: function () {
      return process.env.VUE_APP_API_BASE_URL + this.url.importExcelUrl + '?classId=' + this.classId
    }
  },
  methods: {
    loadData (arg) {
      if (arg === 1) {
        this.ipagination.current = 1
      }
      this.loading = true
      const params = this.getQueryParams()
      params.hasQuery = 'true'
      params.classId = this.classId
      getAction(this.url.list, params).then((res) => {
        if (res.success) {
          this.dataSource = res.result.records || res.result
          if (res.result.total) {
            this.ipagination.total = res.result.total
          } else {
            this.ipagination.total = 0
          }
        }
        this.loading = false
      })
    },
    handleStatus(record, status) {
      const model = Object.assign({}, record)
      model.status = status
      if (status === 1) {
        SchoolClassStudentAddOrUpdate(model).then(response => {
          if (response.success) {
            this.$message.success((status === 1 ? 'Aprove' : 'Reject') + ' successfully')
          }
        }).finally(() => {
          this.loadData()
        })
      } else {
        SchoolClassStudentDelete(record).then((response) => {
          if (response.success) {
            this.$message.success((status === 1 ? 'Aprove' : 'Reject') + ' successfully')
          }
        }).finally(() => {
          this.loadData()
        })
      }
    },
    handleDeleteRecord: function (record) {
      SchoolClassStudentDelete(record).then((res) => {
        if (res.success) {
          this.$message.success(res.message)
          this.loadData()
        } else {
          this.$message.warning(res.message)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";
</style>
