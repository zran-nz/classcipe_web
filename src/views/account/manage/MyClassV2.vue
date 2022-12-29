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
          <template v-slot:back>
            <img @click.stop="openV2('/v2/')" src="~@/assets/logo/50.png" class='single-logo-img' alt='classcipe' />
          </template>
          <template v-slot:left>
            <a-space :size="5" align="center" @click.stop>
              <label style="cursor: pointer" @click="openV2('/v2/account/info')">Account Info</label>
              <label for="">></label>
              <label style="font-weight: normal">{{ userMode === USER_MODE.SELF ? 'Personal' : 'School' }} Class</label>
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
          <div
            v-for="(item,index) in tabsList"
            :key="'types'+index"
            :class="{'tab-item': true, 'active' : currentTab === item.value}"
            @click="toggleTab(item.value)">
            {{ item.title }}
          </div>
        </div>
        <guide-content
          guideKey="addGrade"
          beginKey="addGrade"
        >
          <div slot="content" class="opt-list">
            <a-button type="primary" v-if="currentTab === 'gradeId'" @click="$store.dispatch('setV2Box', { path: `/setting/grade/${currentSchool.id}`, query: { header: 0 } })">Set grade(s)</a-button>
            <a-row v-if="currentTab === 'subject'" type="flex">
              <a-space>
                <a-button type="primary" v-if="currentTab === 'subject'" @click="goCurriculum">Set curriculum</a-button>
              </a-space>
            </a-row>
          </div>
        </guide-content>
      </div>

      <!-- TODO 962 -->
      <div v-if="currentTab === 'subject'" style="padding: 6px 20px;">
        <a-radio-group v-model="currentSchoolCurriculum">
          <a-radio-button v-for="curriculum in schoolCurriculumOptions.curriculum" :key="curriculum" :value="curriculum">{{ getCurriculumNameByCode(curriculum) }}</a-radio-button>
        </a-radio-group>
      </div>

      <div style="padding: 1px 20px;" v-if="currentTab === 'subject'">
        <a-button type="primary" @click="goAcademic" style="align-self: 'flex-start'" :disabled="!schoolCurriculumOptions.curriculum.length">Set term(s)</a-button>
      </div>

      <div class="form-tab">
        <a-spin :spinning="loading">
          <div class="list-view" v-if="allDatas[currentTab] && allDatas[currentTab].length > 0">
            <template v-for="(parentView, parentIndex) in allDatas[currentTab]">
              <div class="list-view-item" :key="parentView.parentId">
                <a-space v-if="currentTab === 'subject'" style="margin-bottom: 20px;">
                  <label for="" class="view-item-parent" >
                    {{ parentView.parentName }}
                    <span v-if="currentTab === 'subject'">( {{ parentView.rangeTime }} )</span>
                  </label>
                  <a-space slot="content" class="view-item-opt" v-if="currentTab === 'subject'">
                    <a-button type="primary" v-if="isNotLimit" @click="handleAddSubjectClass(parentView)">Add Class</a-button>
                    <a-popover v-else title="Upgrading reminder" trigger="click">
                      <div style="width: 300px;" slot="content">Your class number has reached the limmit, please upgrade your plan to add more class</div>
                      <a-button type="primary">Add Class</a-button>
                    </a-popover>
                  </a-space>
                  <!-- </guide-content> -->
                </a-space>
                <!-- <div class="view-item-parent-content" v-for="(view, viewIndex) in parentView.cls" :key="view.parentId"> -->
                <div
                  class="view-item-parent-content"
                  :key="viewIndex"
                  v-for="(view, viewIndex) in currentTab === 'subject' ? parentView.cls : [...gradeList, { _id: 'ungraded', name: 'Ungraded classes' }]">
                  <div class="view-item-title">
                    <label for="">{{ view.name || formatViewName(view.id) }}</label>
                    <guide-content
                      :guideKey="(parentIndex === 0 && viewIndex === 0) ? 'addStandardClass' : ''"
                      beginKey="addGrade"
                    >
                      <a-space slot="content" class="view-item-opt" v-if="currentTab === 'gradeId' && view._id !== 'ungraded'">
                        <a-button type="primary" v-if="isNotLimit" @click="addGradeClass(view)">Add Class</a-button>
                        <a-popover v-else title="Upgrading reminder" trigger="click">
                          <div style="width: 300px;" slot="content">Your class number has reached the limmit, please upgrade your plan to add more class</div>
                          <a-button type="primary">Add Class</a-button>
                        </a-popover>
                      </a-space>
                    </guide-content>
                  </div>
                  <div>
                    <draggable
                      filter='.undrag'
                      class="view-item-con"
                      animation="300"
                      :list="currentTab === 'subject' ? view.classes : classGroupList[view._id]"
                      @change="(params) => changeClass(params, view.id || view._id, view.name)"
                      :sort='false'
                      group="item-class"
                    >
                      <div
                        :id="`grade_${ci}`"
                        v-for="(cls, ci) in currentTab === 'subject' ? view.classes : classGroupList[view._id]"
                        :key="ci"
                        :class="{'item-class-wrap': true, 'archive': currentTab === 'archive', 'undrag': (currentTab !== 'gradeId' || cls.isNew) }"
                      >
                        <div class="item-class" v-clickOutside="() => handleBlurClick(cls)">
                          <div class="class-name">
                            <label @click="doEditClassName(cls)" v-if="!cls.isNew && !cls.isEdit" for="">{{ cls.name }}</label>
                            <a-input
                              @click.stop.prevent="doFocus"
                              @keyup.enter="handleSaveClassName(cls)"
                              :ref="'name'+cls.key"
                              placeholder="Enter class name"
                              v-if="cls.isNew || cls.isEdit"
                              v-model="cls.changeName">
                              <a-icon slot="suffix" type="check" @click="handleSaveClassName(cls)"/>
                            </a-input>
                          </div>
                          <div :class="{'class-con': true, 'archive': currentTab === 'archive'}">
                            <div v-if="userMode !== USER_MODE.SELF" :class="{'class-con-item': true, 'pointer': currentTab !== 'archive' && userMode !== USER_MODE.SELF}" @click="handleEditTeachers(cls)">
                              <div class="con-item-label">Teachers</div>
                              <div class="con-item-detail" v-if="currentTab === 'archive' || userMode === USER_MODE.SELF">{{ cls.teacherCount || 0 }}</div>
                              <a v-else for="">{{ cls.teacherCount || 0 }}</a>
                            </div>
                            <div :class="{'class-con-item': true, 'pointer': currentTab !== 'archive'}" @click="handleEditStudents(cls)">
                              <div class="con-item-label">Students</div>
                              <div class="con-item-detail">
                                <label v-if="currentTab === 'archive'" for="">{{ cls.realStudentCount }}</label>
                                <a v-if="!cls.isNew && currentTab !== 'archive'" for="">{{ cls.realStudentCount }}</a>
                                <a type="link" v-if="cls.isNew">Upload</a>
                              </div>
                            </div>
                          </div>
                          <div class="class-opt" v-if="!cls.isNew">
                            <a-dropdown :getPopupContainer="trigger => trigger.parentElement" v-if="!(userMode === USER_MODE.SELF && isLastClass)">
                              <a-icon type="more" />
                              <a-menu slot="overlay">
                                <template v-if="currentTab !== 'archive'">
                                  <a-menu-item v-if="userMode === USER_MODE.SCHOOL && cls.classType === 1">
                                    <a @click="handleEditSubjectClass(cls)">Edit</a>
                                  </a-menu-item>
                                </template>
                                <a-menu-item v-else>
                                  <a @click="handleRestore(cls)">Restore</a>
                                </a-menu-item>
                                <a-menu-item>
                                  <a v-if="currentTab === 'archive' || cls.classType === 1" @click="handleDelete(cls)">Delete</a>
                                  <a v-else @click="handleArchive(cls)">Archive</a>
                                </a-menu-item>
                              </a-menu>
                            </a-dropdown>
                          </div>
                          <div class="class-opt" style="font-size: 16px;" v-else>
                            <a-dropdown :getPopupContainer="trigger => trigger.parentElement">
                              <a-icon type="more" />
                              <a-menu slot="overlay">
                                <a-menu-item>
                                  <a @click="handleRemove(parentView.parentId, view.id || view._id, cls)">Delete</a>
                                </a-menu-item>
                              </a-menu>
                            </a-dropdown>
                          </div>
                        </div>
                      </div>
                    </draggable>
                  </div>
                </div>
              </div>
            </template>
          </div>
          <div v-else class="no-subject">
            <img src='~@/assets/newBrowser/no-subject.png'/>
            <p>There is no class created yet</p>
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
import draggable from 'vuedraggable'

