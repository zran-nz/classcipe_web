<template>
  <div class="curiculum-con">
    <div class="curiculum-list">
      <div class="curiculum-detail">
        <div class="detail-item" v-for="circulum in curriculumOptions" :key="'circulum+' + circulum.id">
          <div class="item-check">
            <a-checkbox v-model="circulum.checked" @change="val => onChange(val, circulum)">
              {{ circulum.name }}
            </a-checkbox>
          </div>
        </div>
      </div>
    </div>

    <div class="curiculum-content">
      <year-name-set ref="yearNameSet" @save="handleSave" :curriculums="choosed" :school="currentSchool"/>s
    </div>

  </div>
</template>

<script>
import { getAllCurriculums } from '@/api/preference'
import { getCurriculumBySchoolId, saveCurriculum } from '@/api/academicSettingCurriculum'
import YearNameSet from './YearNameSet'
import cloneDeep from 'lodash.clonedeep'
export default {
  name: 'CirculumSel',
  components: {
    YearNameSet
  },
  props: {
    school: {
      type: Object,
      default: () => {}
    },
    gradeOptions: {
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
    }
  },
  data() {
    return {
      currentSchool: this.school,
      curriculumOptions: [],
      allOptions: [],
      queryParam: {
        searchKey: ''
      },
      choosed: [],
      yearSetVisible: false,
      initCurriculum: [],
      loading: false
    }
  },
  created() {
  },
  methods: {
    initData() {
      Promise.all([
        getAllCurriculums(),
        getCurriculumBySchoolId({
          schoolId: this.currentSchool.id
        })
      ]).then(([allRes, currentRes]) => {
        if (allRes.success && currentRes.success) {
          console.log(currentRes)
          const choose = []
          this.initCurriculum = currentRes.result
          this.allOptions = allRes.result.map(item => {
            let checked = false
            item.curriculumId = item.id
            if (currentRes.result && currentRes.result.length > 0) {
              currentRes.result.forEach(selected => {
                if (selected.curriculumId === item.id) {
                  checked = true
                  selected.id = item.id
                  selected.curriculumId = item.id
                  item.gradeSettingInfo = selected.gradeSettingInfo ? [...selected.gradeSettingInfo] : []
                  choose.push(cloneDeep(selected))
                }
              })
            } else if (this.currentSchool.curriculumId) {
              const current = Array.isArray(this.currentSchool.curriculumId) ? this.currentSchool.curriculumId : [this.currentSchool.curriculumId]
              if (current.includes(item.id)) {
                checked = true
                choose.push({ ...item })
              }
            }
            return {
              ...item,
              checked: checked
            }
          })
          this.choosed = choose
          this.$emit('change', this.choosed)
          this.curriculumOptions = this.allOptions.concat()
        }
      })
    },
    reset() {
      this.initData()
    },
    formatGrade(id) {
      const current = this.gradeOptions.filter(item => item.curriculumId === id)
      const ages = current.map(item => item.age ? Number(item.age) : 0)
      return Math.min(...ages) + '-' + Math.max(...ages) + ' Years'
    },
    triggerSearch() {
      if (!this.queryParam.searchKey) this.curriculumOptions = this.allOptions.concat()
      this.curriculumOptions = this.allOptions.filter(item => {
        return item.name.toLowerCase().indexOf(this.queryParam.searchKey.toLowerCase()) > -1
      })
    },
    onChange(e, curriculum) {
      console.log(this.choosed)
      if (!e.target.checked) {
        if (this.choosed.length === 1) {
          this.$message.error('Please select at least one')
          curriculum.checked = true
          return
        }
      }
      this.curriculumOptions.forEach(item => {
        // val.target.checked
        if (item.id === curriculum.id) {
          item.checked = e.target.checked
        }
      })
      if (e.target.checked) {
        this.choosed.push({ ...curriculum })
      } else {
        const index = this.choosed.findIndex(item => item.id === curriculum.id)
        if (index > -1) {
          this.choosed.splice(index, 1)
        }
      }
      this.$emit('change', this.choosed)
    },
    doSave() {
      this.$refs.yearNameSet.handleSave()
    },
    handleSave(curriculums) {
      console.log(curriculums)
      this.loading = true
      saveCurriculum({
        schoolId: this.currentSchool.id,
        curriculums: curriculums
      }).then(res => {
        if (res.success) {
          // this.choosed = cloneDeep(curriculums)
          this.initData()
        }
      }).finally(() => {
        this.$emit('save-success')
        this.loading = false
      })
    }
  }
}
</script>

<style scoped lang="less">
.curiculum-con {
  display: flex;
  width: 100%;
  height: 100%;
  flex: 1;
  .curiculum-list {
    width: 300px;
    padding: 45px 60px;
    background: #fff;
    .curiculum-detail {
      display: flex;
      flex-direction: column;
      .detail-item {
        line-height: 20px;
        height: 30px;
        margin: 5px;
        font-size: 14px;
        font-family: Arial;
        font-weight: 400;
        color: #484E52;
      }
    }
  }
  .curiculum-content {
    flex: 1;
  }
}
</style>
