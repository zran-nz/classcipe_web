import { PdField, PlanField, TaskField } from '@/const/common'

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

export const PublishMixin = {
  data () {
    return {
      showStepMask: false,
      formSteps: [],
      requiredFields: [],
      emptyRequiredFields: [],
      autoCheckRequired: false
    }
  },
  computed: {
    contentId() {
      return this.taskId || this.unitPlanId || this.pdId || this.videoId
    }
  },
  created() {
    if (this.contentId) {
      console.log('start required check ' + this.contentId)
      const isCheck = window.sessionStorage.getItem('required-check-' + this.contentId)
      this.$logger.info('isCheck for ' + this.contentId, isCheck)
      if (isCheck) {
        this.autoCheckRequired = true
        this.$logger.info('start Check for ' + this.contentId, isCheck)
      } else {
        this.$logger.info('not Check for ' + this.contentId, isCheck)
      }
    } else {
      console.warn('contentId not set')
    }
  },
  methods: {

    tryAutoCheckRequiredField() {
      if (this.autoCheckRequired && this.canEdit) {
        this.checkRequiredFields(false)
      }
    },

    checkRequiredFields (showToast) {
      // 检查必填项是否为空,只检测null,undefined,空字符串,空数组,空对象

      this.emptyRequiredFields = []
      this.formSteps.forEach(step => {
        step.showRequiredTips = false
        step.showSatisfiedTips = false
      })

      // 给有未填写字段的step添加红色提示
      let showRequiredTips = false
      this.requiredFields.forEach(field => {
        if (field === TaskField.Slides || field === PdField.Slides || field === PdField.Slides) {
          if (!this.form.presentationId || !this.form.pageObjects?.length) {
            this.emptyRequiredFields.push(field)
            this.formSteps.forEach(step => {
              if (step.commonFields.indexOf(field) > -1) {
                step.showRequiredTips = true
                step.showSatisfiedTips = false
                showRequiredTips = true
              }
            })
          }
        } else if (field === TaskField.Link || field === PlanField.Link) {
          if (!this.associateUnitPlanIdList?.length && !this.associateTaskIdList?.length) {
            this.emptyRequiredFields.push(field)
            this.formSteps.forEach(step => {
              if (step.commonFields.indexOf(field) > -1) {
                step.showRequiredTips = true
                step.showSatisfiedTips = false
                showRequiredTips = true
              }
            })
          }
        } else if (field === 'learnOuts') {
          console.log('learnOuts test', this.form.learnOuts)
          if (!this.form.learnOuts?.length || !this.form.subjectList?.length || !this.form.yearList?.length || !this.form.curriculumId) {
            console.log('learnOuts is empty')
            this.emptyRequiredFields.push(field)
            this.formSteps.forEach(step => {
              if (step.commonFields.indexOf(field) > -1) {
                step.showRequiredTips = true
                step.showSatisfiedTips = false
                showRequiredTips = true
              }
            })
          }
        } else if (field === 'questions') {
          console.log('questions is ', this.form.questions)
          if (this.form.hasOwnProperty('questions')) {
            console.log('questions test ', this.form.questions)
            if (this.form.questions.length === 0) {
              console.log('questions is empty')
              this.emptyRequiredFields.push(field)
              this.formSteps.forEach(step => {
                if (step.commonFields.indexOf(field) > -1) {
                  step.showRequiredTips = true
                  step.showSatisfiedTips = false
                }
              })
            }
          }
        } else {
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
        }
      })

      // 剩余step全部为绿色完成提示
      this.formSteps.forEach(step => {
        if (!step.showRequiredTips) {
          step.showSatisfiedTips = true
        }
      })

      if (showRequiredTips) {
        showToast && this.$message.warn('Please complete the marked area(s) before publishing')
        this.form.canPublish = false
      } else {
        this.form.canPublish = true
      }
      this.$logger.info('canPublish', this.form.canPublish)

      this.$logger.info('checkRequiredFields done!', this.formSteps)

      this.$classcipe.unSetRequiredCheck(this.contentId)
    },
    calculateCanPublish() {
      this.$logger.info('calculateCanPublish', this.canEdit)
      if (!this.canEdit) return
      // 给有未填写字段的step添加红色提示
      let canPublish = true
      this.emptyRequiredFields = []
      this.formSteps.forEach(step => {
        step.showRequiredTips = false
        step.showSatisfiedTips = false
      })
      this.requiredFields.forEach(field => {
        if (field === TaskField.Slides || field === PdField.Slides) {
          if (!this.form.presentationId || !this.form.pageObjects?.length) {
            console.log('slide is empty', this.form)
            this.emptyRequiredFields.push(field)
            this.formSteps.forEach(step => {
              if (step.commonFields.indexOf(field) > -1) {
                step.showRequiredTips = true
                step.showSatisfiedTips = false
                canPublish = false
              }
            })
          }
        } else if (field === TaskField.Link || field === PlanField.Link) {
          if (!this.associateUnitPlanIdList?.length && !this.associateTaskIdList?.length) {
            this.$logger.info(`${field} is empty`, this.associateUnitPlanIdList, this.associateTaskIdList)
            this.emptyRequiredFields.push(field)
            this.formSteps.forEach(step => {
              if (step.commonFields.indexOf(field) > -1) {
                step.showRequiredTips = true
                step.showSatisfiedTips = false
                canPublish = false
              }
            })
          }
        } else if (field === 'learnOuts') {
          const [ task, status ] = JSON.parse(localStorage.getItem('OutlineStatus')) ?? []
          const isFinish = task === this.taskId && status
          console.log('learnOuts check:', field, this.taskId, isFinish)
          this.formSteps.forEach(step => {
            if (step.commonFields.indexOf(field) > -1) {
              step.showRequiredTips = !isFinish
              step.showSatisfiedTips = false
              canPublish = isFinish
            }
          })
        } else if (field === 'questions') {
          console.log('questions is ', this.form.questions)
          if (this.form.hasOwnProperty('questions')) {
            console.log('questions test ', this.form.questions)
            if (this.form.questions.length === 0) {
              console.log('questions is empty')
              this.emptyRequiredFields.push(field)
              this.formSteps.forEach(step => {
                if (step.commonFields.indexOf(field) > -1) {
                  step.showRequiredTips = true
                  step.showSatisfiedTips = false
                  canPublish = false
                }
              })
            }
          }
        } else {
          if (simpleIsEmpty(this.form[field])) {
            this.$logger.info(`${field} is empty`, this.form[field])
            this.emptyRequiredFields.push(field)
            this.formSteps.forEach(step => {
              if (step.commonFields.indexOf(field) > -1) {
                step.showRequiredTips = true
                step.showSatisfiedTips = false
                canPublish = false
              }
            })
          }
        }
      })

      this.form.canPublish = canPublish
    },

    showEditPriceDialog() {
      this.$logger.info('showEditPriceDialog', this.$refs.editPrice)
      this.$refs.editPrice.showEditPrice()
    },
    showPublishTips() {
      this.$message.success(this.$t('teacher.add-unit-plan.publish-success'))
    }
  }
}
