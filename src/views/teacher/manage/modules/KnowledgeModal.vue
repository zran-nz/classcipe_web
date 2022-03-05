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

        <a-form-model-item label="Subject" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="subjectId">
          <a-select :getPopupContainer="trigger => trigger.parentElement" v-model="model.subjectId" placeholder="Please select subject" >
            <a-select-option v-if="item.subjectType === subjectType.Skill || item.subjectType === subjectType.LearnAndSkill" :value="item.id" :key="item.id" v-for="item in subjectList">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item label="grade" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="gradeIds">
          <a-select
            :getPopupContainer="trigger => trigger.parentElement"
            mode="multiple"
            @change="handleChangeGrade"
            v-model="model.gradeIds"
            placeholder="Please select grade"
            :readonly="true" >
            <a-select-option :value="item.id" :key="item.id" v-for="item in gradeListAll">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item label="parent" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="parent">
          <j-tree-select
            ref="treeSelect"
            placeholder="Please select parent"
            v-model="model.parentId"
            dict="cc_knowledge,name,id"
            pidField="parent_id"
            pidValue="0"
            hasChildField="has_child"
            :condition="condition"
          >
          </j-tree-select>
        </a-form-model-item>

        <a-form-model-item label="branch or Description" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="name">
          <a-textarea rows="3" v-model="model.name" placeholder="Please input description" ></a-textarea>
        </a-form-model-item>

      </a-form-model>
    </a-spin>
  </j-modal>
</template>

<script>

import { httpAction } from '@/api/manage'
import JModal from '@/components/jeecg/JModal'
import JTreeSelect from '@/components/jeecg/JTreeSelect'
import { SubjectType, TagType } from '@/const/common'
export default {
  name: 'KnowledgeModal',
  components: {
    JModal, JTreeSelect
  },
  props: {
    subjectList: {
      type: Array,
      default: () => []
    },
    gradeList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      gradeListAll: this.gradeList,
      title: 'Edit',
      width: 800,
      condition: {},
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
          { required: true, message: 'Please input description!' }
        ],
        gradeId: [
          { required: true, message: 'Please select grade!' }
        ]
      },
      url: {
        add: '/classcipe/api/knowledge/addOrUpdate',
        edit: '/classcipe/api/knowledge/addOrUpdate'
      },
      expandedRowKeys: [],
      pidField: 'parentId',
      subjectType: SubjectType

    }
  },
  created () {
    // 备份model原始值
    this.modelDefault = JSON.parse(JSON.stringify(this.model))
  },
  methods: {
    add (obj) {
      console.log(obj)
      this.modelDefault.parentId = ''
      this.modelDefault.curriculumId = this.$store.getters.bindCurriculum
      this.modelDefault.tagType = TagType.skill
      this.edit(Object.assign(this.modelDefault, obj))
    },
    edit (record) {
      console.log(record)
      this.gradeListAll = this.gradeList
      this.model = Object.assign({}, record)
      this.condition = JSON.stringify({ 'curriculum_id': this.model.curriculumId, 'subject_id': this.model.subjectId, 'tag_type': TagType.ibSkill, 'del_flag': 0 })
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
          if (this.model.id && this.model.id === this.model[this.pidField]) {
            that.$message.warning('The parent node cannot choose itself')
            that.confirmLoading = false
            return
          }
          httpAction(httpurl, this.model, method).then((res) => {
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
    handleChangeGrade (value) {
      this.model.parentId = ''
    },
    submitSuccess (formData, flag) {
      if (!formData.id) {
        const treeData = this.$refs.treeSelect.getCurrTreeData()
        this.expandedRowKeys = []
        this.getExpandKeysByPid(formData[this.pidField], treeData, treeData)
        this.$emit('ok', formData, this.expandedRowKeys.reverse())
      } else {
        this.$emit('ok', formData, flag)
      }
    }

  }
}
</script>
