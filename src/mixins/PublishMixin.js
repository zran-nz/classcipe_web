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

      // 检查必填项是否为空,只检测null,undefined,空字符串,空数组,空对象
      function simpleIsEmpty(value) {
        if (value === null || value === '' || value === undefined) {
          return true
        }

        if (value.hasOwnProperty('length') && value.length === 0) {
          return true
        }

        if (JSON.stringify(value) === '{}') {
          return true
        }

        return false
      }

      this.emptyRequiredFields = []
      this.formSteps.forEach(step => {
        step.showRequiredTips = false
        step.showSatisfiedTips = false
      })

      // 给有未填写字段的step添加红色提示
      let showRequiredTips = false
      this.requiredFields.forEach(field => {
        if (simpleIsEmpty(this.form[field])) {
          this.$logger.info(`${field} is empty`, this.form[field])
          this.emptyRequiredFields.push(field)
          this.formSteps.forEach(step => {
            if (step.commonFields.indexOf(field) > -1) {
              step.showRequiredTips = true
              step.showSatisfiedTips = false
              showRequiredTips = true
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

      if (showRequiredTips) {
        this.$message.warn('Please complete the marked area(s) before publishing')
      }

      this.$logger.info('checkRequiredFields done!', this.formSteps)
    }
  }
}
