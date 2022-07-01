<template>
  <div class='my-full-form-wrapper' id='formRoot'>
    <fixed-form-header>
      <template v-slot:header>
        <form-header
          title='School Teacher'
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
      <div class="status-tab">
        <div class="tab-list">
          <div :class="{'tab-item': true, 'active' : queryParam.schoolUserStatus === ''}" @click="toggleTab('')">All</div>
          <div
            v-for="(item,index) in tabsList"
            :key="'types'+index"
            :class="{'tab-item': true, 'active' : queryParam.schoolUserStatus === item.value}"
            @click="toggleTab(item.value)">
            {{ item.label }}
          </div>
        </div>
        <div class="opt-list">
          <custom-text-button label='Invite' @click="handleInvite">

          </custom-text-button>
        </div>
      </div>

      <div class="filter-tab">
        <div class="filter-search">
          <a-input-search v-model="queryParam.searchKey" placeholder="Search" @search="searchQuery"></a-input-search>
        </div>
        <a-space class="filter-opt">
          <a-dropdown :disabled="selectedRowKeys.length === 0" v-if="queryParam.schoolUserStatus !== ''">
            <a-menu slot="overlay" @click="handleBatchOpt">
              <a-menu-item :key="'ACT_'+ACT.RESEND.value" v-if="queryParam.schoolUserStatus === SCHOOL_USER_STATUS.INACTIVE.value"> Resend </a-menu-item>
              <a-menu-item :key="'ACT_'+ACT.RESET.value" v-if="queryParam.schoolUserStatus === SCHOOL_USER_STATUS.ACTIVE.value"> Reset password </a-menu-item>
              <a-menu-item :key="'ACT_'+ACT.APPROVE.value" v-if="queryParam.schoolUserStatus === SCHOOL_USER_STATUS.PENDING.value"> Approve </a-menu-item>
              <a-menu-item :key="'ACT_'+ACT.RESTORE.value" v-if="queryParam.schoolUserStatus === SCHOOL_USER_STATUS.ARCHIVE.value"> Restore </a-menu-item>
              <a-menu-item :key="'ACT_'+ACT.ARCHIVE.value" v-if="queryParam.schoolUserStatus === SCHOOL_USER_STATUS.ACTIVE.value"> Archive </a-menu-item>
              <a-menu-item :key="'ACT_'+ACT.DELETE.value" v-if="queryParam.schoolUserStatus === SCHOOL_USER_STATUS.ARCHIVE.value"> Delete </a-menu-item>
            </a-menu>
            <a-button style="margin-left: 8px"> Bulk manage <a-icon type="down" /> </a-button>
          </a-dropdown>
          <a-button type="primary" @click="handleAdd">Add</a-button>
          <a-button type="black" @click="handleUpload">Bulk Upload</a-button>
        </a-space>
      </div>

      <div class="form-tab">
        <a-table
          ref="tableCon"
          rowKey="uid"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
          @change="handleTableChange">
          <div class="user-info" slot="name" slot-scope="text, record">
            <div class="user-avatar">
              <img :src="record.avatar" alt="" v-if="record.avatar">
              <img src="~@/assets/icons/library/default-avatar.png" alt="" v-else>
            </div>
            <div class="user-detail">
              <label for="">{{ record.firstname + record.lastname }}</label>
              <label for="">{{ record.email }}</label>
            </div>
          </div>
          <div class="flex-wrap" slot="classes" slot-scope="classes">
            <a-tag v-for="cls in classes" :key="cls.id" :color="cls.classType === 0 ? '#2db7f5' : '#f50'">{{ cls.name }}</a-tag>
          </div>
          <div slot="status" slot-scope="status">
            <a-tag :color="getStatusFormat(status, 'color')">{{ getStatusFormat(status) || ' - ' }}</a-tag>
          </div>
          <a-space slot="action" slot-scope="text, record">
            <a @click="handleEdit(record)">Edit</a>
            <a-dropdown>
              <a-menu slot="overlay" @click="opt => handleSingleOpt(opt, record)">
                <a-menu-item :key="'ACT_'+ACT.RESEND.value" v-if="record.status === SCHOOL_USER_STATUS.INACTIVE.value"> Resend </a-menu-item>
                <a-menu-item :key="'ACT_'+ACT.RESET.value" v-if="record.status === SCHOOL_USER_STATUS.ACTIVE.value"> Reset password </a-menu-item>
                <a-menu-item :key="'ACT_'+ACT.APPROVE.value" v-if="record.status === SCHOOL_USER_STATUS.PENDING.value"> Approve </a-menu-item>
                <a-menu-item :key="'ACT_'+ACT.RESTORE.value" v-if="record.status === SCHOOL_USER_STATUS.ARCHIVE.value"> Restore </a-menu-item>
                <a-menu-item :key="'ACT_'+ACT.ARCHIVE.value" v-if="record.status === SCHOOL_USER_STATUS.ACTIVE.value"> Archive </a-menu-item>
                <a-menu-item :key="'ACT_'+ACT.DELETE.value" v-if="record.status === SCHOOL_USER_STATUS.ARCHIVE.value"> Delete </a-menu-item>
              </a-menu>
              <a style="margin-left: 8px"> More <a-icon type="down" /> </a>
            </a-dropdown>
          </a-space>
        </a-table>
      </div>
    </div>

    <school-student-move
      ref="schoolStudentMove"
      @update="debounceLoad"
      :school="currentSchool"
      :classes="classList"/>

    <school-user-invite ref="schoolUserInvite" :school="currentSchool"/>

  </div>
