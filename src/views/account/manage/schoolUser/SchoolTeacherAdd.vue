<template>
  <div>
    <div class="account-info-self" v-if="teacherId">
      <div class="info-self-avatar">
        <img v-if="formModel.avatar" :src="formModel.avatar"/>
        <img v-else src="~@/assets/icons/library/default-avatar.png"/>
        <a-button type="primary" size="small" @click="$refs.avatarModal.edit(1)">Upload</a-button>
      </div>
      <!-- <div class="info-self-detail">
        <div class="self-detail-name">
          {{ formModel.inviteEmail }}
        </div>
        <div class="self-detail-email">{{ formModel.inviteEmail }}</div>
      </div> -->
    </div>

    <a-form-model
      layout="horizontal"
      :model="formModel"
      v-bind="formItemLayout"
      :rules="validatorRules"
      @validate="doValidate"
      ref="form">
      <a-form-model-item v-if="teacherId && userMode === USER_MODE.SCHOOL" label="Last Login" :wrapperCol="{ span: 18 }">
        <a-row :gutter=0>
          <a-col :span="16">
            <label for="" v-if="origin.lastLogin">{{ origin.lastLogin | dayjs }}</label>
            <label for="" v-else>-</label>
          </a-col>
          <a-col :span="2" style="text-align: center;">
          </a-col>
          <a-col :span="6" style="text-align: center;" v-if="teacherId && formModel.inviteEmail">
            <a-button type="black" :disabled="origin.status === SCHOOL_USER_STATUS.ACTIVE.value" :loading="confirmLoading" @click="handleReset">Reset Password</a-button>
          </a-col>
        </a-row>
      </a-form-model-item>
      <a-form-model-item v-if="teacherId && userMode === USER_MODE.SELF" label="" :wrapperCol="{ span: 18 }">
        <a-row :gutter=0>
          <a-col :span="16">
          </a-col>
          <a-col :span="2" style="text-align: center;">
          </a-col>
          <a-col :span="6" style="text-align: center;" v-if="teacherId && formModel.inviteEmail">
            <a-button type="black" :disabled="origin.status === SCHOOL_USER_STATUS.ACTIVE.value" :loading="confirmLoading" @click="handleReset">Reset Password</a-button>
          </a-col>
        </a-row>
      </a-form-model-item>
      <a-form-model-item class="mb0" label="Name" :required="true">
        <a-row :gutter=16>
          <a-col :span="12">
            <a-form-model-item prop="firstName" :hasFeedback="true">
              <a-input v-model="formModel.firstName" placeholder="First name" />
            </a-form-model-item >
          </a-col>
          <a-col :span="12">
            <a-form-model-item prop="lastName" :hasFeedback="true">
              <a-input v-model="formModel.lastName" placeholder="Last name" />
            </a-form-model-item >
          </a-col>
        </a-row>
      </a-form-model-item>
      <a-form-model-item label="Email" prop="inviteEmail" :hasFeedback="true">
        <a-input v-model="formModel.inviteEmail" :disabled="teacherId && !!formModel.inviteEmail" placeholder="Email" />
      </a-form-model-item>
      <a-form-model-item label="DOB">
        <a-date-picker v-model="formModel.birthDay" :disabled-date="disabledDate" />
      </a-form-model-item>
      <a-form-model-item class="mb0" label="Class">
        <a-row :gutter=16>
          <a-col :span="18">
            <a-form-model-item class="self-select">
              <template v-if="!classUnModify">
                <a-select
                  mode="multiple"
                  :disabled="classUnModify"
                  optionFilterProp="children"
                  :getPopupContainer="trigger => trigger.parentElement"
                  v-model='formModel.classArr'
                  option-label-prop="label"
                  placeholder='Please select class'>
                  <a-select-option :label="item.name" v-for='item in filterClassList' :key='item.id'>
                    {{ item.name }}
                  </a-select-option >
                </a-select>
                <div :size="4" :class="{disabled: classUnModify}" class="tag-render" @click="showSelect" ref="tagRender">
                  <a-tag
                    :closable="isShowClose(tag)"
                    @close="closeCls(tag)"
                    :color="clsColor(tag)"
                    v-for="tag in formModel.classArr"
                    :key="'tag'+tag">{{ formatName(tag, classList) }}</a-tag>
                </div>
              </template>
              <a-space v-else>
                <a-space class="flex-wrap">
                  <template v-for="(cls) in classArrDetail">
                    <a-tag :key="cls.id" :color="cls.classType === 0 ? '#2db7f5' : '#f50'">
                      {{ cls.classType === 1 ? formatViewName(cls.subject) + '-' + cls.name : cls.name }}
                    </a-tag>
                  </template>
                </a-space>
              </a-space>
              <!-- <a-select
                optionFilterProp="children"
                :getPopupContainer="trigger => trigger.parentElement"
                v-model='formModel.classes'
                placeholder='Please select class'>
                <a-select-option v-for='item in classList' :key='item.id'>
                  {{ item.name }}
                </a-select-option >
              </a-select> -->
            </a-form-model-item>
          </a-col>
          <a-col :span="6" v-if="showClassLink">
            <a-button type="link" @click="handelGoClass">Class Manage</a-button>
          </a-col>
        </a-row>
      </a-form-model-item>
      <a-form-model-item label="Roles" v-if="!!teacherId">
        <!-- <a-select
          mode="multiple"
          optionFilterProp="children"
          :getPopupContainer="trigger => trigger.parentElement"
          v-if="info.email !== formModel.inviteEmail"
          v-model='formModel.roleArr'
          placeholder='Please select role'>
          <a-select-option v-for='item in roleList' :key='item.roleCode'>
            {{ item.name }}
          </a-select-option >
        </a-select> -->
        <a-space>
          <a-tag v-for="role in formModel.roleArr" :key="'role_'+role">{{ role }}</a-tag>
        </a-space>
      </a-form-model-item>
      <a-form-model-item :wrapperCol="{offset: 6}">
        <a-button :disabled="hasErrors" :loading="loading" @click="handleSave" type="primary">{{ teacherId ? 'Update': 'Create' }}</a-button>
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
import { USER_MODE, SCHOOL_USER_STATUS } from '@/const/common'

