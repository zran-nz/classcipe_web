<template>
  <div class="role-con">
    <a-icon class="close" type="close-circle" @click="handleClose" />
    <div class="filter-tab">
      <a-row style="width: 300px;">
        <!-- TODO: and new router -->
        <a-select
          v-model="currentCurriculumId"
          style="width: 140px"
          placeholder="Select a curriculum"
          :options="allCurriculums"
          @change="handleCurriculumIdChange"
        ></a-select>
      </a-row>
      <a-space class="filter-opt">
        <a-button type="primary" @click="handleAddSubject">Add Subject</a-button>
      </a-space>
    </div>
    <div class="table-con">
      <a-table
        ref="table"
        :rowKey="item => item.subjectId"
        :columns="columns"
        :dataSource="filteredDataSource"
        :pagination="false"
        :loading="loading"
      >
        <a-space slot="teachers" slot-scope="text, record" style="flex-wrap: wrap;">
          <template v-if="text && text.length > 0">
            <div class="user-tag" v-for="item in record.teachers" :key="item.userId">
              <div class="avatar">
                <img :src="item.avatar" v-if="item.avatar" />
                <img v-else src="~@/assets/icons/library/default-avatar.png" />
              </div>
              <div class="user-name-email">
                <div class="user-name">
                  {{ item.userName }}
                </div>
                <div class="email">
                  {{ item.email }}
                </div>
              </div>
              <div class="user-opt">
                <a-icon type="close-circle" @click="handleDelete(item, record)"></a-icon>
              </div>
            </div>
          </template>
        </a-space>
        <a-space class="popover-link" slot="action" slot-scope="text, record">
          <a-popover placement="left" title="Choose User" trigger="click">
            <div slot="content" class="search-popover">
              <a-space class="search-con">
                <a-input-search
                  v-model="searchKeyMember"
                  :allow-clear="true"
                  placeholder="Search and add by name/email"
                ></a-input-search>
                <a-button @click="goTeachers">Add new</a-button>
              </a-space>
              <div class="search-user" v-for="item in filterMembers" :key="item.userId">
                <div class="user-avatar">
                  <div class="avatar">
                    <img :src="item.avatar" v-if="item.avatar" />
                    <img v-else src="~@/assets/icons/library/default-avatar.png" />
                  </div>
                </div>
                <div class="user-name-email">
                  <div class="user-name">
                    {{ item.nickname || `${item.firstname} ${item.lastname}` }}
                  </div>
                  <div class="email">
                    {{ item.email }}
                  </div>
                </div>
                <div class="action-wrapper">
                  <a-button :loading="loading" type="link" @click="handleAddMember(item, record)">
                    Add
                  </a-button>
                </div>
              </div>
            </div>
            <a :id="'popover_' + record.id" type="link" @click="handleResetFilter(record)">Add</a>
          </a-popover>

          <!-- <a type="link" @click="handleDelete(record)">Delete</a> -->
        </a-space>
      </a-table>
    </div>
    <!-- <school-user-select ref="schoolUserSelect" @selectFinished="selectOK" :school="currentSchool" /> -->
  </div>
</template>

<script>
// TODO: refactor in new web (WIP)
import { getRoleSubjectLeaders, bindRoleSubjectLeader } from '@/api/v2/schoolRole'
import { getSchoolUsers } from '@/api/v2/schoolUser'
import { getSubjectBySchoolId } from '@/api/academicSettingSubject'
import { getAllCurriculums } from '@/api/preference'
import { getCurriculumBySchoolId } from '@/api/academicSettingCurriculum'
import { debounce } from 'lodash-es'

