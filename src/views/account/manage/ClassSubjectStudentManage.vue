<template>
  <div class='my-full-form-wrapper' id='formRoot'>
    <fixed-form-header>
      <template v-slot:header>
        <form-header
          title='Subject Class Student'
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
              <label style="cursor: pointer" @click="openV2('/v2/account/classes/subject')">Subject Class</label>
              <label for="">></label>
              <label style="font-weight: normal">Add Student</label>
            </a-space>
          </template>
          <template v-slot:right>
          </template>
        </form-header>
      </template>
    </fixed-form-header>
    <div class="form-content">
      <div class="form-tab">
        <a-row :gutter="10" style="height: 100%">
          <a-col :md="leftColMd" :sm="24" style="height: 100%">
            <a-card :bordered="false" style="height: 100%">
              <class-subject-student-sel ref="classSubjectStudentSel" :subjectId="subjectId" @choose="handleAddStudents"/>
            </a-card>
          </a-col>
          <a-col :md="rightColMd" :sm="24" style="height: 100%">
            <a-card :bordered="false" style="height: 100%">
              <class-student-show ref="classStudentShow" :classId="classId" :className="clsObj.name" @update="handleReload"/>
            </a-card>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>

<script>
import { USER_MODE, SCHOOL_USER_STATUS } from '@/const/common'
import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'

import FixedFormHeader from '@/components/Common/FixedFormHeader'
import FormHeader from '@/components/FormHeader/FormHeader'
import CustomTextButton from '@/components/Common/CustomTextButton'
import ClassSubjectStudentSel from './class/ClassSubjectStudentSel'
import ClassStudentShow from './class/ClassStudentShow'

import { classDetail, addStudentsBatch } from '@/api/v2/schoolClass'

import { mapState } from 'vuex'
const { debounce } = require('lodash-es')

export default {
  name: 'ClassSubjectStudentManage',
  props: {
    classId: {
      type: String,
      required: true
    }
  },
  mixins: [UserModeMixin, CurrentSchoolMixin],
  components: {
    FixedFormHeader,
    FormHeader,
    CustomTextButton,
    ClassSubjectStudentSel,
    ClassStudentShow
  },
  data() {
    return {
      USER_MODE: USER_MODE,
      SCHOOL_USER_STATUS: SCHOOL_USER_STATUS,
      subjectId: '',
      clsObj: {},
      loading: false
    }
  },
  created() {
    this.debounceLoad = debounce(this.loadData, 300)
    this.loadData()
  },
  computed: {
    ...mapState({
      userMode: state => state.app.userMode,
      currentSchool: state => state.user.currentSchool
    }),
    leftColMd() {
      return 14
    },
    rightColMd() {
      return 10
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    handleSchoolChange(currentSchool) {
      if (this.userMode === USER_MODE.SCHOOL) {
      }
    },
    handleModeChange(userMode) {
      // 模式切换，个人还是学校 个人接口
    },
    loadData() {
      this.loading = true
      classDetail({
        classId: this.classId
      }).then(res => {
        if (res.code === 0) {
          this.clsObj = res.result
          this.subjectId = this.clsObj.subject
        }
      }).finally(() => {
        this.loading = false
      })
    },
    handleSave(data) {

    },
    handleAddStudents(ids) {
      this.loading = true
      addStudentsBatch({
        schoolId: this.currentSchool.id,
        userIdList: ids,
        classId: this.classId
      }).then(res => {
        this.$refs.classStudentShow.loadData()
        this.$refs.classSubjectStudentSel.loadData()
      }).finally(() => {
        this.loading = false
      })
    },
    handleReload() {
      this.$refs.classSubjectStudentSel.loadData()
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
  padding: 30px 30px;
  transition: all 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.form-tab {
  height: calc(100% - 0px);
  padding: 0 0px;
  overflow: hidden;
}
/deep/ .ant-card-body {
  height: 100%;
}
</style>
