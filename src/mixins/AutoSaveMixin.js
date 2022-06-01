import { debounce } from 'lodash-es'
import { formatLocalUTC } from '@/utils/util'

export const AutoSaveMixin = {
  data () {
    return {
      saving: false,
      saveTime: null,
      asyncSaveDataFn: null
    }
  },

  created() {
    this.asyncSaveDataFn = debounce(this.autoSaveData, 2000)
  },
  watch: {
    form: {
      deep: true,
      handler(newVal, oldVal) {
        if (!this.saving) {
          this.asyncSaveDataFn()
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
    async autoSaveData () {
      this.$logger.info('AutoSaveMixin: autoSaveData', this.form)
      if (this.save) {
        await this.save()
        this.saveTime = new Date()
      } else {
        this.$logger.warn('AutoSaveMixin: autoSaveData: save method not found')
        alert('AutoSaveMixin: autoSaveData: save method not found')
      }
    }
  }
}
