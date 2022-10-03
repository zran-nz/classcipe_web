<template>
  <div>
    <div class="account-info-self" v-if="studentId">
      <div class="info-self-avatar">
        <img v-if="formModel.avatar" :src="formModel.avatar"/>
        <img v-else src="~@/assets/icons/library/default-avatar.png"/>
        <a-button type="primary" size="small" @click="$refs.avatarModal.edit(1)">Upload</a-button>
      </div>
      <div class="info-self-detail">
        <div class="self-detail-name">
          ID: {{ origin.workNo || studentId }}
        </div>
        <div class="self-detail-email">{{ formModel.inviteEmail }}</div>
      </div>
    </div>
    <a-form-model
      layout="horizontal"
      :model="formModel"
      v-bind="formItemLayout"
      :rules="validatorRules"
      @validate="doValidate"
      ref="form">
      <a-form-model-item v-if="studentId" label="Last Login" :wrapperCol="{ span: 18 }">
        <a-row :gutter=0>
          <a-col :span="16">
            <label for="" v-if="origin.lastLogin">{{ origin.lastLogin | dayjs }}</label>
            <label for="" v-else>-</label>
          </a-col>
          <a-col :span="2" style="text-align: center;">
          </a-col>
          <a-col :span="6" style="text-align: center;" v-if="!origin.inviteEmail && !origin.parentEmailStatus">
            <a-button type="black" :loading="confirmLoading" @click="handleReset">Reset Password</a-button>
          </a-col>
        </a-row>
      </a-form-model-item>
      <a-form-model-item class="mb0" label="Name" :required="true">
        <a-row :gutter=16>
          <a-col :span="12">
            <a-form-model-item prop="firstName" :hasFeedback="true">
              <a-input v-model="formModel.firstName" @change="doValidParentEmail" placeholder="First name" />
            </a-form-model-item >
          </a-col>
          <a-col :span="12">
            <a-form-model-item prop="lastName" :hasFeedback="true">
              <a-input v-model="formModel.lastName" @change="doValidParentEmail" placeholder="Last name" />
            </a-form-model-item >
          </a-col>
        </a-row>
      </a-form-model-item>
      <!-- prop="inviteEmail" :hasFeedback="true"> -->
      <a-form-model-item class="mb0" label="Email" prop="inviteEmail" :required="false" :wrapperCol="{ span: 18 }">
        <a-row :gutter=0>
          <a-col :span="16">
            <a-form-model-item>
              <a-input v-model="formModel.inviteEmail" placeholder="Email" :disabled="studentId && !!formModel.inviteEmail && origin.status === 1" />
            </a-form-model-item>
          </a-col>
          <a-col :span="2" style="text-align: center;" v-if="!!formModel.inviteEmail && origin.status === 1">
            <a-tooltip title="Student Active">
              <a-icon style="color:#007990" type="check" />
            </a-tooltip>
          </a-col>
          <a-col :span="6" style="text-align: center;" v-if="!!formModel.inviteEmail && origin.status === 0">
            <a-tooltip title="Student InActive">
              <a-icon style="color: #8D9496" type="check" />
            </a-tooltip>
          </a-col>
        </a-row>
      </a-form-model-item>
      <a-form-model-item label="DOB">
        <a-date-picker v-model="formModel.birthDay" :disabled-date="disabledDate"/>
      </a-form-model-item>
      <a-form-model-item class="mb0" label="Class" :required="true">
        <a-row :gutter=16>
          <a-col :span="18">
            <a-form-model-item class="select" prop="classes">
              <template v-if="!classUnModify">
                <a-select
                  showSearch
                  optionFilterProp="children"
                  :getPopupContainer="trigger => trigger.parentElement"
                  v-model='formModel.classes'
                  option-label-prop="label"
                  placeholder='Please select class'>
                  <a-select-option :label="className" v-for='(className, id) in classNameList' :key='id'>
                    {{ className }}
                  </a-select-option >
                </a-select>
              </template>
              <a-space v-else>
                <a-space class="flex-wrap" v-if="classArrDetail.length > 0">
                  <template v-for="(cls) in classArrDetail">
                    <a-tag :key="cls.id" :color="cls.classType === 0 ? '#2db7f5' : '#f50'">
                      {{ cls.classType === 1 ? formatViewName(cls.subject) + '-' + cls.name : cls.name }}
                    </a-tag>
                  </template>
                </a-space>
                <label for="" v-else> - </label>
              </a-space>
            </a-form-model-item>
          </a-col>
          <a-col :span="6" v-if="showClassLink">
            <a-button type="link" @click="handelGoClass">Class Manage</a-button>
          </a-col>
        </a-row>
      </a-form-model-item>
      <div class="sub-title">
        <label for="">Parent guardian</label>
      </div>
      <a-form-model-item class="mb0" label="Name">
        <a-row :gutter=16>
          <a-col :span="12">
            <a-form-model-item prop="parentFirstName">
              <a-input v-model="formModel.parentFirstName" placeholder="First name" />
            </a-form-model-item >
          </a-col>
          <a-col :span="12">
            <a-form-model-item prop="parentLastName">
              <a-input v-model="formModel.parentLastName" placeholder="Last name" />
            </a-form-model-item >
          </a-col>
        </a-row>
      </a-form-model-item>
      <a-form-model-item label="Email" class="mb0" :required="true" :wrapperCol="{ span: 18 }">
        <a-row :gutter=0>
          <a-col :span="16">
            <a-form-model-item prop="parentEmail" :hasFeedback="true">
              <a-input v-model="formModel.parentEmail" placeholder="Email" />
            </a-form-model-item>
          </a-col>
          <a-col :span="2" style="text-align: center;" v-if="origin.parentEmailStatus === 1">
            <a-icon style="color: #007990" type="check" />
          </a-col>
          <a-col :span="6" style="text-align: center;" v-if="origin.parentEmailStatus === 0">
            <a-button type="black" :loading="loading" @click="resendParent">Resend</a-button>
          </a-col>
        </a-row>
      </a-form-model-item>
      <a-form-model-item label="Phone">
        <a-input v-model="formModel.parentPhone" placeholder="Phone" />
      </a-form-model-item>
      <a-form-model-item :wrapperCol="{offset: 6}" v-if="!studentId">
        <a-button :disabled="hasErrors" :loading="loading" @click="(e) => handleSave()" type="primary">{{ studentId ? 'Update': 'Create' }}</a-button>
      </a-form-model-item>
    </a-form-model>

    <a-modal
      v-model='passwordVis'
      destroyOnClose
      title='Reset Password'
      width='600px'
      :footer="null"
    >
      <!-- <reset-password :saveFn="doReset" @close="handleClose" :needOld="false"/> -->
      <a-space style="justify-content: center;width: 100%;">
        <label for="" style="font-size: 20px;color: #15c39a;font-weight: bold;">{{ randomPass }}</label>
        <a-icon type='copy' style="cursor:pointer;" @click="onCopy"></a-icon>
      </a-space>
    </a-modal>
    <avatar-modal ref="avatarModal" @ok="setAvatar"/>
  </div>