export default {
  name: 'SchoolRoleSubject',
  components: {},
  props: {
    school: {
      type: Object,
      default: () => {}
    },
    role: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    school: {
      handler(val) {
        this.currentSchool = { ...val }
        this.loadData()
        this.initSchoolUsers()
        this.debounceSchoolUsers = debounce(this.initSchoolUsers, 300)
      },
      deep: true,
      immediate: true
    },
    role: {
      handler(val) {
        this.currentRole = { ...val }
        this.loadData()
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      currentSchool: this.school,
      currentRole: this.role,
      searchPoverVis: false,
      subjectOptions: [],
      curriculumOptions: [],
      classOptions: [],
      teacherList: [],
      currentRecord: null,
      queryParams: {
        searchKey: ''
      },
      selectMember: '',
      searchKeyMember: '',
      loading: false,
      dataSource: [],
      filteredDataSource: [],
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
      allCurriculums: [],
      currentCurriculumId: null
    }
  },
  computed: {
    columns() {
      return [
        {
          title: 'Subject',
          align: 'center',
          dataIndex: 'subjectName',
          width: 150,
          customRender: (text, record) => {
            return this.formatViewName(record.subjectId) + text
          }
        },
        {
          title: 'Teachers',
          align: 'center',
          dataIndex: 'teachers',
          scopedSlots: { customRender: 'teachers' }
        },
        {
          title: 'Action',
          align: 'center',
          width: 80,
          scopedSlots: { customRender: 'action' }
        }
      ]
    },
    filterMembers() {
      let members = []
      if (this.currentRecord) {
        members = this.teacherList.filter(
          teacher =>
            !this.currentRecord.teachers || !this.currentRecord.teachers.find(head => head.userId === teacher.uid)
        )
      }
      if (this.searchKeyMember) {
        const userName = ((this.currentRecord.firstname || '') + (this.currentRecord.lastname || '')).toLowerCase()
        members = members.filter(item => {
          return (
            item.email &&
            (item.email.toLowerCase().indexOf((this.searchKeyMember || '').toLowerCase() || '') > -1 ||
              userName.indexOf((this.searchKeyMember || '').toLowerCase() || '') > -1)
          )
        })
      }
      return members
    }
  },
  async created() {
    this.debounceLoad = debounce(this.loadData, 300)
    await this.initDict()
    this.initSchoolUsers()
  },
  methods: {
    loadData() {
      if (!this.currentSchool || !this.currentRole) return
      this.loading = true
      getRoleSubjectLeaders({
        schoolId: this.currentSchool.id
      })
        .then(res => {
          if (res.code === 0) {
            this.dataSource = res.result.filter(e => e.subjectId && e.subjectName)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    async initDict() {
      // 获取所有班级用于筛选
      const res = await Promise.all([
        getSubjectBySchoolId({ schoolId: this.currentSchool.id }),
        getCurriculumBySchoolId({ schoolId: this.currentSchool.id }),
        getAllCurriculums()
        // App.service('curriculum').get('pubList'),
        // App.service('conf-school').get('get', { query: { key: 'Curriculum', rid: this.currentSchool.id } })
      ])
      const [subjectRes, currentRes, allCurriculumRes] = res
      if (subjectRes.success) {
        let subjects = []
        subjectRes.result.forEach(parent => {
          if (parent.subjectList && parent.subjectList.length > 0) {
            subjects = subjects.concat(
              parent.subjectList.map(item => ({
                ...item,
                curriculumId: parent.curriculumId
              }))
            )
          }
        })
        const options = []
        subjects.forEach(item => {
          const option = { curriculumId: item.curriculumId }
          if (item.subjectId && item.subjectName) {
            option.subjectId = item.subjectId
            option.subjectName = item.subjectName
          } else if (item.parentSubjectId && item.parentSubjectName) {
            option.subjectId = item.parentSubjectId
            option.subjectName = item.parentSubjectName
          }
          options.push(option)
        })
        this.subjectOptions = options
        this.filteredDataSource = this.subjectOptions
      }
      if (currentRes.success) {
        this.curriculumOptions = currentRes.result
      }
      if (allCurriculumRes.success) {
        console.error(this.allCurriculums)
        this.allCurriculums = allCurriculumRes.result.map(e => ({
          value: e.id,
          label: e.name
        }))
      }
    },
    initSchoolUsers() {
      getSchoolUsers({
        pageNo: 1,
        pageSize: 10000,
        schoolId: this.currentSchool.id,
        schoolUserStatus: 1,
        roles: 'teacher'
      }).then(res => {
        if (res.success) {
          this.teacherList = res.result.records
        }
      })
    },
    handleAdd() {
      if (!this.currentRole || !this.currentRole.id) {
        this.$message.error('Please select a role!')
      } else {
        this.$refs.schoolUserSelect.add()
      }
    },
    handleAddClass() {
      this.$router.push('/manage/curriculum')
    },
    handleClose() {
      this.$emit('close')
    },
    handleDelete(item, cls) {
      if (!this.currentRole || !this.currentRole.roleCode) {
        this.$message.error('Please select a role!')
        return
      }
      this.$confirm({
        title: 'Confirm delete user ' + item.email,
        // content: 'By deleting the role, all teachers belong to it will be removed. Do you confirm to delete? ',
        centered: true,
        onOk: () => {
          this.loading = true
          bindRoleSubjectLeader({
            bindFlag: 0,
            schoolId: this.currentSchool.id,
            subjectId: cls.subjectId,
            userId: item.userId
          })
            .then(res => {
              if (res.code === 0) {
                this.$message.success('Delete user successfully')
                this.initSchoolUsers()
                this.debounceLoad()
                this.$store.dispatch('GetInfo')
              } else {
                this.loading = false
              }
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    handleCurriculumIdChange() {
      if (this.currentCurriculumId) {
        this.filteredDataSource = this.subjectOptions.filter(e => `${e.curriculumId}` === this.currentCurriculumId)
      }
    },
    handleResetFilter(record) {
      this.currentRecord = { ...record }
      this.searchKeyMember = ''
    },
    handleAddSubject() {
      this.$router.push('/manage/curriculum')
    },
    goTeachers() {
      this.$router.push('/manage/teacher')
    },
    handleAddMember(user, cls) {
      if (!this.currentRole || !this.currentRole.roleCode) {
        this.$message.error('Please select a role!')
        return
      }
      // 根据roleCode判断是否存在
      // const roles = user.roles.map(item => item.name)
      // const isIn = roles.includes(this.currentRole.roleCode)
      // if (isIn) {
      //   this.$message.error('This user has been added')
      // }
      this.selectMember = ''
      this.loading = true
      bindRoleSubjectLeader({
        bindFlag: 1,
        schoolId: this.currentSchool.id,
        subjectId: cls.subjectId,
        userId: user.uid
      })
        .then(res => {
          if (res.code === 0) {
            this.$message.success('Add user successfully')
            this.initSchoolUsers()
            this.debounceLoad()
            this.$store.dispatch('GetInfo')
            document.getElementById(`popover_${cls.id}`).click()
          } else {
            this.loading = false
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    formatViewName(id) {
      const findSubject = this.subjectOptions.find(subject => subject.subjectId === id)
      if (findSubject && this.curriculumOptions) {
        const cur = this.curriculumOptions.find(item => item.curriculumId === findSubject.curriculumId)
        if (cur) {
          return cur.curriculumName + '-'
        }
      }
      // const findGrade = this.gradeOptions.find(grade => grade.gradeId === id)
      // if (findGrade) return findGrade.gradeName
      return ''
    }
  }
}
</script>

<style scoped lang="less">
.role-con {
  height: 100%;
  position: relative;
}
.filter-tab {
  height: 40px;
  padding: 0 0px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.table-con {
  height: calc(100% - 40px);
  overflow: auto;
}
.close {
  position: absolute;
  right: -15px;
  top: -15px;
  cursor: pointer;
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
.user-name-email {
  display: flex;
  flex-direction: column;
  width: 200px;
  line-height: 24px;
  font-family: Inter-Bold;
  color: #000000;
  display: flex;
  align-items: flex-start;
  .email {
    padding-left: 10px;
    font-size: 12px;
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
.user-option {
  width: 150px;
}
.action-wrapper {
  flex: 1;
}
.search-popover {
  height: 300px;
  overflow: auto;
  /deep/ &.ant-popover {
    .ant-popover-inner {
      border: 1px solid #dfdfdf;
    }
  }
  .search-user {
    display: flex;
    padding: 5px;
    margin: 5p -16px;
    width: auto;
    align-items: center;
    &:hover {
      background: #dfdfdf;
    }
  }
}
.user-tag {
  width: 150px;
  display: flex;
  position: relative;
  margin-bottom: 5px;
  border: 1px solid #dfdfdf;
  padding: 5px;
  .avatar {
    width: 40px;
    height: 40px;
    margin-left: 5px;
    img {
      width: 40px;
      height: 40px;
      border-radius: 40px;
    }
  }
  .user-name-email {
    display: flex;
    flex-direction: column;
    width: 100px;
    .user-name {
      width: 100px;
      font-weight: bold;
      text-align: left;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    .email {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
    }
  }
  .user-opt {
    position: absolute;
    top: -10px;
    right: -5px;
    background: #fff;
  }
}
</style>
