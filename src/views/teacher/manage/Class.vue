<template>
  <a-card :bordered="false">
    <div class="operator">
      <a-button @click="handleAdd" type="primary" icon="plus">Add</a-button>
      <!-- <a-button type="primary" icon="download" @click="downloadTemplate">Download template</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false">
        <a-button type="primary" icon="import">Upload</a-button>
      </a-upload> -->
    </div>
    <a-table
      :columns="columns"
      :data-source="classList"
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

    <ClassAdd ref="modalForm" @ok="loadData" />
  </a-card>
</template>

<script>
import ClassAdd from './ClassAdd.vue'

import { getSchoolClassList } from '@/api/schoolUser'
import store from '@/store'
const columns = [
  {
    title: 'Class Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Class Type',
    dataIndex: 'classType',
    key: 'type'
  },
  {
    title: 'Teacher',
    dataIndex: 'headTeacherName',
    key: 'teacher'
  },
  {
    title: 'Students No.',
    dataIndex: '',
    key: 'studentsNo'
  },
  {
    title: 'Subject',
    dataIndex: 'subject',
    key: 'subject'
  },
  {
    title: 'Grade',
    dataIndex: 'gradeName',
    key: 'grade'
  },
  {
    title: 'Creat date',
    dataIndex: 'createTime',
    key: 'date'
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
  name: 'Class',
  mixins: [],
  components: {
    ClassAdd
  },
  data() {
    return {
      classList: [],
      columns,
      loading: false,
      pagination: {
        pageSize: 20,
        current: 1,
        total: 0
      }
    }
  },
  created() {
    this.loadData()
  },
  computed: {},
  methods: {
    async loadData() {
      this.loading = true
      const res = await getSchoolClassList({
        schoolId: store.getters.userInfo.school
      })
      this.classList = res?.result?.records || []
      this.loading = false
    },
    handleTableChange(pagination) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.loadData()
    },
    handleAdd: function() {
      this.$refs.modalForm.title = 'Add Class'
      this.$refs.modalForm.mode = 'add'
      this.$refs.modalForm.defaultData = {}
      this.$refs.modalForm.show()
    },
    handleEdit(data) {}
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
