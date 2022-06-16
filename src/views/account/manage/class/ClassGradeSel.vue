<template>
  <a-popover
    title=""
    v-if="curriculumOptions && curriculumOptions.length > 0"
    v-model="gradeSelVis"
    placement="bottom"
    :getPopupContainer="trigger => trigger.parentElement"
    @visibleChange="visibleChange"
    trigger="click"
  >
    <div slot="content">
      <div class="class-grade-sel">
        <a-spin :spinning="loading">
          <div
            class="grade-sel-item"
            v-for="item in curriculumOptions"
            :key="item.curriculumName"
          >
            <div class="sel-item-title">
              {{ item.curriculumName }}
            </div>
            <div class="sel-item-con">
              <div
                class="item-grade"
                v-for="grade in item.gradeSettingInfo"
                :key="'grade'+grade.gradeId"
              >
                <a-checkbox :disabled="grade.notEdit" v-model="grade.checked" @change="val => changeGradeCheck(val, grade)">{{ grade.gradeName }}</a-checkbox>
              </div>
            </div>
          </div>
        </a-spin>
        <div class="grade-sel-btn">
          <a-button size="small" @click="doSend" type="primary">Confirm</a-button>
        </div>
      </div>
    </div>
    <custom-text-button label='Add Grade'>
      <template v-slot:icon>
        <a-icon type='plus-circle' />
      </template>
    </custom-text-button>
  </a-popover>
  <custom-text-button v-else label='Add Grade' @click="goCurriculum">
    <template v-slot:icon>
      <a-icon type='plus-circle' />
    </template>
  </custom-text-button>
</template>

<script>
import { getCurriculumBySchoolId } from '@/api/academicSettingCurriculum'
import CustomTextButton from '@/components/Common/CustomTextButton'
export default {
  name: 'ClassGradeSel',
  components: {
    CustomTextButton
  },
  props: {
    school: {
      type: Object,
      default: () => {}
    },
    grades: {
      type: Array,
      default: () => []
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
    grades: {
      handler(val) {
        this.initSels(val)
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      currentSchool: this.school,
      curriculumOptions: [],
      queryParam: {
        searchKey: ''
      },
      loading: false,
      gradeSelVis: false
    }
  },
  methods: {
    initData() {
      this.loading = true
      getCurriculumBySchoolId({
        schoolId: this.currentSchool.id
      }).then(res => {
        if (res.success) {
          this.curriculumOptions = res.result.map(item => {
            const gradeSettingInfo = item.gradeSettingInfo.map(grade => ({
              ...grade,
              checked: false,
              notEdit: false
            }))
            item.gradeSettingInfo = gradeSettingInfo
            return item
          })
          this.initSels()
        }
      }).finally(() => {
        this.loading = false
      })
    },
    initSels() {
      console.log(this.grades)
      this.curriculumOptions.forEach(curri => {
        curri.gradeSettingInfo.forEach(grade => {
          if (this.grades && this.grades.includes(grade.gradeId)) {
            grade.checked = true
            grade.notEdit = true
          } else {
            grade.checked = false
            grade.notEdit = false
          }
        })
      })
    },
    goCurriculum() {
      this.$router.push('/manage/curriculum')
    },
    changeGradeCheck(e, grade) {

    },
    doSend() {
      const grades = []
      this.curriculumOptions.forEach(curri => {
        curri.gradeSettingInfo.forEach(grade => {
          if (grade.checked) {
            grades.push({
              ...grade,
              ...curri
            })
          }
        })
      })
      this.$emit('save', grades)
      this.gradeSelVis = false
    },
    visibleChange(vis) {
      if (!vis) {
        this.initSels()
      }
    }
  }
}
</script>

<style scoped lang="less">
.class-grade-sel {
  display: flex;
  flex-direction: column;
  width: 250px;
  .grade-sel-item {
    .sel-item-title {
      font-weight: bold;
      font-size: 16px;
      line-height: 30px;
      margin-bottom: 10px;
    }
    .sel-item-con {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      .item-grade {
        font-size: 14px;
        width: 50%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    & ~ .grade-sel-item {
      margin-top: 20px;
    }
  }
  .grade-sel-btn {
    margin-top: 20px;
  }
}
</style>
