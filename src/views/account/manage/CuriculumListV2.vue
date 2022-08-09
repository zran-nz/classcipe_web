<template>
  <div class='my-full-form-wrapper' id='formRoot' :style="{'font-size': fontSize}">
    <fixed-form-header>
      <template v-slot:header>
        <form-header
          title='School Curriculum'
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
              <label style="font-weight: normal">{{ userMode === USER_MODE.SELF ? '' : 'School ' }}Curriculum</label>
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
            v-for="(item,index) in filterTabs"
            :key="'types'+index"
            :class="{'tab-item': true, 'active' : currentTab === item.value}"
            @click="toggleTab(item.value)">
            {{ item.title }}
          </div>
        </div>
      </div>
      <div class="form-tab">
        <curiculum-sel
          ref="CurriculumRef"
          v-show="currentTab === 'Curriculum'"
          :school="currentSchool"
          @change="changeCurriculum"
          @save-success="(notip) => successCb('pendingCurriculum', notip)"
        />
        <div style="font-size: 14px;height: calc(100% - 50px);" v-show="currentTab === 'Subject'">
          <subject-sel
            ref="SubjectRef"
            :curriculum="currentCurriculum"
            :school="currentSchool"
            @change="changeSubjects"
            @save-success="(notip) => successCb('pendingSubject', notip)"
          />
        </div>
        <div style="font-size: 14px;height: calc(100% - 0px);" v-show="currentTab === 'Authorization'">
          <authorize-sel
            ref="AuthorizationRef"
            :curriculum="currentCurriculum"
            :school="currentSchool"
            @change="changeAuth"
            @save-success="(notip) => successCb('pendingAuthorization', notip)"
          />
        </div>
      </div>
    </div>
    <div style="font-size: 16px;" v-show="currentTab !== 'Authorization'">
      <fixed-form-footer>
        <template v-slot:right>
          <a-button :loading="saveLoading" :disabled="disabled" type='primary' @click='handleNextStep' class='cc-round-button'>
            <template v-if='true'>
              {{ SaveTxt }}
            </template>
            <template v-else>
              Complete
            </template>
          </a-button>
        </template>
      </fixed-form-footer>
    </div>
  </div>
</template>

<script>
import { AllCurriculums, USER_MODE } from '@/const/common'

import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'
import { ReSetFontMixin } from '@/mixins/ReSetFontMixin'

import FixedFormHeader from '@/components/Common/FixedFormHeader'
import FixedFormFooter from '@/components/Common/FixedFormFooter'
import FormHeader from '@/components/FormHeader/FormHeader'
import CuriculumSel from './curiculum/CuriculumSel'
import SubjectSel from './curiculum/SubjectSel'
import AuthorizeSel from './curiculum/AuthorizeSel'

import { mapState } from 'vuex'
export default {
  name: 'CuriculumListV2',
  components: {
    FixedFormHeader,
    FixedFormFooter,
    FormHeader,
    CuriculumSel,
    SubjectSel,
    AuthorizeSel
  },
  mixins: [UserModeMixin, CurrentSchoolMixin, ReSetFontMixin],
  data() {
    return {
      fontSize: '16px',
      fixHtmlWidth: 1000,
      USER_MODE: USER_MODE,
      currentTab: 'Curriculum',
      tabsList: [{
          value: 'Curriculum',
          title: 'Curriculum'
      },
      {
          value: 'Subject',
          title: 'Subject'
      }, {
          value: 'Authorization',
          title: 'IB authorization'
      }],
      curriculumChanged: false,
      pendingCurriculum: false,
      pendingSubject: false,
      pendingAuthorization: false,
      saveLoading: false,
      currentCurriculum: [],
      currentAuth: {}
    }
  },
  computed: {
    ...mapState({
      info: state => state.user.info,
      bindCurriculum: state => state.user.bindCurriculum,
      currentSchool: state => state.user.currentSchool,
      userMode: state => state.app.userMode
    }),
    filterTabs() {
      return this.tabsList.filter(item => {
        const findIB = this.currentCurriculum.find(item => item.id === AllCurriculums.IBPYP || item.id === AllCurriculums.IBMYP)
        return findIB ? true : item.value !== 'Authorization'
      })
    },
    SaveTxt() {
      if (this.currentTab === 'Curriculum') {
        return 'Next'
      } else {
        const findIB = this.currentCurriculum.find(item => item.id === AllCurriculums.IBPYP || item.id === AllCurriculums.IBMYP)
        return findIB ? 'Next' : 'Finish'
      }
    },
    disabled() {
      console.log(this.currentAuth.status)
      if (this.currentTab === 'Authorization' && (this.currentAuth.status === 1 || this.currentAuth.status === 2)) {
        return true
      }
      return false
    }
  },
  created() {
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    toggleTab(status) {
      // 当大纲发生变化，切换的时候提示是否要保存
      if (status === 'Subject' && this.curriculumChanged) {
        this.$confirm({
          content: 'Your curiculum has changed. Do you want to save first? ',
          centered: true,
          onOk: () => {
            this.saveLoading = true
            this.$refs.CurriculumRef.doSave()
          }
        })
        return
      }
      this.currentTab = status
    },
    changeCurriculum(val, isChange) {
      console.log(val)
      this.curriculumChanged = isChange
      this.currentCurriculum = [ ...val ]
    },
    changeSubjects(val) {
      console.log(val)
      this.changedSubjects = [...val]
    },
    changeAuth(val) {
      console.log(val)
      this.currentAuth = { ...val }
    },
    successCb(pending, notip = false) {
      !notip && this.$message.success('Save successfully')
      this.saveLoading = false
      if (!notip) {
        if (pending === 'pendingCurriculum') {
          this.currentTab = 'Subject'
        } else if (pending === 'pendingSubject') {
          const findIB = this.currentCurriculum.find(item => item.id === AllCurriculums.IBPYP || item.id === AllCurriculums.IBMYP)
          if (findIB) {
            this.currentTab = 'Authorization'
          } else {
            this.$router.push('/account/info')
          }
        }
      }
    },
    handleNextStep() {
      if (this.currentTab === 'Curriculum') {
        this.saveLoading = true
        this.$refs.CurriculumRef.doSave()
        this.$refs.SubjectRef.truelySave(true, true)
      } else if (this.currentTab === 'Subject') {
        this.saveLoading = true
        this.$refs.SubjectRef.doSave()
      } else if (this.currentTab === 'Authorization') {
        this.saveLoading = true
        this.$refs.AuthorizationRef.doSave()
      }
    }
  }
}
</script>

<style scoped lang="less">
.cc-fixed-form-header {
  height: 60px;
}
.form-content {
  margin-top: 60px;
  height: calc(100vh - 60px);
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
  background: #fff;
  width: 100%;
  height: 1.1em /* 110/100 */;
  padding: 0 0.3em /* 30/100 */;
  .tab-list {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
   .tab-item {
      margin: 0 1/0.27*0.3em /* 60/100 */;
      font-size: 0.27em /* 27/100 */;
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
        margin-top: 0.3em /* 30/100 */;
        position: absolute;
        transition: width 0.2s, left 0.2s;
        transition-timing-function: ease-out;
        left: 50%;
      }
      &.active {
        font-size: 0.27em /* 27/100 */;
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
  height: calc(100% - 1.1em);
}
/deep/ .cc-fixed-form-footer {
  background: #fff;
}
</style>
