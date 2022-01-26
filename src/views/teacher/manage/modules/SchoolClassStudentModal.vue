<template>
  <j-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    switchFullscreen
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="Close">
    <a-spin :spinning="confirmLoading">
      <a-form-model ref="form" :model="model" :rules="validatorRules">

        <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" prop="email" label="Email">
          <a-input placeholder="Please input email" v-model="model.email" />
        </a-form-model-item>
        <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" prop="studentName" label="Student Name">
          <a-input placeholder="Please input name" v-model="model.studentName" />
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
import { schoolClassStudentAPIUrl } from '@/api/schoolClassStudent'

export default {
    name: 'SchoolClassStudentModal',
    data () {
      return {
        title: 'Edit',
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
          email: [{ required: true, message: 'Please input email!' }],
          studentName: [{ required: true, message: 'Please input name!' }]
        }
      }
    },
  props: {
    classId: {
      type: String,
      default: ''
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
        this.edit({ classId: this.classId, status: 1 })
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
            // if (!this.model.joinTime) {
            //   this.model.joinTime = Moment(new Date()).format('YYYY-MM-DD HH:mm').toDate()
            // }
            httpAction(schoolClassStudentAPIUrl.SchoolClassStudentAddOrUpdate, this.model, 'post').then((res) => {
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
