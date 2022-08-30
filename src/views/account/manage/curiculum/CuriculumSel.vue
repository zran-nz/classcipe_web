<template>
  <div class="curiculum-con">
    <div class="curiculum-list">
      <a-spin :spinning="loading">
        <div class="curiculum-detail">
          <div class="detail-item" v-for="circulum in curriculumOptions" :key="'circulum+' + circulum.id">
            <div class="item-check">
              <a-tooltip v-if="circulum.disabled" title="This curriculum has linked with class, you can unselect this curriculum after you archive all the relevant classes">
                <a-checkbox v-model="circulum.checked" :disabled="true">
                  {{ circulum.name }}
                </a-checkbox>
              </a-tooltip>
              <a-checkbox v-model="circulum.checked" v-else @change="val => onChange(val, circulum)">
                {{ circulum.name }}
              </a-checkbox>
            </div>
          </div>
        </div>
      </a-spin>
    </div>

    <div class="curiculum-content">
      <year-name-set ref="yearNameSet" @disabledCurriculum="handleSetDisabled" @save="handleSave" :curriculums="choosed" :school="currentSchool"/>
    </div>
    <class-archive-batch ref="classArchiveBatch" @finish="truelySave" :school="currentSchool"/>
  </div>
</template>

<script>
import { getAllCurriculums } from '@/api/preference'
import { getCurriculumBySchoolId, saveCurriculum } from '@/api/academicSettingCurriculum'
import YearNameSet from './YearNameSet'
import ClassArchiveBatch from '../class/ClassArchiveBatch'
import cloneDeep from 'lodash.clonedeep'
import { differenceBy, reduce } from 'lodash-es'
import { USER_MODE } from '@/const/common'
export default {
  name: 'CirculumSel',
  components: {
    YearNameSet,
    ClassArchiveBatch
  },
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
      allOptions: [],
      queryParam: {
        searchKey: ''
      },
      choosed: [],
      origin: [],
      yearSetVisible: false,
      initCurriculum: [],
      loading: false
    }
  },
  created() {
  },
  methods: {
    initData() {
      this.loading = true
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
              // 无需兼容老数据
              // const current = Array.isArray(this.currentSchool.curriculumId) ? this.currentSchool.curriculumId : [this.currentSchool.curriculumId]
              // if (current.includes(item.id)) {
              //   checked = true
              //   choose.push({ ...item })
              // }
            }
            return {
              ...item,
              checked: checked
            }
          })
          this.choosed = cloneDeep(choose)
          this.origin = choose
          this.$emit('change', this.choosed)
          this.curriculumOptions = this.allOptions.map(item => ({
            ...item,
            disabled: false
          }))
        }
      }).finally(() => {
        this.loading = false
      })
    },
    reset() {
      this.initData()
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
      const rmCuris = differenceBy(this.origin, this.choosed, 'curriculumId')
      const addCuris = differenceBy(this.choosed, this.origin, 'curriculumId')
      this.$emit('change', this.choosed, (rmCuris.length > 0 || addCuris.length > 0))
    },
    doSave() {
      this.$refs.yearNameSet.handleSave()
    },
    handleSave(curriculums) {
      // 被删除的大纲下的班级需要删除，被删除的年级下的班级需要删除
      const diffParams = this.diffChanges(this.origin, curriculums)
      console.log(diffParams)
      if (diffParams.curriculumIds.length > 0 || diffParams.gradeIds.length > 0) {
        this.$refs.classArchiveBatch.doCreate({
          ...diffParams,
          curriculums: curriculums
        })
      } else {
        this.truelySave(curriculums)
      }
    },
    truelySave(curriculums) {
      console.log(curriculums)
      if (!curriculums) {
        this.$emit('save-success', true)
        return
      }
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
        this.$store.dispatch('initSubjectGradeData', {
          schoolId: this.$store.getters.school,
          bindCurriculumId: this.$store.getters.bindCurriculum,
          applyType: this.$store.state.app.userMode === USER_MODE.SCHOOL ? 1 : 2,
          applyUserId: this.$store.state.user.info.id
        })
      })
    },
    diffChanges(old, current) {
      const rmCuris = differenceBy(old, current, 'curriculumId')
      const curriculumIds = rmCuris.map(item => item.curriculumId)
      const oldGrades = reduce(old, (res, cur) => {
        return res.concat(cur.gradeSettingInfo)
      }, [])
      const currentGrades = reduce(current, (res, cur) => {
        return res.concat(cur.gradeSettingInfo)
      }, [])
      // 获取被删除的grade
      const rmGrades = differenceBy(oldGrades, currentGrades, 'gradeId')
      const gradeIds = rmGrades.map(item => item.gradeId)
      return {
        curriculumIds: curriculumIds,
        gradeIds: gradeIds
      }
    },
    handleSetDisabled(ids) {
      if (ids.length > 0) {
        this.curriculumOptions.forEach(item => {
          if (ids.includes(item.id)) {
            item.disabled = true
          } else {
            item.disabled = false
          }
        })
      }
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
