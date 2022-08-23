<template>
  <div class='my-full-form-wrapper' id='formRoot'>
    <fixed-form-header>
      <template v-slot:header>
        <form-header
          title='School Student'
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
              <template v-if="onlyClass">
                <label style="cursor: pointer" @click="routerRefresh">School Student</label>
                <label for="">></label>
                <label style="font-weight: normal">{{ onlyClass.name }}</label>
              </template>
              <label v-else style="font-weight: normal">School Student</label>
            </a-space>
          </template>
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
      </div>

      <div class="filter-tab">
        <div class="filter-search">
          <a-input-search v-model="queryParam.searchKey" placeholder="Search" @search="handleSearch" :allow-clear="true"></a-input-search>
        </div>
        <a-space class="filter-opt">
          <a-button type="primary" :disabled="selectedRowKeys.length === 0" @click="handleMove">Move Class</a-button>
          <a-dropdown :disabled="selectedRowKeys.length === 0" v-if="queryParam.schoolUserStatus !== ''">
            <a-menu slot="overlay" @click="handleBatchOpt">
              <!-- <a-menu-item key="move"> Move Class </a-menu-item> -->
              <a-menu-item :key="'ACT_'+ACT.RESEND.value" v-if="queryParam.schoolUserStatus === SCHOOL_USER_STATUS.INACTIVE.value"> Resend </a-menu-item>
              <a-menu-item :key="'ACT_'+ACT.RESET.value" v-if="queryParam.schoolUserStatus === SCHOOL_USER_STATUS.ACTIVE.value"> Reset password </a-menu-item>
              <a-menu-item :key="'ACT_'+ACT.RESTORE.value" v-if="queryParam.schoolUserStatus === SCHOOL_USER_STATUS.ARCHIVE.value"> Restore </a-menu-item>
              <a-menu-item :key="'ACT_'+ACT.ARCHIVE.value" v-if="queryParam.schoolUserStatus === SCHOOL_USER_STATUS.ACTIVE.value"> Archive </a-menu-item>
              <a-menu-item :key="'ACT_'+ACT.DELETE.value" v-if="queryParam.schoolUserStatus === SCHOOL_USER_STATUS.ARCHIVE.value || queryParam.schoolUserStatus === SCHOOL_USER_STATUS.INACTIVE.value"> Delete </a-menu-item>
            </a-menu>
            <a-button style="margin-left: 8px"> Bulk manage <a-icon type="down" /> </a-button>
          </a-dropdown>
          <a-button type="primary" @click="handleAdd">Add</a-button>
          <a-button type="black" @click="handleUpload">Bulk Upload</a-button>
        </a-space>
      </div>

      <div class="form-tab">
        <a-table
          ref="table"
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
              <label for="">{{ record.firstname }} {{ record.lastname }}</label>
              <label for="">{{ record.inviteEmail }}<span v-if="isSelfEmail(record.inviteEmail)"> (Me)</span></label>
            </div>
          </div>
          <div class="user-info" slot="parentFirstName" slot-scope="text, record">
            <!-- <div class="user-avatar">
              <img :src="record.avatar" alt="" v-if="record.avatar">
              <img src="~@/assets/icons/library/default-avatar.png" alt="" v-else>
            </div> -->
            <div class="user-detail">
              <label for="">{{ record.parentFirstName + record.parentLastName }}</label>
              <label for="">{{ record.parentEmail }}<span v-if="isSelfEmail(record.parentEmail)"> (Me)</span></label>
            </div>
          </div>
          <div class="flex-wrap" slot="classes" slot-scope="classes">
            <template v-for="(cls, clsIndex) in sortBy(classes, 'classType')">
              <a-tag v-if="clsIndex < 1 && cls.classType === 0" :key="cls.id" color="#2db7f5" class="ellispe-tag">
                {{ cls.name }}
              </a-tag>
              <a-tooltip v-if="clsIndex < 1 && cls.classType === 1" :title="formatViewName(cls.subject) + ' - ' + cls.name" :key="cls.id">
                <a-tag color="#f50" class="ellispe-tag">
                  <!-- <a-icon type="plus" /> -->
                  {{ cls.name }}
                </a-tag>
              </a-tooltip>
            </template>
            <a-popover
              v-if="classes.length > 1"
              :overlayStyle="{ width: '310px' }"
              overlayClassName="tag-info-tip">
              <template slot="content">
                <a-space class="flex-wrap" direction="vertical">
                  <template v-for="(cls) in sortBy(classes, 'classType')">
                    <a-tag :key="cls.id" :color="cls.classType === 0 ? '#2db7f5' : '#f50'">
                      {{ cls.classType === 1 ? formatViewName(cls.subject) + '-' + cls.name : cls.name }}
                    </a-tag>
                  </template>
                </a-space>
              </template>
              <a-tag>
                <a-icon type="ellipsis" />
              </a-tag>
            </a-popover>
          </div>
          <div slot="status" slot-scope="status, record">
            <!-- <a-tag :color="getStatusFormat(status, 'color')">{{ getStatusFormat(status) || ' - ' }}</a-tag> -->
            <a-space>
              <a-tooltip title="Student Active" v-if="status === 1">
                <a-icon style="color:#007990" type="check" />
              </a-tooltip>
              <a-tooltip title="Student InActive" v-else>
                <a-icon style="color: #8D9496" type="check" />
              </a-tooltip>
              <a-tooltip title="Parent Active" v-if="record.parentEmailStatus" >
                <a-icon style="color:#007990" type="check" />
              </a-tooltip>
              <a-tooltip title="Parent InActive" v-else >
                <a-icon style="color: #8D9496" type="check" />
              </a-tooltip>
            </a-space>
          </div>
          <a-space slot="action" slot-scope="text, record">
            <a @click="handleEdit(record)" v-if="record.status !== SCHOOL_USER_STATUS.ARCHIVE.value">Edit</a>
            <a-dropdown>
              <a-menu slot="overlay" @click="opt => handleSingleOpt(opt, record)">
                <a-menu-item :key="'ACT_'+ACT.MOVE.value"> Move Class </a-menu-item>
                <a-menu-item :key="'ACT_'+ACT.RESEND.value" v-if="record.status === SCHOOL_USER_STATUS.INACTIVE.value"> Resend </a-menu-item>
                <a-menu-item :key="'ACT_'+ACT.RESET.value" v-if="record.status === SCHOOL_USER_STATUS.ACTIVE.value"> Reset password </a-menu-item>
                <a-menu-item :key="'ACT_'+ACT.RESTORE.value" v-if="record.status === SCHOOL_USER_STATUS.ARCHIVE.value"> Restore </a-menu-item>
                <a-menu-item :key="'ACT_'+ACT.ARCHIVE.value" v-if="record.status === SCHOOL_USER_STATUS.ACTIVE.value"> Archive </a-menu-item>
                <a-menu-item :key="'ACT_'+ACT.DELETE.value" v-if="record.status === SCHOOL_USER_STATUS.ARCHIVE.value || record.status === SCHOOL_USER_STATUS.INACTIVE.value"> Delete </a-menu-item>
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

  </div>
