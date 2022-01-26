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

        <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" prop="email" label="Email">
          <a-input placeholder="Please input email" v-model="model.email" />
        </a-form-model-item>
        <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" prop="studentName" label="Student Name">
          <a-input placeholder="Please input name" v-model="model.firstname" />
        </a-form-model-item>
        <!--        <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" prop="joinTime" label="创建时间">-->
        <!--          <a-date-picker showTime valueFormat='YYYY-MM-DD HH:mm:ss' v-model="model.joinTime" />-->
        <!--        </a-form-model-item>-->
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
