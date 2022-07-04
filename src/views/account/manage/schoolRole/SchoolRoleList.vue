<template>
  <div class="role-con">
    <div class="filter-tab">
      <div>
        <a-input-search placeholder="Search here" v-model="queryParams.searchKey" @search="handleSearch"></a-input-search>
      </div>
      <!-- <a-space class="filter-opt">
        <a-button type="primary" @click="handleAdd">Add Role</a-button>
      </a-space> -->
    </div>
    <div class="table-con">
      <a-table
        ref="table"
        :rowKey="item => item.roleCode"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          type: 'radio'
        }"
        @change="handleTableChange"
      >
        <a-space slot="action" slot-scope="text, record">
          <a @click="showUsers(record)">Users</a>
          <template v-if="selectedRowKeys.length === 0">
            <a @click="handleEdit(record)">Edit</a>
            <a-popover :overlayStyle="{width: '300px'}" :title="record.name + ' Permission'" trigger="click">
              <div slot="content">
                <a-space style="flex-wrap: wrap;">
                  <a-tag style="margin-bottom: 5px;" v-for="per in ROLE_PERMISSION[record.roleCode].label.split(',')" :key="per">
                    {{ per }}
                  </a-tag>
                </a-space>
                <!-- {{ ROLE_PERMISSION[record.roleCode].label }} -->
              </div>
              <a >Permissions</a>
            </a-popover>
            <!-- <a @click="handleDelete(record)">Delete</a> -->
          </template>
          <a-dropdown v-else>
            <a class="ant-dropdown-link">
              More <a-icon type="down"/>
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popover :overlayStyle="{width: '300px'}" :title="record.name + ' Permission'" trigger="click">
                  <div slot="content">
                    <a-space style="flex-wrap: wrap;">
                      <a-tag style="margin-bottom: 5px;" v-for="per in ROLE_PERMISSION[record.roleCode].label.split(',')" :key="per">
                        {{ per }}
                      </a-tag>
                    </a-space>
                    <!-- {{ ROLE_PERMISSION[record.roleCode].label }} -->
                  </div>
                  <a >Permissions</a>
                </a-popover>
              </a-menu-item>
              <a-menu-item >
                <a @click="handleEdit(record)">Edit</a>
              </a-menu-item>
              <!-- <a-menu-item >
                <a @click="handleDelete(record)">Delete</a>
              </a-menu-item> -->
            </a-menu>
          </a-dropdown>
        </a-space>
      </a-table>
    </div>
    <school-role-add ref="schoolRoleAdd" @ok="debounceLoad"/>
    <school-role-permission ref="schoolRolePermission" @ok="debounceLoad"/>
  </div>
</template>

<script>
import { pageListRole, deleteRole } from '@/api/v2/schoolRole'
import SchoolRoleAdd from './SchoolRoleAdd.vue'
import SchoolRolePermission from './SchoolRolePermission.vue'
import { ROLE_PERMISSION } from '@/const/common'
const { debounce } = require('lodash-es')

export default {
  name: 'SchoolRoleList',
  components: {
    SchoolRoleAdd,
    SchoolRolePermission
  },
  props: {
    school: {
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
    }
  },
  data() {
    return {
      ROLE_PERMISSION: ROLE_PERMISSION,
      currentSchool: this.school,
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
          title: 'Name',
          align: 'center',
          dataIndex: 'name'
          // width: 200
        },
        ...this.selectedRowKeys.length > 0 ? [] : [
          // {
          //   title: 'Role Type',
          //   align: 'center',
          //   dataIndex: 'roleType',
          //   // width: 120,
          //   customRender: (text, record) => {
          //     return text === 2 ? '自定义角色' : '系统角色'
          //   }
          // },
          // {
          //   title: 'Create Time',
          //   align: 'center',
          //   dataIndex: 'createTime'
          //   // width: 120
          // }
        ],
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
      this.loading = true
      pageListRole({
        ...this.queryParams,
        pageNo: this.ipagination.current,
        pageSize: this.ipagination.pageSize,
        schoolId: this.currentSchool.id
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
      this.$emit('choose', selectionRows[0])
    },
    onClearSelected () {
      this.doClear()
      this.$emit('choose', '')
    },
    doClear() {
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
    showUsers(item) {
      this.selectedRowKeys = [item.roleCode]
      this.selectionRows = [{ ...item }]
      this.$emit('choose', item)
    },
    handleAdd() {
      this.$refs.schoolRoleAdd.add({
        schoolId: this.currentSchool.id,
        roleNames: {}
      })
    },
    handleEdit(item) {
      const roleNames = {}
      this.dataSource.forEach(item => {
        roleNames[item.roleCode] = item.name
      })
      this.$refs.schoolRoleAdd.edit({
        schoolId: this.currentSchool.id,
        roleNames: roleNames,
        changedKey: item.roleCode
      })
    },
    handlePermission(item) {
      this.$refs.schoolRolePermission.edit({
        schoolId: this.currentSchool.id,
        id: item.id
      })
    },
    handleDelete(item) {
      this.$confirm({
        title: 'Confirm delete role ' + item.name,
        content: 'By deleting the role, all teachers belong to it will be removed. Do you confirm to delete? ',
        centered: true,
        onOk: () => {
          this.loading = true
          deleteRole({
            id: item.id
          }).then(res => {
            if (res.code === 0) {
              this.onClearSelected()
              this.debounceLoad()
            } else {
              this.loading = false
            }
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.role-con {
  height: 100%;
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
</style>
