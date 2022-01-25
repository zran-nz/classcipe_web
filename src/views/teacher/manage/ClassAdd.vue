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
      :okText="mode === 'add' ? 'Add' : 'Save'"
    >
      <a-spin :spinning="confirmLoading">
        <a-form-model ref="form" :model="model" :rules="validatorRules" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
          <a-row>
            <a-col :span="24">
              <a-form-model-item label="Class Name" prop="name">
                <a-input v-model="model.name" placeholder="Please input name" ></a-input>
              </a-form-model-item>

              <a-col :span="24">
                <a-form-model-item label="Class Type" prop="classType">
                  <a-select :allowClear="true" v-model="model.classType" placeholder="Select classType" >
                    <a-select-option :value="0">Standard-Class</a-select-option>
                    <a-select-option :value="1">Subject-Forcused Class</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>

              <a-col :span="24">
                <a-form-model-item label="Teacher" prop="headTeacherId">
                  <a-select :allowClear="true" v-model="model.headTeacherId" placeholder="Select teacher" >
                    <a-select-option :value="item.userInfo.id" :key="item.userInfo.id" v-for="item in teacherList">{{ item.userInfo.nickname }}</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>

              <a-col :span="24">
                <a-form-model-item label="Grade" prop="grade">
                  <a-select :allowClear="true" v-model="model.gradeId" placeholder="Select grade" >
                    <a-select-option :value="item.id" :key="item.id" v-for="item in gradeList">{{ item.name }}</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>

              <a-col :span="24">
                <a-form-model-item label="Class Roster">
                  <div style="display: flex;align-items: baseline;">
                    <a-upload :file-list="fileList" :remove="handleRemove" :before-upload="beforeUpload" style="margin-right: 20px">
                      <a-button> <a-icon type="upload" /> Uplad </a-button>
                    </a-upload>
                    <a-button type="primary" icon="download" @click="downloadTemplate">Download template</a-button>
                  </div>
                </a-form-model-item>
              </a-col>

              <a-col :span="24" v-if="model.classType === 1">
                <a-form-model-item label="Subject" prop="subject">
                  <a-select :allowClear="true" v-model="model.subject" placeholder="Select subject" >
                    <a-select-option :value="item.id" :key="item.id" v-for="item in subjectList">{{ item.name }}</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>

            </a-col>
          </a-row>
        </a-form-model>
      </a-spin>
    </j-modal>
  </a-card>
</template>

<script>
import JModal from '@/components/jeecg/JModal'
import { httpAction } from '@/api/manage'
import { schoolClassAPIUrl } from '@/api/schoolClass'
import store from '@/store'

export default {
  name: 'TermAdd',
  mixins: [],
  components: {
    JModal
  },
  props: {
    gradeList: {
      type: Array,
      default: () => []
    },
    teacherList: {
      type: Array,
      default: () => []
    },
    subjectList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      title: 'Add Class',
      mode: 'add',
      width: 800,
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this, { name: 'classAdd' }),
      model: {},
      validatorRules: {
        name: [
          { required: true, message: 'Please input class name!' }
        ],
        classType: [
          { required: true, message: 'Please select class type!' }
        ],
        headTeacherId: [
          { required: true, message: 'Please select teacher!' }
        ],
        gradeId: [
          { required: true, message: 'Please select grade!' }
        ]
      },
      fileList: [],
      uploading: false
    }
  },
  created() {
    // 备份model原始值
    this.modelDefault = JSON.parse(JSON.stringify(this.model))
  },
  computed: {

  },
  methods: {
    add () {
      // 初始化默认值
      this.edit({ classType: 0, schoolId: store.getters.userInfo.school })
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
    handleOk() {
      const that = this
      // 触发表单验证
      this.$refs.form.validate(valid => {
        if (valid) {
          that.confirmLoading = true
          httpAction(schoolClassAPIUrl.SchoolClassAddOrUpdate, this.model, 'post').then((res) => {
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
    handleCancel() {
      this.visible = false
      this.confirmLoading = false
    },
    handleRemove(file) {
      this.fileList = []
    },
    beforeUpload(file) {
      this.fileList = [file]
      return false
    },
    downloadTemplate () {
      const link = document.createElement('a')
      link.style.display = 'none'
      const url = this.baseUrl + '/classcipe/excel/knowledge_template_example.xlsx'
      link.href = url
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link) // 下载完成移除元素
      window.URL.revokeObjectURL(url) // 释放掉blob对象
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
