<template>
  <div class="role-con">
    <a-icon class="close" type="close-circle" @click="handleClose" />
    <div class="filter-tab">
      <div style="width: 300px;" v-clickOutside="() => this.searchPoverVis = false">
        <!-- <a-input-search placeholder="Search here" v-model="queryParams.searchKey" @search="handleSearch"></a-input-search> -->
        <a-popover
          v-model="searchPoverVis"
          class="global-search"
          placement="bottomLeft"
          overlayClassName="search-popver"
          :getPopupContainer="trigger => trigger.parentElement"
          :overlayStyle="{
            height: '300px',
            overflow: 'auto'
          }"
          size="large"
          style="width: 100%"
          trigger="null"
        >
          <a-input-search
            @focus="searchPoverVis = true"
            @change="getFilterMembers"
            placeholder="Search and add by name/email"
            v-model="searchKeyMember"></a-input-search>
          <template slot="content">
            <div class="search-user" v-for="item in filterMembers" :key="item.id">

              <div class="user-avatar">
                <div class="avatar">
                  <img :src="item.userInfo.avatar" />
                </div>
              </div>
              <div class="user-name-email">
                <div class="user-name">
                  {{ item.userInfo.nickname || `${item.userInfo.firstname} ${item.userInfo.lastname}` }}
                </div>
                <div class="email">
                  {{ item.userInfo.email }}
                </div>
              </div>
              <!-- <div class="user-option">
                <a-select
                  class="import-opt-item"
                  mode="multiple"
                  :getPopupContainer="trigger => trigger.parentElement"
                  v-model='item.classArr'
                  style="width: 100%;"
                  placeholder='Please select class'>
                  <a-select-option v-for='opt in classOptions' :key='opt.id'>
                    {{ opt.name }}
                  </a-select-option >
                </a-select>
              </div> -->
              <div class="action-wrapper">
                <a-button type="link" @click="handleAddMember(item)">
                  Add
                </a-button>
              </div>

            </div>
          </template>
        </a-popover>
      </div>
      <!-- <a-space class="filter-opt">
        <a-button type="primary" @click="handleAdd">Add User</a-button>
      </a-space> -->
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
    <!-- <school-user-select ref="schoolUserSelect" @selectFinished="selectOK" :school="currentSchool" /> -->
  </div>
</template>

<script>
import { getRoleUsers, addRoleUser, deleteRoleUser } from '@/api/v2/schoolRole'
import { getSchoolUsers } from '@/api/v2/schoolUser'
import { getSubjectBySchoolId } from '@/api/academicSettingSubject'
import { listClass } from '@/api/v2/schoolClass'

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
      searchPoverVis: false,
      subjectOptions: [],
      classOptions: [],
      teacherList: [],
      filterMembers: [],
      queryParams: {
        searchKey: ''
      },
      selectMember: '',
      searchKeyMember: '',
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
    this.initDict()
    this.initSchoolUsers()
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
    initDict() {
       Promise.all([
        getSubjectBySchoolId({
          schoolId: this.currentSchool.id
        }),
        listClass({
          pageNo: 1,
          pageSize: 10000,
          schoolId: this.currentSchool.id
        })
      ]).then(([subjectRes, clsRes]) => {
        if (subjectRes.success) {
          let subjects = []
          subjectRes.result.forEach(item => {
            if (item.subjectList && item.subjectList.length > 0) {
              subjects = subjects.concat(item.subjectList)
            }
          })
          this.subjectOptions = subjects
        }
        if (clsRes.success) {
          this.classOptions = clsRes.result.records
        }
      })
    },
    initSchoolUsers() {
      getSchoolUsers({
        pageNo: 1,
        pageSize: 10000,
        schoolId: this.currentSchool.id,
        roles: 'teacher'
      }).then((res) => {
        if (res.success) {
          this.teacherList = res.result.records
          this.getFilterMembers()
        }
      })
    },
    getFilterMembers() {
      // 根据roleCode判断是否存在
      this.filterMembers = this.teacherList.filter(member => {
        const roles = member.roles.map(item => item.name)
        const isIn = roles.includes(this.currentRole.roleCode)
        const userName = ((member.userInfo.firstname || '') + (member.userInfo.lastname || '')).toLowerCase()
        return !isIn && (member.userInfo.email.toLowerCase().indexOf(this.searchKeyMember.toLowerCase() || '') > -1 || userName.indexOf(this.searchKeyMember.toLowerCase() || '') > -1)
      }).map(item => {
        const classIds = item.classes.map(item => item.id)
        this.$set(item, 'classArr', classIds)
        return item
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
              this.initSchoolUsers()
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
    handleSearchMember(val) {
      this.searchKeyMember = val
    },
    handleSelectMember(val) {
      console.log(val)
      const user = this.teacherList.find(item => item.id === val)
      if (user) {
        this.handleAddMember(user)
      }
    },
    handleAddMember(user) {
      if (!this.currentRole || !this.currentRole.id) {
        this.$message.error('Please select a role!')
        return
      }
      // 根据roleCode判断是否存在
      const roles = user.roles.map(item => item.name)
      const isIn = roles.includes(this.currentRole.roleCode)
      if (isIn) {
        this.$message.error('This user has been added')
      }
      this.selectMember = ''
      addRoleUser({
        roleId: this.currentRole.id,
        schoolId: this.currentSchool.id,
        userId: user.id
      }).then(res => {
        if (res.code === 0) {
          this.$message.success('Add user successfully')
          this.initSchoolUsers()
          this.debounceLoad()
        } else {
          this.loading = false
        }
      }).catch(() => {
        this.loading = false
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

.user-avatar {
  width: 50px;
  .avatar {
    img {
      height: 40px;
      border-radius: 40px;
    }
  }
}
.user-name-email {
  display: flex;
  flex-direction:column;
  width: 200px;
  line-height: 24px;
  font-family: Inter-Bold;
  color: #000000;
  display: flex;
  align-items: flex-start;
  .email {
    padding-left: 10px;
    font-size: 12px;;
  }
  .user-name {
    text-align: center;
    font-family: Inter-Bold;
    line-height: 24px;
    font-size: 14px;
    padding-left: 10px;
    color: #000000;
    font-weight: bold;
  }
}
.user-option {
  width: 150px;
}
.action-wrapper{
  flex: 1;
}
.search-popver {
  /deep/ &.ant-popover {
    .ant-popover-inner {
      border: 1px solid #dfdfdf;
    }
  }
  .search-user {
    display:flex;
    padding: 5px;
    margin: 5p -16px;
    width: auto;
    align-items: center;
    &:hover {
      background: #dfdfdf;
    }
  }
}
</style>
