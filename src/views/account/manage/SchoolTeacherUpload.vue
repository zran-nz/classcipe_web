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
            <img @click.stop="openV2('/v2/')" src="~@/assets/logo/50.png" class='single-logo-img' alt='classcipe' />
          </template>
          <template v-slot:left>
            <a-space :size="5" align="center" @click.stop>
              <label style="cursor: pointer" @click="openV2('/v2/account/info')">Account Info</label>
              <label for="">></label>
              <label style="cursor: pointer" @click="$router.push('/manage/teacher')">School Teacher</label>
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
        <div></div>
        <a-space class="filter-opt">
          <a-button type="primary" @click="downloadTemplate">Download template</a-button>
          <school-user-import :dataKey="dataKey" :action="importExcelUrl" @success="handleImportGet"/>
        </a-space>
      </div>
      <div class="form-tab">
        <a-spin :spinning="loading">
          <school-user-upload
            ref="schoolUserUpload"
            :columns="columns"
            :datas="datas"
            :verify="justifyStatus"
            :verifyDuplicate="verifyDuplicate"
            @change="handelChangeData"
            @save="handleSave">

          </school-user-upload>
        </a-spin>
      </div>
    </div>
    <fixed-form-footer>
      <template v-slot:right>
        <a-space>
          <label for="">Total selected: {{ selectedLen }} </label>
          <custom-text-button label='Add selected teachers' @click="handleAddUser">

          </custom-text-button>
        </a-space>
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
import { checkEmailTeacher, batchAddTeacher, getTeacherCount } from '@/api/v2/schoolUser'

import { mapState } from 'vuex'
import moment from 'moment'
import { isEmpty, isEmail } from '@/utils/util'
import storage from 'store'
const { debounce, mergeWith } = require('lodash-es')

export default {
  name: 'SchoolTeacherUpload',
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
      datas: [],
      dataKey: ['firstName', 'lastName', 'inviteEmail', 'birthDay', 'classes', 'roles'],
      remoteEmails: [],
      waitToEmails: [],
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
          title: 'Action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      loading: false,
      teacherCount: 0
    }
  },
  beforeUpdate() {
    if (storage.get('user_mode') != USER_MODE.SCHOOL) {
      this.openV2('/v2/account/info')
    } else if (storage.get('SET_CURRENT_SCHOOL')?.id !== this.currentSchool.id) {
      window.location.reload()
    }
  },
  created() {
    this.debounceLoad = debounce(this.loadData, 300)
    this.initDict()
  },
  computed: {
    ...mapState({
      info: state => state.user.info,
      userMode: state => state.app.userMode,
      currentSchool: state => state.user.currentSchool
    }),
    title() {
      return 'Upload'
    },
    selectedLen() {
      return this.$refs.schoolUserUpload.selectionRows.length
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
          }),
          getTeacherCount({
            schoolId: this.currentSchool.id
          })
        ]).then(([clsRes, teacherRes]) => {
          if (clsRes.code === 0) {
            this.classList = clsRes.result.records
          }
          if (teacherRes && teacherRes.code === 0 && teacherRes.result) {
            this.teacherCount = teacherRes.result.sumCount
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
      this.loading = true
      checkEmailTeacher({
        schoolId: this.currentSchool.id,
        emails: emails
      }).then(emailRes => {
        if (emailRes.code === 0) {
          this.remoteEmails = mergeWith(this.remoteEmails, emailRes.result) // this.emails.concat(emailRes.result)
          const convert = res.map(item => {
            const status = this.justifyStatus(item)
            item.status = status
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
            // if (!item.roles) {
            //   item.roles = 'teacher'
            // }
            item.schoolId = this.currentSchool.id
            item.key = Math.random() * 100 + new Date().getTime()
            return item
          })
          this.datas = this.datas.concat(convert)
          this.reJustifyInviteEmail(this.datas)
        }
      }).finally(() => {
        console.log(this.datas)
        this.loading = false
      })
    },
    downloadTemplate () {
      const link = document.createElement('a')
      link.style.display = 'none'
      const url = this.baseUrl + '/classcipe/excel/Teacher_bulk_import.xlsx'
      link.href = url
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link) // 下载完成移除元素
      window.URL.revokeObjectURL(url) // 释放掉blob对象
    },
    handleSave(data) {

    },
    handleAddUser() {
      if (this.userMode != USER_MODE.SCHOOL) {
        this.openV2('/v2/account/info')
      }
      console.log(this.$refs.schoolUserUpload.selectionRows)
      if (this.$refs.schoolUserUpload.selectionRows.length > 0) {
        // 判断是否超出套餐限制
        if (this.info.planInfo && this.info.planInfo.teacherCount) {
          const selectedLen = this.$refs.schoolUserUpload.selectionRows.length
          if (selectedLen + this.teacherCount > this.info.planInfo.teacherCount) {
            const diff = this.info.planInfo.teacherCount - this.teacherCount
            this.$confirm({
              title: 'Alert',
              content: `The limits of your plan are ${this.info.planInfo.teacherCount} people, there are already ${this.teacherCount} people, you can add ${diff} people`,
              centered: true,
              okText: 'Confirm',
              cancelText: 'Cancel',
              okButtonProps: {
                style: { display: 'none' }
              },
              onOk: () => {

              },
              onCancel: () => {

              }
            })
            return
          }
        }
        batchAddTeacher(this.$refs.schoolUserUpload.selectionRows).then(res => {
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
      this.remoteEmails.forEach(item => {
        emailExist[item.email] = item.exists
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
      if (isEmpty(item.inviteEmail) || !isEmail(item.inviteEmail)) {
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
      return status
    },
    async verifyDuplicate(item) {
      const status = []
       // 验证远程
       if (item.inviteEmail) {
        const emailRes = await checkEmailTeacher({
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
