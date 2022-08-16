<template>
  <div class='my-full-form-wrapper' id='formRoot'>
    <fixed-form-header>
      <template v-slot:header>
        <form-header
          :title='title'
          :show-share='false'
          :show-collaborate='false'
          :is-preview-mode='true'
          @back='goBack'>
          <template v-slot:back>
            <img @click.stop="$router.push('/')" src="~@/assets/logo/50.png" class='single-logo-img' alt='classcipe' />
          </template>
          <template v-slot:left>
            <a-space :size="5" align="center" @click.stop>
              <label style="cursor: pointer" @click="$router.push('/account/info')">Account Info</label>
              <label for="">></label>
              <label style="cursor: pointer" @click="$router.push('/manage/student')">School Student</label>
              <label for="">></label>
              <label style="font-weight: normal">{{ title }}</label>
            </a-space>
          </template>
          <template v-slot:right>
          </template>
        </form-header>
      </template>
    </fixed-form-header>
    <div class="form-content">
      <div class="filter-tab">
        <a-space>
          <label for="">Class</label>
          <a-select
            v-model="chooseClass"
            style="margin: 0 10px; width: 170px;"
          >
            <a-select-option
              v-for="(param) in classList"
              :value="param.id"
              :key="'classes' + param.id"
            >
              {{ param.name }}
            </a-select-option>
          </a-select>
          <a-button type="primary" @click="goClass">Go to set class</a-button>
        </a-space>
        <a-space class="filter-opt">
          <a-button type="primary" @click="downloadTemplate">Download template</a-button>
          <school-user-import :dataKey="dataKey" :action="importExcelUrl" @success="handleImportGet"/>
        </a-space>
      </div>
      <div class="form-tab">
        <school-user-upload
          ref="schoolUserUpload"
          :columns="columns"
          :datas="datas"
          :verify="justifyStatus"
          :verifyDuplicate="verifyDuplicate"
          :options="uploadOptions"
          @change="handelChangeData"
          @save="handleSave">

        </school-user-upload>
      </div>
    </div>
    <fixed-form-footer>
      <template v-slot:right>
        <custom-text-button label='Add selected students' @click="handleAddUser">

        </custom-text-button>
      </template>
    </fixed-form-footer>
  </div>
</template>

<script>
import { USER_MODE, SCHOOL_USER_STATUS } from '@/const/common'
import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'

import FixedFormHeader from '@/components/Common/FixedFormHeader'
import FormHeader from '@/components/FormHeader/FormHeader'
import FixedFormFooter from '@/components/Common/FixedFormFooter'
import CustomTextButton from '@/components/Common/CustomTextButton'
import SchoolUserUpload from './schoolUser/SchoolUserUpload'
import SchoolUserImport from './schoolUser/SchoolUserImport'

import { listClass } from '@/api/v2/schoolClass'
import { checkEmailParent, checkEmailStudent, batchAddStudent } from '@/api/v2/schoolUser'

import { mapState } from 'vuex'
import moment from 'moment'
import { isEmpty, isEmail } from '@/utils/util'
const { debounce, mergeWith } = require('lodash-es')

