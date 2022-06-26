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
          <a-input-search v-model="queryParam.searchKey" placeholder="Search" @search="searchQuery"></a-input-search>
        </div>
        <a-space class="filter-opt">
          <a-button type="primary" :disabled="selectedRowKeys.length === 0" @click="handleMove">Move Class</a-button>
          <a-dropdown :disabled="selectedRowKeys.length === 0" v-if="queryParam.schoolUserStatus !== ''">
            <a-menu slot="overlay" @click="handleBatchOpt">
              <!-- <a-menu-item key="move"> Move Class </a-menu-item> -->
              <a-menu-item :key="'ACT_'+ACT.RESEND" v-if="queryParam.schoolUserStatus === SCHOOL_USER_STATUS.INACTIVE.value"> Resend </a-menu-item>
              <a-menu-item :key="'ACT_'+ACT.RESET" v-if="queryParam.schoolUserStatus === SCHOOL_USER_STATUS.ACTIVE.value"> Reset password </a-menu-item>
              <a-menu-item :key="'ACT_'+ACT.RESTORE" v-if="queryParam.schoolUserStatus === SCHOOL_USER_STATUS.ARCHIVE.value"> Restore </a-menu-item>
              <a-menu-item :key="'ACT_'+ACT.ARCHIVE" v-if="queryParam.schoolUserStatus === SCHOOL_USER_STATUS.ACTIVE.value"> Archive </a-menu-item>
              <a-menu-item :key="'ACT_'+ACT.DELETE" v-if="queryParam.schoolUserStatus === SCHOOL_USER_STATUS.ARCHIVE.value"> Delete </a-menu-item>
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
                <a-menu-item key="move"> Move Class </a-menu-item>
                <a-menu-item :key="'ACT_'+ACT.RESEND" v-if="record.status === SCHOOL_USER_STATUS.INACTIVE.value"> Resend </a-menu-item>
                <a-menu-item :key="'ACT_'+ACT.RESET" v-if="record.status === SCHOOL_USER_STATUS.ACTIVE.value"> Reset password </a-menu-item>
                <a-menu-item :key="'ACT_'+ACT.RESTORE" v-if="record.status === SCHOOL_USER_STATUS.ARCHIVE.value"> Restore </a-menu-item>
                <a-menu-item :key="'ACT_'+ACT.ARCHIVE" v-if="record.status === SCHOOL_USER_STATUS.ACTIVE.value"> Archive </a-menu-item>
                <a-menu-item :key="'ACT_'+ACT.DELETE" v-if="record.status === SCHOOL_USER_STATUS.ARCHIVE.value"> Delete </a-menu-item>
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
import { bulkActStudent } from '@/api/v2/schoolUser'

import FixedFormHeader from '@/components/Common/FixedFormHeader'
import FormHeader from '@/components/FormHeader/FormHeader'
import CustomTextButton from '@/components/Common/CustomTextButton'
import SchoolStudentMove from './schoolUser/SchoolStudentMove'

import { mapState } from 'vuex'
import cloneDeep from 'lodash.clonedeep'
const { debounce } = require('lodash-es')

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
      tabsList: Object.values(SCHOOL_USER_STATUS).filter(item => item.value !== 0),
      ACT: {
        ARCHIVE: '4',
        APPROVE: '1',
        REJECT: '3',
        RESTORE: '8',
        RESEND: '9',
        DELETE: '-1'
      },
      loading: false,
      queryParam: {
        searchKey: '',
        schoolId: this.$store.state.user.currentSchool.id,
        schoolUserStatus: '',
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
      }
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
          title: 'ID',
          align: 'center',
          dataIndex: 'uid',
          width: 120
        },
        {
          title: 'Name',
          align: 'center',
          dataIndex: 'nickname',
          width: 120,
          customRender: (text, record) => {
            return text || (record.firstname + record.lastname) || record.email
          }
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
          title: 'Status',
          align: 'center',
          dataIndex: 'status',
          width: 120,
          scopedSlots: { customRender: 'status' }
        },
        {
          title: 'Last Login',
          align: 'center',
          dataIndex: 'updateTime',
          width: 120
        },
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
        })
      ]).then(([clsRes]) => {
        if (clsRes.code === 0) {
          this.classList = clsRes.result.records
        }
      })
    },
    toggleTab(status) {
      this.queryParam.schoolUserStatus = status
      this.debounceLoad()
    },
    getStatusFormat (status, key = 'label') {
      const find = Object.values(SCHOOL_USER_STATUS).find(tab => tab.value === status)
      return find ? find[key] : ''
    },
    handleBatchOpt(opt) {
      this.optType = 'multi'
      if (this.selectedRowKeys.length > 0) {
        this.loading = true
        bulkActStudent({
          act: opt.key.split('_')[1],
          schoolId: this.currentSchool.id,
          userIdList: this.selectedRowKeys
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
    },
    handleSingleOpt(opt, item) {
      this.optType = 'single'
      this.currentSel = cloneDeep(item)
      if (opt.key === 'move') {
        this.$refs.schoolStudentMove.doCreate()
      }
    },
    handleMove() {
      this.$refs.schoolStudentMove.doCreate()
    },
    getFilterParams(filters) {
      if (filters.classes && filters.classes.length > 0) {
        this.filters.classes = filters.classes.join(',')
      } else {
        this.filters.classes = ''
      }
    },
    handleAdd() {
      this.$router.push('/manage/student/detail')
    },
    handleUpload() {
      this.$router.push('/manage/student/upload')
    },
    handleEdit(item) {
      this.$router.push('/manage/student/detail/' + item.id)
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
