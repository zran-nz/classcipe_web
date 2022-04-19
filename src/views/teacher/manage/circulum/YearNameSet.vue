<template>
  <div class="year-name-set">
    <a-spin :spinning="loading">
      <a-form-model layout="horizontal" :model="gradeForm" v-bind="formItemLayout" ref="form">
        <a-form-model-item label="Curriculum">
          <a-select
            v-model="currentCurriculumId"
            placeholder="Please Select a curriculum"
            :getPopupContainer="target => target.parentNode"
          >
            <a-select-option
              v-for="param in curriculums"
              :value="param.id"
              :key="'curriculums_' + param.name"
            >
              {{ param.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <template v-for="(grade, index) in gradeForm.gradeInfo">
          <a-form-model-item
            v-show="grade.curriculumId === currentCurriculumId"
            :key="'grade'+index"
            :label="grade.gradeName"
          >
            <!-- :prop="'grade.' + index + '.officialGradeName'"
            :rules="{
              required: true,
              message: 'Please input name',
              trigger: 'blur',
            }"> -->
            <a-input v-model="grade.officialGradeName" placeholder="input name" />
          </a-form-model-item>
        </template>
      </a-form-model>
      <a-space class="year-name-opt">
        <a-button @click="handleCancel">Cancel</a-button>
        <a-button type="primary" @click="handleSave">Save</a-button>
      </a-space>
    </a-spin>
  </div>
</template>

<script>
import { getAllGrades, getAllCurriculums } from '@/api/preference'
import { GetSchoolGrade, SaveSchoolGrade } from '@/api/schoolAcademic'
const { debounce } = require('lodash-es')
export default {
  name: 'YearNameSet',
  props: {
    school: {
      type: Object,
      default: () => {}
    },
    curriculumId: {
      type: String,
      default: ''
    }
  },
  watch: {
    school: {
      handler(val) {
        this.currentSchool = { ...val }
        if (val.id) {
          this.gradeForm.schoolId = val.id
          this.debounceInit()
        }
      },
      deep: true
    },
    curriculumId: {
      handler(val) {
        this.currentCurriculumId = val
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.debounceInit = debounce(this.initData, 500)
    this.currentSchool.id && this.initData()
  },
  data() {
    return {
      currentSchool: this.school,
      currentCurriculumId: this.curriculumId,
      loading: false,
      activeTab: 'year',
      grades: [],
      curriculums: [],
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
      },
      gradeForm: {
        gradeInfo: [{
          gradeId: '',
          gradeName: '',
          officialGradeName: '',
          curriculumId: ''
        }],
        schoolId: this.school ? this.school.id : ''
      }
    }
  },
  methods: {
    initData() {
      this.loading = true
      Promise.all([
        getAllGrades(),
        getAllCurriculums(),
        GetSchoolGrade({
          schoolId: this.currentSchool.id
        })
      ]).then(([gradeRes, curriculumRes, schoolGrades]) => {
        if (gradeRes.success) {
          this.grades = gradeRes.result
        }
        if (curriculumRes.success) {
          this.curriculums = curriculumRes.result
        }
        if (schoolGrades.success) {
          this.gradeForm.gradeInfo = schoolGrades.result.gradeInfo
        }
        // 赋值curriculumIc
        this.gradeForm.gradeInfo = this.grades.map(item => {
          const grade = this.gradeForm.gradeInfo.find(grade => grade.gradeId === item.id)
          const res = {
            gradeId: item.id,
            gradeName: item.name,
            officialGradeName: item.name,
            curriculumId: item.curriculumId
          }
          if (grade) {
            res.officialGradeName = grade.officialGradeName
          }
          return res
        })
        console.log(this.gradeForm.gradeInfo)
      }).finally(res => {
        this.loading = false
      })
    },
    handleCancel() {
      this.$emit('cancel')
    },
    handleSave() {
      console.log(this.gradeForm)
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          SaveSchoolGrade(this.gradeForm).then(res => {
            if (res.success) {
              this.$message.success('Save successfully')
              this.$emit('cancel')
            }
          }).finally(res => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.year-name-set {
  position: relative;
  display: flex;
  flex-direction: column;
  margin-top: 30px;
}
.year-name-opt {
  justify-content: flex-end;
  width: 100%;
}
</style>
