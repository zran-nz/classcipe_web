import { debounce } from 'lodash-es'

export const AutoSaveMixin = {
  data () {
    return {
      saving: false,
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
  methods: {
    async autoSaveData () {
      this.$logger.info('AutoSaveMixin: autoSaveData', this.form)
      if (this.save) {
        await this.save()
      } else {
        this.$logger.warn('AutoSaveMixin: autoSaveData: save method not found')
        alert('AutoSaveMixin: autoSaveData: save method not found')
      }
    }
  }
}
