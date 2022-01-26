<template>
  <j-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    switchFullscreen
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">
    <a-spin :spinning="confirmLoading">
      <a-form-model ref="form" :model="model" :rules="validatorRules">

        <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" prop="classId" label="班级ID">
          <a-input placeholder="请输入班级ID" v-model="model.classId" />
        </a-form-model-item>
        <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" prop="classFlag" label="班级类型(1-学校class,2-个人班级)">
          <a-input placeholder="请输入班级类型(1-学校class,2-个人班级)" v-model="model.classFlag" />
        </a-form-model-item>
        <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" prop="email" label="email">
          <a-input placeholder="请输入email" v-model="model.email" />
        </a-form-model-item>
        <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" prop="firstname" label="firstname">
          <a-input placeholder="请输入firstname" v-model="model.firstname" />
        </a-form-model-item>
        <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" prop="lastname" label="lastname">
          <a-input placeholder="请输入lastname" v-model="model.lastname" />
        </a-form-model-item>
        <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" prop="nickname" label="nickname">
          <a-input placeholder="请输入nickname" v-model="model.nickname" />
        </a-form-model-item>
        <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" prop="status" label="关联状态：0-待审批；1-审批通过；2-审批拒绝">
          <a-input-number v-model="model.status"/>
        </a-form-model-item>
        <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" prop="joinTime" label="创建时间">
          <a-date-picker showTime valueFormat='YYYY-MM-DD HH:mm:ss' v-model="model.joinTime" />
        </a-form-model-item>
        <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" prop="delFlag" label="删除状态(0-正常,1-已删除)">
          <a-input placeholder="请输入删除状态(0-正常,1-已删除)" v-model="model.delFlag" />
        </a-form-model-item>

      </a-form-model>
    </a-spin>
  </j-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import JModal from '@/components/jeecg/JModal'

export default {
    name: 'SchoolClassStudentModal',
    data () {
      return {
        title: '操作',
        visible: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },

        confirmLoading: false,
        validatorRules: {
        status: [{ required: true, message: '请输入关联状态：0-待审批；1-审批通过；2-审批拒绝!' }]
        },
        url: {
          add: '/school/schoolClassStudent/add',
          edit: '/school/schoolClassStudent/addOrUpdate'
        }
      }
    },
  components: {
    JModal
  },
    created () {
    },
    methods: {
      add () {
        // 初始化默认值
        this.edit({})
      },
      edit (record) {
        this.model = Object.assign({}, record)
        this.visible = true
      },
      close () {
        this.$emit('close')
        this.visible = false
        this.$refs.form.clearValidate()
      },
      handleOk () {
        const that = this
        // 触发表单验证
         this.$refs.form.validate(valid => {
          if (valid) {
            that.confirmLoading = true
            let httpurl = ''
            let method = ''
            if (!this.model.id) {
              httpurl += this.url.add
              method = 'post'
            } else {
              httpurl += this.url.edit
               method = 'post'
            }
            httpAction(httpurl, this.model, method).then((res) => {
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

<style lang="less" scoped>

</style>