</template>

<script>
import { USER_MODE, SCHOOL_USER_STATUS } from '@/const/common'
import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { TableWidthMixin } from '@/mixins/TableWidthMixin'

import { listClass } from '@/api/v2/schoolClass'
import { listRole } from '@/api/v2/schoolRole'
import { bulkActTeacher, removeTeachers, resetPassword } from '@/api/v2/schoolUser'

import FixedFormHeader from '@/components/Common/FixedFormHeader'
import FormHeader from '@/components/FormHeader/FormHeader'
import CustomTextButton from '@/components/Common/CustomTextButton'
import SchoolStudentMove from './schoolUser/SchoolStudentMove'
import SchoolUserInvite from './schoolUser/SchoolUserInvite'

import { mapState } from 'vuex'
import cloneDeep from 'lodash.clonedeep'
const { debounce } = require('lodash-es')

export default {
  name: 'SchoolTeacher',
  mixins: [UserModeMixin, CurrentSchoolMixin, JeecgListMixin, TableWidthMixin],
  components: {
    FixedFormHeader,
    FormHeader,
    CustomTextButton,
    SchoolStudentMove,
    SchoolUserInvite
  },
  data() {
    return {
      USER_MODE: USER_MODE,
      SCHOOL_USER_STATUS: SCHOOL_USER_STATUS,
      tabsList: Object.values(SCHOOL_USER_STATUS),
      ROLE_CONVERT: {
        'admin': 'Admin',
        'head': 'Homeroom teacher',
        'leader': 'Subject coordinator',
        'teacher': 'Teacher'
      },
      ACT: {
        ARCHIVE: {
          value: '4',
          label: 'archive'
        },
        APPROVE: {
          value: '1',
          label: 'approve'
        },
        REJECT: {
          value: '3',
          label: 'reject'
        },
        RESTORE: {
          value: '8',
          label: 'restore'
        },
        RESEND: {
          value: '9',
          label: 'resend'
        },
        DELETE: {
          value: '-1',
          label: 'delete'
        },
        RESET: {
          value: '-2',
          label: 'reset'
        }
      },
      loading: false,
      queryParam: {
        searchKey: '',
        schoolId: this.$store.state.user.currentSchool.id,
        schoolUserStatus: '',
        grades: '',
        roles: 'teacher'
      },
      filters: {
        classes: ''
      },
      debounceInit: null,

      classList: [],
      roleList: [],

      currentSel: null,
      optType: 'multi',

      url: {
        list: '/classcipe/api2/school/user/getSchoolUsers'
        // list: '/classcipe/api/school/schoolClassStudent/list'
      },

      tableRefs: ['tableCon']
    }
  },
  created() {
    this.initDict()
    this.queryParam.schoolId = this.currentSchool.id
    this.debounceLoad = debounce(this.loadData, 300)
  },
  computed: {
    ...mapState({
      userMode: state => state.app.userMode,
      currentSchool: state => state.user.currentSchool
    }),
    columns() {
      return [
        {
          title: 'Name',
          align: 'center',
          dataIndex: 'nickname',
          width: 250,
          scopedSlots: { customRender: 'name' }
          // customRender: (text, record) => {
          //   return text || (record.firstname + record.lastname) || record.email
          // }
        },
        {
          title: 'Class',
          align: 'center',
          dataIndex: 'classes',
          width: 120,
          scopedSlots: { customRender: 'classes' },
          // customRender: (text, record) => {
          //   return (text || []).map(item => item.name).join(',')
          // },
          filters: [{
            text: 'Not assigned',
            value: -1
          }].concat(this.classList.map(item => ({
            text: item.name,
            value: item.id
          })))
        },
        {
          title: 'Role',
          align: 'center',
          dataIndex: 'roles',
          width: 120,
          filters: this.roleList.map(item => ({
            text: item.name,
            value: this.ROLE_CONVERT[item.roleCode]
          })),
          customRender: (text, record) => {
            return (text || []).map(item => item.name).join(', ')
          }
        },
        {
          title: 'Status',
          align: 'center',
          dataIndex: 'status',
          width: 120,
          scopedSlots: { customRender: 'status' }
        },
        {
          title: 'Last Login',
          align: 'center',
          dataIndex: 'lastLogin',
          width: 120
        },
        {
          title: 'Action',
          align: 'center',
          width: 150,
          scopedSlots: { customRender: 'action' }
        }
      ]
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
    initDict() {
      // 获取所有班级用于筛选
      Promise.all([
        listClass({
          schoolId: this.currentSchool.id,
          pageNo: 1,
          pageSize: 10000
        }),
        listRole({
          schoolId: this.currentSchool.id
        })
      ]).then(([clsRes, roleRes]) => {
        if (clsRes.code === 0) {
          this.classList = clsRes.result.records
        }
        if (roleRes.code === 0) {
          this.roleList = roleRes.result
        }
        this.onClearSelected()
      })
    },
    toggleTab(status) {
      this.queryParam.schoolUserStatus = status
      this.onClearSelected()
      this.searchQuery()
    },
    getStatusFormat (status, key = 'label') {
      const find = this.tabsList.find(tab => tab.value === status)
      return find ? find[key] : ''
    },
    handleBatchOpt(opt) {
      this.optType = 'multi'
      this.handleOpt(opt)
    },
    handleSingleOpt(opt, item) {
      this.optType = 'single'
      this.currentSel = cloneDeep(item)
      this.handleOpt(opt)
    },
    handleOpt(opt) {
      let userIdList = []
      if (this.optType === 'multi') {
        userIdList = this.selectedRowKeys
      } else {
        userIdList = [this.currentSel.uid]
      }
      if (userIdList.length > 0) {
        let promise = null
        const act = opt.key.split('_')[1]
        const actObj = Object.values(this.ACT).find(item => item.value === act)
        if (act === this.ACT.DELETE.value) {
          promise = removeTeachers
        } else if (act === this.ACT.RESET.value) {
          promise = resetPassword
        } else {
          promise = bulkActTeacher
        }
        this.$confirm({
          title: `Confirm ${actObj.label}`,
          content: `Do you want to ${actObj.label} this teacher(s)?`,
          centered: true,
          onOk: () => {
            this.loading = true
            promise({
              act: act,
              schoolId: this.currentSchool.id,
              userIdList: userIdList,
              userIds: userIdList // reset
            }).then(res => {
              if (res.code === 0) {
                this.$message.success('Opt Successfully')
                this.onClearSelected()
                this.searchQuery()
              }
            }).finally(() => {
              this.loading = false
            })
          }
        })
      }
    },
    getFilterParams(filters) {
      console.log(filters)
      if (filters.classes && filters.classes.length > 0) {
        this.filters.classes = filters.classes.join(',')
      } else {
        this.filters.classes = ''
      }
      if (filters.roles && filters.roles.length > 0) {
        this.filters.teacherRoles = filters.roles.join(',')
      } else {
        this.filters.teacherRoles = ''
      }
    },
    handleAdd() {
      this.$router.push('/manage/teacher/detail')
    },
    handleUpload() {
      this.$router.push('/manage/teacher/upload')
    },
    handleEdit(item) {
      this.$router.push('/manage/teacher/detail/' + item.uid + '/' + item.email)
    },
    handleInvite() {
      this.$refs.schoolUserInvite.doCreate('teacher')
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
  overflow: hidden;
}
.status-tab {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 60px;
  padding: 0 20px;
  .tab-list {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
   .tab-item {
      margin: 0 20px;
      font-size: 16px;;
      font-family: Arial;
      font-weight: 400;
      color: #3E4459;
      cursor: pointer;
      position: relative;
      &::after {
        content: '';
        display: block;
        width: 0;
        height: 3px;
        background: #208557;
        margin-top: 10px;
        position: absolute;
        transition: width 0.2s, left 0.2s;
        transition-timing-function: ease-out;
        left: 50%;
      }
      &.active {
        font-size: 16px;
        font-family: Arial;
        font-weight: bold;
        color: #1F222D;
        &::after {
          width: 100%;
          left: 0;
        }
      }
    }
  }
}
.filter-tab {
  height: 40px;
  padding: 0 40px;
  margin: 20px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;

}
.form-tab {
  height: calc(100% - 140px);
  padding: 0 20px;
  overflow: auto;
}

/deep/ .ant-btn-black {
  background: #484D53;
  border-color: #484D53;
  color: #fff;
  border-radius: 4px;
  font-size: 12px;
}

.user-info {
  display: flex;
  align-items: center;
  .user-avatar {
    margin-right: 10px;
    width: 40px;
    height: 40px;
    border-radius: 100%;
    img {
      width: 40px;
      height: 100%;
      border-radius: 100%;
    }
  }
  .user-detail {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    label {
      font-size: 14px;
      text-align: left;
      &:first-child {
        font-weight: bold;
      }
    }
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

/deep/ .ant-table-fixed-right{
  table {
    background: transparent;
  }
}
</style>
