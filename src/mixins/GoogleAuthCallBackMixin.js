import { ErrorCode } from '@/utils/request'
import { ClasscipeEventBus, ClasscipeEvent } from '@/classcipeEventBus'

export const GoogleAuthCallBackMixin = {
  data() {
    return {
      ErrorCode: ErrorCode,
      currentMethodName: null, // 当前操作方法名，用于授权回调判断后续操作。
      currentMethodParam: null // 当前操作方法参数
    }
  },
  created () {
    ClasscipeEventBus.$on(ClasscipeEvent.GOOGLE_AUTH_REFRESH, this.handleAuthCallback)
  },
  beforeDestroy() {
    ClasscipeEventBus.$off(ClasscipeEvent.GOOGLE_AUTH_REFRESH, this.handleAuthCallback)
  },
  methods: {
    handleAuthCallback() {}
  }
}
