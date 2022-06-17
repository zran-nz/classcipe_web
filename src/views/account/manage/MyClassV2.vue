<template>
  <div class='my-full-form-wrapper' id='formRoot'>
    <fixed-form-header>
      <template v-slot:header>
        <form-header
          title='School Class'
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
          <div
            v-for="(item,index) in tabsList"
            :key="'types'+index"
            :class="{'tab-item': true, 'active' : currentTab === item.value}"
            @click="toggleTab(item.value)">
            {{ item.title }}
          </div>
        </div>
        <div class="opt-list">
          <class-grade-sel v-if="currentTab === 'gradeId'" :grades="selectedGrades" @save="setGrades" :school="currentSchool"/>
          <template v-if="currentTab === 'subject'">
            <custom-text-button label='Add' @click="handleAddSubjectClass">
              <template v-slot:icon>
                <a-icon type='plus-circle' />
              </template>
            </custom-text-button>
            <class-subject-sel ref="classSubject" @save="addSubjectClass" :school="currentSchool"/>
          </template>
        </div>
      </div>
      <div class="form-tab">
        <a-spin :spinning="loading">
          <div class="list-view" v-if="allDatas[currentTab] && allDatas[currentTab].length > 0">
            <div class="list-view-item" v-for="(view, index) in allDatas[currentTab]" :key="view.id">
              <div class="view-item-title">
                <label for="">{{ view.name || formatViewName(view.id) }}</label>
                <a-space class="view-item-opt" v-if="currentTab === 'gradeId'">
                  <a-button type="primary" @click="addGradeClass(view)" icon="plus-circle">Add</a-button>
                  <a-button @click="deleteGrade(view, index)">Delete</a-button>
                </a-space>
              </div>
              <div class="view-item-con">
                <div
                  v-for="cls in view.classes"
                  :id="cls.key"
                  :key="view.id + '_' + cls.key"
                  :class="{'item-class-wrap': true, 'archive': currentTab === 'archive' }"
                >
                  <div class="item-class" v-clickOutside="() => handleBlurClick(cls)">
                    <div class="class-name">
                      <label @click="doEditClassName(cls)" v-if="!cls.isNew && !cls.isEdit" for="">{{ cls.name }}</label>
                      <a-input @keyup.enter="handleSaveClassName(cls)" :ref="'name'+cls.key" placeholder="Enter class name" v-if="cls.isNew || cls.isEdit" v-model="cls.changeName">
                        <a-icon slot="suffix" type="check" @click="handleSaveClassName(cls)"/>
                      </a-input>
                    </div>
                    <div :class="{'class-con': true, 'archive': currentTab === 'archive'}">
                      <div class="class-con-item">
                        <div class="con-item-label">Teachers</div>
                        <div class="con-item-detail" v-if="currentTab === 'archive'">{{ cls.teacherCount || 0 }}</div>
                        <a @click="handleEditTeachers(cls)" v-else for="">{{ cls.teacherCount || 0 }}</a>
                      </div>
                      <div class="class-con-item">
                        <div class="con-item-label">Students</div>
                        <div class="con-item-detail">
                          <label v-if="!cls.isNew && currentTab === 'archive'" for="">{{ cls.studentCount }}</label>
                          <a @click="handleEditStudents(cls)" v-if="!cls.isNew && currentTab !== 'archive'" for="">{{ cls.studentCount }}</a>
                          <a type="link" @click="handleEditStudents(cls)" v-if="cls.isNew">Upload</a>
                        </div>
                      </div>
                    </div>
                    <div class="class-opt" v-if="!cls.isNew">
                      <a-dropdown :getPopupContainer="trigger => trigger.parentElement">
                        <a-icon type="more" />
                        <a-menu slot="overlay">
                          <template v-if="currentTab !== 'archive'">
                            <a-menu-item>
                              <a href="javascript:;" @click="handleImport(cls)">Import students</a>
                            </a-menu-item>
                            <a-menu-item>
                              <a href="javascript:;" @click="handleEditTeachers(cls)">Edit teachers</a>
                            </a-menu-item>
                            <a-menu-item>
                              <a href="javascript:;" @click="handleArchive(cls)">Archive</a>
                            </a-menu-item>
                          </template>
                          <template v-else>
                            <a-menu-item>
                              <a href="javascript:;" @click="handleRestore(cls)">Restore</a>
                            </a-menu-item>
                            <a-menu-item>
                              <a href="javascript:;" @click="handleDelete(cls)">Delete</a>
                            </a-menu-item>
                          </template>
                        </a-menu>
                      </a-dropdown>
                    </div>
                    <div class="class-opt" style="font-size: 16px;" v-else>
                      <a-icon type="close" @click="handleRemove(view.id, cls)"></a-icon>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="no-subject">
            <img src='~@/assets/newBrowser/no-subject.png'/>
            <p>None class because you dont set the class</p>
          </div>
        </a-spin>
      </div>
    </div>
    <class-student-import ref="studentImport" @update="debounceLoad" :school="currentSchool"/>
    <class-member-list ref="memberList" @update="debounceLoad" :school="currentSchool"/>
    <class-restore-choose ref="restoreChoose" @save="doRestore" :chooseOptions="restoreChooseOptions"/>
  </div>
