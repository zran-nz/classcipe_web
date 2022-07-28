<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="Close"
    wrapClassName="ant-modal-cust-warp"
    style="top:5%;height: 85%;overflow-y: hidden">

    <a-spin :spinning="confirmLoading">
      <a-form-model ref="form" v-bind="layout" :model="model" :rules="validatorRules">
        <a-form-model-item label="Role Name" required prop="name">
          <a-input v-model="model.name" placeholder="Please input role name"/>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { saveSchoolRole } from '@/api/v2/schoolRole'
export default {
  name: 'SchoolRoleAdd',
  data () {
    return {
      title: 'School Role Edit',
      visible: false,
      roleDisabled: false,
      model: {
        schoolId: '',
        changedKey: '',
        roleNames: {},
        name: ''
      },
      layout: {
        labelCol: { span: 3 },
        wrapperCol: { span: 14 }
      },
      confirmLoading: false,
      validatorRules: {
        name: [
          { required: true, message: 'Please input role name!' },
          { min: 2, max: 30, message: 'No more than 30 characters in length ', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    // 备份model原始值
    this.modelDefault = JSON.parse(JSON.stringify(this.model))
  },
  methods: {
    add (record = {}) {
      this.edit({
        ...this.modelDefault,
        ...record
      })
    },
    edit (record) {
      if (!record.changedKey) {
        this.$message.error('Please select a role')
        return
      }
      this.model = JSON.parse(JSON.stringify(record))
      this.visible = true
    },
    close () {
      this.$refs.form.clearValidate()
      this.$emit('close')
      this.visible = false
    },
    handleOk () {
      const that = this
      // 触发表单验证
      this.$refs.form.validate(valid => {
        if (valid) {
          that.confirmLoading = true
          const roleNames = this.model.roleNames
          roleNames[this.model.changedKey] = this.model.name
          saveSchoolRole({
            schoolId: this.model.schoolId,
            roleNames: roleNames
          }).then((res) => {
            if (res.success) {
              that.$message.success(res.message)
              that.$emit('ok')
            } else {
              that.$message.warning(res.message)
            }
          }).finally(() => {
            that.confirmLoading = false
            that.close()
          })
        } else {
          return false
        }
      })
    },
    handleCancel () {
      this.close()
    }
  }
}
</script>

<style scoped>

</style>