import { listClass } from '@/api/v2/schoolClass'
import { addTeacher, updateTeacher, checkEmailTeacher, getTeacherInfo, resetPassword } from '@/api/v2/schoolUser'
import { listRole, geHeaderClassByUserId } from '@/api/v2/schoolRole'
import { getSubjectBySchoolId } from '@/api/academicSettingSubject'

import ResetPassword from '../persona/ResetPassword'
import AvatarModal from '@/views/account/settings/AvatarModal'

import { SubmitBeforeMixin } from '@/mixins/SubmitBeforeMixin'
import { AutoSaveLocalMixin } from '@/mixins/AutoSaveLocalMixin'
import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'

import moment from 'moment'
import { mapState } from 'vuex'
const { sortBy } = require('lodash-es')
export default {
  name: 'SchoolTeacherAdd',
  components: {
    ResetPassword,
    AvatarModal
  },
  mixins: [
    SubmitBeforeMixin,
    AutoSaveLocalMixin,
    UserModeMixin,
    CurrentSchoolMixin
  ],
  props: {
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
    id: {
      handler(val) {
        this.teacherId = val
        this.initForm()
        this.initUserClassRole()
      },
      immediate: true
    }
  },
  data() {
    return {
      SCHOOL_USER_STATUS: SCHOOL_USER_STATUS,
      USER_MODE: USER_MODE,
      sortBy: sortBy,
      teacherId: this.id,
      classList: [],
      roleList: [],
      formModel: {
        firstName: '',
        lastName: '',
        birthDay: '',
        classes: '',
        classArr: [],
        inviteEmail: '',
        roles: '',
        roleArr: [],
        schoolId: this.school?.id || '',
        avatar: ''
      },
      origin: {},
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 12 }
      },
      loading: false,
      passwordVis: false,
      confirmLoading: false,
      cacheKey: 'SUBMIT_VALIDATE_SCHOOL_TEACHER_',
      autoSaveLocalKey: 'FORM_SCHOOL_TEACHER_',
      needAutoSave: !this.id,
      userHeaderTeacherCls: [],
      classUnModify: false,
      subjectOptions: []
    }
  },
  computed: {
    ...mapState({
      info: state => state.user.info,
      currentSchool: state => state.user.currentSchool,
      userMode: state => state.app.userMode
    }),
    validatorRules: function () {
      return {
        firstName: [{ required: true, message: 'Please Input First Name!' }],
        lastName: [{ required: true, message: 'Please Input Last Name!' }],
        inviteEmail: [
          { required: true, message: 'Please Input Email!' },
          { type: 'email', message: 'Please Input Valid Email!' },
          { validator: this.validateRemoteEmail, trigger: 'blur' }
        ],
        classArr: [{ required: true, message: 'Please Select a class!', trigger: 'change' }],
        roleArr: [{ required: true, message: 'Please Select a role!', trigger: 'change' }]
      }
    },
    filterClassList() {
      return this.classList.filter(cc => !this.formModel.classArr.includes(cc.id))
    },
    classArrDetail() {
      const clses = this.classList.filter(cc => this.formModel.classArr.includes(cc.id))
      return sortBy(clses, 'classType')
    }
  },
  created() {
    this.initData()
  },
  methods: {
    handleSchoolChange(currentSchool) {
      if (this.userMode === USER_MODE.SCHOOL) {
        this.initData()
        this.initUserClassRole()
      }
    },
    handleModeChange(userMode) {
      // 模式切换，个人还是学校 个人接口
      this.initData()
      this.initUserClassRole()
    },
    initData() {
       Promise.all([
          listClass({
            schoolId: this.currentSchool.id,
            pageNo: 1,
            pageSize: 10000
          }),
          listRole({
            schoolId: this.currentSchool.id
          }),
          getSubjectBySchoolId({
            schoolId: this.currentSchool.id
          })
        ]).then(([clsRes, roleRes, subjectRes]) => {
          if (clsRes.code === 0) {
            this.classList = clsRes.result.records.filter(cls => cls.classType !== 2)
            this.classUnModify = !!this.teacherId
            const query = this.$route.query
            if (query.classId) {
              const isFind = this.classList.find(item => item.id === query.classId)
              if (isFind) {
                this.formModel.classArr = [query.classId]
                this.formModel.classes = query.classId
                this.classUnModify = true
              }
            }
          }
          if (roleRes.code === 0) {
            this.roleList = roleRes.result
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
        })
    },
    initForm(defaultForm) {
      if (this.teacherId) {
        this.loading = true
        getTeacherInfo({
          schoolId: this.currentSchool.id,
          userId: this.teacherId
        }).then(res => {
          if (res.code === 0) {
            this.origin = { ...res.result }
            this.formModel.id = res.result.id
            this.formModel.firstName = res.result.firstname
            this.formModel.lastName = res.result.lastname
            this.formModel.birthDay = res.result.birthday
            this.formModel.avatar = res.result.avatar
            this.formModel.inviteEmail = res.result.inviteEmail
            if (res.result.classes) {
              this.formModel.classArr = res.result.classes.map(item => item.id)
              this.formModel.classes = this.formModel.classArr.join(',')
            }
            if (res.result.roles) {
              const roleArr = res.result.roles.filter(item => item.name.toLowerCase() !== 'teacher').map(item => item.name.charAt(0).toLowerCase() + item.name.slice(1))
              this.formModel.roleArr = Array.from(new Set(roleArr)).map(item => item.charAt(0).toUpperCase() + item.slice(1))
              this.formModel.roles = this.formModel.roleArr.join(',')
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
    initUserClassRole() {
      geHeaderClassByUserId({
        schoolId: this.currentSchool.id,
        userId: this.id
      }).then(res => {
        if (res.code === 0) {
          this.userHeaderTeacherCls = res.result.classIdList
        }
      })
    },
    doValidate(key, value) {
      this.fillValidate(key, value)
    },
    validateRemoteEmail(rule, value, callback) {
      if (!value) {
        return callback()
      } else {
        // 调用封装了的异步效验方法，
        if (this.teacherId && value === this.origin.inviteEmail) {
          return callback()
        }
        checkEmailTeacher({
          emails: value,
          schoolId: this.currentSchool.id
        }).then(response => {
          if (response.code === 0 && response.result && response.result[0].exists) {
            callback(new Error('Teacher already exists'))
          } else {
            callback()
          }
        }).catch(res => {
          callback(new Error(res.message))
        })
      }
    },
    setAvatar (url) {
      this.formModel.avatar = url
    },
    disabledDate(current) {
      return current && current > moment()
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
            userIds: [this.teacherId] // reset
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
          params.classes = params.classArr.join(',')
          params.roles = params.roleArr.join(',')
          if (params.birthDay) {
            params.birthday = params.birthDay = moment.utc(params.birthDay).format('YYYY-MM-DD HH:mm:ss')
          }
          this.loading = true
          let promise = addTeacher
          if (this.teacherId) {
            promise = updateTeacher
          }
          promise(params).then(res => {
            if (res.code === 0) {
              this.$message.success('Save successfully')
              this.clearLocalData()
              this.$emit('save', params)
            }
          }).finally(() => {
            this.loading = false
          })
        } else {
          console.log(valid)
        }
      })
    },
    formatName(key, arr) {
      const find = arr.find(item => item.id === key)
      return find ? find.name : ''
    },
    isShowClose(id) {
      return !this.userHeaderTeacherCls.includes(id) && !this.classUnModify
    },
    closeCls(id) {
      this.formModel.classArr = this.formModel.classArr.filter(clsId => clsId !== id)
    },
    clsColor(id) {
      if (this.userHeaderTeacherCls.includes(id)) {
        return '#ef4136'
      }
      return ''
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
  margin-left: calc(50% - 76px);
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
