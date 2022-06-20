<template>
  <a-form-model
    layout="horizontal"
    :model="formModel"
    v-bind="formItemLayout"
    :rules="validatorRules"
    ref="form">
    <a-form-model-item class="mb0" label="Name" :required="true">
      <a-row :gutter=16>
        <a-col :span="12">
          <a-form-model-item prop="firstName">
            <a-input v-model="formModel.firstName" placeholder="First name" />
          </a-form-model-item >
        </a-col>
        <a-col :span="12">
          <a-form-model-item prop="lastName">
            <a-input v-model="formModel.lastName" placeholder="Last name" />
          </a-form-model-item >
        </a-col>
      </a-row>
    </a-form-model-item>
    <a-form-model-item label="Email" prop="email">
      <a-input v-model="formModel.email" placeholder="Email" />
    </a-form-model-item>
    <a-form-model-item label="Birth">
      <a-date-picker v-model="formModel.birthDay" />
    </a-form-model-item>
    <a-form-model-item label="Class" prop="classArr">
      <a-select
        mode="multiple"
        optionFilterProp="children"
        :getPopupContainer="trigger => trigger.parentElement"
        v-model='formModel.classArr'
        placeholder='Please select class'>
        <a-select-option v-for='item in classList' :key='item.id'>
          {{ item.name }}
        </a-select-option >
      </a-select>
    </a-form-model-item>
    <div class="sub-title">
      <label for="">Parent guardian</label>
    </div>
    <a-form-model-item class="mb0" label="Name" :required="true">
      <a-row :gutter=16>
        <a-col :span="12">
          <a-form-model-item prop="parentFirstName">
            <a-input v-model="formModel.parentFirstName" placeholder="First name" />
          </a-form-model-item >
        </a-col>
        <a-col :span="12">
          <a-form-model-item prop="parentLastName">
            <a-input v-model="formModel.parentLastName" placeholder="Last name" />
          </a-form-model-item >
        </a-col>
      </a-row>
    </a-form-model-item>
    <a-form-model-item label="Email" prop="parentEmail" :wrapperCol="{ span: 18 }">
      <a-row :gutter=0>
        <a-col :span="16">
          <a-input v-model="formModel.parentEmail" placeholder="Email" />
        </a-col>
        <a-col :span="2" style="text-align: center;">
          <a-icon style="color: #007990" type="check" />
        </a-col>
        <a-col :span="6" style="text-align: center;">
          <a-button type="black">Resend</a-button>
        </a-col>
      </a-row>
    </a-form-model-item>
    <a-form-model-item label="Phone" prop="parentPhone">
      <a-input v-model="formModel.parentPhone" placeholder="Phone" />
    </a-form-model-item>
    <a-form-model-item :wrapperCol="{offset: 6}">
      <a-button @click="handleSave" type="primary">{{ studentId ? 'Update': 'Create' }}</a-button>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
import { listClass } from '@/api/v2/schoolClass'
export default {
  name: 'SchoolStudentAdd',
  props: {
    school: {
      type: Object,
      default: () => {}
    },
    id: {
      type: String,
      default: null
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
    },
    id: {
      handler(val) {
        this.studentId = val
        this.initData()
      },
      immediate: true
    }
  },
  data() {
    return {
      currentSchool: this.school,
      studentId: this.id,
      classList: [],
      formModel: {
        firstName: '',
        lastName: '',
        birthDay: '',
        classes: '',
        classArr: [],
        email: '',
        parentEmail: '',
        parentEmailStatus: 0,
        parentFirstName: '',
        parentLastName: '',
        parentPhone: '',
        schoolId: this.school?.id || ''
      },
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 12 }
      },
      loading: false
    }
  },
  computed: {
    validatorRules: function () {
      return {
        firstName: [{ required: true, message: 'Please Input First Name!' }],
        lastName: [{ required: true, message: 'Please Input Last Name!' }],
        email: [
          { required: true, message: 'Please Input Email!' },
          { type: 'email', message: 'Please Input Valid Email!' }
        ],
        parentFirstName: [{ required: true, message: 'Please Input First Name!' }],
        parentLastName: [{ required: true, message: 'Please Input Last Name!' }],
        parentEmail: [
          { required: true, message: 'Please Input Email!' },
          { type: 'email', message: 'Please Input Valid Email!' }
        ],
        classArr: [{ required: true, message: 'Please Select a class!', trigger: 'change' }],
        parentPhone: [
          { required: true, message: 'Please Input Phone!' }
          // { pattern: /^1[3|4|5|7|8|9][0-9]\d{8}$/, message: 'Please Input Valid Phone!' }
        ]
      }
    }
  },
  methods: {
    initData() {
       Promise.all([
          listClass({
            schoolId: this.currentSchool.id,
            pageNo: 1,
            pageSize: 10000
          })
        ]).then(([clsRes]) => {
          if (clsRes.code === 0) {
            this.classList = clsRes.result.records
          }
        })
    },
    handleSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = { ...this.formModel }
          this.$emit('save', params)
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.mb0 {
  margin-bottom: 0;
}
.sub-title {
  margin: 20px 0;
  font-weight: bold;
  font-size: 14px;
  color: #333;
  margin-left: calc(25% - 120px);
}
</style>
