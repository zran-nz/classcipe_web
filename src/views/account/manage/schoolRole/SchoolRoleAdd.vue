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
        <!-- <a-form-model-item label="Role Code" required prop="roleCode">
          <a-input v-model="model.roleCode" :disabled="roleDisabled" placeholder="Please input role code"/>
        </a-form-model-item> -->
        <a-form-model-item label="Role Name" required prop="name">
          <a-input v-model="model.name" placeholder="Please input role name"/>
        </a-form-model-item>
        <!-- <a-form-model-item label="Description" prop="description">
          <a-textarea :rows="5" v-model="model.description" placeholder="Please input role desc"/>
        </a-form-model-item> -->
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { addRole, editRole } from '@/api/v2/schoolRole'
export default {
  name: 'SchoolRoleAdd',
  data () {
    return {
      title: 'School Role Add',
      visible: false,
      roleDisabled: false,
      model: {
      },
      layout: {
        labelCol: { span: 3 },
        wrapperCol: { span: 14 }
      },
      confirmLoading: false,
      validatorRules: {
        name: [
          { required: true, message: 'Please input role code!' },
          { min: 2, max: 30, message: 'No more than 30 characters in length ', trigger: 'blur' }
        ],
        roleCode: [
          { required: true, message: 'Please input role name!' },
          { min: 0, max: 64, message: 'No more than 64 characters in length', trigger: 'blur' },
          { validator: this.validateRoleCode }
        ],
        description: [
          { min: 0, max: 126, message: 'No more than 126 characters in length', trigger: 'blur' }
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
      this.model = Object.assign({}, record)
      this.visible = true
      // 编辑页面禁止修改角色编码
      if (this.model.id) {
        this.roleDisabled = true
      } else {
        this.roleDisabled = false
      }
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
          let obj
          if (!this.model.id) {
            obj = addRole(this.model)
          } else {
            obj = editRole(this.model)
          }
          obj.then((res) => {
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
    },
    validateRoleCode(rule, value, callback) {
      if (/[\u4E00-\u9FA5]/g.test(value)) {
        callback(new Error('角色编码不可输入汉字!'))
      } else {
        // const params = {
        //   tableName: 'sys_role',
        //   fieldName: 'role_code',
        //   fieldVal: value,
        //   dataId: this.model.id
        // }
        // duplicateCheck(params).then((res) => {
        //   if (res.success) {
        //     callback()
        //   } else {
        //     callback(res.message)
        //   }
        // })
        callback()
      }
    }
  }
}
</script>

<style scoped>

</style>
