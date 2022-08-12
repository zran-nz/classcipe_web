<template>
  <a-spin :spinning="loading">
    <a-form-model
      layout="horizontal"
      :model="formModel"
      v-bind="formItemLayout"
      :rules="validatorRules"
      @validate="doValidate"
      ref="form">
      <a-row :gutter=16>
        <a-col :span="12">
          <a-form-model-item label="Class Name" prop="name">
            <a-input v-model="formModel.name" placeholder="input class name" />
          </a-form-model-item >
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="Subject" prop="subject">
            <!-- <a-tree-select
              v-model="formModel.subjectTree"
              style="width: 100%"
              :tree-data="subjectOptions"
              tree-default-expand-all
              tree-checkable
              search-placeholder="Please select subject"
            /> -->
            <a-select
              :getPopupContainer="trigger => trigger.parentElement"
              v-model='formModel.subject'
              @change="changeSubject"
              placeholder='Please select subject'>
              <a-select-option v-for='item in subjectOptions' :key='item.subjectId'>
                {{ curriculumMap[curriculumOptions[item.curriculumId]] || curriculumOptions[item.curriculumId] }} - {{ item.subjectName }}
              </a-select-option >
            </a-select>
          </a-form-model-item >
        </a-col>
      </a-row>
      <a-row :gutter=16>
        <a-col :span="12">
          <a-form-model-item :labelCol="{span: 12}" :wrapperCol="{span: 12}" label="Student-self registration">
            <a-switch @change="changeOwnJoin" v-model="formModel.ownJoin" />
          </a-form-model-item>
        </a-col>
        <a-col :span="12" v-if="formModel.ownJoin">
          <a-form-model-item label="Grade">
            <a-select
              :getPopupContainer="trigger => trigger.parentElement"
              v-model='formModel.gradeId'
              placeholder='Please select grade'>
              <a-select-option v-for='item in gradeOptions' :key='item.gradeId'>
                {{ item.gradeName }}
              </a-select-option >
            </a-select>
          </a-form-model-item >
        </a-col>
      </a-row>
      <a-row :gutter=16>
        <a-col :span="12" v-if="formModel.ownJoin">
          <a-form-model-item label="Max Std" prop="maxStudent">
            <a-input v-model="formModel.maxStudent" placeholder="input max student count" />
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="Term" prop="termArr" :extra="formModel.termTime && formModel.termTime.join(' ~ ')">
            <a-space>
              <a-cascader
                :options="termsOptions"
                v-model="formModel.termArr"
                :allow-clear="false"
                placeholder="Please select term"
                @change="onChangeTerm" />
              <a-button type='link' @click="goTerm">Term setting</a-button>
            </a-space>
          </a-form-model-item >
        </a-col>
      </a-row>
      <a-row :gutter=16 class="calendar-con">
        <term-calendar :termId="formModel.term" :choose="origin.blockSetting" @date-select="handleSelectBlock"/>
      </a-row>
      <div v-if="formModel.ownJoin && !formModel.blockSetting" class="error_field">Please Select Block</div>
      <a-form-model-item label="" :labelCol="{span: 0}" :wrapperCol="{span: 24}" style="text-align:right;margin-top: 20px;">
        <a-button :loading="loading" type="primary" :disabled="hasErrors || (formModel.ownJoin && !formModel.blockSetting)" @click="handleSave">Done</a-button>
      </a-form-model-item >
    </a-form-model>
  </a-spin>
</template>

<script>
import { USER_MODE } from '@/const/common'

import { getSubjectBySchoolId } from '@/api/academicSettingSubject'
import { getCurriculumBySchoolId } from '@/api/academicSettingCurriculum'
import { termList } from '@/api/academicTermInfo'
import { saveClass, classDetail } from '@/api/v2/schoolClass'

import CustomTextButton from '@/components/Common/CustomTextButton'
import TermCalendar from '@/components/Calendar/TermCalendar'

