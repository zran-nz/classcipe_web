import { isEmpty } from 'lodash-es'

export const PublishMixin = {
  data () {
    return {
      formSteps: [],
      requiredFields: [],
      emptyRequiredFields: []
    }
  },

  created() {

  },
  methods: {

    checkRequiredFields () {
      this.emptyRequiredFields = []
      this.formSteps.forEach(step => {
        step.showRequiredTips = false
        step.showSatisfiedTips = false
      })

      // 给有未填写字段的step添加红色提示
      this.requiredFields.forEach(field => {
        if (isEmpty(this.form[field])) {
          this.$logger.info(`${field} is empty`, this.form[field])
          this.emptyRequiredFields.push(field)
          this.formSteps.forEach(step => {
            if (step.commonFields.indexOf(field) > -1) {
              step.showRequiredTips = true
              step.showSatisfiedTips = false
            }
          })
        }
      })

      // 剩余step全部为绿色完成提示
      this.formSteps.forEach(step => {
        if (!step.showRequiredTips) {
          step.showSatisfiedTips = true
        }
      })

      this.$logger.info('checkRequiredFields done!', this.formSteps)
    }
  }
}