export default {
  name: 'SchoolStudentUpload',
  mixins: [UserModeMixin, CurrentSchoolMixin],
  components: {
    FixedFormHeader,
    FixedFormFooter,
    FormHeader,
    CustomTextButton,
    SchoolUserUpload,
    SchoolUserImport
  },
  props: {
    id: {
      type: String,
      default: null
    },
    classId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      USER_MODE: USER_MODE,
      SCHOOL_USER_STATUS: SCHOOL_USER_STATUS,
      baseUrl: process.env.VUE_APP_API_BASE_URL,
      importExcelUrl: '',
      classList: [],
      remoteEmails: [],
      remoteParentEmails: [],
      datas: [],
      dataKey: ['firstName', 'lastName', 'inviteEmail', 'birthDay', 'parentFirstName', 'parentLastName', 'parentEmail', 'parentPhone'],
      columns: [
        {
          title: 'First Name',
          align: 'center',
          dataIndex: 'firstName',
          width: 150,
          scopedSlots: { customRender: 'firstName' }
        },
        {
          title: 'Last Name',
          align: 'center',
          dataIndex: 'lastName',
          width: 150,
          scopedSlots: { customRender: 'lastName' }
        },
        {
          title: 'Email',
          align: 'center',
          dataIndex: 'inviteEmail',
          width: 200,
          scopedSlots: { customRender: 'inviteEmail' }
        },
        {
          title: 'ParentEmail',
          align: 'center',
          dataIndex: 'parentEmail',
          width: 200,
          scopedSlots: { customRender: 'parentEmail' }
        },
        // {
        //   title: 'Class',
        //   align: 'center',
        //   dataIndex: 'classes',
        //   width: 200,
        //   scopedSlots: { customRender: 'classes' }
        // },
        {
          title: 'Action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      loading: false,
      uploadOptions: {
        classes: []
      },
      chooseClass: this.classId
    }
  },
  created() {
    this.debounceLoad = debounce(this.loadData, 300)
    this.initDict()
  },
  computed: {
    ...mapState({
      userMode: state => state.app.userMode,
      currentSchool: state => state.user.currentSchool
    }),
    title() {
      return 'Upload'
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    handleSchoolChange(currentSchool) {
      if (this.userMode === USER_MODE.SCHOOL) {
        this.queryParam.schoolId = currentSchool.id
        this.initDict()
        this.debounceInit()
      }
    },
    handleModeChange(userMode) {
      // 模式切换，个人还是学校 个人接口
      this.initDict()
      this.debounceInit()
    },
    loadData() {

    },
    initDict() {
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
            this.uploadOptions.classes = clsRes.result.records.map(item => ({
              value: item.id,
              label: item.name
            }))
            if (this.chooseClass) {
              const find = this.classList.find(item => item.id === this.chooseClass)
              if (!find) {
                this.chooseClass = ''
              }
            }
          }
        })
    },
    handelChangeData(data) {
      this.datas = data
      this.reJustifyInviteEmail(this.datas)
    },
    handleImportGet(res) {
      // 转换
      const emails = res.map(item => item.inviteEmail).filter(i => !!i).join(',')
      const parentEmailsObj = {}
      res.filter(item => {
        return !isEmpty(item.parentEmail) && isEmail(item.parentEmail)
      }).forEach((item, index) => {
          parentEmailsObj[`parentEmailInfos[${index}].firstName`] = item.firstName
          parentEmailsObj[`parentEmailInfos[${index}].lastName`] = item.lastName
          parentEmailsObj[`parentEmailInfos[${index}].parentEmail`] = item.parentEmail
      })
      this.loading = true
      Promise.all([
        checkEmailStudent({
          schoolId: this.currentSchool.id,
          emails: emails
        }),
        checkEmailParent({
          schoolId: this.currentSchool.id,
          ...parentEmailsObj
        })
      ]).then(([emailRes, parentEmailRes]) => {
        if (emailRes.code === 0) {
          this.remoteEmails = mergeWith(this.remoteEmails, emailRes.result) // this.emails.concat(emailRes.result)]
        }
        if (parentEmailRes.code === 0) {
          this.remoteParentEmails = mergeWith(this.remoteParentEmails, parentEmailRes.result) // this.emails.concat(emailRes.result)]
        }
        const convert = res.map(item => {
           // 班级 验证标准班
          if (item.classes) {
            item.classes = item.classes.split(',').map(cls => {
              const name = cls.trim()
              const find = this.classList.find(item => item.name === name)
              return find ? find.id : ''
            }).filter(i => !!i).join(',')
          }
          const status = this.justifyStatus(item)
          const parentEmailExist = {}
          this.remoteParentEmails.forEach(item => {
            parentEmailExist[item.email] = item.exists
          })
          if (parentEmailExist[item.parentEmail]) {
            status.push({
              col: 'parentEmail',
              msg: 'Duplicate Parent'
            })
          }
          item.status = status
          if (item.birthDay) {
            item.birthDay = moment(item.birthDay, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss')
          }
          item.schoolId = this.currentSchool.id
          item.key = Math.random() * 100 + new Date().getTime()
          return item
        })
        this.datas = this.datas.concat(convert)
        this.reJustifyInviteEmail(this.datas)
      }).finally(() => {
        console.log(this.datas)
        this.loading = false
      })
    },
    downloadTemplate () {
      const link = document.createElement('a')
      link.style.display = 'none'
      const url = this.baseUrl + '/classcipe/excel/Student_bulk_import.xlsx'
      link.href = url
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link) // 下载完成移除元素
      window.URL.revokeObjectURL(url) // 释放掉blob对象
    },
    handleSave(data) {

    },
    handleAddUser() {
      if (!this.chooseClass) {
        this.$message.error('Please select class')
        return
      }
      if (this.$refs.schoolUserUpload.selectionRows.length > 0) {
        const params = this.$refs.schoolUserUpload.selectionRows.map(item => ({
          ...item,
          classes: this.chooseClass
        }))
        this.loading = true
        batchAddStudent(params).then(res => {
          if (res.code === 0) {
            this.datas = []
            this.$message.success('Import successfully')
            this.goBack()
          }
        }).finally(() => {
          this.loading = false
        })
      } else {
        this.$message.error('Please select at least one to import')
      }
    },
    // 当前导入的文件中如果有重复的，则除第一个外，其他也是重复状态
    reJustifyInviteEmail(datas) {
      const isExist = {}
      datas.forEach(item => {
        if (isEmail(item.inviteEmail)) {
          if (isExist[item.inviteEmail]) {
            const msgs = item.status ? item.status.map(sta => sta.col === 'inviteEmail').map(i => i.msg).filter(item => !!item) : []
            if (!msgs.includes('Local Duplicate')) {
              msgs.push('Local Duplicate')
            }
            console.log(msgs)
            item.status.push({
              col: 'inviteEmail',
              msg: msgs.join(',')
            })
          } else {
            const msgs = item.status ? item.status.map(sta => sta.col === 'inviteEmail').map(i => i.msg).filter(item => !!item).join(',') : ''
            item.status.push({
              col: 'inviteEmail',
              msg: msgs.replace('Local Duplicate', '').split(',').filter(item => !!item).join(',')
            })
            isExist[item.inviteEmail] = true
          }
        }
      })
    },
    justifyStatus(item) {
      const emailExist = {}
      const parentEmailExist = {}
      this.remoteEmails.forEach(item => {
        emailExist[item.email] = item.exists
      })
      this.remoteParentEmails.forEach(item => {
        parentEmailExist[item.email] = item.exists
      })
      const status = []
      if (isEmpty(item.firstName)) {
        status.push({
          col: 'firstName',
          msg: 'Invalid Name'
        })
      }
      if (isEmpty(item.lastName)) {
        status.push({
          col: 'lastName',
          msg: 'Invalid Name'
        })
      }

      // 学生邮箱可以为空
      if (!isEmpty(item.inviteEmail) && !isEmail(item.inviteEmail)) {
        status.push({
          col: 'inviteEmail',
          msg: 'Invalid Email'
        })
      } else {
        if (emailExist[item.inviteEmail]) {
          status.push({
            col: 'inviteEmail',
            msg: 'Duplicate'
          })
        }
      }
      if (isEmpty(item.parentEmail) || !isEmail(item.parentEmail)) {
        status.push({
          col: 'parentEmail',
          msg: 'Invalid Parent Email'
        })
      }
      // if (isEmpty(item.classes)) {
      //   status.push('Invalid Class')
      // } else {
      //   const find = this.classList.find(cls => cls.id === item.classes)
      //   if (find) {

      //   } else {
      //     status.push('Invalid Class')
      //   }
      // }
      console.log(status)
      return status
    },
    async verifyDuplicate(item) {
      const status = []
      if (item.inviteEmail) {
       // 验证远程
        const emailRes = await checkEmailStudent({
          schoolId: this.currentSchool.id,
          emails: item.inviteEmail
        })
        if (emailRes.code === 0 && emailRes.result && emailRes.result.length > 0) {
          if (emailRes.result[0].exists) {
            status.push({
              col: 'inviteEmail',
              msg: 'Duplicate'
            })
          }
        }
      }
      if (item.firstName && item.lastName && item.parentEmail) {
        // 验证远程
        const parentRes = await checkEmailParent({
          schoolId: this.currentSchool.id,
          'parentEmailInfos[0].firstName': item.firstName,
          'parentEmailInfos[0].lastName': item.lastName,
          'parentEmailInfos[0].parentEmail': item.parentEmail
        })
        if (parentRes.code === 0 && parentRes.result && parentRes.result.length > 0) {
          if (parentRes.result[0].exists) {
            status.push({
              col: 'parentEmail',
              msg: 'Duplicate Parent'
            })
          }
        }
      }
      return status
    },
    goClass() {
      this.$router.push('/manage/class')
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";
.cc-fixed-form-header {
  height: 60px;
}
.form-content {
  margin-top: 60px;
  height: calc(100vh - 60px);
  padding: 30px 60px;
  transition: all 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  overflow: auto;
}
.filter-tab {
  height: 40px;
  padding: 0 40px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.form-tab {
  height: calc(100% - 80px);
  padding: 0 20px;
  overflow: auto;
}
/deep/ .cc-fixed-form-footer {
  background: #fff;
}
</style>
