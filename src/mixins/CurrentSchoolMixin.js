export const CurrentSchoolMixin = {
  data() {
    return {
      unwatch: null,
      routeName: this.$route.name
    }
  },
  created() {
    this.unwatch = this.$store.watch(
      state => state.user.currentSchool,
      currentSchool => currentSchool && this.$route.name === this.routeName && (this.handleSchoolChange(currentSchool))
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
