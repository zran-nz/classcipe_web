<template>
  <a-modal
    v-model='selVis'
    destroyOnClose
    title='Import Studentrt Student'
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
        <div class="import-detail-con">
          <div class="detail-con-item" v-for="item in students" :key="item.id">
            <a-checkbox v-model="item.checked" >{{ item.name }}</a-checkbox>
          </div>
        </div>
        <div class="import-detail-tip">
          The selected students will be {{ form.type === 'gradeId' ? 'moved' : 'added' }} to current class
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import { getCurriculumBySchoolId } from '@/api/academicSettingCurriculum'
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
      queryParam: {
        searchKey: '',
        gradeId: '',
        classId: ''
      },
      form: {
        type: 'gradeId',
        classId: ''
      },
      students: [{
        name: 'student a',
        id: 1
      }, {
        name: 'student b',
        id: 2
      }, {
        name: 'student c',
        id: 3
      }],
      loading: false,
      selVis: false
    }
  },
  methods: {
    initData() {
      this.loading = true
      Promise.all([
        getCurriculumBySchoolId({
          schoolId: this.currentSchool.id
        })
      ]).then(([curRes]) => {
        if (curRes.success) {
          let grades = []
          this.curriculumOptions = curRes.result.forEach(item => {
            grades = grades.concat(item.gradeSettingInfo || [])
          })
          this.gradeOptions = grades
        }
      }).finally(() => {
        this.loading = false
      })
    },
    doCreate(cls) {
      this.form = { ...cls }
      this.selVis = true
    },
    changeGrade(gradeId) {

    },
    handleSearch() {

    },
    handleSave() {
      this.selVis = false
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
