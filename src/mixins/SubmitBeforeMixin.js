import storage from 'store'
export const SubmitBeforeMixin = {
  data() {
    return {
      validateFileds: {}
    }
  },
  computed: {
    hasErrors() {
      return Object.values(this.validateFileds).filter(item => !item).length > 0
    }
  },
  methods: {
    initValidate(isEdit) {
      if (!isEdit && this.validatorRules) {
        this.$refs.form.validateField(Object.keys(this.validatorRules), res => {
          const userId = this.$store.getters.userInfo.id
          const data = this.autoSaveLocalKey ? storage.get(this.autoSaveLocalKey + userId) : ''
          if (!data) {
            this.$refs.form.clearValidate()
          }
        })
      }
    },
    fillValidate(key, value) {
      this.$set(this.validateFileds, key, value)
    }
  }
}
