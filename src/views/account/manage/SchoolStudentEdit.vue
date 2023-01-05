<template>
  <div class='my-full-form-wrapper' id='formRoot'>
    <fixed-form-header>
      <template v-slot:header>
        <form-header
          :title='title'
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
              <label style="cursor: pointer" @click="$router.push('/manage/student/list')">School Student</label>
              <label for="">></label>
              <template v-if="onlyClass">
                <label style="cursor: pointer" @click="$router.push('/manage/student/list?classId=' + onlyClass.id)">{{ onlyClass.name }}</label>
                <label for="">></label>
              </template>
              <label style="font-weight: normal">{{ title }}</label>
            </a-space>
          </template>
          <template v-slot:right>
          </template>
        </form-header>
      </template>
    </fixed-form-header>
    <div class="form-content">
      <school-student-add @getCls="changeCls" :school="currentSchool" ref="schoolStudentAdd" :id="id" @save="handleSave" />
    </div>
  </div>
</template>

<script>
import { USER_MODE, SCHOOL_USER_STATUS } from '@/const/common'
import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'

import FixedFormHeader from '@/components/Common/FixedFormHeader'
import FormHeader from '@/components/FormHeader/FormHeader'
import SchoolStudentAdd from './schoolUser/SchoolStudentAdd'

import { mapState } from 'vuex'
import storage from 'store'
const { debounce } = require('lodash-es')

export default {
  name: 'SchoolStudentEdit',
  mixins: [UserModeMixin, CurrentSchoolMixin],
  components: {
    FixedFormHeader,
    FormHeader,
    SchoolStudentAdd
  },
  props: {
    id: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      USER_MODE: USER_MODE,
      SCHOOL_USER_STATUS: SCHOOL_USER_STATUS,
      onlyClass: null
    }
  },
  created() {
    if (storage.get('user_mode') != USER_MODE.SCHOOL || storage.get('SET_CURRENT_SCHOOL')?.id !== this.currentSchool.id) {
      this.openV2('/v2/account/info')
    }
    this.debounceLoad = debounce(this.loadData, 300)
  },
  computed: {
    ...mapState({
      userMode: state => state.app.userMode,
      currentSchool: state => state.user.currentSchool
    }),
    title() {
      return this.id ? 'Edit' : 'Add'
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    handleSchoolChange(currentSchool) {
      if (this.userMode === USER_MODE.SCHOOL) {
        this.queryParam.schoolId = currentSchool.id
        this.initDict()
        this.debounceInit()
      }
    },
    handleModeChange(userMode) {
      // 模式切换，个人还是学校 个人接口
      this.debounceInit()
    },
    loadData() {

    },
    handleSave(data) {
      this.goBack()
    },
    changeCls(cls) {
      this.onlyClass = cls
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
  overflow: auto;
}
</style>