</template>

<script>
import { listClass } from '@/api/v2/schoolClass'
import { addStudents, resetUserPassword, sendParentEmail, getStudentInfo, updateStudent, checkEmailStudent, checkEmailParent } from '@/api/v2/schoolUser'
import { getSubjectBySchoolId } from '@/api/academicSettingSubject'
import { getCurriculumBySchoolId } from '@/api/academicSettingCurriculum'

import ResetPassword from '../persona/ResetPassword'
import AvatarModal from '@/views/account/settings/AvatarModal'

import { SubmitBeforeMixin } from '@/mixins/SubmitBeforeMixin'
import { AutoSaveLocalMixin } from '@/mixins/AutoSaveLocalMixin'

import moment from 'moment'
import { isEmail, randomString } from '@/utils/util'
const { sortBy } = require('lodash-es')
export default {
  name: 'SchoolStudentAdd',
  components: {
    ResetPassword,
    AvatarModal
  },
  mixins: [
    SubmitBeforeMixin,
    AutoSaveLocalMixin
  ],
  props: {
    school: {
      type: Object,
      default: () => {}
    },
    id: {
      type: String,
      default: null
    },
    showClassLink: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    school: {
      handler(val) {
        console.log(val)
        this.currentSchool = { ...val }
        this.initData()
      },
      deep: true,
      immediate: true
    },
    id: {
      handler(val) {
        this.studentId = val
        this.initForm()
      },
      immediate: true
    }
  },
  data() {
    return {
      currentSchool: this.school,
      studentId: this.id,
      classList: [],
      classNameList: {},
      formModel: {
        firstName: '',
        lastName: '',
        birthDay: '',
        classes: '',
        classArr: [],
        subjectCls: [],
        inviteEmail: '',
        parentEmail: '',
        parentEmailStatus: 0,
        parentFirstName: '',
        parentLastName: '',
        parentPhone: '',
        avatar: '',
        schoolId: this.school?.id || ''
      },
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 12 }
      },
      loading: false,
      passwordVis: false,
      origin: {},
      confirmLoading: false,
      cacheKey: 'SUBMIT_VALIDATE_SCHOOL_STUDENT_',
      autoSaveLocalKey: 'FORM_SCHOOL_STUDENT_',
      needAutoSave: !this.id,
      needAutoSaveRemote: this.id,
      randomPass: '',
      classUnModify: false,
      subjectOptions: [],
      curriculumOptions: [],
      gradeOptions: []
    }
  },
  computed: {
    validatorRules: function () {
      return {
        firstName: [{ required: true, message: 'Please Input First Name!' }],
        lastName: [{ required: true, message: 'Please Input Last Name!' }],
        inviteEmail: [
          // { required: true, message: 'Please Input Email!', trigger: 'change' },
          // { type: 'email', message: 'Please Input Valid Email!', trigger: 'blur' },
          { validator: this.validateRemoteEmail, trigger: 'blur' }
        ],
        // parentFirstName: [{ required: true, message: 'Please Input First Name!' }],
        // parentLastName: [{ required: true, message: 'Please Input Last Name!' }],
        parentEmail: [
          { required: true, message: 'Please Input Email!', trigger: 'change' },
          { type: 'email', message: 'Please Input Valid Email!', trigger: 'blur' }
          // { validator: this.validateRemoteParentEmail, trigger: 'blur' }
        ],
        classes: [{ required: true, message: 'Please Select a class!', trigger: 'change' }]
        // parentPhone: [
        //   { required: true, message: 'Please Input Phone!' }
        // ]
      }
    },
    filterClassList() {
      // return this.classList.filter(cc => !this.formModel.classArr.includes(cc.id))
      if (this.gradeOptions && this.gradeOptions.length > 0) {
        let cls = []
        this.gradeOptions.forEach(grade => {
          const currentCls = this.classList.filter(cls => cls.gradeId === grade.gradeId)
          cls = cls.concat(currentCls.map(cls => ({
            ...cls,
            curriculumName: grade.curriculumName
          })))
        })
        return cls
      }
      return []
    },
    classArrDetail() {
      const clses = this.classList.filter(cc => this.formModel.classArr.includes(cc.id))
      return sortBy(clses, 'classType')
    }
  },
  methods: {
    async initData() {
      Promise.all([
        listClass({
          schoolId: this.currentSchool.id,
          pageNo: 1,
          pageSize: 10000
        }),
        getSubjectBySchoolId({
          schoolId: this.currentSchool.id
        }),
        getCurriculumBySchoolId({
          schoolId: this.currentSchool.id
        })
      ]).then(([clsRes, subjectRes, gradeRes]) => {
        if (clsRes.code === 0) {
          this.classNameList = {}
          this.classList = clsRes.result.records
          clsRes.result.records.map(v => {
            const arr = [v.name]
            // if (v.gradeName) arr.unshift(v.gradeName)
            this.classNameList[v.id] = arr.join(' - ')
          })
          this.$forceUpdate()
          if (this.formModel.classes) {
            if (!this.classNameList[this.formModel.classes]) {
              this.formModel.classes = ''
              this.formModel.classArr = []
            }
          }
          this.classUnModify = false
          const query = this.$route.query
          if (query.classId && this.classNameList[query.classId]) {
            if (!this.studentId) {
              this.formModel.classArr = [query.classId]
              this.formModel.classes = query.classId
            }
            this.classUnModify = true
            this.$emit('getCls', true)
          }
        }
        if (subjectRes.success) {
          let subjects = []
          subjectRes.result.forEach(item => {
            if (item.subjectList && item.subjectList.length > 0) {
              subjects = subjects.concat(item.subjectList)
            }
          })
          const options = []
          subjects.forEach(item => {
            options.push({
              subjectId: item.subjectId,
              subjectName: item.subjectName
            })
            options.push({
              subjectId: item.parentSubjectId,
              subjectName: item.parentSubjectName
            })
          })
          this.subjectOptions = options
        }
        if (gradeRes.success && gradeRes.result) {
          let grades = []
          this.curriculumOptions = gradeRes.result
          gradeRes.result.forEach(item => {
            grades = grades.concat((item.gradeSettingInfo || []).map(grade => ({
              ...grade,
              curriculumId: item.curriculumId,
              curriculumName: item.curriculumName
            })))
          })
          this.gradeOptions = grades
        }
      })
    },
    // modal模式传值
    initForm(defaultForm) {
      if (this.id) {
        this.loading = true
        getStudentInfo({
          schoolId: this.currentSchool.id,
          userId: this.id
        }).then(res => {
          if (res.code === 0) {
            this.origin = { ...res.result }
            this.formModel.id = res.result.id
            this.formModel.firstName = res.result.firstname
            this.formModel.lastName = res.result.lastname
            this.formModel.birthDay = res.result.birthday
            this.formModel.avatar = res.result.avatar
            this.formModel.inviteEmail = res.result.inviteEmail
            this.formModel.parentEmail = res.result.parentEmail
            this.formModel.parentEmailStatus = res.result.parentEmailStatus || 0
            this.formModel.parentFirstName = res.result.parentFirstName
            this.formModel.parentLastName = res.result.parentLastName
            this.formModel.avatar = res.result.avatar
            this.formModel.parentPhone = res.result.parentPhone
            if (res.result.classes) {
              const gradeCls = res.result.classes.filter(item => item.classType === 0)
              const subjectCls = res.result.classes.filter(item => item.classType === 1)
              this.formModel.classArr = gradeCls.map(item => item.id)
              this.formModel.classes = this.formModel.classArr.join(',')
              this.formModel.subjectCls = subjectCls.map(item => item.id)
            }
          }
        }).finally(() => {
          this.loading = false
        })
      } else {
        const fromCache = this.getAutoLocalData()
        this.formModel = {
          ...this.formModel,
          ...fromCache,
          ...defaultForm
        }
        if (this.formModel.classes) {
          this.formModel.classArr = this.formModel.classes.split(',')
        }
      }
      this.$nextTick(() => {
        this.initValidate(!!this.id)
      })
    },
    doValidate(key, value) {
      console.log(key, value)
      this.fillValidate(key, value)
    },
    setAvatar (url) {
      this.formModel.avatar = url
    },
    disabledDate(current) {
      return current && current > moment()
    },
    resendParent() {
      if (this.formModel.parentEmail && isEmail(this.formModel.parentEmail)) {
        this.loading = true
        sendParentEmail({
          parentEmail: this.formModel.parentEmail,
          schoolId: this.currentSchool.id,
          userId: this.studentId
        }).then(res => {
          if (res.code === 0) {
            this.$message.success('Send successfully')
          }
        }).finally(() => {
          this.loading = false
        })
      } else {
        this.$message.error('Please input valid email')
      }
    },
    validateRemoteEmail(rule, value, callback) {
      if (!value) {
        return callback()
      } else {
        // 调用封装了的异步效验方法，
        if (this.studentId && value === this.origin.inviteEmail) {
          return callback()
        }
        checkEmailStudent({
          emails: value,
          schoolId: this.currentSchool.id
        }).then(response => {
          if (response.code === 0 && response.result && response.result[0].exists) {
            callback(new Error('already exists at this school'))
          } else {
            callback()
          }
        }).catch(res => {
          callback(new Error(res.message))
        })
      }
    },
    validateRemoteParentEmail(rule, value, callback) {
      if (!value) {
        return callback()
      } else {
        if (!this.formModel.firstName || !this.formModel.lastName) {
          callback()
        }
        if (this.studentId && value === this.origin.parentEmail) {
          return callback()
        }
        // 调用封装了的异步效验方法，
        checkEmailParent({
          'parentEmailInfos[0].firstName': this.formModel.firstName,
          'parentEmailInfos[0].lastName': this.formModel.lastName,
          'parentEmailInfos[0].parentEmail': value,
          userId: this.id,
          schoolId: this.currentSchool.id
        }).then(response => {
          if (response.code === 0 && response.result && response.result[0].exists) {
            callback(new Error('This student already exists'))
          } else {
            callback()
          }
        }).catch(res => {
          callback(new Error(res.message))
        })
      }
    },
    doValidParentEmail() {
      if (this.formModel.firstName && this.formModel.lastName && this.formModel.parentEmail) {
        this.$refs.form.validateField('parentEmail')
      }
    },
    handelGoClass() {
      this.$router.push('/manage/class')
    },
    doReset(params) {
      return resetUserPassword({
        ...params,
        schoolId: this.currentSchool.id,
        userId: this.studentId
      })
    },
    handleClose() {
      this.passwordVis = false
    },
    handleReset() {
      this.randomPass = randomString(6)
      resetUserPassword({
        newPassword: this.randomPass,
        schoolId: this.currentSchool.id,
        userId: this.studentId
      }).then(res => {
        if (res.code === 0) {
          this.passwordVis = true
        }
      })
      // this.$confirm({
      //   title: `Confirm Reset Password`,
      //   content: `Do you want to reset password?`,
      //   centered: true,
      //   onOk: () => {
      //     this.confirmLoading = true
      //     resetPassword({
      //       userIds: [this.studentId] // reset
      //     }).then(res => {
      //       if (res.code === 0) {
      //         this.$message.success('Opt Successfully')
      //       }
      //     }).finally(() => {
      //       this.confirmLoading = false
      //     })
      //   }
      // })
    },
    handleSave(cb) {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = { ...this.formModel }
          this.validateRemoteParentEmail(null, params.parentEmail, (err) => {
            if (err && err.message) {
              this.$message.error(err.message)
            } else {
              params.schoolId = this.currentSchool.id
              // 变成单选
              // params.classes = params.classArr.join(',')
              if (params.birthDay) {
                params.birthday = params.birthDay = moment.utc(params.birthDay).format('YYYY-MM-DD HH:mm:ss')
              }
              params.classes = params.classes.split(',').concat(params.subjectCls).filter(item => !!item).join(',')
              let promise = null
              if (this.id) {
                promise = updateStudent
              } else {
                promise = addStudents
              }
              this.loading = true
              promise(params).then(res => {
                if (res.code === 0) {
                  this.$message.success('Save successfully')
                  this.clearLocalData()
                  this.origin = { ...params, id: this.id }
                  if (cb) {
                    cb()
                  } else {
                    this.$emit('save', res.result)
                  }
                }
              }).finally(() => {
                this.loading = false
              })
            }
          })
        } else {
          console.log(valid)
        }
      })
    },
    onCopy() {
      this.$copyText(this.randomPass).then(message => {
        this.$message.success('Copy success!')
      }).catch(err => {
        console.log('copy.err', err)
        this.$message.error('Copy Failed')
      })
    },
    formatName(key, arr) {
      const find = arr.find(item => item.id === key)
      return find ? find.name : ''
    },
    closeCls(id) {
      this.formModel.classArr = this.formModel.classArr.filter(clsId => clsId !== id)
    },
    showSelect(e) {
      this.$refs.tagRender.previousElementSibling.click()
    },
    formatViewName(id) {
      const findSubject = this.subjectOptions.find(subject => subject.subjectId === id)
      if (findSubject) return findSubject.subjectName
      // const findGrade = this.gradeOptions.find(grade => grade.gradeId === id)
      // if (findGrade) return findGrade.gradeName
      return 'Untitle'
    }
  }
}
</script>

