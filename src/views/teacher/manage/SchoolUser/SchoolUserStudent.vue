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
                <a-popconfirm title="Delete this class ?" ok-text="Yes" @confirm="handleDelete(item)" cancel-text="No">
                  <a> <a-icon type="delete" theme="filled" /> Delete </a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
        <!-- <a-divider type="vertical" /> -->
      </span>
    </a-table>

    <SchoolUserStudentAdd ref="modalForm" :classList="classList" :gradeList="gradeList" @ok="loadData" />
  </div>
</template>

<script>
import SchoolUserStudentAdd from './SchoolUserStudentAdd.vue'
import { getSchoolClassList, getSchoolUsers, updateUserStatus } from '@/api/schoolUser'
import { getGradeListBySchoolId } from '@/api/grade'
import store from '@/store'
import { schoolUserStatusList } from '@/const/schoolUser'

const columns = [
  {
    title: 'Student ID',
    dataIndex: 'userInfo.workNo',
    key: 'id'
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
      return schoolUserStatusList.find(item => item.id === text)?.name
    },
    key: 'status'
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
  name: 'SchoolUserStudent',
  mixins: [],
  components: {
    SchoolUserStudentAdd
  },
  data() {
    return {
      classList: [],
      gradeList: [],
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
    this.loadGradeList()
  },
  computed: {},
  methods: {
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
<style lang="less">
.ant-table-thead {
  white-space: nowrap;
}
</style>
<style lang="less" scoped>
.operator {
  button {
    margin-right: 8px;
  }
}
.table-action {
  display: flex;
  align-items: center;

  button.reject {
    color: red;
  }
}
</style>
