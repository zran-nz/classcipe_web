<template>
  <div class="main-content">
    <div class="card-wrapper">
      <div class="card-steps">
        <a-steps :current="currentStep" direction="horizontal">
          <a-step :title="$t('role.step.what-can-you-do')">
            <span style="font-size: 14px" slot="title">{{ $t('result.success.step1-title') }}</span>
          </a-step>
          <a-step :title="$t('role.step.personal-information')" v-if="$store.getters.currentRole === 'expert'">
            <span style="font-size: 14px" slot="title">{{ $t('expert-select-area') }}</span>
          </a-step>
          <a-step :title="$t('role.step.personal-information')" v-if="$store.getters.currentRole === 'teacher'">
            <span style="font-size: 14px" slot="title">{{ $t('teacher-tell-class') }}</span>
          </a-step>
        </a-steps>
      </div>
      <div class="form-items">
        <a-form-model
          ref="expertForm"
          :model="expertForm"
          :rules="expertRules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          v-if="$store.getters.currentRole === 'expert'">
          <a-form-model-item label="Area(s)" prop="areaIds">
            <a-select v-model="expertForm.areaIds" placeholder="Please select">
              <a-select-option :value="areaOption.id" v-for="areaOption in areaOptions" :key="areaOption.id" @click.native="handleSelectAreaOption(areaOption)">{{ areaOption.name }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="Others" ref="others" prop="others" v-show="currentArea && currentArea.name === 'Others'">
            <a-input
              v-model="expertForm.others"
              placeholder="Please input"
              @blur="() => {$refs.others.onFieldBlur();}" />
          </a-form-model-item>
        </a-form-model>

        <a-form-model
          ref="teacherForm"
          :model="teacherForm"
          :rules="teacherRules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          v-if="$store.getters.currentRole === 'teacher'">
          <a-form-model-item label="curriculum" prop="curriculumId">
            <a-select v-model="teacherForm.curriculumId" placeholder="Please select curriculum">
              <a-select-option :value="curriculumOption.id" v-for="curriculumOption in curriculumOptions" :key="curriculumOption.id" @click.native="handleSelectCurriculumOption(curriculumOption)">{{ curriculumOption.name }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="subject" prop="subjectIds">
            <a-select v-model="teacherForm.subjectIds" mode="multiple">
              <a-select-opt-group v-for="subjectOptGroup in subjectOptions" :key="subjectOptGroup.optGroupId">
                <span slot="label">{{ subjectOptGroup.optGroupName }}</span>
                <a-select-option :value="subjectOption.id" v-for="subjectOption in subjectOptGroup.options" :key="subjectOption.id">{{ subjectOption.name }}</a-select-option>
              </a-select-opt-group>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="grade" prop="gradeIds">
            <a-select v-model="teacherForm.gradeIds" placeholder="Please select grade" mode="multiple">
              <a-select-option :value="gradeOption.id" v-for="gradeOption in gradeOptions" :key="gradeOption.id">{{ gradeOption.name }}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-form-model>
      </div>
      <div class="actions">
        <div class="action-first">
          <a-button type="primary" block @click="goBack">
            Last step
          </a-button>
        </div>
        <div class="action-second">
          <a-button type="primary" block @click="saveDetail">
            Save my detail
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defaultDashboardRouter, selectRoleRouter } from '@/config/router.config'
import {
  addPreference,
  getAllAreas,
  getAllCurriculums,
  getAllGrades,
  getAllSubjectsByCurriculumId,
  getAllSubjectsByParentId
} from '@/api/preference'
import * as logger from '@/utils/logger'

export default {
  name: 'AddPreference',
  data () {
    // others validate rule
    const validateOthers = (rule, value, callback) => {
      logger.info('validateOthers', value)
        if (!value && this.currentArea && this.currentArea.name === 'Others') {
          callback(new Error('Please input'))
        } else {
          callback()
        }
    }
    return {
      currentStep: 1,
      labelCol: { lg: { span: 5 }, sm: { span: 5 } },
      wrapperCol: { lg: { span: 19 }, sm: { span: 19 } },

      areaOptions: [],
      expertForm: {
        areaIds: null,
        others: null
      },
      expertRules: {
        areaIds: [
          { required: true, message: 'Please select', trigger: 'blur' }
        ],
        others: [
          { validator: validateOthers, trigger: 'blur' },
          { min: 2, max: 50, message: 'Length should be 2 to 50', trigger: 'blur' }
        ]
      },
      currentArea: null,

      teacherForm: {
        curriculumId: null,
        subjectIds: [],
        gradeIds: []
      },
      teacherRules: {
        curriculumId: [
          { required: true, message: 'Please select curriculum', trigger: 'blur' }
        ],
        subjectIds: [
          { required: true, message: 'Please select subject', trigger: 'blur' }
        ],
        gradeIds: [
          { required: true, message: 'Please select grade', trigger: 'blur' }
        ]
      },
      currentCurriculum: null,
      curriculumOptions: [],
      subjectOptions: [],
      gradeOptions: []
    }
  },
  created () {
    this.initOptions()
  },
  watch: {
    'teacherForm.curriculumId' (val) {
      logger.info('teacherForm.curriculumId change', val)
      this.loadSubjectByCurriculumId(val)
    }
  },
  methods: {
    initOptions () {
      if (this.$store.getters.currentRole === 'expert') {
        getAllAreas().then((response) => {
          logger.info('getAllAreas', response)
          this.areaOptions = response.result
          logger.info('areaOptions', this.areaOptions)
        })
      } else if (this.$store.getters.currentRole === 'teacher') {
        getAllCurriculums().then((response) => {
          logger.info('getAllCurriculums', response)
          this.curriculumOptions = response.result
          logger.info('areaOptions', this.areaOptions)
        })

        getAllGrades().then((response) => {
          logger.info('getAllGrades', response)
          this.gradeOptions = response.result
          logger.info('gradeOptions', this.gradeOptions)
        })
      }
    },
    goBack () {
      this.$router.push({ path: selectRoleRouter })
    },
    handleSelectAreaOption (area) {
      logger.info('handleSelectAreaOption', area)
      this.currentArea = area
    },

    handleSelectCurriculumOption (curriculum) {
      logger.info('handleSelectCurriculumOption', curriculum)
      if (this.currentCurriculum === null || this.currentCurriculum.id !== curriculum.id) {
        this.currentSubject = null
        this.teacherForm.subjectIds = []
      }
      this.currentCurriculum = curriculum
    },

    // 加载所有的subject 按照一级分类进行分组
    loadSubjectByCurriculumId (curriculumId) {
      getAllSubjectsByCurriculumId({ curriculumId }).then(response => {
        logger.info('subjectOptions', response.result)
        this.subjectOptions = []
        response.result.forEach(subject => {
          this.subjectOptions.push({
            optGroupName: subject.name,
            optGroupNId: subject.id,
            options: []
          })

          getAllSubjectsByParentId({ parentId: subject.id }).then(sResponse => {
            logger.info('getAllSubjectsByParentId ' + subject.id, sResponse)
            const options = []
            sResponse.result.forEach(option => {
              options.push({
                name: option.name,
                id: option.id
              })
            })
            if (options.length) {
              const optGroups = this.subjectOptions.filter(optGroup => optGroup.optGroupNId === subject.id)
              if (optGroups && optGroups.length) {
                optGroups[0].options = options
                logger.info('add subject ' + subject.name + ' options', options)
                logger.info('subjectOptions ', this.subjectOptions)
              } else {
                logger.warn('not find subject group', subject)
              }
            } else {
              logger.info('subject ' + subject.name + ' not options')
            }
          })
        })
      })
    },
    saveDetail () {
      if (this.$store.getters.currentRole === 'expert') {
        this.$refs.expertForm.validate(valid => {
          if (valid) {
            logger.info('save expert', this.expertForm)
            addPreference(this.expertForm).then(response => {
              this.$store.dispatch('GetInfo').then(() => {
                this.$router.push(defaultDashboardRouter)
              })
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      } else if (this.$store.getters.currentRole === 'teacher') {
        this.$refs.teacherForm.validate(valid => {
          if (valid) {
            logger.info('save teacher', this.teacherForm)
            addPreference(this.teacherForm).then(response => {
              this.$store.dispatch('GetInfo').then(() => {
                this.$router.push(defaultDashboardRouter)
              })
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";
.main-content {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;

  .card-wrapper {
    width: 850px;
    min-height: 500px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    background: #fff;
    padding: 50px 25px;
    box-sizing: border-box;

    .card-steps {
      width: 70%;
      padding-bottom: 50px;
    }

    .form-items {
      width: 70%;
      min-height: 200px;
      padding-bottom: 50px;
    }

    .ant-btn-primary {
      color: #fff;
      width: 200px;
    }

    .actions {
      display: flex;
      .action-first {
        padding-right: 10px;
      }
      .action-second {
        padding-left: 10px;
      }
    }
  }
}
</style>
