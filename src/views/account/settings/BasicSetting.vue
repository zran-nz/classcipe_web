<template>
  <a-row type="flex" style="flex-wrap: nowrap;">
    <a-col class="account-settings-info-view" flex="auto">
      <!-- <div class="loading-wrapper">
        <a-spin size="large" v-if="loading"/>
      </div> -->
      <a-spin size="large" :spinning="loading">
        <div class="edit-action-wrapper" v-if="!editMode">
          <div class="edit-action" @click="editMode = !editMode">
            <a-icon type="edit"/>
            Edit
          </div>
        </div>

        <avatar-modal ref="modal" @ok="setAvatar"/>

        <a-row :gutter="[16, 16]">
          <a-col span="16" :style="{ minHeight: '180px' }" class="username-line">
            <div class="ant-upload-preview" @click="$refs.modal.edit(1)">
              <a-icon type="cloud-upload-o" class="upload-icon"/>
              <div class="mask">
                <a-icon type="plus"/>
              </div>
              <img :src="userInfo.avatar" v-if="userInfo.avatar"/>
              <img src="~@/assets/icons/library/default-avatar.png" v-else/>
            </div>
            <div style="width: 100%">
              <div class="user-name">
                <h1 v-if="!editMode">{{ userInfo.nickname ||( userInfo.firstname + ' ' + userInfo.lastname) }}</h1>
                <div class="edit-user-name" v-if="editMode">
                  <a-input v-model="userInfo.tempNickname" size="large" :maxLength="80"/>
                </div>
              </div>
              <a-icon type="profile" style="margin-left: 30px" />&nbsp;&nbsp;{{ userInfo.email }}
            </div>

          </a-col>

        </a-row>
        <a-divider/>
        <a-row :gutter="[16, 16]">
          <a-col span="24">
            <div class="profile-title">
              {{ userMode === USER_MODE.SELF ? 'Personal account' : `School account: ${currentSchool.schoolName}` }}
            </div>
          </a-col>
          <a-col span="24">
            <!--        role-->
            <div class="profile-item-line">
              <div class="profile-label">
                <span class="label-txt">Role : </span>
              </div>
              <a-space class="profile-text profile-data">
                <a-tag v-for="roleName in rolesName" :key="'roleName_'+roleName"> {{ roleName }} </a-tag>
              </a-space>
            </div>

            <!--        time-->
            <div class="profile-item-line">
              <div class="profile-label">
                <span class="label-txt">Member since :</span>
              </div>
              <div class="profile-text profile-data">
                <template v-if="userMode === USER_MODE.SELF">
                  {{ userInfo.createTime | dayjs }}
                </template>
                <template v-else>
                  {{ currentSchool.schoolJoinDate | dayjs }}
                </template>
              </div>
            </div>

            <!--        expert-->
            <div class="profile-item-line" v-if="$store.getters.currentRole === 'expert'">
              <div class="profile-label">
                <span class="label-txt">Area(s) :</span>
              </div>
              <div class="profile-text profile-data" v-if="!editMode || !canEdit">
                <div class="profile-tag-item" v-for="(areaName,index) in userInfo.areaNameList" :key="index">
                  <a-tag>{{ areaName }}</a-tag>
                </div>
                <template v-if="userInfo.others && userInfo.others.length">
                  <div
                    class="profile-tag-item"
                    v-for="(otherName,index) in userInfo.others"
                    :key="'o' + index">
                    <a-tag color="#108ee9">{{ otherName }}</a-tag>
                  </div>
                </template>
              </div>
              <div class="profile-input profile-data" v-else>
                <a-select :getPopupContainer="trigger => trigger.parentElement" v-model="userInfo.areaIds" placeholder="Please select" mode="multiple">
                  <a-select-option
                    :value="areaOption.id"
                    v-for="areaOption in areaOptions"
                    :key="areaOption.id"
                    @click.native="handleSelectAreaOption(areaOption)">{{ areaOption.name }}
                  </a-select-option>
                </a-select>
                <a-input
                  class="area-input"
                  v-if="currentArea && currentArea.name === 'Others'"
                  v-model="userInfo.tempOthers"
                  placeholder="Please input"/>
              </div>
            </div>
            <!--        curriculum-->
            <div class="profile-item-line" v-if="$store.getters.currentRole === 'teacher'">
              <div class="profile-label">
                <span class="label-txt">Curriculum :</span>
              </div>
              <div class="profile-text profile-data" v-if="!editMode || !canEdit">
                {{ userInfo.curriculumName }}
              </div>
              <div class="profile-input profile-data" v-else>
                <a-select :getPopupContainer="trigger => trigger.parentElement" v-model="userInfo.curriculumId" placeholder="Please select curriculum">
                  <a-select-option
                    :value="curriculumOption.id"
                    v-for="curriculumOption in curriculumOptions"
                    :key="curriculumOption.id"
                    @click.native="handleSelectCurriculumOption(curriculumOption)">{{
                      curriculumOption.name
                    }}
                  </a-select-option>
                </a-select>
              </div>
            </div>

            <!--        subject-->
            <div class="profile-item-line" v-hasRole="['teacher', 'student']">
              <div class="profile-label">
                <span class="label-txt">Subject(s) :</span>
              </div>
              <div class="profile-text profile-data" v-if="!editMode || !canEdit">
                <div class="profile-tag-item" v-for="(subjectName,index) in userInfo.subjects" :key="index">
                  <a-tag>{{ subjectName }}</a-tag>
                </div>
              </div>
              <div class="profile-input profile-data" v-else>
                <a-select :getPopupContainer="trigger => trigger.parentElement" v-model="userInfo.subjects" mode="multiple">
                  <a-select-option :value="subject.name" v-for="subject in subjectOptionsFilter" :key="subject.id">{{ subject.name }}</a-select-option>
                </a-select>
              </div>
            </div>

            <!--        age-->
            <div class="profile-item-line" v-hasRole="['student']">
              <div class="profile-label">
                <span class="label-txt">Age : </span>
              </div>
              <div class="profile-text profile-data" v-if="!editMode || !canEdit">
                {{ userInfo.age }}
              </div>
              <div class="profile-input profile-data" v-else>
                <a-select :getPopupContainer="trigger => trigger.parentElement" v-model="userInfo.age" placeholder="Please select age">
                  <a-select-option :value="ageOption" v-for="ageOption in ageList" :key="'age_'+ageOption">
                    {{ ageOption }}
                  </a-select-option>
                </a-select>
              </div>
            </div>

            <!--        grade-->
            <div class="profile-item-line" v-if="$store.getters.currentRole === 'teacher'">
              <div class="profile-label">
                <span class="label-txt">Level/Grade :</span>
              </div>
              <div class="profile-text profile-data" v-if="!editMode || !canEdit">
                <div class="profile-tag-item" v-for="(gradeName,index) in userInfo.gradeNameList" :key="index">
                  <a-tag>{{ gradeName }}</a-tag>
                </div>
              </div>
              <div class="profile-input profile-data" v-else>
                <a-select :getPopupContainer="trigger => trigger.parentElement" v-model="userInfo.gradeIds" placeholder="Please select grade" mode="multiple">
                  <a-select-option :value="gradeOption.id" v-for="gradeOption in gradeOptions" :key="gradeOption.id">
                    {{ gradeOption.name }}
                  </a-select-option>
                </a-select>
              </div>
            </div>

            <!-- Customized tags -->
            <div class="profile-item-line" v-if="$store.getters.currentRole === 'teacher'">
              <div class="profile-label">
                <span class="label-txt">Customized tags :</span>
              </div>

              <div class="profile-text profile-data">
                <a slot="extra" href="#" @click="handleSetting"> <a-icon type="edit" />&nbsp;Tags setting</a>
              </div>
            </div>

            <div class="profile-item-line">
              <div class="profile-label">
                <span class="label-txt">Linked School(s):</span>
              </div>

              <div class="profile-text profile-data">
                <a-space v-if="linkedSchool.length > 0">
                  <a-tag color="#ffc001" v-for="item in linkedSchool" :key="'linkedSchool_'+item"> {{ item }} </a-tag>
                </a-space>
                <div v-if="linkedSchool.length===0 && currentRole === 'teacher'">
                  <a-button @click="userFormVisible = true">Refer your principal</a-button>
                  <!-- <div class='no-linked-school-name'>You have not linked to any school</div> -->
                </div>
                <div class='no-linked-school-name' v-if="linkedSchool.length===0 && currentRole === 'student'">You have not linked to any school</div>
              </div>
            </div>

          </a-col></a-row>

        <a-row>
          <a-col span="24" class="action-line">
            <div class="submit-action-wrapper" v-if="editMode">
              <a-button type="primary" :loading="loadSaving" @click="saveDetail">{{ $t('account.settings.basic.update') }}</a-button>
            </div>
            <div class="submit-action-wrapper-second" v-if="editMode">
              <a-button @click="cancelDetail">{{ $t('account.settings.basic.cancel') }}</a-button>
            </div>
          </a-col>
        </a-row>

        <a-modal
          title="Tags Setting"
          v-model="settingVisible"
          :footer="null"
          destroyOnClose
          width='600px'
          :dialog-style="{ top: '20px' }">
          <div>
            <tag-setting />
          </div>
        </a-modal>
      </a-spin>
    </a-col>
    <a-col flex="30px" v-show="userFormVisible">
      <a-divider type="vertical" style="height: 100%;margin: 0 15px;"/>
    </a-col>
    <a-col flex="500px" v-show="userFormVisible">
      <div class="account-info">
        <div class="account-info-title">
          Complete the form below to send your principal an email about Classcipe
        </div>
        <div class="account-info-sub">
          <a-button v-show="!adminFormVisible" @click="adminFormVisible = true" type="link">I'm an administrator ></a-button>
          <a-button v-show="adminFormVisible" @click="adminFormVisible = false" type="link">I'm not an administrator ></a-button>
        </div>
        <a-spin :spinning="confirmLoading">
          <a-form-model
            ref="userForm"
            class="account-info-form"
            :layout="userForm.layout"
            :model="userForm"
            :rules="validatorRules"
            v-show="!adminFormVisible"
          >
            <a-row :gutter=16>
              <a-col :span="12">
                <a-form-model-item label="Your Frist Name" prop="firstname">
                  <a-input size="large" v-model="userForm.firstname" placeholder="input your first name" />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="Your Last Name" prop="lastname">
                  <a-input size="large" v-model="userForm.lastname" placeholder="input your last Name" />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-form-model-item label="Your Email Address" prop="email">
              <a-input size="large" v-model="userForm.email" placeholder="input your email address" />
            </a-form-model-item>
            <a-row :gutter=16>
              <a-col :span="12">
                <a-form-model-item label="Principal's Frist Name" prop="principleFirstname">
                  <a-input size="large" v-model="userForm.principleFirstname" placeholder="input principal's first name" />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="Principal's Last Name" prop="principleLastname">
                  <a-input size="large" v-model="userForm.principleLastname" placeholder="input principal's last Name" />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-form-model-item label="Principal's Email Address" prop="principleEmail">
              <a-input size="large" v-model="userForm.principleEmail" placeholder="input principal's email address" />
            </a-form-model-item>
            <a-form-model-item key="School" label="School" prop="schoolId">
              <a-select
                v-model="userForm.schoolId"
                @change="changeUserSchool"
                placeholder="Please select school"
                show-search
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                option-label-prop="label"
                @search="handleSearchSchool"
                @focus="handleSearchSchool"
              >
                <div slot="dropdownRender" slot-scope="menu">
                  <v-nodes :vnodes="menu" />
                  <div v-if="ifShowCreate">
                    <a-divider style="margin: 4px 0;" />
                    <div
                      style="padding: 4px 8px; cursor: pointer;"
                      @mousedown="e => e.preventDefault()"
                      @click="handleCreateSchool('userForm')"
                    >
                      Create School: <a-tag color="#15c39a">{{ createSchoolName }}</a-tag>
                    </div>
                  </div>
                </div>
                <a-select-option
                  :value="schoolOption.id"
                  :label="schoolOption.name"
                  v-for="schoolOption in [...myCreateSchoolOptions,...schoolOptions]"
                  :key="schoolOption.id"
                >
                  <label style="display:flex;justify-content:space-between;">
                    <span>{{ schoolOption.name }}</span>
                    <a-tag type="primary" v-show="schoolOption.country">{{ schoolOption.country }}</a-tag>
                  </label>
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item prop="country" label="Country/Region">
              <a-select
                v-model="userForm.country"
                show-search
                placeholder="Please Select a Country"
                option-filter-prop="children"
                :filter-option="filterOptions"
                :getPopupContainer="target => target.parentNode"
              >
                <a-select-option
                  v-for="param in countries"
                  :value="param.en"
                  :key="'country_' + param.en"
                >
                  {{ param.en }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="Your Personalized Message (Optional)">
              <a-textarea :auto-size="{ minRows: 3}" size="large" v-model="userForm.personalizedMessage" placeholder="input your personalized message" />
            </a-form-model-item>
            <a-form-model-item style="text-align: right;">
              <a-button type="primary" html-type="submit" :loading="confirmLoading" @click="doSaveUserForm">
                Send
              </a-button>
            </a-form-model-item>
          </a-form-model>
          <a-form-model
            ref="adminForm"
            class="account-info-form"
            v-show="adminFormVisible"
            layout="vertical"
            :model="adminForm"
            :rules="validatorRules"
          >
            <a-row :gutter=16>
              <a-col :span="12">
                <a-form-model-item label="Your Frist Name" prop="firstname">
                  <a-input size="large" v-model="adminForm.firstname" placeholder="input your first name" />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="Your Last Name" prop="lastname">
                  <a-input size="large" v-model="adminForm.lastname" placeholder="input your last Name" />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-form-model-item label="Email" prop="email">
              <a-input v-model="adminForm.email" placeholder="Please Input Email" />
            </a-form-model-item>
            <a-form-model-item key="School" label="School" prop="schoolId">
              <a-select
                v-model="adminForm.schoolId"
                @change="changeAdminSchool"
                placeholder="Please select school"
                show-search
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                option-label-prop="label"
                @search="handleSearchSchool"
                @focus="handleSearchSchool"
              >
                <div slot="dropdownRender" slot-scope="menu">
                  <v-nodes :vnodes="menu" />
                  <div v-if="ifShowCreate">
                    <a-divider style="margin: 4px 0;" />
                    <div
                      style="padding: 4px 8px; cursor: pointer;"
                      @mousedown="e => e.preventDefault()"
                      @click="handleCreateSchool('adminForm')"
                    >
                      Create School: <a-tag color="#15c39a">{{ createSchoolName }}</a-tag>
                    </div>
                  </div>
                </div>
                <a-select-option
                  :value="schoolOption.id"
                  :label="schoolOption.name"
                  v-for="schoolOption in [...myCreateSchoolOptions,...schoolOptions]"
                  :key="schoolOption.id"
                >
                  <label style="display:flex;justify-content:space-between;">
                    <span>{{ schoolOption.name }}</span>
                    <a-tag type="primary" v-show="schoolOption.country">{{ schoolOption.country }}</a-tag>
                  </label>
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item prop="country" label="School Country">
              <a-select
                v-model="adminForm.country"
                show-search
                placeholder="Please Select a Country"
                option-filter-prop="children"
                :filter-option="filterOptions"
                :getPopupContainer="target => target.parentNode"
              >
                <a-select-option
                  v-for="param in countries"
                  :value="param.en"
                  :key="'adminCountry_' + param.en"
                >
                  {{ param.en }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item prop="position" label="Position">
              <a-select
                v-model="adminForm.position"
                placeholder="Please Select a Position"
                :getPopupContainer="target => target.parentNode"
              >
                <a-select-option
                  v-for="param in positions"
                  :value="param"
                  :key="'position_' + param"
                >
                  {{ param }}
                </a-select-option>
              </a-select>
              <a-form-model-item
                v-show="adminForm.position === 'Other position'"
                prop="positionInput"
                label=""
                style="margin-top: 20px"
              >
                <a-input
                  v-model="adminForm.positionInput"
                  placeholder="Please Input Position"
                />
              </a-form-model-item>
            </a-form-model-item>
            <!-- <a-form-model-item prop="country" label="Country">
              <a-select
                v-model="adminForm.country"
                show-search
                placeholder="Please Select a Country"
                option-filter-prop="children"
                :filter-option="filterOptions"
                :getPopupContainer="target => target.parentNode"
              >
                <a-select-option
                  v-for="param in countries"
                  :value="param.en"
                  :key="'country_' + param.en"
                >
                  {{ param.en }}
                </a-select-option>
              </a-select>
            </a-form-model-item> -->
            <a-form-model-item label="I Would Like a Quote For">
              <a-radio-group v-model="adminForm.planFor">
                <a-radio value="1"> Plan for my school </a-radio>
                <a-radio value="2"> Plan for a group </a-radio>
              </a-radio-group>
            </a-form-model-item>
            <a-form-model-item label="Notes">
              <a-input v-model="adminForm.notes" placeholder="Please Input Notes" />
            </a-form-model-item>
            <a-form-model-item style="text-align: right;">
              <a-button type="primary" html-type="submit" :loading="confirmLoading" @click="doSaveAdminForm">
                Send
              </a-button>
            </a-form-model-item>
          </a-form-model>
        </a-spin>
      </div>
    </a-col>
  </a-row>
</template>

<script>
import AvatarModal from './AvatarModal'
import * as logger from '@/utils/logger'
import { editUser, UserSetting } from '@/api/user'
import {
  addPreference,
  getAllCurriculums,
  getAllSubjectsByCurriculumId,
  getCustomizedTags,
  GetGradesByCurriculumId,
  getAllAreas
} from '@/api/preference'
import { createSchool, getSchools } from '@/api/school'
import { getUserInfo } from '@/api/schoolUser'
import TagSetting from '@/components/UnitPlan/TagSetting'
import { SubjectStudentList } from '@/api/subject'
// import { GetAllCountrys } from '@/api/common'
import { SchoolPrincipleSave } from '@/api/schoolPrinciple'
import { QuotationAddOrUpdate } from '@/api/quotation'
import { getCountry } from '@/api/v2/country'
import { SubjectType, USER_MODE } from '@/const/common'
import { mapState } from 'vuex'
import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'

const { debounce } = require('lodash-es')

export default {
  name: 'BasicSetting',
  mixins: [UserModeMixin, CurrentSchoolMixin],
  components: {
    AvatarModal,
    TagSetting,
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes
    }
  },
  data () {
    return {
      USER_MODE: USER_MODE,
      loadSaving: false,
      curriculumList: [],
      subjectList: [],
      gradeList: [],

      userInfo: {
        avatar: '',
        nickname: '',
        tempNickname: '',
        email: this.$store.getters.email,
        currentRole: '',
        createTime: null,
        curriculumId: this.$store.getters.bindCurriculum,
        curriculumName: null,
        gradeNameList: [],
        areaNameList: [],
        subjects: [],
        gradeIds: [],
        areaIds: [],
        others: null,
        tempOthers: null,
        age: 5
      },

      currentArea: null,
      otherAreaId: null,

      currentCurriculum: null,
      curriculumOptions: [],
      subjectOptions: [],
      gradeOptions: [],
      areaOptions: [],
      customizedTags: [],
      customizedTagIds: [],

      loading: true,
      editMode: false,
      settingVisible: false,
      disableQuestion: this.$store.getters.disableQuestion,
      subjectType: SubjectType,
      ageList: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],

      userFormVisible: false,
      adminFormVisible: false,
      confirmLoading: false,
      userForm: {
        layout: 'vertical',
        firstname: '',
        lastname: '',
        email: '',
        principleFirstname: '',
        principleLastname: '',
        principleEmail: '',
        schoolId: undefined,
        schoolName: undefined,
        country: undefined,
        personalizedMessage: ''
      },
      adminForm: {
        layout: 'vertical',
        position: 'Teacher',
        positionInfo: 'Teacher',
        positionInput: '',
        firstname: '',
        lastname: '',
        email: '',
        schoolId: undefined,
        schoolName: undefined,
        country: undefined
      },
      countries: [],
      positions: [
        'Teacher',
        'School administrator',
        'Principle/Deputy principle',
        'Other position'
      ],
      schoolOptions: [],
      myCreateSchoolOptions: [],
      createSchoolName: '',
      schoolUserInfo: {}
    }
  },
  watch: {
    'userInfo.curriculumId' (val) {
      logger.info('userInfo.curriculumId change', val)
      this.loadSubjectByCurriculumId(val)
    }
  },
  computed: {
    ...mapState({
      userInfoStore: state => state.user.info,
      currentRole: state => state.user.currentRole,
      userMode: state => state.app.userMode,
      currentSchool: state => state.user.currentSchool
    }),
    canEdit() {
      if (this.userMode === USER_MODE.SELF) {
        return true
      } else {
        return false
      }
    },
    rolesName() {
      if (this.userMode === USER_MODE.SCHOOL) {
        return this.currentSchool.roleNames.map(item => this.upperCaseName(item))
      } else {
        return [this.upperCaseName(this.userInfoStore.currentRole)]
      }
    },
    linkedSchool() {
      if (this.userMode === USER_MODE.SELF) {
        return this.userInfoStore.schoolList.map(item => item.schoolName)
      } else {
        return this.currentSchool.schoolName ? [this.currentSchool.schoolName] : []
      }
    },
    ifShowCreate() {
      const list = [...this.myCreateSchoolOptions, ...this.schoolOptions]
      const findOne = list.find(item => item.name === this.createSchoolName)
      return this.createSchoolName && !findOne
    },
    subjectOptionsFilter() {
      if (this.$store.getters.currentRole === 'student') {
        return this.subjectOptions
      }
      return this.subjectOptions ? this.subjectOptions.filter(subject => subject.subjectType === SubjectType.Skill || subject.subjectType === SubjectType.LearnAndSkill) : []
    },
    validatorRules: function () {
      return {
        firstname: [{ required: true, message: 'Please Input First Name!' }],
        lastname: [{ required: true, message: 'Please Input Last Name!' }],
        email: [
          { required: true, message: 'Please Input Email!' },
          {
            required: false,
            type: 'email',
            message: 'The email is not correct!',
            trigger: 'blur'
          }
        ],
        principleFirstname: [{ required: true, message: 'Please Input First Name!' }],
        principleLastname: [{ required: true, message: 'Please Input Last Name!' }],
        principleEmail: [
          { required: true, message: 'Please Input Email!' },
          {
            required: false,
            type: 'email',
            message: 'The email is not correct!',
            trigger: 'blur'
          }
        ],
        schoolId: [{ required: true, message: 'Please Select a School!' }],
        country: [{ required: true, message: 'Please Select a Country!' }]
      }
    },
    validatorAdminRules: function () {
      return {
        firstname: [{ required: true, message: 'Please Input First Name!' }],
        lastname: [{ required: true, message: 'Please Input Last Name!' }],
        email: [
          { required: true, message: 'Please Input Email!' },
          {
            required: false,
            type: 'email',
            message: 'The email is not correct!',
            trigger: 'blur'
          }
        ],
        position: [{ required: true, message: 'Please Select a Position!' }],
        positionInput: [
          {
            required: this.adminForm.position === 'Other position',
            message: 'Please Input Position!'
          }
        ],
        countryId: [{ required: true, message: 'Please Select a Country!' }],
        country: [{ required: true, message: 'Please Select a Country!' }]
      }
    }
  },
  created () {
    this.debouncedSearchSchool = debounce(this.searchSchool, 500)
    this.debounceGetUserInfo = debounce(this.getUserInfo, 500)
    this.getUserInfo(this.currentSchool)
    this.initDict()
  },
  methods: {
    initDict() {
      getCountry({}).then(res => {
        this.countries = res
      })
    },
    initBasic () {
      this.userInfo.subjects = []
      this.userInfo.gradeNameList = []
      this.userInfo.areaNameList = []
      this.userInfo.avatar = this.userInfoStore.avatar
      this.userInfo.firstname = this.userInfoStore.firstname
      this.userInfo.lastname = this.userInfoStore.lastname
      this.userInfo.nickname = this.userInfoStore.nickname
      this.userInfo.tempNickname = this.userInfoStore.nickname
      this.userInfo.currentRole = this.userInfoStore.currentRole
      this.userInfo.createTime = this.userInfoStore.createTime
      // 区分个人和学校
      if (this.userMode === USER_MODE.SELF) {
        this.userInfo.curriculumId = this.userInfoStore.bindCurriculum
        this.userInfo.subjects = this.userInfoStore.preference.subjects
        this.userInfo.gradeIds = this.userInfoStore.preference.gradeIds
      } else {
        this.userInfo.curriculumId = this.currentSchool.curriculumId || this.userInfoStore.bindCurriculum
        this.userInfo.subjects = this.schoolUserInfo.classes ? this.schoolUserInfo.classes.map(item => item.subject) : []
        this.userInfo.gradeIds = this.schoolUserInfo.grades
      }

      this.userInfo.areaIds = this.userInfoStore.preference.areaIds
      this.userInfo.others = this.userInfoStore.preference.others
      this.userInfo.age = this.userInfoStore.age

      this.userForm.firstname = this.userInfoStore.firstname
      this.userForm.lastname = this.userInfoStore.lastname
      this.userForm.email = this.userInfoStore.email
      this.adminForm.firstname = this.userInfoStore.firstname
      this.adminForm.lastname = this.userInfoStore.lastname
      this.adminForm.email = this.userInfoStore.email

      this.customizedTagIds = []
      this.$store.getters.userInfo.customizedTags.forEach(item => {
        this.customizedTagIds.push({
          'label': item.name,
          'value': item.id
        })
      })
      if (this.gradeOptions && this.gradeOptions.length > 0 && this.userInfo.gradeIds && this.userInfo.gradeIds.length > 0) {
        this.userInfo.gradeNameList = this.gradeOptions.filter(item => this.userInfo.gradeIds.includes(item.id)).map(item => item.name)
      }
      this.$logger.info('user info loaded', this.userInfo)
    },

    initData () {
      this.$logger.info('init data')
      this.initBasic()
      this.loading = true
      if (this.$store.getters.currentRole === 'teacher') {
        Promise.all([
          getAllCurriculums(),
          GetGradesByCurriculumId({ curriculumId: this.userInfo.curriculumId }),
          getAllSubjectsByCurriculumId({ curriculumId: this.userInfo.curriculumId }),
          getCustomizedTags()
        ]).then(response => {
          this.$logger.info('init data', response)
          if (!response[0].code) {
            logger.info('getAllCurriculums response', response[0])
            this.curriculumOptions = response[0].result

            this.curriculumOptions.forEach(item => {
              if (item.id === this.userInfo.curriculumId) {
                this.userInfo.curriculumName = item.name
              }
            })
          }

          if (!response[1].code) {
            this.userInfo.gradeNameList = []
            this.gradeOptions = response[1].result
            this.gradeOptions.forEach(item => {
              if (this.userInfo.gradeIds.indexOf(item.id) !== -1) {
                this.userInfo.gradeNameList.push(item.name)
              }
            })
          }

          if (!response[2].code) {
            this.userInfo.subjectNameList = []
            logger.info('SubjectTree response', response[2])
            this.subjectOptions = response[2].result
            // this.subjectOptions.forEach(option => {
            //   if (this.userInfo.subjectIds.indexOf(option.id) !== -1 && this.userInfo.subjectNameList.indexOf(option.name) === -1) {
            //     this.userInfo.subjectNameList.push(option.name)
            //   } else {
            //     this.$logger.info('subject id ' + option.id + ' dont exist in ', this.userInfo.subjectIds)
            //   }
            // })
          }

          if (!response[3].code) {
            logger.info('getCustomizedTags response', response[3])
            this.customizedTags = response[3].result
            this.customizedTags.forEach(item => {
              item.selectable = item.children.length === 0
            })
          }

          this.loading = false
        }).catch(err => {
          this.$message.error(err)
        }).finally(() => {
          this.loading = false
        })
      } else {
        Promise.all([
          getAllAreas(),
          SubjectStudentList()
        ]).then(response => {
          this.$logger.info('init data', response)
          if (!response[0].code) {
            logger.info('getAllAreas response', response[0])
            this.areaOptions = response[0].result
            this.areaOptions.forEach(item => {
              if (this.userInfo.areaIds.indexOf(item.id) !== -1) {
                this.userInfo.areaNameList.push(item.name)
                this.currentArea = item

                if (item.name === 'Others') {
                  this.userInfo.tempOthers = (this.userInfo.others && this.userInfo.others.length) ? this.userInfo.others[0] : null
                }
              }

              if (item.name === 'Others') {
                this.otherAreaId = item.id
              }
            })
          }

          if (!response[1].code) {
            logger.info('SubjectTree response', response[1])
            this.subjectOptions = response[1].result
            // this.userInfo.subjectNameList = []
            // this.subjectOptions.forEach(option => {
            //   if (this.userInfo.subjectIds.indexOf(option.id) !== -1) {
            //     this.userInfo.subjectNameList.push(option.name)
            //   } else {
            //     this.$logger.info('subject id ' + option.id + ' dont exist in ', this.userInfo.subjectIds)
            //   }
            // })
          }

          this.loading = false
        }).catch(err => {
          this.$message.error(err)
        }).finally(() => {
          this.loading = false
        })
      }
    },

    getUserInfo(currentSchool) {
      if (!this.userInfoStore.username) return
      getUserInfo({
        schoolId: currentSchool.id,
        username: this.userInfoStore.username
      }).then(res => {
        if (res.success) {
          this.schoolUserInfo = { ...res.result }
          this.initData()
        }
      })
    },

    handleSchoolChange(currentSchool) {
      if (this.userMode === USER_MODE.SCHOOL) {
        this.debounceGetUserInfo(currentSchool)
      }
    },
    handleModeChange(userMode) {
      this.debounceGetUserInfo(this.currentSchool)
    },

    handleSelectCurriculumOption (curriculum) {
      logger.info('handleSelectCurriculumOption', curriculum)
      if (this.currentCurriculum === null || this.currentCurriculum.id !== curriculum.id) {
        this.currentSubject = null
        this.userInfo.subjectIds = []
      }
      this.currentCurriculum = curriculum
    },

    handleSelectAreaOption (area) {
      logger.info('handleSelectAreaOption', area)
      this.currentArea = area
    },

    loadSubjectByCurriculumId (curriculumId) {
      this.$logger.info('loadSubjectByCurriculumId ' + curriculumId)
      this.userInfo.subjectIds = []
      this.userInfo.gradeIds = []
      getAllSubjectsByCurriculumId({ curriculumId }).then(response => {
        logger.info('subjectOptions', response.result)
        this.subjectOptions = response.result
      })

      GetGradesByCurriculumId({ curriculumId }).then((response) => {
        logger.info('GetGradesByCurriculumId', response)
        this.gradeOptions = response.result
        logger.info('gradeOptions', this.gradeOptions)
      })
    },

    setAvatar (url) {
      logger.info('setAvatar ' + url)
      this.userInfo.avatar = url
      const userData = {
        avatar: this.userInfo.avatar,
        nickname: this.userInfo.tempNickname,
        id: this.$store.getters.userInfo.id
      }
      editUser(userData).then(response => {
        this.$logger.info('update preference and edit user response', response)
      }).finally(() => {
        this.$store.dispatch('GetInfo').then(() => {
          this.initData()
        })
      })
    },

    saveDetail () {
      let postData = null
      this.loadSaving = true
      if (this.$store.getters.currentRole === 'expert') {
        postData = {
          areaIds: Array.isArray(this.userInfo.areaIds) ? this.userInfo.areaIds : [this.userInfo.areaIds]
        }

        if (postData.areaIds.indexOf(this.otherAreaId) !== -1) {
          this.$logger.info('others ', this.userInfo.tempOthers)
          if (this.userInfo.tempOthers && this.userInfo.tempOthers.length <= 80) {
            postData.others = [this.userInfo.tempOthers]
          } else {
            this.$message.warn('illegal [others] contents')
          }
        }
      } else if (this.$store.getters.currentRole === 'teacher') {
        postData = {
          curriculumId: this.userInfo.curriculumId,
          gradeIds: this.userInfo.gradeIds,
          subjects: this.userInfo.subjects,
          tagIds: this.customizedTagIds.map(function (item) {
            return item.value
          })
        }
      } else if (this.$store.getters.currentRole === 'student') {
        postData = {
          subjectIds: this.userInfo.subjectIds,
          age: this.userInfo.age
        }
      }
      this.$logger.info('tempNickname ', this.userInfo.tempNickname)
      if (this.userInfo.tempNickname && this.userInfo.tempNickname.length < 80) {
        const userData = {
          avatar: this.userInfo.avatar,
          nickname: this.userInfo.tempNickname,
          id: this.$store.getters.userInfo.id,
          currentRole: this.userInfo.currentRole
        }

        this.$logger.info('update preference and edit user post data', postData, userData)
        const promises = [editUser(userData)]
        // 学校模式下不能修改
        if (this.canEdit) {
          promises.push(addPreference(postData))
        }
        Promise.all(promises).then(response => {
          this.$logger.info('update preference and edit user response', response)
        }).finally(() => {
          this.$store.dispatch('GetInfo').then(() => {
            this.initData()
            this.editMode = false
            this.loadSaving = false
          })
        })
      } else {
        this.$message.warn('illegal nickname')
      }
    },

    cancelDetail() {
      this.initBasic()
      this.editMode = false
    },

    onChange (value) {
      if (!value) {
        this.$emit('change', '')
        this.treeValue = null
      } else if (value instanceof Array) {
        this.$emit('change', value.map(item => item.value).join(','))
        this.treeValue = value
      } else {
        this.$emit('change', value.value, value.label)
        this.treeValue = value
      }
    },
    onSearch (value) {
      console.log(value)
    },
    handleSetting () {
      this.settingVisible = true
    },
    onChangeSwitch (checked) {
      this.disableQuestion = !checked
      UserSetting({
        disableQuestion: this.disableQuestion
      }).then((response) => {
        this.$logger.info('UserSetting', response.result)
        if (response.success) {
          this.$store.dispatch('GetInfo')
        } else {
          this.$message.error(response.message)
        }
      }).finally(() => {
      })
    },
    filterOptions(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    changeUserSchool(schoolId) {
      const list = [...this.myCreateSchoolOptions, ...this.schoolOptions]
      const findOne = list.find(item => item.id === schoolId)
      if (findOne) {
        findOne.country && (this.userForm.country = findOne.country)
        this.userForm.schoolName = findOne.name
      }
    },
    changeAdminSchool(schoolId) {
      const list = [...this.myCreateSchoolOptions, ...this.schoolOptions]
      const findOne = list.find(item => item.id === schoolId)
      if (findOne) {
        findOne.country && (this.adminForm.country = findOne.country)
        this.adminForm.schoolName = findOne.name
      }
    },
    doSaveUserForm() {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          // 同名 同国家 才是同学校，否则不是同学校
          const school = this.myCreateSchoolOptions.find(item => item.id === this.userForm.schoolId)
          const createdSchool = this.schoolOptions.find(item => item.id === this.userForm.schoolId)
          if (school || (createdSchool && createSchool.country !== this.userForm.country)) {
            this.confirmLoading = true
            createSchool({
              name: (school || createdSchool).name,
              country: this.userForm.country,
              principleEmail: this.userForm.principleEmail,
              principleFirstname: this.userForm.principleFirstname,
              principleLastname: this.userForm.principleLastname,
              curriculumId: this.userInfo.curriculumId
            }).then(res => {
              if (res.success) {
                if (school) {
                  school.id = res.result.id
                }
                if (createdSchool) {
                  this.schoolOptions.push({
                    id: res.result.id,
                    name: res.result.name
                  })
                }
                this.userForm.schoolId = res.result.id
                this.userForm.schoolName = res.result.name
                SchoolPrincipleSave(this.userForm).then(res => {
                  if (res.success) {
                    this.$message.success('Send successfully')
                    this.userFormVisible = false
                  }
                })
              }
            }).finally(res => {
              this.confirmLoading = false
            })
          } else {
            this.confirmLoading = true
            SchoolPrincipleSave(this.userForm).then(res => {
              if (res.success) {
                this.$message.success('Send successfully')
                this.userFormVisible = false
              }
            }).finally(res => {
              this.confirmLoading = false
            })
          }
        }
      })
    },
    doSaveAdminForm() {
      this.$refs.adminForm.validate(valid => {
        if (valid) {
          const school = this.myCreateSchoolOptions.find(item => item.id === this.adminForm.schoolId)
          const createdSchool = this.schoolOptions.find(item => item.id === this.adminForm.schoolId)
          // if (school || (createdSchool && createSchool.country !== this.adminForm.country)) {
          //   this.confirmLoading = true
          //   createSchool({
          //     name: (school || createdSchool).name,
          //     country: this.adminForm.country,
          //     principleEmail: this.adminForm.email,
          //     principleFirstname: this.adminForm.firstname,
          //     principleLastname: this.adminForm.lastname,
          //     curriculumId: this.userInfo.curriculumId
          //   }).then(res => {
          //     if (res.success) {
          //       if (school) {
          //         school.id = res.result.id
          //       }
          //       if (createdSchool) {
          //         this.schoolOptions.push({
          //           id: res.result.id,
          //           name: res.result.name
          //         })
          //       }
          //       this.adminForm.schoolId = res.result.id
          //       this.adminForm.schoolName = res.result.name
          //       QuotationAddOrUpdate(this.adminForm).then(res => {
          //         if (res.success) {
          //           this.$message.success('Send successfully')
          //         }
          //       })
          //     }
          //   }).finally(res => {
          //     this.confirmLoading = false
          //   })
          // } else {
            this.confirmLoading = true
            if (school || (createdSchool && createSchool.country !== this.adminForm.country)) {
              this.adminForm.schoolId = null
            }
            QuotationAddOrUpdate(this.adminForm).then(res => {
              if (res.success) {
                this.$message.success('Send successfully')
                this.userFormVisible = false
                this.adminFormVisible = false
              }
            }).finally(res => {
              this.confirmLoading = false
            })
          // }
        }
      })
    },
    handleSearchSchool(value) {
      this.createSchoolName = value
      this.debouncedSearchSchool(value)
    },
    searchSchool(value) {
      if (!value) return
      getSchools({
        // curriculumId: this.userInfo.curriculumId,
        name: value
      }).then(res => {
        logger.info('schools', res)
        if (res.success) {
          this.schoolOptions = res.result || []
        } else {
          this.schoolOptions = []
        }
      })
    },
    handleCreateSchool(formName) {
      // 保存的时候在真正创建学校
      const res = {
        id: new Date().getTime(),
        name: this.createSchoolName
      }
      this.myCreateSchoolOptions.push(res)
    },
    upperCaseName(name) {
      return name.substr(0, 1).toUpperCase() + name.substr(1)
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";
.profile-title {
  font-size: 24px;
  color: @primary-color;
  margin-left: 20px;
}

.account-settings-info-view {
  position: relative;
  min-height: 300px;

  .loading-wrapper {
    //min-height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.avatar-upload-wrapper {
  height: 200px;
  width: 100%;
}

.username-line {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  .user-name {
    font-size: 25px;
    padding-left: 30px;
  }
}

.ant-upload-preview {
  position: relative;
  width: 100%;
  max-width: 180px;
  border-radius: 50%;
  box-shadow: 0 0 4px #ccc;

  .upload-icon {
    display: none;
    position: absolute;
    top: 0;
    right: 10px;
    font-size: 1.4rem;
    padding: 0.5rem;
    background: rgba(222, 221, 221, 0.7);
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }

  &:hover {
    .upload-icon {
      display: block;
    }
  }

  .mask {
    opacity: 0;
    position: absolute;
    background: rgba(0, 0, 0, 0.4);
    cursor: pointer;
    transition: opacity 0.4s;

    &:hover {
      opacity: 1;
    }

    i {
      font-size: 2rem;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -1rem;
      margin-top: -1rem;
      color: #d6d6d6;
    }
  }

  img, .mask {
    width: 100%;
    max-width: 180px;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
  }
}

.profile-item-line {
  line-height: 30px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  font-size: 16px;
  margin-bottom: 20px;

  .profile-label {
    width: 200px;
    font-weight: 500;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    cursor: pointer;
    padding-right: 5px;

    .label-txt {
      padding: 0 5px;
    }
  }

  .profile-data {
    width: 50%;
    font-weight: 600;
    color: #000;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;

    .profile-tag-item {
      padding: 5px;

      .ant-tag {
        color: #000;
      }
    }

    .ant-select {
      width: 100%;
    }
  }

  .edit-action {
    display: none;
    padding-left: 10px;
  }

  &:hover {
    .edit-action {
      display: block;
      color: @primary-color;
    }
  }
}

.edit-action-wrapper {
  // width: 300px;
  cursor: pointer;
  text-align: left;
  color: @primary-color;
  font-weight: 500;
  margin-left: 400px;
}

.submit-action-wrapper {
  text-align: left;
  margin-left: 150px;
  margin-right: 20px;
}

.submit-action-wrapper-second {
  text-align: left;
  margin-right: 20px;
}

.action-line {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.area-input {
  margin-top: 10px;
}

.linked-school-name {
  border-radius: 6px;
  padding: 0 10px;
  line-height: 23px;
  border: 1px solid #ffc001;
  background: #ffc001;
  color: #fff;
}

.no-linked-school-name {
  border-radius: 3px;
  padding: 0 10px;
  line-height: 23px;
  border: 1px solid #15c39a;
  background: #fff;
  color: #15c39a;
}

.account-info {
  position: relative;
  width: 100%;
  .account-info-title {
    font-size: 14px;
    text-align: left;
  }
  .account-info-sub {
    color: @primary-color;
    width: 100%;
    text-align: right;
  }
  .account-info-form {
    margin-top: 20px;
  }
}
</style>
