<template>
  <a-modal
    v-model='selVis'
    destroyOnClose
    title='Import Student'
    width='650px'
    okText='Import'
    :confirmLoading="loading"
    @ok='handleSave'
    @cancel='selVis = false'>
    <div class="class-student-import">
      <div class="student-import-opt">
        <a-select
          class="import-opt-item"
          :getPopupContainer="trigger => trigger.parentElement"
          v-model='queryParam.gradeId'
          @change="changeGrade"
          placeholder='Please select grade'>
          <a-select-option key=''>All</a-select-option>
          <a-select-option v-for='item in gradeOptions' :key='item.gradeId'>
            {{ item.gradeName }}
          </a-select-option >
        </a-select>
        <a-select
          class="import-opt-item"
          :getPopupContainer="trigger => trigger.parentElement"
          v-model='queryParam.classId'
          @change="handleSearch"
          placeholder='Please select class'>
          <a-select-option key=''>All</a-select-option>
          <a-select-option v-for='item in classOptions' :key='item.id'>
            {{ item.name }}
          </a-select-option >
        </a-select>
        <a-input-search
          class="import-opt-item"
          placeholder="Please enter keyword"
          v-model="queryParam.searchKey"
          @search="handleSearch"></a-input-search>
      </div>
      <div class="student-import-detail">
        <a-spin :spinning="loading">
          <div class="import-detail-con" v-if="students && students.length > 0">
            <div class="detail-con-item" v-for="item in students" :key="item.id">
              <a-checkbox v-model="item.checked" >{{ item.userInfo.email }}</a-checkbox>
            </div>
          </div>
          <a-empty v-else/>
        </a-spin>
        <div class="import-detail-tip">
          The selected students will be {{ form.type === 'gradeId' ? 'moved' : 'added' }} to class [ {{ form.className }} ]
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import { getCurriculumBySchoolId } from '@/api/academicSettingCurriculum'
import { listClass, studentImport } from '@/api/v2/schoolClass'
import { getSchoolUsers } from '@/api/v2/schoolUser'
import { debounce, groupBy } from 'lodash-es'
export default {
  name: 'ClassStudentImport',
  props: {
    school: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    school: {
      handler(val) {
        this.currentSchool = { ...val }
        this.initData()
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      currentSchool: this.school,
      curriculumOptions: [],
      gradeOptions: [],
      classOptions: [],
      allClass: [],
      groupData: {},
      queryParam: {
        searchKey: '',
        gradeId: '',
        classId: ''
      },
      form: {
        type: 'gradeId',
        classId: '',
        className: ''
      },
      students: [],
      loading: false,
      selVis: false
    }
  },
  created() {
    this.debounceSearch = debounce(this.searchData, 300)
  },
  methods: {
    initData() {
      this.loading = true
      Promise.all([
        getCurriculumBySchoolId({
          schoolId: this.currentSchool.id
        }),
        listClass({
          queryType: 0,
          pageNo: 1,
          pageSize: 10000,
          schoolId: this.currentSchool.id
        })
      ]).then(([curRes, clsRes]) => {
        let grades = []
        if (curRes.success) {
          this.curriculumOptions = curRes.result.forEach(item => {
            grades = grades.concat(item.gradeSettingInfo || [])
          })
        }
        if (clsRes.success) {
          this.allClass = clsRes.result.records
          this.groupData = groupBy(clsRes.result.records, 'gradeId')
          this.gradeOptions = grades.filter(item => {
            const isFind = this.groupData[item.gradeId]
            return isFind
          })
          this.classOptions = clsRes.result.records.filter(item => item.id !== this.form.classId)
        }
      }).finally(() => {
        this.debounceSearch()
      })
    },
    searchData() {
      this.loading = true
      getSchoolUsers({
        pageNo: 1,
        pageSize: 10000,
        schoolId: this.currentSchool.id,
        classes: this.queryParam.classId,
        grades: this.queryParam.gradeId,
        searchKey: this.queryParam.searchKey,
        roles: 'student'
      }).then(res => {
        if (res.success) {
          this.students = res.result.records.map(item => ({
            ...item,
            checked: false
          }))
        }
      }).finally(() => {
        this.loading = false
      })
    },
    doCreate(cls) {
      this.form = { ...cls }
      this.classOptions = this.classOptions.filter(item => item.id !== this.form.classId)
      this.selVis = true
    },
    changeGrade(gradeId) {
      let classOptions = []
      if (gradeId) {
        classOptions = this.groupData[gradeId] || []
      } else {
        classOptions = this.allClass
      }
      this.classOptions = classOptions.filter(item => item.id !== this.form.classId)
      this.queryParam.classId = ''
      this.debounceSearch()
    },
    handleSearch() {
      this.debounceSearch()
    },
    handleSave() {
      const sels = this.students.filter(item => item.checked).map(item => item.id)
      if (sels && sels.length > 0) {
        this.loading = true
        studentImport({
          classId: this.form.classId,
          schoolId: this.currentSchool.id,
          studentIds: sels
        }).then(res => {
          if (res.success) {
            this.$emit('update')
          }
        }).finally(() => {
          this.loading = false
          this.selVis = false
        })
      } else {
        this.$message.error('Please select at least one student')
      }
    }
  }
}
</script>

<style scoped lang="less">
.class-student-import {
  position: relative;
  .student-import-opt {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .import-opt-item {
      flex: 1;
      & ~ .import-opt-item {
        margin-left: 10px;
      }
    }
  }
  .student-import-detail {
    position: relative;
    margin-top: 20px;
    .import-detail-con {
      height: 300px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      .detail-con-item {
        height: 30px;
        line-height: 30px;
        margin: 5px 0;
      }
    }
    .import-detail-tip {
      margin-top: 20px;
      height: 40px;
      line-height: 40px;
      background: #C8A883;
      border-radius: 3px;
      color: #fff;
      padding: 0 10px;
    }
  }
}
</style>
