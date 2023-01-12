<template>
  <a-spin :spinning="loading">
    <div class="subject-content">
      <div class="content-left">
        <a-form-model
          layout="horizontal"
          :model="formModel"
          v-bind="formItemLayout"
          :rules="validatorRules"
          @validate="doValidate"
          ref="form">
          <a-form-model-item label="Class Name" prop="name">
            <a-input v-model="formModel.name" placeholder="Input class name" />
          </a-form-model-item >
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
              v-if="schoolCurriculumOptions"
              :getPopupContainer="trigger => trigger.parentElement"
              v-model="formModel.subject"
              @change="changeSubject"
              placeholder="Set curriculum"
            >
              <a-select-option v-for='item in schoolCurriculumOptions' :key='item.id'>
                {{ item.name }}
              </a-select-option >
            </a-select>
          </a-form-model-item >
          <!-- <a-form-model-item :labelCol="{span: 12}" :wrapperCol="{span: 12}" label="Student-self registration">
            <a-switch @change="changeOwnJoin" v-model="formModel.ownJoin" />
          </a-form-model-item> -->
          <template v-if="formModel.ownJoin">
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
            <a-form-model-item label="Max Std" prop="maxStudent">
              <a-input v-model="formModel.maxStudent" placeholder="input max student count" />
            </a-form-model-item>
          </template>
          <a-form-model-item v-if="!formQuery || !formModel.term" label="Term" prop="termArr" :extra="formModel.termTime && formModel.termTime.join(' ~ ')">
            <a-space>
              <a-cascader
                :options="termsOptions"
                v-model="formModel.termArr"
                :allow-clear="false"
                placeholder="Please select term"
                @change="onChangeTerm" />
            </a-space>
          </a-form-model-item >
          <a-form-model-item v-else label="Term">
            <div class="fix-term" >{{ formModel.termTime && formModel.termTime.join(' ~ ') }}</div>
          </a-form-model-item>
          <a-form-model-item label="" :wrapperCol="{offset: 6, span: 18}">
            <a-space>
              <a-button @click="goTerm">Set Blocks</a-button>
              <a-button :loading="loading" type="primary" :disabled="hasErrors || (formModel.ownJoin && !formModel.blockSetting)" @click="handleSave">Done</a-button>
            </a-space>
          </a-form-model-item >
          <!-- <a-form-model-item label="" :wrapperCol="{offset: 6, span: 18}">
            <a-button :loading="loading" type="primary" :disabled="hasErrors || (formModel.ownJoin && !formModel.blockSetting)" @click="handleSave">Done</a-button>
          </a-form-model-item > -->
        </a-form-model>
      </div>
      <div class="content-right">
        <a-row :gutter=16 class="calendar-con">
          <term-calendar :termId="formModel.term" :isNowLineVisible="false" :choose="origin.blockSetting" @date-select="handleSelectBlock"/>
          <div v-if="formModel.ownJoin && !formModel.blockSetting" class="error_field">Please Select Block</div>
        </a-row>
      </div>
    </div>
    <!-- <div class="subject-footer">
      <a-button style="margin-left: 13%:" :loading="loading" type="primary" :disabled="hasErrors || (formModel.ownJoin && !formModel.blockSetting)" @click="handleSave">Done</a-button>
    </div> -->
  </a-spin>
</template>

<script>
import { USER_MODE } from '@/const/common'

