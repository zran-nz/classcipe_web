<template>
  <a-card :bordered="false">

    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row type="flex" justify="start">
          <a-col :span="8">
            <a-input-search placeholder="Search for Name、Email..." v-model="searchKey" enter-button @search="searchClass"/>
          </a-col>
          <a-col :span="10">
          </a-col>
          <a-col :span="6">
            <a-button @click="handleAdd" type="primary" icon="plus" style="margin-right: 20px;" >Add</a-button>

            <a-upload
              name="file"
              :showUploadList="false"
              :multiple="false"
              :headers="tokenHeader"
              :action="importExcelUrl"
              @change="handleMyImportExcel">
              <a-button :loading="importLoading" type="primary" icon="import">{{ importLoadingText }}</a-button>
              <a-dropdown>
                <a-button type="link" shape="circle" icon="download" />
                <a-menu slot="overlay">
                  <a-menu-item key="1">
                    <a-button type="link" icon="download" @click="downloadTemplate">Download template</a-button>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </a-upload>

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
            <sup title="25" style="line-height: 20px;font-size: 14px;" class="ant-scroll-number ant-badge-count ant-badge-multiple-words" data-show="true">
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

      <span slot="action" slot-scope="item" style="display: flex;justify-content: space-between;align-items: center">
        <a-button type="primary" shape="round" @click="handleTeacher(item)" >Teachers </a-button>
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

    <ClassAdd
      ref="modalForm"
      @ok="loadData"
      :grade-list="gradeList"
      :subject-list="subjectList"
      :teacher-list="teacherList"/>

    <a-modal
      v-model="classStudentListVisible"
      :footer="null"
      :title="null"
      :closable="true"
      destroyOnClose
      :dialog-style="{ top: '50px' }"
      width="1000px">
      <div>
        <Class-Student-List :classId="classId" :student-list="studentList" @reloadClass="loadData"></Class-Student-List>
      </div>
    </a-modal>

    <a-modal
      v-model="classTeacherListVisible"
      :footer="null"
      :title="null"
      :closable="true"
      destroyOnClose
      :dialog-style="{ top: '50px' }"
      width="1000px">
      <div>
        <Class-Teacher-List :classId="classId" :teacher-list="teacherList"></Class-Teacher-List>
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
import { schoolClassAPIUrl, SchoolClassDelete } from '@/api/schoolClass'
import ClassStudentList from '@/views/teacher/manage/ClassStudentList'
import ClassTeacherList from '@/views/teacher/manage/ClassTeacherList'

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
      return t === 0 ? 'Standard-Class' : 'Subject-focused Class'
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
    ClassAdd, ClassStudentList, ClassTeacherList
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
      studentList: [],
      subjectList: [],
      url: {
        delete: schoolClassAPIUrl.SchoolClassDelete
      },
      classStudentListVisible: false,
      classTeacherListVisible: false,
      classId: '',
      importLoadingText: 'Bulk import'
    }
  },
  created() {
    this.loadData()
    this.getGradeList()
    this.getSubjectList()
    this.getTeacherList()
    this.getStudentList()
  },
  computed: {
    importExcelUrl: function () {
      return process.env.VUE_APP_API_BASE_URL + schoolClassAPIUrl.SchoolClassImport
    }
  },
  methods: {
    async loadData() {
      this.loading = true
      const res = await getSchoolClassList({
        schoolId: store.getters.userInfo.school,
        searchKey: this.searchKey
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
    handleDelete(record) {
      this.$logger.info('handleDelete ', record)
      SchoolClassDelete(record).then(response => {
        this.$logger.info('SchoolClassDelete', response.result)
        this.loadData()
      })
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
    async getStudentList() {
      const res = await getSchoolUsers({
        school: store.getters.userInfo.school,
        currentRole: 'student',
        pageSize: 1000
      })
      this.$logger.info('getSchoolUsers', res.result)
      this.studentList = res.result ? res.result.records : []
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
    },
    handleTeacher(item) {
      this.classId = item.id
      this.classTeacherListVisible = true
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
      const url = 'https://dev.classcipe.com/classcipe/excel/class.xlsx'
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
@import "~@/components/index.less";
.operator {
  margin-bottom: 16px;
  button {
    margin-right: 8px;
  }
}
</style>
