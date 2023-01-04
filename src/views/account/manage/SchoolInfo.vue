<template>
  <div class='my-full-form-wrapper' id='formRoot'>
    <fixed-form-header>
      <template v-slot:header>
        <form-header
          title='School Info'
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
              <label style="font-weight: normal">School Info</label>
            </a-space>
          </template>
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
          <a-form-model-item label="School Name" prop="name">
            <a-input v-model="formModel.name" placeholder="School Name" />
          </a-form-model-item>
          <a-form-model-item class="mb0" label="School Address" :required="true">
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
              <!-- <a-col :span="24">
                <a-form-model-item>
                  <a-input v-model="formModel.address" placeholder="Please enter address"/>
                </a-form-model-item>
              </a-col> -->
            </a-row>
          </a-form-model-item>
          <a-form-model-item label="Contact No.">
            <a-input v-model="formModel.phoneNum">
              <label
                slot="addonBefore"
                style="width: 100px;display:inline-block;"
              >
                {{ formModel.phoneCountryCode }}
              </label>
            </a-input>
          </a-form-model-item>
          <!-- <a-form-model-item class="form-btn" :wrapperCol="{offset: 6}">
            <a-button :loading="loading" @click="handleSave" type="primary">Save</a-button>
          </a-form-model-item> -->
        </a-form-model>
      </a-spin>
    </div>
    <fixed-form-footer>
      <template v-slot:right>
        <a-button
          :loading="loading"
          type='primary'
          @click='handleSave'
          class='cc-round-button'>
          Save
        </a-button>
      </template>
    </fixed-form-footer>
  </div>
</template>

<script>
import { USER_MODE, SCHOOL_USER_STATUS } from '@/const/common'
import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'

import FixedFormHeader from '@/components/Common/FixedFormHeader'
import FormHeader from '@/components/FormHeader/FormHeader'
import FixedFormFooter from '@/components/Common/FixedFormFooter'
import CustomTextButton from '@/components/Common/CustomTextButton'
import SchoolStudentAdd from './schoolUser/SchoolStudentAdd'

import { getCountry, getCity } from '@/api/v2/country'
// import country from '@/api/country'
import countryCode from '@/api/countryCode'
import { updateSchool, queryById } from '@/api/school'

import { mapState } from 'vuex'
const { debounce } = require('lodash-es')

export default {
  name: 'SchoolInfo',
  mixins: [UserModeMixin, CurrentSchoolMixin],
  components: {
    FixedFormHeader,
    FormHeader,
    SchoolStudentAdd,
    FixedFormFooter,
    CustomTextButton
  },
  data() {
    return {
      USER_MODE: USER_MODE,
      SCHOOL_USER_STATUS: SCHOOL_USER_STATUS,
      country: [],
      countryCode: countryCode,
      loading: false,
      formModel: {
        name: '',
        address: '',
        city: undefined,
        country: undefined,
        phoneNum: '',
        phoneCountryCode: ''
      },
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 12 }
      },
      validatorRules: {
        name: [{ required: true, message: 'Please Input School Name!' }],
        country: [{ required: true, message: 'Please Select country!' }],
        city: [{ required: true, message: 'Please Select city!' }]
      },
      apiKey: process.env.VUE_APP_API_KEY,
      fetching: false,
      citys: []
    }
  },
  created() {
    if (this.userMode != USER_MODE.SCHOOL) {
      this.openV2('/v2/account/info')
    }
    this.debounceLoad = debounce(this.loadData, 300)
    this.fetchCity = debounce(this.fetchCity, 300)
    this.initDict()
    this.loadData()
  },
  computed: {
    ...mapState({
      userMode: state => state.app.userMode,
      currentSchool: state => state.user.currentSchool
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
      this.openV2('/v2/account/info')
    },
    handleSchoolChange(currentSchool) {
      if (this.userMode === USER_MODE.SCHOOL) {
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
        if (!this.formModel.phoneCountryCode && this.formModel.country && this.country) {
          const current = this.country.find(item => item.en === this.formModel.country)
          this.formModel.phoneCountryCode = current.no || ''
        }
      })
    },
    loadData() {
      if (this.currentSchool.id) {
        this.loading = true
        queryById({
          id: this.currentSchool.id
        }).then(res => {
          if (res.code === 0) {
            this.formModel = { ...res.result }
            if (!this.formModel.phoneCountryCode && this.formModel.country && this.country) {
              const current = this.country.find(item => item.en === this.formModel.country)
              this.formModel.phoneCountryCode = current.no || ''
            }
          }
        }).finally(() => {
          this.loading = false
        })
      }
    },
    filterOptions(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    changeCountry(val) {
      const current = this.country.find(item => item.en === val)
      this.formModel.city = undefined
      this.formModel.country = val
      this.formModel.phoneCountryCode = current.no || ''
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
          updateSchool({
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
/deep/ .cc-fixed-form-footer {
  background: #fff;
}
</style>
