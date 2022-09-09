import { debounce } from 'lodash-es'
import { formatLocalUTC } from '@/utils/util'
import storage from 'store'

export const AutoSaveLocalMixin = {
  data () {
    return {
      saving: false,
      saveTime: null,
      asyncSaveLocalDataFn: null,
      asyncSaveDataFn: null,
      autoSaveLocalKey: 'FORM_',
      needAutoSave: false,
      needAutoSaveRemote: false
    }
  },

  created() {
    this.asyncSaveLocalDataFn = debounce(this.autoSaveLocalData, 200)
    this.asyncSaveDataFn = debounce(this.autoSaveData, 1000)
  },
  watch: {
    formModel: {
      deep: true,
      handler(newVal, oldVal) {
        if (this.needAutoSave) {
          this.asyncSaveLocalDataFn(newVal)
        }
        if (this.needAutoSaveRemote && !this.loading) {
          this.asyncSaveDataFn(newVal)
        }
      }
    }
  },
  computed: {
    lastChangeSavedTime() {
      const time = this.saveTime || (this.formModel && (this.formModel.updateTime || this.form.createTime))
      if (time) {
        return formatLocalUTC(time)
      } else {
        return ''
      }
    }
  },
  methods: {
    autoSaveLocalData (newVal) {
      const userId = this.$store.getters.userInfo.id
      const schoolId = this.$store.state.user.currentSchool.id
      storage.set(this.autoSaveLocalKey + userId + schoolId, JSON.stringify(newVal))
      this.saveTime = new Date()
    },
    autoSaveData (newVal) {
      this.handleSave(() => {
        this.saveTime = new Date()
      })
    },

    getAutoLocalData () {
      const userId = this.$store.getters.userInfo.id
      const schoolId = this.$store.state.user.currentSchool.id
      const data = storage.get(this.autoSaveLocalKey + userId + schoolId)
      return data ? JSON.parse(data) : {}
    },
    clearLocalData() {
      const userId = this.$store.getters.userInfo.id
      const schoolId = this.$store.state.user.currentSchool.id
      storage.remove(this.autoSaveLocalKey + userId + schoolId)
    }
  }
}
