<template>
  <div class='my-full-form-wrapper' id='formRoot'>
    <fixed-form-header>
      <template v-slot:header>
        <form-header
          title='Role Manage'
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
              <label style="font-weight: normal">Role Manage</label>
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
              <school-role-list ref="schoolRoleList" :school="currentSchool" @choose="chooseRole"/>
            </a-card>
          </a-col>
          <a-col :md="rightColMd" :sm="24" v-if="rightcolval === 1" style="height: 100%">
            <a-card :bordered="false" style="height: 100%">
              <school-role-user v-if="selectedRole && selectedRole.roleCode === 'Admin'" :school="currentSchool" :role="selectedRole" @close="clearRole"/>
              <school-role-class v-if="selectedRole && selectedRole.roleCode === 'Homeroom teacher'" :school="currentSchool" :role="selectedRole" @close="clearRole"/>
              <school-role-subject v-if="selectedRole && selectedRole.roleCode === 'Subject coordinator'" :school="currentSchool" :role="selectedRole" @close="clearRole"/>
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
import SchoolRoleList from './schoolRole/SchoolRoleList'
import SchoolRoleUser from './schoolRole/SchoolRoleUser'
import SchoolRoleClass from './schoolRole/SchoolRoleClass'
import SchoolRoleSubject from './schoolRole/SchoolRoleSubject'

import { mapState } from 'vuex'
const { debounce } = require('lodash-es')

export default {
  name: 'SchoolRole',
  mixins: [UserModeMixin, CurrentSchoolMixin],
  components: {
    FixedFormHeader,
    FormHeader,
    CustomTextButton,
    SchoolRoleList,
    SchoolRoleUser,
    SchoolRoleClass,
    SchoolRoleSubject
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
      rightcolval: 0,
      selectedRole: '',
      loading: false
    }
  },
  created() {
    this.debounceLoad = debounce(this.loadData, 300)
  },
  computed: {
    ...mapState({
      userMode: state => state.app.userMode,
      currentSchool: state => state.user.currentSchool
    }),
    leftColMd() {
      return !this.selectedRole ? 24 : 10
    },
    rightColMd() {
      return !this.selectedRole ? 0 : 14
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

    },
    handleSave(data) {

    },
    chooseRole(item) {
      if (item) {
        this.rightcolval = 1
        this.selectedRole = { ...item }
      } else {
        this.clearRole()
      }
    },
    clearRole() {
      this.rightcolval = 0
      this.selectedRole = ''
      this.$refs.schoolRoleList.doClear()
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