import { SubmitBeforeMixin } from '@/mixins/SubmitBeforeMixin'
import { AutoSaveLocalMixin } from '@/mixins/AutoSaveLocalMixin'
import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'

import { mapState } from 'vuex'

import cloneDeep from 'lodash.clonedeep'
import { uniqBy } from 'lodash-es'
import moment from 'moment'
export default {
  name: 'ClassSubjectAdd',
  components: {
    CustomTextButton,
    TermCalendar
  },
  mixins: [SubmitBeforeMixin, AutoSaveLocalMixin, UserModeMixin, CurrentSchoolMixin],
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  watch: {
    id: {
      handler(val) {
        console.log(val)
        this.formModel.id = val
        this.initForm()
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      gradeOptions: [],
      subjectOptions: [],
      termsOptions: [],
      blockOptions: {},
      curriculumOptions: {},
      curriculumMap: {
        'Cambridge Primary & Lower Secondary': 'Cambridge P & LS'
      },
      queryParam: {
        searchKey: ''
      },
      origin: {
        blockSetting: ''
      },
      formModel: {
        id: '',
        name: '',
        subject: '',
        subjectName: '',
        ownJoin: false,
        gradeId: '',
        maxStudent: 200,
        studentCount: 0,
        teacherCount: 0,
        term: '',
        termArr: [],
        termTime: [],
        blockSetting: '',
        classType: 1,
        schoolId: ''
      },
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
      },
      loading: false,
      autoSaveLocalKey: 'FORM_CLASS_SUBJECT_',
      needAutoSave: !this.id
    }
  },
  computed: {
    ...mapState({
      info: state => state.user.info,
      userMode: state => state.app.userMode,
      currentSchool: state => state.user.currentSchool
    }),
    validatorRules: function () {
      return {
        name: [{ required: true, message: 'Please Input Class Name!' }],
        subject: [{ required: true, message: 'Please Select Subject!' }],
        termArr: [{ required: this.formModel.ownJoin, type: 'array', message: 'Please Select Term!' }],
        maxStudent: [{ required: this.formModel.ownJoin, message: 'Please Input Student Number!' }],
        blockSetting: [{ required: this.formModel.ownJoin, message: 'Please Select Block!' }]
      }
    }
  },
  created() {
    this.initValue = cloneDeep(this.formModel)
    this.initData()
  },
  methods: {
    handleSchoolChange(currentSchool) {
      if (this.userMode === USER_MODE.SCHOOL) {
        this.initData()
      }
    },
    handleModeChange(userMode) {
      // 模式切换，个人还是学校 个人接口
      this.initData()
    },
    initData() {
      this.loading = true
      Promise.all([
        getSubjectBySchoolId({
          schoolId: this.currentSchool.id
        }),
        getCurriculumBySchoolId({
          schoolId: this.currentSchool.id
        }),
        termList({
          schoolId: this.currentSchool.id
        })
      ]).then(([subjectRes, gradeRes, termRes]) => {
        if (subjectRes.success) {
          // this.subjectOptions = res.result.map(item => {
          //   return {
          //     key: item.curriculumId,
          //     value: item.curriculumId,
          //     title: item.curriculumName,
          //     children: item.subjectList.map(sub => ({
          //       key: sub.subjectId,
          //       value: sub.subjectId,
          //       title: sub.subjectName
          //     }))
          //   }
          // })
          let subjects = []
          subjectRes.result.forEach(item => {
            if (item.subjectList && item.subjectList.length > 0) {
              subjects = subjects.concat(item.subjectList.map(sub => ({
                ...sub,
                curriculumId: item.curriculumId
              })))
            }
          })
          this.subjectOptions = uniqBy(subjects.map(item => {
            return {
              subjectId: item.parentSubjectId,
              subjectName: item.parentSubjectName,
              curriculumId: item.curriculumId
            }
          }), 'subjectId')
          this.initSels()
        }
        if (termRes.success) {
          this.termsOptions = termRes.result.map(year => {
            return {
              value: year.id,
              label: year.name,
              startTime: year.startTime,
              endTime: year.endTime,
              children: year.terms.map(term => {
                this.blockOptions[term.id] = term.block.blockSettings || []
                return {
                  value: term.id,
                  label: term.name,
                  startTime: term.startTime,
                  endTime: term.endTime
                }
              })
            }
          })
        }
        if (gradeRes.success) {
          let grades = []
          gradeRes.result.forEach(item => {
            grades = grades.concat(item.gradeSettingInfo || [])
            this.curriculumOptions[item.curriculumId] = item.curriculumName
          })
          this.gradeOptions = grades
        }
      }).finally(() => {
        this.loading = false
        this.initSels()
      })
    },
    initForm(defaultForm) {
      if (this.formModel.id) {
        this.loading = true
        classDetail({
          classId: this.formModel.id
        }).then(res => {
          if (res.code === 0) {
            this.doCreate(res.result)
          }
        }).finally(() => {
          this.loading = false
        })
      } else {
        const fromCache = this.getAutoLocalData()
        this.doCreate(fromCache)
      }
    },
    initSels() {
      if (this.formModel.term) {
        let termArr = []
        console.log(this.termsOptions)
        this.termsOptions.forEach(year => {
          if (year.children && year.children.length > 0) {
            const term = year.children.find(term => term.value === this.formModel.term)
            if (term) {
              termArr = [year.value, term.value]
            }
          }
        })
        this.formModel.termArr = termArr
      }
    },
    doCreate(record) {
      this.doEdit({
        ...record
      })
      this.$nextTick(() => {
        this.initValidate(!!this.id)
      })
    },
    doValidate(key, value) {
      this.fillValidate(key, value)
    },
    doEdit(record) {
      this.formModel = cloneDeep({
        ...this.initValue,
        ...record,
        ownJoin: Boolean(record.ownJoin)
      })
      this.origin = cloneDeep(this.formModel)
      console.log(this.origin)
      this.initSels()
    },
    handleSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = { ...this.formModel }
          params.schoolId = this.currentSchool.id
          params.ownJoin = Number(params.ownJoin)
          params.classType = 1
          this.loading = true
          if (this.userMode === USER_MODE.SELF) {
            params.userId = this.info.id
            params.classMode = 2
          } else {
            params.classMode = 1
          }
          saveClass(params).then(res => {
            if (res.success && res.code === 0) {
              this.$store.dispatch('GetInfo')
              this.$message.success('Save successfully')
              this.$emit('save', params)
              this.clearLocalData()
            }
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    changeOwnJoin() {
      this.$nextTick(() => {
        this.initValidate(!!this.id)
      })
    },
    changeSubject(subjectId) {
      const find = this.subjectOptions.find(item => item.subjectId === subjectId)
      this.formModel.subjectName = find.subjectName
    },
    onChangeTerm(value) {
      this.formModel.termTime = []
      if (value && value.length > 0) {
        this.formModel.term = value.slice(value.length - 1)[0]
        const year = this.termsOptions.find(item => item.value === value[0])
        const term = year.children.find(item => item.value === value[1])
        console.log(term)
        if (term) {
          this.formModel.termTime = [moment(term.startTime).format('DD/MM/YYYY'), moment(term.endTime).format('DD/MM/YYYY')]
        }
      } else {
        this.formModel.term = ''
      }
      this.$refs.form.validateField(['termArr'])
    },
    handleSelectBlock(val) {
      console.log(val)
      this.formModel.blockSetting = val
      this.$refs.form.validateField(['blockSetting'])
    },
    goTerm() {
      this.$router.push('/manage/academic')
    }
  }
}
</script>

<style scoped lang="less">
.mb0 {
  margin-bottom: 0;
}
.calendar-con {
  height: 220px;
  /deep/ .schedule-content {
    height: 220px;
  }
  /deep/ .fc-bg-event {
    opacity: 1;
  }
}
.error_field {
  color: #ef4136;
}
</style>
