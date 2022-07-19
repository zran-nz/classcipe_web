<template>
  <a-drawer
    destroyOnClose
    placement="right"
    width="600px"
    :visible="visible"
    @close="visible = false"
  >
    <div class="refer-wrapper-row">
      <div class="account-info">
        <div class="account-info-title">
          Complete the form below to send your principal an email about Classcipe
        </div>
        <!-- <div class="account-info-sub">
          <a-button v-show="!adminFormVisible" @click="adminFormVisible = true" type="link">I'm an administrator ></a-button>
          <a-button v-show="adminFormVisible" @click="adminFormVisible = false" type="link">I'm not an administrator ></a-button>
        </div> -->
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
                :getPopupContainer="target => target.parentNode"
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
            <a-form-model-item style="text-align: left;">
              <a-space>
                <a-button type="primary" html-type="submit" :loading="confirmLoading" @click="doSaveUserForm">
                  Send
                </a-button>
                <a-button :loading="confirmLoading" @click="visible = false">
                  Cancel
                </a-button>
              </a-space>
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
                :getPopupContainer="target => target.parentNode"
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
            <a-form-model-item label="I Would Like a Quote For">
              <a-radio-group v-model="adminForm.planFor">
                <a-radio value="1"> Plan for my school </a-radio>
                <a-radio value="2"> Plan for a group </a-radio>
              </a-radio-group>
            </a-form-model-item>
            <a-form-model-item label="Notes">
              <a-input v-model="adminForm.notes" placeholder="Please Input Notes" />
            </a-form-model-item>
            <a-form-model-item style="text-align: left;">
              <a-space>
                <a-button type="primary" html-type="submit" :loading="confirmLoading" @click="doSaveAdminForm">
                  Send
                </a-button>
                <a-button :loading="confirmLoading" @click="visible = false">
                  Cancel
                </a-button>
              </a-space>
            </a-form-model-item>
          </a-form-model>
        </a-spin>
      </div>
    </div>
  </a-drawer>
</template>

<script>
import { createSchool, getSchools } from '@/api/school'
import { SchoolPrincipleSave } from '@/api/schoolPrinciple'
import { QuotationAddOrUpdate } from '@/api/quotation'
import { getCountry } from '@/api/v2/country'

const { debounce } = require('lodash-es')

export default {
  name: 'ReferSchool',
  components: {
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes
    }
  },
  data() {
    return {
      visible: false,
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
        planFor: '1',
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
  created () {
    this.debouncedSearchSchool = debounce(this.searchSchool, 500)
    this.adminFormOrigin = { ...this.adminForm }
    this.userFormOrigin = { ...this.userForm }
    this.initDict()
  },
  computed: {
    ifShowCreate() {
      const list = [...this.myCreateSchoolOptions, ...this.schoolOptions]
      const findOne = list.find(item => item.name === this.createSchoolName)
      return this.createSchoolName && !findOne
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
  methods: {
    initDict() {
      getCountry({}).then(res => {
        this.countries = res
      })
    },
    filterOptions(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    doCreate(info) {
      this.userForm.firstname = info.firstname
      this.userForm.lastname = info.lastname
      this.userForm.email = info.email

      this.adminForm.firstname = info.firstname
      this.adminForm.lastname = info.lastname
      this.adminForm.email = info.email

      this.visible = true
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
          // TODO 需要判断是否已经提交过
          // if (false) {
          //   this.$message.error('You have already referred this principal')
          // }
          // 同名 同国家 才是同学校，否则不是同学校
          const school = this.myCreateSchoolOptions.find(item => item.id === this.userForm.schoolId)
          const createdSchool = this.schoolOptions.find(item => item.id === this.userForm.schoolId)
          if (school || (createdSchool && createdSchool.country !== this.userForm.country)) {
            this.confirmLoading = true
            createSchool({
              name: (school || createdSchool).name,
              country: this.userForm.country,
              principleEmail: this.userForm.principleEmail,
              principleFirstname: this.userForm.principleFirstname,
              principleLastname: this.userForm.principleLastname
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
                    this.visible = false
                    this.userForm = { ...this.userFormOrigin }
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
                this.visible = false
                this.userForm = { ...this.userFormOrigin }
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
          this.confirmLoading = true
          if (school || (createdSchool && createSchool.country !== this.adminForm.country)) {
            this.adminForm.schoolId = null
          }
          QuotationAddOrUpdate(this.adminForm).then(res => {
            if (res.success) {
              this.$message.success('Send successfully')
              this.visible = false
              this.adminForm = { ...this.adminFormOrigin }
            }
          }).finally(res => {
            this.confirmLoading = false
          })
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
    }
  }
}
</script>

<style scoped lang="less">
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
