import storage from 'store'
export const SubmitBeforeMixin = {
  data() {
    return {
      validateFileds: {},
      refName: 'form'
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
        this.$refs[this.refName].validateField(Object.keys(this.validatorRules), res => {
          const userId = this.$store.getters.userInfo.id
          const data = this.autoSaveLocalKey ? storage.get(this.autoSaveLocalKey + userId) : ''
          if (!data) {
            this.$refs[this.refName].clearValidate()
          }
        })
      }
    },
    fillValidate(key, value) {
      this.$set(this.validateFileds, key, value)
    }
  }
}
