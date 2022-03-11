import { EvaluationQueryByIds, GetSessionEvaluationByClassId, SaveSessionEvaluation } from '@/api/evaluation'
import { GetAssociate } from '@/api/teacher'
import { typeMap } from '@/const/teacher'
import EvaluationTableMode from '@/components/Evaluation/EvaluationTableMode'

export const EvaluationMixin = {
  components: {
  },
  data () {
    return {
      typeMap: typeMap,
      evaluationId: null,
      taskEvaluationForms: [],
      evaluationForm: {
        classId: '',
        className: null,
        email: null,
        evaluationMode: EvaluationTableMode.TeacherEvaluate,
        forms: [],
        groups: [],
        id: null,
        name: null,
        studentEvaluateData: null,
        type: typeMap.classSessionEvaluation
      }
    }
  },
  created () {
  },
  computed: {
  },
  methods: {

    /**
     * 检查对应的sessionId是否有创建过评估表
     * @param {String} sessionId
     * @param {String} taskId
     * @param {Function} callback 初始化成功后的回调，可选
     */
    CheckAndCreateTaskSessionEvaluationData (sessionId, taskId, callback) {
      this.$logger.info(`CheckTaskSessionExistEvaluationData ${sessionId} sessionId` + sessionId)
      // 此处classId为sessionId
      GetSessionEvaluationByClassId({ classId: sessionId }).then(response => {
          this.$logger.info(`CheckTaskSessionExistEvaluationData ${sessionId} response`, response)
          const data = response.result

          // 如果没有评估数据，那么准备初始化评估数据表
          if (!data.evaluation) {
            this.$logger.info('CheckTaskSessionExistEvaluationData no evaluation data, start init ' + sessionId)
            this.initTaskSessionEvaluationData(sessionId, taskId, callback)
          } else {
            this.$logger.info('CheckTaskSessionExistEvaluationData has evaluation data, skip it ' + sessionId)
            if (callback) {
              this.$logger.info('skip and callback')
              callback()
            }
          }
        }).catch(error => {
          this.$logger.error('CheckTaskSessionExistEvaluationData error', error)
          this.$message.error('CheckTaskSessionExistEvaluationData error ' + error)
        })
    },

    /**
     * 初始化评估数据表
     * @param {String} sessionId
     * @param {String} taskId
     * @param {Function} callback 初始化成功后的回调，可选
     */
    initTaskSessionEvaluationData (sessionId, taskId, callback) {
      // 加载task关联的evaluation表单数据
      this.$logger.info('initTaskSessionEvaluationData ' + taskId)
      const associateEvaluationIdList = []
      GetAssociate({
        id: taskId,
        type: this.typeMap.task
      }).then(response => {
        this.$logger.info('GetAssociateEvaluationTable ', response)
        response.result.owner.forEach(item => {
          item.contents.forEach(content => {
            if (content.type === typeMap.evaluation) {
              associateEvaluationIdList.push(content.id)
            }
          })
        })

        response.result.others.forEach(item => {
          item.contents.forEach(content => {
            if (content.type === typeMap.evaluation) {
              associateEvaluationIdList.push(content.id)
            }
          })
        })
      }).finally(() => {
        this.$logger.info('associateEvaluationIdList ', associateEvaluationIdList)

        if (associateEvaluationIdList.length) {
          const forms = []
          EvaluationQueryByIds({ ids: associateEvaluationIdList }).then((response) => {
            this.$logger.info('associateEvaluationIdList EvaluationQueryByIds ', response)
            const existedFormIdList = []
            response.result.forEach(evaluationItem => {
              evaluationItem.forms.forEach(formItem => {
                if (existedFormIdList.indexOf(formItem.formId) === -1) {
                  existedFormIdList.push(formItem.formId)
                  forms.push({
                    title: formItem.title,
                    titleEditing: false,
                    comment: null,
                    formType: formItem.formType,
                    se: formItem.se,
                    pe: formItem.pe,
                    menuVisible: false,
                    mode: formItem.mode, // 0-editing 1-evaluating
                    id: null,
                    formId: formItem.formId,
                    initRawHeaders: JSON.parse(formItem.initRawHeaders),
                    initRawData: JSON.parse(formItem.initRawData)
                  })
                } else {
                  this.$logger.info('form existed ', formItem)
                }
              })
            })
          }).then(() => {
            this.taskEvaluationForms = forms
            this.$logger.info('taskEvaluationForms', this.taskEvaluationForms)
            this.saveInitSessionEvaluationData(sessionId, taskId, callback)
          })
        } else {
          this.$logger.warn('no associate evaluation data for task ' + taskId)
          if (callback) {
            this.$logger.info('no associate and callback')
            callback()
          }
        }
      })
    },

    /**
     * 保存初始化的评估数据
     * @param {String} sessionId
     * @param {String} taskId
     * @param {Function} callback 初始化成功后的回调，可选
     */
    saveInitSessionEvaluationData (sessionId, taskId, callback) {
      this.$logger.info('saveInitSessionEvaluationData ' + sessionId)

      const formData = JSON.parse(JSON.stringify(this.evaluationForm))
      const formDataList = JSON.parse(JSON.stringify(this.taskEvaluationForms))
      this.$logger.info('formDataList', formDataList, 'formData', formData)
      formData.classId = sessionId
      // 获取评估数据
      formDataList.forEach(formItem => {
        formItem.initRawHeaders = JSON.stringify(formItem.initRawHeaders)
        formItem.initRawData = JSON.stringify(formItem.initRawData)
      })
      formData.forms = formDataList
      formData.studentEvaluateData = '{}'

      if (this.evaluationId) {
        this.evaluationForm.id = this.evaluationId
        formData.id = this.evaluationId
      }
      SaveSessionEvaluation(formData).then((response) => {
        this.$logger.info('SaveSessionEvaluation response', response)
        if (response.result && response.result.id) {
          this.evaluationId = response.result.id
        }
        if (response.success) {
          this.taskEvaluationForms = []
          this.evaluationForm.forms = []
          if (callback) {
            this.$logger.info('saveInitSessionEvaluationData callback')
            callback()
          }
        } else {
          this.$message.error(response.message)
        }
      })
    }
  }
}
