<template>
  <div class="year-name-set">
    <a-spin :spinning="loading">
      <template v-if="currentCurriculums && currentCurriculums.length > 0">
        <a-form-model layout="horizontal" :model="gradeForm" v-bind="formItemLayout" ref="form">
          <div class="year-name-curriculum" v-for="curriculum in currentCurriculums" :key="'curriculum'+curriculum.id">

            <a-row class="curriculum-title">
              <a-col :span="formItemLayout.labelCol.span">
                <a-checkbox
                  :indeterminate="curriculum.indeterminate"
                  :checked="curriculum.checkAll"
                  @change="val => changeCurriculum(val, curriculum)"
                >{{ curriculum.name || curriculum.curriculumName }}</a-checkbox>
              </a-col>
            </a-row>

            <template v-for="(grade, index) in gradeForm.gradeInfo.filter(item => item.curriculumId === curriculum.id)">
              <a-form-model-item
                :key="'grade'+index"
                class="mb0"
              >
                <div slot="label" class="grade-item">
                  <a-checkbox v-model="grade.checked" @change="val => changeGradeCheck(val, grade)">{{ grade.officialGradeName }}</a-checkbox>
                </div>
                <a-row :gutter=16>
                  <a-col :span="12">
                    <a-form-model-item>
                      <a-input :disabled="!grade.checked" v-model="grade.gradeName" placeholder="input name" />
                      <!-- <a-select :disabled="!grade.checked" mode="tags" v-model="grade.gradeNameArr" :token-separators="[',']">
                      </a-select> -->
                    </a-form-model-item >
                  </a-col>
                  <a-col :span="12">
                    <a-form-model-item>
                      <a-input-number :disabled="!grade.checked" v-model="grade.age" placeholder="input age" />
                    </a-form-model-item >
                  </a-col>
                </a-row>

              </a-form-model-item>
            </template>
          </div>
        </a-form-model>
      </template>

      <div class='empty-tips' v-if='(!currentCurriculums || currentCurriculums.length === 0) && !loading'>
        <no-more-resources />
      </div>
      <!-- <a-space class="year-name-opt">
        <a-button @click="handleCancel">Cancel</a-button>
        <a-button type="primary" :loading="loading" @click="handleSave">Save</a-button>
      </a-space> -->
    </a-spin>
  </div>
</template>

