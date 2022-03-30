export const StudentClassMixin = {
  data() {
    return {
      unwatch: null,
      routeName: this.$route.name
    }
  },
  created() {
    this.$store.watch(
      state => state.user.studentClassList,
      studentClassList => studentClassList && this.$route.name === this.routeName && (this.handleClassChange(studentClassList))
    )
  },
  beforeDestroy() {
    this.unwatch && this.unwatch()
  },
  methods: {
    handleClassChange(studentClassList) {
      console.log(studentClassList)
    }
  }
}
