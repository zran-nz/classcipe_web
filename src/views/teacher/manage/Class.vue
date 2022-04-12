<template>
  <a-card :bordered="false">

    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row type="flex" justify="start">
          <a-col :span="8">
            <a-input-search placeholder="Search for Name、Email..." v-model="searchKey" enter-button @search="searchClass"/>
          </a-col>
          <a-col :span="12">
          </a-col>
          <a-col :span="4">
            <a-button @click="handleAdd" type="primary" icon="plus" style="margin-right: 20px;" >Add</a-button>

            <!--            <a-upload-->
            <!--              name="file"-->
            <!--              :showUploadList="false"-->
            <!--              :multiple="false"-->
            <!--              :headers="tokenHeader"-->
            <!--              :action="importExcelUrl"-->
            <!--              @change="handleMyImportExcel">-->
            <!--              <a-button :loading="importLoading" type="primary" icon="import">{{ importLoadingText }}</a-button>-->
            <!--              <a-dropdown>-->
            <!--                <a-button type="link" shape="circle" icon="download" />-->
            <!--                <a-menu slot="overlay">-->
            <!--                  <a-menu-item key="1">-->
            <!--                    <a-button type="link" icon="download" @click="downloadTemplate">Download template</a-button>-->
            <!--                  </a-menu-item>-->
            <!--                </a-menu>-->
            <!--              </a-dropdown>-->
            <!--            </a-upload>-->

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
      ref="atable"
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

      <a-space slot="action" slot-scope="item" style="display: flex;justify-content: center;align-items: center">
        <a-button v-show="userMode === USER_MODE.SCHOOL" type="primary" shape="round" @click="handleTeacher(item)" >Teachers </a-button>
        <a-button v-show="userMode === USER_MODE.SCHOOL" type="primary" shape="round" @click="handleStudent(item)" >Students </a-button>
        <a-button type="primary" shape="round" @click="handleEdit(item)" >Edit </a-button>
        <a-popconfirm v-show="userMode === USER_MODE.SELF" title="Delete this class ?" ok-text="Yes" @confirm="handleDelete(item)" cancel-text="No">
          <a-button type="primary" shape="round" >Delete </a-button>
        </a-popconfirm>

        <div class="more-action-wrapper action-item-wrapper" v-show="userMode === USER_MODE.SCHOOL">
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

      </a-space>
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
import { GetGradesByCurriculumId } from '@/api/preference'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { SubjectTree } from '@/api/subject'
import { schoolClassAPIUrl, SchoolClassDelete } from '@/api/schoolClass'
import { PersonalClassPagelist, PersonalClassDelete } from '@/api/personaClass'
import ClassStudentList from '@/views/teacher/manage/ClassStudentList'
import ClassTeacherList from '@/views/teacher/manage/ClassTeacherList'
import { USER_MODE } from '@/const/common'
import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'
import { TableWidthMixin } from '@/mixins/TableWidthMixin'
import { mapState } from 'vuex'
const { debounce } = require('lodash-es')

