<template>
  <div>
    <div class="table-page-search-wrapper" style="margin: 20px 0px;">
      <a-form layout="inline">
        <a-row type="flex" justify="start">
          <a-col :span="8">
            <a-input-search placeholder="Search for Name、Email..." v-model="searchKey" enter-button @search="searchQuery"/>
          </a-col>
          <a-col :span="8">
          </a-col>
          <a-col :span="4">
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
        <a-popconfirm title="Remove this student ?" ok-text="Yes" @confirm="handleDeleteRecord(record)" cancel-text="No">
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
import { SchoolClassStudentDelete } from '@/api/schoolClassStudent'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'

const columns = [
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
    dataIndex: 'userInfo.schoolJoinDate',
    customRender: (text, row, index) => {
      if (text) {
        return moment.utc(text).local().format('yyyy-MM-DD HH:mm')
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
]
export default {
  name: 'ClassTeacherList',
  mixins: [JeecgListMixin],
  components: {

  },
  props: {
    classId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      statusList: schoolUserStatusList,
      roleList: [],
      teacherList: [],
      columns,
      loading: false,
      pagination: {
        pageSize: 20,
        current: 1,
        total: 0
      },
      baseUrl: process.env.VUE_APP_API_BASE_URL,
      searchKey: ''
    }
  },
  created() {
    this.loadData()
    this.loadRoleList()
  },
  computed: {},
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
      this.teacherList = res?.result?.records || []
      this.pagination.total = res?.result?.total
      this.loading = false
    },
    async loadRoleList() {
      const res = await getSchoolRoleList({
        schoolId: store.getters.userInfo.school
      })
      this.roleList = res?.result || []
    },
    handleDeleteRecord: function (record) {
      SchoolClassStudentDelete(record).then((res) => {
        if (res.success) {
          this.$message.success(res.message)
          this.loadData()
        } else {
          this.$message.warning(res.message)
        }
      })
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
</style>
