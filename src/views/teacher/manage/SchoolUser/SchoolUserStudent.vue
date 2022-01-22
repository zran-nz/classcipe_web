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
      :data-source="studentList"
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

    <SchoolUserStudentAdd ref="modalForm" :classList="classList" @ok="loadData" />
  </div>
</template>

<script>
import SchoolUserStudentAdd from './SchoolUserStudentAdd.vue'
import { getSchoolClassList, getSchoolUsers } from '@/api/schoolUser'
import store from '@/store'
import { schoolUserStatusMap } from '@/const/schoolUser'

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id'
  },
  {
    title: 'Name',
    dataIndex: 'userInfo.nickname',
    key: 'name'
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
    title: 'Age',
    dataIndex: 'userInfo.age',
    key: 'age'
  },
  {
    title: 'Parent name',
    dataIndex: 'userInfo.parentName',
    key: 'parentName'
  },
  {
    title: 'Parent email',
    dataIndex: 'userInfo.parentEmail',
    key: 'parentEmail'
  },
  {
    title: 'Parent No',
    dataIndex: 'userInfo.parentNo',
    key: 'parentNo'
  },
  {
    title: 'Status',
    dataIndex: 'userInfo.schoolUserStatus',
    customRender: (text, row, index) => {
      return schoolUserStatusMap[text]
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
  name: 'SchoolUserStudent',
  mixins: [],
  components: {
    SchoolUserStudentAdd
  },
  data() {
    return {
      classList: [],
      studentList: [],
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
    this.loadClassList()
  },
  computed: {},
  methods: {
    async loadClassList() {
      const res = await getSchoolClassList({
        schoolId: store.getters.userInfo.school
      })
      this.classList = res?.result?.records || []
    },
    async loadData() {
      this.loading = true
      const res = await getSchoolUsers({
        school: store.getters.userInfo.school,
        currentRole: 'student',
        pageSize: this.pagination.pageSize,
        pageNo: this.pagination.current
      })
      this.studentList = res?.result?.records || []
      this.pagination.total = res?.result?.total
      this.loading = false
    },
    handleTableChange(pagination) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.loadData()
    },
    handleEdit(p) {
      console.log(p)
    },
    handleAdd: function() {
      this.$refs.modalForm.show()
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
</style>
