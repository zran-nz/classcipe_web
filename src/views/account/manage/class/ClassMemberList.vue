<template>
  <a-modal
    v-model="selVis"
    :footer="null"
    :title="null"
    :closable="true"
    destroyOnClose
    width="80%">
    <div style="min-height:400px;">
      <div class="table-page-search-wrapper" style="margin: 30px 0px;">
        <a-form layout="inline">
          <a-row type="flex" justify="space-between" align="middle">
            <a-col :span="10">
              <a-auto-complete
                v-model="selectMember"
                class="global-search"
                size="large"
                style="width: 100%"
                placeholder="Search and add by name/email"
                :getPopupContainer="trigger => trigger.parentElement"
                option-label-prop="title"
                @select="selectMember = ''"
                @search="handleSearch"
              >
                <template slot="dataSource">
                  <a-select-option v-for="item in filterMembers" :key="item.id" :title="item.email">
                    <!-- :class="{'disabled-user': item.status !== 1}" -->
                    <div style="display:flex">
                      <div class="user-avatar">
                        <div class="avatar">
                          <img v-if="item.avatar" :src="item.avatar" alt="avatar" />
                          <img v-else src="~@/assets/icons/library/default-avatar.png" alt="default-avatar">
                        </div>
                      </div>
                      <div class="user-name-email">
                        <div class="user-name">
                          {{ nameFormatter(item) }}
                        </div>
                        <div class="email">
                          {{ item.email }}
                        </div>
                      </div>
                      <!-- <div class="user-status" v-if="item.status !== 1">
                        {{ getStatusFormat(item.status) || ' - ' }}
                      </div> -->
                      <div class="action-wrapper">
                        <a-button type="link" @click="handleAddMember(item)">
                          Add
                        </a-button>
                      </div>
                    </div>
                  </a-select-option>
                </template>
                <a-input>
                  <a-icon slot="suffix" type="search" class="certain-category-icon" />
                </a-input>
              </a-auto-complete>
            </a-col>
            <template v-if="form.role === 'student'">
              <a-col :span="14" style="text-align: right;">
                <a-space>
                  <a-button type="primary" @click="handleAddStudent">Add Student</a-button>
                  <!-- <a-button @click="handleInvite" type="primary">Invite by link<a-icon type="share-alt" /></a-button> -->
                  <!-- <a-button type="primary" @click="downloadTemplate">Download template</a-button> -->
                  <a-button type="primary" @click="goImport">Bulk import</a-button>
                  <!-- <school-user-import :dataKey="dataKey" :action="importExcelUrl" @success="handleImportGet"/> -->
                </a-space>
              </a-col>
            </template>
            <template v-if="form.role === 'teacher'">
              <a-col :span="14" style="text-align: right;">
                <a-space>
                  <a-button type="primary" @click="handleAddTeacher">Add new teacher</a-button>
                </a-space>
              </a-col>
            </template>
          </a-row>
        </a-form>
      </div>

      <a-table
        :columns="columns"
        :data-source="classMemberList"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        :scroll="{ x: true }"
        rowKey="id"
      >
        <a-space slot="roles" slot-scope="roles">
          <template v-if="roles.length > 1 || roles[0].name.toLowerCase() !== 'teacher'">
            <a-tag class='role-name' v-for='roleName in roles.filter(role => role.name.toLowerCase() !== "teacher")' :key='roleName.id'>{{ roleName.name }}</a-tag>
          </template>
          <a-tag class='role-name' v-else>Teacher</a-tag>
          <!-- <span v-for="role in roles" :key="role.id">
            {{ role.name }}
          </span> -->
        </a-space>
        <span slot="grades" slot-scope="grades">
          <span v-for="grade in grades" :key="grade.id">
            {{ grade.name }}
          </span>
        </span>
        <span slot="action" slot-scope="record">
          <a-popconfirm title="Remove this user ?" ok-text="Yes" @confirm="handleDeleteRecord(record)" cancel-text="No">
            <a href="#">Remove</a>
          </a-popconfirm>
        </span>
      </a-table>
      <school-user-invite ref="schoolUserInvite" :school="currentSchool"/>
      <a-modal
        v-model='studentVis'
        destroyOnClose
        :title='studentAddTitle'
        width='600px'
        :footer="null"
      >
        <school-student-add
          ref="schoolStudentAdd"
          :school="currentSchool"
          :id="studentId"
          :showClassLink="false"
          @save="saveStudent"/>
      </a-modal>

      <a-modal
        v-model='importVis'
        destroyOnClose
        title='Student Import'
        width='1200px'
        okText="Add selected students"
        @ok="handleAddUser"
        @cancel="handleCancelImport"
      >
        <school-user-upload
          ref="schoolUserUpload"
          :columns="importColumns"
          :datas="datas"
          :verify="justifyStatus"
          :verifyDuplicate="verifyDuplicate"
          @change="handelChangeData"
          @save="handleSave">

        </school-user-upload>
      </a-modal>
    </div>
  </a-modal>
