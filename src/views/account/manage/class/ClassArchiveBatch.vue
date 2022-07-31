<template>
  <a-modal
    v-model='selVis'
    destroyOnClose
    title='Class change confirm'
    :footer="null"
    width='500px'
    :confirmLoading="loading"
    @cancel='handleCancel'>
    <div>
      <label for="">
        All the classes under this curriculum will be cleared if you disable it, would you like to archive all the classes before you make the changes?
      </label>
      <a-divider style="width: auto;margin:24px -24px;"></a-divider>
      <a-space>
        <a-button @click="handleCancel">Cancel</a-button>
        <a-button :loading="loading" type="primary" @click="handleArchive">Archive all classes</a-button>
        <!-- <a-button :loading="loading" type="primary" @click="handleDelete">Disable and Clear data</a-button> -->
      </a-space>
    </div>
  </a-modal>
</template>

<script>
import {
  listClass,
  archiveClass,
  deleteClass
} from '@/api/v2/schoolClass'

import { getSubjectBySchoolId } from '@/api/academicSettingSubject'

export default {
  name: 'ClassArchiveBatch',
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
      allClass: [],
      schoolSubjects: [],
      model: {
        curriculumIds: [],
        gradeIds: [],
        subjectIds: [],
        curriculums: []
      },
      loading: false,
      selVis: false
    }
  },
  methods: {
    initData() {
      this.loading = true
      Promise.all([
        listClass({
          pageNo: 1,
          pageSize: 10000,
          schoolId: this.currentSchool.id
        }),
        getSubjectBySchoolId({
          schoolId: this.currentSchool.id
        })
      ]).then(([clsRes, subjectRes]) => {
        if (clsRes.success && clsRes.result) {
          this.allClass = clsRes.result.records
        }
        if (subjectRes.success) {
          this.schoolSubjects = subjectRes.result
        }
      }).finally(() => {
        this.loading = false
      })
    },
    doCreate(cls) {
      this.loading = false
      this.model = { ...cls }
      // TODO 没有班级就不弹了
      this.selVis = true
    },
    handleCancel() {
      this.$emit('finish', null)
      this.selVis = false
    },
    getEffectClasses() {
      let subjectIds = this.model.subjectIds || []
      const gradeIds = this.model.gradeIds || []
      let effectClass = []
      // 改变大纲，大纲下对应的所有学科班级都得变动
      if (this.model.curriculumIds && this.model.curriculumIds.length > 0) {
        const realteCurriSubjects = this.schoolSubjects
                              .filter(item => this.model.curriculumIds.includes(item.curriculumId))
                              .map(item => item.subjectList)
        const relateSubjects = realteCurriSubjects.reduce((pre, cur) => {
          return pre.concat([...cur])
        }, []).map(item => item.subjectId)
        subjectIds = subjectIds.concat(relateSubjects)
      }
      if (this.allClass && this.allClass.length > 0) {
        effectClass = this.allClass.filter(item => {
          return gradeIds.includes(item.gradeId) || subjectIds.includes(item.subject)
        })
      }
      return effectClass
    },
    handleArchive() {
      // TODO 排除已经归档的
      const effects = this.getEffectClasses()
      console.log(effects)
      if (effects.length > 0) {
        this.loading = true
          archiveClass({
            ids: effects.map(item => item.id).join(',')
          }).then(res => {
            if (res.success && res.code === 0) {
              this.$message.success('Archive successfully')
              this.$emit('finish', this.model.curriculums)
              this.selVis = false
            }
          }).finally(() => {
            this.loading = false
          })
      } else {
        this.$emit('finish', this.model.curriculums)
        this.selVis = false
      }
    },
    handleDelete() {
      const effects = this.getEffectClasses()
      console.log(effects)
      if (effects.length > 0) {
        this.loading = true
        deleteClass({
          ids: effects.map(item => item.id).join(',')
        }).then(res => {
          if (res.success && res.code === 0) {
            this.$message.success('Delete successfully')
            this.$emit('finish', this.model.curriculums)
            this.selVis = false
          }
        }).finally(() => {
          this.loading = false
        })
      } else {
        this.$emit('finish', this.model.curriculums)
        this.selVis = false
      }
    }
  }
}
</script>

<style scoped lang="less">

</style>
