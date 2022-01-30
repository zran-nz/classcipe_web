<template>
  <a-card>
    <div class="operator">
      <div class="status-select">
        <a :class="{ active: activeStatus === '' }" @click="handleChangeStatus('')"><span>All</span></a>
        <a :class="{ active: activeStatus === '1' }" @click="handleChangeStatus('1')"><span>Active</span></a>
        <a :class="{ active: activeStatus === '0,2' }" @click="handleChangeStatus('0,2')">
          <span>Pending</span>
        </a>
        <a :class="{ active: activeStatus === '4' }" @click="handleChangeStatus('4')">
          <span>Archived</span>
        </a>
      </div>
      <div class="upload-wrapper">
        <a-button @click="handleAdd" type="primary" icon="plus">Add</a-button>

        <a-upload name="file" :showUploadList="false" :multiple="false" :customRequest="handleMyImportExcel">
          <a-button :loading="importLoading" type="primary" icon="import">{{ importLoadingText }}</a-button>
        </a-upload>

        <a-dropdown>
          <a-button type="link" shape="circle" icon="download" />
          <a-menu slot="overlay">
            <a-menu-item key="1">
              <a-button type="link" icon="download" @click="downloadTemplate">Download template</a-button>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </div>

    <div class="search-box">
      <a-form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-row>
          <a-col :span="8">
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
          <a-col :span="4">
            <div style="line-height: 32px; margin-top: 6px">
              <a @click="handleAdvancedSearch">
                <span>{{ showAdvancedSearch ? 'General Search' : 'Advanced Search' }}</span>
              </a>
            </div>
          </a-col>
        </a-row>
        <a-card v-show="showAdvancedSearch">
          <a-row>
            <a-col :span="6">
              <a-form-item label="Groups">
                <a-select allowClear v-decorator="['groups', { rules: [] }]">
                  <a-select-option :value="item.id" :key="item.id" v-for="item in groupList">{{
                    item.name
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="Role">
                <a-select allowClear v-decorator="['roles', { rules: [] }]">
                  <a-select-option :value="item.id" :key="item.id" v-for="item in roleList">{{
                    item.name
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="Class">
                <a-select allowClear v-decorator="['classes', { rules: [] }]">
                  <a-select-option :value="item.id" :key="item.id" v-for="item in classList">{{
                    item.name
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="Grade">
                <a-select allowClear v-decorator="['grades', { rules: [] }]">
                  <a-select-option :value="item.id" :key="item.id" v-for="item in gradeList">{{
                    item.name
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <div class="search-box-btn">
            <a-button type="primary" shape="round" @click="handleReset">reset</a-button>
            <a-button type="primary" shape="round" @click="handleSearch">search</a-button>
          </div>
        </a-card>
      </a-form>
    </div>

    <a-table
      :columns="columns"
      :data-source="teacherList"
      :loading="loading"
      :pagination="pagination"
      @change="handleTableChange"
      :scroll="{ x: true }"
      rowKey="id"
    >
      <span slot="avatar" slot-scope="avatar">
        <img :src="avatar" class="avatar-img" />
      </span>
      <div slot="roles" slot-scope="roles" class="table-tag">
        <span v-for="role in roles" :key="role.id">
          {{ role.name }}
        </span>
      </div>
      <div slot="grades" slot-scope="grades" class="table-tag">
        <span v-for="grade in grades" :key="grade.id">
          {{ grade.name }}
        </span>
      </div>
      <div slot="classes" slot-scope="classes" class="table-tag">
        <span v-for="clas in classes" :key="clas.id">
          {{ clas.name }}
        </span>
      </div>
      <div slot="groups" slot-scope="groups" class="table-tag">
        <span v-for="group in groups" :key="group.id">
          {{ group.name }}
        </span>
      </div>
      <span slot="action" slot-scope="item" class="table-action">
        <a-button
          v-if="item.userInfo.schoolUserStatus !== 2 && item.userInfo.schoolUserStatus !== 3"
          type="primary"
          shape="round"
          @click="handleEdit(item)"
          icon="edit"
        >
          Edit
        </a-button>
        <a-button v-if="item.userInfo.schoolUserStatus === 2" shape="round" @click="handleApprove(item)">
          Approve
        </a-button>
        <a-button v-if="item.userInfo.schoolUserStatus === 2" class="reject" shape="round" @click="handleReject(item)">
          Reject
        </a-button>
        <div
          v-if="item.userInfo.schoolUserStatus !== 2 && item.userInfo.schoolUserStatus !== 3"
          class="more-action-wrapper action-item-wrapper"
        >
          <a-dropdown>
            <a-icon type="more" style="margin-right: 8px" />
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm
                  title="Delete this teacher ?"
                  ok-text="Yes"
                  @confirm="handleDelete(item)"
                  cancel-text="No"
                >
                  <a> <a-icon type="delete" theme="filled" /> Delete </a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
      </span>
    </a-table>

    <SchoolUserTeacherAdd
      ref="modalForm"
      :roleList="roleList"
      :groupList="groupList"
      :classList="classList"
      :gradeList="gradeList"
      @ok="loadData"
    />
  </a-card>
</template>

<script>
import SchoolUserTeacherAdd from './SchoolUserTeacherAdd.vue'
import {
  getSchoolRoleList,
  getSchoolClassList,
  getSchoolUsers,
  updateUserStatus,
  schoolUserAPIUrl
} from '@/api/schoolUser'
import { getSchoolGroupList } from '@/api/schoolGroup'
import { getGradeListBySchoolId } from '@/api/grade'
import store from '@/store'
import { schoolUserStatusList } from '@/const/schoolUser'
import Moment from 'moment'
import * as logger from '@/utils/logger'

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
    title: 'Grade',
    dataIndex: 'grades',
    scopedSlots: { customRender: 'grades' },
    key: 'grades'
  },
  {
    title: 'Class',
    dataIndex: 'classes',
    scopedSlots: { customRender: 'classes' },
    key: 'classes'
  },
  {
    title: 'Groups',
    dataIndex: 'groups',
    scopedSlots: { customRender: 'groups' },
    key: 'groups'
  },
  {
    title: 'Date of join',
    dataIndex: 'userInfo.schoolJoinDate',
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
    title: 'Status',
    dataIndex: 'userInfo.schoolUserStatus',
    customRender: (text, row, index) => {
      return schoolUserStatusList.find(item => item.id === text)?.name
    },
    key: 'status'
  },
  {
    title: 'Action',
    key: 'action',
    // dataIndex: 'id',
    scopedSlots: { customRender: 'action' },
    // fixed: 'right',
    width: '180px'
  }
]
export default {
  name: 'SchoolUserTeacher',
  mixins: [],
  components: {
    SchoolUserTeacherAdd
  },
  data() {
    return {
      roleList: [],
      groupList: [],
      classList: [],
      gradeList: [],
      teacherList: [],
      columns,
      loading: false,
      pagination: {
        pageSize: 20,
        current: 1,
        total: 0
      },
      baseUrl: process.env.VUE_APP_API_BASE_URL,
      activeStatus: '',
      form: this.$form.createForm(this, { name: 'teacherSearch' }),
      showAdvancedSearch: false,
      importLoadingText: 'Bulk import',
      importLoading: false
    }
  },
  created() {
    this.loadData()
    this.loadRoleList()
    this.loadGroupList()
    this.loadClassList()
    this.loadGradeList()
  },
  computed: {},
  methods: {
    async loadRoleList() {
      const res = await getSchoolRoleList({
        schoolId: store.getters.userInfo.school
      })
      this.roleList = res?.result || []
    },
    async loadGroupList() {
      const res = await getSchoolGroupList({
        schoolId: store.getters.userInfo.school
      })
      this.groupList = res?.result?.records || []
    },
    async loadClassList() {
      const res = await getSchoolClassList({
        schoolId: store.getters.userInfo.school
      })
      this.classList = res?.result?.records || []
    },
    async loadGradeList() {
      const res = await getGradeListBySchoolId({
        schoolId: store.getters.userInfo.school
      })
      this.gradeList = res?.result || []
    },
    async loadData() {
      this.loading = true
      const searchParams = this.form.getFieldsValue()
      const res = await getSchoolUsers({
        school: store.getters.userInfo.school,
        currentRole: 'teacher',
        pageSize: this.pagination.pageSize,
        pageNo: this.pagination.current,
        userStatus: this.activeStatus,
        ...searchParams
      })
      this.teacherList = res?.result?.records || []
      this.pagination.total = res?.result?.total
      this.loading = false
    },
    handleChangeStatus(status) {
      this.activeStatus = status
      this.loadData()
    },
    async handleSearch() {
      const pager = { ...this.pagination }
      pager.current = 1
      this.pagination = pager
      this.loadData()
    },
    handleReset() {
      this.form.resetFields()
    },
    handleAdvancedSearch() {
      this.showAdvancedSearch = !this.showAdvancedSearch
    },
    handleEdit(data) {
      console.log(data)
      this.$refs.modalForm.title = 'Edit Teacher'
      this.$refs.modalForm.mode = 'edit'
      this.$refs.modalForm.defaultData = data
      this.$refs.modalForm.show()
    },
    handleAdd: function() {
      this.$refs.modalForm.title = 'Add Teacher'
      this.$refs.modalForm.mode = 'add'
      this.$refs.modalForm.defaultData = {}
      this.$refs.modalForm.show()
    },
    handleDelete(item) {},
    async changeUserStatus(id, status) {
      const res = await updateUserStatus({
        schoolId: store.getters.userInfo.school,
        schoolUserStatus: status,
        userId: id
      })
      if (res.success) {
        this.$message.success(res.message)
        this.loadData()
      } else {
        this.$message.error(res.message)
      }
    },
    handleApprove(item) {
      this.changeUserStatus(item.id, 1)
    },
    handleReject(item) {
      this.changeUserStatus(item.id, 3)
    },
    handleTableChange(pagination) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.loadData()
    },
    downloadTemplate() {
      const link = document.createElement('a')
      link.style.display = 'none'
      const url = this.baseUrl + '/classcipe/excel/school_staff_template.xlsx'
      link.href = url
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link) // 下载完成移除元素
      window.URL.revokeObjectURL(url) // 释放掉blob对象
    },
    handleMyImportExcel(data) {
      logger.info('import excel', data)
      const formData = new FormData()
      formData.append('file', data.file, data.file.name)
      this.importLoading = true
      this.$http
        .post(schoolUserAPIUrl.importStaff, formData, {
          contentType: false,
          processData: false,
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 60000,
          params: {
            schoolId: store.getters.userInfo.school
          }
        })
        .then(res => {
          logger.info('import excel res:', res)
          if (res.success) {
            const { result = {} } = res
            const { alreadyImportedCount, insertCount, invalidCount, totalCount, updateCount } = result
            // alreadyImportedCount: 0
            // insertCount: 1
            // invalidCount: 0
            // totalCount: 1
            // updateCount: 0
            if (totalCount === insertCount) {
              this.$success({
                title: 'Import successfully'
              })
            } else {
              this.$warning({
                title: 'A bit more patience is needed',
                content: (
                  <div>
                    <p>alreadyImportedCount: {alreadyImportedCount}</p>
                    <p>insertCount: {insertCount}</p>
                    <p>invalidCount: {invalidCount}</p>
                    <p>totalCount: {totalCount}</p>
                    <p>updateCount: {updateCount}</p>
                  </div>
                )
              })
            }
          } else {
            this.$error({
              title: 'Import failed',
              content: 'Import failed. Please upload again!'
            })
          }
        })
        .catch(err => {
          logger.info('import excel err:', err)
          this.$error({
            title: 'Import failed',
            content: 'Import failed. Please upload again!'
          })
        })
        .finally(() => {
          this.importLoading = false
          this.loadData()
        })
    }
  }
}
</script>

<style lang="less">
.ant-table-thead,
.ant-table-tbody {
  white-space: nowrap;
}
</style>
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
  margin-bottom: 16px;
  .search-box-btn {
    text-align: center;
    button {
      margin: 0px 8px;
    }
  }
}
.table-tag {
  span {
    display: table;
    // border: 1px solid #15c39a;
    border-radius: 6px;
    margin: 4px;
    padding: 0px 4px;
  }
}
.table-action {
  display: flex;
  align-items: center;

  button.reject {
    color: red;
  }
}
.avatar-img {
  width: 40px;
}
</style>
