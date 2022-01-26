<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
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
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <schoolClassStudent-modal ref="modalForm" @ok="modalFormOk"></schoolClassStudent-modal>
  </a-card>
</template>

<script>
import SchoolClassStudentModal from './modules/SchoolClassStudentModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction } from '@/api/manage'

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
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function (t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: 'email',
          align: 'center',
          dataIndex: 'email'
        },
        {
          title: 'firstname',
          align: 'center',
          dataIndex: 'firstname'
        },
        {
          title: 'lastname',
          align: 'center',
          dataIndex: 'lastname'
        },
        {
          title: 'nickname',
          align: 'center',
          dataIndex: 'nickname'
        },
        {
          title: '关联状态：0-待审批；1-审批通过；2-审批拒绝',
          align: 'center',
          dataIndex: 'status'
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'joinTime'
        },
        {
          title: '删除状态(0-正常,1-已删除)',
          align: 'center',
          dataIndex: 'delFlag'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/school/schoolClassStudent/list',
        delete: '/school/schoolClassStudent/delete',
        deleteBatch: '/school/schoolClassStudent/deleteBatch',
        importExcelUrl: 'school/schoolClassStudent/importExcel'
      },
      searchKey: ''
    }
  },
  computed: {
    importExcelUrl: function () {
      return this.baseUrl + `${this.url.importExcelUrl}`
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
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";
</style>
