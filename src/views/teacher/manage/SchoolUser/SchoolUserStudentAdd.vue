<template>
  <a-card :bordered="false">
    <j-modal
      :title="title"
      :width="width"
      :visible="visible"
      :confirmLoading="confirmLoading"
      switchFullscreen
      @ok="handleOk"
      @cancel="handleCancel"
      cancelText="Cancel"
      okText="Add"
    >
      <a-spin :spinning="confirmLoading">
        <a-form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
          <a-row>
            <a-col :span="12">
              <a-form-item label="First Name">
                <a-input
                  v-decorator="['firstname', { rules: [{ required: true, message: 'Please input first name!' }] }]"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="Last Name">
                <a-input
                  v-decorator="['lastname', { rules: [{ required: true, message: 'Please input last name!' }] }]"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item label="Email">
                <a-input
                  v-decorator="[
                    'email',
                    { rules: [{ required: true, type: 'email', message: 'Please input email!' }] },
                  ]"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="Class">
                <a-select v-decorator="['classes', { rules: [] }]">
                  <a-select-option :value="item.id" :key="item.id" v-for="item in classList">{{
                    item.name
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item label="Grade">
                <a-input v-decorator="['grades', { rules: [] }]" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="Parent Name">
                <a-input v-decorator="['parentName', { rules: [] }]" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item label="Parent Email">
                <a-input
                  v-decorator="[
                    'parentEmail',
                    { rules: [{ required: false, type: 'email', message: 'Please input email!' }] },
                  ]"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="Parent No">
                <a-input v-decorator="['parentNo', { rules: [] }]" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item label="Age">
                <a-input v-decorator="['age', { rules: [] }]" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-spin>
    </j-modal>
  </a-card>
</template>

<script>
import JModal from '@/components/jeecg/JModal'
import { addStudent } from '@/api/schoolUser'
import store from '@/store'

export default {
  name: 'SchoolUserStudentAdd',
  mixins: [],
  components: {
    JModal
  },
  props: {
    classList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      title: 'Add Student',
      width: 800,
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this, { name: 'studentAdd' })
    }
  },
  created() {},
  computed: {},
  methods: {
    show() {
      this.visible = true
    },
    handleOk() {
      this.form.validateFields(async (err, values) => {
        if (!err) {
          this.confirmLoading = true
          console.log('Received values of form: ', values)
          const res = await addStudent({
            schoolId: store.getters.userInfo.school,
            ...values
          })
          if (res.success) {
            this.confirmLoading = false
            this.visible = false
            this.$emit('ok')
          } else {
            this.$message.error(res.message)
            this.confirmLoading = false
          }
        }
      })
    },
    handleCancel() {
      this.visible = false
      this.confirmLoading = false
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
</style>
