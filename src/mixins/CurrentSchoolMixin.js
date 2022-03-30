export const CurrentSchoolMixin = {
  data() {
    return {
      unwatch: null
    }
  },
  created() {
    this.unwatch = this.$store.watch(
      state => state.user.currentSchool,
      currentSchool => currentSchool && (this.handleSchoolChange(currentSchool)),
      {
        immediate: true
      }
    )
  },
  beforeDestroy() {
    this.unwatch && this.unwatch()
  },
  methods: {
    // 默认方法，各个组件可自定义覆盖此方法
    handleSchoolChange(currentSchool) {
      console.log(currentSchool)
    }
  }
}
