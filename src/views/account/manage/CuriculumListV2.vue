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
            v-for="(item,index) in tabsList"
            :key="'types'+index"
            :class="{'tab-item': true, 'active' : currentTab === item.value}"
            @click="toggleTab(item.value)">
            {{ item.title }}
          </div>
        </div>
      </div>
      <curiculum-sel
        ref="CurriculumRef"
        v-show="currentTab === 'Curriculum'"
        :gradeOptions="gradeOptions"
        :school="currentSchool"
        @change="changeCurriculum"
        @save-success="() => successCb('pendingCurriculum')"
      />
    </div>
  </div>
</template>

<script>
import { USER_MODE } from '@/const/common'

import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'
import { ReSetFontMixin } from '@/mixins/ReSetFontMixin'

import { GradeGetAllGrades } from '@/api/grade'

import FixedFormHeader from '@/components/Common/FixedFormHeader'
import FormHeader from '@/components/FormHeader/FormHeader'
import CuriculumSel from './curiculum/CuriculumSel'

import { mapState } from 'vuex'
export default {
  name: 'CirculumListV2',
  components: {
    FixedFormHeader,
    FormHeader,
    CuriculumSel
  },
  mixins: [UserModeMixin, CurrentSchoolMixin, ReSetFontMixin],
  data() {
    return {
      fontSize: '16px',
      fixHtmlWidth: 1000,
      USER_MODE: USER_MODE,
      gradeOptions: [],
      currentTab: 'Curriculum',
      tabsList: [{
          value: 'Curriculum',
          title: 'Curriculum'
      },
      {
          value: 'Subject',
          title: 'Subject'
      }, {
          value: 'Teaching',
          title: 'Teaching contents'
      }],
      pendingCurriculum: false,
      saveLoading: false,
      defaultCurriculumId: null,
      currentCurriculum: null
    }
  },
  computed: {
    ...mapState({
      info: state => state.user.info,
      bindCurriculum: state => state.user.bindCurriculum,
      currentSchool: state => state.user.currentSchool,
      userMode: state => state.app.userMode
    })
  },
  created() {
    GradeGetAllGrades().then(res => {
      if (res.success) {
        this.gradeOptions = res.result
      }
    })
    this.currentCurriculum = {
      curriculumId: this.currentSchool.curriculumId || this.bindCurriculum
    }
    this.defaultCurriculumId = this.currentSchool.curriculumId || this.bindCurriculum
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    toggleTab(status) {
      this.currentTab = status
    },
    changeCurriculum(val) {
      this.currentCurriculum = { ...val }
      if (this.currentCurriculum.id) {
        this.defaultCurriculumId = this.currentCurriculum.id
      }
    },
    successCb(pending) {
      this[pending] = false
      if (!this.pendingCurriculum) {
        this.$message.success('Save successfully')
        this.saveLoading = false
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
  min-height: calc(100vh - 60px);
  height: 100%;
  transition: all 0.2s ease-in-out;
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
</style>
