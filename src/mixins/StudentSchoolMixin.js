export const StudentSchoolMixin = {
  created() {
    this.$store.watch(
      state => state.user.currentSchool,
      currentSchool => currentSchool && (this.handleSchoolChange(currentSchool)),
      {
        immediate: true
      }
    )
  },
  methods: {
    handleSchoolChange(currentSchool) {
      console.log(currentSchool)
    }
  }
}
