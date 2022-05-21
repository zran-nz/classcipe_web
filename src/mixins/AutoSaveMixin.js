import { debounce } from 'lodash-es'

export const AutoSaveMixin = {
  data () {
    return {
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
        this.asyncSaveDataFn()
      }
    }
  },
  methods: {
    autoSaveData () {
      this.$logger.info('AutoSaveMixin: autoSaveData', this.form)
      if (this.save) {
        this.save()
      } else {
        this.$logger.warn('AutoSaveMixin: autoSaveData: save method not found')
        alert('AutoSaveMixin: autoSaveData: save method not found')
      }
    }
  }
}
