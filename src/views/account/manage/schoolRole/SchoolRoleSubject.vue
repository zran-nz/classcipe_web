<template>
  <div class="role-con">
    <a-icon class="close" type="close-circle" @click="handleClose" />
    <div class="filter-tab">
      <div style="width: 300px;">
        <!-- <a-input-search placeholder="Search here" v-model="queryParams.searchKey" @search="handleSearch"></a-input-search> -->

      </div>
      <a-space class="filter-opt">
        <a-button type="primary" @click="handleAddSubject">Add Subject</a-button>
      </a-space>
    </div>
    <div class="table-con">
      <a-table
        ref="table"
        :rowKey="item => item.id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="false"
        :loading="loading"
      >
        <a-space slot="teachers" slot-scope="text, record" style="flex-wrap: wrap;">
          <template v-if="text && text.length > 0">
            <div class="user-tag" v-for="item in record.teachers" :key="item.userId">
              <div class="avatar">
                <img :src="item.avatar" v-if="item.avatar"/>
                <img v-else src="~@/assets/icons/library/default-avatar.png"/>
              </div>
              <div class="user-name-email">
                <div class="user-name">
                  {{ item.userName }}
                </div>
                <div class="email">
                  {{ item.email }}
                </div>
              </div>
              <div class="user-opt">
                <a-icon type="close-circle" @click="handleDelete(item, record)"></a-icon>
              </div>
            </div>
          </template>
        </a-space>
        <a-space slot="action" slot-scope="text, record">
          <a-popover
            placement="left"
            title="Choose User"
            trigger="click">
            <div slot="content" class="search-popver">
              <a-space class="search-con">
                <a-input-search
                  v-model="searchKeyMember"
                  :allow-clear="true"
                  placeholder="Search and add by name/email"></a-input-search>
                <a-button @click="goTeachers">Add new</a-button>
              </a-space>
              <div class="search-user" v-for="item in filterMembers" :key="item.userId">

                <div class="user-avatar">
                  <div class="avatar">
                    <img :src="item.avatar" v-if="item.avatar"/>
                    <img v-else src="~@/assets/icons/library/default-avatar.png"/>
                  </div>
                </div>
                <div class="user-name-email">
                  <div class="user-name">
                    {{ item.nickname || `${item.firstname} ${item.lastname}` }}
                  </div>
                  <div class="email">
                    {{ item.email }}
                  </div>
                </div>
                <div class="action-wrapper">
                  <a-button :loading="loading" type="link" @click="handleAddMember(item, record)">
                    Add
                  </a-button>
                </div>

              </div>
            </div>
            <a type="link" @click="handleResetFilter(record)">Add</a>
          </a-popover>

          <!-- <a type="link" @click="handleDelete(record)">Delete</a> -->
        </a-space>
      </a-table>
    </div>
    <!-- <school-user-select ref="schoolUserSelect" @selectFinished="selectOK" :school="currentSchool" /> -->
  </div>
</template>

<script>
import { getRoleSubjectLeaders, bindRoleSubjectLeader } from '@/api/v2/schoolRole'
import { getSchoolUsers } from '@/api/v2/schoolUser'

const { debounce } = require('lodash-es')

export default {
  name: 'SchoolRoleSubject',
  components: {
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
        this.initSchoolUsers()
        this.debounceSchoolUsers = debounce(this.initSchoolUsers, 300)
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
      currentRecord: null,
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
          title: 'Subject',
          align: 'center',
          dataIndex: 'subjectName',
          width: 150
        },
        {
          title: 'Teachers',
          align: 'center',
          dataIndex: 'teachers',
          scopedSlots: { customRender: 'teachers' }
        },
        {
          title: 'Action',
          align: 'center',
          width: 80,
          scopedSlots: { customRender: 'action' }
        }
      ]
    },
    filterMembers() {
      let members = []
      if (this.currentRecord) {
        members = this.teacherList.filter(teacher => !this.currentRecord.teachers || !this.currentRecord.teachers.find(head => head.userId === teacher.uid))
      }
      if (this.searchKeyMember) {
        const userName = ((this.currentRecord.firstname || '') + (this.currentRecord.lastname || '')).toLowerCase()
        members = members.filter(item => {
          return item.email && (item.email.toLowerCase().indexOf((this.searchKeyMember || '').toLowerCase() || '') > -1 || userName.indexOf((this.searchKeyMember || '').toLowerCase() || '') > -1)
        })
      }
      return members
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
      getRoleSubjectLeaders({
        schoolId: this.currentSchool.id
      }).then(res => {
        if (res.code === 0) {
          this.dataSource = res.result
        }
      }).finally(() => {
        this.loading = false
      })
    },
    initDict() {

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
        }
      })
    },

    handleAdd() {
      if (!this.currentRole || !this.currentRole.id) {
        this.$message.error('Please select a role!')
      } else {
        this.$refs.schoolUserSelect.add()
      }
    },
    handleAddClass() {
      this.$router.push('/manage/curriculum')
    },
    handleClose() {
      this.$emit('close')
    },
    handleDelete(item, cls) {
      if (!this.currentRole || !this.currentRole.roleCode) {
        this.$message.error('Please select a role!')
        return
      }
      this.$confirm({
        title: 'Confirm delete user ' + item.email,
        // content: 'By deleting the role, all teachers belong to it will be removed. Do you confirm to delete? ',
        centered: true,
        onOk: () => {
          this.loading = true
          bindRoleSubjectLeader({
            bindFlag: 0,
            schoolId: this.currentSchool.id,
            subjectId: cls.subjectId,
            userId: item.userId
          }).then(res => {
            if (res.code === 0) {
              this.$message.success('Delete user successfully')
              this.initSchoolUsers()
              this.debounceLoad()
              this.$store.dispatch('GetInfo')
            } else {
              this.loading = false
            }
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    doFilter(val, record) {

    },
    handleResetFilter(record) {
      this.currentRecord = { ...record }
      this.searchKeyMember = ''
    },
    handleAddSubject() {
      this.$router.push('/manage/curriculum')
    },
    goTeachers() {
      this.$router.push('/manage/teacher')
    },
    handleAddMember(user, cls) {
      if (!this.currentRole || !this.currentRole.roleCode) {
        this.$message.error('Please select a role!')
        return
      }
      // 根据roleCode判断是否存在
      // const roles = user.roles.map(item => item.name)
      // const isIn = roles.includes(this.currentRole.roleCode)
      // if (isIn) {
      //   this.$message.error('This user has been added')
      // }
      this.selectMember = ''
      this.loading = true
      bindRoleSubjectLeader({
        bindFlag: 1,
        schoolId: this.currentSchool.id,
        subjectId: cls.subjectId,
        userId: user.uid
      }).then(res => {
        if (res.code === 0) {
          this.$message.success('Add user successfully')
          this.initSchoolUsers()
          this.debounceLoad()
          this.$store.dispatch('GetInfo')
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
  height: 300px;
  overflow: auto;
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
.user-tag {
  width: 150px;
  display: flex;
  position: relative;
  margin-bottom: 5px;
  border: 1px solid #dfdfdf;
  padding: 5px;
  .avatar {
    width: 40px;
    height: 40px;
    margin-left: 5px;
    img {
      width: 40px;
      height: 40px;
      border-radius: 40px;
    }
  }
  .user-name-email {
    display: flex;
    flex-direction: column;
    width: 100px;
    .user-name {
      width: 100px;
      font-weight: bold;
      text-align: left;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    .email {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
    }
  }
  .user-opt {
    position: absolute;
    top: -10px;
    right: -5px;
    background: #fff;
  }
}
</style>
