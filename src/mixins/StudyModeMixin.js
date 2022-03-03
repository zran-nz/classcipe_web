export const StudyModeMixin = {
  created() {
    this.$store.watch(
      state => state.app.studyMode,
      studyMode => studyMode && (this.handleModeChange(studyMode)),
      {
        immediate: true
      }
    )
  },
  methods: {
    handleModeChange(studyMode) {
      if (this.$route.meta.type && this.$route.meta.type !== studyMode) {
        this.$router.push({ path: '/student/main/my-task' })
      }
    }
  }
}
