<template>
  <div class="role-con">
    <a-icon class="close" type="close-circle" @click="handleClose" />
    <div class="filter-tab">
      <div>
        <a-input-search placeholder="Search here" v-model="queryParams.searchKey" @search="handleSearch"></a-input-search>
      </div>
      <a-space class="filter-opt">
        <a-button type="primary" @click="handleAdd">Add User</a-button>
      </a-space>
    </div>
    <div class="table-con">
      <a-table
        ref="table"
        :rowKey="item => item.id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange
        }"
        @change="handleTableChange"
      >
        <a-space slot="action" slot-scope="text, record">
          <a type="link" @click="handleDelete(record)">Delete</a>
        </a-space>
      </a-table>
    </div>
    <school-user-select ref="schoolUserSelect" @selectFinished="selectOK" :school="currentSchool" />
  </div>
</template>

<script>
import { getRoleUsers, addRoleUser, deleteRoleUser } from '@/api/v2/schoolRole'
import SchoolUserSelect from '../schoolUser/SchoolUserSelect'
const { debounce } = require('lodash-es')

export default {
  name: 'SchoolRoleUser',
  components: {
    SchoolUserSelect
  },
  props: {
    school: {
      type: Object,
      default: () => {}
    },
    role: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    school: {
      handler(val) {
        console.log(val)
        this.currentSchool = { ...val }
        this.loadData()
      },
      deep: true,
      immediate: true
    },
    role: {
      handler(val) {
        console.log(val)
        this.currentRole = { ...val }
        this.loadData()
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      currentSchool: this.school,
      currentRole: this.role,
      queryParams: {
        searchKey: ''
      },
      loading: false,
      dataSource: [],
      selectedRowKeys: [],
      selectionRows: [],
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' of ' + total + ''
        },
        total: 0
      }
    }
  },
  computed: {
    columns() {
      return [
        {
          title: 'Email',
          align: 'center',
          dataIndex: 'userInfo.email',
          width: 150
        },
        {
          title: 'Name',
          align: 'center',
          dataIndex: 'userInfo.nickname',
          width: 150,
          customRender: (text, record) => {
            return text || (record.userInfo.firstname + record.userInfo.lastname) || record.userInfo.email
          }
        },
        {
          title: 'Create Time',
          align: 'center',
          dataIndex: 'userInfo.createTime',
          width: 120
        },
        {
          title: 'Action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  created() {
    this.debounceLoad = debounce(this.loadData, 300)
  },
  methods: {
    loadData() {
      if (!this.currentSchool || !this.currentRole) return
      this.loading = true
      getRoleUsers({
        ...this.queryParams,
        pageNo: this.ipagination.current,
        pageSize: this.ipagination.pageSize,
        schoolId: this.currentSchool.id,
        roleId: this.currentRole.id
      }).then(res => {
        if (res.code === 0) {
          this.dataSource = res.result.records
          if (res.result.total) {
            this.ipagination.total = res.result.total
          } else {
            this.ipagination.total = 0
          }
        }
      }).finally(() => {
        this.loading = false
      })
    },
    onSelectChange (selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectionRows = selectionRows
    },
    onClearSelected () {
      this.selectedRowKeys = []
      this.selectionRows = []
    },
    handleSearch() {
      this.ipagination.current = 1
      this.debounceLoad()
    },
    handleTableChange (pagination, filters, sorter) {
      // 分页、排序、筛选变化时触发
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field
        this.isorter.order = sorter.order === 'ascend' ? 'asc' : 'desc'
      }
      this.ipagination = pagination
      this.debounceLoad()
    },
    handleAdd() {
      if (!this.currentRole || !this.currentRole.id) {
        this.$message.error('Please select a role!')
      } else {
        this.$refs.schoolUserSelect.add()
      }
    },
    handleClose() {
      this.$emit('close')
    },
    handleDelete(item) {
      if (!this.currentRole || !this.currentRole.id) {
        this.$message.error('Please select a role!')
        return
      }
      this.$confirm({
        title: 'Confirm delete user ' + item.userInfo.email,
        // content: 'By deleting the role, all teachers belong to it will be removed. Do you confirm to delete? ',
        centered: true,
        onOk: () => {
          this.loading = true
          deleteRoleUser({
            roleId: this.currentRole.id,
            schoolId: this.currentSchool.id,
            userId: item.id
          }).then(res => {
            if (res.code === 0) {
              this.$message.success('Delete user successfully')
              this.debounceLoad()
            } else {
              this.loading = false
            }
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    selectOK(data) {
      console.log(data)
      if (!this.currentRole || !this.currentRole.id) {
        this.$message.error('Please select a role!')
        return
      }
      // TODO 需要批量添加
      addRoleUser({
        roleId: this.currentRole.id,
        schoolId: this.currentSchool.id,
        userId: data[0]
      }).then(res => {
        if (res.code === 0) {
          this.$message.success('Add user successfully')
          this.debounceLoad()
        } else {
          this.loading = false
        }
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped lang="less">
.role-con {
  height: 100%;
  position: relative;
}
.filter-tab {
  height: 40px;
  padding: 0 0px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.table-con {
  height: calc(100% - 40px);
  overflow: auto;
}
.close {
  position: absolute;
  right: -15px;
  top: -15px;
  cursor:pointer;
}
</style>
