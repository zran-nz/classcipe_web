<template>
  <div>
    <div class="operator">
      <a-button @click="handleAdd" type="primary" icon="plus">Add</a-button>
      <a-button type="primary" icon="download" @click="downloadTemplate">Download template</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false">
        <a-button type="primary" icon="import">Upload</a-button>
      </a-upload>
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
      @ok="loadDate"
    />
  </div>
</template>

<script>
import SchoolUserTeacherAdd from './SchoolUserTeacherAdd.vue'
import { getSchoolRoleList, getSchoolGroupList, getSchoolClassList, getSchoolUsers } from '@/api/schoolUser'
import store from '@/store'
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
    dataIndex: '',
    key: 'jointime'
  },
  {
    title: 'Status',
    dataIndex: 'userInfo.status',
    key: 'stauts'
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
      roleList: [],
      groupList: [],
      classList: [],
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
    this.loadDate()
    this.loadRoleList()
    this.loadGroupList()
    this.loadClassList()
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
    async loadDate() {
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
    handleAdd: function() {
      this.$refs.modalForm.show()
    },
    handleTableChange(pagination) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.loadDate()
    },
    handleEdit(p) {
      console.log(p)
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
  button {
    margin-right: 8px;
  }
}
.avatar-img {
  width: 100px;
}
</style>
