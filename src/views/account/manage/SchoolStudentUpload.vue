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
          <template v-slot:right>
          </template>
        </form-header>
      </template>
    </fixed-form-header>
    <div class="form-content">
      <div class="filter-tab">
        <div></div>
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
      dataKey: ['firstName', 'lastName', 'inviteEmail', 'birthDay', 'classes', 'parentFirstName', 'parentLastName', 'parentEmail', 'parentPhone'],
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
        {
          title: 'Action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      loading: false
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
      return 'School Student > Upload'
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
          const status = this.justifyStatus(item)
          const parentEmailExist = {}
          this.remoteParentEmails.forEach(item => {
            parentEmailExist[item.email] = item.exists
          })
          if (parentEmailExist[item.parentEmail]) {
            status.push('Duplicate Parent')
          }
          item.status = status.join(',')
          // 班级
          if (item.classes) {
            item.classes = item.classes.split(',').map(cls => {
              const name = cls.trim()
              const find = this.classList.find(item => item.name === name)
              return find ? find.id : ''
            }).filter(i => !!i).join(',')
          }
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
      if (this.$refs.schoolUserUpload.selectionRows.length > 0) {
        this.loading = true
        batchAddStudent(this.$refs.schoolUserUpload.selectionRows).then(res => {
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
            const statuss = item.status.split(',').filter(item => !!item)
            if (!statuss.includes('Local Duplicate')) {
              statuss.push('Local Duplicate')
            }
            console.log(statuss)
            item.status = statuss.join(',')
          } else {
            item.status = item.status.replace('Local Duplicate', '').split(',').filter(item => !!item).join(',')
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
      if (isEmpty(item.firstName) || isEmpty(item.lastName)) {
        status.push('Invalid Name')
      }
      if (isEmpty(item.inviteEmail) || !isEmail(item.inviteEmail)) {
        status.push('Invalid Email')
      } else {
        if (emailExist[item.inviteEmail]) {
          status.push('Duplicate')
        }
      }
      if (isEmpty(item.parentEmail) || !isEmail(item.parentEmail)) {
        status.push('Invalid Parent Email')
      }
      return status
    },
    async verifyDuplicate(item) {
      const status = []
       // 验证远程
      const emailRes = await checkEmailStudent({
        schoolId: this.currentSchool.id,
        emails: item.inviteEmail
      })
      if (emailRes.code === 0) {
        if (emailRes.result[0].exists) {
          status.push('Duplicate')
        }
      }
      // 验证远程
      const parentRes = await checkEmailParent({
        schoolId: this.currentSchool.id,
        'parentEmailInfos[0].firstName': item.firstName,
        'parentEmailInfos[0].lastName': item.lastName,
        'parentEmailInfos[0].parentEmail': item.parentEmail
      })
      if (parentRes.code === 0) {
        if (parentRes.result[0].exists) {
          status.push('Duplicate Parent')
        }
      }
      return status
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