<style scoped lang="less">
.mb0 {
  margin-bottom: 0;
}
.sub-title {
  margin: 20px 0;
  font-weight: bold;
  font-size: 14px;
  color: #333;
  margin-left: calc(25% - 120px);
}

.account-info-self {
  display: flex;
  align-items: center;
  width: 100%;
  margin-left: calc(25% - 76px);
  margin-bottom: 20px;
  .info-self-avatar {
    width: 66px;
    border-radius: 100%;
    display: flex;
    flex-direction: column;
    margin-right: 30px;
    img {
      width: 66px;
      height: 66px;
      border-radius: 100%;
      object-fit: contain;
      margin-bottom: 10px;
    }
  }
  .info-self-detail {
    display: flex;
    flex-direction: column;
    flex: 1;
    .self-detail-name {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      label {
        font-size: 22px;
        font-family: Arial;
        font-weight: bold;
        color: #14192B;
      }
      i {
        font-size: 18px /* 14/100 */;
        cursor: pointer;
        margin-left: 10px;
      }
    }
    .self-detail-email {
      font-size: 20px;
      font-family: Arial;
      font-weight: 400;
      color: #565656;
      margin-bottom: 10px;
    }
  }
}
.self-select {
  /deep/ .ant-select {
    // visibility: hidden;
    opacity: 0;
    height: 30px;
  }
}
.tag-render {
  line-height: 30px;
  min-height: 30px;
  border: 1px solid #dfdfdf;
  width: 100%;
  background: #fff;
  padding: 0 5px;
  cursor: pointer;
  margin-top: -30px;
  left: 0;
  flex-wrap: wrap;
  &.disabled {
    background: transparent;
  }
}
.flex-wrap {
  flex-wrap: wrap;
  display: flex;
  & > span {
    margin-top: 2px;
    margin-bottom: 2px;
  }
}
</style>
