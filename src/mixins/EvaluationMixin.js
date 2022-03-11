import { EvaluationQueryByIds, GetSessionEvaluationByClassId, SaveSessionEvaluation } from '@/api/evaluation'
import { GetAssociate } from '@/api/teacher'
import { typeMap } from '@/const/teacher'
import EvaluationTableMode from '@/components/Evaluation/EvaluationTableMode'
import { SchoolClassListClassAttendance } from '@/api/schoolClass'
import { EvaluationEventBus } from '@/components/Evaluation/EvaluationEventBus'
import {
  EVALUATION_SET_CHANGE,
  EVALUATION_ATTENDANCE_CHANGE,
  EVALUATION_TEACHER_SUBMMIT,
  EVALUATION_STUDENT_SUBMMIT,
  EVALUATION_PEER_SUBMMIT
} from '@/websocket/cmd'
import TeacherEvaluationStatus from '@/components/Evaluation/TeacherEvaluationStatus'

export const EvaluationMixin = {
  components: {
  },
  data () {
    return {
      typeMap: typeMap,
      evaluationId: null,
      taskEvaluationForms: [],
      forms: [], // 评估表格数据
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
      },

      // 出勤学生数据
      attendanceEmailList: [],
      attendanceList: [],
      initCompleted: false,
      showWaitingMask: false,

      // 评估数据对象
      studentEvaluateData: {} // 所有学生的评价数据对象，通过vue.$set设置属性，方便遍历对应的学生及表单数据
    }
  },
  created () {
    if (this.mode === EvaluationTableMode.TeacherEvaluate) {
      EvaluationEventBus.$on(EVALUATION_ATTENDANCE_CHANGE, this.handleEvaluationAttendance)
      EvaluationEventBus.$on(EVALUATION_STUDENT_SUBMMIT, this.handleEvaluationStudentSubmit)
      EvaluationEventBus.$on(EVALUATION_PEER_SUBMMIT, this.handleEvaluationPeerSubmit)
    } else if (this.mode === EvaluationTableMode.PeerEvaluate) {
      EvaluationEventBus.$on(EVALUATION_ATTENDANCE_CHANGE, this.handleEvaluationAttendance)
      EvaluationEventBus.$on(EVALUATION_TEACHER_SUBMMIT, this.handleEvaluationTeacherSubmit)
      EvaluationEventBus.$on(EVALUATION_STUDENT_SUBMMIT, this.handleEvaluationStudentSubmit)
      EvaluationEventBus.$on(EVALUATION_PEER_SUBMMIT, this.handleEvaluationPeerSubmit)
      EvaluationEventBus.$on(EVALUATION_SET_CHANGE, this.handleEvaluationSetChange)
    } else if (this.mode === EvaluationTableMode.StudentEvaluate) {
      EvaluationEventBus.$on(EVALUATION_ATTENDANCE_CHANGE, this.handleEvaluationAttendance)
      EvaluationEventBus.$on(EVALUATION_TEACHER_SUBMMIT, this.handleEvaluationTeacherSubmit)
      EvaluationEventBus.$on(EVALUATION_STUDENT_SUBMMIT, this.handleEvaluationStudentSubmit)
      EvaluationEventBus.$on(EVALUATION_PEER_SUBMMIT, this.handleEvaluationPeerSubmit)
      EvaluationEventBus.$on(EVALUATION_SET_CHANGE, this.handleEvaluationSetChange)
    }
  },
  destroyed() {
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
    },

    handleEvaluationAttendance(data) {
      this.$logger.info('handleEvaluationAttendance', data)
      SchoolClassListClassAttendance({
        classId: this.classId,
        sessonId: this.sessionId
      }).then(response => {
        this.$logger.info('refreshAttendance response', response)

        const attendanceList = []
        const attendanceEmailList = []
        if (response.success) {
          if (response.result.length > 0) {
            const attendanceEmailSet = new Set()
            const newStudentList = []
            const oldUserEmailList = this.studentEvaluateData ? Object.keys(this.studentEvaluateData) : []

            response.result.forEach(item => {
              if (!attendanceEmailSet.has(item.email)) {
                attendanceList.push(item)
                attendanceEmailList.push(item.email)
                attendanceEmailSet.add(item.email)
                if (oldUserEmailList.indexOf(item.email) !== -1) {
                  newStudentList.push(item)
                }
              }
            })
            this.attendanceList = attendanceList
            this.attendanceEmailList = attendanceEmailList
            this.$logger.info('attendanceList', this.attendanceList)
            this.$logger.info('newStudentList', newStudentList)

            if (newStudentList.length) {
              newStudentList.forEach(studentItem => {
                const studentEvaluateDataItem = {}

                this.forms.forEach(formItem => {
                  studentEvaluateDataItem[formItem.formId] = {
                    comment: null
                  }
                  formItem.initRawData.forEach(rowItem => {
                    studentEvaluateDataItem[formItem.formId][rowItem.rowId] = {
                      teacherEvaluation: null, // 老师评价
                      teacherName: null, // 老师评价
                      teacherEmail: null, // 老师评价

                      peerEvaluation: null, // 他人评价
                      peerName: null, // 他人评价
                      peerEmail: null, // 他人评价

                      studentEvaluation: null, // 学生自评
                      studentName: null, // 学生自评
                      studentEmail: null, // 学生自评

                      data: null, // subLevel数据

                      evidenceIdList: [], // ppt证据pageId列表
                      evidenceIdStudentList: [] // ppt证据pageId列表-学生选择
                    }
                  })
                })

                this.$set(this.studentEvaluateData, studentItem.email, studentEvaluateDataItem)
                this.$logger.info('add student ' + studentItem.email, this.studentEvaluateData)
              })
            }
          }
        } else {
          this.$message.error(response.message)
        }
      }).catch(error => {
        this.$logger.error('refreshAttendance', error)
        this.$message.error('refreshAttendance ' + error)
      })
    },

    handleEvaluationTeacherSubmit(data) {
      this.$logger.info('handleEvaluationTeacherSubmit', data)
    },
    handleEvaluationStudentSubmit(data) {
      this.$logger.info('handleEvaluationStudentSubmit', data)
    },
    handleEvaluationPeerSubmit(data) {
      this.$logger.info('handleEvaluationPeerSubmit', data)
    },
    handleEvaluationSetChange(data) {
      this.$logger.info('handleEvaluationSetChange', data)
      const evaluationSet = data.content
      if (evaluationSet && evaluationSet.sessionId === this.classId) {
        const oldMode = this.showWaitingMask
        this.showWaitingMask = evaluationSet.mode === TeacherEvaluationStatus.Editing
        if (oldMode && !this.showWaitingMask) {
          this.initCompleted = false
          window.location.reload()
        }
      }
    }
  }
}
