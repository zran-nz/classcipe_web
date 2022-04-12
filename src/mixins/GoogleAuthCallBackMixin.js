import { ErrorCode } from '@/utils/request'
import { ClasscipeEventBus, ClasscipeEvent } from '@/classcipeEventBus'

export const GoogleAuthCallBackMixin = {
  data() {
    return {
      ErrorCode: ErrorCode
    }
  },
  created () {
    ClasscipeEventBus.$on(ClasscipeEvent.GOOGLE_AUTH_REFRESH, this.handleAuthCallback)
  },
  beforeDestroy() {
    ClasscipeEventBus.$off(ClasscipeEvent.GOOGLE_AUTH_REFRESH, this.handleAuthCallback)
  }
}
