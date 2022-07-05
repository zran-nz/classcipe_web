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
      userMode => {
        if (userMode && this.$route.name === this.routeName) {
          this.handleModeChange(userMode)
          this.routeInMode()
        }
      }
    )
    this.routeInMode()
  },

  beforeDestroy() {
    this.unwatch && this.unwatch()
  },
  methods: {
    // 判断路由是否存在
    routeInMode() {
      if (this.$route.meta.mode && this.$route.meta.mode !== this.$store.state.app.userMode) {
        // 返回公共页面
        this.$router.push({ path: this.redirectUrl })
      }
    },
    // 默认方法,可覆盖
    handleModeChange(userMode) {
    }
  }
}
