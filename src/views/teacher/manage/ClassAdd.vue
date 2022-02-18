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
        <a-form-model ref="form" :model="model" :rules="validatorRules" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
          <a-row>
            <a-col :span="24">
              <a-form-model-item label="Class Name" prop="name">
                <a-input v-model="model.name" placeholder="Please input name" ></a-input>
              </a-form-model-item>

              <a-col :span="24">
                <a-form-model-item label="Class Type" prop="classType">
                  <a-select :allowClear="true" v-model="model.classType" placeholder="Select classType" >
                    <a-select-option :value="0">Standard-Class</a-select-option>
                    <a-select-option :value="1">Subject-focused Class</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>

              <a-col :span="24">

                <a-form-model-item label="Home Teacher/Subject Coordinator" prop="headTeacherId">
                  <a-select :allowClear="true" v-model="model.headTeacherId" placeholder="Select teacher" >
                    <a-select-option :value="item.userInfo.id" :key="item.userInfo.id" v-for="item in teacherList">{{ item.userInfo.nickname }}</a-select-option>
                  </a-select>
                </a-form-model-item>

                <!--                <a-form-model-item label="Teacher" prop="teacher">-->
                <!--                  <a-select-->
                <!--                    mode="multiple"-->
                <!--                    :allowClear="true"-->
                <!--                    v-model="teacherIds"-->
                <!--                    @change="changeTeacher"-->
                <!--                    placeholder="Select teacher" >-->
                <!--                    <a-select-option :value="item.userInfo.id" :key="item.userInfo.id" v-for="item in teacherList">{{ item.userInfo.nickname }}</a-select-option>-->
                <!--                  </a-select>-->
                <!--                </a-form-model-item>-->

                <!--                <a-form-model-item label="Teacher" prop="teacherIds" >-->
                <!--                  <a-select mode="multiple" v-model="model.teacherIds" placeholder="Select teacher" :filter-option="filterOption" >-->
                <!--                    <a-select-option :value="item.userInfo.id" :key="item.userInfo.id" v-for="item in teacherList">{{ item.userInfo.nickname }}</a-select-option>-->
                <!--                  </a-select>-->
                <!--                </a-form-model-item>-->

              </a-col>

              <a-col :span="24">
                <a-form-model-item label="Grade" prop="gradeId">
                  <a-select :allowClear="true" v-model="model.gradeId" placeholder="Select grade" >
                    <a-select-option :value="item.id" :key="item.id" v-for="item in gradeList">{{ item.name }}</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>

              <a-col :span="24">
                <a-form-model-item label="Class Roster">
                  <div style="display: flex;align-items: baseline;">
                    <a-upload :file-list="fileList" :remove="handleRemove" :before-upload="beforeUpload" style="margin-right: 20px">
                      <a-button> <a-icon type="upload" /> Upload </a-button>
                    </a-upload>
                    <a-button type="primary" icon="download" @click="downloadTemplate">Download template</a-button>
                  </div>
                </a-form-model-item>
              </a-col>

              <a-col :span="24">
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
import { httpAction, uploadAction } from '@/api/manage'
import { schoolClassAPIUrl } from '@/api/schoolClass'
import store from '@/store'
import { schoolClassStudentAPIUrl } from '@/api/schoolClassStudent'

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
      fileList: [],
      uploading: false
    }
  },
  created() {
    // 备份model原始值
    this.modelDefault = JSON.parse(JSON.stringify(this.model))
  },
  computed: {
    validatorRules() {
      var res = {
        name: [
          { required: true, message: 'Please input class name!' }
        ],
        classType: [
          { required: true, message: 'Please select class type!' }
        ],
        teacherIds: [
          { required: true, message: 'Please select teacher!' },
          { validator: this.handleTeacherIds }
        ]
      }
      if (this.model.classType === 0) {
        res.gradeId = [{ required: true, message: 'Please select grade!' }]
      } else {
        res.subject = [{ required: true, message: 'Please select subject!' }]
      }
      return res
    }
  },
  methods: {
    // 判断登录类型
    handleTeacherIds (rule, value, callback) {
      callback()
    },
    add () {
      this.mode = 'add'
      // 初始化默认值
      this.edit({ classType: 0, schoolId: store.getters.userInfo.school })
    },
    edit (record) {
      this.model = Object.assign({}, record)
      this.mode = 'update'
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
              this.model.id = res.result.id
              if (this.fileList.length > 0) {
                  this.handleUpload()
              } else {
                that.$message.success(res.message)
                this.$emit('ok')
                that.confirmLoading = false
                that.close()
              }
            } else {
              that.$message.warning(res.message)
            }
          })
        } else {
          return false
        }
      })
    },
    handleUpload() {
      const formData = new FormData()
      formData.append('file', this.fileList[0])
      formData.append('classId', this.model.id)
      this.uploading = true
      const that = this
      uploadAction(schoolClassStudentAPIUrl.SchoolClassStudentImportExcel, formData).then((res) => {
        this.uploading = false
        if (res.success) {
          this.$message.success(res.message)
          this.$emit('ok')
        } else {
          this.$message.warning(res.message)
        }
      }).finally(() => {
        that.confirmLoading = false
        that.close()
        this.fileList = []
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
      const url = 'https://dev.classcipe.com/classcipe/excel/student.xlsx'
      link.href = url
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link) // 下载完成移除元素
      window.URL.revokeObjectURL(url) // 释放掉blob对象
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
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
