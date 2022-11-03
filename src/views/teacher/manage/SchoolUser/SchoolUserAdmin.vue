<template>
  <a-card>
    <div class="operator">
      <a-col :span="12">
        <div class="search-box">
          <a-form :form="form" :label-col="{ span: 14 }" :wrapper-col="{ span: 16 }">
            <a-row>
              <a-col :span="14">
                <a-form-item label="">
                  <a-input-search
                    v-decorator="['name', { rules: [] }]"
                    style="width: 300px"
                    placeholder="Search for ID、Name、Email..."
                    enter-button
                    @search="handleSearch"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </a-col>

      <a-col :span="8">
        <a-auto-complete
          v-if="isAdd"
          v-model="selectTeacher"
          class="global-search"
          size="large"
          style="width: 100%"
          placeholder="Search and add by name/email"
          option-label-prop="title"
          @focus="handleSearchTeacher"
          @select="onSelect"
          @search="handleSearchTeacher"
        >
          <template slot="dataSource">
            <a-select-option v-for="item in optionsList" :key="item.userInfo.id" :title="item.userInfo.email">
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

      <div class="upload-wrapper">
        <a-button @click="isAdd=true" type="primary" icon="plus">Add</a-button>
      </div>
    </div>

    <a-table
      :columns="columns"
      :data-source="adminList"
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
      <span slot="avatar" slot-scope="avatar">
        <img :src="avatar" class="avatar-img" />
      </span>
      <span slot="action" slot-scope="item" class="table-action">
        <!--        <a-button-->
        <!--          v-if="item.userInfo.schoolUserStatus !== 2 && item.userInfo.schoolUserStatus !== 3"-->
        <!--          type="primary"-->
        <!--          shape="round"-->
        <!--          @click="handleEdit(item)"-->
        <!--          icon="edit"-->
        <!--        >-->
        <!--          Edit-->
        <!--        </a-button>-->
        <a-popconfirm
          v-if="item.id !== info.id"
          title="Remove this admin ?"
          ok-text="Yes"
          @confirm="handleDelete(item)"
          cancel-text="No"
        ><a-button shape="round" icon="delete">
          Remove
        </a-button>
        </a-popconfirm>

        <!-- <a-divider type="vertical" /> -->
      </span>
    </a-table>

  </a-card>
</template>

<script>

import { addStaff, getSchoolUsers, removeSchoolUser } from '@/api/schoolUser'
import SchoolUserStudentAdd from '@/views/teacher/manage/SchoolUser/SchoolUserStudentAdd'
import { SchoolUserRole } from '@/const/role'
import Moment from 'moment'
import { mapState } from 'vuex'

