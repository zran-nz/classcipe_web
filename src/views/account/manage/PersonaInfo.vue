<template>
  <div class='my-full-form-wrapper' id='formRoot'>
    <fixed-form-header>
      <template v-slot:header>
        <form-header
          title='Personal Info'
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
      <a-spin :spinning="loading">
        <a-form-model
          layout="horizontal"
          :model="formModel"
          v-bind="formItemLayout"
          :rules="validatorRules"
          ref="form">
          <a-form-model-item :colon="false" style="display:flex;align-items: center;">
            <div slot="label" class="ant-upload-preview" @click="$refs.avatarModal.edit(1)">
              <a-icon type="cloud-upload-o" class="upload-icon"/>
              <div class="mask">
                <a-icon type="plus"/>
              </div>
              <img :src="formModel.avatar" v-if="formModel.avatar"/>
              <img src="~@/assets/icons/library/default-avatar.png" v-else/>
            </div>
            <div>{{ formModel.email }}</div>
            <a-row :gutter="10">
              <a-col :span="12">
                <a-form-model-item prop="firstname">
                  <a-input v-model="formModel.firstname" placeholder="First Name" />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item prop="lastname">
                  <a-input v-model="formModel.lastname" placeholder="Last Name" />
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model-item>
          <a-divider/>
          <div class="profile-title">
            {{ userMode === USER_MODE.SELF ? 'Personal account' : `School account: ${currentSchool.schoolName}` }}
          </div>
          <a-form-model-item label="Role" v-if="userMode === USER_MODE.SCHOOL">
            <a-space class="profile-text profile-data">
              <a-tag v-for="roleName in rolesName" :key="'roleName_'+roleName"> {{ roleName }} </a-tag>
            </a-space>
          </a-form-model-item>
          <a-form-model-item label="Member since">
            <div class="profile-text profile-data">
              <template v-if="userMode === USER_MODE.SELF">
                {{ info.createTime | dayjs }}
              </template>
              <template v-else>
                {{ currentSchool.schoolJoinDate | dayjs }}
              </template>
            </div>
          </a-form-model-item>
          <a-form-model-item class="mb0" label="Address" :required="true">
            <a-row :gutter="10">
              <a-col :span="12">
                <a-form-model-item prop="country">
                  <a-select
                    v-model="formModel.country"
                    show-search
                    @change="changeCountry"
                    placeholder="Please Select a Country"
                    option-filter-prop="children"
                    :filter-option="filterOptions"
                    :getPopupContainer="target => target.parentNode"
                  >
                    <a-select-option
                      v-for="param in country"
                      :value="param.en"
                      :key="'country_' + param.en"
                    >
                      {{ param.en }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item>
                  <a-select
                    v-model="formModel.city"
                    show-search
                    placeholder="Please Input Keyword"
                    option-filter-prop="children"
                    :filter-option="false"
                    :not-found-content="fetching ? undefined : null"
                    @search="fetchCity"
                    :getPopupContainer="target => target.parentNode"
                  >
                    <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                    <a-select-option
                      v-for="param in citys"
                      :value="param.desc"
                      :key="'city_' + param.desc"
                    >
                      {{ param.desc }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item>
                  <a-input v-model="formModel.address" placeholder="Please enter address"/>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model-item>
          <a-form-model-item label="Age" v-hasRole="['student']">
            <a-select
              v-model="formModel.age"
              placeholder="Please Select a Age"
              :getPopupContainer="target => target.parentNode"
            >
              <a-select-option
                v-for="param in ageOptions"
                :value="param"
                :key="'age-' + param"
              >
                {{ param }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="Gender">
            <a-select
              v-model="formModel.gender"
              placeholder="Please Select a Gender"
              :getPopupContainer="target => target.parentNode"
            >
              <a-select-option
                v-for="param in genderOptions"
                :value="param.value"
                :key="'gender-' + param.label"
              >
                {{ param.label }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="Linked School(s)">
            <div class="profile-text profile-data">
              <a-space v-if="linkedSchool.length > 0">
                <a-tag color="#ffc001" v-for="item in linkedSchool" :key="'linkedSchool_'+item"> {{ item }} </a-tag>
              </a-space>
              <!-- <div v-if="linkedSchool.length===0 && currentRole === 'teacher'"> -->
              <a-button size="small" style="line-height: 20px;" type="primary" @click="handleRefer">Refer principal</a-button>
              <!-- </div> -->
              <div class='no-linked-school-name' v-if="linkedSchool.length===0 && currentRole === 'student'">You have not linked to any school</div>
            </div>
          </a-form-model-item>
          <a-form-model-item label="Self intro">
            <a-textarea :auto-size="{ minRows: 3}" size="large" v-model="formModel.notes" placeholder="input your self intro" />
          </a-form-model-item>
          <a-form-model-item class="form-btn" :wrapperCol="{offset: 6}">
            <a-button :loading="loading" @click="handleSave" type="primary">Save</a-button>
          </a-form-model-item>
        </a-form-model>
      </a-spin>
    </div>
    <avatar-modal ref="avatarModal" @ok="setAvatar"/>
    <refer-school ref="referSchool"/>
  </div>
</template>

<script>
import { USER_MODE, SCHOOL_USER_STATUS } from '@/const/common'
import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'

import FixedFormHeader from '@/components/Common/FixedFormHeader'
import FormHeader from '@/components/FormHeader/FormHeader'
import SchoolStudentAdd from './schoolUser/SchoolStudentAdd'
import AvatarModal from '@/views/account/settings/AvatarModal'
import ReferSchool from './persona/ReferSchool'

import { getCountry, getCity } from '@/api/v2/country'
// import country from '@/api/country'
import countryCode from '@/api/countryCode'
import { editUser } from '@/api/user'

import { mapState } from 'vuex'
import { UpdatePersonalInfo } from '@/api/login'
const { debounce } = require('lodash-es')

export default {
  name: 'PersonaInfo',
  mixins: [UserModeMixin, CurrentSchoolMixin],
  components: {
    FixedFormHeader,
    FormHeader,
    SchoolStudentAdd,
    AvatarModal,
    ReferSchool
  },
  data() {
    return {
      USER_MODE: USER_MODE,
      SCHOOL_USER_STATUS: SCHOOL_USER_STATUS,
      ageOptions: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
      genderOptions: [{
        label: 'Male',
        value: '0'
      }, {
        label: 'Female',
        value: '1'
      }, {
        label: 'Other',
        value: '-1'
      }],
      country: [],
      countryCode: countryCode,
      loading: false,
      formModel: {
        firstname: '',
        lastname: '',
        gender: '',
        avatar: '',
        email: '',
        notes: '',
        address: '',
        age: 8,
        city: undefined,
        country: undefined
      },
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 12 }
      },
      validatorRules: {
        firstname: [{ required: true, message: 'Please Input First Name!' }],
        lastname: [{ required: true, message: 'Please Input Last Name!' }],
        country: [{ required: true, message: 'Please Select country!' }],
        city: [{ required: true, message: 'Please Select city!' }]
      },
      fetching: false,
      citys: [],
      referSchoolVis: false
    }
  },
  created() {
    this.debounceLoad = debounce(this.loadData, 300)
    this.fetchCity = debounce(this.fetchCity, 300)
    this.initDict()
    this.loadData()
  },
  computed: {
    ...mapState({
      userMode: state => state.app.userMode,
      currentRole: state => state.user.currentRole,
      currentSchool: state => state.user.currentSchool,
      info: state => state.user.info
    }),
    rolesName() {
      if (this.userMode === USER_MODE.SCHOOL) {
        return this.currentSchool.roleNames.map(item => this.upperCaseName(item))
      } else {
        return [this.upperCaseName(this.info.currentRole)]
      }
    },
    linkedSchool() {
      if (this.userMode === USER_MODE.SELF) {
        return this.info.schoolList.map(item => item.schoolName)
      } else {
        return this.currentSchool.schoolName ? [this.currentSchool.schoolName] : []
      }
    },
    countryCodeFilter() {
      let filter = []
      if (this.countryCode) {
        filter = this.countryCode.filter(item => !!item.phoneCountryCode).map(item => item.phoneCountryCode)
        filter = Array.from(new Set(filter))
      }
      return filter
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
    initDict() {
      getCountry().then(res => {
        this.country = res
      })
    },
    loadData() {
      if (this.info && this.info.id) {
        this.formModel.id = this.info.id
        this.formModel.firstname = this.info.firstname
        this.formModel.lastname = this.info.lastname
        this.formModel.email = this.info.email
        this.formModel.notes = this.info.notes
        this.formModel.avatar = this.info.avatar
        this.formModel.gender = this.info.gender
        this.formModel.address = this.info.address
        this.formModel.country = this.info.country
        this.formModel.age = this.info.age
        this.formModel.city = this.info.city
      }
    },
    filterOptions(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    changeCountry(val) {
      this.formModel.city = undefined
      this.formModel.country = val
      this.citys = []
    },
    fetchCity(val) {
      const current = this.country.find(item => item.en === this.formModel.country)
      if (current && current.code) {
        this.fetching = true
        getCity({
          country: current.code,
          q: val
        }).then(res => {
          this.citys = res
        }).finally(() => {
          this.fetching = false
        })
      }
    },
    setAvatar (url) {
      this.formModel.avatar = url
      const userData = {
        avatar: this.formModel.avatar,
        id: this.formModel.id
      }
      editUser(userData).then(response => {
        this.$logger.info('update preference and edit user response', response)
      }).finally(() => {
        this.$store.dispatch('GetInfo').then(() => {
          this.loadData()
        })
      })
    },
    handleRefer() {
      this.$refs.referSchool.doCreate({
        firstname: this.formModel.firstname,
        lastname: this.formModel.lastname,
        email: this.formModel.email
      })
    },
    handleSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          UpdatePersonalInfo({
            ...this.formModel
          }).then(res => {
            if (res.success) {
              this.$message.success('Update successfully')
              this.$store.dispatch('GetInfo')
            }
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    upperCaseName(name) {
      return name.substr(0, 1).toUpperCase() + name.substr(1)
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
.mb0 {
  margin-bottom: 0;
}
.form-btn {
  .ant-btn {
    line-height: 1.5!important;
  }
}
.ant-upload-preview {
  position: relative;
  display: inline-block;
  width: 100%;
  max-width: 120px;
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
    max-width: 120px;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
  }
}
.profile-title {
  font-size: 24px;
  color: @primary-color;
  margin-left: 80px;
  margin-bottom: 20px;
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

</style>
