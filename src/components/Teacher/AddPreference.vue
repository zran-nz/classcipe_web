<template>
  <a-modal
    v-model="visible"
    width="600px"
    :maskClosable="false"
    :keyboard="false"
    :footer="null"
    @cancel="handleCancel"
  >
    <div class="main-content">
      <div class="">
        <div><img src="~@/assets/logo/logo2.png" class="logo" /></div>
        <div class="desc">Welcome to Classcipe</div>
        <div class="desc2">Fill in your personal information to start the teaching experience right away</div>
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
            <a-select v-model="teacherForm.curriculumId" placeholder="Please select curriculum">
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
            <a-select v-model="teacherForm.school" placeholder="Please select school">
              <a-select-option
                :value="schoolOption.id"
                v-for="schoolOption in schoolOptions"
                :key="schoolOption.id"
                @click.native="handleSelectSchool(schoolOption)"
              >{{ schoolOption.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item
            key="SchoolInput"
            label="SchoolInput"
            prop="school"
            v-if="this.currentSchool && this.currentSchool.id === '-1'"
          >
            <a-input v-model="teacherForm.schoolinput" placeholder="Please input your school" />
          </a-form-model-item>

          <a-form-model-item key="Subject" label="Subject" prop="subjectIds">
            <a-select v-model="teacherForm.subjectIds" mode="multiple">
              <a-select-option
                :value="subject.id"
                v-if="subject.subjectType === subjectType.Learn || subject.subjectType === subjectType.LearnAndSkill"
                v-for="subject in subjectOptions"
                :key="subject.id"
              >{{ subject.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item key="Grade" label="Grade" prop="gradeIds">
            <a-select v-model="teacherForm.gradeIds" placeholder="Please select grade" mode="multiple">
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
      <div class="skip-btn">
        <a-button type="link" @click="handleCancel">Don't want to fill it in now, remind me later ></a-button>
      </div>
    </div>
  </a-modal>
</template>

<script>
import { addPreference, getAllCurriculums, getAllSubjectsByCurriculumId, GetGradesByCurriculumId } from '@/api/preference'
import { getSchools } from '@/api/school'
import * as logger from '@/utils/logger'
import { SubjectType } from '@/const/common'
import storage from 'store'
import { ADD_PREFERENCE_SKIP_TIME, CURRENT_ROLE, IS_ADD_PREFERENCE } from '@/store/mutation-types'

export default {
  name: 'AddPreference',
  data() {
    return {
      visible: false,

      labelCol: { lg: { span: 5 }, sm: { span: 5 } },
      wrapperCol: { lg: { span: 19 }, sm: { span: 19 } },

      teacherForm: {
        curriculumId: null,
        school: null,
        schoolinput: null,
        subjectIds: [],
        gradeIds: []
      },
      teacherRules: {
        curriculumId: [{ required: true, message: 'Please select curriculum', trigger: 'blur' }],
        school: [{ required: true, message: 'Please select school', trigger: 'blur' }],
        schoolinput: [{ required: true, message: 'Please input your school', trigger: 'blur' }],
        subjectIds: [{ required: true, message: 'Please select subject', trigger: 'blur' }],
        gradeIds: [{ required: true, message: 'Please select grade', trigger: 'blur' }]
      },

      currentCurriculum: null,
      currentSchool: null,

      curriculumOptions: [],
      schoolOptions: [],
      subjectOptions: [],
      gradeOptions: [],
      subjectType: SubjectType
    }
  },
  created() {
    this.initOptions()
    this.showModal()
  },
  watch: {
    'teacherForm.curriculumId'(val) {
      logger.info('teacherForm.curriculumId change', val)
      this.loadSubjectByCurriculumId(val)
      this.loadSchoolByCurriculumId(val)
    }
  },
  methods: {
    showModal() {
      if (
        (!storage.get(ADD_PREFERENCE_SKIP_TIME) || storage.get(ADD_PREFERENCE_SKIP_TIME) < Date.now()) &&
        !storage.get(IS_ADD_PREFERENCE) &&
        storage.get(CURRENT_ROLE) === 'teacher'
      ) {
        this.visible = true
      }
    },
    hideModal() {
      this.visible = false
    },
    handleCancel() {
      this.hideModal()
      storage.set(ADD_PREFERENCE_SKIP_TIME, Date.now() + 7 * 24 * 60 * 60 * 1000)
    },
    initOptions() {
      getAllCurriculums().then(response => {
        logger.info('getAllCurriculums', response)
        this.curriculumOptions = response.result
        logger.info('getAllCurriculums', this.curriculumOptions)
      })
    },
    handleSelectCurriculumOption(curriculum) {
      logger.info('handleSelectCurriculumOption', curriculum)
      if (this.currentCurriculum === null || this.currentCurriculum.id !== curriculum.id) {
        this.teacherForm.subjectIds = []
      }
      this.currentCurriculum = curriculum
    },
    handleSelectSchool(school) {
      this.currentSchool = school
      logger.info('currentSchool', school)
    },
    // 加载所有的subject 按照一级分类进行分组
    loadSubjectByCurriculumId(curriculumId) {
      this.teacherForm.subjectIds = []
      this.teacherForm.gradeIds = []
      getAllSubjectsByCurriculumId({ curriculumId }).then(response => {
        logger.info('subjectOptions', response.result)
        this.subjectOptions = response.result
      })

      GetGradesByCurriculumId({ curriculumId }).then(response => {
        logger.info('GetGradesByCurriculumId', response)
        this.gradeOptions = response.result
        logger.info('gradeOptions', this.gradeOptions)
      })
    },
    loadSchoolByCurriculumId(curriculumId) {
      this.teacherForm.school = null
      getSchools({ curriculumId }).then(response => {
        logger.info('schools', response)
        this.schoolOptions = [...response.result, { id: '-1', name: 'other' }]
      })
    },
    save() {
      this.$refs.teacherForm.validate(valid => {
        if (valid) {
          logger.info('save teacher', this.teacherForm)
          let param = {}
          if (this.teacherForm.school === '-1') {
            param = {
              curriculumId: this.teacherForm.curriculumId,
              subjectIds: this.teacherForm.subjectIds,
              gradeIds: this.teacherForm.gradeIds,
              school: this.teacherForm.schoolinput
            }
          } else {
            param = {
              curriculumId: this.teacherForm.curriculumId,
              subjectIds: this.teacherForm.subjectIds,
              gradeIds: this.teacherForm.gradeIds,
              school: this.teacherForm.school
            }
          }
          addPreference(param).then(response => {
            this.hideModal()
          })
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
  padding: 30px 35px 80px;

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
}
</style>
