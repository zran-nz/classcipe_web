<template>
  <div>
    <a-modal
      v-model='selVis'
      destroyOnClose
      title='Subject Class Setting'
      width='900px'
      okText='Done'
      :confirmLoading="loading"
      @ok='handleSave'
      @cancel='selVis = false'>
      <a-form-model
        layout="horizontal"
        :model="formModel"
        v-bind="formItemLayout"
        :rules="validatorRules"
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
                  {{ item.subjectName }}
                </a-select-option >
              </a-select>
            </a-form-model-item >
          </a-col>
        </a-row>
        <a-row :gutter=16>
          <a-col :span="12">
            <a-form-model-item :labelCol="{span: 12}" :wrapperCol="{span: 12}" label="Student-self registration">
              <a-switch v-model="formModel.ownJoin" />
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
          <a-col :span="12">
            <a-form-model-item label="Max Std">
              <a-input v-model="formModel.maxStudent" placeholder="input max student count" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="Term">
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
          <!-- <a-col :span="12">
            <a-form-model-item label="Block">
              <a-select
                :getPopupContainer="trigger => trigger.parentElement"
                v-model='formModel.blockId'
                placeholder='Please select block'>
                <a-select-option v-for='item in blockOptions[formModel.term]' :key='item.name'>
                  {{ ('2000-01-01 ' + item.start) | dayjs('HH:mm') }} - {{ ('2000-01-01 ' + item.end) | dayjs('HH:mm') }}
                </a-select-option >
              </a-select>
            </a-form-model-item >
          </a-col> -->
          <term-calendar :termId="formModel.term" :choose="formModel.blockSetting" @date-select="handleSelectBlock"/>
        </a-row>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { getSubjectBySchoolId } from '@/api/academicSettingSubject'
import { getCurriculumBySchoolId } from '@/api/academicSettingCurriculum'
import { termList } from '@/api/academicTermInfo'

import CustomTextButton from '@/components/Common/CustomTextButton'
import TermCalendar from '@/components/Calendar/TermCalendar'
import cloneDeep from 'lodash.clonedeep'
export default {
  name: 'ClassSubjectSel',
  components: {
    CustomTextButton,
    TermCalendar
  },
  props: {
    school: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    school: {
      handler(val) {
        console.log(val)
        this.currentSchool = { ...val }
        this.initData()
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      currentSchool: this.school,
      gradeOptions: [],
      subjectOptions: [],
      termsOptions: [],
      blockOptions: {},
      queryParam: {
        searchKey: ''
      },
      formModel: {
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
        blockId: '',
        blockSetting: '',
        classType: 1,
        schoolId: this.school.id
      },
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
      },
      loading: false,
      selVis: false
    }
  },
  computed: {
    validatorRules: function () {
      return {
        name: [{ required: true, message: 'Please Input Class Name!' }],
        subject: [{ required: true, message: 'Please Select Subject!' }]
      }
    }
  },
  created() {
    this.initValue = cloneDeep(this.formModel)
  },
  methods: {
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
              subjects = subjects.concat(item.subjectList)
            }
          })
          this.subjectOptions = subjects
          this.initSels()
        }
        if (termRes.success) {
          this.termsOptions = termRes.result.map(year => {
            return {
              value: year.id,
              label: year.name,
              children: year.terms.map(term => {
                this.blockOptions[term.id] = term.block.blockSettings || []
                return {
                  value: term.id,
                  label: term.name
                }
              })
            }
          })
        }
        if (gradeRes.success) {
          let grades = []
          this.curriculumOptions = gradeRes.result.forEach(item => {
            grades = grades.concat(item.gradeSettingInfo || [])
          })
          this.gradeOptions = grades
        }
      }).finally(() => {
        this.loading = false
        this.initSels()
      })
    },
    initSels() {
      if (this.formModel.term) {
        let termArr = []
        this.termsOptions.forEach(year => {
          if (year.terms && year.terms.length > 0) {
            const term = year.terms.find(term => term.id === this.formModel.term)
            if (term) {
              termArr = [year.id, term.id]
            }
          }
        })
        // 回显blocksetting
        this.formModel.termArr = termArr
        if (this.formModel.blockSetting) {
          const blockSetting = this.blockOptions[this.formModel.term].find(item => [item.start, item.end].join(' - ') === this.formModel.blockSetting)
          this.formModel.blockId = blockSetting.name
        }
      }
    },
    doCreate(record) {
      this.doEdit({
        ...record
      })
    },
    doEdit(record) {
      this.formModel = cloneDeep({
        ...this.initValue,
        ...record,
        ownJoin: Boolean(record.ownJoin)
      })
      this.initSels()
      this.selVis = true
    },
    handleSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = { ...this.formModel }
          params.schoolId = this.currentSchool.id
          // if (params.blockId) {
          //   const blockSetting = this.blockOptions[params.term].find(item => item.name === params.blockId)
          //   params.blockSetting = [blockSetting.start, blockSetting.end].join(' - ')
          // }
          params.ownJoin = Number(params.ownJoin)
          this.$emit('save', params)
          this.selVis = false
        }
      })
    },
    changeSubject(subjectId) {
      const find = this.subjectOptions.find(item => item.subjectId === subjectId)
      this.formModel.subjectName = find.subjectName
    },
    onChangeTerm(value) {
      if (value && value.length > 0) {
        this.formModel.term = value.slice(value.length - 1)[0]
      } else {
        this.formModel.term = ''
      }
      this.formModel.blockId = undefined
    },
    handleSelectBlock(val) {
      console.log(val)
      this.formModel.blockSetting = val
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
}
</style>