import { USER_MODE } from '@/const/common'
import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'
import { GuideMixin } from '@/mixins/GuideMixin'

import FixedFormHeader from '@/components/Common/FixedFormHeader'
import FormHeader from '@/components/FormHeader/FormHeader'
import CustomTextButton from '@/components/Common/CustomTextButton'
import GuideContent from '@/components/GuideContent'
import ClassGradeSel from './class/ClassGradeSel'
import ClassStudentImport from './class/ClassStudentImport'
import ClassMemberList from './class/ClassMemberList'
import ClassRestoreChoose from './class/ClassRestoreChoose'

import { getCurriculumBySchoolId } from '@/api/academicSettingCurriculum'
import { getSubjectBySchoolId } from '@/api/academicSettingSubject'
import { termList } from '@/api/academicTermInfo'

import {
  listClass,
  saveClass,
  archiveClass,
  deleteClass,
  restoreClass
} from '@/api/v2/schoolClass'

import { mapState } from 'vuex'
import moment from 'moment'
const { debounce, groupBy } = require('lodash-es')

export default {
  name: 'MyClassV2',
  mixins: [UserModeMixin, CurrentSchoolMixin, GuideMixin],
  components: {
    FixedFormHeader,
    FormHeader,
    CustomTextButton,
    ClassGradeSel,
    ClassStudentImport,
    ClassMemberList,
    ClassRestoreChoose,
    draggable,
    GuideContent
  },
  data() {
    return {
      USER_MODE: USER_MODE,
      gradeOptions: [],
      subjectOptions: [],
      yearsOptions: [],
      termsOptions: [],
      schoolCurriculumOptions: {},
      currentSchoolCurriculum: '',
      restoreChooseOptions: [],
      currentTab: 'gradeId',
      gradeList: [],
      classList: [],
      ungradedList: [],
      schoolCurriculumList: [],
      classGroupList: {},
      loading: false,
      queryParams: {
        keywords: ''
      },
      datas: [],
      debounceLoad: null,
      delLoading: false,
      selVis: false,
      archiveInfos: [],
      curriculumOptions: [],
      currentCurriculum: '',
      totalClass: [],
      allDatas: {
        gradeId: [{}],
        subject: [],
        archive: [{}]
      },
      viewDatas: [],
      selectedGrades: []
    }
  },
  created() {
    if (this.$route.query) {
      if (this.$route.query.tab) {
        const find = this.tabsList.find(item => item.value + '' === this.$route.query.tab + '')
        if (find) {
          this.currentTab = find.value
        }
      }
    }
    this.initDict()
    window._classInitDict = this.initDict
    this.debounceLoad = debounce(this.initDict, 300)
  },
  computed: {
    ...mapState({
      info: state => state.user.info,
      userMode: state => state.app.userMode,
      currentSchool: state => state.user.currentSchool
    }),
    isNotLimit() {
      if (this.info && this.info.planInfo) {
        return !this.isSelfFreePlan && this.info.planInfo['classCount'] > this.totalClassActive.length
      } else {
        return false
      }
    },
    isSelfFreePlan() {
      if (this.userMode === USER_MODE.SELF) {
        if (this.info && this.info.planInfo && this.info.planInfo.freeUsePlan) {
          return true
        }
      }
      return false
    },
    tabsList() {
      return [{
          value: 'gradeId',
          title: 'Standard',
          index: 0
      },
      ...this.userMode === USER_MODE.SCHOOL ? [{
          value: 'subject',
          title: 'Subject',
          index: 1
      }] : [],
      {
          value: 'archive',
          title: 'Archive',
          index: 2
      }]
    },
    totalClassActive() {
      return this.totalClass.filter(item => item.status !== 2)
    },
    isLastClass() {
      const subjectLen = this.allDatas['subject'].map(item => {
        let len = 0
        item.cls.forEach(cls => {
          len += cls.classes.filter(cls => !cls.isNew).length
        })
        return len
      })
      let len = this.classList.length
      subjectLen.forEach(item => {
        len += item
      })
      if (len === 1) {
        return true
      }
      return false
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    handleSchoolChange(currentSchool) {
      if (this.userMode === USER_MODE.SCHOOL) {
        this.initDict()
      }
    },
    handleModeChange(userMode) {
      // 模式切换，个人还是学校 个人接口
      this.initDict()
    },
    doFocus(e) {
      e.target.focus()
    },
    getClassList(grade) {
      return this.classList.filter(v => {
        return v.gradeId === grade._id
      })
    },
    async initDict() {
      this.loading = true
      if (this.currentTab !== 'subject') {
        this.allDatas.gradeId = [{}]
        this.allDatas.archive = [{}]
        const query = { key: 'Grades', rid: this.currentSchool.id }
        console.log(query, 1111)
        const rs = this.currentSchool.id === '0' ? await App.service('conf-user').get('Grades') : await App.service('conf-school').get('get', { query })
        this.gradeList = rs?.val ?? []
        const { result } = await listClass({
          schoolId: this.currentSchool.id,
          queryType: this.currentTab === 'archive' ? 2 : '',
          pageNo: 1,
          pageSize: 10000
        })
        this.classList = result.records
        const ungraded = []
        this.classGroupList = {}
        this.gradeList.map(v => {
          this.classGroupList[v._id] = []
        })
        this.classList.map(cls => {
          const v = {
            ...cls,
            key: new Date().getTime() + Math.random(),
            isNew: false,
            isEdit: false,
            changeName: cls.name
          }
          if (this.currentTab === 'gradeId' && v.term) return console.log(v.name, 'is subject class', v.term) // subject class
          if (this.classGroupList[v.gradeId]) this.classGroupList[v.gradeId].push(v)
          else ungraded.push(v)
          console.log(this.classGroupList[v.gradeId], v.gradeId, v.name)
        })
        this.classGroupList.ungraded = ungraded
        console.log(11111111, rs?.val, this.classList, this.classGroupList)
        this.loading = false
        return
      }
      Promise.all([
        getSubjectBySchoolId({
          schoolId: this.currentSchool.id
        }),
        getCurriculumBySchoolId({
          schoolId: this.currentSchool.id
        }),
        termList({
          schoolId: this.currentSchool.id
        }),
        listClass({
          schoolId: this.currentSchool.id,
          queryType: this.currentTab === 'archive' ? 2 : '',
          pageNo: 1,
          pageSize: 10000
        }),
        await App.service('conf-school').get('get', { query: { key: 'Curriculum', rid: this.currentSchool.id } }),
        await App.service('curriculum').get('pubList')
      ]).then(([subjectRes, gradeRes, termRes, clsRes, schoolCurriculumRes, schoolCurriculumListRes]) => {
        console.warn(subjectRes, gradeRes, termRes, clsRes)
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
        if (gradeRes.success && gradeRes.result) {
          let grades = []
          this.curriculumOptions = gradeRes.result
          gradeRes.result.forEach(item => {
            grades = grades.concat((item.gradeSettingInfo || []).map(grade => ({
              ...grade,
              curriculumId: item.curriculumId
            })))
          })
          this.gradeOptions = grades
          if (!this.currentCurriculum && this.curriculumOptions.length > 0) {
            this.currentCurriculum = this.curriculumOptions[0].curriculumId
          }
        }
        if (termRes.success) {
          this.yearsOptions = termRes.result
          let termsOptions = []
          termRes.result.forEach(year => {
            termsOptions = termsOptions.concat(year.terms)
          })
          this.termsOptions = termsOptions
        }
        if (clsRes.success && clsRes.result) {
          this.totalClass = clsRes.result.records
          this.loadData()
        }
        if (schoolCurriculumRes) {
          this.schoolCurriculumOptions = schoolCurriculumRes.val
          if (this.schoolCurriculumOptions.curriculum && this.schoolCurriculumOptions.curriculum.length) {
            this.currentSchoolCurriculum = this.schoolCurriculumOptions.curriculum[0]
          }
        }
        if (schoolCurriculumListRes) {
          this.schoolCurriculumList = schoolCurriculumListRes
        }
      }).finally(() => {
        this.initGuide()
        this.loading = false
      })
    },
    loadData() {
      this.loading = true
      if (this.termsOptions.length > 0) {
        //  && this.totalClassActive.length > 0
        // 学科班
        const totalSubjectClass = this.totalClassActive.filter(item => item.classType === 1)
        const gradeClass = this.termsOptions.map(item => {
          const parentJson = {
            parentId: item.id,
            parentName: item.name,
            startTime: item.startTime,
            endTIme: item.endTime,
            rangeTime: moment.utc(item.startTime).local().format('YYYY.MM.DD') + '-' + moment.utc(item.endTime).local().format('YYYY.MM.DD'),
            cls: []
          }
          const classes = totalSubjectClass.filter(cls => cls.term === item.id)
          if (classes.length > 0) {
            // 按学科分类
            const groupDatas = groupBy(classes, 'subject')
            const currentDatas = []
            for (const key in groupDatas) {
              const subject = this.subjectOptions.find(sub => sub.subjectId === key)
              if (subject) {
                currentDatas.push({
                  id: key,
                  name: subject.subjectName,
                  curriculumId: subject.curriculumId,
                  classes: groupDatas[key].map(item => ({
                    ...item,
                    key: new Date().getTime() + Math.random(),
                    isNew: false,
                    isEdit: false,
                    changeName: item.name
                  }))
                })
              }
            }
            parentJson.cls = currentDatas
          }
          return parentJson
        })
        this.allDatas.subject = gradeClass
      } else {
        this.allDatas.subject = []
      }

      this.loading = false
    },
    toggleTab(status) {
      this.currentTab = status
      this.$router.replace({
        path: '/manage/class?tab=' + this.currentTab
      })
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
    addGradeClass(view) {
      const post = {
        key: new Date().getTime() + Math.random(),
        isNew: true,
isEdit: true,
        name: '',
changeName: '',
        gradeId: view.id || view._id,
gradeName: view.name,
        schoolId: this.currentSchool.id,
        classType: 0,
teacherCount: 0,
studentCount: 0
      }
      // 只允许一个未创建
      let existsNew = false
      for (const _id of Object.keys(this.classGroupList)) {
        this.classGroupList[_id].map(v => {
          if (v.isNew) existsNew = true
        })
      }
      console.log(this.classGroupList)
      if (existsNew) return this.$message.error('Please save first')
      this.classGroupList[view._id].push(post)
      this.$forceUpdate()
      console.log(this.classGroupList[view._id])
    },
    doEditClassName(cls) {
      if (cls.status !== 2) {
        cls.isEdit = true
        this.$forceUpdate()
        this.$nextTick(() => {
          this.$refs['name' + cls.key][0].focus()
        })
      }
    },
    handleSaveClassName(cls, cb) {
      if (!cls.changeName) {
        this.$message.error('Please input name')
        return
      }
      const params = { ...cls }
      params.name = params.changeName
      if (this.userMode === USER_MODE.SELF) {
        params.userId = this.info.id
        params.classMode = 2
      } else {
        params.classMode = 1
      }
      this.loading = true
      saveClass(params).then(res => {
        if (res.success && res.code === 0) {
          cls.name = cls.changeName
          cls.isNew = false
          cls.isEdit = false
          cls.id = res.result.id
          this.totalClass.push(cls)
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
    handleAddSubjectClass(parent) {
      this.$router.push({
        path: '/manage/class/subject/?termId=' + parent.parentId + '&curriculumId=' + this.currentCurriculum
      })
    },
    handleEditSubjectClass(cls) {
      this.$router.push({
        path: '/manage/class/subject/' + cls.id
      })
    },
    handleImport(cls) {
      if (this.userMode === USER_MODE.SELF) return
      this.$refs.studentImport.doCreate({
        classId: cls.id,
        className: cls.name,
        type: this.currentTab
      })
    },
    handleEditStudents(cls) {
      if (this.userMode === USER_MODE.SELF) return
      if (this.currentTab === 'archive') {
        return
      }
      const path = cls.classType === 0 ? '/manage/student/list?classId=' : '/manage/student/subject/'
      if (!cls.id) {
        this.handleSaveClassName(cls, classId => {
          this.$router.push(path + classId)
        })
      } else {
        this.$router.push(path + cls.id)
      }
    },
    handleEditTeachers(cls) {
      if (this.currentTab === 'archive' || this.userMode === USER_MODE.SELF) {
        return
      }
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
      console.log(cls)
      const clsLen = this.allDatas[this.currentTab].map(item => {
        let len = 0
        if (!item.cls) return len
        item.cls.forEach(cls => {
          len += cls.classes.length
        })
        return len
      })
      let len = 0
      clsLen.forEach(item => {
        len += item
      })
      if (this.userMode === USER_MODE.SELF && len === 1) {
        this.$message.error('You must keep a class')
        return
      }
      const msg = cls.classType === 0 ? 'The students of this class will also be archived once this class is archived, please switch the students to other standard class if you want to keep them' : 'Are you sure you want to archive this class?'
      this.$confirm({
        title: 'Confirm archive class ' + cls.name,
        content: msg,
        centered: true,
        onOk: () => {
          this.loading = true
          archiveClass({
            ids: cls.id
          }).then(res => {
            if (res.success && res.code === 0) {
              this.$store.dispatch('GetInfo')
              this.debounceLoad()
              this.$message.success('Archive successfully')
            }
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    handleRestore(cls) {
      this.doRestore(cls)
    },
    doRestore(cls) {
      this.$confirm({
        title: 'Confirm restore class ' + cls.name,
        content: 'Do you want to restore class ' + cls.name,
        centered: true,
        onOk: () => {
          this.loading = true
          restoreClass({
            classId: cls.id,
            ...cls
          }).then(res => {
            if (res.success && res.code === 0) {
              this.$message.success('Restore successfully')
              this.$store.dispatch('GetInfo')
              this.debounceLoad()
            } else {
              this.loading = false
            }
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    handleRemove(parentId, viewId, cls) {
      // // 移除没有保存的数据
      this.classGroupList[viewId].map((v, i) => {
        if (v.key !== cls.key) return
        this.classGroupList[viewId].splice(i, 1)
      })
      this.$forceUpdate()
      console.log(parentId, viewId, cls, this.classGroupList[viewId])
      // this.loadData()
    },
    handleDelete(cls) {
      console.log('delete', cls)
      if (cls.classType === 0) {
        this.$confirm({
          title: 'Confirm delete class',
          content: `Students in the class will be removed, Do you confirm to delete class [ ${cls.name} ]?`,
          centered: true,
          onOk: () => {
            this.loading = true
            deleteClass({
              ids: cls.id
            }).then(res => {
              if (res.code === 0) {
                this.$message.success('Delete successfully')
                this.$store.dispatch('GetInfo')
                this.debounceLoad()
              } else {
                this.loading = false
              }
            }).finally(() => {
              // this.loading = false
            })
          }
        })
      } else {
        this.loading = true
        deleteClass({
          ids: cls.id
        }).then(res => {
          if (res.code === 0) {
            this.$message.success('Delete successfully')
            this.$store.dispatch('GetInfo')
            this.debounceLoad()
          } else {
            this.loading = false
          }
        }).finally(() => {
          // this.loading = false
        })
      }
    },
    changeClass(val, groupId, groupName) {
      console.log(val)
      console.log(groupId)
      // 只处理added，直接按修改进行
      if (val.added) {
        const params = val.added.element
        if (this.currentTab === 'gradeId') {
          params.gradeId = groupId
          params.gradeName = groupName
        } else if (this.currentTab === 'subject') {
          params.subject = groupId
          params.subjectName = groupName
        }
        this.loading = true
        params.name = params.changeName || params.name
        if (this.userMode === USER_MODE.SELF) {
          params.userId = this.info.id
          params.classMode = 2
        } else {
          params.classMode = 1
        }
        saveClass(params).then(res => {
          if (res.success && res.code === 0) {
            this.$message.success('Save successfully')
          }
        }).finally(() => {
          this.loading = false
        })
      }
    },
    goAcademic() {
      this.$router.push('/manage/academic')
    },
    goCurriculum() {
      this.openV2('/v2/account/curriculum/my')
    },
    getCurriculumNameByCode (code) {
      const current = this.schoolCurriculumList.find((e) => e.code === code)
      if (current) {
        return current.name
      }
      return ''
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
.curiculum-tab {
  padding: 20px 40px;
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
    margin-top: 0px;
    .view-item-parent {
      font-size: 18px;
      font-weight: bold;
    }
    .view-item-parent-content {
      margin-bottom: 20px;
    }
    .view-item-title {
      display: flex;
      align-items: center;
      // justify-content: space-between;
      label {
        margin-right: 20px;
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
              &.pointer {
                cursor: pointer;
              }
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
            .class-opt {
              display: block;
            }
          }
          .class-con {
            .class-con-item {
              &:hover {
                background: #627BD6;
                color: #fff;
              }
            }
          }
        }
      }
    }
  }
}
</style>
