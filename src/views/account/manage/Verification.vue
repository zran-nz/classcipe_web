<template>
  <div class='my-full-form-wrapper' id='formRoot'>
    <fixed-form-header>
      <template v-slot:header>
        <form-header
          title='Application for certification/service'
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
      </div>
      <div class="form-tab">
        <teacher-verification-form
          v-show="currentTab === 'Teacher'"
          :school="currentSchool"
          ref="teacherVerificationForm"
          :id="info.id"
          @save="handleSave" />

        <service-verification-form
          v-show="currentTab === 'Service'"
          :school="currentSchool"
          ref="serviceVerificationForm"
          :id="info.id"
          @save="handleSave" />
      </div>
    </div>
  </div>
</template>

<script>
import { USER_MODE } from '@/const/common'
import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'

import FixedFormHeader from '@/components/Common/FixedFormHeader'
import FormHeader from '@/components/FormHeader/FormHeader'
import TeacherVerificationForm from './verification/TeacherVerificationForm'
import ServiceVerificationForm from './verification/ServiceVerificationForm'

import { mapState } from 'vuex'
const { debounce } = require('lodash-es')

export default {
  name: 'Verification',
  mixins: [UserModeMixin, CurrentSchoolMixin],
  components: {
    FixedFormHeader,
    FormHeader,
    TeacherVerificationForm,
    ServiceVerificationForm
  },
  data() {
    return {
      USER_MODE: USER_MODE,
      currentTab: 'Teacher',
      tabsList: [{
          value: 'Teacher',
          title: 'Teacher verification'
      },
      {
          value: 'Service',
          title: 'Service verification'
      }]
    }
  },
  created() {
    this.debounceLoad = debounce(this.loadData, 300)
  },
  computed: {
    ...mapState({
      info: state => state.user.info,
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
        this.queryParam.schoolId = currentSchool.id
        this.initDict()
        this.debounceLoad()
      }
    },
    handleModeChange(userMode) {
      // 模式切换，个人还是学校 个人接口
      this.debounceLoad()
    },
    toggleTab(status) {
      this.currentTab = status
      this.debounceLoad()
    },
    loadData() {

    },
    handleSave(data) {
      this.goBack()
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
  padding: 20px 20px 0 20px;
  overflow: auto;
}
</style>
