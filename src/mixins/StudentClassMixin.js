export const StudentClassMixin = {
  data() {
    return {
      unwatch: null,
      routeName: this.$route.name
    }
  },
  created() {
    this.$store.watch(
      state => state.user.classList,
      classList => classList && this.$route.name === this.routeName && (this.handleClassChange(classList))
    )
  },
  beforeDestroy() {
    this.unwatch && this.unwatch()
  },
  methods: {
    handleClassChange(classList) {
      console.log(classList)
    }
  }
}
