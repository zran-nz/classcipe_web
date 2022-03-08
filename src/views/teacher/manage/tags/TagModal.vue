<template>
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    :confirmLoading="confirmLoading"
    switchFullscreen
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="Close">
    <a-spin :spinning="confirmLoading">
      <a-form-model ref="form" :model="model" :rules="validatorRules">

        <a-form-model-item label="name" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="name">
          <a-input v-model="model.name" placeholder="Please input name" ></a-input>
        </a-form-model-item>

        <a-form-model-item label="Set as Must/Optional" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="!model.parentId || model.parentId == 0 ">
          <a-radio-group v-model="model.isOptional">
            <a-radio :value="true">Optional</a-radio>
            <a-radio :value="false">Must</a-radio>
          </a-radio-group>
        </a-form-model-item>

        <!--        <a-form-model-item v-if="model.isTree" label="parentId" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="parentId">-->
        <!--          <j-tree-select-->
        <!--            ref="treeSelect"-->
        <!--            placeholder="请选择parentId"-->
        <!--            v-model="model.parentId"-->
        <!--            dict="cc_tag,name,id"-->
        <!--            pidField="parent_id"-->
        <!--            pidValue="0"-->
        <!--            hasChildField="has_child"-->
        <!--            :root-selectable="false"-->
        <!--          >-->
        <!--          </j-tree-select>-->
        <!--        </a-form-model-item>-->
        <a-form-model-item label="Hint" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="tooltip">
          <a-textarea rows="3" v-model="model.tooltip" placeholder="Please input Hint" ></a-textarea>
        </a-form-model-item>

      </a-form-model>
    </a-spin>
  </j-modal>
</template>

<script>

import JModal from '@/components/jeecg/JModal'
import JTreeSelect from '@/components/jeecg/JTreeSelect'
import { SchoolAddOrUpdateTag } from '@/api/tag'

export default {
    name: 'TagModal',
    components: {
      JModal, JTreeSelect
    },
    props: {
      // curriculumList: {
      //   type: Array
      // }
    },
    data () {
      return {
        title: 'Edit',
        width: 800,
        visible: false,
        model: {
         },
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
           name: [
             { required: true, message: 'Please input name!' }
           ]
        },
        url: {
          add: '/classcipe/api/tag/addOrUpdate'
        },
        expandedRowKeys: [],
        pidField: 'parentId',
        gradeTipsList: []
      }
    },
    created () {
       // 备份model原始值
       this.modelDefault = JSON.parse(JSON.stringify(this.model))
    },
    methods: {
      add (obj) {
        // this.modelDefault.parentId = ''
        this.modelDefault.isOptional = true
        this.modelDefault.isTree = true
        this.modelDefault.isCommon = false
        this.modelDefault.schoolId = this.$store.getters.userInfo.school
        this.modelDefault.isCustom = true
        this.edit(Object.assign(this.modelDefault, obj))
      },
      edit (record) {
        this.model = Object.assign({}, record)
        if (!this.model.curriculumId) {
          this.model.curriculumId = 0
        }
        this.visible = true
      },
      view (record) {
        this.$refs.modalForm.view(record)
        this.$refs.modalForm.title = 'View'
        this.$refs.modalForm.disableSubmit = true
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
            SchoolAddOrUpdateTag(this.model).then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                this.$emit('ok')
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
      submitSuccess(formData, flag) {
        if (!formData.id) {
          const treeData = this.$refs.treeSelect.getCurrTreeData()
          this.expandedRowKeys = []
          this.getExpandKeysByPid(formData[this.pidField], treeData, treeData)
          this.$emit('ok', formData, this.expandedRowKeys.reverse())
        } else {
          this.$emit('ok', formData, flag)
        }
      },
      getExpandKeysByPid(pid, arr, all) {
        if (pid && arr && arr.length > 0) {
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].key === pid) {
              this.expandedRowKeys.push(arr[i].key)
              this.getExpandKeysByPid(arr[i]['parentId'], all, all)
            } else {
              this.getExpandKeysByPid(pid, arr[i].children, all)
            }
          }
        }
      },
      handleAddMore() {
        this.gradeTipsList.push({})
      },
      handleRemove(index) {
        this.gradeTipsList.splice(index, 1)
      }

    }
  }
</script>