const columns = [
  {
    title: 'Picture',
    dataIndex: 'userInfo.avatar',
    scopedSlots: { customRender: 'avatar' },
    key: 'avatar'
  },
  {
    title: 'Name',
    dataIndex: 'userInfo',
    customRender: (text, row, index) => {
      return `${text.firstname} ${text.lastname}`
    },
    key: 'name'
  },
  {
    title: 'Email',
    dataIndex: 'userInfo.email',
    key: 'email'
  },
  {
    title: 'Lasted Accessed',
    dataIndex: 'schoolJoinDate',
    customRender: (text, row, index) => {
      if (text) {
        return Moment(text).format('YYYY-MM-DD')
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
    width: '180px'
  }
]

export default {
  name: 'SchoolUserAdmin',
  mixins: [],
  components: {
    SchoolUserStudentAdd
  },
  data() {
    return {
      teacherList: [],
      optionsList: [],
      selectTeacher: '',
      adminList: [],
      columns,
      loading: false,
      isAdd: false,
      pagination: {
        pageSize: 15,
        current: 1,
        pageSizeOptions: ['15', '30', '50'],
        showTotal: (total, range) => {
          return 'Total ' + total + ' items'
        },
        total: 0
      },
      baseUrl: process.env.VUE_APP_API_BASE_URL,
      form: this.$form.createForm(this, { name: 'teacherSearch' })
    }
  },
  created() {
    this.initData()
  },
  computed: {
    selectedEmails() {
      return this.adminList.map(item => {
        return item.userInfo.email
      })
    },
    ...mapState({
      info: state => state.user.info,
      currentSchool: state => state.user.currentSchool
    })
  },
  methods: {
    initData() {
      this.getTeacherList()
      this.loadData()
      this.optionsList = this.teacherList.filter(teacher => this.selectedEmails.indexOf(teacher.userInfo.email) === -1)
    },
    onSelect(value) {
      console.log('onSelect', value)
    },
    async loadData() {
      this.loading = true
      const searchParams = this.form.getFieldsValue()
      const res = await getSchoolUsers({
        schoolId: this.currentSchool.id,
        roles: SchoolUserRole.admin,
        pageSize: this.pagination.pageSize,
        pageNo: this.pagination.current,
        userStatus: this.activeStatus,
        ...searchParams
      })
      this.adminList = res?.result?.records || []
      this.pagination.total = res?.result?.total
      this.loading = false
    },
    async getTeacherList() {
      const res = await getSchoolUsers({
        schoolId: this.currentSchool.id,
        roles: SchoolUserRole.teacher,
        pageSize: 1000
      })
      console.info('getTeacherList', res.result)
      this.teacherList = res.result ? res.result.records : []
    },
    async handleSearch() {
      const pager = { ...this.pagination }
      pager.current = 1
      this.pagination = pager
      this.loadData()
    },
    handleTableChange(pagination) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.loadData()
    },
    handleReset() {
      this.form.resetFields()
    },
    handleEdit(data) {
      console.log(data)
      this.$refs.modalForm.title = 'Edit Student'
      this.$refs.modalForm.mode = 'edit'
      this.$refs.modalForm.defaultData = data
      this.$refs.modalForm.show()
    },
    handleAdd() {
      this.$refs.modalForm.title = 'Add Student'
      this.$refs.modalForm.mode = 'add'
      this.$refs.modalForm.defaultData = {}
      this.$refs.modalForm.show()
    },
    async handleDelete(item) {
      const res = await removeSchoolUser({
        schoolId: this.currentSchool.id,
        userId: item.id,
        role: SchoolUserRole.admin
      })
      if (res.success) {
        this.$message.success(res.message)
        this.loadData()
      } else {
        this.$message.error(res.message)
      }
    },
    handleSearchTeacher(value) {
      if (!value) {
        this.optionsList = this.teacherList.filter(teacher => this.selectedEmails.indexOf(teacher.userInfo.email) === -1)
      } else {
        this.optionsList = this.teacherList.filter(teacher => this.selectedEmails.indexOf(value) === -1 &&
          teacher.userInfo.email.indexOf(value) > -1)
      }
    },
    async handleAddTeacher(user) {
      this.confirmLoading = true
      console.log('Received values of form: ', user)
      const params = {
        schoolId: this.currentSchool.id,
        avatar: this.avatar,
        ...user,
        roles: SchoolUserRole.admin,
        email: user.email
      }
      console.log('post params: ', params)
      const res = await addStaff(params)
      if (res.success) {
        this.confirmLoading = false
        this.isAdd = false
        this.loadData()
      } else {
        this.confirmLoading = false
        this.$message.error(res.message)
      }
    }
  }
}
</script>
<style lang="less" scoped>

.operator {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  .status-select {
    a {
      color: #11142d;
    }
    span {
      padding: 8px 16px;
      cursor: pointer;
    }
    .active {
      color: #15c39a;
    }
  }
  .upload-wrapper {
    button {
      margin-right: 8px;
    }
  }
}
.search-box {
  .search-box-btn {
    margin-top: 4px;
    text-align: center;
    button {
      margin: 0px 8px;
    }
  }
}
.avatar-img {
  width: 40px;
}
.table-action {
  display: flex;
  align-items: center;

  button.reject {
    color: red;
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

</style>