</template>

<script>
import { getSchoolUsers, checkEmailParent, checkEmailStudent, batchAddStudent } from '@/api/v2/schoolUser'
import { addTeachers, removeTeachers, addStudents, addStudentsBatch, removeStudents, listClass } from '@/api/v2/schoolClass'
import { schoolUserStatusList } from '@/const/schoolUser'
import { SCHOOL_USER_STATUS } from '@/const/common'
import moment from 'moment'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import {
  schoolClassStudentAPIUrl
} from '@/api/schoolClassStudent'

import SchoolUserImport from '../schoolUser/SchoolUserImport'
import SchoolUserInvite from '../schoolUser/SchoolUserInvite'
import SchoolStudentAdd from '../schoolUser/SchoolStudentAdd'
import SchoolUserUpload from '../schoolUser/SchoolUserUpload'

import { isEmpty, isEmail } from '@/utils/util'
import nameFormatter from '@/utils/formatters/nameFormatter'
const { mergeWith } = require('lodash-es')

export default {
  name: 'ClassMemberList',
  props: {
    school: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    school: {
      handler(val) {
        this.currentSchool = { ...val }
        this.initDict()
        this.loadData()
      },
      deep: true,
      immediate: true
    }
  },
  mixins: [JeecgListMixin],
  components: {
    SchoolUserImport,
    SchoolUserInvite,
    SchoolStudentAdd,
    SchoolUserUpload
  },
  data() {
    return {
      statusList: schoolUserStatusList,
      SCHOOL_USER_STATUS: SCHOOL_USER_STATUS,
      currentSchool: this.school,
      importVis: false,
      classMemberList: [],
      memberList: [],
      classList: [],
      remoteEmails: [],
      remoteParentEmails: [],
      datas: [],
      dataKey: ['firstName', 'lastName', 'inviteEmail', 'birthDay', 'parentFirstName', 'parentLastName', 'parentEmail', 'parentPhone'],
      importColumns: [
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
      url: {
        importExcelUrl: schoolClassStudentAPIUrl.SchoolClassStudentImportExcel
      },
      importLoadingText: 'Bulk import',
      loading: false,
      selVis: false,
      pagination: {
        pageSize: 20,
        current: 1,
        total: 0
      },
      baseUrl: process.env.VUE_APP_API_BASE_URL,
      searchKey: '',
      selectMember: '',
      form: {
        role: 'teacher',
        classId: ''
      },
      studentVis: false,
      studentAddTitle: 'Add Student',
      studentId: null
    }
  },
  created() {
    this.initDict()
  },
  computed: {
    filterMembers() {
      const isEmail = (email) => email.toLowerCase().indexOf((this.searchKey || '').toLowerCase()) > -1
      const isName = (member) => {
        const name = `${member.firstname || ''}${member.lastname || ''}`.toLowerCase()
        return name.indexOf((this.searchKey || '').toLowerCase()) > -1
      }
      return this.memberList.filter(member => !this.selectedEmails.includes(member.email) &&
        (isEmail(member.email || '') || isName(member)))
    },
    importExcelUrl() {
      return this.url.importExcelUrl + '?classId=' + this.form.classId
    },
    selectedEmails() {
      return this.classMemberList ? this.classMemberList.map(item => {
        return item.email
      }) : []
    },
    columns() {
      return [
        {
          title: 'Nick Name',
          dataIndex: 'nickname',
          key: 'name',
          customRender: (text, item, index) => {
            return text || this.nameFormatter(item)
          }
        },
        ...this.form.role === 'teacher' ? [
        {
          title: 'Role',
          dataIndex: 'roles',
          scopedSlots: { customRender: 'roles' },
          key: 'roles'
        }] : [],
        {
          title: 'Email',
          dataIndex: 'email',
          key: 'email'
        },
        {
          title: 'Join at',
          dataIndex: 'classes',
          customRender: (text, row, index) => {
            if (text && text.length > 0) {
              const index = text.findIndex(item => item.id === this.form.classId)
              if (index > -1) {
                return moment.utc(text[index].ralationDate).local().format('yyyy-MM-DD HH:mm')
              } else {
                return ''
              }
            } else {
              return ''
            }
          },
          key: 'joinDate'
        },
        {
          title: 'Action',
          key: 'action',
          scopedSlots: { customRender: 'action' },
          width: '150px'
        }
      ]
    }
  },
  methods: {
    nameFormatter(item) {
      nameFormatter(item)
    },
    async initMemberList() {
      const res = await getSchoolUsers({
        schoolId: this.currentSchool.id,
        roles: this.form.role,
        includePending: false,
        pageNo: 1,
        pageSize: 1000
      })
      if (res.result) {
        this.memberList = (res.result.records || []).filter(item => item.status !== 4)
      }
    },
    async loadData() {
      this.loading = true
      const res = await getSchoolUsers({
        schoolId: this.currentSchool.id,
        roles: this.form.role,
        classes: this.form.classId,
        pageSize: this.pagination.pageSize,
        pageNo: this.pagination.current
      })
      this.classMemberList = res?.result?.records || []
      this.pagination.total = res?.result?.total
      this.loading = false
    },
    doCreate(cls) {
      this.form = { ...cls }
      this.initMemberList()
      this.loadData()
      this.selVis = true
    },
    handleDeleteRecord(record) {
      const params = {
        schoolId: this.currentSchool.id,
        userId: record.uid,
        classId: this.form.classId
      }
      let promise = null
      if (this.form.role === 'teacher') {
        promise = removeTeachers
      } else {
        promise = removeStudents
      }
      if (promise) {
        this.loading = true
        promise(params).then((res) => {
          if (res.success) {
            this.$message.success(res.message)
            this.$emit('update')
            this.loadData()
          } else {
            this.$message.warning(res.message)
          }
        })
      }
    },
    handleAddMember(user) {
      // if (user.status !== 1) return
      if (!user.uid) this.$message.error('This user has not id')
      if (this.classMemberList.findIndex(member => member.uid === user.uid) > -1) {
        this.$message.error('This user has been added')
      }
      const params = {
        schoolId: this.currentSchool.id,
        userId: user.uid,
        classId: this.form.classId
      }
      this.selectMember = ''
      let promise = null
      if (this.form.role === 'teacher') {
        promise = addTeachers
      } else {
        promise = addStudents
      }
      if (promise) {
        this.loading = true
        promise(params).then(res => {
          if (res.success) {
            this.$emit('update')
            this.loadData()
          } else {
            this.$message.error(res.message)
            this.loading = false
            this.selVis = false
          }
        })
      }
    },
    handleSearch(val) {
      this.searchKey = val
    },
    handleInvite() {
      this.$refs.schoolUserInvite.doCreate(this.form.role)
    },
    handleAddStudent() {
      this.studentAddTitle = 'Add Student'
      this.studentId = null
      this.studentVis = true
      this.$nextTick(() => {
        this.$refs.schoolStudentAdd.initForm({
          classes: this.form.classId
        })
      })
    },
    handleAddTeacher() {
      this.$router.push('/manage/teacher/detail?classId=' + this.form.classId)
    },
    goImport() {
      this.$router.push('/manage/student/upload/' + this.form.classId)
    },
    saveStudent(user) {
      console.log(user)
      this.studentVis = false
      if (user && user.id) {
        user.uid = user.id
        this.handleAddMember(user)
        this.initMemberList()
        this.loadData()
      }
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
          if (clsRes.code === 0 && clsRes.result) {
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
      const emails = res.map(item => item.inviteEmail).filter(email => {
        return !isEmpty(email) && isEmail(email)
      }).join(',')
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
            status.push({
              col: 'parentEmail',
              msg: 'Existing student'
            })
          }
          item.status = status
          // 班级
          if (item.classes) {
            item.classes = item.classes.split(',').map(cls => {
              const name = cls.trim()
              const find = this.classList.find(item => item.name === name)
              return find ? find.id : ''
            }).filter(i => !!i).join(',')
          } else {
            item.classes = this.form.classId
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
        this.importVis = true
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
    handleCancelImport() {
      this.datas = []
      this.remoteEmails = []
      this.remoteParentEmails = []
      this.importVis = false
    },
    handleAddUser() {
      if (this.$refs.schoolUserUpload.selectionRows.length > 0) {
        this.loading = true
        batchAddStudent(this.$refs.schoolUserUpload.selectionRows).then(res => {
          if (res.code === 0) {
            this.datas = []
            this.remoteEmails = []
            this.remoteParentEmails = []
            this.$message.success('Import successfully')
            this.importVis = false
            if (res.result && res.result.length > 0) {
              const userIdList = res.result.map(item => item.id)
              this.loading = true
              addStudentsBatch({
                schoolId: this.currentSchool.id,
                userIdList: userIdList,
                classId: this.form.classId
              }).then(res => {

              }).finally(() => {
                this.$emit('update')
                this.initMemberList()
                this.loadData()
              })
            }
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
      return status
    },
    async verifyDuplicate(item) {
      const status = []
       // 验证远程
      if (item.inviteEmail) {
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
      // 验证远程
      if (item.firstName && item.lastName && item.parentEmail) {
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
              msg: 'Existing student'
            })
          }
        }
      }
      return status
    },
    getStatusFormat (status, key = 'label') {
      const find = Object.values(SCHOOL_USER_STATUS).find(tab => tab.value === status)
      return find ? find[key] : ''
    }
  }
}
</script>
<style lang="less" scoped>
.operator {
  margin-bottom: 16px;
  button {
    margin-right: 8px;
  }
}
.user-avatar {
  width: 50px;
  .avatar {
    img {
      height: 40px;
      border-radius: 40px;
    }
  }
}
.user-status {
  position: absolute;
  right: 30%;
  line-height: 32px;
  color: #ef4136;
}
.disabled-user {
  cursor: not-allowed;
  background: #f2f2f2;
  /deep/ .ant-btn {
    cursor: not-allowed;
    color: #e8b3b3;
  }
}
.user-name-email {
  display: flex;
  flex-direction:column;
  width: 250px;
  line-height: 24px;
  font-family: Inter-Bold;
  color: #000000;
  display: flex;
  align-items: flex-start;
  .email {
    padding-left: 10px;
    font-size: 12px;;
  }
  .user-name {
    text-align: center;
    font-family: Inter-Bold;
    line-height: 24px;
    font-size: 14px;
    padding-left: 10px;
    color: #000000;
    font-weight: bold;
  }
}
.action-wrapper{
  width:20%;
  float: right
}
</style>
