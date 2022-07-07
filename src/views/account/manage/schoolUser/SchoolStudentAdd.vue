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
          ID: {{ studentId }}
        </div>
        <div class="self-detail-email">{{ formModel.inviteEmail }}</div>
      </div>
    </div>
    <a-form-model
      layout="horizontal"
      :model="formModel"
      v-bind="formItemLayout"
      :rules="validatorRules"
      ref="form">
      <a-form-model-item v-if="studentId" label="Last Login" :wrapperCol="{ span: 18 }">
        <a-row :gutter=0>
          <a-col :span="16">
            {{ this.formModel.lastLogin ? (this.formModel.lastLogin | dayjs) : ' - ' }}
          </a-col>
          <a-col :span="2" style="text-align: center;">
          </a-col>
          <a-col :span="6" style="text-align: center;" v-if="studentId && formModel.inviteEmail">
            <a-button type="black" :loading="confirmLoading" @click="handleReset">Reset Password</a-button>
          </a-col>
        </a-row>
      </a-form-model-item>
      <a-form-model-item class="mb0" label="Name" :required="true">
        <a-row :gutter=16>
          <a-col :span="12">
            <a-form-model-item prop="firstName">
              <a-input v-model="formModel.firstName" @change="doValidParentEmail" placeholder="First name" />
            </a-form-model-item >
          </a-col>
          <a-col :span="12">
            <a-form-model-item prop="lastName">
              <a-input v-model="formModel.lastName" @change="doValidParentEmail" placeholder="Last name" />
            </a-form-model-item >
          </a-col>
        </a-row>
      </a-form-model-item>
      <a-form-model-item label="Email" prop="inviteEmail">
        <a-input v-model="formModel.inviteEmail" placeholder="Email" :disabled="teacherId && !!formModel.inviteEmail" />
      </a-form-model-item>
      <a-form-model-item label="Birth">
        <a-date-picker v-model="formModel.birthDay" />
      </a-form-model-item>
      <a-form-model-item class="mb0" label="Class" :required="true">
        <a-row :gutter=16>
          <a-col :span="18">
            <a-form-model-item prop="classes">
              <!-- <a-select
                mode="multiple"
                optionFilterProp="children"
                :getPopupContainer="trigger => trigger.parentElement"
                v-model='formModel.classArr'
                placeholder='Please select class'>
                <a-select-option v-for='item in classList' :key='item.id'>
                  {{ item.name }}
                </a-select-option >
              </a-select> -->
              <a-select
                optionFilterProp="children"
                :getPopupContainer="trigger => trigger.parentElement"
                v-model='formModel.classes'
                placeholder='Please select class'>
                <a-select-option v-for='item in classList' :key='item.id'>
                  {{ item.name }}
                </a-select-option >
              </a-select>
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
      <a-form-model-item class="mb0" label="Name" :required="true">
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
            <a-form-model-item prop="parentEmail">
              <a-input v-model="formModel.parentEmail" placeholder="Email" />
            </a-form-model-item>
          </a-col>
          <!-- <a-col :span="2" style="text-align: center;">
            <a-icon style="color: #007990" type="check" />
          </a-col>
          <a-col :span="6" style="text-align: center;">
            <a-button type="black">Resend</a-button>
          </a-col> -->
        </a-row>
      </a-form-model-item>
      <a-form-model-item label="Phone" prop="parentPhone">
        <a-input v-model="formModel.parentPhone" placeholder="Phone" />
      </a-form-model-item>
      <a-form-model-item :wrapperCol="{offset: 6}">
        <a-button :loading="loading" @click="handleSave" type="primary">{{ studentId ? 'Update': 'Create' }}</a-button>
      </a-form-model-item>
    </a-form-model>

    <a-modal
      v-model='passwordVis'
      destroyOnClose
      title='Reset Password'
      width='600px'
      :footer="null"
    >
      <reset-password :needOld="false"/>
    </a-modal>
    <avatar-modal ref="avatarModal" @ok="setAvatar"/>
  </div>
