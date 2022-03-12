export const StudentSchoolMixin = {
  created() {
    this.$store.watch(
      state => state.user.studentCurrentSchool,
      studentCurrentSchool => studentCurrentSchool && (this.handleSchoolChange(studentCurrentSchool)),
      {
        immediate: true
      }
    )
  },
  methods: {
    handleSchoolChange(studentCurrentSchool) {
      console.log(studentCurrentSchool)
    }
  }
}