</template>

<script>
import { USER_MODE, SCHOOL_USER_STATUS } from '@/const/common'
import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'

import { listClass } from '@/api/v2/schoolClass'
import { bulkActStudent, removeStudents, resetPassword } from '@/api/v2/schoolUser'
import { getSubjectBySchoolId } from '@/api/academicSettingSubject'

import FixedFormHeader from '@/components/Common/FixedFormHeader'
import FormHeader from '@/components/FormHeader/FormHeader'
import CustomTextButton from '@/components/Common/CustomTextButton'
import SchoolStudentMove from './schoolUser/SchoolStudentMove'

import { mapState } from 'vuex'
import cloneDeep from 'lodash.clonedeep'
const { debounce, sortBy } = require('lodash-es')

export default {
  name: 'SchoolStudent',
  mixins: [UserModeMixin, CurrentSchoolMixin, JeecgListMixin],
  components: {
    FixedFormHeader,
    FormHeader,
    CustomTextButton,
    SchoolStudentMove
  },
  data() {
    return {
      USER_MODE: USER_MODE,
      SCHOOL_USER_STATUS: SCHOOL_USER_STATUS,
      tabsList: Object.values(SCHOOL_USER_STATUS).filter(item => item.value !== 2),
      sortBy: sortBy,
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
        },
        MOVE: {
          value: '-3',
          label: 'move'
        }
      },
      loading: false,
      queryParam: {
        searchKey: '',
        schoolId: this.$store.state.user.currentSchool.id,
        schoolUserStatus: '',
        classes: '',
        grades: '',
        roles: 'student'
      },
      filters: {
        classes: ''
      },
      debounceInit: null,

      classList: [],

      currentSel: null,
      optType: 'multi',

      url: {
        list: '/classcipe/api2/school/user/getSchoolUsers'
        // list: '/classcipe/api/school/schoolClassStudent/list'
      },

      onlyClass: null,
      subjectOptions: [],
      disableMixinCreated: true
    }
  },
  created() {
    const query = this.$route.query
    if (query) {
      if (query.tab) {
        const find = this.tabsList.find(item => item.value + '' === this.$route.query.tab + '')
        if (find) {
          this.queryParam.schoolUserStatus = find.value
        }
      }
      if (query.classId) {
       this.filters.classes = query.classId
      }
    }
    this.initDict()
    this.queryParam.schoolId = this.currentSchool.id
    this.debounceLoad = debounce(this.loadData, 300)
    this.loadData()
  },
  computed: {
    ...mapState({
      info: state => state.user.info,
      userMode: state => state.app.userMode,
      currentSchool: state => state.user.currentSchool
    }),
    columns() {
      return [
        {
          title: 'ID',
          align: 'center',
          dataIndex: 'workNo',
          width: 120
        },
        {
          title: 'Name',
          align: 'left',
          dataIndex: 'nickname',
          width: 250,
          scopedSlots: { customRender: 'name' }
          // customRender: (text, record) => {
          //   return text || (record.firstname + record.lastname) || record.email
          // }
        },
        {
          title: 'Parent',
          align: 'left',
          dataIndex: 'parentFirstName',
          width: 250,
          scopedSlots: { customRender: 'parentFirstName' }
          // customRender: (text, record) => {
          //   return text || (record.firstname + record.lastname) || record.email
          // }
        },
        ...this.onlyClass ? [] : [{
          title: 'Class',
          align: 'left',
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
        }],
        {
          title: 'Status',
          align: 'center',
          dataIndex: 'status',
          width: 120,
          filterMultiple: false,
          filters: [{
            text: 'Parent Active',
            value: 1
          }, {
            text: 'Parent Inactive',
            value: 0
          }],
          scopedSlots: { customRender: 'status' }
        },
        // {
        //   title: 'Last Login',
        //   align: 'center',
        //   dataIndex: 'lastLogin',
        //   width: 120
        // },
        {
          title: 'Action',
          align: 'center',
          width: 120,
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    routerRefresh() {
      this.onlyClass = null
      this.$router.replace('/manage/student/list')
      this.filters.classes = ''
      this.onClearSelected()
      this.searchQuery()
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
    isSelfEmail(email) {
      return email === this.info.email
    },
    initDict() {
      // 获取所有班级用于筛选
      Promise.all([
        listClass({
          schoolId: this.currentSchool.id,
          pageNo: 1,
          pageSize: 10000
        }),
        getSubjectBySchoolId({
          schoolId: this.currentSchool.id
        })
      ]).then(([clsRes, subjectRes]) => {
        if (clsRes.code === 0) {
          this.classList = clsRes.result.records
          this.onlyClass = null
          const query = this.$route.query
          if (query.classId) {
            const isFind = this.classList.find(item => item.id === query.classId)
            if (isFind) {
              this.filters.classes = query.classId
              this.onlyClass = { ...isFind }
            } else {
              this.routerRefresh()
            }
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
        this.onClearSelected()
      })
    },
    toggleTab(status) {
      this.queryParam.schoolUserStatus = status
      const url = '/manage/student/list?tab=' + status + (this.onlyClass ? `&classId=${this.onlyClass.id}` : '')
      this.$router.replace({
        path: url
      })
      this.onClearSelected()
      this.searchQuery()
    },
    handleSearch(val) {
      this.queryParam.searchKey = val ? val.trim() : ''
      this.searchQuery()
    },
    getStatusFormat (status, key = 'label') {
      const find = Object.values(SCHOOL_USER_STATUS).find(tab => tab.value === status)
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
          promise = removeStudents
        } else if (act === this.ACT.RESET.value) {
          promise = resetPassword
        } else if (act === this.ACT.MOVE.value) {
          this.$refs.schoolStudentMove.doCreate({
            userIds: userIdList
          })
          return
        } else {
          promise = bulkActStudent
        }
        this.$confirm({
          title: `Confirm ${actObj.label}`,
          content: `Do you want to ${actObj.label} this student(s)?`,
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
    handleMove() {
      this.$refs.schoolStudentMove.doCreate({
        userIds: this.selectedRowKeys
      })
    },
    getFilterParams(filters) {
      if (filters.classes && filters.classes.length > 0) {
        this.filters.classes = filters.classes.join(',')
      } else {
        this.filters.classes = ''
      }
      if (filters.status && filters.status.length > 0) {
        this.filters.parentEmailStatus = filters.status
      } else {
        this.filters.parentEmailStatus = ''
      }
    },
    handleAdd() {
      const url = '/manage/student/detail' + (this.onlyClass ? `?classId=${this.onlyClass.id}` : '')
      this.$router.push(url)
    },
    handleUpload() {
      const url = '/manage/student/upload' + (this.onlyClass ? `/${this.onlyClass.id}` : '')
      this.$router.push(url)
    },
    handleEdit(item) {
      this.$router.push('/manage/student/detail/' + item.uid)
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
.ellispe-tag {
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
