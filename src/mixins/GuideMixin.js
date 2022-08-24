import storage from 'store'
import { USER_MODE } from '@/const/common'
import GuideEvent from '@/components/GuideContent/GuideEvent'
// import { SetCompleteGuide, GetCompleteGuide } from '@/api/user'

export const GuideMixin = {
  data () {
    return {
      cacheKey: 'GUIDE_',
      guideData: {
        [USER_MODE.SELF]: {
          'planningFormat': {
            visible: false // 是否已经展示
          },
          'tagsSetting': {
            visible: false
          },
          'verification': {
            visible: false
          }
        },
        [USER_MODE.SCHOOL]: {
          'classSetting': {
            visible: false
          },
          'addGrade': {
            visible: false
          },
          'addStandardClass': {
            visible: false
          },
          'classStudentUpload': {
            visible: false
          }
        }
      }
    }
  },
  mounted() {
    this.initGuide()
  },
  created() {
    this.$EventBus.$on(GuideEvent.GUIDE_SKIP, this.skipGuide)
    this.$EventBus.$on(GuideEvent.GUIDE_NEXT, this.nextGuide)
    this.$EventBus.$on(GuideEvent.GUIDE_FINISH, this.finishGuide)
  },
  beforeDestroy() {
    this.$EventBus.$off(GuideEvent.GUIDE_SKIP, this.skipGuide)
    this.$EventBus.$off(GuideEvent.GUIDE_NEXT, this.nextGuide)
    this.$EventBus.$off(GuideEvent.GUIDE_FINISH, this.finishGuide)
  },
  methods: {
    getCacheKey() {
      const userId = this.$store.getters.userInfo.id
      const userMode = this.$store.state.app.userMode
      return this.cacheKey + userMode + userId
    },
    // 切换用户模式，动态加载的时候重新调用
    initGuide() {
      const cachekey = this.getCacheKey()
      const userMode = this.$store.state.app.userMode
      const cached = storage.get(cachekey)
      if (cached) {
        this.$EventBus.$emit(GuideEvent.GUIDE_CACHE, JSON.parse(cached))
      } else {
        storage.set(cachekey, JSON.stringify(this.guideData[userMode]))
        this.$EventBus.$emit(GuideEvent.GUIDE_CACHE, this.guideData[userMode])
      }
    },
    skipGuide(key, doNext = false) {
      const cachekey = this.getCacheKey()
      const cached = JSON.parse(storage.get(cachekey))
      cached[key].visible = true
      storage.set(cachekey, JSON.stringify(cached))
      if (doNext) {
        this.$EventBus.$emit(GuideEvent.GUIDE_CACHE, cached)
      }
    },
    nextGuide(key) {
      this.skipGuide(key, true)
    },
    finishGuide() {
      const cachekey = this.getCacheKey()
      const userMode = this.$store.state.app.userMode
      const data = this.guideData[userMode]
      for (const key in data) {
        data[key].visible = true
      }
      storage.set(cachekey, JSON.stringify(data))
    }
  }
}
