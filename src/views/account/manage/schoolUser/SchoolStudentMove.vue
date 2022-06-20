<template>
  <a-modal
    v-model='selVis'
    destroyOnClose
    title='Move Student'
    width='500px'
    okText='Confirm'
    :confirmLoading="loading"
    @ok='handleSave'
    @cancel='selVis = false'>
    <div class="move-opt">
      <a-row type="flex" align="middle" justify="space-between">
        <a-col>
          <label for="">Please select class to move students</label>
        </a-col>
        <a-col>
          <a-select
            class="move-opt-item"
            :getPopupContainer="trigger => trigger.parentElement"
            v-model='gradeId'
            @change="changeGrade"
            placeholder='Please select grade'>
            <a-select-option v-for='item in gradeOptions' :key='item.gradeId'>
              {{ item.gradeName }}
            </a-select-option >
          </a-select>
        </a-col>
      </a-row>
      <div class="student-import-detail">
        <div class="import-detail-title">Class</div>
        <div class="import-detail-con" v-if="result && result.length > 0">
          <a-radio-group v-model="classId" >
            <a-radio class="detail-con-item" v-for="item in result" :key="item.id" :value="item.id">
              {{ item.name }}
            </a-radio>
          </a-radio-group>
        </div>
        <a-empty v-else/>
      </div>
    </div>
  </a-modal>
</template>

<script>
import { getCurriculumBySchoolId } from '@/api/academicSettingCurriculum'
import { groupBy } from 'lodash-es'

export default {
  name: 'SchoolStudentMove',
  props: {
    classes: {
      type: Array,
      default: () => []
    },
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
    },
    classes: {
      handler(val) {
        this.classList = [...val]
        this.initGrade()
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      selVis: false,
      loading: false,
      grades: [],
      gradeId: '',
      classId: '',
      result: [],
      gradeOptions: []
    }
  },
  methods: {
    initData() {
      getCurriculumBySchoolId({
          schoolId: this.currentSchool.id
      }).then(curRes => {
        let grades = []
        if (curRes.success) {
          this.curriculumOptions = curRes.result.forEach(item => {
            grades = grades.concat(item.gradeSettingInfo || [])
          })
        }
        this.grades = grades
      })
    },
    initGrade() {
      const standard = this.classList.filter(item => item.classType === 0)
      const groupData = groupBy(standard, 'gradeId')
      console.log(standard)
      this.gradeOptions = this.grades.filter(item => {
        const isFind = groupData[item.gradeId]
        return isFind
      })
      if (this.gradeOptions.length > 0) {
        this.gradeId = this.gradeOptions[0].gradeId
        this.changeGrade(this.gradeId)
      }
    },
    doCreate() {
      this.initGrade()
      this.selVis = true
    },
    changeGrade(gradeId) {
      this.result = this.classList.filter(item => item.gradeId === gradeId)
      if (this.result.length > 0) {
        this.classId = this.result[0].id
      }
    },
    handleSave() {
      const cls = this.classList.find(item => item.id === this.classId)
      if (!cls) {
        this.$message.error('Please select a class')
        return
      }
      this.$confirm({
        title: 'Confirm to move selected students to class ' + cls.name,
        centered: true,
        okText: 'Confirm',
        onOk: () => {
          // TODO move
          this.$emit('update')
          this.selVis = false
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.move-opt-item {
  width: 120px;
}
.student-import-detail {
  position: relative;
  margin-top: 20px;
  .import-detail-title {
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 10px;
  }
  .import-detail-con {
    height: 200px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    .detail-con-item {
      height: 30px;
      line-height: 30px;
      margin: 5px 0;
      display: block;
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
</style>
