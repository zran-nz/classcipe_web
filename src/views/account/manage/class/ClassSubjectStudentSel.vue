<template>
  <div class="class-student-sel">
    <div class="student-sel-title">
      Student(s)
    </div>
    <div class="student-sel-opt">
      <div class="sel-opt">
        <a-select
          optionFilterProp="children"
          class="sel-option"
          allowClear
          :getPopupContainer="trigger => trigger.parentElement"
          v-model='queryParams.gradeIds'
          @change="changeGrade"
          option-label-prop="label"
          placeholder='Filter By Grade'>
          <a-select-option
            :value="option._id"
            :label="option.name"
            v-for="option in filterGradeOptions"
            :key="option._id">
            <span>{{ option.name }}</span>
          </a-select-option>
        </a-select>
        <a-select
          optionFilterProp="children"
          mode="multiple"
          class="sel-option"
          :getPopupContainer="trigger => trigger.parentElement"
          v-model='queryParams.classIds'
          @change="changeClass"
          option-label-prop="label"
          placeholder='Filter By Class'>
          <a-select-option
            :value="option.id"
            :label="option.name"
            v-for="option in filterClass"
            :key="option.id"
          >
            <span>{{ option.name }}</span>
          </a-select-option>
        </a-select>
        <a-input-search
          :allow-clear="true"
          placeholder="Search here"
          class="sel-option"
          v-model="queryParams.name"
          @search="handleSearch">
        </a-input-search>
      </div>
    </div>
    <div class="table-con">
      <a-table
        ref="table"
        v-if="dataSource.length > 0"
        :rowKey="item => item.id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange
        }"
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
        <a-space slot="action" slot-scope="text, record">
          <a type="link" @click="handleDelete(record)">Delete</a>
        </a-space>
      </a-table>
      <common-no-data v-else text='No students'>
        <template v-slot:icon>
          <no-students />
        </template>
      </common-no-data>
      <!-- <a-result v-else subTitle="No students">
        <template #icon>
          <a-icon type="smile" theme="twoTone" />
        </template>
      </a-result> -->
    </div>
    <div class="opt-con">
      <a-button :loading="loading" @click="handleChoose" :disabled="selectedRowKeys.length === 0" type="primary">Add the selected student(s)</a-button>
    </div>
  </div>
</template>

<script>
import { USER_MODE } from '@/const/common'
import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'
import CommonNoData from '@/components/Common/CommonNoData'
import NoStudents from '@/assets/v2/icons/no_students.svg?inline'

import { getCurriculumBySchoolId } from '@/api/academicSettingCurriculum'
import { getSubjectBySchoolId } from '@/api/academicSettingSubject'
import { listClass } from '@/api/v2/schoolClass'
import { listStudents } from '@/api/v2/schoolUser'

import { mapState } from 'vuex'
const { debounce, sortBy } = require('lodash-es')
export default {
  name: 'ClassSubjectStudentSel',
  components: {
    CommonNoData,
    NoStudents
  },
  mixins: [UserModeMixin, CurrentSchoolMixin],
  props: {
    subjectId: {
      type: String,
      default: ''
    }
  },
  watch: {
    subjectId(val) {
      this.loadData()
    }
  },
  data() {
    return {
      USER_MODE: USER_MODE,
      sortBy: sortBy,
      gradeOptions: [],
      subjectOptions: [],
      totalClass: [],
      debounceLoad: null,
      queryParams: {
        name: '',
        gradeIds: [],
        classes: []
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
  },
  computed: {
    ...mapState({
      info: state => state.user.info,
      userMode: state => state.app.userMode,
      currentSchool: state => state.user.currentSchool
    }),
    filterClass() {
      if (this.totalClass && this.totalClass.length > 0) {
        return this.totalClass.filter(cls => {
          if (this.queryParams.gradeIds && this.queryParams.gradeIds.length > 0) {
            return this.queryParams.gradeIds.includes(cls.gradeId)
          }
          if (cls.gradeId === 'ungraded' || !cls.gradeId || !this.gradeOptions.find(i => i._id === cls.gradeId)) {
            return false
          }
          return true
        })
      }
      return []
    },
    filterGradeOptions() {
      if (this.gradeOptions && this.gradeOptions.length > 0 && this.totalClass && this.totalClass.length > 0) {
        return this.gradeOptions.filter(grade => {
          return this.totalClass.find(cls => cls.gradeId === grade._id)
        })
      }
      return []
    },
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
          title: 'Class',
          align: 'left',
          dataIndex: 'classes',
          width: 120,
          scopedSlots: { customRender: 'classes' }
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
    async initDict() {
      this.loading = true
      let rs
      if (this.currentSchool.id === '0') {
        rs = await App.service('conf-user').get('Grades')
      } else {
        rs = await App.service('conf-school').get('get', { query: { key: 'Grades', rid: this.currentSchool.id } })
      }
      this.gradeOptions = rs?.val ?? []
      Promise.all([
        getSubjectBySchoolId({
          schoolId: this.currentSchool.id
        }),
        listClass({
          schoolId: this.currentSchool.id,
          queryType: 0,
          pageNo: 1,
          pageSize: 10000
        })
      ]).then(([subjectRes, clsRes]) => {
        if (subjectRes.success) {
          let subjects = []
          subjectRes.result.forEach(item => {
            if (item.subjectList && item.subjectList.length > 0) {
              subjects = subjects.concat((item.subjectList || []).map(sub => ({
                ...sub,
                curriculumId: item.curriculumId
              })))
            }
          })
          const options = []
          subjects.forEach(item => {
            options.push({
              subjectId: item.subjectId,
              subjectName: item.subjectName,
              curriculumId: item.curriculumId
            })
            options.push({
              subjectId: item.parentSubjectId,
              subjectName: item.parentSubjectName,
              curriculumId: item.curriculumId
            })
          })
          this.subjectOptions = options
        }
        if (clsRes.success && clsRes.result) {
          this.totalClass = clsRes.result.records
        }
      }).finally(() => {
        this.loading = false
      })
    },
    loadData() {
      this.loading = true
      listStudents({
        schoolId: this.currentSchool.id,
        pageNo: this.ipagination.current,
        pageSize: this.ipagination.pageSize,
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
    changeGrade() {
      this.queryParams.classIds = []
      if (this.filterClass.length === 1) {
        this.queryParams.classIds = this.filterClass.map(item => item.id)
      }
      this.debounceLoad()
    },
    changeClass() {
      this.debounceLoad()
    },
    formatViewName(id) {
      const findSubject = this.subjectOptions.find(subject => subject.subjectId === id)
      if (findSubject) return findSubject.subjectName
      // const findGrade = this.gradeOptions.find(grade => grade.gradeId === id)
      // if (findGrade) return findGrade.gradeName
      return 'Untitle'
    },
    handleChoose() {
      console.log(this.selectedRowKeys)
      this.loading = true
      this.$emit('choose', this.selectionRows.map(item => item.uid))
      this.loading = false
    }
  }
}
</script>

<style scoped lang="less">
.class-student-sel {
  height: 100%;
  .student-sel-title {
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
  .sel-opt {
    display: flex;
    align-items: flex-start;
    width: 100%;
  }
  .sel-option {
    flex: 1;
    margin-right: 10px;
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
