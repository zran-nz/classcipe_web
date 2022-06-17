<template>
  <a-modal
    v-model="selVis"
    :footer="null"
    :title="null"
    :closable="true"
    destroyOnClose
    width="80%">
    <div style="min-height:400px;">
      <div class="table-page-search-wrapper" style="margin: 30px 0px;">
        <a-form layout="inline">
          <a-row type="flex" justify="space-between" align="middle">
            <a-col :span="10">
              <a-auto-complete
                v-model="selectMember"
                class="global-search"
                size="large"
                style="width: 100%"
                placeholder="Search and add by name/email"
                :getPopupContainer="trigger => trigger.parentElement"
                option-label-prop="title"
                @search="handleSearch"
              >
                <template slot="dataSource">
                  <a-select-option v-for="item in filterMembers" :key="item.userInfo.id" :title="item.userInfo.email">
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
                        <a-button type="link" @click="handleAddMember(item.userInfo)">
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
            <template v-if="form.role === 'student'">
              <a-col :span="5">
                <a-upload
                  name="file"
                  :showUploadList="false"
                  :multiple="false"
                  :headers="tokenHeader"
                  :action="importExcelUrl"
                  @change="handleMyImportExcel">
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
              </a-col>
            </template>
          </a-row>
        </a-form>
      </div>

      <a-table
        :columns="columns"
        :data-source="classMemberList"
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
  </a-modal>
</template>

<script>
import { getSchoolUsers } from '@/api/v2/schoolUser'
import { addTeachers, removeTeachers } from '@/api/v2/schoolClass'
import store from '@/store'
import { schoolUserStatusList } from '@/const/schoolUser'
import moment from 'moment'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import {
  schoolClassStudentAPIUrl
} from '@/api/schoolClassStudent'

export default {
  name: 'ClassMemberList',
  mixins: [JeecgListMixin],
  components: {

  },
  data() {
    return {
      statusList: schoolUserStatusList,
      classMemberList: [],
      teacherList: [],
      url: {
        importExcelUrl: schoolClassStudentAPIUrl.SchoolClassStudentImportExcel
      },
      importLoadingText: 'Bulk import',
      loading: false,
      selVis: false,
      pagination: {
        pageSize: 20,
        current: 1,
        total: 0
      },
      baseUrl: process.env.VUE_APP_API_BASE_URL,
      searchKey: '',
      selectMember: '',
      form: {
        role: 'teacher',
        classId: ''
      }
    }
  },
  created() {

  },
  computed: {
    filterMembers() {
      return this.teacherList.filter(member => this.selectedEmails.indexOf(member.userInfo.email) === -1 &&
        member.userInfo.email.indexOf(this.searchKey || '') > -1)
    },
    importExcelUrl() {
      return process.env.VUE_APP_API_BASE_URL + this.url.importExcelUrl + '?classId=' + this.form.classId
    },
    selectedEmails() {
      return this.classMemberList.map(item => {
        return item.userInfo.email
      })
    },
    columns() {
      return [
        {
          title: 'Nick Name',
          dataIndex: 'userInfo.nickname',
          key: 'name'
        },
        ...this.form.role === 'teacher' ? [
        {
          title: 'Role',
          dataIndex: 'roles',
          scopedSlots: { customRender: 'roles' },
          key: 'roles'
        }] : [],
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
              const index = text.findIndex(item => item.id === this.form.classId)
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
          scopedSlots: { customRender: 'action' },
          width: '150px'
        }
      ]
    }
  },
  methods: {
    async initMemberList() {
      const res = await getSchoolUsers({
        schoolId: store.getters.school,
        roles: this.form.role,
        pageNo: 1,
        pageSize: 1000
      })
      if (res.result) {
        this.teacherList = res.result.records || []
      }
    },
    async loadData() {
      this.loading = true
      const res = await getSchoolUsers({
        schoolId: store.getters.school,
        roles: this.form.role,
        classes: this.form.classId,
        pageSize: this.pagination.pageSize,
        pageNo: this.pagination.current
      })
      this.classMemberList = res?.result?.records || []
      this.pagination.total = res?.result?.total
      this.loading = false
    },
    doCreate(cls) {
      this.form = { ...cls }
      this.initMemberList()
      this.loadData()
      this.selVis = true
    },
    handleDeleteRecord(record) {
      const params = {
        schoolId: store.getters.school,
        userId: record.id,
        classId: this.form.classId
      }
      let promise = null
      if (this.form.role === 'teacher') {
        promise = removeTeachers
      }
      if (promise) {
        this.loading = true
        promise(params).then((res) => {
          if (res.success) {
            this.$message.success(res.message)
            this.$emit('update')
            this.loadData()
          } else {
            this.$message.warning(res.message)
          }
        })
      }
    },
    handleAddMember(user) {
      if (this.classMemberList.findIndex(member => member.id === user.id) > -1) {
        this.$message.error('This user has been added')
      }
      const params = {
        schoolId: store.getters.school,
        userId: user.id,
        classId: this.form.classId
      }
      this.selectMember = ''
      let promise = null
      if (this.form.role === 'teacher') {
        promise = addTeachers
      }
      if (promise) {
        this.loading = true
        promise(params).then(res => {
          if (res.success) {
            this.$emit('update')
            this.loadData()
          } else {
            this.$message.error(res.message)
            this.loading = false
            this.selVis = false
          }
        })
      }
    },
    handleSearch(val) {
      this.searchKey = val
    },
    handleMyImportExcel(info) {
      if (info.file.status === 'uploading') {
        this.importLoading = true
        this.importLoadingText = 'Uploading...'
      }
      if (info.file.status === 'done') {
        this.importLoading = false
        this.importLoadingText = 'Bulk import'
      }
      this.handleImportExcel(info)
    },
    downloadTemplate () {
      const link = document.createElement('a')
      link.style.display = 'none'
      const url = this.baseUrl + '/classcipe/excel/student.xlsx'
      link.href = url
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link) // 下载完成移除元素
      window.URL.revokeObjectURL(url) // 释放掉blob对象
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
