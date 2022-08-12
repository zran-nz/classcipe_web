import { debounce } from 'lodash-es'
import { formatLocalUTC } from '@/utils/util'
import storage from 'store'

export const AutoSaveLocalMixin = {
  data () {
    return {
      saving: false,
      saveTime: null,
      asyncSaveDataFn: null,
      autoSaveLocalKey: 'FORM_',
      needAutoSave: false
    }
  },

  created() {
    this.asyncSaveDataFn = debounce(this.autoSaveLocalData, 200)
  },
  watch: {
    formModel: {
      deep: true,
      handler(newVal, oldVal) {
        if (this.needAutoSave) {
          this.asyncSaveDataFn(newVal)
        }
      }
    }
  },
  computed: {
    lastChangeSavedTime() {
      const time = this.saveTime || (this.form && (this.form.updateTime || this.form.createTime))
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
      storage.set(this.autoSaveLocalKey + userId, JSON.stringify(newVal))
    },

    getAutoLocalData () {
      const userId = this.$store.getters.userInfo.id
      const data = storage.get(this.autoSaveLocalKey + userId)
      return data ? JSON.parse(data) : {}
    },
    clearLocalData() {
      const userId = this.$store.getters.userInfo.id
      storage.remove(this.autoSaveLocalKey + userId)
    }
  }
}
