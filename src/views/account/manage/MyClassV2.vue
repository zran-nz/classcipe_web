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
        <div class="list-view" v-if="allDatas[currentTab] && allDatas[currentTab].length > 0">
          <div class="list-view-item" v-for="(view, index) in allDatas[currentTab]" :key="view.gradeId">
            <div class="view-item-title">
              <label for="">{{ view.gradeName || view.subjectName }}</label>
              <a-space class="view-item-opt" v-if="currentTab === 'gradeId'">
                <a-button type="primary" @click="addGradeClass(view)" icon="plus-circle">Add</a-button>
                <a-button @click="deleteGrade(view, index)">Delete</a-button>
              </a-space>
            </div>
            <div class="view-item-con">
              <div
                v-for="cls in view.classes"
                :key="view.gradeId + '_' + cls.key"
                class="item-class-wrap"
              >
                <div class="item-class" v-clickOutside="() => handleBlurClick(cls)">
                  <div class="class-name">
                    <label @click="doEditClassName(cls)" v-if="!cls.isNew && !cls.isEdit" for="">{{ cls.name }}</label>
                    <a-input @keyup.enter="handleSaveClassName(cls)" :ref="'name'+cls.key" placeholder="Enter class name" v-if="cls.isNew || cls.isEdit" v-model="cls.changeName">
                      <a-icon slot="suffix" type="check" @click="handleSaveClassName(cls)"/>
                    </a-input>
                  </div>
                  <div class="class-con">
                    <div class="class-con-item">
                      <div class="con-item-label">Teachers</div>
                      <div class="con-item-detail">{{ cls.teacherCount }}</div>
                    </div>
                    <div class="class-con-item">
                      <div class="con-item-label">Students</div>
                      <div class="con-item-detail">
                        <a @click="handleEditStudents(cls)" v-if="!cls.isNew" for="">{{ cls.studentCount }}</a>
                        <a type="link" @click="handleEditStudents(cls)" v-else>Upload</a>
                      </div>
                    </div>
                  </div>
                  <div class="class-opt" v-if="!cls.isNew">
                    <a-dropdown :getPopupContainer="trigger => trigger.parentElement">
                      <a-icon type="more" />
                      <a-menu slot="overlay">
                        <a-menu-item>
                          <a href="javascript:;" @click="handleImport(cls)">Import students</a>
                        </a-menu-item>
                        <a-menu-item>
                          <a href="javascript:;" @click="handleEditTeachers(cls)">Edit teachers</a>
                        </a-menu-item>
                        <a-menu-item>
                          <a href="javascript:;">Archive</a>
                        </a-menu-item>
                      </a-menu>
                    </a-dropdown>
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
      </div>
    </div>
    <class-student-import ref="studentImport" :school="currentSchool"/>
    <class-member-list ref="memberList" :school="currentSchool"/>
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

import { mapState } from 'vuex'
const { debounce } = require('lodash-es')

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
    ClassMemberList
  },
  data() {
    return {
      USER_MODE: USER_MODE,
      currentTab: 'gradeId',
      tabsList: [{
          value: 'gradeId',
          title: 'Standard'
      },
      {
          value: 'subject',
          title: 'Subject'
      }, {
          value: 'Archive',
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
      allDatas: {
        gradeId: [],
        subject: []
      },
      viewDatas: [],
      selectedGrades: []
    }
  },
  created() {
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
        this.debounceInit()
      }
    },
    handleModeChange(userMode) {
      // 模式切换，个人还是学校 个人接口
      this.debounceInit()
    },
    // 先创建xxInfos,在创建class 才调用
    initView() {
      if (!this.allDatas[this.currentTab]) {
        this.allDatas[this.currentTab] = []
      }
      // 添加没有的
      this[this.currentTab + 'Infos'].forEach(info => {
        const isFind = this.allDatas[this.currentTab].find(item => item[this.currentTab] === info[this.currentTab])
        if (!isFind) {
          this.allDatas[this.currentTab].push({
            ...info,
            classes: [{
              key: new Date().getTime(),
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
        const isFind = this[this.currentTab + 'Infos'].find(info => info[this.currentTab] === view[[this.currentTab]])
        if (!isFind) {
          this.allDatas[this.currentTab].splice(i, 1)
          // TODO 数据库是否删除
        }
      }
      console.log(this.allDatas[this.currentTab])
    },
    loadData() {
      // gradeId
      this.initView()

      // subject
    },
    toggleTab(status) {
      this.currentTab = status
      this.debounceLoad()
    },
    handleBlurClick(cls) {
      cls.isEdit = false
      cls.changeName = cls.name
    },
    setGrades(val) {
      this.gradeIdInfos = [...val]
      this.initView()
      this.selectedGrades = this.allDatas.gradeId.map(item => item.gradeId)
    },
    addGradeClass(view) {
      view.classes.push({
        key: new Date().getTime(),
        isNew: true,
        isEdit: true,
        name: '',
        changeName: '',
        gradeId: view.gradeId,
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
      cls.name = cls.changeName
      cls.isNew = false
      cls.isEdit = false
      cls.id = '1'
      cb && cb(cls.id)
    },
    deleteGrade(view, index) {
       this.$confirm({
        title: 'Confirm delete grade',
        content: 'By deleting the grade/year, all classes belong to it will be removed. Do you confirm to delete? ',
        centered: true,
        onOk: () => {
          this.allDatas.gradeId.splice(index, 1)
          this.selectedGrades = this.allDatas.gradeId.map(item => item.gradeId)
        }
      })
    },
    handleAddSubjectClass() {
      this.$refs.classSubject.doCreate({})
    },
    addSubjectClass(cls) {
      const subject = this.subjectInfos.find(item => item.subject === cls.subject)
      if (!subject) {
        this.subjectInfos.push({
          subject: cls.subject,
          subjectName: cls.subjectName
        })
      }
      const findDatas = this.allDatas.subject.find(item => item.subject === cls.subject)
      if (!findDatas) {
        this.allDatas.subject.push({
          subject: cls.subject,
          subjectName: cls.subjectName,
          classes: [{
            ...cls,
            key: new Date().getTime(),
            changeName: cls.name,
            isNew: false,
            isEdit: false
          }]
        })
      } else {
        findDatas.classes.push({
          ...cls,
          changeName: cls.name,
          key: new Date().getTime(),
          isNew: false,
          isEdit: false
        })
      }
    },
    handleImport(cls) {
      this.$refs.studentImport.doCreate({
        classId: cls.id,
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
      this.$refs.memberList.doCreate({
        classId: cls.id || '1',
        role: 'teacher'
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