// import { getSubjectBySchoolId } from '@/api/academicSettingSubject'
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
// import { uniqBy } from 'lodash-es'

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
        this.formModel.id = val
        this.initForm()
      }
    }
  },
  data() {
    return {
      USER_MODE,

      gradeOptions: [],
      gradeList: [],
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
        id: this.id,
        name: '',
        subject: null,
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
      needAutoSave: !this.id,
      formQuery: false,
      curriculumId: '',
      schoolCurriculum: null,
      schoolCurriculumList: null
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
    },
    schoolCurriculumOptions() {
      if (this.schoolCurriculum && this.schoolCurriculum.curriculum.length) {
        const subjects = []
        this.schoolCurriculum.curriculum.forEach(code => {
          this.schoolCurriculum.subjects[code].forEach(subjectName => {
            subjects.push({
              curriculumCode: code,
              curriculumName: this.getCurriculumNameByCode(code),
              subjectName,
              id: `${code}:${subjectName}`,
              name: `${this.getCurriculumNameByCode(code)} - ${subjectName}`
            })
          })
        })
        return subjects
      } else {
        return null
      }
    },
    validSubjects() {
      if (!this.schoolCurriculumList) return []
      const list = []
      this.schoolCurriculumList.forEach(e => {
        e.subjects.forEach(subject => list.push(`${e.code}:${subject._id}`))
      })
      return list
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
        getCurriculumBySchoolId({
          schoolId: this.currentSchool.id
        }),
        termList({
          schoolId: this.currentSchool.id
        }),
        App.service('curriculum').get('pubList', { query: { $limit: 1000 } }),
        App.service('conf-school').get('get', { query: { key: 'Curriculum', rid: this.currentSchool.id, del: false, $limit: 1000 } })
      ]).then(([gradeRes, termRes, schoolCurriculumListRes, schoolCurriculumRes]) => {
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
          this.gradeList = gradeRes.result
          let grades = []
          gradeRes.result.forEach(item => {
            grades = grades.concat(item.gradeSettingInfo || [])
            this.curriculumOptions[item.curriculumId] = item.curriculumName
          })
          this.gradeOptions = grades
        }
        if (schoolCurriculumListRes) {
          const res = schoolCurriculumListRes
          this.schoolCurriculumList = res
        }
        if (schoolCurriculumRes) {
          const res = schoolCurriculumRes
          this.schoolCurriculum = res.val
          const options = res.val.subjects
          this.subjectOptions = options
          console.warn(res.val, options)
        }
      }).finally(() => {
        this.loading = false
        this.initForm()
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
        const query = this.$route.query
        if (query.termId) {
          fromCache.term = query.termId
          this.formQuery = true
        } else {
          this.formQuery = false
        }
        if (query.curriculumId) {
          this.curriculumId = query.curriculumId
        }
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
              this.formModel.termTime = [new Date(term.startTime).toLocaleDateString(), new Date(term.endTime).toLocaleDateString()]
            }
          }
        })
        if (termArr.length === 0) {
          this.formModel.term = ''
        }
        this.formModel.termArr = termArr
      }
      let subject = this.formModel.subject || ''
      if (!this.validSubjects.includes(subject)) subject = ''
      this.formModel.subject = subject
    },
    doCreate(record) {
      this.doEdit({ ...record })
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
          // const curriculumCode = this.getCurriculumCodeById(this.curriculumId)
          // if (!curriculumCode) return
          const params = { ...this.formModel }
          params.schoolId = this.currentSchool.id
          params.ownJoin = Number(params.ownJoin)
          params.classType = 1
          // new subject: au:Mathematics
          params.subject = `${params.curriculumCode}:${params.subjectName}`
          if (this.userMode === USER_MODE.SELF) {
            params.userId = this.info.id
            params.classMode = 2
          } else {
            params.classMode = 1
          }
          this.loading = true
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
      const [ curriculumCode, subjectName ] = subjectId.split(':')
      this.formModel.subjectName = subjectName
      this.formModel.curriculumCode = curriculumCode
    },
    onChangeTerm(value) {
      this.formModel.termTime = []
      if (value && value.length > 0) {
        this.formModel.term = value.slice(value.length - 1)[0]
        const year = this.termsOptions.find(item => item.value === value[0])
        const term = year.children.find(item => item.value === value[1])
        console.log(term)
        if (term) {
          this.formModel.termTime = [new Date(term.startTime).toLocaleDateString(), new Date(term.endTime).toLocaleDateString()]
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
    },
    getCurriculumCodeById(id) {
      const currentGrade = this.gradeList.find(e => e.curriculumId === id)
      let name = ''
      if (currentGrade) {
        name = currentGrade.curriculumName
      } else {
        return ''
      }
      const currentCurriculum = this.schoolCurriculumList.find(e => e.name === name)
      if (currentCurriculum) {
        return currentCurriculum.code
      } else {
        return ''
      }
    },
    getCurriculumNameByCode(code) {
      const currentCurriculum = this.schoolCurriculumList.find(e => e.code === code)
      if (currentCurriculum) {
        return currentCurriculum.name
      } else {
        return ''
      }
    }
  }
}
</script>

<style scoped lang="less">
.mb0 {
  margin-bottom: 0;
}
.calendar-con {
  height: 400px;
  /deep/ .schedule-content {
    height: 400px;
  }
  /deep/ .fc-bg-event {
    opacity: 1;
  }
}
.error_field {
  color: #ef4136;
}
.subject-content {
  display: flex;
  width: 100%;
  .content-left {
    flex: 1;
    padding: 20px 40px 20px 20px;
  }
  .content-right {
    width: 60%;
  }
}
.fix-term {
  font-weight: bold;
}
</style>
