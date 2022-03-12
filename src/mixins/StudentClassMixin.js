export const StudentClassMixin = {
  created() {
    this.$store.watch(
      state => state.user.studentClassList,
      studentClassList => studentClassList && (this.handleClassChange(studentClassList)),
      {
        immediate: true
      }
    )
  },
  methods: {
    handleClassChange(studentClassList) {
      console.log(studentClassList)
    }
  }
}
