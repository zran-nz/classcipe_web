<template>
  <div>
    <div class="operator">
      <a-button @click="handleAdd" type="primary" icon="plus">Add</a-button>
      <a-button type="primary" icon="download" @click="downloadTemplate">Download template</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false">
        <a-button type="primary" icon="import">Upload</a-button>
      </a-upload>
    </div>

    <div class="search-box">
      <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-row>
          <a-col :span="6">
            <a-form-item label="Status">
              <a-select v-decorator="['status', { rules: [] }]">
                <a-select-option :value="item.id" :key="item.id" v-for="item in statusList">{{
                  item.name
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="Groups">
              <a-select v-decorator="['groups', { rules: [] }]">
                <a-select-option :value="item.id" :key="item.id" v-for="item in groupList">{{
                  item.name
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="Role">
              <a-select v-decorator="['roles', { rules: [] }]">
                <a-select-option :value="item.id" :key="item.id" v-for="item in roleList">{{
                  item.name
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="Class">
              <a-select v-decorator="['classes', { rules: [] }]">
                <a-select-option :value="item.id" :key="item.id" v-for="item in classList">{{
                  item.name
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="Grade">
              <a-select v-decorator="['grades', { rules: [] }]">
                <a-select-option :value="item.id" :key="item.id" v-for="item in gradeList">{{
                  item.name
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
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
      <span slot="classes" slot-scope="classes">
        <span v-for="clas in classes" :key="clas.id">
          {{ clas.name }}
        </span>
      </span>
      <span slot="groups" slot-scope="groups">
        <span v-for="group in groups" :key="group.id">
          {{ group.name }}
        </span>
      </span>
      <span slot="action" slot-scope="item">
        <a @click="handleEdit(item)"> <a-icon type="edit" theme="filled" /> Edit </a>
        <!-- <a-divider type="vertical" />
        <a>Delete</a> -->
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
  </div>
</template>

<script>
import SchoolUserTeacherAdd from './SchoolUserTeacherAdd.vue'
import { getSchoolRoleList, getSchoolGroupList, getSchoolClassList, getSchoolUsers } from '@/api/schoolUser'
import { getGradeListBySchoolId } from '@/api/grade'
import store from '@/store'
import { schoolUserStatusList } from '@/const/schoolUser'
import Moment from 'moment'

const columns = [
  {
    title: 'Picture',
    dataIndex: 'userInfo.avatar',
    scopedSlots: { customRender: 'avatar' },
    key: 'avatar'
  },
  {
    title: 'Name',
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
    width: '150px'
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
      statusList: schoolUserStatusList,
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
      baseUrl: process.env.VUE_APP_API_BASE_URL
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
      const res = await getSchoolUsers({
        school: store.getters.userInfo.school,
        currentRole: 'teacher',
        pageSize: this.pagination.pageSize,
        pageNo: this.pagination.current
      })
      this.teacherList = res?.result?.records || []
      this.pagination.total = res?.result?.total
      this.loading = false
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
    handleTableChange(pagination) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.loadData()
    },
    downloadTemplate() {
      const link = document.createElement('a')
      link.style.display = 'none'
      const url = this.baseUrl + '/classcipe/excel/knowledge_template_example.xlsx'
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
.avatar-img {
  width: 100px;
}
</style>
