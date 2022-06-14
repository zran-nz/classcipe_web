<template>
  <div>
    example
  </div>
</template>

<script>
import { getCurriculumBySchoolId } from '@/api/academicSettingCurriculum'
export default {
  name: 'ClassGradeSel',
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
      queryParam: {
        searchKey: ''
      },
      loading: false
    }
  },
  methods: {
    initData() {
      this.loading = true
      getCurriculumBySchoolId({
        schoolId: this.currentSchool.id
      }).then(res => {
        if (res.success) {
          this.curriculumOptions = res.result
        }
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped lang="less">

</style>
