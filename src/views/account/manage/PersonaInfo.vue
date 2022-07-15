<template>
  <div class='my-full-form-wrapper' id='formRoot'>
    <fixed-form-header>
      <template v-slot:header>
        <form-header
          title='Persona Info'
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
          <a-form-model-item label="Email">
            {{ formModel.email }}
          </a-form-model-item>
          <a-form-model-item class="mb0" label="Name">
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
          <a-form-model-item label="Self intro">
            <a-textarea :auto-size="{ minRows: 3}" size="large" v-model="formModel.notes" placeholder="input your self intro" />
          </a-form-model-item>
          <a-form-model-item class="form-btn" :wrapperCol="{offset: 6}">
            <a-button :loading="loading" @click="handleSave" type="primary">Save</a-button>
          </a-form-model-item>
        </a-form-model>
      </a-spin>
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

import { getCountry, getCity } from '@/api/v2/country'
// import country from '@/api/country'
import countryCode from '@/api/countryCode'
import { editUser } from '@/api/user'

import { mapState } from 'vuex'
import { UpdatePersonalInfo, updatePersonalInfo } from '@/api/login'
const { debounce } = require('lodash-es')

export default {
  name: 'PersonaInfo',
  mixins: [UserModeMixin, CurrentSchoolMixin],
  components: {
    FixedFormHeader,
    FormHeader,
    SchoolStudentAdd
  },
  data() {
    return {
      USER_MODE: USER_MODE,
      SCHOOL_USER_STATUS: SCHOOL_USER_STATUS,
      genderOptions: [{
        label: 'Male',
        value: '0'
      }, {
        label: 'Female',
        value: '1'
      }, {
        label: 'Others',
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
      citys: []
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
      currentSchool: state => state.user.currentSchool,
      info: state => state.user.info
    }),
    // citys() {
    //   if (this.formModel && this.formModel.country && this.country) {
    //     const current = this.country.find(item => item.en === this.formModel.country)
    //     const stations = current ? (current.Station || []) : []
    //     let cities = []
    //     stations.forEach(station => {
    //       if (station.City) {
    //         if (Array.isArray(station.City)) {
    //           if (station.City.length > 0) {
    //             cities = cities.concat(...station.City)
    //           }
    //         } else {
    //           cities = cities.concat([station.City])
    //         }
    //       }
    //     })
    //     console.log(cities)
    //     return cities
    //   }
    //   return []
    // },
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
</style>
