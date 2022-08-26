<template>
  <div class="student-show">
    <div class="student-show-title">
      Student(s) added to {{ name }}
    </div>
    <div class="student-sel-opt">
      <a-space align="start">
        <a-input-search placeholder="Search here" v-model="queryParams.searchKey" @search="handleSearch"></a-input-search>
      </a-space>
    </div>
    <div class="table-con">
      <a-table
        ref="table"
        :rowKey="item => item.id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
      >
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
        <a-space slot="action" slot-scope="text, record">
          <a type="link" @click="handleDelete(record)">Remove</a>
        </a-space>
      </a-table>
    </div>
  </div>
</template>

<script>
import { USER_MODE } from '@/const/common'
import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'

import { getSchoolUsers } from '@/api/v2/schoolUser'
import { removeStudents } from '@/api/v2/schoolClass'

import { mapState } from 'vuex'
const { debounce } = require('lodash-es')
export default {
  name: 'ClassStudentShow',
  mixins: [UserModeMixin, CurrentSchoolMixin],
  props: {
    classId: {
      type: String,
      default: ''
    },
    className: {
      type: String,
      default: ''
    }
  },
  watch: {
    classId(val) {
      this.initDict()
      this.loadData()
    },
    className(val) {
      this.name = val
    }
  },
  data() {
    return {
      USER_MODE: USER_MODE,
      gradeOptions: [],
      subjectOptions: [],
      curriculumOptions: [],
      totalClass: [],
      debounceLoad: null,
      name: '',
      queryParams: {
        searchKey: ''
      },
      dataSource: [],
      selectedRowKeys: [],
      selectionRows: [],
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' of ' + total + ''
        },
        total: 0
      },
      isorter: {
        column: 'createTime',
        order: 'desc'
      },
      loading: false
    }
  },
  created() {
    this.initDict()
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
          width: 220,
          scopedSlots: { customRender: 'name' }
        },
        {
          title: 'Action',
          align: 'left',
          dataIndex: 'classes',
          width: 80,
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  methods: {
    handleSchoolChange(currentSchool) {
      if (this.userMode === USER_MODE.SCHOOL) {
        this.initDict()
      }
    },
    handleModeChange(userMode) {
      // 模式切换，个人还是学校 个人接口
      this.initDict()
    },
    isSelfEmail(email) {
      return email === this.info.email
    },
    initDict() {
    },
    loadData() {
      this.loading = true
      getSchoolUsers({
        schoolId: this.currentSchool.id,
        pageNo: this.ipagination.current,
        pageSize: this.ipagination.pageSize,
        classes: this.classId,
        roles: 'student',
        ...this.queryParams
      })
      .then(res => {
        if (res.code === 0) {
          this.dataSource = res.result.records
          this.selectedRowKeys = []
          this.selectionRows = []
          if (res.result.total) {
            this.ipagination.total = res.result.total
          } else {
            this.ipagination.total = 0
          }
        }
      }).finally(() => {
        this.loading = false
      })
    },
    onSelectChange (selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectionRows = selectionRows
    },
    onClearSelected () {
      this.selectedRowKeys = []
      this.selectionRows = []
    },
    handleSearch() {
      this.ipagination.current = 1
      this.debounceLoad()
    },
    handleTableChange (pagination, filters, sorter) {
      // 分页、排序、筛选变化时触发
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field
        this.isorter.order = sorter.order === 'ascend' ? 'asc' : 'desc'
      }
      this.ipagination = pagination
      this.debounceLoad()
    },
    handleDelete(item) {
       this.loading = true
        removeStudents({
          schoolId: this.currentSchool.id,
          userId: item.uid,
          classId: this.classId
        }).then((res) => {
          if (res.success) {
            this.$message.success('Remove Successfully')
            this.$emit('update')
            this.loadData()
          } else {
            this.$message.warning(res.message)
          }
        })
    }
  }
}
</script>

<style scoped lang="less">
.student-show {
  height: 100%;
  .student-show-title {
    font-weight: bold;
    font-size: 16px;
  }
  .student-sel-opt {
    min-height: 40px;
    padding: 0 0px;
    margin: 20px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .table-con {
    height: calc(100% - 130px);
    overflow: auto;
  }
  .sel-option {
    width: 250px;
  }
  .opt-con {
    margin-top: 10px;
    text-align: right;
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
</style>