<script>
import { getAllGrades, getAllCurriculums } from '@/api/preference'
import NoMoreResources from '@/components/Common/NoMoreResources'
const { debounce, cloneDeep, groupBy } = require('lodash-es')
export default {
  name: 'YearNameSet',
  components: {
    NoMoreResources
  },
  props: {
    school: {
      type: Object,
      default: () => {}
    },
    curriculums: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    school: {
      handler(val) {
        this.currentSchool = { ...val }
        if (val.id) {
          this.debounceInit()
        }
      },
      deep: true
    },
    curriculums: {
      handler(val) {
        this.initCurriculum(val)
      },
      immediate: false,
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
      currentCurriculums: [],
      allCurriculums: [],
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
      },
      forms: {},
      gradeInfoTotal: [],
      gradeForm: {
        gradeInfo: [{
          gradeId: '',
          gradeName: '',
          gradeNameArr: '',
          age: null,
          officialGradeName: '',
          curriculumId: '',
          checked: false
        }]
      },
      origin: {},
      gradeInfoTree: {}
    }
  },
  methods: {
    initData() {
      this.loading = true
      Promise.all([
        getAllGrades(),
        getAllCurriculums()
      ]).then(([gradeRes, curriculumRes]) => {
        if (gradeRes.success) {
          this.grades = gradeRes.result
        }
        if (curriculumRes.success) {
          this.allCurriculums = curriculumRes.result
        }
        this.gradeInfoTotal = this.grades.map(item => {
          const res = {
            gradeId: item.id,
            gradeName: item.name,
            gradeNameArr: item.name.split(','),
            officialGradeName: item.name,
            curriculumId: item.curriculumId,
            age: item.age,
            checked: true
          }
          return res
        })
        this.initCurriculum(this.curriculums)
      }).finally(res => {
        this.loading = false
      })
    },
    initCurriculum(curriculums) {
      console.log(curriculums)
      let gradeInfos = []
      curriculums.forEach(current => {
        const find = this.gradeInfoTotal.filter(item => item.curriculumId === current.curriculumId)
        const exists = this.gradeForm.gradeInfo.filter(item => item.curriculumId === current.curriculumId)
        console.log(exists)
        if (current.gradeSettingInfo) {
          const actual = find.map(grade => {
            const isFind = current.gradeSettingInfo.find(info => info.gradeId === grade.gradeId)
            const exist = exists.find(ex => ex.gradeId === grade.gradeId)
            return exist ? { ...exist }
              : isFind ? {
                ...isFind,
                gradeNameArr: isFind.gradeName.split(','),
                curriculumId: current.curriculumId,
                checked: true
              } : {
                ...grade,
                checked: false
              }
          })
          gradeInfos = gradeInfos.concat(actual)
        } else {
          const actual = find.map(grade => {
            const exist = exists.find(ex => ex.gradeId === grade.gradeId)
            return exist ? { ...exist } : { ...grade }
          })
          gradeInfos = gradeInfos.concat(cloneDeep(actual))
        }
      })
      this.gradeForm.gradeInfo = gradeInfos

      const gradeInfoTree = groupBy(gradeInfos, 'curriculumId')
      this.origin = cloneDeep(this.gradeForm)
      const covertCurriculums = curriculums.map(item => {
        let indeterminate = false
        let checkAll = false
        if (gradeInfoTree[item.id]) {
          const checkedList = gradeInfoTree[item.id].filter(grade => grade.checked)
          if (checkedList.length === gradeInfoTree[item.id].length) {
            checkAll = true
          } else {
            if (checkedList.length > 0) {
              indeterminate = true
            }
          }
        }
        item.checkAll = checkAll
        item.indeterminate = indeterminate
        return item
      })
      this.currentCurriculums = cloneDeep(covertCurriculums)
    },
    changeCurriculum(e, curriculum) {
      curriculum.checkAll = e.target.checked
      curriculum.indeterminate = false
      this.gradeForm.gradeInfo.forEach(grade => {
        if (grade.curriculumId === curriculum.id) {
          grade.checked = e.target.checked
        }
      })
    },
    changeGradeCheck(e, grade) {
      grade.checked = e.target.checked
      const changeCurri = this.currentCurriculums.find(item => item.id === grade.curriculumId)
      const gradeInfoTree = groupBy(this.gradeForm.gradeInfo, 'curriculumId')
      let indeterminate = false
      let checkAll = false
      console.log(gradeInfoTree)
      if (gradeInfoTree[grade.curriculumId]) {
        const checkedList = gradeInfoTree[grade.curriculumId].filter(grade => grade.checked)
        if (checkedList.length === gradeInfoTree[grade.curriculumId].length) {
          checkAll = true
        } else {
          if (checkedList.length > 0) {
            indeterminate = true
          }
        }
      }
      changeCurri.checkAll = checkAll
      changeCurri.indeterminate = indeterminate
      console.log(changeCurri)
    },
    handleCancel() {
      this.$emit('cancel')
    },
    handleSave() {
      console.log(this.gradeForm)
      this.$refs.form.validate(valid => {
        if (valid) {
          const checkedGrade = this.gradeForm.gradeInfo.filter(item => item.checked)
          const groupByCurri = groupBy(checkedGrade, 'curriculumId')
          const curriculums = []
          for (const curri in groupByCurri) {
            const curriobj = this.allCurriculums.find(item => item.id === curri)
            if (curriobj) {
              const gradeSettingInfo = groupByCurri[curri].map(item => ({
                ...item
                // gradeName: item.gradeNameArr.join(',')
              }))
              curriculums.push({
                curriculumId: curriobj.id,
                curriculumName: curriobj.name,
                gradeSettingInfo: gradeSettingInfo
              })
            }
          }
          this.$emit('save', curriculums)
          // this.loading = true
          // const params = cloneDeep(this.gradeForm)
          // params.schoolId = this.currentSchool.id
          // SaveSchoolGrade(params).then(res => {
          //   if (res.success) {
          //     this.$message.success('Save successfully')
          //     this.$emit('cancel')
          //   }
          // }).finally(res => {
          //   this.loading = false
          // })
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
  padding: 50px 20px;
  overflow: auto;
  height: 100%;
  /deep/ .ant-col {
    & > label {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
}
.year-name-opt {
  justify-content: flex-end;
  width: 100%;
}
.curriculum-title {
  text-align: right;
  font-family: Arial;
  font-weight: bold;
  color: #27729A;
  margin-bottom: 20px;
  /deep/ span {
    font-size: 16px;
  }
}
.mb0 {
  margin-bottom: 0;
}
.empty-tips {
  font-size: 16px;
}
</style>
