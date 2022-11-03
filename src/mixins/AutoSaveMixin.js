import { debounce } from 'lodash-es'
import { formatLocalUTC } from '@/utils/util'

export const AutoSaveMixin = {
  data () {
    return {
      saving: false,
      saveTime: null,
      asyncSaveDataFn: null,
      calculateCanPublishFn: null
    }
  },

  created() {
    this.asyncSaveDataFn = debounce(this.autoSaveData, 1000)
    this.calculateCanPublishFn = debounce(this.calculateCanPublish, 500)
  },
  watch: {
    form: {
      deep: true,
      handler(newVal, oldVal) {
        if (this.canEdit !== false) {
          if (!this.saving) {
            console.log('asyncSaveDataFn')
            this.asyncSaveDataFn()
          }
          console.log('calculateCanPublishFn')
          this.calculateCanPublishFn()
        } else {
          this.$logger.warn('canEdit false', this.canEdit)
        }
      }
    }
  },
  beforeDestroy() {
    this.asyncSaveDataFn.flush()
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
      console.info('AutoSaveMixin: autoSaveData', this.form)
      if (this.save) {
        this.calculateCanPublish()
        await this.save()
        this.saveTime = new Date()
      } else {
        this.$logger.warn('AutoSaveMixin: autoSaveData: save method not found')
        alert('AutoSaveMixin: autoSaveData: save method not found')
      }
    },

    autoSaveMixinUpdateSaveTime () {
      this.saveTime = new Date()
    }
  }
}
