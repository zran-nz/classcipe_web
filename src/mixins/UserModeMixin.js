export const UserModeMixin = {
  data() {
    return {
      unwatch: null,
      routeName: this.$route.name
    }
  },
  computed: {
    redirectUrl() {
      if (this.$store.state.user.currentRole === 'student') {
        return '/student/main/my-task'
      } else {
        return '/teacher/managing/class'
      }
    }
  },
  created() {
    this.unwatch = this.$store.watch(
      state => state.app.userMode,
      userMode => userMode && this.$route.name === this.routeName && (this.handleModeChange(userMode))
    )
  },
  beforeDestroy() {
    this.unwatch && this.unwatch()
  },
  methods: {
    // 默认方法，用于路由判断
    handleModeChange(userMode) {
      if (this.$route.meta.mode && this.$route.meta.mode !== userMode) {
        // 返回公共页面
        this.$router.push({ path: this.redirectUrl })
      }
    }
  }
}
