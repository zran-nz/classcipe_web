<template>
  <a-card :bordered="false">

    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row type="flex" justify="start">
          <a-col :span="8">
            <a-input-search placeholder="Search for ID、Name、Email..." v-model="searchKey" enter-button @search="searchClass"/>
          </a-col>
          <a-col :span="4">
          </a-col>
          <a-col :span="4">

          </a-col>
          <a-col :span="4">
            <a-button @click="handleAdd" type="primary" icon="plus">Add</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="operator">

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
      <span slot="studentsNo" slot-scope="record" >
        <span>
          {{ record.studentCount }}
          <span class="ant-badge ant-badge-not-a-wrapper" v-if="record.newStudentCount > 0" style="margin-left:10px;">
            <sup title="25" class="ant-scroll-number ant-badge-count ant-badge-multiple-words" data-show="true">
              <p class="ant-scroll-number-only-unit current">+{{ record.newStudentCount }}</p>
            </sup>
          </span>
        </span>
      </span>
      <span slot="grades" slot-scope="grades">
        <span v-for="grade in grades" :key="grade.id">
          {{ grade.name }}
        </span>
      </span>

      <span slot="action" slot-scope="item" style="display: flex;justify-content: space-between;">
        <a-button type="primary" shape="round" >Teachers </a-button>
        <a-button type="primary" shape="round" @click="handleStudent(item)" >Students </a-button>
        <a-button type="primary" shape="round" @click="handleEdit(item)" >Edit </a-button>

        <div class="more-action-wrapper action-item-wrapper" >
          <a-dropdown>
            <a-icon type="more" style="margin-right: 8px" />
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="Delete this class ?" ok-text="Yes" @confirm="handleDelete(item)" cancel-text="No">
                  <a>
                    <a-icon type="delete" theme="filled" /> Delete
                  </a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>

        <!--        <a-divider type="vertical" />-->

      </span>
    </a-table>

    <ClassAdd ref="modalForm" @ok="loadData" :grade-list="gradeList" :subject-list="subjectList" :teacher-list="teacherList"/>

    <a-modal
      v-model="classStudentListVisible"
      :footer="null"
      :title="null"
      :closable="true"
      destroyOnClose
      :dialog-style="{ top: '50px' }"
      width="1000px">
      <div>
        <Class-Student-List :classId="classId"></Class-Student-List>
      </div>
    </a-modal>

  </a-card>
</template>

<script>
import ClassAdd from './ClassAdd.vue'

import { getSchoolClassList, getSchoolUsers } from '@/api/schoolUser'
import store from '@/store'
import { GetGradesByCurriculumId } from '@/api/preference'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { SubjectTree } from '@/api/subject'
import { schoolClassAPIUrl } from '@/api/schoolClass'
import ClassStudentList from '@/views/teacher/manage/ClassStudentList'

const columns = [
  {
    title: 'Class Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Class Type',
    dataIndex: 'classType',
    key: 'type',
    customRender: function (t, r, index) {
      return t === 0 ? 'Standard-Class' : 'Subject-Forcused Class'
    }
  },
  {
    title: 'Teacher',
    dataIndex: 'headTeacherName',
    key: 'teacher'
  },
  {
    title: 'Students No.',
    dataIndex: '',
    key: 'studentCount',
    scopedSlots: { customRender: 'studentsNo' }
  },
  {
    title: 'Subject',
    dataIndex: 'subjectName',
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
    width: '300px'
  }
]
export default {
  name: 'Class',
  mixins: [JeecgListMixin],
  components: {
    ClassAdd, ClassStudentList
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
      },
      searchKey: '',
      gradeList: [],
      teacherList: [],
      subjectList: [],
      url: {
        delete: schoolClassAPIUrl.SchoolClassDelete
      },
      classStudentListVisible: false,
      classId: ''
    }
  },
  created() {
    this.loadData()
    this.getGradeList()
    this.getSubjectList()
    this.getTeacherList()
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
      this.$refs.modalForm.add({})
    },
    handleEdit(record) {
      this.$refs.modalForm.title = 'Edit Class'
      this.$refs.modalForm.edit(record)
      this.$refs.modalForm.disableSubmit = false
    },
    getGradeList() {
      GetGradesByCurriculumId({ curriculumId: this.$store.getters.bindCurriculum }).then(response => {
        this.$logger.info('GetGradesByCurriculumId', response.result)
        this.gradeList = response.result
      })
    },
    async getTeacherList() {
      const res = await getSchoolUsers({
        school: store.getters.userInfo.school,
        currentRole: 'teacher',
        pageSize: 1000
      })
      this.$logger.info('getSchoolUsers', res.result)
      this.teacherList = res.result ? res.result.records : []
    },
    async getSubjectList() {
      const response = await SubjectTree({ curriculumId: this.curriculumId })
      this.$logger.info('getSubjectTree response', response.result)
      this.subjectList = response.result ? response.result : []
    },
    searchClass() {
      this.loadData()
    },
    handleStudent(item) {
      this.classId = item.id
        this.classStudentListVisible = true
    }
  }
}
</script>
<style lang="less" scoped>
@import "~@/components/index.less";
.operator {
  margin-bottom: 16px;
  button {
    margin-right: 8px;
  }
}
</style>