</template>

<script>
import { USER_MODE } from '@/const/common'
import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'

import FixedFormHeader from '@/components/Common/FixedFormHeader'
import FormHeader from '@/components/FormHeader/FormHeader'
import CustomTextButton from '@/components/Common/CustomTextButton'
import ClassGradeSel from './class/ClassGradeSel'
import ClassSubjectSel from './class/ClassSubjectSel'
import ClassStudentImport from './class/ClassStudentImport'
import ClassMemberList from './class/ClassMemberList'
import ClassRestoreChoose from './class/ClassRestoreChoose'

import { getCurriculumBySchoolId } from '@/api/academicSettingCurriculum'
import { getSubjectBySchoolId } from '@/api/academicSettingSubject'

import {
  listClass,
  saveClass,
  archiveClass,
  deleteClass,
  deleteGrade,
  restoreClass
} from '@/api/v2/schoolClass'

import { mapState } from 'vuex'
const { debounce, groupBy, uniqBy } = require('lodash-es')

export default {
  name: 'MyClassV2',
  mixins: [UserModeMixin, CurrentSchoolMixin],
  components: {
    FixedFormHeader,
    FormHeader,
    CustomTextButton,
    ClassGradeSel,
    ClassSubjectSel,
    ClassStudentImport,
    ClassMemberList,
    ClassRestoreChoose
  },
  data() {
    return {
      USER_MODE: USER_MODE,
      gradeOptions: [],
      subjectOptions: [],
      restoreChooseOptions: [],
      currentTab: 'gradeId',
      tabsList: [{
          value: 'gradeId',
          title: 'Standard'
      },
      {
          value: 'subject',
          title: 'Subject'
      }, {
          value: 'archive',
          title: 'Archive'
      }],
      loading: false,
      queryParams: {
        keywords: ''
      },
      datas: [],
      debounceInit: null,
      delLoading: false,
      selVis: false,
      gradeIdInfos: [], // 先创建grade再创建class
      subjectInfos: [], // 现创建class再按subject分类
      archiveInfos: [],
      allDatas: {
        gradeId: [],
        subject: [],
        archive: []
      },
      viewDatas: [],
      selectedGrades: []
    }
  },
  created() {
    this.initDict()
    this.loadData()
    this.debounceLoad = debounce(this.loadData, 300)
  },
  computed: {
    ...mapState({
      userMode: state => state.app.userMode,
      currentSchool: state => state.user.currentSchool
    })
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    handleSchoolChange(currentSchool) {
      if (this.userMode === USER_MODE.SCHOOL) {
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
      Promise.all([
        getSubjectBySchoolId({
          schoolId: this.currentSchool.id
        }),
        getCurriculumBySchoolId({
          schoolId: this.currentSchool.id
        })
      ]).then(([subjectRes, gradeRes]) => {
        if (subjectRes.success) {
          let subjects = []
          subjectRes.result.forEach(item => {
            if (item.subjectList && item.subjectList.length > 0) {
              subjects = subjects.concat(item.subjectList)
            }
          })
          this.subjectOptions = subjects
        }
        if (gradeRes.success) {
          let grades = []
          this.curriculumOptions = gradeRes.result.forEach(item => {
            grades = grades.concat(item.gradeSettingInfo || [])
          })
          this.gradeOptions = grades
        }
      }).finally(() => {
      })
    },
    // 先创建xxInfos,在创建class 才调用
    initView() {
      if (!this.allDatas[this.currentTab]) {
        this.allDatas[this.currentTab] = []
      }
      // 添加没有的
      this[this.currentTab + 'Infos'].forEach(info => {
        const isFind = this.allDatas[this.currentTab].find(item => item.id === info.id)
        if (!isFind) {
          const infoName = {}
          if (this.currentTab === 'gradeId') {
            infoName.gradeName = info.name
          } else {
            infoName.subjectName = info.name
          }
          this.allDatas[this.currentTab].push({
            ...info,
            classes: [{
              ...infoName,
              key: new Date().getTime() + Math.random(),
              isNew: true,
              isEdit: true,
              name: '',
              changeName: '',
              [this.currentTab]: info[this.currentTab],
              schoolId: this.currentSchool.id,
              classType: 0,
              teacherCount: 0,
              studentCount: 0
            }]
          })
        }
      })
      // 去除多余的
      for (let i = this.allDatas[this.currentTab].length - 1; i >= 0; i--) {
        const view = this.allDatas[this.currentTab][i]
        const isFind = this[this.currentTab + 'Infos'].find(info => info.id === view.id)
        if (!isFind) {
          this.allDatas[this.currentTab].splice(i, 1)
          // TODO 数据库是否删除
        }
      }
      console.log(this.allDatas[this.currentTab])
    },
    loadData() {
      const queryType = this.tabsList.findIndex(item => item.value === this.currentTab)
      this.loading = true
      listClass({
        queryType: queryType,
        pageNo: 1,
        pageSize: 10000,
        schoolId: this.currentSchool.id
      }).then(res => {
        if (res.success) {
          const groupKey = this.currentTab + 'Infos'
          // 按grade，subject组装 data
          const allDatas = res.result.records.map(item => {
            return {
              id: item.classType === 0 ? item.gradeId : item.subject,
              name: item.classType === 0 ? item.gradeName : item.subjectName,
              cls: {
                ...item
              }
            }
          })
          this[groupKey] = uniqBy(allDatas, 'id')
          const groupDatas = groupBy(allDatas, 'id')
          const currentDatas = []
          for (const key in groupDatas) {
            const viewName = groupDatas[key][0].name
            currentDatas.push({
              id: key,
              name: viewName,
              classes: groupDatas[key].map(item => ({
                ...item.cls,
                key: new Date().getTime() + Math.random(),
                isNew: false,
                isEdit: false,
                changeName: item.cls.name
              }))
            })
          }
          this.allDatas[this.currentTab] = currentDatas
          if (this.currentTab === 'gradeId') {
            this.selectedGrades = this.allDatas.gradeId.map(item => item.id)
          }
        }
      }).finally(() => {
        this.loading = false
      })
    },
    toggleTab(status) {
      this.currentTab = status
      this.debounceLoad()
    },
    handleBlurClick(cls) {
      cls.isEdit = false
      if (!cls.isNew) {
        cls.changeName = cls.name
      }
    },
    formatViewName(id) {
      const findSubject = this.subjectOptions.find(subject => subject.subjectId === id)
      if (findSubject) return findSubject.subjectName
      const findGrade = this.gradeOptions.find(grade => grade.gradeId === id)
      if (findGrade) return findGrade.gradeName
      return 'Untitle'
    },
    setGrades(val) {
      this.gradeIdInfos = val.map(item => ({
        ...item,
        id: item.gradeId,
        name: item.gradeName
      }))
      this.initView()
      this.selectedGrades = this.allDatas.gradeId.map(item => item.id)
      // 滚动到最后一个
      this.$nextTick(() => {
        let focusDom = null
        this.allDatas.gradeId.forEach(group => {
          const newAdd = group.classes.filter(item => item.isNew)
          if (newAdd && newAdd.length > 0) {
            focusDom = newAdd[newAdd.length - 1]
          }
        })
        document.getElementById(focusDom.key).scrollIntoView({ behavior: 'smooth' })
      })
    },
    addGradeClass(view) {
      view.classes.push({
        key: new Date().getTime() + Math.random(),
        isNew: true,
        isEdit: true,
        name: '',
        changeName: '',
        gradeId: view.id,
        gradeName: view.name,
        schoolId: this.currentSchool.id,
        classType: 0,
        teacherCount: 0,
        studentCount: 0
      })
    },
    doEditClassName(cls) {
      cls.isEdit = true
      this.$nextTick(() => {
        this.$refs['name' + cls.key][0].focus()
      })
    },
    handleSaveClassName(cls, cb) {
      if (!cls.changeName) {
        this.$message.error('Please input name')
        return
      }
      this.loading = true
      const params = { ...cls }
      params.name = params.changeName
      saveClass(params).then(res => {
        if (res.success && res.code === 0) {
          cls.name = cls.changeName
          cls.isNew = false
          cls.isEdit = false
          cls.id = res.result.id
          if (cb) {
            cb(cls.id)
          } else {
            this.$message.success('Save successfully')
          }
        }
      }).finally(() => {
        this.loading = false
      })
    },
    deleteGrade(view, index) {
      // 没有班级的直接删
      const classes = this.allDatas.gradeId[index].classes.filter(item => !!item.id)
      if (classes.length === 0) {
        this.allDatas.gradeId.splice(index, 1)
        this.selectedGrades = this.allDatas.gradeId.map(item => item.id)
        return
      }
      this.$confirm({
        title: 'Confirm delete grade',
        content: 'By deleting the grade/year, all classes belong to it will be removed. Do you confirm to delete? ',
        centered: true,
        onOk: () => {
          this.loading = true
          deleteGrade({
            ids: view.id,
            schoolId: this.currentSchool.id
          }).then(res => {
            if (res.success && res.code === 0) {
              this.allDatas.gradeId.splice(index, 1)
              this.selectedGrades = this.allDatas.gradeId.map(item => item.id)
            }
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    handleAddSubjectClass() {
      this.$refs.classSubject.doCreate({})
    },
    addSubjectClass(cls) {
      console.log(cls)
      this.loading = true
      saveClass(cls).then(res => {
        if (res.success && res.code === 0) {
          const subject = this.subjectInfos.find(item => item.id === cls.subject)
          if (!subject) {
            this.subjectInfos.push({
              id: cls.subject,
              name: cls.subjectName
            })
          }
          const findDatas = this.allDatas.subject.find(item => item.id === cls.subject)
          if (!findDatas) {
            this.allDatas.subject.push({
              id: cls.subject,
              name: cls.subjectName,
              classes: [{
                ...cls,
                key: new Date().getTime() + Math.random(),
                changeName: cls.name,
                isNew: false,
                isEdit: false
              }]
            })
          } else {
            findDatas.classes.push({
              ...cls,
              changeName: cls.name,
              key: new Date().getTime() + Math.random(),
              isNew: false,
              isEdit: false
            })
          }
        }
      }).finally(() => {
        this.loading = false
      })
    },
    handleImport(cls) {
      this.$refs.studentImport.doCreate({
        classId: cls.id,
        className: cls.name,
        type: this.currentTab
      })
    },
    handleEditStudents(cls) {
      if (!cls.id) {
        this.handleSaveClassName(cls, classId => {
          this.$refs.memberList.doCreate({
            classId: classId,
            role: 'student'
          })
        })
      } else {
        this.$refs.memberList.doCreate({
          classId: cls.id,
          role: 'student'
        })
      }
    },
    handleEditTeachers(cls) {
      if (!cls.id) {
        this.handleSaveClassName(cls, classId => {
          this.$refs.memberList.doCreate({
            classId: classId,
            role: 'teacher'
          })
        })
      } else {
        this.$refs.memberList.doCreate({
          classId: cls.id,
          role: 'teacher'
        })
      }
    },
    handleArchive(cls) {
      this.$confirm({
        title: 'Confirm archive class ' + cls.name,
        content: 'Are you sure you want to archive this class?',
        centered: true,
        onOk: () => {
          this.loading = true
          archiveClass({
            ids: cls.id
          }).then(res => {
            if (res.success && res.code === 0) {
              this.$message.success('Archive successfully')
              const group = this.allDatas[this.currentTab].find(item => item.id === cls[this.currentTab])
              if (group && group.classes) {
                if (group.classes.length > 1) {
                  const index = group.classes.findIndex(item => item.id === cls.id)
                  group.classes.splice(index, 1)
                } else {
                  // group.classes = []
                  const groupIndex = this.allDatas[this.currentTab].findIndex(item => item.id === cls[this.currentTab])
                  this.allDatas[this.currentTab].splice(groupIndex, 1)
                  this.selectedGrades = this.allDatas.gradeId.map(item => item.id)
                }
              }
            }
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    handleRestore(cls) {
      // 如果之前的grade，subject现在不存在了，需要重新选择
      if (cls.classType === 0) {
        const isExist = this.gradeOptions.find(item => item.gradeId === cls.gradeId)
        if (!isExist) {
          this.restoreChooseOptions = this.gradeOptions.map(item => ({
            ...item,
            id: item.gradeId,
            name: item.gradeName
          }))
          this.$refs.restoreChoose.doCreate(cls)
          return
        }
      } else if (cls.classType === 1) {
        const isExist = this.subjectOptions.find(item => item.subjectId === cls.subject)
        if (!isExist) {
          this.restoreChooseOptions = this.subjectOptions.map(item => ({
            ...item,
            id: item.subjectId,
            name: item.subjectName
          }))
          this.$refs.restoreChoose.doCreate(cls)
          return
        }
      }
      this.doRestore(cls)
    },
    doRestore(cls) {
      this.loading = true
      restoreClass({
        ids: cls.id
      }).then(res => {
        if (res.success && res.code === 0) {
          this.$message.success('Restore successfully')
          this.debounceLoad()
        } else {
          this.loading = false
        }
      }).finally(() => {
      })
    },
    handleRemove(viewId, cls) {
      // 移除没有保存的数据
      const view = this.allDatas[this.currentTab].find(item => item.id === viewId)
      const index = view.classes.findIndex(item => item.key === cls.key)
      view.classes.splice(index, 1)
      if (view.classes.length === 0) {
        const groupIndex = this.allDatas[this.currentTab].findIndex(item => item.id === viewId)
        this.allDatas[this.currentTab].splice(groupIndex, 1)
        this.selectedGrades = this.allDatas.gradeId.map(item => item.id)
      }
    },
    handleDelete(cls) {
      this.$confirm({
        title: 'Confirm delete class',
        content: `Do you confirm to delete class [ ${cls.name} ]? `,
        centered: true,
        onOk: () => {
          this.loading = true
          deleteClass({
            ids: cls.id
          }).then(res => {
            if (res.code === 0) {
              this.$message.success('Delete successfully')
              this.debounceLoad()
            } else {
              this.loading = false
            }
          }).finally(() => {
            // this.loading = false
          })
        }
      })
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
.form-tab {
  height: calc(100% - 60px);
  padding: 0 20px;
  overflow: auto;
}
.no-subject {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
  width: 400px;
  img {
    width: 400px;
    height: 400px;
  }
  p {
    font-size: 14px;
    font-family: Leelawadee UI;
    font-weight: bold;
    color: #070707;
    opacity: 1;
    text-align: center;
  }
}
.list-view {
  display: flex;
  flex-direction: column;
  padding: 20px;
  .list-view-item {
    margin-top: 20px;
    .view-item-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      label {
        font-weight: bold;
        font-size: 16px;
        line-height: 30px;
      }
    }
    .view-item-con {
      display: flex;
      flex-wrap: wrap;
      margin-left: -10px;
      margin-right: -10px;
      &::after {
        content: '';
        flex-grow: 999;
      }
      .item-class-wrap {
        width: 25%;
        flex-grow: 1;
        padding: 10px;
        &.archive {
          .item-class {
            .class-name {
              border-color: transparent!important;
            }
          }
        }
        .item-class {
          padding: 20px;
          background: #FFFFFF;
          border: 1px solid #CED7E5;
          border-radius: 5px;
          height: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
          .class-name {
            margin-bottom: 20px;
            height: 32px;
            border: 1px solid transparent;
            label {
              font-weight: bold;
              font-size: 14px;
              display: inline-block;
              line-height: 30px;
              width: 100%;
              cursor: pointer;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
          .class-con {
            display: flex;
            .class-con-item {
              flex: 1;
              display: flex;
              flex-direction: column;
              background: #EAEFF7;
              align-items: center;
              text-align: center;
              justify-content: space-between;
              padding: 15px 0;
              & ~ .class-con-item {
                margin-left: 20px;;
              }
            }
            &.archive {
              .class-con-item {
                background: #898A8D!important;
                color: #fff!important;
              }
            }
          }
          .class-opt {
            position: absolute;
            cursor: pointer;
            top: 0;
            right: 0;
            font-size: 20px;
            display: none;
            i {
              color: #9AA4B3;
            }
          }
          &:hover {
            .class-name {
              border: 1px solid #dfdfdf;
            }
            .class-con {
              .class-con-item {
                background: #627BD6;
                color: #fff;
              }
            }
            .class-opt {
              display: block;
            }
          }
        }
      }
    }
  }
}
</style>
