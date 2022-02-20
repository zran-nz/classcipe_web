<template>
  <div style="min-height:400px;">
    <div class="table-page-search-wrapper" style="margin: 30px 0px;">
      <a-form layout="inline">
        <a-row type="flex" justify="start">
          <a-col :span="10">
            <a-auto-complete
              v-model="selectTeacher"
              class="global-search"
              size="large"
              style="width: 100%"
              placeholder="Search and add by name/email"
              option-label-prop="title"
              @focus="handleSearch"
              @select="onSelect"
              @search="handleSearch"
            >
              <template slot="dataSource">
                <a-select-option v-for="item in dataSource" :key="item.userInfo.id" :title="item.userInfo.email">
                  <div style="display:flex">
                    <div class="user-avatar">
                      <div class="avatar">
                        <img :src="item.userInfo.avatar" />
                      </div>
                    </div>
                    <div class="user-name-email">
                      <div class="user-name">
                        {{ item.userInfo.nickname }}
                      </div>
                      <div class="email">
                        {{ item.userInfo.email }}
                      </div>
                    </div>
                    <div class="action-wrapper">
                      <a-button type="link" @click="handleAddTeacher(item.userInfo)">
                        Add
                      </a-button>
                    </div>
                  </div>
                </a-select-option>
              </template>
              <a-input>
                <a-icon slot="suffix" type="search" class="certain-category-icon" />
              </a-input>
            </a-auto-complete>
          </a-col>
          <a-col :span="12">
          </a-col>
          <!--          <a-col :span="4">-->
          <!--            <a-button @click="handleAdd" type="primary" icon="plus">Add Teacher</a-button>-->
          <!--          </a-col>-->
        </a-row>
      </a-form>
    </div>

    <a-table
      :columns="columns"
      :data-source="classTeacherList"
      :loading="loading"
      :pagination="pagination"
      @change="handleTableChange"
      :scroll="{ x: true }"
      rowKey="id"
    >
      <span slot="roles" slot-scope="roles">
        <span v-for="role in roles" :key="role.id">
          {{ role.name }}
        </span>
      </span>
      <span slot="grades" slot-scope="grades">
        <span v-for="grade in grades" :key="grade.id">
          {{ grade.name }}
        </span>
      </span>
      <span slot="action" slot-scope="record">
        <a-popconfirm title="Remove this teacher ?" ok-text="Yes" @confirm="handleDeleteRecord(record)" cancel-text="No">
          <a href="#">Remove</a>
        </a-popconfirm>
      </span>
    </a-table>
  </div>
</template>

<script>
import { getSchoolRoleList, getSchoolUsers } from '@/api/schoolUser'
import store from '@/store'
import { schoolUserStatusList } from '@/const/schoolUser'
import moment from 'moment'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { SchoolClassAddClassMember, SchoolClassRemoveClassMember } from '@/api/schoolClass'

export default {
  name: 'ClassTeacherList',
  mixins: [JeecgListMixin],
  components: {

  },
  props: {
    classId: {
      type: String,
      default: ''
    },
    teacherList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      statusList: schoolUserStatusList,
      roleList: [],
      classTeacherList: [],
      columns: [
        {
          title: 'Teacher Name',
          dataIndex: 'userInfo.nickname',
          key: 'name'
        },
        {
          title: 'Role',
          dataIndex: 'roles',
          scopedSlots: { customRender: 'roles' },
          key: 'roles'
        },
        {
          title: 'Email',
          dataIndex: 'userInfo.email',
          key: 'email'
        },
        {
          title: 'Join at',
          dataIndex: 'classes',
          customRender: (text, row, index) => {
            if (text && text.length > 0) {
              const index = text.findIndex(item => item.id === this.classId)
              if (index > -1) {
                return moment.utc(text[index]).local().format('yyyy-MM-DD HH:mm')
              } else {
                return ''
              }
            } else {
              return ''
            }
          },
          key: 'joinDate'
        },
        {
          title: 'Action',
          key: 'action',
          // dataIndex: 'id',
          scopedSlots: { customRender: 'action' },
          width: '150px'
        }
      ],
      loading: false,
      pagination: {
        pageSize: 20,
        current: 1,
        total: 0
      },
      baseUrl: process.env.VUE_APP_API_BASE_URL,
      searchKey: '',
      dataSource: [],
      selectTeacher: '',
      roleManageId: ''
    }
  },
  created() {
    this.loadData()
    this.loadRoleList()
    this.dataSource = this.teacherList.filter(teacher => this.selectedEmails.indexOf(teacher.userInfo.email) === -1)
  },
  computed: {
    selectedEmails() {
      return this.classTeacherList.map(item => {
        return item.userInfo.email
      })
    }

  },
  methods: {
    async loadData() {
      this.loading = true
      const res = await getSchoolUsers({
        school: store.getters.userInfo.school,
        currentRole: 'teacher',
        classes: this.classId,
        pageSize: this.pagination.pageSize,
        pageNo: this.pagination.current
      })
      this.classTeacherList = res?.result?.records || []
      this.pagination.total = res?.result?.total
      this.loading = false
    },
    async loadRoleList() {
      const res = await getSchoolRoleList({
        schoolId: store.getters.userInfo.school
      })
      this.roleList = res?.result || []
      // const index = this.roleList.findIndex(item => item.name === 'Class Manager')
      // if (index > -1) {
      //   this.roleManageId = this.roleList[index].id
      // }
    },
    handleDeleteRecord: function (record) {
      const params = {
        schoolId: store.getters.userInfo.school,
        userId: record.id,
        classId: this.classId
        // roles: 'teacher'
      }
      this.loading = true
      SchoolClassRemoveClassMember(params).then((res) => {
        if (res.success) {
          this.$message.success(res.message)
          this.loadData()
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    handleAddTeacher(user) {
      if (this.classTeacherList.findIndex(teacher => teacher.id === user.id) > -1) {
        this.$message.error('This teacher has been added')
      }
      const params = {
        schoolId: store.getters.userInfo.school,
        userId: user.id,
        classId: this.classId
        // roles: 'teacher'
      }
      this.selectTeacher = ''
      this.loading = true
      SchoolClassAddClassMember(params).then(res => {
         if (res.success) {
           this.loadData()
         } else {
           this.$message.error(res.message)
           this.loading = false
         }
       })
    },
    onSelect(value) {
      console.log('onSelect', value)
    },

    handleSearch(value) {
      if (!value) {
        this.dataSource = this.teacherList.filter(teacher => this.selectedEmails.indexOf(teacher.userInfo.email) === -1)
      } else {
        this.dataSource = value ? this.searchResult(value) : []
      }
    },
    searchResult(value) {
      return this.teacherList.filter(teacher => this.selectedEmails.indexOf(value) === -1 &&
        teacher.userInfo.email.indexOf(value) > -1)
    }
  }
}
</script>
<style lang="less" scoped>
.operator {
  margin-bottom: 16px;
  button {
    margin-right: 8px;
  }
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
  width: 250px;
  line-height: 24px;
  font-family: Inter-Bold;
  color: #000000;
  display: flex;
  align-items: flex-start;
  .email {
    padding-left: 10px;
  }
  .user-name {
    text-align: center;
    font-family: Inter-Bold;
    line-height: 24px;
    padding-left: 15px;
    color: #000000;
  }
}
.action-wrapper{
  width:20%;
  float: right
}
</style>