</template>

<script>
import { listClass } from '@/api/v2/schoolClass'
import { addStudents, resetPassword, getStudentInfo, updateStudent, checkEmailStudent, checkEmailParent } from '@/api/v2/schoolUser'

import ResetPassword from '../persona/ResetPassword'
import AvatarModal from '@/views/account/settings/AvatarModal'

import moment from 'moment'
export default {
  name: 'SchoolStudentAdd',
  components: {
    ResetPassword,
    AvatarModal
  },
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
      default: true
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
      formModel: {
        firstName: '',
        lastName: '',
        birthDay: '',
        classes: '',
        classArr: [],
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
      confirmLoading: false
    }
  },
  computed: {
    validatorRules: function () {
      return {
        firstName: [{ required: true, message: 'Please Input First Name!' }],
        lastName: [{ required: true, message: 'Please Input Last Name!' }],
        inviteEmail: [
          { required: true, message: 'Please Input Email!', trigger: 'change' },
          { type: 'email', message: 'Please Input Valid Email!', trigger: 'blur' },
          { validator: this.validateRemoteEmail, trigger: 'blur' }
        ],
        parentFirstName: [{ required: true, message: 'Please Input First Name!' }],
        parentLastName: [{ required: true, message: 'Please Input Last Name!' }],
        parentEmail: [
          { required: true, message: 'Please Input Email!', trigger: 'change' },
          { type: 'email', message: 'Please Input Valid Email!', trigger: 'blur' },
          { validator: this.validateRemoteParentEmail, trigger: 'blur' }
        ],
        classArr: [{ required: true, message: 'Please Select a class!', trigger: 'change' }],
        parentPhone: [
          { required: true, message: 'Please Input Phone!' }
          // { pattern: /^1[3|4|5|7|8|9][0-9]\d{8}$/, message: 'Please Input Valid Phone!' }
        ]
      }
    }
  },
  methods: {
    initData() {
       Promise.all([
          listClass({
            schoolId: this.currentSchool.id,
            queryType: 0,
            pageNo: 1,
            pageSize: 10000
          })
        ]).then(([clsRes]) => {
          if (clsRes.code === 0) {
            this.classList = clsRes.result.records
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
              this.formModel.classArr = res.result.classes.map(item => item.id)
              this.formModel.classes = this.formModel.classArr.join(',')
            }
          }
        }).finally(() => {
          this.loading = false
        })
      } else {
        this.formModel = {
          ...this.formModel,
          ...defaultForm
        }
        if (this.formModel.classes) {
          this.formModel.classArr = this.formModel.classes.split(',')
        }
      }
    },
    setAvatar (url) {
      this.formModel.avatar = url
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
            callback(new Error('Student already exists'))
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
          schoolId: this.currentSchool.id
        }).then(response => {
          if (response.code === 0 && response.result && response.result[0].exists) {
            callback(new Error('Email already exists'))
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
    handleReset() {
      // this.passwordVis = true
      this.$confirm({
        title: `Confirm Reset Password`,
        content: `Do you want to reset password?`,
        centered: true,
        onOk: () => {
          this.confirmLoading = true
          resetPassword({
            userIds: [this.studentId] // reset
          }).then(res => {
            if (res.code === 0) {
              this.$message.success('Opt Successfully')
            }
          }).finally(() => {
            this.confirmLoading = false
          })
        }
      })
    },
    handleSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = { ...this.formModel }
          params.schoolId = this.currentSchool.id
          // 变成单选
          // params.classes = params.classArr.join(',')
          if (params.birthDay) {
            params.birthday = params.birthDay = moment.utc(params.birthDay).format('YYYY-MM-DD HH:mm:ss')
          }
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
              this.$emit('save', res.result)
            }
          }).finally(() => {
            this.loading = false
          })
        } else {
          console.log(valid)
        }
      })
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

</style>
