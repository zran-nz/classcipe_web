<template>
  <div>
    example
  </div>
</template>

<script>
import { USER_MODE } from '@/const/common'

import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'

import { mapState, mapGetters } from 'vuex'
const { debounce } = require('lodash-es')
export default {
  name: 'MyClassesTeacher',
  mixins: [UserModeMixin, CurrentSchoolMixin],
  props: {
    classId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: true,
      USER_MODE: USER_MODE
    }
  },
  computed: {
    ...mapState({
      userMode: state => state.app.userMode,
      classList: state => state.user.classList,
      currentSchool: state => state.user.currentSchool

    }),
    ...mapGetters(['currentClassList']),
    currentClassName() {
      return (this.currentClassList.find(item => item.id === this.classId) || { name: '' }).name
    }
  },
  created () {
    const currentClass = this.currentClassList.find(item => item.id === this.classId)
    if (!currentClass) {
      this.$router.push({ path: '/teacher/main/created-by-me' })
    }
    this.loadData()
    this.debounceInit = debounce(this.loadData, 300)
  },
  watch: {
    classId: {
      handler(newVal) {
        const currentClass = this.currentClassList.find(item => item.id === newVal)
        if (!currentClass) {
          this.$router.push({ path: '/teacher/main/created-by-me' })
        } else {
          this.loadData()
        }
      }
    }
  },
  methods: {
    handleSchoolChange(currentSchool) {
      if (this.userMode === USER_MODE.SCHOOL) {
        if (this.currentClassList.length === 0) {
          this.$router.push({ path: '/teacher/main/created-by-me' })
        }
        if (!this.currentClassList.find(item => item.id === this.classId)) {
          const classId = this.currentClassList[0].id
          this.$router.push(`/teacher/main/my-classes/${classId}`)
        }
        this.debounceInit()
      }
    },
    handleModeChange(userMode) {
      // 模式切换，个人还是学校 个人接口
      if (this.currentClassList.length === 0) {
        this.$router.push({ path: '/teacher/main/created-by-me' })
      }
      if (!this.currentClassList.find(item => item.id === this.classId)) {
        const classId = this.currentClassList[0].id
        this.$router.push(`/teacher/main/my-classes/${classId}`)
      }
      this.debounceInit()
    },
    loadData() {

    }
  }
}
</script>

<style scoped lang='less'>
@import "~@/components/index.less";
</style>