export default {
  name: 'Class',
  mixins: [JeecgListMixin, UserModeMixin, CurrentSchoolMixin, TableWidthMixin],
  components: {
    ClassAdd, ClassStudentList, ClassTeacherList
  },
  data() {
    return {
      classList: [],
      USER_MODE: USER_MODE,
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
      importLoadingText: 'Bulk import',
      debounceInit: null,
      tableRefs: ['atable']
    }
  },
  created() {
    this.initData()
    this.debounceInit = debounce(this.initData, 300)
  },
  computed: {
    importExcelUrl: function () {
      return process.env.VUE_APP_API_BASE_URL + schoolClassAPIUrl.SchoolClassImport
    },
    ...mapState({
      userMode: state => state.app.userMode,
      currentSchool: state => state.user.currentSchool
    }),
    columns() {
      const that = this
      const col = [
        {
          title: 'Class Name',
          dataIndex: 'name',
          key: 'name',
          width: 150
        },
        ...(
          this.userMode === USER_MODE.SELF ? [] : [
            {
              title: 'Class Type',
              dataIndex: 'classType',
              key: 'type',
              width: 150,
              customRender: function (t, r, index) {
                return typeof t !== 'undefined' ? t === 0 ? 'Standard-Class' : 'Subject-focused Class' : ' - '
              }
            },
            {
              title: 'Teacher',
              dataIndex: 'headTeacherName',
              key: 'teacher',
              width: 120
            },
            {
              title: 'Students No.',
              dataIndex: '',
              key: 'studentCount',
              width: 120,
              scopedSlots: { customRender: 'studentsNo' }
            }
          ]
        ),
        {
          title: 'Subject',
          dataIndex: 'subjectName',
          width: 150,
          key: 'subject',
          customRender: function (t, r, index) {
            if (typeof t !== 'undefined') return t
            if (r.subject) {
              const item = that.subjectList.find(item => item.id === r.subject)
              if (item) {
                return item.name
              }
            }
            return ' - '
          }
        },
        {
          title: 'Grade',
          dataIndex: 'gradeName',
          width: 120,
          key: 'grade',
          customRender: function (t, r, index) {
            if (typeof t !== 'undefined') return t
            if (r.gradeId) {
              const item = that.gradeList.find(item => item.id === r.gradeId)
              if (item) {
                return item.name
              }
            }
            return ' - '
          }
        },
        {
          title: 'Creat date',
          dataIndex: 'createTime',
          key: 'date',
          width: 150
        },
        {
          title: 'Action',
          key: 'action',
          align: 'center',
          // dataIndex: 'id',
          scopedSlots: { customRender: 'action' },
          width: this.userMode === USER_MODE.SELF ? '200px' : '350px'
        }
      ]
      return col
    }
  },
  methods: {
    handleSchoolChange(currentSchool) {
      if (this.userMode === USER_MODE.SCHOOL) {
        this.debounceInit()
      }
    },
    handleModeChange(userMode) {
      // 模式切换，个人还是学校 个人接口
      this.debounceInit()
      this.resetTableWidth()
    },
    initData() {
      this.loadData()
      this.getGradeList()
      this.getSubjectList()
      this.getTeacherList()
      this.getStudentList()
    },
    async loadData() {
      this.loading = true
      let promise = null
      if (this.userMode === USER_MODE.SELF) {
        promise = PersonalClassPagelist
      } else {
        promise = getSchoolClassList
      }
      const res = await promise({
        schoolId: this.currentSchool.id,
        searchKey: this.searchKey,
        className: this.searchKey
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
      let promise = null
      if (this.userMode === USER_MODE.SELF) {
        promise = PersonalClassDelete
      } else {
        promise = SchoolClassDelete
      }
      promise(record).then(response => {
        this.$logger.info('SchoolClassDelete', response.result)
        this.loadData()
      })
    },
    getGradeList() {
      const curriculumId = this.userMode === USER_MODE.SELF
          ? this.$store.getters.bindCurriculum : (this.currentSchool.curriculumId || this.$store.getters.bindCurriculum)
      GetGradesByCurriculumId({ curriculumId: curriculumId }).then(response => {
        this.$logger.info('GetGradesByCurriculumId', response.result)
        this.gradeList = response.result
      })
    },
    async getTeacherList() {
      const res = await getSchoolUsers({
        schoolId: this.currentSchool.id,
        roles: 'teacher',
        pageSize: 1000
      })
      this.$logger.info('getSchoolUsers', res.result)
      this.teacherList = res.result ? res.result.records : []
    },
    async getStudentList() {
      const res = await getSchoolUsers({
        schoolId: this.currentSchool.id,
        roles: 'student',
        pageSize: 1000
      })
      this.$logger.info('getSchoolUsers', res.result)
      this.studentList = res.result ? res.result.records : []
    },
    async getSubjectList() {
      const curriculumId = this.userMode === USER_MODE.SELF
          ? this.$store.getters.bindCurriculum : (this.currentSchool.curriculumId || this.$store.getters.bindCurriculum)
      const response = await SubjectTree({ curriculumId: curriculumId })
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
