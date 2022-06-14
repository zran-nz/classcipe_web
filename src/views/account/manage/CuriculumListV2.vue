<template>
  <div class='my-full-form-wrapper' id='formRoot' :style="{'font-size': fontSize}">
    <fixed-form-header>
      <template v-slot:header>
        <form-header
          title='School Curriculum'
          :show-share='false'
          :show-collaborate='false'
          :is-preview-mode='false'
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
          @save-success="() => successCb('pendingCurriculum')"
        />
        <div style="font-size: 14px;height: calc(100% - 50px);" v-show="currentTab === 'Subject'">
          <subject-sel
            ref="SubjectRef"
            :curriculum="currentCurriculum"
            :school="currentSchool"
            @change="changeSubjects"
            @save-success="() => successCb('pendingSubject')"
          />
        </div>
        <div style="font-size: 14px;height: calc(100% - 50px);" v-show="currentTab === 'Authorization'">
          <authorize-sel
            ref="AuthorizationRef"
            :curriculum="currentCurriculum"
            :school="currentSchool"
            @change="changeAuth"
            @save-success="() => successCb('pendingAuthorization')"
          />
        </div>
      </div>
    </div>
    <div style="font-size: 16px;">
      <fixed-form-footer>
        <template v-slot:right>
          <a-button :loading="saveLoading" :disabled="disabled" type='primary' @click='handleNextStep' class='cc-round-button'>
            <template v-if='true'>
              Save
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
      history.go(-1)
    },
    toggleTab(status) {
      this.currentTab = status
    },
    changeCurriculum(val) {
      console.log(val)
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
    successCb(pending) {
      this.$message.success('Save successfully')
      this.saveLoading = false
    },
    handleNextStep() {
      if (this.currentTab === 'Curriculum') {
        this.saveLoading = true
        this.$refs.CurriculumRef.doSave()
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
