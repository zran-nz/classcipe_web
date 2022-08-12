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

        <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" prop="level" label="level">
          <a-input placeholder="Please input level" v-model="model.level" />
        </a-form-model-item>
        <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" prop="description" label="description">
          <a-textarea :rows="4" placeholder="Please input description" v-model="model.description" />
        </a-form-model-item>
        <!--        <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" prop="phase" label="phase">-->
        <!--          <a-input placeholder="Please input phase" v-model="model.phase" />-->
        <!--        </a-form-model-item>-->
        <!--        <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" prop="language" label="language">-->
        <!--          <a-input placeholder="Please input language" v-model="model.language" />-->
        <!--        </a-form-model-item>-->

      </a-form-model>
    </a-spin>
  </j-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import JModal from '@/components/jeecg/JModal'

export default {
    name: 'KnowledgeExtendModal',
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
        },
        url: {
          edit: '/classcipe/api/knowledgeExtend/addOrUpdate'
        }
      }
    },
    components: {
      JModal
    },
    created () {
    },
    methods: {
      add (obj) {
        this.edit(Object.assign({}, obj))
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
            const httpurl = this.url.edit
            const method = 'post'
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
