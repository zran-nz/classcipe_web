<template>
  <a-modal
    v-model="visible"
    width="600px"
    :dialog-style="{ top: '50px' }"
    :maskClosable="false"
    :keyboard="false"
    :footer="null"
    :closable="false"
  >
    <div class="main-content">
      <div class="">
        <div><img src="~@/assets/logo/logo2.png" class="logo" /></div>
        <div class="desc">Welcome to Classcipe</div>
        <div class="desc2">Fill in your personal information to start.</div>
      </div>

      <div class="form-items">
        <a-form-model
          ref="teacherForm"
          :model="teacherForm"
          :rules="teacherRules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item key="Curriculum" label="Curriculum" prop="curriculumId">
            <a-select :getPopupContainer="trigger => trigger.parentElement" v-model="teacherForm.curriculumId" placeholder="Please select curriculum">
              <a-select-option
                :value="curriculumOption.id"
                v-for="curriculumOption in curriculumOptions"
                :key="curriculumOption.id"
                @click.native="handleSelectCurriculumOption(curriculumOption)"
              >{{ curriculumOption.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item key="School" label="School" prop="school">
            <a-select
              v-model="teacherForm.school"
              ref="schoolRef"
              :getPopupContainer="trigger => trigger.parentElement"
              placeholder="Please select school"
              show-search
              :default-active-first-option="false"
              :show-arrow="false"
              :filter-option="false"
              :allow-clear="true"
              :not-found-content="null"
              option-label-prop="label"
              @search="handleSearchSchool"
              @focus="handleSearchSchool"
              @change="handleChange"
            >
              <div slot="dropdownRender" slot-scope="menu">
                <v-nodes :vnodes="menu" />
                <div v-if="ifShowCreate">
                  <a-divider style="margin: 4px 0;" />
                  <div
                    style="padding: 4px 8px; cursor: pointer;"
                    @mousedown="e => e.preventDefault()"
                    @click="createSchool"
                  >
                    Create School: <a-tag color="#15c39a">{{ searchText }}</a-tag>
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

          <a-form-model-item label="Country/Region">
            <a-select
              v-model="teacherForm.country"
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

          <a-form-model-item key="Subject" label="Subject" prop="subjects">
            <a-select
              :getPopupContainer="trigger => trigger.parentElement"
              v-model="teacherForm.subjects"
              mode="multiple"
              :filter-option='false'
              class='my-only-select'>
              <template v-for="subject in subjectOptions" >
                <a-select-option
                  :value="subject.name"
                  v-if="subject.subjectType === subjectType.Skill || subject.subjectType === subjectType.LearnAndSkill"
                  :key="subject.name"
                >{{ subject.name }}
                </a-select-option>
              </template>
            </a-select>
          </a-form-model-item>

          <a-form-model-item key="Grade" label="Grade" prop="gradeIds">
            <a-select
              :getPopupContainer="trigger => trigger.parentElement"
              v-model="teacherForm.gradeIds"
              placeholder="Please select grade"
              mode="multiple">
              <a-select-option
                :value="gradeOption.id"
                v-for="gradeOption in gradeOptions"
                :key="gradeOption.id"
              >{{ gradeOption.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-form-model>
      </div>

      <div class="save-btn">
        <a-button type="primary" block size="large" @click="save">Start now</a-button>
      </div>

    </div>
  </a-modal>
</template>

<script>
import {
  addPreference,
  getAllCurriculums,
  getAllSubjectsByCurriculumId,
  GetGradesByCurriculumId
} from '@/api/preference'
import { getCountry } from '@/api/v2/country'
import { createSchool, getSchools } from '@/api/school'
import * as logger from '@/utils/logger'
import { SubjectType, USER_MODE } from '@/const/common'
import storage from 'store'
import { CURRENT_ROLE, IS_ADD_PREFERENCE } from '@/store/mutation-types'
import { mapState } from 'vuex'

const { debounce } = require('lodash-es')

export default {
  name: 'AddPreference',
  components: {
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes
    }
  },
  data() {
    return {
      visible: false,

      labelCol: { lg: { span: 5 }, sm: { span: 5 } },
      wrapperCol: { lg: { span: 19 }, sm: { span: 19 } },

      teacherForm: {
        curriculumId: null,
        school: null,
        subjects: [],
        gradeIds: [],
        country: undefined
      },
      teacherRules: {
        curriculumId: [{ required: true, message: 'Please select curriculum', trigger: 'blur' }],
        school: [{ required: false, message: 'Please select school', trigger: 'blur' }],
        subjects: [{ required: true, message: 'Please select subject', trigger: 'blur' }],
        gradeIds: [{ required: true, message: 'Please select grade', trigger: 'blur' }],
        country: [{ required: false, message: 'Please select country', trigger: 'blur' }]
      },

      currentCurriculum: null,

      curriculumOptions: [],
      schoolOptions: [],
      subjectOptions: [],
      gradeOptions: [],
      subjectType: SubjectType,

      searchText: '',
      myCreateSchoolOptions: [],

      countries: []
    }
  },
  computed: {
    ...mapState({
      info: state => state.user.info,
      currentSchool: state => state.user.currentSchool,
      userMode: state => state.app.userMode
    }),
    ifShowCreate() {
      const list = [...this.myCreateSchoolOptions, ...this.schoolOptions]
      const findOne = list.find(item => item.name === this.searchText)
      return this.searchText && !findOne
    }
  },
  created() {
    this.debouncedSearchSchool = debounce(this.searchSchool, 500)
    this.initOptions()
    // this.showModal()
  },
  watch: {
    'teacherForm.curriculumId'(val) {
      console.info('teacherForm.curriculumId change', val)
      this.loadSubjectByCurriculumId(val)
    }
  },
  methods: {
    showModal() {
      if (!storage.get(IS_ADD_PREFERENCE) && storage.get(CURRENT_ROLE) === 'teacher') {
        if (USER_MODE.SELF === this.userMode) {
          this.visible = true
        } else {
          // 跳转admin
          if (this.currentSchool && this.currentSchool.roleNames && this.currentSchool.roleNames.length > 0) {
            const roleNames = this.currentSchool.roleNames.map(item => item ? item.toLowerCase() : '')
            if (roleNames.includes('admin')) {
              this.$router.push('/manage/school-info')
            }
          }
        }
      }
    },
    hideModal() {
      this.visible = false
    },
    initOptions() {
      getCountry({}).then(res => {
        this.countries = res
      })
      getAllCurriculums().then(response => {
        console.info('getAllCurriculums', response)
        this.curriculumOptions = response.result
        console.info('getAllCurriculums', this.curriculumOptions)
      })
    },
    filterOptions(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    handleSelectCurriculumOption(curriculum) {
      console.info('handleSelectCurriculumOption', curriculum)
      if (this.currentCurriculum === null || this.currentCurriculum.id !== curriculum.id) {
        this.teacherForm.subjects = []
        this.teacherForm.school = null
        this.schoolOptions = []
      }
      this.currentCurriculum = curriculum
    },
    handleSelectSchool(school) {
      this.currentSchool = school
      console.info('currentSchool', school)
    },
    // 加载所有的subject 按照一级分类进行分组
    loadSubjectByCurriculumId(curriculumId) {
      this.teacherForm.subjects = []
      this.teacherForm.gradeIds = []
      getAllSubjectsByCurriculumId({ curriculumId }).then(response => {
        console.info('subjectOptions', response.result)
        this.subjectOptions = response.result
      })

      GetGradesByCurriculumId({ curriculumId }).then(response => {
        console.info('GetGradesByCurriculumId', response)
        this.gradeOptions = response.result
        console.info('gradeOptions', this.gradeOptions)
      })
    },
    handleSearchSchool(value) {
      this.searchText = value
      this.debouncedSearchSchool(value)
    },
    handleChange(schoolId) {
      const list = [...this.myCreateSchoolOptions, ...this.schoolOptions]
      const findOne = list.find(item => item.id === schoolId)
      if (findOne && findOne.country) {
        this.teacherForm.country = findOne.country
      }
    },
    searchSchool(value) {
      if (!value) return
      getSchools({
        // curriculumId: this.currentCurriculum.id,
        name: value
      }).then(res => {
        console.info('schools', res)
        if (res.success) {
          this.schoolOptions = res.result || []
        } else {
          this.schoolOptions = []
        }
      })
    },
    createSchool() {
       // 保存的时候在真正创建学校
      const res = {
        id: new Date().getTime(),
        name: this.searchText
      }
      this.myCreateSchoolOptions.push(res)
      this.teacherForm.school = res.id
      this.$refs.schoolRef.$el.click()
    },
    save() {
      this.$refs.teacherForm.validate(valid => {
        if (valid) {
          console.info('save teacher', this.teacherForm)
          const school = this.myCreateSchoolOptions.find(item => item.id === this.teacherForm.school)
          const createdSchool = this.schoolOptions.find(item => item.id === this.teacherForm.school)
          if (school || (createdSchool && createSchool.country !== this.teacherForm.country)) {
            this.confirmLoading = true
            createSchool({
              name: (school || createdSchool).name,
              country: this.teacherForm.country,
              curriculumId: this.teacherForm.curriculumId
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
                this.teacherForm.school = res.result.id
                const param = {
                  curriculumId: this.teacherForm.curriculumId,
                  subjects: this.teacherForm.subjects,
                  gradeIds: this.teacherForm.gradeIds,
                  school: this.teacherForm.school
                }
                addPreference(param).then(res => {
                  if (res.success) {
                    this.$store.dispatch('GetInfo')
                    this.hideModal()
                  } else {
                    this.$message.error(res.message)
                  }
                })
              }
            }).finally(res => {
              this.confirmLoading = false
            })
          } else {
            const param = {
              curriculumId: this.teacherForm.curriculumId,
              subjects: this.teacherForm.subjects,
              gradeIds: this.teacherForm.gradeIds,
              school: this.teacherForm.school
            }
            addPreference(param).then(res => {
              if (res.success) {
                this.$store.dispatch('GetInfo')
                this.hideModal()
              } else {
                this.$message.error(res.message)
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="less">
.ant-select-dropdown {
  z-index: 9999;
}
</style>
<style lang="less" scoped>
@import '~@/components/index.less';
.main-content {
  text-align: center;
  padding: 30px 35px 30px;

  .logo {
    margin-bottom: 5px;
    width: 88px;
    height: 88px;
  }
  .name {
    margin-bottom: 10px;
  }
  .desc {
    margin-bottom: 5px;
    font-size: 16px;
    color: #000;
    font-family: FZCuYuan-M03S;
    font-weight: 800;
  }
  .desc2 {
    font-size: 16px;
    margin-bottom: 20px;
  }
  .save-btn {
    margin-bottom: 20px;
  }
  .skip-btn {
    text-align: left;
  }
  .form-items {
    text-align: left;
  }
}
</style>
